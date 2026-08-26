import { Role } from '@/models/Role';

export interface GetUserResponse {
    id: string;
    role: Role;
    firstName: string;
    lastName: string;
    email: string;
    profileImageKey?: string | null;
}
