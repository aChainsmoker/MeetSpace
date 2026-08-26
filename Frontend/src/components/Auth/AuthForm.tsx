import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Checkbox, Paper, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import '@/components/Auth/AuthForm.css';
import { AuthRegisterRequest } from '@/models/AuthRegisterRequest';
import { AuthLoginRequest } from '@/models/AuthLoginRequest';

interface AuthFormProps {
    isRegister: boolean;
    onRegister: (
        registerData: AuthRegisterRequest,
        loginData: AuthLoginRequest
    ) => Promise<void>;
    onLogin: (data: AuthLoginRequest) => Promise<void>;
}

interface AuthFormValues {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    rememberMe: boolean;
}

export default function AuthForm({
    isRegister,
    onRegister,
    onLogin,
}: AuthFormProps) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const form = useForm<AuthFormValues>({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            rememberMe: false,
        },
        validate: {
            firstName: (value) =>
                isRegister && !value.trim() ? 'Введите имя' : null,
            lastName: (value) =>
                isRegister && !value.trim() ? 'Введите фамилию' : null,
            email: (value) =>
                /^\S+@\S+$/.test(value) ? null : 'Введите корректный email',
            password: (value) =>
                value.length >= 6
                    ? null
                    : 'Пароль должен содержать минимум 6 символов',
        },
    });

    const handleSubmit = async (values: AuthFormValues) => {
        setLoading(true);

        try {
            if (isRegister) {
                await onRegister(
                    {
                        firstName: values.firstName.trim(),
                        lastName: values.lastName.trim(),
                        email: values.email,
                        password: values.password,
                    },
                    {
                        email: values.email,
                        password: values.password,
                        rememberMe: values.rememberMe,
                    }
                );
            } else {
                await onLogin({
                    email: values.email,
                    password: values.password,
                    rememberMe: values.rememberMe,
                });
            }
        } catch {
            notifications.show({
                color: 'var(--red-color)',
                message: isRegister
                    ? 'Произошла ошибка при регистрации'
                    : 'Произошла ошибка при входе в аккаунт',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper className="auth-form" shadow="md" radius="50px" p="xl">
            <Title className="auth-form__title" order={1} ta="center">
                MeetSpace
            </Title>
            <Title className="auth-form__subtitle" ta="center" order={3}>
                {isRegister ? 'Регистрация' : 'Вход в систему'}
            </Title>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <div className="auth-form__inputs">
                    {isRegister && (
                        <>
                            <TextInput
                                label="Имя"
                                required
                                {...form.getInputProps('firstName')}
                            />
                            <TextInput
                                label="Фамилия"
                                required
                                {...form.getInputProps('lastName')}
                            />
                        </>
                    )}
                    <TextInput
                        label="Email"
                        type="email"
                        required
                        {...form.getInputProps('email')}
                    />
                    <TextInput
                        label="Пароль"
                        type="password"
                        required
                        {...form.getInputProps('password')}
                    />
                </div>
                <Checkbox
                    className="auth-form__checkbox"
                    label="Запомнить меня"
                    {...form.getInputProps('rememberMe', { type: 'checkbox' })}
                />
                <Button
                    className="auth-form__submit"
                    fullWidth
                    loading={loading}
                    size="lg"
                    type="submit"
                >
                    {isRegister ? 'Зарегистрироваться' : 'Войти'}
                </Button>
            </form>
            <Text className="auth-form__footer" ta="center">
                <Text
                    component="span"
                    className="auth-form__toggle"
                    c="dimmed"
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                        navigate(
                            isRegister
                                ? '/authentication'
                                : '/authentication?isRegister=true'
                        )
                    }
                >
                    {isRegister
                        ? 'Уже есть аккаунт? Войти'
                        : 'Нет аккаунта? Зарегистрироваться'}
                </Text>
            </Text>
        </Paper>
    );
}
