import { apiRequest } from '@/services/apiClient';

export interface GetRoomEquipmentResponse {
  id: string;
  name: string;
}

export interface GetRoomResponse {
  id: string;
  name: string;
  capacity: number;
  floor: number;
  description: string;
  isActive: boolean;
  photo: string;
  roomEquipments: GetRoomEquipmentResponse[];
}

export async function getRooms(): Promise<GetRoomResponse[]> {
  return apiRequest<GetRoomResponse[]>('/rooms');
}

export async function getRoomById(id: string): Promise<GetRoomResponse> {
  return apiRequest<GetRoomResponse>(`/rooms/${id}`);
}