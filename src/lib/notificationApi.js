import { apiRequest } from './api';

export function fetchMyNotifications(token, unreadOnly = false) {
  const suffix = unreadOnly ? '?unreadOnly=true' : '';
  return apiRequest(`/notifications/me${suffix}`, { token });
}

export function markNotificationRead(notificationId, token) {
  return apiRequest(`/notifications/${notificationId}/read`, {
    method: 'POST',
    token,
  });
}

export function markAllNotificationsRead(token) {
  return apiRequest('/notifications/me/read-all', {
    method: 'POST',
    token,
  });
}
