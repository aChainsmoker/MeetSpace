import { getEquipment, RoomEquipment } from '@/services/EquipmentService';
import { AppThunk } from '../thunk';
import { EQUIPMENT_FETCH_LOAD, EQUIPMENT_FETCH } from './types';

export const setEquipmentLoading = () => ({ type: EQUIPMENT_FETCH_LOAD } as const);
export const setEquipment = (equipment: RoomEquipment[]) =>
  ({ type: EQUIPMENT_FETCH, payload: equipment } as const);

export const fetchEquipmentAsync = (): AppThunk<Promise<void>> => async (dispatch) => {
  dispatch(setEquipmentLoading());
  const equipment = await getEquipment();
  dispatch(setEquipment(equipment));
};
