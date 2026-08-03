import { Button, Collapse } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ClockIcon, CaretDownIcon } from '@phosphor-icons/react';
import TimePicker from '@/components/TimePicker/TimePicker';

interface TimeFilterProps {
  startTime: string;
  endTime: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
}

export default function TimeFilter({ startTime, endTime, onStartChange, onEndChange }: TimeFilterProps) {
  const [expanded, { toggle }] = useDisclosure(false);

  const label = startTime || endTime
    ? `Время: ${startTime || '--:--'}–${endTime || '--:--'}`
    : 'Время';

  return (
    <div className="filter time-filter">
      <Button
        onClick={toggle}
        justify="space-between"
        fullWidth
        variant="default"
        size="lg"
        rightSection={<CaretDownIcon size={14} />}
        leftSection={
          <span className="filter-toggle__left">
            <ClockIcon size={18} />
            {label}
          </span>
        }
      ></Button>
      <Collapse expanded={expanded}>
        <TimePicker
          label="Начало"
          value={startTime}
          onChange={onStartChange}
        />
        <TimePicker
          label="Конец"
          value={endTime}
          onChange={onEndChange}
        />
      </Collapse>
    </div>
  );
}
