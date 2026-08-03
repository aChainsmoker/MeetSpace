import { useEffect, useState } from 'react';
import { Button, Image, Paper, Stack, Text, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { UploadSimpleIcon } from '@phosphor-icons/react';
import { GetUserResponse, UpdateUserRequest } from '@/services/UserService';
import '@/components/ProfileForm/ProfileForm.css';

interface ProfileFormProps {
  user: GetUserResponse | null;
  imageUrl: string | null;
  onSave: (payload: UpdateUserRequest, file: File | null) => Promise<void>;
}

export default function ProfileForm({ user, imageUrl, onSave }: ProfileFormProps) {
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [newFile, setNewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
  }, [user]);

  const selectFile = (files: FileWithPath[]) => {
    const file = files[0];
    if (!file) return;
    setNewFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError('Заполните все поля');
      return;
    }

    const payload: UpdateUserRequest = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
    };

    setSaving(true);
    try {
      await onSave(payload, newFile);
      setNewFile(null);
      setPreviewUrl(null);
      setSuccess('Данные сохранены');
    } catch {
      notifications.show({ color: 'red', message: 'Произошла ошибка при сохранении профиля' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper className="profile-form" shadow="xs" radius="md" p="xl" withBorder>
      <div className="profile-form__grid">
        <Stack className="profile-form__fields">
          <TextInput
            label="First Name"
            placeholder="Введите имя"
            value={firstName}
            onChange={(event) => setFirstName(event.currentTarget.value)}
          />
          <TextInput
            label="Last Name"
            placeholder="Введите фамилию"
            value={lastName}
            onChange={(event) => setLastName(event.currentTarget.value)}
          />
          <TextInput
            label="Email"
            type="email"
            placeholder="Введите email"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
          />
        </Stack>

        <DropzoneSection imageUrl={previewUrl ?? imageUrl} onSelect={selectFile} />
      </div>

      {error && (
        <Text c="red" size="sm" className="profile-form__feedback">
          {error}
        </Text>
      )}
      {success && (
        <Text c="green" size="sm" className="profile-form__feedback">
          {success}
        </Text>
      )}

      <Button
        className="profile-form__save"
        size="lg"
        loading={saving}
        onClick={handleSave}
        fullWidth
      >
        Сохранить
      </Button>
    </Paper>
  );
}

interface DropzoneSectionProps {
  imageUrl: string | null;
  onSelect: (files: FileWithPath[]) => void;
}

function DropzoneSection({ imageUrl, onSelect }: DropzoneSectionProps) {
  return (
    <Dropzone className="profile-form__dropzone" p="0" accept={IMAGE_MIME_TYPE} maxSize={5 * 1024 ** 2} onDrop={onSelect}>
      {imageUrl ? (
        <Image className="profile-form__avatar" src={imageUrl} alt="Profile" />
      ) : (
        <UploadSimpleIcon size={64} color="#999" />
      )}
    </Dropzone>
  );
}
