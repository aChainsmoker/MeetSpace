import { apiRequest } from '@/api/apiClient';
import { RoomEquipment } from '@/models/RoomEquipment';

export async function getEquipment(): Promise<RoomEquipment[]> {
    return apiRequest<RoomEquipment[]>('/Equipment');
}
