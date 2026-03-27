package com.jeevanam360.backend.contact;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/contact-messages")
@PreAuthorize("hasRole('ADMIN')")
public class AdminContactMessageController {

    private final ContactMessageRepository contactMessageRepository;

    public AdminContactMessageController(ContactMessageRepository contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }

    @GetMapping
    public ResponseEntity<List<AdminContactMessageResponse>> getAll() {
        List<AdminContactMessageResponse> responses = contactMessageRepository.findAllByOrderByCreatedAtDesc()
            .stream()
            .map(AdminContactMessageResponse::from)
            .toList();
        return ResponseEntity.ok(responses);
    }
}
