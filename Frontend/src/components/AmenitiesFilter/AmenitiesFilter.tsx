import { useEffect } from 'react';
import { Button, Collapse, MultiSelect } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { CaretDownIcon, SlidersHorizontalIcon } from '@phosphor-icons/react';

interface AmenitiesFilterProps {
    value: string[];
    onChange: (value: string[]) => void;
    data: { value: string; label: string }[];
    onFetch: () => void;
}

export default function AmenitiesFilter({
    value,
    onChange,
    data,
    onFetch,
}: AmenitiesFilterProps) {
    const [expanded, { toggle }] = useDisclosure(false);

    useEffect(() => {
        onFetch();
    }, [onFetch]);

    return (
        <div className="filter amenities-filter">
            <Button
                onClick={toggle}
                justify="space-between"
                fullWidth
                variant="default"
                size="lg"
                rightSection={<CaretDownIcon size={14} />}
                leftSection={
                    <span className="filter__left">
                        <SlidersHorizontalIcon size={18} />
                        Удобства
                    </span>
                }
            />
            <Collapse expanded={expanded}>
                <MultiSelect
                    label="Выберите удобства"
                    placeholder="Поиск..."
                    data={data}
                    value={value}
                    onChange={onChange}
                    searchable
                    clearable
                    nothingFoundMessage="Удобства не найдены"
                    maxDropdownHeight={200}
                />
            </Collapse>
        </div>
    );
}
