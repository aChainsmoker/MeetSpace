import { Badge, Card, Group, Image, Text } from '@mantine/core';
import { MapPinIcon, UserIcon } from '@phosphor-icons/react';
import '@/components/RoomCard/RoomCard.css';
import { GetRoomResponse } from '@/models/GetRoomResponse';

interface RoomCardProps {
    room: GetRoomResponse;
    occupiedUntil?: string | null;
    onClick?: () => void;
}

export default function RoomCard({
    room,
    occupiedUntil,
    onClick,
}: RoomCardProps) {
    return (
        <Card
            w={{ base: 150, md: 300 }}
            withBorder
            radius="md"
            shadow="sm"
            padding="lg"
            onClick={onClick}
            className="room-card"
        >
            <Card.Section>
                <Image
                    src={room.photo}
                    h={{ base: 80, md: 160 }}
                    alt={room.name}
                />
            </Card.Section>
            <Text fw={500} size="md" mt="sm" lineClamp={1}>
                {room.name}
            </Text>
            <Group className="room-card__data" mt={4}>
                <Group gap="0.25em">
                    <UserIcon size={14} />
                    <Text size="sm" c="dimmed">
                        {room.capacity} мест
                    </Text>
                </Group>
                <Group gap="0.25em">
                    <MapPinIcon size={14} />
                    <Text size="sm" c="dimmed">
                        {room.floor} этаж
                    </Text>
                </Group>
            </Group>
            <Badge
                mt="sm"
                color={occupiedUntil ? 'yellow' : 'green'}
                variant="filled"
            >
                {occupiedUntil ? 'Занята' : 'Свободно'}
            </Badge>
        </Card>
    );
}
