import { ApiResponse } from '@/types/api';

const BASE_URL = process.env.NEXT_PUBLIC_NEXGEAR_API_URL?.replace(/\/+$/,'') || '';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('jwt_token') || null;
  } catch {
    return null;
  }
}

async function callApi<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    credentials: 'include',
    ...options,
    headers,
  });

  const text = await res.text();
  let json: any;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    return {
      success: false,
      error: 'Invalid JSON response',
    } as ApiResponse<T>;
  }

  if (!res.ok) {
    return {
      success: false,
      error: json?.error || res.statusText,
    } as ApiResponse<T>;
  }

  return json as ApiResponse<T>;
}

const apiClient = {
  get: <T>(path: string) => callApi<T>(path, { method: 'GET' }),
  post: <T>(path: string, body: any) =>
    callApi<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: any) =>
    callApi<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: <T>(path: string) => callApi<T>(path, { method: 'DELETE' }),
};

export { callApi, apiClient };
export default apiClient;
