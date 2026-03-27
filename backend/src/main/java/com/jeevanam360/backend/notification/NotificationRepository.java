package com.jeevanam360.backend.notification;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface NotificationRepository extends MongoRepository<NotificationRecord, String> {

    List<NotificationRecord> findTop20ByUserIdOrderByCreatedAtDesc(String userId);

    List<NotificationRecord> findTop10ByUserIdAndReadFalseOrderByCreatedAtDesc(String userId);

    Optional<NotificationRecord> findByIdAndUserId(String id, String userId);

    boolean existsByUserIdAndDedupeKey(String userId, String dedupeKey);
}
