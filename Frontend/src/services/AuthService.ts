import { apiRequest } from '@/api/apiClient';
import { AuthRegisterRequest } from '@/models/AuthRegisterRequest';
import { AuthLoginRequest } from '@/models/AuthLoginRequest';
import { AuthResponse } from '@/models/AuthResponse';

export async function register(data: AuthRegisterRequest): Promise<void> {
    await apiRequest('/auth/register', {
        method: 'POST',
        body: data,
    });
}

export async function login(data: AuthLoginRequest): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/login', {
        method: 'POST',
        body: data,
    });
}
