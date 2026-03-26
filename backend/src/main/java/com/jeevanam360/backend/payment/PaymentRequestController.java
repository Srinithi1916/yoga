package com.jeevanam360.backend.payment;

import com.jeevanam360.backend.security.AuthenticatedUser;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payment-requests")
public class PaymentRequestController {

    private final PaymentRequestService paymentRequestService;

    public PaymentRequestController(PaymentRequestService paymentRequestService) {
        this.paymentRequestService = paymentRequestService;
    }

    @PostMapping
    public ResponseEntity<PaymentRequestResponse> create(
        @Valid @RequestBody PaymentRequestPayload payload,
        Authentication authentication
    ) {
        AuthenticatedUser currentUser = (AuthenticatedUser) authentication.getPrincipal();
        PaymentRequestRecord saved = paymentRequestService.create(payload, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(PaymentRequestResponse.from(saved));
    }
}
