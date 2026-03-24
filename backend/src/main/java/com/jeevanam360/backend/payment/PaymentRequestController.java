package com.jeevanam360.backend.payment;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/payment-requests")
public class PaymentRequestController {

    private final PaymentRequestService paymentRequestService;

    public PaymentRequestController(PaymentRequestService paymentRequestService) {
        this.paymentRequestService = paymentRequestService;
    }

    @PostMapping
    public ResponseEntity<PaymentRequestResponse> create(@Valid @RequestBody PaymentRequestPayload payload) {
        PaymentRequestRecord saved = paymentRequestService.create(payload);
        return ResponseEntity.status(HttpStatus.CREATED).body(PaymentRequestResponse.from(saved));
    }
}
