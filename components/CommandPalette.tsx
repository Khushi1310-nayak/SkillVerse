import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    LayoutDashboard,
    BookOpen,
    Briefcase,
    Award,
    Settings as SettingsIcon,
    FileText,
    Building2,
    Folder,
    CornerDownLeft,
    ArrowUp,
    ArrowDown,
    X,
} from 'lucide-react';
import { CATEGORIES, COURSES, COMPANIES } from '../constants';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
}

interface PaletteItem {
    id: string;
    title: string;
    subtitle?: string;
    group: string;
    icon: React.ElementType;
    onSelect: () => void;
}

const SETTINGS_TABS = [
    { id: 'profile', label: 'Profile' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'xpstore', label: 'XP Store' },
    { id: 'learning', label: 'Learning Preferences' },
    { id: 'quiz', label: 'Quiz Preferences' },
    { id: 'certificate', label: 'Certificate' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'account', label: 'Account' },
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setActiveIndex(0);
            // Autofocus once the modal has mounted
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    }, [isOpen]);

    const goTo = (path: string) => {
        navigate(path);
        onClose();
    };

    const goToSettingsTab = (tabId: string) => {
        localStorage.setItem('settings_active_tab', tabId);
        navigate('/settings');
        onClose();
    };

    const allItems: PaletteItem[] = useMemo(() => {
        const navItems: PaletteItem[] = [
            { id: 'nav-dashboard', title: 'Dashboard', group: 'Navigation', icon: LayoutDashboard, onSelect: () => goTo('/') },
            { id: 'nav-courses', title: 'Courses', group: 'Navigation', icon: BookOpen, onSelect: () => goTo('/courses') },
            { id: 'nav-career', title: 'Career Mode', group: 'Navigation', icon: Briefcase, onSelect: () => goTo('/career') },
            { id: 'nav-certs', title: 'Certifications', group: 'Navigation', icon: Award, onSelect: () => goTo('/certifications') },
            { id: 'nav-settings', title: 'Settings', group: 'Navigation', icon: SettingsIcon, onSelect: () => goTo('/settings') },
            { id: 'nav-docs', title: 'Documentation', group: 'Navigation', icon: FileText, onSelect: () => goTo('/docs') },
        ];

        const categoryItems: PaletteItem[] = CATEGORIES.map(category => ({
            id: `category-${category.id}`,
            title: category.title,
            subtitle: 'Category',
            group: 'Categories',
            icon: Folder,
            onSelect: () => goTo(`/category/${category.id}`),
        }));

        const courseItems: PaletteItem[] = COURSES.map(course => ({
            id: `course-${course.id}`,
            title: course.title,
            subtitle: course.level,
            group: 'Courses',
            icon: BookOpen,
            onSelect: () => goTo(`/course/${course.id}`),
        }));

        const careerItems: PaletteItem[] = COMPANIES.map(company => ({
            id: `company-${company.id}`,
            title: `${company.name} Interview Prep`,
            subtitle: 'Career Track',
            group: 'Career Tracks',
            icon: Building2,
            onSelect: () => goTo('/career'),
        }));

        const settingsItems: PaletteItem[] = SETTINGS_TABS.map(tab => ({
            id: `settings-${tab.id}`,
            title: `Settings — ${tab.label}`,
            subtitle: 'Settings',
            group: 'Settings',
            icon: SettingsIcon,
            onSelect: () => goToSettingsTab(tab.id),
        }));

        return [...navItems, ...categoryItems, ...courseItems, ...careerItems, ...settingsItems];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return allItems.filter(item => item.group === 'Navigation');

        return allItems
            .filter(item =>
                item.title.toLowerCase().includes(q) ||
                item.group.toLowerCase().includes(q) ||
                (item.subtitle || '').toLowerCase().includes(q)
            )
            .slice(0, 50);
    }, [query, allItems]);

    useEffect(() => {
        setActiveIndex(0);
    }, [query]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(prev => (results.length ? (prev + 1) % results.length : 0));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(prev => (results.length ? (prev - 1 + results.length) % results.length : 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const item = results[activeIndex];
            if (item) item.onSelect();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            onClose();
        }
    };

    if (!isOpen) return null;

    // Group results while preserving flat index for keyboard navigation
    const groupedResults: { group: string; items: { item: PaletteItem; index: number }[] }[] = [];
    results.forEach((item, index) => {
        let bucket = groupedResults.find(g => g.group === item.group);
        if (!bucket) {
            bucket = { group: item.group, items: [] };
            groupedResults.push(bucket);
        }
        bucket.items.push({ item, index });
    });

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-20 sm:pt-28">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div
                className="relative w-full max-w-xl bg-glass border border-black/20 dark:border-white/10 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden animate-fade-in-up"
                onKeyDown={handleKeyDown}
            >
                <div className="flex items-center gap-3 px-4 py-4 border-b border-black/10 dark:border-white/10">
                    <Search size={20} className="text-textMuted shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search courses, career tracks, settings, docs..."
                        className="flex-1 bg-transparent outline-none text-textMain placeholder:text-textMuted"
                    />
                    <button onClick={onClose} className="text-textMuted hover:text-textMain transition-colors" title="Close" aria-label="Close">
                        <X size={18} />
                    </button>
                </div>

                <div className="max-h-96 overflow-y-auto no-scrollbar py-2">
                    {results.length === 0 ? (
                        <div className="px-4 py-8 text-center text-textMuted">No results found.</div>
                    ) : (
                        groupedResults.map(({ group, items }) => (
                            <div key={group} className="mb-2">
                                <div className="px-4 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-textMuted">
                                    {group}
                                </div>
                                {items.map(({ item, index }) => {
                                    const Icon = item.icon;
                                    const active = index === activeIndex;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={item.onSelect}
                                            onMouseEnter={() => setActiveIndex(index)}
                                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${active ? 'bg-gradient-main text-white' : 'text-textMain hover:bg-white/5'
                                                }`}
                                        >
                                            <Icon size={18} className={active ? 'text-white' : 'text-textMuted'} />
                                            <span className="flex-1 truncate font-medium">{item.title}</span>
                                            {item.subtitle && (
                                                <span className={`text-xs shrink-0 ${active ? 'text-white/80' : 'text-textMuted'}`}>
                                                    {item.subtitle}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ))
                    )}
                </div>

                <div className="hidden sm:flex items-center gap-4 px-4 py-3 border-t border-black/10 dark:border-white/10 text-xs text-textMuted">
                    <span className="flex items-center gap-1"><ArrowUp size={12} /><ArrowDown size={12} /> Navigate</span>
                    <span className="flex items-center gap-1"><CornerDownLeft size={12} /> Select</span>
                    <span className="ml-auto">Esc to close</span>
                </div>
            </div>
        </div>
    );
};