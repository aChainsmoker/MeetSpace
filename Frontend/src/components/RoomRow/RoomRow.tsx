import { Group, Paper, Text } from '@mantine/core';
import { MapPinIcon, UserIcon } from '@phosphor-icons/react';
import '@/components/RoomRow/RoomRow.css';
import { GetRoomResponse } from '@/models/GetRoomResponse';

interface RoomRowProps {
    room: GetRoomResponse;
    occupiedUntil: string | null;
    onClick: () => void;
}

function formatTime(time: string) {
    return time.slice(0, 5);
}

export default function RoomRow({
    room,
    occupiedUntil,
    onClick,
}: RoomRowProps) {
    return (
        <Paper
            className="room-row"
            withBorder
            radius="md"
            shadow="sm"
            p="lg"
            onClick={onClick}
        >
            <Group justify="space-between" align="center" gap="lg" w="100%">
                <div className="room-row__info">
                    <Text fw={600} size="md">
                        {room.name}
                    </Text>
                    <Group gap="lg" mt={4}>
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
                </div>
                <Text
                    className="room-row__status"
                    fw={600}
                    size="sm"
                    c={occupiedUntil ? 'red' : 'green'}
                >
                    {occupiedUntil
                        ? `Занята до ${formatTime(occupiedUntil)}`
                        : 'Свободна'}
                </Text>
            </Group>
        </Paper>
    );
}
