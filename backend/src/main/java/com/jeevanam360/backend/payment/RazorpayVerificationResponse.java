package com.jeevanam360.backend.payment;

public record RazorpayVerificationResponse(
    boolean verified,
    String status,
    String orderId,
    String paymentId,
    String message
) {
}