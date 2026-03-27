package com.jeevanam360.backend.notification;

import java.time.Instant;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public void createNotification(
        String userId,
        String title,
        String message,
        String type,
        String actionUrl,
        String dedupeKey
    ) {
        if (userId == null || userId.isBlank()) {
            return;
        }

        if (dedupeKey != null && !dedupeKey.isBlank() && notificationRepository.existsByUserIdAndDedupeKey(userId, dedupeKey)) {
            return;
        }

        NotificationRecord notification = new NotificationRecord();
        notification.setUserId(userId);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setActionUrl(actionUrl);
        notification.setRead(false);
        notification.setCreatedAt(Instant.now());
        notification.setDedupeKey(trimToNull(dedupeKey));
        notificationRepository.save(notification);
    }

    public List<UserNotificationResponse> getNotifications(String userId, boolean unreadOnly) {
        List<NotificationRecord> notifications = unreadOnly
            ? notificationRepository.findTop10ByUserIdAndReadFalseOrderByCreatedAtDesc(userId)
            : notificationRepository.findTop20ByUserIdOrderByCreatedAtDesc(userId);

        return notifications.stream().map(UserNotificationResponse::from).toList();
    }

    public void markRead(String userId, String notificationId) {
        NotificationRecord notification = notificationRepository.findByIdAndUserId(notificationId, userId)
            .orElseThrow(() -> new IllegalArgumentException("The notification could not be found."));
        notification.setRead(true);
        notification.setReadAt(Instant.now());
        notificationRepository.save(notification);
    }

    public void markAllRead(String userId) {
        List<NotificationRecord> notifications = notificationRepository.findTop20ByUserIdOrderByCreatedAtDesc(userId);
        Instant now = Instant.now();
        notifications.stream().filter(notification -> !notification.isRead()).forEach(notification -> {
            notification.setRead(true);
            notification.setReadAt(now);
        });
        notificationRepository.saveAll(notifications);
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
