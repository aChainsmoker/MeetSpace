import { useEffect, useMemo, useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import {
    Accordion,
    Badge,
    Button,
    CloseButton,
    Group,
    Image,
    Paper,
    Text,
} from '@mantine/core';
import {
    CaretRightIcon,
    ChalkboardSimpleIcon,
    FanIcon,
    MapPinIcon,
    MonitorIcon,
    UserIcon,
    VideoCameraIcon,
    VideoConferenceIcon,
    WifiHighIcon,
} from '@phosphor-icons/react';
import '@/components/RoomDetailCard/RoomDetailCard.css';
import { GetBookingResponse } from '@/models/GetBookingResponse';
import { GetRoomResponse } from '@/models/GetRoomResponse';

interface RoomDetailCardProps {
    room: GetRoomResponse;
    detailedRoom: GetRoomResponse | null;
    bookings: GetBookingResponse[];
    onClose: () => void;
    onFetchDetail: (id: string) => void;
    onFetchBookings: (id: string) => void;
    onBook: () => void;
}

const amenityIcon: Record<string, React.ReactNode> = {
    Проектор: <VideoCameraIcon size={24} />,
    Доска: <ChalkboardSimpleIcon size={24} />,
    Телевизор: <MonitorIcon size={24} />,
    ВКС: <VideoConferenceIcon size={24} />,
    'Wi-Fi': <WifiHighIcon size={24} />,
    Кондиционер: <FanIcon size={24} />,
};

function formatBookingDate(dateStr: string) {
    const date = new Date(`${dateStr}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    const diff = (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

    const day = date.toLocaleString('ru-RU', { day: 'numeric', month: 'long' });

    if (diff === 0) return `сегодня, ${day}`;
    if (diff === 1) return `завтра, ${day}`;
    return day;
}

function formatTimeRange(start: string, end: string) {
    const fmt = (t: string) => t.slice(0, 5);
    return `${fmt(start)} – ${fmt(end)}`;
}

export default function RoomDetailCard({
    room,
    detailedRoom,
    bookings,
    onClose,
    onFetchDetail,
    onFetchBookings,
    onBook,
}: RoomDetailCardProps) {
    const isMobile = useMediaQuery('(max-width: 48em)');
    const [showAllAmenities, setShowAllAmenities] = useState(false);
    const [visibleBookingCount, setVisibleBookingCount] = useState(3);

    useEffect(() => {
        if (!isMobile) return;
        const { overflow } = document.body.style;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = overflow;
        };
    }, [isMobile]);

    useEffect(() => {
        onFetchDetail(room.id);
    }, [room.id, onFetchDetail]);

    useEffect(() => {
        onFetchBookings(room.id);
    }, [room.id, onFetchBookings]);

    const equip = detailedRoom?.roomEquipments ?? [];
    const hasManyAmenities = equip.length > 4;
    const visibleAmenities = showAllAmenities ? equip : equip.slice(0, 4);
    const [now] = useState(() => Date.now());

    const futureBookings = useMemo(() => {
        return bookings
            .filter(
                (b) =>
                    new Date(
                        `${b.bookingDate}T${b.endOfBookingTime}`,
                    ).getTime() > now,
            )
            .sort(
                (a, b) =>
                    new Date(
                        `${a.bookingDate}T${a.startOfBookingTime}`,
                    ).getTime() -
                    new Date(
                        `${b.bookingDate}T${b.startOfBookingTime}`,
                    ).getTime(),
            );
    }, [bookings, now]);

    const visibleBookings = useMemo(
        () => futureBookings.slice(0, visibleBookingCount),
        [futureBookings, visibleBookingCount],
    );

    const handleShowMoreBookings = () => {
        setVisibleBookingCount((prev) => prev + 3);
    };

    return (
        <Paper
            className="room-detail-card"
            withBorder
            radius="md"
            shadow="sm"
            p={0}
        >
            <div className="room-detail-card__image-wrapper">
                <Image
                    src={room.photo}
                    alt={room.name}
                    className="room-detail-card__image"
                />
                <CloseButton
                    className="room-detail-card__close"
                    size="md"
                    radius="xl"
                    variant="transparent"
                    onClick={onClose}
                    aria-label="Закрыть"
                />
            </div>
            <div className="room-detail-card__body">
                <Text fw={600} size="lg">
                    {room.name}
                </Text>
                <Group gap="lg" mt={4}>
                    <Group gap="0.25em">
                        <UserIcon size={16} />
                        <Text size="sm" c="dimmed">
                            {room.capacity} мест
                        </Text>
                    </Group>
                    <Group gap="0.25em">
                        <MapPinIcon size={16} />
                        <Text size="sm" c="dimmed">
                            {room.floor} этаж
                        </Text>
                    </Group>
                </Group>
                <div className="room-detail-card__section">
                    <Text fw={600} size="sm" mb="xs">
                        Удобства
                    </Text>
                    <div className="room-detail-card__amenities">
                        {visibleAmenities.map((eq) => (
                            <div
                                key={eq.id}
                                className="room-detail-card__amenity"
                            >
                                {amenityIcon[eq.name] ?? null}
                                <Text size="xs">{eq.name}</Text>
                            </div>
                        ))}
                    </div>
                    {hasManyAmenities && (
                        <Button
                            variant="subtle"
                            color="blue"
                            size="compact-sm"
                            onClick={() => setShowAllAmenities((prev) => !prev)}
                            p={0}
                        >
                            {showAllAmenities ? 'скрыть' : 'показать всё'}
                        </Button>
                    )}
                </div>
                <div className="room-detail-card__section">
                    <Text fw={600} size="sm" mb="xs">
                        Ближайшие бронирования
                    </Text>
                    {visibleBookings.length === 0 && (
                        <Text size="sm" c="dimmed">
                            Нет ближайших бронирований
                        </Text>
                    )}
                    <Accordion chevron={<CaretRightIcon size={16} />}>
                        {visibleBookings.map((b) => (
                            <Accordion.Item key={b.id} value={b.id}>
                                <Accordion.Control>
                                    <div className="room-detail-card__booking-row">
                                        <div className="room-detail-card__booking-left">
                                            <Text size="sm" c="dimmed">
                                                {formatBookingDate(
                                                    b.bookingDate,
                                                )}
                                            </Text>
                                            <Text size="sm">
                                                {formatTimeRange(
                                                    b.startOfBookingTime,
                                                    b.endOfBookingTime,
                                                )}
                                            </Text>
                                        </div>
                                        <Badge variant="light" color="orange">
                                            забронировано
                                        </Badge>
                                    </div>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <Text fw={500} size="md">
                                        {b.title}
                                    </Text>
                                    <Text size="sm" c="dimmed" mt={4}>
                                        {b.description}
                                    </Text>
                                </Accordion.Panel>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                    {futureBookings.length > visibleBookingCount && (
                        <Button
                            variant="subtle"
                            color="blue"
                            size="compact-sm"
                            onClick={handleShowMoreBookings}
                            p={0}
                            mt="xs"
                        >
                            показать больше
                        </Button>
                    )}
                </div>
            </div>
            <div className="room-detail-card__footer">
                <Button
                    fullWidth
                    color="var(--button-submit)"
                    size="lg"
                    onClick={onBook}
                >
                    Забронировать
                </Button>
            </div>
        </Paper>
    );
}
