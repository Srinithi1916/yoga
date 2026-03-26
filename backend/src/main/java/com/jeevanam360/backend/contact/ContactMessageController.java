package com.jeevanam360.backend.contact;

import com.jeevanam360.backend.security.AuthenticatedUser;
import jakarta.validation.Valid;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact-messages")
public class ContactMessageController {

    private final ContactMessageService contactMessageService;

    public ContactMessageController(ContactMessageService contactMessageService) {
        this.contactMessageService = contactMessageService;
    }

    @PostMapping
    public ResponseEntity<ContactMessageResponse> create(
        @Valid @RequestBody ContactMessageRequest request,
        Authentication authentication
    ) {
        AuthenticatedUser currentUser = (AuthenticatedUser) authentication.getPrincipal();
        ContactMessage message = contactMessageService.prepare(request, currentUser);
        boolean stored = false;
        String storageStatus = "MongoDB is not connected, so the enquiry was not saved to the database.";

        try {
            message = contactMessageService.save(message);
            stored = true;
            storageStatus = "Enquiry saved to MongoDB.";
        } catch (DataAccessException exception) {
            stored = false;
        }

        ContactEmailResult emailResult = new ContactEmailResult(false, "Email is handled by the frontend.");
        HttpStatus responseStatus = stored ? HttpStatus.CREATED : HttpStatus.ACCEPTED;

        return ResponseEntity
            .status(responseStatus)
            .body(ContactMessageResponse.from(message, stored, storageStatus, emailResult));
    }
}
