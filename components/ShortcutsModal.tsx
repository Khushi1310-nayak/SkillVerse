import React, { useRef } from 'react';
import { X, Keyboard } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface ShortcutsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ShortcutEntry {
    keys: string[];
    description: string;
}

interface ShortcutSection {
    title: string;
    shortcuts: ShortcutEntry[];
}

const SHORTCUT_SECTIONS: ShortcutSection[] = [
    {
        title: 'Navigation',
        shortcuts: [
            {
                keys: ['Ctrl', 'K'],
                description: 'Open Command Palette',
            },
            {
                keys: ['?'],
                description: 'Show Keyboard Shortcuts',
            },
        ],
    },
    {
        title: 'General',
        shortcuts: [
            {
                keys: ['Esc'],
                description: 'Close any open overlay',
            },
        ],
    },
];

/** Renders a single keyboard key badge */
const KeyBadge: React.FC<{ label: string }> = ({ label }) => (
    <kbd
        className={
            'inline-flex items-center justify-center ' +
            'min-w-[28px] h-7 px-2 ' +
            'rounded-lg border border-black/20 dark:border-white/20 ' +
            'bg-white/10 dark:bg-white/5 ' +
            'text-textMain font-sans font-semibold text-xs ' +
            'shadow-[0_2px_0_0_rgba(0,0,0,0.15)] dark:shadow-[0_2px_0_0_rgba(255,255,255,0.06)] ' +
            'select-none'
        }
    >
        {label}
    </kbd>
);

/** Renders one shortcut row: key badges + description */
const ShortcutRow: React.FC<{ entry: ShortcutEntry }> = ({ entry }) => (
    <div className="flex items-center justify-between gap-4 py-2.5 px-1 rounded-xl hover:bg-white/5 transition-colors">
        <span className="text-sm text-textMuted">{entry.description}</span>
        <div className="flex items-center gap-1 shrink-0">
            {entry.keys.map((key, i) => (
                <React.Fragment key={key}>
                    <KeyBadge label={key} />
                    {i < entry.keys.length - 1 && (
                        <span className="text-textMuted text-xs font-medium px-0.5">+</span>
                    )}
                </React.Fragment>
            ))}
        </div>
    </div>
);

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
    const panelRef = useRef<HTMLDivElement>(null);

    // Handles Tab-trap and Escape-to-close; focus is restored on close automatically.
    useFocusTrap(panelRef, isOpen, onClose);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard Shortcuts"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Panel */}
            <div
                ref={panelRef}
                className={
                    'relative w-full max-w-md ' +
                    'bg-glass border border-black/20 dark:border-white/10 ' +
                    'rounded-2xl shadow-2xl backdrop-blur-md ' +
                    'animate-fade-in-up overflow-hidden'
                }
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-black/10 dark:border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-gradient-main flex items-center justify-center shrink-0">
                        <Keyboard size={16} className="text-white" />
                    </div>
                    <h2 className="flex-1 font-display font-bold text-lg text-textMain">
                        Keyboard Shortcuts
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-textMuted hover:text-textMain rounded-lg p-1.5 hover:bg-white/10 transition-colors"
                        title="Close"
                        aria-label="Close keyboard shortcuts"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Sections */}
                <div className="px-4 py-3 space-y-5">
                    {SHORTCUT_SECTIONS.map((section) => (
                        <div key={section.title}>
                            {/* Section heading */}
                            <div className="px-1 pb-1 mb-1 text-xs font-semibold uppercase tracking-wider text-textMuted">
                                {section.title}
                            </div>

                            {/* Divider */}
                            <div className="border-t border-black/10 dark:border-white/5 mb-2" />

                            {/* Shortcut rows */}
                            <div>
                                {section.shortcuts.map((entry) => (
                                    <ShortcutRow key={entry.description} entry={entry} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer hint */}
                <div className="px-5 py-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs text-textMuted">
                    <span className="flex items-center gap-1">
                        <KeyBadge label="?" /> to reopen this modal
                    </span>
                    <span>
                        <KeyBadge label="Esc" /> to close
                    </span>
                </div>
            </div>
        </div>
    );
};
