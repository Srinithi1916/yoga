package com.jeevanam360.backend.payment;

public record RazorpayOrderResponse(
    String keyId,
    String orderId,
    long amount,
    String currency,
    String name,
    String description
) {
}