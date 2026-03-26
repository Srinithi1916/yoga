package com.jeevanam360.backend.review;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record ReviewWriteRequest(
    @NotBlank String itemName,
    @NotBlank String itemType,
    @Min(1) @Max(5) int rating,
    @NotBlank String title,
    @NotBlank String comment
) {
}
