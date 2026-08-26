import { useState } from 'react';
import { TextInput } from '@mantine/core';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';

interface SearchBarProps {
    value?: string;
    onSubmit: (value: string) => void;
}

export default function SearchBar({ value, onSubmit }: SearchBarProps) {
    const [draft, setDraft] = useState(value ?? '');

    return (
        <TextInput
            className="search-bar"
            placeholder="Поиск переговорной"
            value={draft}
            onChange={(event) => setDraft(event.currentTarget.value)}
            onKeyDown={(event) => {
                if (event.key === 'Enter') {
                    onSubmit(draft);
                }
            }}
            rightSection={<MagnifyingGlassIcon size={18} />}
            rightSectionPointerEvents="none"
            size="lg"
        />
    );
}
