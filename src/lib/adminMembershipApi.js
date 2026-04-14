import { apiRequest } from './api';

export function fetchAdminMemberships(token) {
  return apiRequest('/admin/memberships', { token });
}

export function fetchAdminMembershipDetail(membershipId, token) {
  return apiRequest(`/admin/memberships/${membershipId}`, { token });
}

export function updateAdminMembershipProgress(membershipId, payload, token) {
  return apiRequest(`/admin/memberships/${membershipId}/progress`, {
    method: 'PUT',
    token,
    body: payload,
  });
}
