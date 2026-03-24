package com.jeevanam360.backend.payment;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/payments/razorpay")
public class RazorpayOrderController {

    private final RazorpayService razorpayService;

    public RazorpayOrderController(RazorpayService razorpayService) {
        this.razorpayService = razorpayService;
    }

    @PostMapping("/order")
    public ResponseEntity<RazorpayOrderResponse> createOrder(@Valid @RequestBody RazorpayOrderRequest payload) {
        try {
            RazorpayOrderResponse response = razorpayService.createOrder(payload);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, exception.getMessage(), exception);
        } catch (IllegalStateException exception) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, exception.getMessage(), exception);
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<RazorpayVerificationResponse> verifyPayment(
        @Valid @RequestBody RazorpayVerificationRequest payload
    ) {
        try {
            RazorpayVerificationResponse response = razorpayService.verifyPayment(payload);
            HttpStatus status = response.verified() ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
            return ResponseEntity.status(status).body(response);
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, exception.getMessage(), exception);
        } catch (IllegalStateException exception) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, exception.getMessage(), exception);
        }
    }
}