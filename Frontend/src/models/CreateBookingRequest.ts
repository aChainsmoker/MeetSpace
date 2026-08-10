export interface CreateBookingRequest {
    userId: string;
    roomId: string;
    title: string;
    description?: string;
    bookingDate: string;
    startOfBookingTime: string;
    endOfBookingTime: string;
}