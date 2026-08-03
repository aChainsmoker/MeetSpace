import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Paper, Title, Text, TextInput, Button, Checkbox } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { AuthRegisterRequest, AuthLoginRequest } from '@/services/AuthService';
import "@/components/Auth/AuthForm.css"

interface AuthFormProps {
  isRegister: boolean;
  onRegister: (registerData: AuthRegisterRequest, loginData: AuthLoginRequest) => Promise<void>;
  onLogin: (data: AuthLoginRequest) => Promise<void>;
}

export default function AuthForm({ isRegister, onRegister, onLogin }: AuthFormProps) {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        await onRegister(
          { firstName, lastName, email, password },
          { email, password, rememberMe }
        );
      } else {
        await onLogin({ email, password, rememberMe });
      }
    } catch {
      notifications.show({
        color: 'red',
        message: isRegister ? 'Произошла ошибка при регистрации' : 'Произошла ошибка при входе в аккаунт',
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

      <form onSubmit={handleSubmit}>
        <div className="auth-form__inputs">
          {isRegister && (
            <>
              <TextInput
                label="Имя"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.currentTarget.value)}
              />
              <TextInput
                label="Фамилия"
                required
                value={lastName}
                onChange={(e) => setLastName(e.currentTarget.value)}
              />
            </>
          )}

          <TextInput
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />

          <TextInput
            label="Пароль"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
        </div>

        <Checkbox
          className="auth-form__checkbox"
          label="Запомнить меня"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.currentTarget.checked)}
        />

        <Button className="auth-form__submit" fullWidth loading={loading} size="lg" onClick={handleSubmit}>
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
          onClick={() => navigate(isRegister ? '/authentication' : '/authentication?isRegister=true')}
        >
          {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
        </Text>
      </Text>
    </Paper>
  );
}
