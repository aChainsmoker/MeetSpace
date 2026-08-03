import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { notifications } from '@mantine/notifications';
import { WeekView, ScheduleEventData } from '@mantine/schedule';
import { GetBookingResponse } from '@/services/BookingService';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchBookingsByDateRangeAsync } from '@/store/actions/bookingsActions';
import '@/pages/CalendarPage.css';

function toEvent(booking: GetBookingResponse, currentUserId: string | null): ScheduleEventData {
  const start = dayjs(booking.startOfBookingTime);
  const end = dayjs(booking.endOfBookingTime);

  return {
    id: booking.id,
    title: booking.title,
    start: start.format('YYYY-MM-DD HH:mm:ss'),
    end: end.format('YYYY-MM-DD HH:mm:ss'),
    color: currentUserId === booking.userId ? 'blue' : 'orange',
  };
}

export default function CalendarPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const currentUserId = user?.id ?? null;
  const dateRangeBookings = useAppSelector((state) => state.bookings.dateRangeBookings);
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));

  useEffect(() => {
    const start = dayjs(date).startOf('week').add(1, 'day');
    const end = start.add(6, 'day');

    dispatch(fetchBookingsByDateRangeAsync(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'))).catch(
      () => {
        notifications.show({ color: 'red', message: 'Произошла ошибка при загрузке бронирований' });
      }
    );
  }, [date, currentUserId, dispatch]);

  const events = dateRangeBookings.map((b) => toEvent(b, currentUserId));

  return (
    <div className="calendar-page">
      <WeekView
        date={date}
        onDateChange={setDate}
        events={events}
        startTime="09:00:00"
        endTime="18:00:00"
        withAgenda
        highlightToday
      />
    </div>
  );
}
