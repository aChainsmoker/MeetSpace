import {
  register as registerApi,
  login as loginApi,
  logout as logoutApi,
  AuthRegisterRequest,
  AuthLoginRequest,
} from '@/services/AuthService';
import {
  getUserProfile,
  getProfileImage,
  updateUserProfile,
  updateUserProfileImage,
  GetUserResponse,
  UpdateUserRequest,
} from '@/services/UserService';
import { AppThunk } from '../thunk';
import {
  USER_FETCH_LOAD,
  USER_FETCH,
  USER_FETCH_IMAGE,
  USER_LOGOUT,
} from './types';

export const setUserLoading = () => ({ type: USER_FETCH_LOAD } as const);
export const setUser = (user: GetUserResponse) => ({ type: USER_FETCH, payload: user } as const);
export const setUserImage = (imageUrl: string | null) =>
  ({ type: USER_FETCH_IMAGE, payload: imageUrl } as const);
export const clearUser = () => ({ type: USER_LOGOUT } as const);

export const fetchUserAsync = (): AppThunk<Promise<void>> => async (dispatch) => {
  dispatch(setUserLoading());
  const user = await getUserProfile();
  dispatch(setUser(user));
  if (user.profileImageKey) {
    try {
      const { profileImageUrl } = await getProfileImage(user.profileImageKey);
      dispatch(setUserImage(profileImageUrl));
    } catch {
      dispatch(setUserImage(null));
    }
  } else {
    dispatch(setUserImage(null));
  }
};

export const updateUserProfileAsync = (request: UpdateUserRequest): AppThunk<Promise<void>> => async () => {
  await updateUserProfile(request);
};

export const updateUserProfileImageAsync = (file: File): AppThunk<Promise<void>> => async () => {
  await updateUserProfileImage(file);
};

export const registerAsync = (data: AuthRegisterRequest): AppThunk<Promise<void>> => async () => {
  await registerApi(data);
};

export const loginAsync = (data: AuthLoginRequest): AppThunk<Promise<void>> => async () => {
  await loginApi(data);
};

export const logoutAsync = (): AppThunk<Promise<void>> => async (dispatch) => {
  await logoutApi();
  dispatch(clearUser());
};
