import {GetRoomEquipmentResponse} from "@/models/GetRoomEquipmentResponse";

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