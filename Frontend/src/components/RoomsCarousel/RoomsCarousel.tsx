import {useEffect, useMemo, useRef} from 'react';
import classNames from 'classnames';
import {Carousel} from '@mantine/carousel';
import Autoplay from 'embla-carousel-autoplay';
import RoomCard from '@/components/RoomCard/RoomCard';
import '@/components/RoomsCarousel/RoomsCarousel.css';
import {GetRoomResponse} from "@/models/GetRoomResponse";

interface RoomsCarouselProps {
    rooms: GetRoomResponse[];
    selectedRoomId: string | null;
    occupiedUntilMap?: Record<string, string | null>;
    onSelect: (room: GetRoomResponse) => void;
    onFetch: () => void;
}

export default function RoomsCarousel({
                                          rooms,
                                          selectedRoomId,
                                          occupiedUntilMap,
                                          onSelect,
                                          onFetch
                                      }: RoomsCarouselProps) {
    const autoplayRef = useRef(Autoplay({delay: 2000, stopOnInteraction: false}));
    const plugins = useMemo(() => [autoplayRef.current], []);

    useEffect(() => {
        onFetch();
    }, [onFetch]);

    const slides = useMemo(
        () =>
            rooms.map((room) => (
                <Carousel.Slide key={room.id}>
                    <div
                        className={classNames('rooms-carousel__slide', {'rooms-carousel__slide--selected': selectedRoomId === room.id})}
                    >
                        <RoomCard
                            room={room}
                            occupiedUntil={occupiedUntilMap?.[room.id] ?? null}
                            selected={selectedRoomId === room.id}
                            onClick={() => onSelect(room)}
                        />
                    </div>
                </Carousel.Slide>
            )),
        [rooms, selectedRoomId, occupiedUntilMap, onSelect]
    );

    return (
        <Carousel
            slideSize={{base: '158px', md: '308px'}}
            slideGap={{base: 5, md: 'lg'}}
            orientation="horizontal"
            withControls={false}
            withIndicators={false}
            plugins={plugins}
            emblaOptions={{loop: true, align: 'start', watchDrag: false, slidesToScroll: 1}}
            className="rooms-carousel"
        >
            {slides}
        </Carousel>
    );
}
