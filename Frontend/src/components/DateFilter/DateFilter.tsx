import 'dayjs/locale/ru';
import { Button, Collapse } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { MiniCalendar } from '@mantine/dates';
import { CalendarDotIcon, CaretDownIcon } from '@phosphor-icons/react';
import dayjs from 'dayjs';
import '@/components/DateFilter/DateFilter.css';

interface DateFilterProps {
    value: string | null;
    onChange: (date: string | null) => void;
}

export default function DateFilter({ value, onChange }: DateFilterProps) {
    const [expanded, { toggle }] = useDisclosure(false);
    const isMobile = useMediaQuery('(max-width: 62em)');

    const label = isMobile
        ? 'Дата'
        : value
          ? `Дата: ${dayjs(value).locale('ru').format('D MMM, dd')}`
          : 'Дата';

    return (
        <div className="date-filter">
            <Button
                onClick={toggle}
                justify="space-between"
                fullWidth
                variant="default"
                size="lg"
                rightSection={<CaretDownIcon size={14} />}
                leftSection={
                    <span className="filter-toggle__left">
                        <CalendarDotIcon size={18} />
                        {label}
                    </span>
                }
            />
            <Collapse expanded={expanded} className="date-filter__collapse">
                <MiniCalendar
                    className="date-filter__calendar"
                    value={value}
                    onChange={onChange}
                    numberOfDays={7}
                    locale="ru"
                />
            </Collapse>
        </div>
    );
}
