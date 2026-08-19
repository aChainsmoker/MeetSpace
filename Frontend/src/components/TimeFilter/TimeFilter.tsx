import { Button, Collapse } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { CaretDownIcon, ClockIcon } from '@phosphor-icons/react';
import TimePicker from '@/components/TimePicker/TimePicker';

interface TimeFilterProps {
    startTime: string;
    endTime: string;
    onStartChange: (value: string) => void;
    onEndChange: (value: string) => void;
}

export default function TimeFilter({
    startTime,
    endTime,
    onStartChange,
    onEndChange,
}: TimeFilterProps) {
    const [expanded, { toggle }] = useDisclosure(false);
    const isMobile = useMediaQuery('(max-width: 62em)');

    const label = isMobile
        ? 'Время'
        : startTime || endTime
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
            />
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
