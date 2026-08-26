import { Group, Switch, Text, useMantineColorScheme } from '@mantine/core';
import { MoonStarsIcon, SunIcon } from '@phosphor-icons/react';
import '@/pages/SettingsPage.css';

export default function SettingsPage() {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    return (
        <div className="settings-page">
            <Group className="settings-page__row" justify="space-between">
                <Text>Выберите тему</Text>
                <Switch
                    size="md"
                    color="dark.4"
                    checked={colorScheme === 'dark'}
                    onChange={() => toggleColorScheme()}
                    onLabel={
                        <SunIcon
                            size={16}
                            color="var(--mantine-color-yellow-4)"
                        />
                    }
                    offLabel={
                        <MoonStarsIcon
                            size={16}
                            color="var(--mantine-color-blue-6)"
                        />
                    }
                />
            </Group>
        </div>
    );
}
