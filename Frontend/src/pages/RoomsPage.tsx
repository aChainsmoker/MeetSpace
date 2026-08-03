import { useCallback, useEffect, useState, useMemo } from 'react';
import { notifications } from '@mantine/notifications';
import SearchBar from '@/components/SearchBar/SearchBar';
import RoomRow from '@/components/RoomRow/RoomRow';
import RoomDetailCard from '@/components/RoomDetailCard/RoomDetailCard';
import { GetRoomResponse } from '@/services/RoomService';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchRoomsAsync, fetchRoomByIdAsync, fetchBookingsForRoomAsync } from '@/store/actions/roomsActions';
import { fetchBookingsAsync } from '@/store/actions/bookingsActions';
import { buildOccupiedUntilMap } from '@/utils/occupiedUntilMap';
import '@/pages/RoomsPage.css';

export default function RoomsPage() {
  const dispatch = useAppDispatch();
  const rooms = useAppSelector((state) => state.rooms.rooms);
  const bookings = useAppSelector((state) => state.bookings.bookings);
  const [selectedRoom, setSelectedRoom] = useState<GetRoomResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedRoomId = selectedRoom?.id ?? null;
  const detailedRoom = useAppSelector((state) =>
    selectedRoomId ? state.rooms.detailedRoom[selectedRoomId] ?? null : null
  );
  const roomBookings = useAppSelector((state) =>
    selectedRoomId ? state.rooms.roomBookings[selectedRoomId] ?? [] : []
  );

  useEffect(() => {
    dispatch(fetchRoomsAsync()).catch(() => {
      notifications.show({ color: 'red', message: 'Произошла ошибка при загрузке комнат' });
    });
    dispatch(fetchBookingsAsync({})).catch(() => {
      notifications.show({ color: 'red', message: 'Произошла ошибка при загрузке бронирований' });
    });
  }, [dispatch]);

  const occupiedUntilMap = useMemo(() => buildOccupiedUntilMap(bookings), [bookings]);

  const filteredRooms = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return rooms;
    return rooms.filter((room) => room.name.toLowerCase().includes(query));
  }, [rooms, searchQuery]);

  const handleRoomSelect = useCallback((room: GetRoomResponse) => {
    setSelectedRoom((prev) => (prev?.id === room.id ? null : room));
  }, []);

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

  return (
    <div className="rooms-page">
      <div className="rooms-page__body">
        <div className="rooms-page__main">
          <SearchBar value={searchQuery} onSubmit={setSearchQuery} />
          <div className="rooms-page__list">
            {filteredRooms.map((room) => (
              <RoomRow
                key={room.id}
                room={room}
                occupiedUntil={occupiedUntilMap[room.id] ?? null}
                onClick={() => handleRoomSelect(room)}
              />
            ))}
          </div>
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
    </div>
  );
}
