import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Loader2, MessageSquareText } from 'lucide-react';
import { firestoreService } from '../services/firestoreService';
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
    const [reviews, setReviews] = useState<CourseReviewType[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
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
        () => (user ? reviews.find(r => r.userId === user.email) : undefined),
        [reviews, user]
    );

    useEffect(() => {
        if (myReview) {
            setSelectedRating(myReview.rating);
            setComment(myReview.comment || '');
        }
    }, [myReview]);

    const { average, count } = useMemo(() => {
        if (reviews.length === 0) return { average: 0, count: 0 };
        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        return { average: Math.round((sum / reviews.length) * 10) / 10, count: reviews.length };
    }, [reviews]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || selectedRating < 1) return;

        setSubmitting(true);
        try {
            const updated = await firestoreService.submitCourseReview(courseId, {
                courseId,
                userId: user.email,
                username: user.username || 'Learner',
                avatarId: user.settings?.avatarId || '1',
                photoURL: user.photoURL,
                rating: selectedRating,
                comment: comment.trim(),
            });
            setReviews(updated);
        } catch (err) {
            console.error('Error submitting review:', err);
        } finally {
            setSubmitting(false);
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
                    <div className="flex items-center gap-2">
                        {renderStars(average, 18)}
                        <span className="text-sm font-bold text-textMain">{average.toFixed(1)}</span>
                        <span className="text-xs text-textMuted">({count} {count === 1 ? 'review' : 'reviews'})</span>
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
                    <div className="flex justify-end">
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};