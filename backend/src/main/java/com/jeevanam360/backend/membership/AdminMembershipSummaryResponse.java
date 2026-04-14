package com.jeevanam360.backend.membership;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

public record AdminMembershipSummaryResponse(
    String id,
    String userId,
    String userName,
    String userEmail,
    String planKey,
    String planTitle,
    String planPrice,
    String status,
    Instant startAt,
    Instant endAt,
    long daysRemaining,
    int progressPercent,
    Instant updatedAt
) {
    public static AdminMembershipSummaryResponse from(MembershipRecord membership) {
        long daysRemaining = membership.getEndAt() == null
            ? 0
            : Math.max(0, ChronoUnit.DAYS.between(Instant.now(), membership.getEndAt()));

        return new AdminMembershipSummaryResponse(
            membership.getId(),
            membership.getUserId(),
            membership.getUserName(),
            membership.getUserEmail(),
            membership.getPlanKey(),
            membership.getPlanTitle(),
            membership.getPlanPrice(),
            membership.getStatus(),
            membership.getStartAt(),
            membership.getEndAt(),
            daysRemaining,
            MembershipResponse.from(membership).progressPercent(),
            membership.getUpdatedAt()
        );
    }
}
