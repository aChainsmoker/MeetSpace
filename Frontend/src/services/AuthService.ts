import { apiRequest } from '@/services/apiClient';

export interface AuthRegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthLoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export async function register(data: AuthRegisterRequest): Promise<void> {
  await apiRequest('/auth/register', {
    method: 'POST',
    body: data,
  });
}

export async function login(data: AuthLoginRequest): Promise<void> {
  await apiRequest('/auth/login', {
    method: 'POST',
    body: data,
  });
}

export async function logout(): Promise<void> {
  await apiRequest('/auth/logout', { method: 'DELETE' });
}