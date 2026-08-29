import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Loader2, MessageSquareText, Trash2 } from 'lucide-react';
import { firestoreService } from '../services/firestoreService';
import { ReportContentButton } from './ReportContentButton';
import { useToast } from '../contexts/ToastContext';
import { User, CourseReview as CourseReviewType } from '../types';

interface CourseReviewProps {
    courseId: string;
    user: User | null;
}

const AVATARS: Record<string, string> = {
    '1': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    '2': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
    '3': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor',
    '4': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan',
    '5': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha',
};

export const CourseReview: React.FC<CourseReviewProps> = ({ courseId, user }) => {
    const { t } = useTranslation();
    const { showToast } = useToast();
    const [reviews, setReviews] = useState<CourseReviewType[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(false);
    const [selectedRating, setSelectedRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        try {
            const data = await firestoreService.getCourseReviews(courseId);
            setReviews(data);
        } catch (err) {
            console.error('Failed to load course reviews:', err);
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const myReview = useMemo(
        () => (user ? reviews.find(r => (user.uid && r.userId === user.uid) || r.userId === user.email) : undefined),
        [reviews, user]
    );

    useEffect(() => {
        if (myReview) {
            setSelectedRating(myReview.rating);
            setComment(myReview.comment || '');
        }
    }, [myReview]);

    // Uses the same helper the service writes the denormalized course rating
    // with, so what is shown here and what is stored can never drift apart.
    const { average, count, distribution } = useMemo(
        () => firestoreService.summarizeCourseReviews(reviews),
        [reviews]
    );

    const barWidthClass = (value: number) => {
        if (count === 0) return 'w-0';
        const rounded = Math.max(0, Math.min(100, Math.round((value / count) * 20) * 5));
        const widths: Record<number, string> = {
            0: 'w-0', 5: 'w-[5%]', 10: 'w-[10%]', 15: 'w-[15%]', 20: 'w-[20%]', 25: 'w-[25%]',
            30: 'w-[30%]', 35: 'w-[35%]', 40: 'w-[40%]', 45: 'w-[45%]', 50: 'w-[50%]',
            55: 'w-[55%]', 60: 'w-[60%]', 65: 'w-[65%]', 70: 'w-[70%]', 75: 'w-[75%]',
            80: 'w-[80%]', 85: 'w-[85%]', 90: 'w-[90%]', 95: 'w-[95%]', 100: 'w-full',
        };
        return widths[rounded] || 'w-0';
    };

    const renderRatingBreakdown = () => (
        <div className="space-y-1.5 max-w-xs w-full">
            {[5, 4, 3, 2, 1].map(star => (
                <div key={star} className="flex items-center gap-2">
                    <span className="text-xs text-textMuted w-3 text-right font-mono">{star}</span>
                    <Star size={11} className="text-amber-500 fill-amber-500 shrink-0" />
                    <div className="flex-1 h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                        <div
                            className={`h-full bg-amber-500 rounded-full transition-all duration-500 ${barWidthClass(distribution[star])}`}
                        />
                    </div>
                    <span className="text-xs text-textMuted w-6 font-mono">{distribution[star]}</span>
                </div>
            ))}
        </div>
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || selectedRating < 1) return;

        setSubmitting(true);
        setSubmitError(false);
        try {
            const updated = await firestoreService.submitCourseReview(courseId, {
                courseId,
                userId: user.uid || user.email,
                username: user.username || 'Learner',
                avatarId: user.settings?.avatarId || '1',
                photoURL: user.photoURL,
                rating: selectedRating,
                comment: comment.trim(),
            });
            setReviews(updated);
        } catch (err) {
            // The service now rejects instead of quietly saving locally, so the
            // user has to be told — otherwise the form just resets and their
            // review silently never existed.
            console.error('Error submitting review:', err);
            setSubmitError(true);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReview = async () => {
        if (!user || !myReview) return;
        if (!confirm('Delete your review? This cannot be undone.')) return;
        try {
            const updated = await firestoreService.deleteCourseReview(courseId, myReview.userId || user.uid || user.email);
            setReviews(updated);
            setSelectedRating(0);
            setComment('');
            showToast({ message: 'Review deleted.', type: 'success' });
        } catch (err) {
            console.error('Error deleting review:', err);
            showToast({ message: 'Failed to delete review.', type: 'error' });
        }
    };

    const getAvatar = (review: CourseReviewType) => {
        if (review.photoURL) return review.photoURL;
        return AVATARS[review.avatarId || '1'] || AVATARS['1'];
    };

    const formatDate = (isoString: string) => {
        try {
            return new Date(isoString).toLocaleDateString();
        } catch {
            return '';
        }
    };

    const renderStars = (value: number, size = 16) => (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <Star
                    key={i}
                    size={size}
                    className={i <= Math.round(value) ? 'fill-amber-500 text-amber-500' : 'text-textMuted/40'}
                />
            ))}
        </div>
    );

    return (
        <div className="mt-12 border border-black/20 dark:border-white/10 rounded-2xl bg-glass overflow-hidden shadow-lg p-6 space-y-6">
            {/* Header + Average Rating */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primaryLight">
                        <Star size={20} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-textMain">
                            {t('courseReview.title', 'Ratings & Reviews')}
                        </h3>
                        <p className="text-xs text-textMuted mt-0.5">
                            {t('courseReview.subtitle', 'See what other learners think of this course')}
                        </p>
                    </div>
                </div>
                {count > 0 && (
                    <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto">
                        <div className="flex items-center gap-2">
                            {renderStars(average, 18)}
                            <span className="text-sm font-bold text-textMain">{average.toFixed(1)}</span>
                            <span className="text-xs text-textMuted">({count} {count === 1 ? 'review' : 'reviews'})</span>
                        </div>
                        {renderRatingBreakdown()}
                    </div>
                )}
            </div>

            {/* Submit / Update Review */}
            {user ? (
                <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-white/40 dark:bg-white/5 border border-black/10 dark:border-white/10 space-y-3">
                    <p className="text-sm font-medium text-textMain">
                        {myReview ? t('courseReview.updatePrompt', 'Update your rating') : t('courseReview.ratePrompt', 'Rate this course')}
                    </p>
                    <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
                        {[1, 2, 3, 4, 5].map(i => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setSelectedRating(i)}
                                onMouseEnter={() => setHoverRating(i)}
                                aria-label={`Rate ${i} star${i > 1 ? 's' : ''}`}
                                className="focus:outline-none"
                            >
                                <Star
                                    size={26}
                                    className={i <= (hoverRating || selectedRating) ? 'fill-amber-500 text-amber-500' : 'text-textMuted/40'}
                                />
                            </button>
                        ))}
                    </div>
                    <textarea
                        rows={2}
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder={t('courseReview.placeholder', 'Share your experience with this course (optional)...')}
                        className="w-full bg-black/5 dark:bg-white/5 border border-black/20 dark:border-white/10 rounded-xl p-3 text-sm text-textMain placeholder:text-textMuted focus:outline-none focus:border-primaryLight focus:ring-1 focus:ring-primaryLight transition-all resize-none"
                    />
                    {submitError && (
                        <p role="alert" className="text-sm text-red-500 dark:text-red-400">
                            {t(
                                'courseReview.submitError',
                                "We couldn't save your review. Check your connection and try again."
                            )}
                        </p>
                    )}
                    <div className="flex justify-end gap-2">
                        {myReview && (
                            <button
                                type="button"
                                onClick={handleDeleteReview}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 text-red-500 dark:text-red-400 font-bold text-sm hover:bg-red-500/10 transition-all"
                                aria-label="Delete your review"
                            >
                                <Trash2 size={14} />
                                Delete
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={selectedRating < 1 || submitting}
                            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-main text-white font-bold text-sm shadow hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {submitting ? <Loader2 size={14} className="animate-spin" /> : <MessageSquareText size={14} />}
                            {myReview ? t('courseReview.updateButton', 'Update Review') : t('courseReview.submitButton', 'Submit Review')}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="p-4 rounded-xl bg-white/5 border border-black/10 dark:border-white/10 text-center text-textMuted text-sm">
                    {t('courseReview.loginRequired', 'Please log in to rate and review this course.')}
                </div>
            )}

            {/* Review List */}
            {loading ? (
                <div className="flex items-center justify-center py-8 text-textMuted gap-2">
                    <Loader2 size={20} className="animate-spin text-primaryLight" />
                    <span>Loading reviews...</span>
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-10 text-textMuted border border-dashed border-black/10 dark:border-white/10 rounded-xl">
                    <Star size={32} className="mx-auto mb-2 opacity-50 text-primaryLight" />
                    <p className="font-medium text-sm">{t('courseReview.emptyTitle', 'No reviews yet')}</p>
                    <p className="text-xs mt-1">{t('courseReview.emptySubtitle', 'Be the first to rate this course!')}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map(review => (
                        <div key={review.id} className="p-4 rounded-xl bg-white/40 dark:bg-white/5 border border-black/10 dark:border-white/10">
                            <div className="flex items-start justify-between gap-3 mb-2">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={getAvatar(review)}
                                        alt={review.username}
                                        className="w-9 h-9 rounded-full border border-black/10 dark:border-white/10 object-cover"
                                    />
                                    <div>
                                        <div className="font-bold text-sm text-textMain">{review.username}</div>
                                        <div className="text-[10px] text-textMuted">{formatDate(review.createdAt)}</div>
                                    </div>
                                </div>
                                {renderStars(review.rating, 14)}
                            </div>
                            {review.comment && (
                                <p className="text-sm text-textMain leading-relaxed whitespace-pre-wrap">{review.comment}</p>
                            )}
                            <div className="flex justify-end mt-2">
                                <ReportContentButton
                                    contentId={review.id}
                                    contentType="review"
                                    courseId={courseId}
                                    authorId={review.userId}
                                    authorUsername={review.username}
                                    contentSnapshot={review.comment}
                                    user={user}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};