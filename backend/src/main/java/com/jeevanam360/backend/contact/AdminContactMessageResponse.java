package com.jeevanam360.backend.contact;

import java.math.BigDecimal;
import java.time.Instant;

public record AdminContactMessageResponse(
    String id,
    String name,
    String email,
    String whatsapp,
    String selectedPlan,
    String planPrice,
    BigDecimal amount,
    String message,
    String source,
    Instant createdAt
) {
    public static AdminContactMessageResponse from(ContactMessage message) {
        return new AdminContactMessageResponse(
            message.getId(),
            message.getName(),
            message.getEmail(),
            message.getWhatsapp(),
            message.getSelectedPlan(),
            message.getPlanPrice(),
            message.getAmount(),
            message.getMessage(),
            message.getSource(),
            message.getCreatedAt()
        );
    }
}
