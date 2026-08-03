import { combineReducers } from 'redux';
import userReducer, { UserState } from './userReducer';
import roomsReducer, { RoomsState } from './roomsReducer';
import bookingsReducer, { BookingsState } from './bookingsReducer';
import equipmentReducer, { EquipmentState } from './equipmentReducer';

export interface RootState {
  user: UserState;
  rooms: RoomsState;
  bookings: BookingsState;
  equipment: EquipmentState;
}

const rootReducer = combineReducers({
  user: userReducer,
  rooms: roomsReducer,
  bookings: bookingsReducer,
  equipment: equipmentReducer,
});

export default rootReducer;
