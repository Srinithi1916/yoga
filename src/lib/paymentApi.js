import { apiRequest } from './api';

export function fetchMyPaymentRequests(token) {
  return apiRequest('/payment-requests/me', { token });
}

export function fetchAdminPaymentRequests(token, status = '') {
  const suffix = status ? `?status=${encodeURIComponent(status)}` : '';
  return apiRequest(`/admin/payment-requests${suffix}`, { token });
}

export function updatePaymentRequestStatus(paymentRequestId, payload, token) {
  return apiRequest(`/admin/payment-requests/${paymentRequestId}/status`, {
    method: 'POST',
    token,
    body: payload,
  });
}

export function approvePaymentRequest(paymentRequestId, note, token) {
  return apiRequest(`/admin/payment-requests/${paymentRequestId}/approve`, {
    method: 'POST',
    token,
    body: { note },
  });
}

export function rejectPaymentRequest(paymentRequestId, note, token) {
  return apiRequest(`/admin/payment-requests/${paymentRequestId}/reject`, {
    method: 'POST',
    token,
    body: { note },
  });
}
