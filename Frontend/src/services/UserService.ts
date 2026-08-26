import { apiRequest } from '@/api/apiClient';
import { GetUserResponse } from '@/models/GetUserResponse';
import { UpdateUserRequest } from '@/models/UpdateUserRequest';
import { GetProfileImageResponse } from '@/models/GetProfileImageResponse';

export async function getUserProfile(
    suppressUnauthorizedRedirect: boolean = false
): Promise<GetUserResponse> {
    return apiRequest<GetUserResponse>('/users/me', {
        suppressUnauthorizedHandler: suppressUnauthorizedRedirect,
    });
}

export async function updateUserProfile(
    request: UpdateUserRequest
): Promise<void> {
    await apiRequest('/users/me', {
        method: 'PUT',
        body: request,
    });
}

export async function getProfileImage(
    imageKey: string
): Promise<GetProfileImageResponse> {
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
