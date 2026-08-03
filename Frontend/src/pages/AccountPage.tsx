import { useCallback } from 'react';
import ProfileForm from '@/components/ProfileForm/ProfileForm';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchUserAsync,
  updateUserProfileAsync,
  updateUserProfileImageAsync,
} from '@/store/actions/userActions';
import { UpdateUserRequest } from '@/services/UserService';

export default function AccountPage() {
  const dispatch = useAppDispatch();
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
    [dispatch]
  );

  return (
    <div>
      <ProfileForm
        user={user}
        imageUrl={imageUrl}
        onSave={handleSave}
      />
    </div>);
}
