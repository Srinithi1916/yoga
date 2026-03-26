package com.jeevanam360.backend.contact;

import java.time.Instant;

import com.jeevanam360.backend.security.AuthenticatedUser;
import org.springframework.stereotype.Service;

@Service
public class ContactMessageService {

    private final ContactMessageRepository contactMessageRepository;

    public ContactMessageService(ContactMessageRepository contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }

    public ContactMessage prepare(ContactMessageRequest request, AuthenticatedUser user) {
        ContactMessage message = new ContactMessage();
        message.setUserId(user.id());
        message.setName(user.name());
        message.setEmail(user.email());
        message.setWhatsapp(request.whatsapp().trim());
        message.setSelectedPlan(trimToNull(request.selectedPlan()));
        message.setPlanPrice(trimToNull(request.planPrice()));
        message.setAmount(request.amount());
        message.setMessage(request.message().trim());
        message.setSource(resolveSource(request.source()));
        message.setCreatedAt(Instant.now());
        return message;
    }

    public ContactMessage save(ContactMessage message) {
        return contactMessageRepository.save(message);
    }

    private String resolveSource(String source) {
        String trimmed = trimToNull(source);
        return trimmed == null ? "website-contact-form" : trimmed;
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
