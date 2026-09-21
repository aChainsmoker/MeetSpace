import { useLocation, useNavigate } from 'react-router';
import { Avatar, Collapse, NavLink, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
    CalendarDotsIcon,
    CalendarIcon,
    GearIcon,
    HouseIcon,
    PresentationChartIcon,
    SignInIcon,
    SignOutIcon,
    UserCircleIcon,
} from '@phosphor-icons/react';
import '@/components/Navbar/Navbar.css';

const navItems = [
    { label: 'Главная', icon: HouseIcon, path: '/' },
    { label: 'Мои бронирования', icon: CalendarDotsIcon, path: '/bookings' },
    { label: 'Переговорные', icon: PresentationChartIcon, path: '/rooms' },
    { label: 'Календарь', icon: CalendarIcon, path: '/calendar' },
    { label: 'Настройки', icon: GearIcon, path: '/settings' },
];

interface NavbarProps {
    firstName: string;
    lastName: string;
    imageUrl?: string | null;
    onLogout: () => void;
    isAuthenticated?: boolean;
    onLogin?: () => void;
}

export default function Navbar({
    firstName,
    lastName,
    imageUrl,
    onLogout,
    isAuthenticated,
    onLogin,
}: NavbarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const [opened, { toggle }] = useDisclosure(false);

    return (
        <aside className="navbar">
            <div className="navbar__header">MeetSpace</div>
            <nav className="navbar__links">
                {navItems.map(({ label, icon: Icon, path }) => (
                    <NavLink
                        key={path}
                        label={label}
                        leftSection={<Icon size={18} />}
                        active={location.pathname === path}
                        onClick={() => navigate(path)}
                        className="navbar__link"
                        variant="filled"
                        color="blue"
                    />
                ))}
            </nav>
            <div className="navbar__user">
                <UnstyledButton
                    className="navbar__user-toggle"
                    onClick={toggle}
                    data-opened={opened}
                >
                    <Avatar
                        src={imageUrl}
                        name={`${firstName} ${lastName}`}
                        color="initials"
                        radius="md"
                        size={32}
                    />
                    <span className="navbar__user-name">
                        {firstName} {lastName}
                    </span>
                </UnstyledButton>
                <Collapse expanded={opened} className="navbar__user-menu">
                    {isAuthenticated && (
                        <NavLink
                            label="Изменить профиль"
                            leftSection={<UserCircleIcon size={18} />}
                            onClick={() => navigate('/account')}
                            className="navbar__user-item"
                            variant="filled"
                            color="blue"
                        />
                    )}
                    {isAuthenticated ? (
                        <NavLink
                            label="Выйти"
                            leftSection={<SignOutIcon size={18} />}
                            onClick={onLogout}
                            className="navbar__user-item"
                            variant="filled"
                            color="red"
                        />
                    ) : (
                        <NavLink
                            label="Войти"
                            leftSection={<SignInIcon size={18} />}
                            onClick={onLogin}
                            className="navbar__user-item"
                            variant="filled"
                            color="blue"
                        />
                    )}
                </Collapse>
            </div>
        </aside>
    );
}
