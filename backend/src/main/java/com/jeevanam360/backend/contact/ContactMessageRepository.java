package com.jeevanam360.backend.contact;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface ContactMessageRepository extends MongoRepository<ContactMessage, String> {
}
