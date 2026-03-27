package com.jeevanam360.backend.contact;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface ContactMessageRepository extends MongoRepository<ContactMessage, String> {

    List<ContactMessage> findAllByOrderByCreatedAtDesc();

    boolean existsByUserIdAndSelectedPlanIgnoreCase(String userId, String selectedPlan);

    boolean existsByEmailIgnoreCaseAndSelectedPlanIgnoreCase(String email, String selectedPlan);
}
