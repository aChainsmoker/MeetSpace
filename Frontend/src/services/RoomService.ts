import { apiRequest } from '@/api/apiClient';
import { GetRoomResponse } from '@/models/GetRoomResponse';

export async function getRooms(): Promise<GetRoomResponse[]> {
    return apiRequest<GetRoomResponse[]>('/rooms');
}

export async function getRoomById(id: string): Promise<GetRoomResponse> {
    return apiRequest<GetRoomResponse>(`/rooms/${id}`);
}
