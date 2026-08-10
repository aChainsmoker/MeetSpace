import {
    BOOKINGS_FETCH,
    BOOKINGS_FETCH_DATE_RANGE,
    BOOKINGS_FETCH_LOAD,
    BOOKINGS_FETCH_USER, BookingsAction
} from '../actions/types';

import {GetBookingResponse} from "@/models/GetBookingResponse";

export interface BookingsState {
    bookings: GetBookingResponse[];
    userBookings: GetBookingResponse[];
    dateRangeBookings: GetBookingResponse[];
    isLoading: boolean;
}

const initialState: BookingsState = {
    bookings: [],
    userBookings: [],
    dateRangeBookings: [],
    isLoading: false,
};

const bookingsReducer = (state: BookingsState | undefined = initialState, action: BookingsAction): BookingsState => {
    switch (action.type) {
        case BOOKINGS_FETCH_LOAD:
            return {...state, isLoading: true};

        case BOOKINGS_FETCH:
            return {...state, isLoading: false, bookings: action.payload};

        case BOOKINGS_FETCH_USER:
            return {...state, isLoading: false, userBookings: action.payload};

        case BOOKINGS_FETCH_DATE_RANGE:
            return {...state, isLoading: false, dateRangeBookings: action.payload};

        default:
            return state;
    }
};

export default bookingsReducer;
