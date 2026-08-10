import {useEffect, useMemo, useRef, useState} from 'react';
import dayjs from 'dayjs';
import {Badge, HoverCard, UnstyledButton} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {ResourcesDayView} from '@mantine/schedule';
import '@/components/Scheduler/Scheduler.css';
import {GetBookingResponse} from "@/models/GetBookingResponse";
import {BookingsFilter} from "@/models/BookingsFilter";

interface SchedulerProps {
    date?: string;
    startTime?: string;
    endTime?: string;
    filter?: BookingsFilter;
    bookings: GetBookingResponse[];
    currentUserId: string | null;
    onFetchBookings: (filter: BookingsFilter) => void;
    onEventClick?: (booking: GetBookingResponse) => void;
}

export default function Scheduler({
                                      date,
                                      startTime,
                                      endTime,
                                      filter,
                                      bookings,
                                      currentUserId,
                                      onFetchBookings,
                                      onEventClick,
                                  }: SchedulerProps) {
    const effectiveStart = `${startTime || '09:00'}:00`;
    const effectiveEnd = `${endTime || '18:59'}:00`;
    const [containerWidth, setContainerWidth] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setContainerWidth(entry.contentRect.width);
            }
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        onFetchBookings(filter ?? {});
    }, [filter, onFetchBookings]);

    const dateStr = date ?? new Date().toISOString().split('T')[0];

    const resources = useMemo(() => {
        const seen = new Map<string, GetBookingResponse['room']>();
        for (const b of bookings) {
            if (!seen.has(b.room.id)) {
                seen.set(b.room.id, b.room);
            }
        }
        return Array.from(seen.values()).map((room) => ({
            id: room.id,
            label: room.name,
            payload: {photo: room.photo, capacity: room.capacity},
        }));
    }, [bookings]);

    const events = useMemo(() => {
        return bookings.map((b) => ({
            id: b.id,
            title: b.title,
            start: `${b.bookingDate} ${b.startOfBookingTime}`,
            end: `${b.bookingDate} ${b.endOfBookingTime}`,
            resourceId: b.room.id,
            color: 'blue',
            payload: {isOwn: currentUserId === b.userId, booking: b},
        }));
    }, [bookings, currentUserId]);

    const isMobile = useMediaQuery('(max-width: 48em)');

    const resourceLabelWidth = isMobile ? 120 : 200;
    const numberOfHours = Math.max(
        Math.floor(
            (Date.parse(`${dateStr}T${effectiveEnd}`) - Date.parse(`${dateStr}T${effectiveStart}`)) / 3_600_000,
        ),
        1,
    );
    const slotWidth = containerWidth
        ? Math.max(Math.floor((containerWidth - resourceLabelWidth) / numberOfHours), 130)
        : 150;

    return (
        <div
            className="scheduler"
            ref={containerRef}
        >
            <ResourcesDayView
                date={dateStr}
                resources={resources}
                events={events}
                startTime={effectiveStart}
                endTime={effectiveEnd}
                rowHeight={80}
                slotWidth={slotWidth}
                withHeader={false}
                highlightBusinessHours
                businessHours={['00:00:00', '23:59:59']}
                mode="static"
                labels={{resources: ''}}
                styles={{
                    resourcesDayView: {
                        '--resources-day-view-resource-label-width': `${resourceLabelWidth}px`,
                    },
                    resourcesDayViewResourceLabel: {
                        justifyContent: 'flex-start',
                        paddingInlineStart: '8px',
                    },
                }}
                renderResourceLabel={(resource) => (
                    <div className="scheduler__channel">
                        <img
                            className="scheduler__channel-image"
                            src={resource.payload?.photo as string | undefined}
                            alt={String(resource.label)}
                        />
                        <div className="scheduler__channel-info">
                            <span className="scheduler__channel-name">{resource.label}</span>
                            <span
                                className="scheduler__channel-capacity">{String(resource.payload?.capacity)} мест</span>
                        </div>
                    </div>
                )}
                renderEvent={(event, {children: _children, ...eventProps}) => (
                    <HoverCard
                        width={280}
                        position="bottom"
                        closeDelay={0}
                        transitionProps={{duration: 0}}
                    >
                        <HoverCard.Target>
                            <UnstyledButton
                                {...eventProps}
                                className="scheduler__event"
                                data-own={event.payload?.isOwn === true || undefined}
                                onClick={() => {
                                    if (event.payload?.booking) {
                                        onEventClick?.(event.payload.booking);
                                    }
                                }}
                            >
                                <span className="scheduler__event-title">{event.title}</span>
                                <span className="scheduler__event-time">
                  {dayjs(event.start).format('HH:mm')} - {dayjs(event.end).format('HH:mm')}
                </span>
                            </UnstyledButton>
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                            <div className="scheduler__event-card">
                                <span className="scheduler__event-card-title">{event.title}</span>
                                <span className="scheduler__event-card-time">
                  {dayjs(event.start).format('DD.MM.YYYY, HH:mm')} -{' '}
                                    {dayjs(event.end).format('HH:mm')}
                </span>
                                <span className="scheduler__event-card-description">
                  {event.payload?.booking?.description}
                </span>
                            </div>
                        </HoverCard.Dropdown>
                    </HoverCard>
                )}
            />
            <div className="scheduler__legend">
                <Badge
                    color="blue"
                    variant="light"
                >Ваша бронь</Badge>
                <Badge
                    color="orange"
                    variant="light"
                >Забронировано</Badge>
            </div>
        </div>
    );
}