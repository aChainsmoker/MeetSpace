import { useEffect } from 'react';
import { MantineProvider } from '@mantine/core';
import { Notifications, notifications } from '@mantine/notifications';
import { BrowserRouter, Route, Routes, useNavigate } from "react-router";
import { setUnauthorizedHandler } from "@/services/apiClient";
import AuthPage from "@/pages/AuthPage";
import MainLayout from "@/pages/MainLayout";
import HomePage from "@/pages/HomePage";
import RoomsPage from "@/pages/RoomsPage";
import MyBookingsPage from "@/pages/MyBookingsPage";
import CalendarPage from "@/pages/CalendarPage";
import SettingsPage from "@/pages/SettingsPage";
import AccountPage from "@/pages/AccountPage";

function UnauthorizedRedirect() {
    const navigate = useNavigate();

    useEffect(() => {
        setUnauthorizedHandler(() => {
            notifications.clean();
            navigate('/authentication');
        });
        return () => setUnauthorizedHandler(null);
    }, [navigate]);

    return null;
}

export default function App() {
    return (
    <MantineProvider>
        <Notifications />
        <BrowserRouter>
            <UnauthorizedRedirect />
            <Routes>
                <Route path="/authentication" element={<AuthPage />} />
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="bookings" element={<MyBookingsPage />} />
                    <Route path="rooms" element={<RoomsPage />} />
                    <Route path="calendar" element={<CalendarPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="account" element={<AccountPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </MantineProvider>
    );
}
