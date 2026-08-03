import {
  ROOMS_FETCH_LOAD,
  ROOMS_FETCH,
  ROOMS_FETCH_DETAIL,
  ROOMS_FETCH_ROOM_BOOKINGS,
  RootAction,
} from '../actions/types';
import { GetRoomResponse } from '@/services/RoomService';
import { GetBookingResponse } from '@/services/BookingService';

export interface RoomsState {
  rooms: GetRoomResponse[];
  detailedRoom: Record<string, GetRoomResponse>;
  roomBookings: Record<string, GetBookingResponse[]>;
  isLoading: boolean;
}

const initialState: RoomsState = {
  rooms: [],
  detailedRoom: {},
  roomBookings: {},
  isLoading: false,
};

const roomsReducer = (state: RoomsState | undefined = initialState, action: RootAction): RoomsState => {
  switch (action.type) {
    case ROOMS_FETCH_LOAD:
      return { ...state, isLoading: true };

    case ROOMS_FETCH:
      return { ...state, isLoading: false, rooms: action.payload };

    case ROOMS_FETCH_DETAIL:
      return {
        ...state,
        detailedRoom: {
          ...state.detailedRoom,
          [action.payload.id]: action.payload,
        },
      };

    case ROOMS_FETCH_ROOM_BOOKINGS:
      return {
        ...state,
        roomBookings: {
          ...state.roomBookings,
          [action.payload.roomId]: action.payload.bookings,
        },
      };

    default:
      return state;
  }
};

export default roomsReducer;
