package com.jeevanam360.backend.payment;

public record AdminPaymentDecisionRequest(
    String status,
    String note
) {
}
