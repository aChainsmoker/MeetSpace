import {
  USER_FETCH_LOAD,
  USER_FETCH,
  USER_FETCH_IMAGE,
  USER_LOGOUT,
  RootAction,
} from '../actions/types';
import { GetUserResponse } from '@/services/UserService';

export interface UserState {
  user: GetUserResponse | null;
  imageUrl: string | null;
  isLoading: boolean;
}

const initialState: UserState = {
  user: null,
  imageUrl: null,
  isLoading: false,
};

const userReducer = (state: UserState | undefined = initialState, action: RootAction): UserState => {
  switch (action.type) {
    case USER_FETCH_LOAD:
      return { ...state, isLoading: true };

    case USER_FETCH:
      return { ...state, isLoading: false, user: action.payload };

    case USER_FETCH_IMAGE:
      return { ...state, imageUrl: action.payload };

    case USER_LOGOUT:
      return { ...state, user: null, imageUrl: null };

    default:
      return state;
  }
};

export default userReducer;
