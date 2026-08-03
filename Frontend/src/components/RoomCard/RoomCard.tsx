import {Card, Text, Badge, Group, Image} from '@mantine/core';
import {UserIcon, MapPinIcon} from '@phosphor-icons/react';
import {GetRoomResponse} from '@/services/RoomService';

interface RoomCardProps {
    room: GetRoomResponse;
    occupiedUntil?: string | null;
    onClick?: () => void;
    selected?: boolean;
}

export default function RoomCard({room, occupiedUntil, onClick, selected}: RoomCardProps) {
    return (
        <Card
            w={300}
            withBorder
            radius="md"
            shadow="sm"
            padding="lg"
            onClick={onClick}
            style={{
                cursor: 'pointer',
            }}
        >
            <Card.Section>
                <Image src={room.photo} h={160} alt={room.name}/>
            </Card.Section>

            <Text fw={500} size="md" mt="sm" lineClamp={1}>
                {room.name}
            </Text>

            <Group gap="lg" mt={4}>
                <Group gap="0.25em">
                    <UserIcon size={14}/>
                    <Text size="sm" c="dimmed">{room.capacity} мест</Text>
                </Group>
                <Group gap="0.25em">
                    <MapPinIcon size={14}/>
                    <Text size="sm" c="dimmed">{room.floor} этаж</Text>
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
