package com.jeevanam360.backend.payment;

import java.math.BigDecimal;
import java.time.Instant;

public record PaymentRequestResponse(
    String id,
    String name,
    String email,
    String whatsapp,
    String selectedPlan,
    String planPrice,
    BigDecimal amount,
    String currency,
    String status,
    String note,
    Instant createdAt
) {
    public static PaymentRequestResponse from(PaymentRequestRecord paymentRequest) {
        return new PaymentRequestResponse(
            paymentRequest.getId(),
            paymentRequest.getName(),
            paymentRequest.getEmail(),
            paymentRequest.getWhatsapp(),
            paymentRequest.getSelectedPlan(),
            paymentRequest.getPlanPrice(),
            paymentRequest.getAmount(),
            paymentRequest.getCurrency(),
            paymentRequest.getStatus(),
            paymentRequest.getNote(),
            paymentRequest.getCreatedAt()
        );
    }
}
