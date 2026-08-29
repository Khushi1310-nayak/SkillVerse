import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Terminal, Network, Palette, CheckCircle, PlayCircle, Circle, Lock, Sparkles, Map as MapIcon } from 'lucide-react';
import { CATEGORIES, COURSES } from '../constants';
import { storageService } from '../services/storageService';
import { isCourseUnlocked, getIncompletePrerequisites } from '../utils/prerequisites';
import { getRecommendedCourses } from '../utils/recommendations';
import { Course, User } from '../types';

interface RoadmapProps {
    user: User;
}

type CourseStatus = 'completed' | 'in-progress' | 'unlocked' | 'locked';

const getIcon = (icon: string) => {
    switch (icon) {
        case 'Terminal': return <Terminal className="text-primaryLight" size={22} />;
        case 'Network': return <Network className="text-blue-400" size={22} />;
        case 'Palette': return <Palette className="text-pink-400" size={22} />;
        default: return <Terminal size={22} />;
    }
};

// Simple per-category topological sort: prerequisites render before the
// courses that depend on them. Every prerequisite relationship in this app
// stays within one category, so this doesn't need to look across categories.
const getTopologicalOrder = (categoryCourses: Course[]): Course[] => {
    const byId = new Map(categoryCourses.map(c => [c.id, c]));
    const visited = new Set<string>();
    const ordered: Course[] = [];

    const visit = (course: Course) => {
        if (visited.has(course.id)) return;
        visited.add(course.id);
        (course.prerequisiteCourseIds || []).forEach(prereqId => {
            const prereqCourse = byId.get(prereqId);
            if (prereqCourse) visit(prereqCourse);
        });
        ordered.push(course);
    };

    categoryCourses.forEach(visit);
    return ordered;
};

export const Roadmap: React.FC<RoadmapProps> = ({ user }) => {
    const { t } = useTranslation();
    const allProgress = useMemo(() => storageService.getAllProgress(), []);

    const getDifficultyLabel = (level: string) => {
        switch (level) {
            case 'Beginner': return t('common.difficulty.beginner');
            case 'Intermediate': return t('common.difficulty.intermediate');
            case 'Advanced': return t('common.difficulty.advanced');
            default: return level;
        }
    };

    const getCategoryLabel = (categoryId: string) => {
        switch (categoryId) {
            case 'programming': return t('courses.categories.programming', 'Programming Languages');
            case 'dsa': return t('courses.categories.dsa', 'Data Structures & Algorithms');
            case 'design': return t('courses.categories.design', 'Design');
            default: return CATEGORIES.find(c => c.id === categoryId)?.title || categoryId;
        }
    };

    const getCourseStatus = (course: Course): CourseStatus => {
        const progressEntry = allProgress.find(p => p.courseId === course.id);
        if (progressEntry?.passed) return 'completed';
        if (!isCourseUnlocked(course, allProgress)) return 'locked';
        if (progressEntry) return 'in-progress';
        return 'unlocked';
    };

    const hasAnyPrerequisites = COURSES.some(c => (c.prerequisiteCourseIds?.length ?? 0) > 0);

    const recommendedNextId = useMemo(() => {
        const recommended = getRecommendedCourses(user.settings, allProgress, COURSES);
        const nextUp = recommended.find(c => isCourseUnlocked(c, allProgress));
        return nextUp?.id ?? null;
    }, [user.settings, allProgress]);

    const statusConfig: Record<CourseStatus, { label: string; icon: React.ReactNode; ring: string; text: string }> = {
        completed: {
            label: 'Completed',
            icon: <CheckCircle size={18} className="text-success" />,
            ring: 'border-success/40 bg-success/5',
            text: 'text-success',
        },
        'in-progress': {
            label: 'In Progress',
            icon: <PlayCircle size={18} className="text-primaryLight" />,
            ring: 'border-primary/40 bg-primary/5',
            text: 'text-primaryLight',
        },
        unlocked: {
            label: 'Available',
            icon: <Circle size={18} className="text-textMuted" />,
            ring: 'border-black/10 dark:border-white/10',
            text: 'text-textMuted',
        },
        locked: {
            label: 'Locked',
            icon: <Lock size={18} className="text-amber-500" />,
            ring: 'border-amber-500/20 bg-amber-500/5 opacity-80',
            text: 'text-amber-500',
        },
    };

    if (!hasAnyPrerequisites) {
        return (
            <div className="animate-fade-in space-y-8">
                <div>
                    <h1 className="text-3xl font-display font-bold text-textMain mb-2 flex items-center gap-2">
                        <MapIcon className="text-primaryLight" /> Learning Roadmap
                    </h1>
                    <p className="text-textMuted">Your recommended path through SkillVerse's courses.</p>
                </div>

                <div className="text-center py-20">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <MapIcon className="text-primaryLight" size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-textMain mb-2">No learning sequence yet</h3>
                    <p className="text-textMuted mb-6 max-w-md mx-auto">
                        There aren't any prerequisite relationships between courses right now, so there's no fixed order to follow — every course is open to start.
                    </p>
                    <Link
                        to="/courses"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-main text-white font-bold shadow hover:scale-105 transition-all"
                    >
                        Browse Courses
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-10">
            <div>
                <h1 className="text-3xl font-display font-bold text-textMain mb-2 flex items-center gap-2">
                    <MapIcon className="text-primaryLight" /> Learning Roadmap
                </h1>
                <p className="text-textMuted">Your recommended path through SkillVerse's courses, grouped by track.</p>
            </div>

            {CATEGORIES.map(category => {
                const categoryCourses = COURSES.filter(c => c.categoryId === category.id);
                if (categoryCourses.length === 0) return null;

                const orderedCourses = getTopologicalOrder(categoryCourses);

                return (
                    <section key={category.id} aria-labelledby={`roadmap-${category.id}-heading`}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center">
                                {getIcon(category.icon)}
                            </div>
                            <h2 id={`roadmap-${category.id}-heading`} className="text-xl font-bold text-textMain">
                                {getCategoryLabel(category.id)}
                            </h2>
                        </div>

                        <ol className="relative pl-8 space-y-4">
                            <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-black/10 dark:bg-white/10" aria-hidden="true" />

                            {orderedCourses.map(course => {
                                const status = getCourseStatus(course);
                                const config = statusConfig[status];
                                const isRecommended = course.id === recommendedNextId;
                                const incompletePrereqs = status === 'locked' ? getIncompletePrerequisites(course, COURSES, allProgress) : [];

                                const nodeContent = (
                                    <div
                                        className={`relative rounded-2xl border p-4 transition-all ${config.ring} ${status !== 'locked' ? 'hover:shadow-md' : ''
                                            }`}
                                    >
                                        {isRecommended && (
                                            <span className="inline-flex items-center gap-1 mb-2 px-2 py-0.5 rounded-full bg-gradient-main text-white text-[10px] font-bold uppercase tracking-wide">
                                                <Sparkles size={10} /> Recommended Next
                                            </span>
                                        )}

                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-textMain truncate">{course.title}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-textMuted">{getDifficultyLabel(course.level)}</span>
                                                    <span className={`text-xs font-semibold ${config.text}`}>&middot; {config.label}</span>
                                                </div>
                                            </div>
                                            <div className="shrink-0 mt-0.5">{config.icon}</div>
                                        </div>

                                        {status === 'locked' && incompletePrereqs.length > 0 && (
                                            <div className="mt-3 pt-3 border-t border-amber-500/20">
                                                <p className="text-xs text-amber-500 font-semibold mb-1.5">Complete first:</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {incompletePrereqs.map(prereq => (
                                                        <span
                                                            key={prereq.id}
                                                            className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-medium"
                                                        >
                                                            {prereq.title}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );

                                return (
                                    <li key={course.id} className="relative">
                                        <div
                                            className={`absolute left-[-25px] top-6 w-3 h-3 rounded-full border-2 border-background ${status === 'completed' ? 'bg-success' : status === 'in-progress' ? 'bg-primaryLight' : status === 'locked' ? 'bg-amber-500' : 'bg-textMuted'
                                                }`}
                                            aria-hidden="true"
                                        />

                                        {status === 'locked' ? (
                                            <div
                                                role="group"
                                                aria-label={`${course.title}, ${getDifficultyLabel(course.level)}, locked. Requires: ${incompletePrereqs.map(p => p.title).join(', ')}`}
                                            >
                                                {nodeContent}
                                            </div>
                                        ) : (
                                            <Link
                                                to={`/course/${course.id}`}
                                                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl"
                                                aria-label={`${course.title}, ${getDifficultyLabel(course.level)}, ${config.label}${isRecommended ? ', recommended next' : ''}`}
                                            >
                                                {nodeContent}
                                            </Link>
                                        )}
                                    </li>
                                );
                            })}
                        </ol>
                    </section>
                );
            })}
        </div>
    );
};