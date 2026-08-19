import { TimePicker as MantineTimePicker } from '@mantine/dates';
import '@/components/TimePicker/TimePicker.css';

interface TimePickerProps {
    label?: string;
    value?: string;
    error?: React.ReactNode;
    onChange: (value: string) => void;
}

export default function TimePicker({
    label,
    value,
    error,
    onChange,
}: TimePickerProps) {
    return (
        <MantineTimePicker
            withDropdown
            label={label}
            value={value}
            error={error}
            onChange={onChange}
            min="09:00"
            max="18:00"
            minutesStep={1}
        />
    );
}
