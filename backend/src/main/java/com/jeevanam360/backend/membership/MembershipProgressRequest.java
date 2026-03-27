package com.jeevanam360.backend.membership;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record MembershipProgressRequest(
    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "entryDate must use yyyy-MM-dd format") String entryDate,
    Boolean sessionCompleted,
    Boolean consultationCompleted,
    Boolean dietCheckInCompleted,
    Boolean meditationCompleted,
    @Min(0) @Max(3650) Integer completedSessions,
    @Min(0) @Max(3650) Integer completedConsultations,
    @Min(0) @Max(3650) Integer completedDietCheckIns,
    @Min(0) @Max(3650) Integer completedMeditations,
    @Size(max = 600) String latestNote
) {
}
