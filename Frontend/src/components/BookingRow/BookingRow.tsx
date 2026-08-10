import {ActionIcon, Group, Paper, Text} from '@mantine/core';
import {PencilIcon, TrashIcon} from '@phosphor-icons/react';
import '@/components/BookingRow/BookingRow.css';
import {GetBookingResponse} from "@/models/GetBookingResponse";

interface BookingRowProps {
    booking: GetBookingResponse;
    onEdit: () => void;
    onDelete: () => void;
}

function formatDate(dateStr: string) {
    return new Date(`${dateStr}T00:00:00`).toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

function formatTime(time: string) {
    return time.slice(0, 5);
}

export default function BookingRow({booking, onEdit, onDelete}: BookingRowProps) {
    return (
        <Paper
            className="booking-row"
            withBorder
            radius="md"
            shadow="sm"
            p="lg"
        >
            <Group
                justify="space-between"
                align="center"
                gap="lg"
                w="100%"
            >
                <div className="booking-row__info">
                    <Text
                        fw={600}
                        size="md"
                    >
                        {booking.room.name}
                    </Text>
                    <Text
                        className="booking-row__meta"
                        size="sm"
                        c="dimmed"
                    >
                        {formatDate(booking.bookingDate)} • {formatTime(booking.startOfBookingTime)} – {formatTime(booking.endOfBookingTime)}
                    </Text>
                    <Text
                        className="booking-row__title"
                        size="sm"
                        c="dimmed"
                        mt={4}
                    >
                        {booking.title}
                    </Text>
                </div>
                <Group gap="xs">
                    <ActionIcon
                        variant="subtle"
                        color="gray"
                        onClick={onEdit}
                        aria-label="Редактировать"
                    >
                        <PencilIcon size={18}/>
                    </ActionIcon>
                    <ActionIcon
                        variant="subtle"
                        color="gray"
                        onClick={onDelete}
                        aria-label="Удалить"
                    >
                        <TrashIcon
                            color="red"
                            size={18}
                        />
                    </ActionIcon>
                </Group>
            </Group>
        </Paper>
    );
}