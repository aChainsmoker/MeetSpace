import { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import AuthForm from '@/components/Auth/AuthForm';
import { useAppDispatch } from '@/store/hooks';
import { loginAsync, registerAsync } from '@/store/actions/userActions';
import '@/pages/AuthPage.css';
import { AuthRegisterRequest } from '@/models/AuthRegisterRequest';
import { AuthLoginRequest } from '@/models/AuthLoginRequest';

export default function AuthPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [searchParams] = useSearchParams();
    const isRegister = searchParams.get('isRegister') === 'true';

    const handleRegister = useCallback(
        async (
            registerData: AuthRegisterRequest,
            loginData: AuthLoginRequest
        ) => {
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
