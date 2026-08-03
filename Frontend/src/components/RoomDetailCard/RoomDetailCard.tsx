import { useEffect, useState, useMemo } from 'react';
import { Paper, Text, Group, Image, CloseButton, Badge, Button, Accordion, Flex } from '@mantine/core';
import { UserIcon, MapPinIcon, VideoCameraIcon, ChalkboardSimpleIcon, MonitorIcon, VideoConferenceIcon, WifiHighIcon, FanIcon, CaretRightIcon } from '@phosphor-icons/react';
import { GetRoomResponse } from '@/services/RoomService';
import { GetBookingResponse } from '@/services/BookingService';
import '@/components/RoomDetailCard/RoomDetailCard.css';

interface RoomDetailCardProps {
  room: GetRoomResponse;
  detailedRoom: GetRoomResponse | null;
  bookings: GetBookingResponse[];
  onClose: () => void;
  onFetchDetail: (id: string) => void;
  onFetchBookings: (id: string) => void;
}

const amenityIcon: Record<string, React.ReactNode> = {
  'Проектор': <VideoCameraIcon size={24} />,
  'Доска': <ChalkboardSimpleIcon size={24} />,
  'Телевизор': <MonitorIcon size={24} />,
  'ВКС': <VideoConferenceIcon size={24} />,
  'Wi-Fi': <WifiHighIcon size={24} />,
  'Кондиционер': <FanIcon size={24} />,
};

function formatBookingDate(dateStr: string) {
  const date = new Date(dateStr);
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
  const fmt = (s: string) => new Date(s).toLocaleString('ru-RU', { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${fmt(start)} – ${fmt(end)}`;
}

export default function RoomDetailCard({ room, detailedRoom, bookings, onClose, onFetchDetail, onFetchBookings }: RoomDetailCardProps) {
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [visibleBookingCount, setVisibleBookingCount] = useState(3);

  useEffect(() => {
    onFetchDetail(room.id);
  }, [room.id, onFetchDetail]);

  useEffect(() => {
    onFetchBookings(room.id);
  }, [room.id, onFetchBookings]);

  const equip = detailedRoom?.roomEquipments ?? [];
  const hasManyAmenities = equip.length > 4;
  const visibleAmenities = showAllAmenities ? equip : equip.slice(0, 4);

  const futureBookings = useMemo(() => {
    const now = new Date();
    return bookings
      .filter((b) => new Date(b.endOfBookingTime) > now)
      .sort((a, b) => new Date(a.startOfBookingTime).getTime() - new Date(b.startOfBookingTime).getTime());
  }, [bookings]);

  const visibleBookings = useMemo(() => futureBookings.slice(0, visibleBookingCount), [futureBookings, visibleBookingCount]);

  const handleShowMoreBookings = () => {
    setVisibleBookingCount((prev) => prev + 3);
  };

  return (
    <Paper className="room-detail-card" withBorder radius="md" shadow="sm" p={0}>
      <div className="room-detail-card__image-wrapper">
        <Image src={room.photo} alt={room.name} className="room-detail-card__image" />
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
        <Text fw={600} size="lg">{room.name}</Text>

        <Group gap="lg" mt={4}>
          <Group gap="0.25em">
            <UserIcon size={16} />
            <Text size="sm" c="dimmed">{room.capacity} мест</Text>
          </Group>
          <Group gap="0.25em">
            <MapPinIcon size={16} />
            <Text size="sm" c="dimmed">{room.floor} этаж</Text>
          </Group>
        </Group>

        <div className="room-detail-card__section">
          <Text fw={600} size="sm" mb="xs">Удобства</Text>
          <div className="room-detail-card__amenities">
            {visibleAmenities.map((eq) => (
              <div key={eq.id} className="room-detail-card__amenity">
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
          <Text fw={600} size="sm" mb="xs">Ближайшие бронирования</Text>
          {visibleBookings.length === 0 && (
            <Text size="sm" c="dimmed">Нет ближайших бронирований</Text>
          )}
          <Accordion chevron={<CaretRightIcon size={16} />}>
            {visibleBookings.map((b) => (
              <Accordion.Item key={b.id} value={b.id}>
                <Accordion.Control>
                  <div className="room-detail-card__booking-row">
                    <div className="room-detail-card__booking-left">
                      <Text size="sm" c="dimmed">{formatBookingDate(b.startOfBookingTime)}</Text>
                      <Text size="sm">{formatTimeRange(b.startOfBookingTime, b.endOfBookingTime)}</Text>
                    </div>
                    <Badge variant="light" color="orange">забронировано</Badge>
                  </div>
                </Accordion.Control>
                <Accordion.Panel>
                  <Text fw={500} size="md">{b.title}</Text>
                  <Text size="sm" c="dimmed" mt={4}>{b.description}</Text>
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

        <Button fullWidth color="#0053d4" mt="md" size='lg'>
          Забронировать
        </Button>
      </div>
    </Paper>
  );
}
