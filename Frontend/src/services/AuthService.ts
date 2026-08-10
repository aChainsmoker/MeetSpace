import {apiRequest} from '@/api/apiClient';
import {AuthRegisterRequest} from "@/models/AuthRegisterRequest";
import {AuthLoginRequest} from "@/models/AuthLoginRequest";

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
    await apiRequest('/auth/logout', {method: 'DELETE'});
}