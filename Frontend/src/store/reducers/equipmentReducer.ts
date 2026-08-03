import {
  EQUIPMENT_FETCH_LOAD,
  EQUIPMENT_FETCH,
  RootAction,
} from '../actions/types';
import { RoomEquipment } from '@/services/EquipmentService';

export interface EquipmentState {
  equipment: RoomEquipment[];
  isLoading: boolean;
}

const initialState: EquipmentState = {
  equipment: [],
  isLoading: false,
};

const equipmentReducer = (state: EquipmentState | undefined = initialState, action: RootAction): EquipmentState => {
  switch (action.type) {
    case EQUIPMENT_FETCH_LOAD:
      return { ...state, isLoading: true };

    case EQUIPMENT_FETCH:
      return { ...state, isLoading: false, equipment: action.payload };

    default:
      return state;
  }
};

export default equipmentReducer;
