package com.jeevanam360.backend.payment;

import java.math.BigDecimal;
import java.time.Instant;

import org.springframework.stereotype.Service;

@Service
public class PaymentRequestService {

    private final PaymentRequestRepository paymentRequestRepository;

    public PaymentRequestService(PaymentRequestRepository paymentRequestRepository) {
        this.paymentRequestRepository = paymentRequestRepository;
    }

    public PaymentRequestRecord create(PaymentRequestPayload payload) {
        PaymentRequestRecord paymentRequest = new PaymentRequestRecord();
        paymentRequest.setName(payload.name().trim());
        paymentRequest.setEmail(payload.email().trim());
        paymentRequest.setWhatsapp(payload.whatsapp().trim());
        paymentRequest.setSelectedPlan(payload.selectedPlan().trim());
        paymentRequest.setPlanPrice(trimToNull(payload.planPrice()));
        paymentRequest.setAmount(payload.amount());
        paymentRequest.setCurrency(resolveCurrency(payload.currency()));
        paymentRequest.setStatus("PENDING");
        paymentRequest.setProvider("MANUAL");
        paymentRequest.setNote(trimToNull(payload.note()));
        paymentRequest.setCreatedAt(Instant.now());
        return paymentRequestRepository.save(paymentRequest);
    }

    public PaymentRequestRecord createRazorpayOrderRecord(RazorpayOrderRequest payload, String gatewayOrderId) {
        PaymentRequestRecord paymentRequest = new PaymentRequestRecord();
        paymentRequest.setName(trimToNull(payload.customerName()));
        paymentRequest.setEmail(trimToNull(payload.customerEmail()));
        paymentRequest.setWhatsapp(trimToNull(payload.customerWhatsapp()));
        paymentRequest.setSelectedPlan(payload.selectedPlan().trim());
        paymentRequest.setPlanPrice(trimToNull(payload.planPrice()));
        paymentRequest.setAmount(payload.amount());
        paymentRequest.setCurrency(resolveCurrency(payload.currency()));
        paymentRequest.setStatus("CREATED");
        paymentRequest.setProvider("RAZORPAY");
        paymentRequest.setGatewayOrderId(gatewayOrderId);
        paymentRequest.setNote("Created from Razorpay checkout.");
        paymentRequest.setCreatedAt(Instant.now());
        return paymentRequestRepository.save(paymentRequest);
    }

    public PaymentRequestRecord markRazorpayPaymentVerified(
        String gatewayOrderId,
        String gatewayPaymentId,
        String gatewaySignature
    ) {
        PaymentRequestRecord paymentRequest = paymentRequestRepository.findByGatewayOrderId(gatewayOrderId)
            .orElseThrow(() -> new IllegalArgumentException("No payment record was found for the Razorpay order."));

        paymentRequest.setGatewayPaymentId(trimToNull(gatewayPaymentId));
        paymentRequest.setGatewaySignature(trimToNull(gatewaySignature));
        paymentRequest.setStatus("PAID");
        paymentRequest.setVerifiedAt(Instant.now());
        return paymentRequestRepository.save(paymentRequest);
    }

    private String resolveCurrency(String currency) {
        String normalized = trimToNull(currency);
        return normalized == null ? "INR" : normalized;
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}