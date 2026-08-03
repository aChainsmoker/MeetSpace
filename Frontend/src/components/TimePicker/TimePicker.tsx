import { TimePicker as MantineTimePicker } from '@mantine/dates';
import '@/components/TimePicker/TimePicker.css';

interface TimePickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function TimePicker({ label, value, onChange }: TimePickerProps) {
  return (
    <MantineTimePicker
      withDropdown
      label={label}
      value={value}
      onChange={onChange}
      min="09:00"
      max="18:00"
      minutesStep={1}
    />
  );
}
