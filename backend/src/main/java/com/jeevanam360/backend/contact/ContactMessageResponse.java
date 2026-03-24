package com.jeevanam360.backend.contact;

import java.math.BigDecimal;
import java.time.Instant;

public record ContactMessageResponse(
    String id,
    String name,
    String email,
    String whatsapp,
    String selectedPlan,
    String planPrice,
    BigDecimal amount,
    String message,
    String source,
    Instant createdAt,
    boolean stored,
    String storageStatus,
    boolean emailSent,
    String emailStatus
) {
    public static ContactMessageResponse from(
        ContactMessage message,
        boolean stored,
        String storageStatus,
        ContactEmailResult emailResult
    ) {
        return new ContactMessageResponse(
            message.getId(),
            message.getName(),
            message.getEmail(),
            message.getWhatsapp(),
            message.getSelectedPlan(),
            message.getPlanPrice(),
            message.getAmount(),
            message.getMessage(),
            message.getSource(),
            message.getCreatedAt(),
            stored,
            storageStatus,
            emailResult.emailSent(),
            emailResult.emailStatus()
        );
    }
}