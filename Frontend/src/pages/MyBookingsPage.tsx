import { useCallback, useEffect, useState } from 'react';
import { Tabs, Button, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { PlusIcon } from '@phosphor-icons/react';
import BookingRow from '@/components/BookingRow/BookingRow';
import BookingModal from '@/components/BookingModal/BookingModal';
import { GetBookingResponse, CreateBookingRequest, UpdateBookingRequest } from '@/services/BookingService';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUserBookingsAsync, createBookingAsync, updateBookingAsync, deleteBookingAsync } from '@/store/actions/bookingsActions';
import { fetchRoomsAsync } from '@/store/actions/roomsActions';
import '@/pages/MyBookingsPage.css';

export default function MyBookingsPage() {
  const dispatch = useAppDispatch();
  const bookings = useAppSelector((state) => state.bookings.userBookings);
  const rooms = useAppSelector((state) => state.rooms.rooms);
  const userId = useAppSelector((state) => state.user.user?.id ?? null);
  const [modalOpened, setModalOpened] = useState(false);
  const [editingBooking, setEditingBooking] = useState<GetBookingResponse | null>(null);

  const loadBookings = useCallback(() => {
    dispatch(fetchUserBookingsAsync()).catch(() => {
      notifications.show({ color: 'red', message: 'Произошла ошибка при загрузке ваших бронирований' });
    });
  }, [dispatch]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const now = Date.now();
  const upcoming = bookings.filter((b) => new Date(b.endOfBookingTime).getTime() > now);
  const past = bookings.filter((b) => new Date(b.endOfBookingTime).getTime() <= now);

  const handleCreate = useCallback(() => {
    setEditingBooking(null);
    setModalOpened(true);
  }, []);

  const handleEdit = useCallback((booking: GetBookingResponse) => {
    setEditingBooking(booking);
    setModalOpened(true);
  }, []);

  const handleDelete = useCallback((booking: GetBookingResponse) => {
    dispatch(deleteBookingAsync(booking.id))
      .then(() =>
        dispatch(fetchUserBookingsAsync()).catch(() => {
          notifications.show({ color: 'red', message: 'Произошла ошибка при загрузке ваших бронирований' });
        })
      )
      .catch(() => {
        notifications.show({ color: 'red', message: 'Произошла ошибка при удалении бронирования' });
      });
  }, [dispatch]);

  const handleFetchRooms = useCallback(() => {
    dispatch(fetchRoomsAsync()).catch(() => {
      notifications.show({ color: 'red', message: 'Произошла ошибка при загрузке комнат' });
    });
  }, [dispatch]);

  const handleCreateBooking = useCallback(
    async (request: CreateBookingRequest) => {
      await dispatch(createBookingAsync(request));
      dispatch(fetchUserBookingsAsync()).catch(() => {
        notifications.show({ color: 'red', message: 'Произошла ошибка при загрузке ваших бронирований' });
      });
    },
    [dispatch]
  );

  const handleUpdateBooking = useCallback(
    async (id: string, request: UpdateBookingRequest) => {
      await dispatch(updateBookingAsync(id, request));
      dispatch(fetchUserBookingsAsync()).catch(() => {
        notifications.show({ color: 'red', message: 'Произошла ошибка при загрузке ваших бронирований' });
      });
    },
    [dispatch]
  );

  const renderList = (items: GetBookingResponse[]) =>
    items.length === 0 ? (
      <Text c="dimmed">Нет бронирований</Text>
    ) : (
      <div className="bookings-page__list">
        {items.map((booking) => (
          <BookingRow
            key={booking.id}
            booking={booking}
            onEdit={() => handleEdit(booking)}
            onDelete={() => handleDelete(booking)}
          />
        ))}
      </div>
    );

  return (
    <div className="bookings-page">
      <Tabs color="blue" defaultValue="upcoming" keepMounted={false}>
        <Tabs.List>
          <Tabs.Tab value="upcoming">Предстоящие</Tabs.Tab>
          <Tabs.Tab value="past">Прошедшие</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="upcoming" pt="md">
          {renderList(upcoming)}
        </Tabs.Panel>

        <Tabs.Panel value="past" pt="md">
          {renderList(past)}
        </Tabs.Panel>
      </Tabs>

      <Button className="bookings-page__fab" size="lg" onClick={handleCreate}>
        <PlusIcon className="bookings-page__fab-plus" weight="bold" color="white" size="1.5em" />
        Новая бронь
      </Button>

      <BookingModal
        opened={modalOpened}
        isEditing={editingBooking !== null}
        booking={editingBooking}
        onClose={() => setModalOpened(false)}
        rooms={rooms}
        userId={userId}
        onFetchRooms={handleFetchRooms}
        onCreate={handleCreateBooking}
        onUpdate={handleUpdateBooking}
      />
    </div>
  );
}
