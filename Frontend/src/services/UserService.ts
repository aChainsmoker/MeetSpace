import { apiRequest } from '@/services/apiClient';

export interface Role {
  id: string;
  name: string;
}

export interface GetUserResponse {
  id: string;
  role: Role;
  firstName: string;
  lastName: string;
  email: string;
  profileImageKey?: string | null;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
}

export interface GetProfileImageResponse {
  profileImageUrl: string;
}

export async function getUserProfile(): Promise<GetUserResponse> {
  return apiRequest<GetUserResponse>('/users/me');
}

export async function updateUserProfile(request: UpdateUserRequest): Promise<void> {
  await apiRequest('/users/me', {
    method: 'PUT',
    body: request,
  });
}

export async function getProfileImage(imageKey: string): Promise<GetProfileImageResponse> {
  return apiRequest<GetProfileImageResponse>(
    `/users/me/photo?imageKey=${encodeURIComponent(imageKey)}`
  );
}

export async function updateUserProfileImage(file: File): Promise<void> {
  const formData = new FormData();
  formData.append('ProfileImage', file);
  await apiRequest('/users/me/photo', {
    method: 'PUT',
    body: formData,
  });
}