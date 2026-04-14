package com.jeevanam360.backend.payment;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface PaymentRequestRepository extends MongoRepository<PaymentRequestRecord, String> {

    Optional<PaymentRequestRecord> findByGatewayOrderId(String gatewayOrderId);

    boolean existsByUserId(String userId);

    boolean existsByUserIdAndSelectedPlanIgnoreCaseAndStatusIn(String userId, String selectedPlan, List<String> statuses);

    boolean existsByEmailIgnoreCaseAndSelectedPlanIgnoreCaseAndStatusIn(String email, String selectedPlan, List<String> statuses);

    long countBySelectedPlanIgnoreCaseAndStatusIn(String selectedPlan, List<String> statuses);

    List<PaymentRequestRecord> findAllByUserIdOrderByCreatedAtDesc(String userId);

    List<PaymentRequestRecord> findAllByEmailIgnoreCaseOrderByCreatedAtDesc(String email);

    List<PaymentRequestRecord> findAllByStatusIgnoreCaseOrderByCreatedAtDesc(String status);

    List<PaymentRequestRecord> findAllByOrderByCreatedAtDesc();
}
