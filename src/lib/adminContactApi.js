import { apiRequest } from './api';

export function fetchAdminContactMessages(token) {
  return apiRequest('/admin/contact-messages', { token });
}
