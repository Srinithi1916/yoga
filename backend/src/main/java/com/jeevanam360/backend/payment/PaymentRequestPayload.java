package com.jeevanam360.backend.payment;

import java.math.BigDecimal;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record PaymentRequestPayload(
    @NotBlank String name,
    @NotBlank @Email String email,
    @NotBlank String whatsapp,
    @NotBlank String selectedPlan,
    String planPrice,
    @NotBlank String paymentMethod,
    @NotBlank String transactionReference,
    BigDecimal amount,
    String currency,
    String note
) {
}
