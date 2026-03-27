package com.jeevanam360.backend.notification;

import com.jeevanam360.backend.security.AuthenticatedUser;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/me")
    public ResponseEntity<List<UserNotificationResponse>> getMine(
        @RequestParam(name = "unreadOnly", defaultValue = "false") boolean unreadOnly,
        Authentication authentication
    ) {
        AuthenticatedUser currentUser = (AuthenticatedUser) authentication.getPrincipal();
        return ResponseEntity.ok(notificationService.getNotifications(currentUser.id(), unreadOnly));
    }

    @PostMapping("/{notificationId}/read")
    public ResponseEntity<Void> markRead(@PathVariable String notificationId, Authentication authentication) {
        AuthenticatedUser currentUser = (AuthenticatedUser) authentication.getPrincipal();
        notificationService.markRead(currentUser.id(), notificationId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/me/read-all")
    public ResponseEntity<Void> markAllRead(Authentication authentication) {
        AuthenticatedUser currentUser = (AuthenticatedUser) authentication.getPrincipal();
        notificationService.markAllRead(currentUser.id());
        return ResponseEntity.noContent().build();
    }
}
