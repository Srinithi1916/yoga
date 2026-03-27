package com.jeevanam360.backend.membership;

import java.util.List;

public record PlanDefinition(
    String key,
    String title,
    String description,
    String priceLabel,
    int durationDays,
    List<String> features,
    List<String> workflowSteps,
    int targetSessions,
    int targetConsultations,
    int targetDietCheckIns,
    int targetMeditations
) {
}
