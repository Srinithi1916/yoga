package com.jeevanam360.backend.auth;

import java.time.Instant;
import java.util.Locale;

public record AdminUserSummaryResponse(
    String id,
    String name,
    String email,
    String phone,
    String role,
    boolean active,
    Instant createdAt,
    String currentPlanTitle,
    String currentPlanStatus,
    String latestPaymentPlan,
    String latestPaymentPrice,
    String latestPaymentStatus
) {

    public static String normalizeStatus(String value) {
        if (value == null || value.isBlank()) {
            return value;
        }

        String normalized = value.trim().toUpperCase(Locale.ENGLISH);
        if ("PENDING".equals(normalized)) {
            return "PENDING_REVIEW";
        }

        return normalized;
    }
}
