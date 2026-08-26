import { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Button, Loader } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { DayView, MonthView, ScheduleEventData } from '@mantine/schedule';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchBookingsByDateRangeAsync } from '@/store/actions/bookingsActions';
import '@/pages/CalendarPage.css';
import { GetBookingResponse } from '@/models/GetBookingResponse';

const START_TIME = '09:00:00';
const END_TIME = '18:00:00';
const INTERVAL_MINUTES = 15;
const HOURS =
    parseInt(END_TIME.slice(0, 2), 10) - parseInt(START_TIME.slice(0, 2), 10);
const SLOT_BORDER_ALLOWANCE = HOURS * (60 / INTERVAL_MINUTES);

function toEvent(
    booking: GetBookingResponse,
    currentUserId: string | null
): ScheduleEventData {
    return {
        id: booking.id,
        title: booking.title,
        start: `${booking.bookingDate} ${booking.startOfBookingTime}`,
        end: `${booking.bookingDate} ${booking.endOfBookingTime}`,
        color:
            currentUserId === booking.userId
                ? 'var(--blue-color)'
                : 'var(--orange-color)',
    };
}

export default function CalendarPage() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user.user);
    const currentUserId = user?.id ?? null;
    const dateRangeBookings = useAppSelector(
        (state) => state.bookings.dateRangeBookings
    );
    const isLoading = useAppSelector((state) => state.bookings.isLoading);
    const [view, setView] = useState<'month' | 'day'>('month');
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const { ref: dayRef, height: dayHeight } = useElementSize();

    useEffect(() => {
        const start = dayjs(date).startOf('month').format('YYYY-MM-DD');
        const end = dayjs(date).endOf('month').format('YYYY-MM-DD');

        dispatch(fetchBookingsByDateRangeAsync(start, end)).catch(() => {
            notifications.show({
                color: 'var(--red-color)',
                message: 'Произошла ошибка при загрузке бронирований',
            });
        });
    }, [date, dispatch]);

    const handleDayClick = useCallback((day: string) => {
        setSelectedDay(day);
        setView('day');
    }, []);

    const handleBackToMonth = useCallback(() => {
        setView('month');
        setSelectedDay(null);
    }, []);

    const monthEvents = useMemo(
        () => dateRangeBookings.map((b) => toEvent(b, currentUserId)),
        [dateRangeBookings, currentUserId]
    );

    const dayEvents = useMemo(
        () =>
            dateRangeBookings
                .filter((b) => b.bookingDate === selectedDay)
                .map((b) => toEvent(b, currentUserId)),
        [dateRangeBookings, selectedDay, currentUserId]
    );

    const slotHeight = useMemo(
        () =>
            Math.max(
                Math.floor((dayHeight - SLOT_BORDER_ALLOWANCE) / HOURS),
                70
            ),
        [dayHeight]
    );

    if (view === 'day' && selectedDay) {
        return (
            <div className="calendar-page calendar-page--day">
                <div className="calendar-page__day" ref={dayRef}>
                    {isLoading ? (
                        <div className="calendar-page__loader">
                            <Loader />
                        </div>
                    ) : (
                        <DayView
                            withAllDaySlot={false}
                            slotHeight={slotHeight}
                            intervalMinutes={INTERVAL_MINUTES}
                            date={selectedDay}
                            events={dayEvents}
                            startTime={START_TIME}
                            endTime={END_TIME}
                            withHeader={false}
                            mode="static"
                            classNames={{
                                event: 'calendar-page__schedule-event',
                            }}
                            scrollAreaProps={{ mah: dayHeight || undefined }}
                            renderEventBody={(event) => (
                                <div
                                    className={`calendar-page__event calendar-page__event--${event.color}`}
                                >
                                    <span className="calendar-page__event-title">
                                        {event.title}
                                    </span>
                                    <span className="calendar-page__event-time">
                                        {dayjs(event.start).format('HH:mm')} -{' '}
                                        {dayjs(event.end).format('HH:mm')}
                                    </span>
                                </div>
                            )}
                        />
                    )}
                </div>
                <Button
                    className="calendar-page__back"
                    fullWidth
                    size="lg"
                    onClick={handleBackToMonth}
                >
                    Вернуться
                </Button>
            </div>
        );
    }

    return (
        <div className="calendar-page">
            <MonthView
                date={date}
                onDateChange={setDate}
                onDayClick={handleDayClick}
                events={monthEvents}
                withHeader={false}
            />
        </div>
    );
}
