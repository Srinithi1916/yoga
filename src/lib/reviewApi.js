import { apiRequest } from './api';

export function fetchReviewSummaries(itemIds) {
  if (!itemIds?.length) {
    return Promise.resolve([]);
  }

  return apiRequest(`/reviews/summaries?itemIds=${encodeURIComponent(itemIds.join(','))}`);
}

export function fetchReviewItem(itemId, token) {
  return apiRequest(`/reviews/items/${itemId}`, { token });
}

export function saveReview(itemId, payload, token) {
  return apiRequest(`/reviews/items/${itemId}`, {
    method: 'POST',
    token,
    body: payload,
  });
}

export function deleteReview(itemId, token) {
  return apiRequest(`/reviews/items/${itemId}/mine`, {
    method: 'DELETE',
    token,
  });
}
