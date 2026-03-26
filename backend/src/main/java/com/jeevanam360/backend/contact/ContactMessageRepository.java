package com.jeevanam360.backend.contact;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface ContactMessageRepository extends MongoRepository<ContactMessage, String> {

    boolean existsByUserIdAndSelectedPlanIgnoreCase(String userId, String selectedPlan);

    boolean existsByEmailIgnoreCaseAndSelectedPlanIgnoreCase(String email, String selectedPlan);
}
