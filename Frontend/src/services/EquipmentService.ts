import { apiRequest } from '@/services/apiClient';

export interface RoomEquipment {
  id: string;
  name: string;
}

export async function getEquipment(): Promise<RoomEquipment[]> {
  return apiRequest<RoomEquipment[]>('/Equipment');
}