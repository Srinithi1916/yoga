package com.jeevanam360.backend.payment;

import java.math.BigDecimal;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record RazorpayOrderRequest(
    @NotBlank String selectedPlan,
    @NotBlank String planPrice,
    @NotNull @Positive BigDecimal amount,
    String currency,
    String customerName,
    @Email String customerEmail,
    String customerWhatsapp
) {
}