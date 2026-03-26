const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

function isJsonResponse(response) {
  return response.headers.get('content-type')?.includes('application/json');
}

function toRequestUrl(path) {
  return `${API_BASE_URL}${path}`;
}

function getNetworkErrorMessage(url, error) {
  if (error?.name === 'AbortError') {
    return `The request to ${url} timed out. Please try again.`;
  }

  return `Could not reach the API at ${url}. Make sure the backend is running and VITE_API_BASE_URL/CORS are configured correctly.`;
}

export async function apiRequest(path, options = {}) {
  const { method = 'GET', token, body, headers = {} } = options;
  const requestHeaders = { ...headers };
  const requestOptions = { method, headers: requestHeaders };
  const requestUrl = toRequestUrl(path);

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json';
    requestOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(requestUrl, requestOptions);
    const data = isJsonResponse(response) ? await response.json().catch(() => null) : await response.text().catch(() => '');

    if (!response.ok) {
      const errorMessage =
        typeof data === 'string'
          ? data || 'Request failed.'
          : data?.message || data?.error || 'Request failed.';
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    // Browsers throw TypeError for network failures, CORS rejections, and refused connections.
    if (error instanceof TypeError || error?.name === 'AbortError') {
      throw new Error(getNetworkErrorMessage(requestUrl, error));
    }

    throw error;
  }
}

export { API_BASE_URL };
