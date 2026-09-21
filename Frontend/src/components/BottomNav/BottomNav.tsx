import { useLocation, useNavigate } from 'react-router';
import {
    CalendarDotsIcon,
    CalendarIcon,
    HouseIcon,
    UserIcon,
} from '@phosphor-icons/react';
import '@/components/BottomNav/BottomNav.css';

const bottomNavItems = [
    { label: 'Главная', icon: HouseIcon, path: '/' },
    { label: 'Мои бронирования', icon: CalendarDotsIcon, path: '/bookings' },
    { label: 'Календарь', icon: CalendarIcon, path: '/calendar' },
    { label: 'Профиль', icon: UserIcon, path: '/account' },
];

export default function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className="bottom-nav">
            {bottomNavItems.map(({ label, icon: Icon, path }) => (
                <button
                    key={path}
                    type="button"
                    className="bottom-nav__item"
                    data-active={location.pathname === path}
                    onClick={() => navigate(path)}
                >
                    <Icon className="bottom-nav__icon" size={24} />
                    <span className="bottom-nav__label">{label}</span>
                </button>
            ))}
        </nav>
    );
}
