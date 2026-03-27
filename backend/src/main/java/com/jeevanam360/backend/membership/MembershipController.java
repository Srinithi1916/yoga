package com.jeevanam360.backend.membership;

import com.jeevanam360.backend.security.AuthenticatedUser;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/memberships")
public class MembershipController {

    private final MembershipService membershipService;

    public MembershipController(MembershipService membershipService) {
        this.membershipService = membershipService;
    }

    @GetMapping("/me")
    public ResponseEntity<MembershipResponse> getMine(Authentication authentication) {
        AuthenticatedUser currentUser = (AuthenticatedUser) authentication.getPrincipal();
        return ResponseEntity.ok(membershipService.getCurrentMembership(currentUser));
    }

    @PutMapping("/me/progress")
    public ResponseEntity<MembershipResponse> updateProgress(
        @Valid @RequestBody MembershipProgressRequest request,
        Authentication authentication
    ) {
        try {
            AuthenticatedUser currentUser = (AuthenticatedUser) authentication.getPrincipal();
            return ResponseEntity.ok(membershipService.updateProgress(currentUser, request));
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, exception.getMessage(), exception);
        }
    }
}
