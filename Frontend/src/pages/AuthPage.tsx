import { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import AuthForm from '@/components/Auth/AuthForm';
import { useAppDispatch } from '@/store/hooks';
import { registerAsync, loginAsync } from '@/store/actions/userActions';
import { AuthRegisterRequest, AuthLoginRequest } from '@/services/AuthService';
import '@/pages/AuthPage.css';

export default function AuthPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const isRegister = searchParams.get('isRegister') === 'true';

  const handleRegister = useCallback(
    async (registerData: AuthRegisterRequest, loginData: AuthLoginRequest) => {
      await dispatch(registerAsync(registerData));
      await dispatch(loginAsync(loginData));
      navigate('/');
    },
    [dispatch, navigate]
  );

  const handleLogin = useCallback(
    async (data: AuthLoginRequest) => {
      await dispatch(loginAsync(data));
      navigate('/');
    },
    [dispatch, navigate]
  );

  return (
    <div className="auth-page">
      <AuthForm
        isRegister={isRegister}
        onRegister={handleRegister}
        onLogin={handleLogin}
      />
    </div>
  );
}
