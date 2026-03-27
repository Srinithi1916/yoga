import { apiRequest } from './api';

export function fetchMyMembership(token) {
  return apiRequest('/memberships/me', { token });
}

export function updateMyMembershipProgress(payload, token) {
  return apiRequest('/memberships/me/progress', {
    method: 'PUT',
    token,
    body: payload,
  });
}
