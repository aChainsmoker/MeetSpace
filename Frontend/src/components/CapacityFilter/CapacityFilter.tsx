import { Button, Collapse, NumberInput } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { CaretDownIcon, UserIcon } from '@phosphor-icons/react';

interface CapacityFilterProps {
    value: string | number;
    onChange: (value: string | number) => void;
}

export default function CapacityFilter({
    value,
    onChange,
}: CapacityFilterProps) {
    const [expanded, { toggle }] = useDisclosure(false);
    const isMobile = useMediaQuery('(max-width: 62em)');

    const label = isMobile
        ? 'Вместимость'
        : `Вместимость${value ? ': ' + value : ''}`;

    return (
        <div className="capacity-filter">
            <Button
                onClick={toggle}
                justify="space-between"
                fullWidth
                variant="default"
                size="lg"
                rightSection={<CaretDownIcon size={14} />}
                leftSection={
                    <span className="filter-toggle__left">
                        <UserIcon size={18} />
                        {label}
                    </span>
                }
            />
            <Collapse expanded={expanded}>
                <NumberInput
                    label="Количество человек"
                    placeholder="От"
                    min={1}
                    max={50}
                    allowDecimal={false}
                    value={value}
                    onChange={onChange}
                />
            </Collapse>
        </div>
    );
}
