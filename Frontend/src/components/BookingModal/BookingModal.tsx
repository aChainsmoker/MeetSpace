import { useEffect, useMemo, useState } from 'react';
import {
    Button,
    Group,
    Modal,
    Select,
    Stack,
    Textarea,
    TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { DatePickerInput } from '@mantine/dates';
import { CalendarDotIcon } from '@phosphor-icons/react';
import TimePicker from '@/components/TimePicker/TimePicker';
import '@/components/BookingModal/BookingModal.css';
import { GetBookingResponse } from '@/models/GetBookingResponse';
import { CreateBookingRequest } from '@/models/CreateBookingRequest';
import { UpdateBookingRequest } from '@/models/UpdateBookingRequest';
import { GetRoomResponse } from '@/models/GetRoomResponse';
import { ApiError } from '@/api/apiError';

interface BookingModalProps {
    opened: boolean;
    isEditing: boolean;
    booking?: GetBookingResponse | null;
    initialRoomId?: string | null;
    onClose: () => void;
    onSaved?: () => void;
    rooms: GetRoomResponse[];
    userId: string | null;
    onFetchRooms: () => void;
    onCreate: (request: CreateBookingRequest) => Promise<void>;
    onUpdate: (id: string, request: UpdateBookingRequest) => Promise<void>;
}

interface BookingFormValues {
    roomId: string | null;
    date: string | null;
    startTime: string;
    endTime: string;
    title: string;
    description: string;
}

export default function BookingModal({
    opened,
    isEditing,
    booking,
    initialRoomId,
    onClose,
    onSaved,
    rooms,
    userId,
    onFetchRooms,
    onCreate,
    onUpdate,
}: BookingModalProps) {
    const [submitting, setSubmitting] = useState(false);

    const form = useForm<BookingFormValues>({
        initialValues: {
            roomId: null,
            date: null,
            startTime: '09:00',
            endTime: '18:00',
            title: '',
            description: '',
        },
        validate: {
            roomId: (value) => (value ? null : 'Выберите переговорную'),
            date: (value) => (value ? null : 'Выберите дату'),
            startTime: (value, values) => {
                if (!value) return 'Укажите время начала';
                if (
                    values.date &&
                    new Date(`${values.date}T${value}`).getTime() < Date.now()
                ) {
                    return 'Время начала не может быть в прошлом';
                }
                return null;
            },
            endTime: (value, values) => {
                if (!value) return 'Укажите время окончания';
                if (values.startTime && value <= values.startTime) {
                    return 'Время окончания должно быть позже времени начала';
                }
                if (
                    values.date &&
                    new Date(`${values.date}T${value}`).getTime() < Date.now()
                ) {
                    return 'Время окончания не может быть в прошлом';
                }
                return null;
            },
            title: (value) =>
                value.trim() ? null : 'Введите название встречи',
        },
    });

    useEffect(() => {
        if (!opened) {
            form.reset();
            return;
        }
    }, [opened]);

    const roomOptions = useMemo(
        () => rooms.map((room) => ({ value: room.id, label: room.name })),
        [rooms],
    );

    useEffect(() => {
        if (!opened) return;
        onFetchRooms();
    }, [opened, onFetchRooms]);

    useEffect(() => {
        if (!opened || isEditing) return;

        form.setFieldValue('roomId', initialRoomId ?? null);
    }, [opened, isEditing, initialRoomId]);

    useEffect(() => {
        if (!opened || !isEditing || !booking) return;

        form.setValues({
            roomId: booking.room.id,
            date: booking.bookingDate,
            startTime: booking.startOfBookingTime.slice(0, 5),
            endTime: booking.endOfBookingTime.slice(0, 5),
            title: booking.title,
            description: booking.description ?? '',
        });
    }, [opened, isEditing, booking]);

    const handleSubmit = async (values: BookingFormValues) => {
        if (!userId) {
            notifications.show({
                color: 'var(--red-color)',
                message: 'Не удалось определить текущего пользователя',
            });
            return;
        }

        const payload: CreateBookingRequest = {
            userId,
            roomId: values.roomId!,
            title: values.title.trim(),
            description: values.description.trim() || undefined,
            bookingDate: values.date!,
            startOfBookingTime: values.startTime,
            endOfBookingTime: values.endTime,
        };

        setSubmitting(true);
        try {
            if (isEditing && booking) {
                await onUpdate(booking.id, payload);
            } else {
                await onCreate(payload);
            }
            form.reset();
            onSaved?.();
            onClose();
        } catch (error) {
            const isRoomTaken =
                error instanceof ApiError &&
                error.detail?.toLowerCase().includes('already taken');
            notifications.show({
                color: 'var(--red-color)',
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
            title={
                isEditing ? 'Редактирование бронирования' : 'Новое бронирование'
            }
            centered
            size="lg"
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
                    <Select
                        label="Переговорная"
                        placeholder="Выберите переговорную"
                        data={roomOptions}
                        searchable
                        nothingFoundMessage="Ничего не найдено"
                        {...form.getInputProps('roomId')}
                    />
                    <DatePickerInput
                        label="Дата"
                        placeholder="Выберите дату"
                        rightSection={<CalendarDotIcon size={18} />}
                        rightSectionPointerEvents="none"
                        minDate={new Date()}
                        valueFormat="DD.MM.YYYY"
                        {...form.getInputProps('date')}
                    />
                    <Group grow>
                        <TimePicker
                            label="Время начала"
                            {...form.getInputProps('startTime')}
                        />
                        <TimePicker
                            label="Время окончания"
                            {...form.getInputProps('endTime')}
                        />
                    </Group>
                    <TextInput
                        label="Название встречи"
                        placeholder="Введите название встречи"
                        {...form.getInputProps('title')}
                    />
                    <Textarea
                        label="Описание (не обязательно)"
                        placeholder="Введите описание"
                        autosize
                        minRows={3}
                        {...form.getInputProps('description')}
                    />
                    <Group justify="flex-end" mt="md">
                        <Button
                            variant="default"
                            onClick={onClose}
                            disabled={submitting}
                            size="lg"
                        >
                            Отмена
                        </Button>
                        <Button
                            className="booking-modal__create-button"
                            type="submit"
                            loading={submitting}
                            size="lg"
                        >
                            {isEditing ? 'Сохранить' : 'Создать'}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}
