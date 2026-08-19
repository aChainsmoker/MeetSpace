import { GetBookingResponse } from '@/models/GetBookingResponse';

export function buildOccupiedUntilMap(
    bookings: GetBookingResponse[],
): Record<string, string | null> {
    const map: Record<string, string | null> = {};
    const now = Date.now();

    for (const booking of bookings) {
        const start = new Date(
            `${booking.bookingDate}T${booking.startOfBookingTime}`,
        ).getTime();
        const end = new Date(
            `${booking.bookingDate}T${booking.endOfBookingTime}`,
        ).getTime();
        if (start <= now && end > now) {
            const current = map[booking.room.id];
            if (
                !current ||
                end > new Date(`${booking.bookingDate}T${current}`).getTime()
            ) {
                map[booking.room.id] = booking.endOfBookingTime;
            }
        }
    }

    return map;
}
