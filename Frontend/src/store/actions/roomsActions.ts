import { getRoomById, getRooms } from '@/services/RoomService';
import { getBookingsForRoom } from '@/services/BookingService';
import { AppThunk } from '../thunk';
import {
    ROOMS_FETCH,
    ROOMS_FETCH_DETAIL,
    ROOMS_FETCH_LOAD,
    ROOMS_FETCH_ROOM_BOOKINGS,
} from './types';
import { GetBookingResponse } from '@/models/GetBookingResponse';
import { GetRoomResponse } from '@/models/GetRoomResponse';

export const setRoomsLoading = () => ({ type: ROOMS_FETCH_LOAD }) as const;
export const setRooms = (rooms: GetRoomResponse[]) =>
    ({ type: ROOMS_FETCH, payload: rooms }) as const;
export const setRoomDetail = (room: GetRoomResponse) =>
    ({ type: ROOMS_FETCH_DETAIL, payload: room }) as const;
export const setRoomBookings = (
    roomId: string,
    bookings: GetBookingResponse[]
) =>
    ({
        type: ROOMS_FETCH_ROOM_BOOKINGS,
        payload: { roomId, bookings },
    }) as const;

export const fetchRoomsAsync =
    (): AppThunk<Promise<void>> => async (dispatch) => {
        dispatch(setRoomsLoading());
        const rooms = await getRooms();
        dispatch(setRooms(rooms));
    };

export const fetchRoomByIdAsync =
    (id: string): AppThunk<Promise<void>> =>
    async (dispatch) => {
        const room = await getRoomById(id);
        dispatch(setRoomDetail(room));
    };

export const fetchBookingsForRoomAsync =
    (roomId: string): AppThunk<Promise<void>> =>
    async (dispatch) => {
        const bookings = await getBookingsForRoom(roomId);
        dispatch(setRoomBookings(roomId, bookings));
    };
