import { useEffect, useState } from 'react';
import { Button, Image, Paper, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { UploadSimpleIcon } from '@phosphor-icons/react';
import '@/components/ProfileForm/ProfileForm.css';
import { GetUserResponse } from '@/models/GetUserResponse';
import { UpdateUserRequest } from '@/models/UpdateUserRequest';

interface ProfileFormProps {
    user: GetUserResponse | null;
    imageUrl: string | null;
    onSave: (payload: UpdateUserRequest, file: File | null) => Promise<void>;
}

interface ProfileFormValues {
    firstName: string;
    lastName: string;
    email: string;
}

export default function ProfileForm({
    user,
    imageUrl,
    onSave,
}: ProfileFormProps) {
    const [newFile, setNewFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [success, setSuccess] = useState('');
    const [saving, setSaving] = useState(false);

    const form = useForm<ProfileFormValues>({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
        },
        validate: {
            firstName: (value) => (value.trim() ? null : 'Введите имя'),
            lastName: (value) => (value.trim() ? null : 'Введите фамилию'),
            email: (value) =>
                /^\S+@\S+$/.test(value) ? null : 'Введите корректный email',
        },
    });

    useEffect(() => {
        if (!user) return;
        form.setValues({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        });
    }, [user]);

    const selectFile = (files: FileWithPath[]) => {
        const file = files[0];
        if (!file) return;
        setNewFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleSave = async (values: ProfileFormValues) => {
        setSuccess('');

        const payload: UpdateUserRequest = {
            firstName: values.firstName.trim(),
            lastName: values.lastName.trim(),
            email: values.email.trim(),
        };

        setSaving(true);
        try {
            await onSave(payload, newFile);
            setNewFile(null);
            setPreviewUrl(null);
            setSuccess('Данные сохранены');
        } catch {
            notifications.show({
                color: 'var(--red-color)',
                message: 'Произошла ошибка при сохранении профиля',
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Paper
            className="profile-form"
            shadow="xs"
            radius="md"
            p="xl"
            withBorder
        >
            <form onSubmit={form.onSubmit(handleSave)}>
                <div className="profile-form__grid">
                    <Stack className="profile-form__fields">
                        <TextInput
                            label="First Name"
                            placeholder="Введите имя"
                            {...form.getInputProps('firstName')}
                        />
                        <TextInput
                            label="Last Name"
                            placeholder="Введите фамилию"
                            {...form.getInputProps('lastName')}
                        />
                        <TextInput
                            label="Email"
                            type="email"
                            placeholder="Введите email"
                            {...form.getInputProps('email')}
                        />
                    </Stack>
                    <DropzoneSection
                        imageUrl={previewUrl ?? imageUrl}
                        onSelect={selectFile}
                    />
                </div>
                {success && (
                    <Text
                        c="green"
                        size="sm"
                        className="profile-form__feedback"
                    >
                        {success}
                    </Text>
                )}
                <Button
                    className="profile-form__save"
                    size="lg"
                    loading={saving}
                    type="submit"
                    fullWidth
                >
                    Сохранить
                </Button>
            </form>
        </Paper>
    );
}

interface DropzoneSectionProps {
    imageUrl: string | null;
    onSelect: (files: FileWithPath[]) => void;
}

function DropzoneSection({ imageUrl, onSelect }: DropzoneSectionProps) {
    return (
        <Dropzone
            className="profile-form__dropzone"
            p="0"
            accept={IMAGE_MIME_TYPE}
            maxSize={5 * 1024 ** 2}
            onDrop={onSelect}
        >
            {imageUrl ? (
                <Image
                    className="profile-form__avatar"
                    src={imageUrl}
                    alt="Profile"
                />
            ) : (
                <UploadSimpleIcon size={64} color="grey" />
            )}
        </Dropzone>
    );
}
