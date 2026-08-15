import { BadgeDefinition } from '../types';

export interface BadgeMetrics {
    courses: number;
    streak: number;
    mockInterviews: number;
}

export interface BadgeProgress {
    current: number;
    target: number;
    percent: number;
    label: string;
}

const METRIC_LABELS: Record<string, string> = {
    courses: 'courses completed',
    streak: 'day streak',
    mockInterviews: 'mock interviews',
};

export const getBadgeProgress = (
    badge: BadgeDefinition,
    metrics: BadgeMetrics
): BadgeProgress | null => {
    if (!badge.requirement) return null;

    const { metric, target } = badge.requirement;
    const current = Math.min(metrics[metric] ?? 0, target);
    const percent = target > 0 ? Math.round((current / target) * 100) : 0;

    return { current, target, percent, label: METRIC_LABELS[metric] || metric };
};