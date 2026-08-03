import { GetUserResponse } from '@/services/UserService';
import { GetRoomResponse } from '@/services/RoomService';
import { GetBookingResponse } from '@/services/BookingService';
import { RoomEquipment } from '@/services/EquipmentService';

export const USER_FETCH_LOAD = 'user/userLoading';
export const USER_FETCH = 'user/userFetched';
export const USER_FETCH_IMAGE = 'user/userImageFetched';
export const USER_LOGOUT = 'user/userLoggedOut';

export const ROOMS_FETCH_LOAD = 'rooms/roomsLoading';
export const ROOMS_FETCH = 'rooms/roomsFetched';
export const ROOMS_FETCH_DETAIL = 'rooms/roomDetailFetched';
export const ROOMS_FETCH_ROOM_BOOKINGS = 'rooms/roomBookingsFetched';

export const BOOKINGS_FETCH_LOAD = 'bookings/bookingsLoading';
export const BOOKINGS_FETCH = 'bookings/bookingsFetched';
export const BOOKINGS_FETCH_USER = 'bookings/userBookingsFetched';
export const BOOKINGS_FETCH_DATE_RANGE = 'bookings/dateRangeBookingsFetched';

export const EQUIPMENT_FETCH_LOAD = 'equipment/equipmentLoading';
export const EQUIPMENT_FETCH = 'equipment/equipmentFetched';

export type UserAction =
  | { type: typeof USER_FETCH_LOAD }
  | { type: typeof USER_FETCH; payload: GetUserResponse }
  | { type: typeof USER_FETCH_IMAGE; payload: string | null }
  | { type: typeof USER_LOGOUT };

export type RoomsAction =
  | { type: typeof ROOMS_FETCH_LOAD }
  | { type: typeof ROOMS_FETCH; payload: GetRoomResponse[] }
  | { type: typeof ROOMS_FETCH_DETAIL; payload: GetRoomResponse }
  | {
      type: typeof ROOMS_FETCH_ROOM_BOOKINGS;
      payload: { roomId: string; bookings: GetBookingResponse[] };
    };

export type BookingsAction =
  | { type: typeof BOOKINGS_FETCH_LOAD }
  | { type: typeof BOOKINGS_FETCH; payload: GetBookingResponse[] }
  | { type: typeof BOOKINGS_FETCH_USER; payload: GetBookingResponse[] }
  | { type: typeof BOOKINGS_FETCH_DATE_RANGE; payload: GetBookingResponse[] };

export type EquipmentAction =
  | { type: typeof EQUIPMENT_FETCH_LOAD }
  | { type: typeof EQUIPMENT_FETCH; payload: RoomEquipment[] };

export type RootAction = UserAction | RoomsAction | BookingsAction | EquipmentAction;
