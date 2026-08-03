import {
  createBooking,
  getBookings,
  getBookingsByDateRange,
  getUserBookings,
  updateBooking,
  deleteBooking,
  CreateBookingRequest,
  UpdateBookingRequest,
  BookingsFilter,
  GetBookingResponse,
} from '@/services/BookingService';
import { AppThunk } from '../thunk';
import {
  BOOKINGS_FETCH_LOAD,
  BOOKINGS_FETCH,
  BOOKINGS_FETCH_USER,
  BOOKINGS_FETCH_DATE_RANGE,
} from './types';

export const setBookingsLoading = () => ({ type: BOOKINGS_FETCH_LOAD } as const);
export const setBookings = (bookings: GetBookingResponse[]) =>
  ({ type: BOOKINGS_FETCH, payload: bookings } as const);
export const setUserBookings = (bookings: GetBookingResponse[]) =>
  ({ type: BOOKINGS_FETCH_USER, payload: bookings } as const);
export const setDateRangeBookings = (bookings: GetBookingResponse[]) =>
  ({ type: BOOKINGS_FETCH_DATE_RANGE, payload: bookings } as const);

export const fetchBookingsAsync = (filter: BookingsFilter = {}): AppThunk<Promise<void>> => async (dispatch) => {
  dispatch(setBookingsLoading());
  const bookings = await getBookings(filter);
  dispatch(setBookings(bookings));
};

export const fetchUserBookingsAsync = (): AppThunk<Promise<void>> => async (dispatch) => {
  dispatch(setBookingsLoading());
  const bookings = await getUserBookings();
  dispatch(setUserBookings(bookings));
};

export const fetchBookingsByDateRangeAsync = (
  startDate: string,
  endDate: string
): AppThunk<Promise<void>> => async (dispatch) => {
  dispatch(setBookingsLoading());
  const bookings = await getBookingsByDateRange(startDate, endDate);
  dispatch(setDateRangeBookings(bookings));
};

export const createBookingAsync = (request: CreateBookingRequest): AppThunk<Promise<void>> => async () => {
  await createBooking(request);
};

export const updateBookingAsync = (
  id: string,
  request: UpdateBookingRequest
): AppThunk<Promise<void>> => async () => {
  await updateBooking(id, request);
};

export const deleteBookingAsync = (id: string): AppThunk<Promise<void>> => async () => {
  await deleteBooking(id);
};
