package com.jeevanam360.backend.payment;

import jakarta.validation.constraints.NotBlank;

public record RazorpayVerificationRequest(
    @NotBlank String orderId,
    @NotBlank String razorpayOrderId,
    @NotBlank String razorpayPaymentId,
    @NotBlank String razorpaySignature
) {
}