import { apiRequest } from './api';

export function fetchAdminUsers(token) {
  return apiRequest('/admin/users', { token });
}
