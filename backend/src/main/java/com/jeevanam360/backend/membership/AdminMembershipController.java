package com.jeevanam360.backend.membership;

import java.util.List;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/admin/memberships")
@PreAuthorize("hasRole('ADMIN')")
public class AdminMembershipController {

    private final MembershipService membershipService;

    public AdminMembershipController(MembershipService membershipService) {
        this.membershipService = membershipService;
    }

    @GetMapping
    public ResponseEntity<List<AdminMembershipSummaryResponse>> getActiveMemberships() {
        return ResponseEntity.ok(membershipService.getActiveMembershipsForAdmin());
    }

    @GetMapping("/{membershipId}")
    public ResponseEntity<AdminMembershipDetailResponse> getMembership(@PathVariable String membershipId) {
        try {
            return ResponseEntity.ok(membershipService.getMembershipForAdmin(membershipId));
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, exception.getMessage(), exception);
        }
    }

    @PutMapping("/{membershipId}/progress")
    public ResponseEntity<AdminMembershipDetailResponse> updateProgress(
        @PathVariable String membershipId,
        @Valid @RequestBody MembershipProgressRequest request
    ) {
        try {
            return ResponseEntity.ok(membershipService.updateMembershipProgressForAdmin(membershipId, request));
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, exception.getMessage(), exception);
        }
    }
}
