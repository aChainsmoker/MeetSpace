import { useCallback, useEffect, useMemo, useState } from 'react';
import { notifications } from '@mantine/notifications';
import SearchBar from '@/components/SearchBar/SearchBar';
import DateFilter from '@/components/DateFilter/DateFilter';
import TimeFilter from '@/components/TimeFilter/TimeFilter';
import CapacityFilter from '@/components/CapacityFilter/CapacityFilter';
import AmenitiesFilter from '@/components/AmenitiesFilter/AmenitiesFilter';
import RoomsCarousel from '@/components/RoomsCarousel/RoomsCarousel';
import RoomDetailCard from '@/components/RoomDetailCard/RoomDetailCard';
import BookingModal from '@/components/BookingModal/BookingModal';
import Scheduler from '@/components/Scheduler/Scheduler';
import { GetRoomResponse } from '@/services/RoomService';
import {
  getBookings,
  GetBookingResponse,
  CreateBookingRequest,
  UpdateBookingRequest,
  BookingsFilter,
} from '@/services/BookingService';
import { buildOccupiedUntilMap } from '@/utils/occupiedUntilMap';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchRoomsAsync,
  fetchRoomByIdAsync,
  fetchBookingsForRoomAsync,
} from '@/store/actions/roomsActions';
import {
  fetchBookingsAsync,
  createBookingAsync,
  updateBookingAsync,
} from '@/store/actions/bookingsActions';
import { fetchEquipmentAsync } from '@/store/actions/equipmentActions';
import '@/pages/HomePage.css';

const monthFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' });
const weekdayFormatter = new Intl.DateTimeFormat('ru-RU', { weekday: 'long' });

function formatScheduleTitle(dateStr: string) {
  const date = new Date(dateStr + 'T12:00:00');
  return `Расписание на ${monthFormatter.format(date)}, ${weekdayFormatter.format(date)}`;
}

function toUtcTime(date: string | null, time: string): string | undefined {
  if (!time || !date) return undefined;
  const local = new Date(`${date}T${time}:00`);
  if (Number.isNaN(local.getTime())) return undefined;
  const hours = local.getUTCHours().toString().padStart(2, '0');
  const minutes = local.getUTCMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export default function HomePage() {
  const today = new Date().toISOString().split('T')[0];
  const dispatch = useAppDispatch();

  const rooms = useAppSelector((state) => state.rooms.rooms);
  const bookings = useAppSelector((state) => state.bookings.bookings);
  const user = useAppSelector((state) => state.user.user);
  const currentUserId = user?.id ?? null;
  const equipmentData = useAppSelector((state) =>
    state.equipment.equipment.map((item) => ({ value: item.id, label: item.name }))
  );

  const [selectedDate, setSelectedDate] = useState<string | null>(today);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [selectedRoom, setSelectedRoom] = useState<GetRoomResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [capacity, setCapacity] = useState<string | number>('');
  const [equipmentIds, setEquipmentIds] = useState<string[]>([]);
  const [modalOpened, setModalOpened] = useState(false);
  const [editingBooking, setEditingBooking] = useState<GetBookingResponse | null>(null);
  const [occupancyBookings, setOccupancyBookings] = useState<GetBookingResponse[]>([]);

  const selectedRoomId = selectedRoom?.id ?? null;
  const detailedRoom = useAppSelector((state) =>
    selectedRoomId ? state.rooms.detailedRoom[selectedRoomId] ?? null : null
  );
  const roomBookings = useAppSelector((state) =>
    selectedRoomId ? state.rooms.roomBookings[selectedRoomId] ?? [] : []
  );

  const filter = useMemo<BookingsFilter>(() => {
    const capacityNumber = typeof capacity === 'number' || capacity === '' ? capacity as number | '' : Number(capacity);
    return {
      roomSearchQuery: searchQuery || undefined,
      capacity: capacityNumber ? Number(capacityNumber) : undefined,
      startDate: selectedDate ?? undefined,
      endDate: selectedDate ?? undefined,
      startTime: toUtcTime(selectedDate, startTime),
      endTime: toUtcTime(selectedDate, endTime),
      roomEquipmentsIds: equipmentIds.length ? equipmentIds : undefined,
    };
  }, [searchQuery, capacity, selectedDate, startTime, endTime, equipmentIds]);

  const handleRoomSelect = useCallback((room: GetRoomResponse) => {
    setSelectedRoom((prev) => (prev?.id === room.id ? null : room));
  }, []);

  const handleFetchRooms = useCallback(() => {
    dispatch(fetchRoomsAsync()).catch(() => {
      notifications.show({ color: 'red', message: 'Произошла ошибка при загрузке комнат' });
    });
  }, [dispatch]);

  const handleFetchEquipment = useCallback(() => {
    dispatch(fetchEquipmentAsync()).catch(() => {
      notifications.show({ color: 'red', message: 'Произошла ошибка при загрузке оборудования' });
    });
  }, [dispatch]);

  const handleFetchBookings = useCallback((f: BookingsFilter) => {
    dispatch(fetchBookingsAsync(f)).catch(() => {
      notifications.show({ color: 'red', message: 'Произошла ошибка при загрузке бронирований' });
    });
  }, [dispatch]);

  const loadOccupancy = useCallback(() => {
    getBookings()
      .then(setOccupancyBookings)
      .catch(() => {
        notifications.show({ color: 'red', message: 'Произошла ошибка при загрузке статуса занятости комнат' });
      });
  }, []);

  useEffect(() => {
    loadOccupancy();
  }, [loadOccupancy]);

  const occupiedUntilMap = useMemo(
    () => buildOccupiedUntilMap(occupancyBookings),
    [occupancyBookings]
  );

  const handleFetchRoomDetail = useCallback((id: string) => {
    dispatch(fetchRoomByIdAsync(id)).catch(() => {
      notifications.show({ color: 'red', message: 'Произошла ошибка при загрузке деталей о комнате' });
    });
  }, [dispatch]);

  const handleFetchRoomBookings = useCallback((id: string) => {
    dispatch(fetchBookingsForRoomAsync(id)).catch(() => {
      notifications.show({ color: 'red', message: 'Произошла ошибка при загрузке бронирований комнаты' });
    });
  }, [dispatch]);

  const handleEventClick = useCallback(
    (booking: GetBookingResponse) => {
      const isManager = user?.role?.name === 'Manager';
      if (!isManager && booking.userId !== currentUserId) {
        return;
      }
      setEditingBooking(booking);
      setModalOpened(true);
    },
    [user, currentUserId]
  );

  const handleUpdateBooking = useCallback(
    async (id: string, request: UpdateBookingRequest) => {
      await dispatch(updateBookingAsync(id, request));
      dispatch(fetchBookingsAsync(filter)).catch(() => {
        notifications.show({ color: 'red', message: 'Произошла ошибка при загрузке бронирований' });
      });
      loadOccupancy();
    },
    [dispatch, filter, loadOccupancy]
  );

  const handleCreateBooking = useCallback(
    async (request: CreateBookingRequest) => {
      await dispatch(createBookingAsync(request));
      dispatch(fetchBookingsAsync(filter)).catch(() => {
        notifications.show({ color: 'red', message: 'Произошла ошибка при загрузке бронирований' });
      });
      loadOccupancy();
    },
    [dispatch, filter, loadOccupancy]
  );

  return (
    <div className="home-page">
      <div className="home-page__body">
        <div className="home-page__main">
          <div className="home-page__filters-row">
            <SearchBar value={searchQuery} onSubmit={setSearchQuery} />
            <DateFilter value={selectedDate} onChange={setSelectedDate} />
            <TimeFilter startTime={startTime} endTime={endTime} onStartChange={setStartTime} onEndChange={setEndTime} />
            <CapacityFilter value={capacity} onChange={setCapacity} />
            <AmenitiesFilter value={equipmentIds} onChange={setEquipmentIds} data={equipmentData} onFetch={handleFetchEquipment} />
          </div>
          <RoomsCarousel
            rooms={rooms}
            selectedRoomId={selectedRoomId}
            occupiedUntilMap={occupiedUntilMap}
            onSelect={handleRoomSelect}
            onFetch={handleFetchRooms}
          />
          <h2 className="home-page__schedule-title">{formatScheduleTitle(selectedDate ?? today)}</h2>
          <Scheduler
            date={selectedDate ?? today}
            startTime={startTime}
            endTime={endTime}
            filter={filter}
            bookings={bookings}
            currentUserId={currentUserId}
            onFetchBookings={handleFetchBookings}
            onEventClick={handleEventClick}
          />
        </div>
        {selectedRoom && (
          <RoomDetailCard
            room={selectedRoom}
            detailedRoom={detailedRoom}
            bookings={roomBookings}
            onClose={() => setSelectedRoom(null)}
            onFetchDetail={handleFetchRoomDetail}
            onFetchBookings={handleFetchRoomBookings}
          />
        )}
      </div>

      <BookingModal
        opened={modalOpened}
        isEditing={editingBooking !== null}
        booking={editingBooking}
        onClose={() => {
          setModalOpened(false);
          setEditingBooking(null);
        }}
        rooms={rooms}
        userId={currentUserId}
        onFetchRooms={handleFetchRooms}
        onCreate={handleCreateBooking}
        onUpdate={handleUpdateBooking}
      />
    </div>
  );
}
