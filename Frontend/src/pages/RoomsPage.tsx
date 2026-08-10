import {useCallback, useEffect, useMemo, useState} from 'react';
import {notifications} from '@mantine/notifications';
import SearchBar from '@/components/SearchBar/SearchBar';
import RoomRow from '@/components/RoomRow/RoomRow';
import RoomDetailCard from '@/components/RoomDetailCard/RoomDetailCard';
import BookingModal from '@/components/BookingModal/BookingModal';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {
    createBookingAsync,
    updateBookingAsync,
    fetchBookingsAsync
} from '@/store/actions/bookingsActions';
import {fetchBookingsForRoomAsync, fetchRoomByIdAsync, fetchRoomsAsync} from '@/store/actions/roomsActions';
import {buildOccupiedUntilMap} from '@/utils/occupiedUntilMap';
import '@/pages/RoomsPage.css';
import {CreateBookingRequest} from "@/models/CreateBookingRequest";
import {UpdateBookingRequest} from "@/models/UpdateBookingRequest";
import {GetRoomResponse} from "@/models/GetRoomResponse";

export default function RoomsPage() {
    const dispatch = useAppDispatch();
    const rooms = useAppSelector((state) => state.rooms.rooms);
    const bookings = useAppSelector((state) => state.bookings.bookings);
    const userId = useAppSelector((state) => state.user.user?.id ?? null);
    const [selectedRoom, setSelectedRoom] = useState<GetRoomResponse | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [bookingModalOpened, setBookingModalOpened] = useState(false);

    const selectedRoomId = selectedRoom?.id ?? null;
    const detailedRoom = useAppSelector((state) =>
        selectedRoomId ? state.rooms.detailedRoom[selectedRoomId] ?? null : null
    );
    const roomBookings = useAppSelector((state) =>
        selectedRoomId ? state.rooms.roomBookings[selectedRoomId] ?? [] : []
    );

    useEffect(() => {
        dispatch(fetchBookingsAsync({})).catch(() => {
            notifications.show({color: 'red', message: 'Произошла ошибка при загрузке бронирований'});
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

    const handleFetchRooms = useCallback(() => {
        dispatch(fetchRoomsAsync()).catch(() => {
            notifications.show({color: 'red', message: 'Произошла ошибка при загрузке комнат'});
        });
    }, [dispatch]);

    useEffect(() => {
        handleFetchRooms();
    }, [handleFetchRooms]);

    const handleFetchRoomDetail = useCallback((id: string) => {
        dispatch(fetchRoomByIdAsync(id)).catch(() => {
            notifications.show({color: 'red', message: 'Произошла ошибка при загрузке деталей о комнате'});
        });
    }, [dispatch]);

    const handleFetchRoomBookings = useCallback((id: string) => {
        dispatch(fetchBookingsForRoomAsync(id)).catch(() => {
            notifications.show({color: 'red', message: 'Произошла ошибка при загрузке бронирований комнаты'});
        });
    }, [dispatch]);

    const handleCreateBooking = useCallback(
        async (request: CreateBookingRequest) => {
            await dispatch(createBookingAsync(request));
            dispatch(fetchBookingsAsync({})).catch(() => {
                notifications.show({color: 'red', message: 'Произошла ошибка при загрузке бронирований'});
            });
        },
        [dispatch]
    );

    const handleUpdateBooking = useCallback(
        async (id: string, request: UpdateBookingRequest) => {
            await dispatch(updateBookingAsync(id, request));
            dispatch(fetchBookingsAsync({})).catch(() => {
                notifications.show({color: 'red', message: 'Произошла ошибка при загрузке бронирований'});
            });
        },
        [dispatch]
    );

    const handleBookRoom = useCallback(() => {
        setBookingModalOpened(true);
    }, []);

    return (
        <div className="rooms-page">
            <div className="rooms-page__body">
                <div className="rooms-page__main">
                    <SearchBar
                        value={searchQuery}
                        onSubmit={setSearchQuery}
                    />
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
                        onBook={handleBookRoom}
                    />
                )}
            </div>
            <BookingModal
                opened={bookingModalOpened}
                isEditing={false}
                initialRoomId={selectedRoom?.id ?? null}
                onClose={() => setBookingModalOpened(false)}
                rooms={rooms}
                userId={userId}
                onFetchRooms={handleFetchRooms}
                onCreate={handleCreateBooking}
                onUpdate={handleUpdateBooking}
            />
        </div>
    );
}
