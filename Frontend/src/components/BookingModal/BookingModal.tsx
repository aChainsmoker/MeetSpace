import { useEffect, useState } from 'react';
import { Button, Group, Modal, Select, Stack, Text, TextInput, Textarea } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { DatePickerInput } from '@mantine/dates';
import { CalendarDotIcon } from '@phosphor-icons/react';
import TimePicker from '@/components/TimePicker/TimePicker';
import { GetRoomResponse } from '@/services/RoomService';
import {
  CreateBookingRequest,
  UpdateBookingRequest,
  GetBookingResponse,
} from '@/services/BookingService';
import { ApiError } from '@/services/apiClient';
import dayjs from 'dayjs';
import '@/components/BookingModal/BookingModal.css';

interface BookingModalProps {
  opened: boolean;
  isEditing: boolean;
  booking?: GetBookingResponse | null;
  onClose: () => void;
  onSaved?: () => void;
  rooms: GetRoomResponse[];
  userId: string | null;
  onFetchRooms: () => void;
  onCreate: (request: CreateBookingRequest) => Promise<void>;
  onUpdate: (id: string, request: UpdateBookingRequest) => Promise<void>;
}

export default function BookingModal({
  opened,
  isEditing,
  booking,
  onClose,
  onSaved,
  rooms,
  userId,
  onFetchRooms,
  onCreate,
  onUpdate,
}: BookingModalProps) {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!opened) return;
    onFetchRooms();
  }, [opened, onFetchRooms]);

  useEffect(() => {
    if (!opened || !isEditing || !booking) return;

    const start = new Date(booking.startOfBookingTime);
    const end = new Date(booking.endOfBookingTime);
    const pad = (n: number) => String(n).padStart(2, '0');

    setRoomId(booking.room.id);
    setDate(dayjs(booking.startOfBookingTime).format('YYYY-MM-DD'));
    setStartTime(`${pad(start.getHours())}:${pad(start.getMinutes())}`);
    setEndTime(`${pad(end.getHours())}:${pad(end.getMinutes())}`);
    setTitle(booking.title);
    setDescription(booking.description ?? '');
    setError('');
  }, [opened, isEditing, booking]);

  const handleSubmit = async () => {
    if (!roomId) {
      setError('Выберите переговорную');
      return;
    }
    if (!date) {
      setError('Выберите дату');
      return;
    }
    if (!startTime || !endTime) {
      setError('Укажите время начала и окончания');
      return;
    }
    if (!title.trim()) {
      setError('Введите название встречи');
      return;
    }
    if (!userId) {
      setError('Не удалось определить текущего пользователя');
      return;
    }
    if (endTime <= startTime) {
      setError('Время окончания должно быть позже времени начала');
      return;
    }

    const startDateTime = dayjs(date)
      .hour(Number(startTime.split(':')[0]))
      .minute(Number(startTime.split(':')[1]))
      .second(0)
      .toISOString();
    const endDateTime = dayjs(date)
      .hour(Number(endTime.split(':')[0]))
      .minute(Number(endTime.split(':')[1]))
      .second(0)
      .toISOString();

    const payload = {
      userId,
      roomId,
      title: title.trim(),
      description: description.trim() || undefined,
      startOfBookingTime: startDateTime,
      endOfBookingTime: endDateTime,
    };

    setError('');
    setSubmitting(true);
    try {
      if (isEditing && booking) {
        await onUpdate(booking.id, payload);
      } else {
        await onCreate(payload);
      }
      setTitle('');
      setDescription('');
      setRoomId(null);
      setDate(null);
      setStartTime('09:00');
      setEndTime('18:00');
      onSaved?.();
      onClose();
    } catch (error) {
      const isRoomTaken =
        error instanceof ApiError && error.detail?.toLowerCase().includes('already taken');
      notifications.show({
        color: 'red',
        message: isRoomTaken
          ? 'Данная переговорная уже занята в это время. Пожалуйста, выберите другое время.'
          : isEditing
            ? 'Произошла ошибка при обновлении бронирования'
            : 'Произошла ошибка при создании бронирования',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEditing ? 'Редактирование бронирования' : 'Новое бронирование'}
      centered
      size="lg"
    >
      <Stack>
        <Select
          label="Переговорная"
          placeholder="Выберите переговорную"
          data={rooms.map((room) => ({ value: room.id, label: room.name }))}
          value={roomId}
          onChange={setRoomId}
          searchable
          nothingFoundMessage="Ничего не найдено"
        />
        <DatePickerInput
          label="Дата"
          placeholder="Выберите дату"
          value={date}
          onChange={setDate}
          rightSection={<CalendarDotIcon size={18} />}
          rightSectionPointerEvents="none"
          minDate={new Date()}
          valueFormat="DD.MM.YYYY"
        />
        <Group grow>
          <TimePicker label="Время начала" value={startTime} onChange={setStartTime} />
          <TimePicker label="Время окончания" value={endTime} onChange={setEndTime} />
        </Group>
        <TextInput
          label="Название встречи"
          placeholder="Введите название встречи"
          value={title}
          onChange={(event) => setTitle(event.currentTarget.value)}
        />
        <Textarea
          label="Описание (не обязательно)"
          placeholder="Введите описание"
          value={description}
          onChange={(event) => setDescription(event.currentTarget.value)}
          autosize
          minRows={3}
        />
        {error && (
          <Text c="red" size="sm">
            {error}
          </Text>
        )}
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose} disabled={submitting} size="lg">
            Отмена
          </Button>
          <Button className="booking-modal__create-btn" onClick={handleSubmit} loading={submitting} size="lg">
            {isEditing ? 'Сохранить' : 'Создать'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}