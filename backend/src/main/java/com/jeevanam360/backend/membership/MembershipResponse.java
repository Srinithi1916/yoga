package com.jeevanam360.backend.membership;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

public record MembershipResponse(
    String id,
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
    public static MembershipResponse from(MembershipRecord membership) {
        long daysRemaining = membership.getEndAt() == null
            ? 0
            : Math.max(0, ChronoUnit.DAYS.between(Instant.now(), membership.getEndAt()));

        int progressPercent = calculateProgress(membership);
        List<MembershipDailyProgressEntry> dailyProgressEntries = membership.getDailyProgressEntries() == null
            ? List.of()
            : List.copyOf(membership.getDailyProgressEntries());

        return new MembershipResponse(
            membership.getId(),
            membership.getPlanKey(),
            membership.getPlanTitle(),
            membership.getPlanDescription(),
            membership.getPlanPrice(),
            membership.getDurationDays(),
            membership.getFeatures(),
            membership.getWorkflowSteps(),
            membership.getStatus(),
            membership.getStartAt(),
            membership.getEndAt(),
            daysRemaining,
            progressPercent,
            membership.getTargetSessions(),
            membership.getCompletedSessions(),
            membership.getTargetConsultations(),
            membership.getCompletedConsultations(),
            membership.getTargetDietCheckIns(),
            membership.getCompletedDietCheckIns(),
            membership.getTargetMeditations(),
            membership.getCompletedMeditations(),
            membership.getLatestNote(),
            dailyProgressEntries,
            membership.getUpdatedAt()
        );
    }

    private static int calculateProgress(MembershipRecord membership) {
        int trackedAreas = 0;
        int progressTotal = 0;

        if (membership.getTargetSessions() > 0) {
            trackedAreas++;
            progressTotal += Math.min(100, percentage(membership.getCompletedSessions(), membership.getTargetSessions()));
        }
        if (membership.getTargetConsultations() > 0) {
            trackedAreas++;
            progressTotal += Math.min(100, percentage(membership.getCompletedConsultations(), membership.getTargetConsultations()));
        }
        if (membership.getTargetDietCheckIns() > 0) {
            trackedAreas++;
            progressTotal += Math.min(100, percentage(membership.getCompletedDietCheckIns(), membership.getTargetDietCheckIns()));
        }
        if (membership.getTargetMeditations() > 0) {
            trackedAreas++;
            progressTotal += Math.min(100, percentage(membership.getCompletedMeditations(), membership.getTargetMeditations()));
        }

        return trackedAreas == 0 ? 0 : Math.round((float) progressTotal / trackedAreas);
    }

    private static int percentage(int value, int target) {
        return target <= 0 ? 0 : Math.round((value * 100f) / target);
    }
}
