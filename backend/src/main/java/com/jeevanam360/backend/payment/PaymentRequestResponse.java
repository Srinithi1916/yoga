package com.jeevanam360.backend.payment;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Locale;

public record PaymentRequestResponse(
    String id,
    String name,
    String email,
    String whatsapp,
    String selectedPlan,
    String planPrice,
    String paymentMethod,
    String transactionReference,
    BigDecimal amount,
    String currency,
    String status,
    String provider,
    String note,
    String reviewedBy,
    Instant createdAt,
    Instant reviewedAt,
    Instant verifiedAt
) {
    public static PaymentRequestResponse from(PaymentRequestRecord paymentRequest) {
        return new PaymentRequestResponse(
            paymentRequest.getId(),
            paymentRequest.getName(),
            paymentRequest.getEmail(),
            paymentRequest.getWhatsapp(),
            paymentRequest.getSelectedPlan(),
            paymentRequest.getPlanPrice(),
            paymentRequest.getPaymentMethod(),
            paymentRequest.getTransactionReference(),
            paymentRequest.getAmount(),
            paymentRequest.getCurrency(),
            normalizeStatus(paymentRequest.getStatus()),
            paymentRequest.getProvider(),
            paymentRequest.getNote(),
            paymentRequest.getReviewedBy(),
            paymentRequest.getCreatedAt(),
            paymentRequest.getReviewedAt(),
            paymentRequest.getVerifiedAt()
        );
    }

    private static String normalizeStatus(String status) {
        if (status == null || status.isBlank()) {
            return status;
        }

        String normalized = status.trim().toUpperCase(Locale.ENGLISH);
        if ("PENDING".equals(normalized)) {
            return "PENDING_REVIEW";
        }

        return normalized;
    }
}
