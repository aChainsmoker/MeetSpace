import { BookingRoom } from '@/models/BookingRoom';

export interface GetBookingResponse {
    id: string;
    room: BookingRoom;
    userId: string;
    title: string;
    description?: string;
    bookingDate: string;
    startOfBookingTime: string;
    endOfBookingTime: string;
}
