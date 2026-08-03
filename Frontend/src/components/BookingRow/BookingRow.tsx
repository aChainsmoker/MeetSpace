import { Paper, Text, Group, ActionIcon } from '@mantine/core';
import { PencilIcon, TrashIcon } from '@phosphor-icons/react';
import { GetBookingResponse } from '@/services/BookingService';
import '@/components/BookingRow/BookingRow.css';

interface BookingRowProps {
  booking: GetBookingResponse;
  onEdit: () => void;
  onDelete: () => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export default function BookingRow({ booking, onEdit, onDelete }: BookingRowProps) {
  return (
    <Paper className="booking-row" withBorder radius="md" shadow="sm" p="lg">
      <Group
        justify="space-between"
        align="center"
        gap="lg"
        w="100%"
      >
        <div className="booking-row__info">
          <Text fw={600} size="md">
            {booking.room.name}
          </Text>
          <Text className="booking-row__meta" size="sm" c="dimmed">
            {formatDate(booking.startOfBookingTime)} • {formatTime(booking.startOfBookingTime)} – {formatTime(booking.endOfBookingTime)}
          </Text>
          <Text className="booking-row__title" size="sm" c="dimmed" mt={4}>
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
            <PencilIcon size={18} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={onDelete}
            aria-label="Удалить"
          >
            <TrashIcon color="#e60a0a" size={18} />
          </ActionIcon>
        </Group>
      </Group>
    </Paper>
  );
}