import React, { useState } from 'react';
import { Flag, Check, Loader2 } from 'lucide-react';
import { firestoreService } from '../services/firestoreService';
import { useToast } from '../contexts/ToastContext';
import { ReportedContentType, ReportReason, User } from '../types';

interface ReportContentButtonProps {
    contentId: string;
    contentType: ReportedContentType;
    courseId: string;
    authorId: string;
    authorUsername?: string;
    contentSnapshot?: string;
    user: User | null;
    compact?: boolean;
}

const REASONS: { value: ReportReason; label: string }[] = [
    { value: 'spam', label: 'Spam' },
    { value: 'harassment', label: 'Harassment or abusive content' },
    { value: 'inappropriate', label: 'Inappropriate content' },
    { value: 'misleading', label: 'Misleading information' },
    { value: 'other', label: 'Other' },
];

export const ReportContentButton: React.FC<ReportContentButtonProps> = ({
    contentId, contentType, courseId, authorId, authorUsername, contentSnapshot, user, compact = false,
}) => {
    const { showToast } = useToast();
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [reported, setReported] = useState(false);

    const isOwnContent = !!user && ((!!user.uid && user.uid === authorId) || user.email === authorId);
    if (!user || !user.uid || isOwnContent) return null;

    const handleReport = async (reason: ReportReason) => {
        if (!user.uid || submitting) return;
        setSubmitting(true);
        try {
            await firestoreService.flagContent({
                reporterId: user.uid,
                contentId,
                contentType,
                courseId,
                reason,
                contentSnapshot,
                contentAuthorUsername: authorUsername,
            });
            setReported(true);
            setOpen(false);
            showToast({ message: 'Thanks — this has been reported to the moderators.', type: 'success' });
        } catch (err) {
            console.error('Error reporting content:', err);
            showToast({ message: 'Failed to submit report. Please try again.', type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const iconSize = compact ? 12 : 14;
    const textClass = compact ? 'text-[10px]' : '';

    if (reported) {
        return (
            <span className={`flex items-center gap-1 text-textMuted/70 ${textClass}`} aria-live="polite">
                <Check size={iconSize} />
                <span>Reported</span>
            </span>
        );
    }

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                aria-haspopup="true"
                aria-expanded={open}
                aria-label={`Report this ${contentType}`}
                className={`flex items-center gap-1 text-textMuted hover:text-red-500 transition-colors ${textClass}`}
            >
                {submitting ? <Loader2 size={iconSize} className="animate-spin" /> : <Flag size={iconSize} />}
                <span>Report</span>
            </button>

            {open && (
                <div
                    role="menu"
                    aria-label="Select a reason for reporting"
                    className="absolute z-20 mt-2 w-56 right-0 rounded-xl border border-black/10 dark:border-white/10 bg-glass backdrop-blur-xl shadow-2xl p-2 space-y-1"
                >
                    {REASONS.map(r => (
                        <button
                            key={r.value}
                            type="button"
                            role="menuitem"
                            onClick={() => handleReport(r.value)}
                            disabled={submitting}
                            className="w-full text-left text-xs sm:text-sm px-3 py-2 rounded-lg text-textMain hover:bg-red-500/10 hover:text-red-500 transition-colors disabled:opacity-50"
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};