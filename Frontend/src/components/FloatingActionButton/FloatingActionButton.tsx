import { PlusIcon } from '@phosphor-icons/react';
import '@/components/FloatingActionButton/FloatingActionButton.css';

interface FloatingActionButtonProps {
    onClick: () => void;
}

export default function FloatingActionButton({
    onClick,
}: FloatingActionButtonProps) {
    return (
        <button
            type="button"
            className="floating-button"
            onClick={onClick}
            aria-label="Новая бронь"
        >
            <PlusIcon weight="bold" color="white" size="1.5em" />
        </button>
    );
}
