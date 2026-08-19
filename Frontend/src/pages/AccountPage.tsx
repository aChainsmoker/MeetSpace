import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { GearIcon, SignOutIcon } from '@phosphor-icons/react';
import ProfileForm from '@/components/ProfileForm/ProfileForm';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    fetchUserAsync,
    logoutAsync,
    updateUserProfileAsync,
    updateUserProfileImageAsync,
} from '@/store/actions/userActions';
import '@/pages/AccountPage.css';
import { UpdateUserRequest } from '@/models/UpdateUserRequest';

export default function AccountPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.user.user);
    const imageUrl = useAppSelector((state) => state.user.imageUrl);

    const handleSave = useCallback(
        async (payload: UpdateUserRequest, file: File | null) => {
            await dispatch(updateUserProfileAsync(payload));
            if (file) {
                await dispatch(updateUserProfileImageAsync(file));
            }
            await dispatch(fetchUserAsync());
        },
        [dispatch],
    );

    const handleLogout = useCallback(async () => {
        try {
            await dispatch(logoutAsync());
        } catch {
            notifications.show({
                color: 'red',
                message: 'Произошла ошибка при выходе из аккаунта',
            });
        } finally {
            navigate('/authentication');
        }
    }, [dispatch, navigate]);

    return (
        <div className="account-page">
            <div className="account-page__content">
                <Button
                    className="account-page__settings"
                    variant="transparent"
                    color="gray"
                    leftSection={<GearIcon size={18} />}
                    onClick={() => navigate('/settings')}
                >
                    Настройки
                </Button>
                <ProfileForm
                    user={user}
                    imageUrl={imageUrl}
                    onSave={handleSave}
                />
                <Button
                    className="account-page__logout"
                    color="var(--button-danger)"
                    size="lg"
                    leftSection={<SignOutIcon size={18} />}
                    onClick={handleLogout}
                >
                    Выйти
                </Button>
            </div>
        </div>
    );
}
