package com.jeevanam360.backend.payment;

import java.io.IOException;
import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Service
public class RazorpayService {

    private static final URI RAZORPAY_ORDERS_URI = URI.create("https://api.razorpay.com/v1/orders");
    private static final String BRAND_NAME = "Jeevanam 360";

    private final String keyId;
    private final String keySecret;
    private final ObjectMapper objectMapper;
    private final PaymentRequestService paymentRequestService;
    private final HttpClient httpClient;

    public RazorpayService(
        @Value("${razorpay.key-id:}") String keyId,
        @Value("${razorpay.key-secret:}") String keySecret,
        ObjectMapper objectMapper,
        PaymentRequestService paymentRequestService
    ) {
        this.keyId = keyId == null ? "" : keyId.trim();
        this.keySecret = keySecret == null ? "" : keySecret.trim();
        this.objectMapper = objectMapper;
        this.paymentRequestService = paymentRequestService;
        this.httpClient = HttpClient.newHttpClient();
    }

    public RazorpayOrderResponse createOrder(RazorpayOrderRequest payload) {
        ensureConfigured();

        try {
            long amountInPaise = toPaise(payload.amount());
            String currency = resolveCurrency(payload.currency());
            ObjectNode requestBody = objectMapper.createObjectNode();
            requestBody.put("amount", amountInPaise);
            requestBody.put("currency", currency);
            requestBody.put("receipt", createReceipt());
            ObjectNode notes = requestBody.putObject("notes");
            notes.put("selectedPlan", payload.selectedPlan());
            notes.put("planPrice", payload.planPrice());
            notes.put("brand", BRAND_NAME);

            HttpRequest request = HttpRequest.newBuilder(RAZORPAY_ORDERS_URI)
                .header("Authorization", basicAuthHeader())
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(requestBody)))
                .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            JsonNode body = objectMapper.readTree(response.body());

            if (response.statusCode() >= 400) {
                throw new IllegalStateException(readRazorpayError(body));
            }

            String orderId = body.path("id").asText();
            if (orderId.isBlank()) {
                throw new IllegalStateException("Razorpay did not return an order id.");
            }

            paymentRequestService.createRazorpayOrderRecord(payload, orderId);

            return new RazorpayOrderResponse(
                keyId,
                orderId,
                body.path("amount").asLong(amountInPaise),
                body.path("currency").asText(currency),
                BRAND_NAME,
                payload.selectedPlan()
            );
        } catch (IOException | InterruptedException exception) {
            if (exception instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            throw new IllegalStateException("Razorpay order creation failed.", exception);
        }
    }

    public RazorpayVerificationResponse verifyPayment(RazorpayVerificationRequest payload) {
        ensureConfigured();

        if (!payload.orderId().equals(payload.razorpayOrderId())) {
            return new RazorpayVerificationResponse(
                false,
                "FAILED",
                payload.orderId(),
                payload.razorpayPaymentId(),
                "The returned Razorpay order id does not match the original order."
            );
        }

        String generatedSignature = generateSignature(payload.orderId(), payload.razorpayPaymentId());
        boolean verified = generatedSignature.equals(payload.razorpaySignature());

        if (!verified) {
            return new RazorpayVerificationResponse(
                false,
                "FAILED",
                payload.orderId(),
                payload.razorpayPaymentId(),
                "The Razorpay payment signature could not be verified."
            );
        }

        paymentRequestService.markRazorpayPaymentVerified(
            payload.orderId(),
            payload.razorpayPaymentId(),
            payload.razorpaySignature()
        );

        return new RazorpayVerificationResponse(
            true,
            "PAID",
            payload.orderId(),
            payload.razorpayPaymentId(),
            "Payment verified successfully."
        );
    }

    private void ensureConfigured() {
        if (keyId.isBlank() || keySecret.isBlank()) {
            throw new IllegalStateException("Razorpay keys are not configured on the backend.");
        }
    }

    private String resolveCurrency(String currency) {
        if (currency == null || currency.isBlank()) {
            return "INR";
        }
        return currency.trim();
    }

    private long toPaise(BigDecimal amount) {
        return amount.movePointRight(2).longValueExact();
    }

    private String createReceipt() {
        return "j360-" + Instant.now().toEpochMilli();
    }

    private String basicAuthHeader() {
        String value = keyId + ":" + keySecret;
        return "Basic " + Base64.getEncoder().encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }

    private String readRazorpayError(JsonNode body) {
        String errorMessage = body.path("error").path("description").asText();
        if (!errorMessage.isBlank()) {
            return errorMessage;
        }
        return "Razorpay order creation failed.";
    }

    private String generateSignature(String orderId, String paymentId) {
        try {
            Mac sha256Hmac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(keySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256Hmac.init(secretKey);
            byte[] digest = sha256Hmac.doFinal((orderId + "|" + paymentId).getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (Exception exception) {
            throw new IllegalStateException("Razorpay signature generation failed.", exception);
        }
    }
}