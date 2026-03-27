package com.jeevanam360.backend.notification;

import java.time.Instant;

public record UserNotificationResponse(
    String id,
    String title,
    String message,
    String type,
    String actionUrl,
    boolean read,
    Instant createdAt
) {
    public static UserNotificationResponse from(NotificationRecord notification) {
        return new UserNotificationResponse(
            notification.getId(),
            notification.getTitle(),
            notification.getMessage(),
            notification.getType(),
            notification.getActionUrl(),
            notification.isRead(),
            notification.getCreatedAt()
        );
    }
}
