import React from 'react';

interface BadgeProgressBarProps {
    current: number;
    target: number;
    label?: string;
}

export const BadgeProgressBar: React.FC<BadgeProgressBarProps> = ({ current, target, label }) => {
    const percent = target > 0 ? Math.round((current / target) * 100) : 0;

    return (
        <div className="mt-2 w-full">
            <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-textMuted">
                    {current}/{target}{label ? ` ${label}` : ''}
                </span>
                <span className="text-[11px] font-semibold text-textMuted">{percent}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                <div
                    className="h-full rounded-full bg-gradient-main transition-all duration-500"
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
};