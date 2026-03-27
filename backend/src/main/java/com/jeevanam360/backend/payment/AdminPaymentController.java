package com.jeevanam360.backend.payment;

import java.util.List;

import com.jeevanam360.backend.security.AuthenticatedUser;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/admin/payment-requests")
@PreAuthorize("hasRole('ADMIN')")
public class AdminPaymentController {

    private final PaymentRequestService paymentRequestService;

    public AdminPaymentController(PaymentRequestService paymentRequestService) {
        this.paymentRequestService = paymentRequestService;
    }

    @GetMapping
    public ResponseEntity<List<PaymentRequestResponse>> getAll(
        @RequestParam(name = "status", required = false) String status
    ) {
        return ResponseEntity.ok(paymentRequestService.getAll(status));
    }

    @PostMapping("/{paymentRequestId}/status")
    public ResponseEntity<PaymentRequestResponse> updateStatus(
        @PathVariable String paymentRequestId,
        @Valid @RequestBody AdminPaymentDecisionRequest request,
        Authentication authentication
    ) {
        try {
            AuthenticatedUser currentUser = (AuthenticatedUser) authentication.getPrincipal();
            return ResponseEntity.ok(paymentRequestService.updateStatus(paymentRequestId, request, currentUser));
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, exception.getMessage(), exception);
        }
    }

    @PostMapping("/{paymentRequestId}/approve")
    public ResponseEntity<PaymentRequestResponse> approve(
        @PathVariable String paymentRequestId,
        @Valid @RequestBody AdminPaymentDecisionRequest request,
        Authentication authentication
    ) {
        try {
            AuthenticatedUser currentUser = (AuthenticatedUser) authentication.getPrincipal();
            return ResponseEntity.ok(paymentRequestService.approve(paymentRequestId, request, currentUser));
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, exception.getMessage(), exception);
        }
    }

    @PostMapping("/{paymentRequestId}/reject")
    public ResponseEntity<PaymentRequestResponse> reject(
        @PathVariable String paymentRequestId,
        @Valid @RequestBody AdminPaymentDecisionRequest request,
        Authentication authentication
    ) {
        try {
            AuthenticatedUser currentUser = (AuthenticatedUser) authentication.getPrincipal();
            return ResponseEntity.ok(paymentRequestService.reject(paymentRequestId, request, currentUser));
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, exception.getMessage(), exception);
        }
    }
}
