package com.jeevanam360.backend.membership;

import java.time.Instant;
import java.util.List;

public record AdminMembershipDetailResponse(
    String id,
    String userId,
    String userName,
    String userEmail,
    String planKey,
    String planTitle,
    String planDescription,
    String planPrice,
    int durationDays,
    List<String> features,
    List<String> workflowSteps,
    String status,
    Instant startAt,
    Instant endAt,
    long daysRemaining,
    int progressPercent,
    int targetSessions,
    int completedSessions,
    int targetConsultations,
    int completedConsultations,
    int targetDietCheckIns,
    int completedDietCheckIns,
    int targetMeditations,
    int completedMeditations,
    String latestNote,
    List<MembershipDailyProgressEntry> dailyProgressEntries,
    Instant updatedAt
) {
    public static AdminMembershipDetailResponse from(MembershipRecord membership) {
        MembershipResponse response = MembershipResponse.from(membership);
        return new AdminMembershipDetailResponse(
            response.id(),
            membership.getUserId(),
            membership.getUserName(),
            membership.getUserEmail(),
            response.planKey(),
            response.planTitle(),
            response.planDescription(),
            response.planPrice(),
            response.durationDays(),
            response.features(),
            response.workflowSteps(),
            response.status(),
            response.startAt(),
            response.endAt(),
            response.daysRemaining(),
            response.progressPercent(),
            response.targetSessions(),
            response.completedSessions(),
            response.targetConsultations(),
            response.completedConsultations(),
            response.targetDietCheckIns(),
            response.completedDietCheckIns(),
            response.targetMeditations(),
            response.completedMeditations(),
            response.latestNote(),
            response.dailyProgressEntries(),
            response.updatedAt()
        );
    }
}
