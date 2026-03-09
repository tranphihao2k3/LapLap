import { apiClient } from '@/lib/api';
import {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  AuthMeResponse,
} from '@/types/api';

// store token in localStorage
export function storeToken(token: string) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('jwt_token', token);
    } catch {}
  }
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem('jwt_token');
    } catch {
      return null;
    }
  }
  return null;
}

export function clearToken() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('jwt_token');
    } catch {}
  }
}

// API calls
export const login = async (
  payload: LoginRequest
): Promise<ApiResponse<LoginResponse>> => {
  const res = await apiClient.post<LoginResponse>('/auth/login', payload);
  if (res.success && res.data?.token) {
    storeToken(res.data.token);
  }
  return res;
};

export const authMe = async (): Promise<ApiResponse<AuthMeResponse>> => {
  return apiClient.get<AuthMeResponse>('/auth/me');
};

export const verifyToken = async (
  token: string
): Promise<ApiResponse<{ valid: boolean }>> => {
  return apiClient.post('/auth/verify', { token });
};
