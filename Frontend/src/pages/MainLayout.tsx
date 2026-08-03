import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router';
import { Title, Text, Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import Navbar from '@/components/Navbar/Navbar';
import BookingModal from '@/components/BookingModal/BookingModal';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUserAsync, logoutAsync } from '@/store/actions/userActions';
import { fetchRoomsAsync } from '@/store/actions/roomsActions';
import { createBookingAsync, updateBookingAsync } from '@/store/actions/bookingsActions';
import { CreateBookingRequest, UpdateBookingRequest } from '@/services/BookingService';
import "@/pages/MainLayout.css"
import {PlusIcon} from "@phosphor-icons/react";

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const imageUrl = useAppSelector((state) => state.user.imageUrl);
  const rooms = useAppSelector((state) => state.rooms.rooms);
  const userId = user?.id ?? null;
  const [bookingModalOpened, { open: openBookingModal, close: closeBookingModal }] = useDisclosure(false);

  useEffect(() => {
    dispatch(fetchUserAsync()).catch(() => {
    //потом что-то внятное добавить
    });
  }, [dispatch]);

  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logoutAsync());
    } catch {
      notifications.show({ color: 'red', message: 'Произошла ошибка при выходе из аккаунта' });
    } finally {
      navigate('/authentication');
    }
  }, [dispatch, navigate]);

  const handleFetchRooms = useCallback(() => {
    dispatch(fetchRoomsAsync()).catch(() => {
      notifications.show({ color: 'red', message: 'Произошла ошибка при загрузке комнат' });
    });
  }, [dispatch]);

  const handleCreateBooking = useCallback(
    async (request: CreateBookingRequest) => {
      await dispatch(createBookingAsync(request));
    },
    [dispatch]
  );

  const handleUpdateBooking = useCallback(
    async (id: string, request: UpdateBookingRequest) => {
      await dispatch(updateBookingAsync(id, request));
    },
    [dispatch]
  );

  return (
    <div className="main-layout">
      <Navbar
        firstName={user?.firstName ?? 'Гость'}
        lastName={user?.lastName ?? ''}
        imageUrl={imageUrl}
        onLogout={handleLogout}
      />

    <div className="main-layout__content">
          {location.pathname === '/' && (
            <div className="main-layout__header">
              <div>
                <Title className="main-layout__greeting" order={2}>
                  Доброго времени суток, {user?.firstName ?? 'Гость'}!
                </Title>
                <Text
                    c="dimmed"
                    mt={4}
                >
                  Найдите и забронируйте переговорную комнату
                </Text>
              </div>
              <Button className="main-layout__add-btn" size="lg" onClick={openBookingModal}><PlusIcon className="add-btn__plus" weight="bold" color="white" size="1.5em"/> Новое бронирование</Button>
            </div>
          )}

        <main>
          <Outlet />
        </main>
      </div>

      <BookingModal
        opened={bookingModalOpened}
        isEditing={false}
        onClose={closeBookingModal}
        rooms={rooms}
        userId={userId}
        onFetchRooms={handleFetchRooms}
        onCreate={handleCreateBooking}
        onUpdate={handleUpdateBooking}
      />
    </div>
  );
}
