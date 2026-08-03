import { useEffect, useRef, useMemo } from 'react';
import { Carousel } from '@mantine/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { GetRoomResponse } from '@/services/RoomService';
import RoomCard from '@/components/RoomCard/RoomCard';

interface RoomsCarouselProps {
  rooms: GetRoomResponse[];
  selectedRoomId: string | null;
  occupiedUntilMap?: Record<string, string | null>;
  onSelect: (room: GetRoomResponse) => void;
  onFetch: () => void;
}

export default function RoomsCarousel({ rooms, selectedRoomId, occupiedUntilMap, onSelect, onFetch }: RoomsCarouselProps) {
  const autoplayRef = useRef(Autoplay({ delay: 2000, stopOnInteraction: false }));
  const plugins = useMemo(() => [autoplayRef.current], []);

  useEffect(() => {
    onFetch();
  }, [onFetch]);

  const slides = rooms.map((room) => (
    <Carousel.Slide key={room.id}>
      <div
        style={{
          padding: 4,
          borderRadius: 'var(--mantine-radius-md)',
          background: selectedRoomId === room.id ? '#228be6' : 'transparent',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <RoomCard
          room={room}
          occupiedUntil={occupiedUntilMap?.[room.id] ?? null}
          selected={selectedRoomId === room.id}
          onClick={() => onSelect(room)}
        />
      </div>
    </Carousel.Slide>
  ));

  return (
    <Carousel
      height={300}
      slideSize="308px"
      slideGap="lg"
      orientation="horizontal"
      withControls={false}
      withIndicators={false}
      plugins={plugins}
      emblaOptions={{ loop: true, align: 'start', watchDrag: false, slidesToScroll: 1 }}
      className="rooms-carousel"
    >
      {slides}
    </Carousel>
  );
}
