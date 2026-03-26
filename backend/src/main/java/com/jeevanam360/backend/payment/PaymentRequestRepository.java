package com.jeevanam360.backend.payment;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface PaymentRequestRepository extends MongoRepository<PaymentRequestRecord, String> {

    Optional<PaymentRequestRecord> findByGatewayOrderId(String gatewayOrderId);

    boolean existsByUserIdAndSelectedPlanIgnoreCase(String userId, String selectedPlan);

    boolean existsByEmailIgnoreCaseAndSelectedPlanIgnoreCase(String email, String selectedPlan);
}
