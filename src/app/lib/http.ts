import { API_BASE_URL } from './config';

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() ?? '';
  }
  return '';
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers || {});
  if (!headers.has('Content-Type') && init.body && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  const csrfToken = getCookie('csrftoken');
  if (csrfToken && ['POST', 'PUT', 'PATCH', 'DELETE'].includes((init.method || 'GET').toUpperCase())) {
    headers.set('X-CSRFToken', csrfToken);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    ...init,
    headers,
  });

  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const data = await response.json();
      if (data.detail) {
        message = data.detail;
      } else if (typeof data === 'object' && data !== null) {
        message = JSON.stringify(data);
      }
    } catch {
      // noop
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

export const http = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: any) =>
    request<T>(path, { method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body || {}) }),
  put: <T>(path: string, body?: any) =>
    request<T>(path, { method: 'PUT', body: body instanceof FormData ? body : JSON.stringify(body || {}) }),
  patch: <T>(path: string, body?: any) =>
    request<T>(path, { method: 'PATCH', body: body instanceof FormData ? body : JSON.stringify(body || {}) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
