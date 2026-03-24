package com.jeevanam360.backend.contact;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/contact-messages")
public class ContactMessageController {

    private final ContactMessageService contactMessageService;
    private final ContactNotificationService contactNotificationService;

    public ContactMessageController(
        ContactMessageService contactMessageService,
        ContactNotificationService contactNotificationService
    ) {
        this.contactMessageService = contactMessageService;
        this.contactNotificationService = contactNotificationService;
    }

    @PostMapping
    public ResponseEntity<ContactMessageResponse> create(@Valid @RequestBody ContactMessageRequest request) {
        ContactMessage message = contactMessageService.prepare(request);
        boolean stored = false;
        String storageStatus = "MongoDB is not connected, so the enquiry was not saved to the database.";

        try {
            message = contactMessageService.save(message);
            stored = true;
            storageStatus = "Enquiry saved to MongoDB.";
        } catch (DataAccessException exception) {
            stored = false;
        }

        ContactEmailResult emailResult = contactNotificationService.sendContactNotification(message);
        HttpStatus responseStatus = stored ? HttpStatus.CREATED : HttpStatus.ACCEPTED;

        return ResponseEntity
            .status(responseStatus)
            .body(ContactMessageResponse.from(message, stored, storageStatus, emailResult));
    }
}