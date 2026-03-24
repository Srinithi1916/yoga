package com.jeevanam360.backend.contact;

import java.math.BigDecimal;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ContactMessageRequest(
    @NotBlank String name,
    @NotBlank @Email String email,
    @NotBlank String whatsapp,
    String selectedPlan,
    String planPrice,
    BigDecimal amount,
    @NotBlank String message,
    String source
) {
}