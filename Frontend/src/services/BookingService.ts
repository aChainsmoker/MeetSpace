import { apiRequest } from '@/services/apiClient';

export interface BookingRoom {
  id: string;
  name: string;
  capacity: number;
  floor: number;
  photo: string;
}

export interface GetBookingResponse {
  id: string;
  room: BookingRoom;
  userId: string;
  title: string;
  description: string;
  startOfBookingTime: string;
  endOfBookingTime: string;
}

export interface CreateBookingRequest {
  userId: string;
  roomId: string;
  title: string;
  description?: string;
  startOfBookingTime: string;
  endOfBookingTime: string;
}

export interface UpdateBookingRequest {
  userId: string;
  roomId: string;
  title: string;
  description?: string;
  startOfBookingTime: string;
  endOfBookingTime: string;
}

export interface BookingsFilter {
  roomSearchQuery?: string;
  capacity?: number;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  roomEquipmentsIds?: string[];
}

export async function createBooking(request: CreateBookingRequest): Promise<void> {
  await apiRequest('/bookings', {
    method: 'POST',
    body: request,
  });
}

export async function getBookings(filter: BookingsFilter = {}): Promise<GetBookingResponse[]> {
  const params = new URLSearchParams();

  if (filter.roomSearchQuery) {
    params.append('RoomSearchQuery', filter.roomSearchQuery);
  }
  if (filter.capacity != null) {
    params.append('Capacity', String(filter.capacity));
  }
  if (filter.startDate) {
    params.append('StartDate', filter.startDate);
  }
  if (filter.endDate) {
    params.append('EndDate', filter.endDate);
  }
  if (filter.startTime) {
    params.append('StartTime', filter.startTime);
  }
  if (filter.endTime) {
    params.append('EndTime', filter.endTime);
  }
  for (const id of filter.roomEquipmentsIds ?? []) {
    params.append('RoomEquipmentsIds', id);
  }

  const query = params.toString();
  return apiRequest<GetBookingResponse[]>(`/bookings${query ? `?${query}` : ''}`);
}



export async function getBookingsByDateRange(
  startDate: string,
  endDate: string
): Promise<GetBookingResponse[]> {
  return apiRequest<GetBookingResponse[]>(
    `/bookings?StartDate=${startDate}&EndDate=${endDate}`
  );
}

export async function getBookingsForRoom(roomId: string): Promise<GetBookingResponse[]> {
  return apiRequest<GetBookingResponse[]>(`/bookings/room/${roomId}`);
}

export async function getUserBookings(): Promise<GetBookingResponse[]> {
  return apiRequest<GetBookingResponse[]>('/bookings/user');
}

export async function updateBooking(id: string, request: UpdateBookingRequest): Promise<void> {
  await apiRequest(`/bookings/${id}`, {
    method: 'PUT',
    body: request,
  });
}

export async function deleteBooking(id: string): Promise<void> {
  await apiRequest(`/bookings/${id}`, { method: 'DELETE' });
}