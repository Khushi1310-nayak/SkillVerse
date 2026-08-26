import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { firestoreService } from '../services/firestoreService';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { Course } from '../types';

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
    content?: string; // full-text body used for matching only, not displayed
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

// Strips HTML tags so lesson/answer content can be matched as plain text
const stripHtml = (html: string): string =>
    html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

// Stable DOM id per result row, so `aria-activedescendant` on the input can
// point at the highlighted option without moving real focus off the input.
const optionDomId = (itemId: string): string => `palette-option-${itemId}`;

const LISTBOX_ID = 'command-palette-results';

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Courses that exist only in Firestore are invisible to the bundled
    // COURSES constant, so the palette could not reach a course that /courses
    // happily lists. Fetched once, the first time the palette is opened.
    const [remoteCourses, setRemoteCourses] = useState<Course[]>([]);
    const hasFetchedCourses = useRef(false);

    // Keeps Tab inside the palette, closes on Escape, and — the part that is
    // easy to miss — puts focus back on whatever the learner was on before
    // they pressed Ctrl/Cmd+K. Same hook the other modals in the app use.
    useFocusTrap(panelRef, isOpen, onClose);

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setActiveIndex(0);
            // Autofocus once the modal has mounted
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || hasFetchedCourses.current) return;
        hasFetchedCourses.current = true;

        let cancelled = false;
        firestoreService
            .getCourses()
            .then(data => {
                if (!cancelled && data && data.length > 0) setRemoteCourses(data);
            })
            .catch(error => {
                // The bundled catalog is still fully searchable, so this is a
                // degraded result rather than a failure worth surfacing.
                console.error('Command palette could not load remote courses:', error);
                hasFetchedCourses.current = false;
            });

        return () => {
            cancelled = true;
        };
    }, [isOpen]);

    // The page behind the overlay is still a scroll container otherwise, so a
    // wheel or PageDown while the palette is open scrolls the content under it.
    useEffect(() => {
        if (!isOpen) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    const goTo = useCallback((path: string) => {
        navigate(path);
        onClose();
    }, [navigate, onClose]);

    const goToSettingsTab = useCallback((tabId: string) => {
        localStorage.setItem('settings_active_tab', tabId);
        navigate('/settings');
        onClose();
    }, [navigate, onClose]);

    /**
     * The bundled catalog plus anything Firestore added, de-duplicated by id
     * with the remote copy winning — a course edited in the admin dashboard
     * should search by its current title, not the title it shipped with.
     */
    const searchableCourses: Course[] = useMemo(() => {
        const byId = new Map<string, Course>();
        COURSES.forEach(course => byId.set(course.id, course));
        remoteCourses.forEach(course => {
            const bundled = byId.get(course.id);
            byId.set(course.id, bundled ? { ...bundled, ...course } : course);
        });
        return Array.from(byId.values());
    }, [remoteCourses]);

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

        const courseItems: PaletteItem[] = searchableCourses.map(course => ({
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

        // Full-content search: course content
        const courseContentItems: PaletteItem[] = searchableCourses.map(course => ({
            id: `course-content-${course.id}`,
            title: course.title,
            subtitle: 'Course Content',
            group: 'Course Content',
            icon: BookOpen,
            content: stripHtml(course.content),
            onSelect: () => goTo(`/course/${course.id}`),
        }));

        // Full-content search: interview question answers
        const interviewAnswerItems: PaletteItem[] = COMPANIES.flatMap(company =>
            company.questions.map(question => ({
                id: `interview-answer-${company.id}-${question.id}`,
                title: question.title,
                subtitle: `${company.name} · Interview Answer`,
                group: 'Interview Answers',
                icon: Building2,
                content: stripHtml(question.answer),
                onSelect: () => goTo('/career'),
            }))
        );

        const settingsItems: PaletteItem[] = SETTINGS_TABS.map(tab => ({
            id: `settings-${tab.id}`,
            title: `Settings — ${tab.label}`,
            subtitle: 'Settings',
            group: 'Settings',
            icon: SettingsIcon,
            onSelect: () => goToSettingsTab(tab.id),
        }));

        return [...navItems, ...categoryItems, ...courseItems, ...careerItems, ...courseContentItems, ...interviewAnswerItems, ...settingsItems];
    }, [searchableCourses, goTo, goToSettingsTab]);

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return allItems.filter(item => item.group === 'Navigation');

        return allItems
            .filter(item =>
                item.title.toLowerCase().includes(q) ||
                item.group.toLowerCase().includes(q) ||
                (item.subtitle || '').toLowerCase().includes(q) ||
                (item.content || '').toLowerCase().includes(q)
            )
            .slice(0, 50);
    }, [query, allItems]);

    useEffect(() => {
        setActiveIndex(0);
    }, [query]);

    const activeItem = results[activeIndex];
    const activeOptionId = activeItem ? optionDomId(activeItem.id) : undefined;

    /**
     * The results list is a `max-h-96` scroller holding up to 50 rows, so from
     * roughly the eighth ArrowDown onwards the highlighted row sits below the
     * fold. Without this the learner is arrowing through a selection they
     * cannot see and pressing Enter on a destination they never confirmed.
     * `block: 'nearest'` scrolls only when the row is actually out of view, so
     * it does not yank the list around during ordinary mouse hover.
     */
    useEffect(() => {
        if (!isOpen || !activeOptionId) return;
        const node = listRef.current?.querySelector<HTMLElement>(`#${CSS.escape(activeOptionId)}`);
        node?.scrollIntoView({ block: 'nearest' });
    }, [isOpen, activeOptionId]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(prev => (results.length ? (prev + 1) % results.length : 0));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(prev => (results.length ? (prev - 1 + results.length) % results.length : 0));
        } else if (e.key === 'Home') {
            e.preventDefault();
            setActiveIndex(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            setActiveIndex(results.length ? results.length - 1 : 0);
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

    const resultCountLabel =
        results.length === 0
            ? 'No results found.'
            : `${results.length} result${results.length === 1 ? '' : 's'} available.`;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-20 sm:pt-28">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="command-palette-title"
                tabIndex={-1}
                className="relative w-full max-w-xl bg-glass border border-black/20 dark:border-white/10 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden animate-fade-in-up"
                onKeyDown={handleKeyDown}
            >
                <h2 id="command-palette-title" className="sr-only">
                    Command palette
                </h2>

                {/* Announces how many results the current query matched. The
                    highlight itself is announced through aria-activedescendant. */}
                <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                    {resultCountLabel}
                </div>

                <div className="flex items-center gap-3 px-4 py-4 border-b border-black/10 dark:border-white/10">
                    <Search size={20} className="text-textMuted shrink-0" aria-hidden="true" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search courses, career tracks, settings, docs..."
                        className="flex-1 bg-transparent outline-none text-textMain placeholder:text-textMuted"
                        role="combobox"
                        aria-label="Search SkillVerse"
                        aria-expanded={results.length > 0}
                        aria-controls={LISTBOX_ID}
                        aria-activedescendant={activeOptionId}
                        aria-autocomplete="list"
                        autoComplete="off"
                        spellCheck={false}
                    />
                    <button onClick={onClose} className="text-textMuted hover:text-textMain transition-colors" title="Close" aria-label="Close">
                        <X size={18} />
                    </button>
                </div>

                <div ref={listRef} className="max-h-96 overflow-y-auto no-scrollbar py-2">
                    {results.length === 0 ? (
                        <div className="px-4 py-8 text-center text-textMuted">No results found.</div>
                    ) : (
                        <div id={LISTBOX_ID} role="listbox" aria-label="Search results">
                            {groupedResults.map(({ group, items }) => (
                                <div key={group} role="group" aria-label={group} className="mb-2">
                                    <div className="px-4 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-textMuted">
                                        {group}
                                    </div>
                                    {items.map(({ item, index }) => {
                                        const Icon = item.icon;
                                        const active = index === activeIndex;
                                        return (
                                            <div
                                                key={item.id}
                                                id={optionDomId(item.id)}
                                                role="option"
                                                aria-selected={active}
                                                onClick={item.onSelect}
                                                onMouseEnter={() => setActiveIndex(index)}
                                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left cursor-pointer transition-colors ${active ? 'bg-gradient-main text-white' : 'text-textMain hover:bg-white/5'
                                                    }`}
                                            >
                                                <Icon size={18} className={active ? 'text-white' : 'text-textMuted'} aria-hidden="true" />
                                                <span className="flex-1 truncate font-medium">{item.title}</span>
                                                {item.subtitle && (
                                                    <span className={`text-xs shrink-0 ${active ? 'text-white/80' : 'text-textMuted'}`}>
                                                        {item.subtitle}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="hidden sm:flex items-center gap-4 px-4 py-3 border-t border-black/10 dark:border-white/10 text-xs text-textMuted" aria-hidden="true">
                    <span className="flex items-center gap-1"><ArrowUp size={12} /><ArrowDown size={12} /> Navigate</span>
                    <span className="flex items-center gap-1"><CornerDownLeft size={12} /> Select</span>
                    <span className="ml-auto">Esc to close</span>
                </div>
            </div>
        </div>
    );
};