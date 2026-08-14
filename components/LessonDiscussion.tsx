import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, ThumbsUp, Send, ChevronDown, ChevronUp, Reply, CornerDownRight, Loader2, AlertTriangle } from 'lucide-react';
import { firestoreService } from '../services/firestoreService';
import { User, LessonComment } from '../types';

interface LessonDiscussionProps {
  courseId: string;
  lessonId: string;
  user: User | null;
}

const AVATARS: Record<string, string> = {
  '1': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  '2': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
  '3': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor',
  '4': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan',
  '5': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha',
};

export const LessonDiscussion: React.FC<LessonDiscussionProps> = ({ courseId, lessonId, user }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(true);
  const [comments, setComments] = useState<LessonComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  // Votes in flight, by comment id. Prevents a double-click from sending two
  // toggles that cancel each other out on the server.
  const [pendingVoteIds, setPendingVoteIds] = useState<string[]>([]);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await firestoreService.getLessonComments(courseId, lessonId);
      setComments(data);
    } catch (err) {
      console.error('Failed to load lesson comments:', err);
    } finally {
      setLoading(false);
    }
  }, [courseId, lessonId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handlePostComment = async (e: React.FormEvent, parentId: string | null = null) => {
    e.preventDefault();
    const content = parentId ? replyText.trim() : newComment.trim();
    if (!content || !user) return;

    setSubmitting(true);
    setNotice(null);
    try {
      const { comment: created, persisted } = await firestoreService.postLessonComment({
        courseId,
        lessonId,
        userId: user.email, // using email or username as ID
        username: user.username || 'Learner',
        avatarId: user.settings?.avatarId || '1',
        photoURL: user.photoURL,
        content,
        parentId,
      });

      setComments(prev => [created, ...prev]);
      if (parentId) {
        setReplyText('');
        setReplyToId(null);
      } else {
        setNewComment('');
      }

      if (!persisted) {
        setNotice(t(
          'lessonDiscussion.offlineNotice',
          'Saved on this device, but we could not reach the server — other learners will not see this yet.'
        ));
      }
    } catch (err) {
      console.error('Error posting comment:', err);
      setNotice(t('lessonDiscussion.postFailed', 'Your comment could not be posted. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Toggles the current user's vote on one comment.
   *
   * The whole thread used to be replaced with whatever the service returned,
   * which was rebuilt from localStorage — so an empty cache blanked the
   * discussion. Only the comment that was voted on is touched now, and the
   * previous list is restored if the write fails.
   */
  const handleUpvote = async (comment: LessonComment) => {
    if (!user || pendingVoteIds.includes(comment.id)) return;

    const previousComments = comments;
    setPendingVoteIds(ids => [...ids, comment.id]);
    setNotice(null);

    try {
      const { comment: updated, persisted } = await firestoreService.toggleLessonCommentUpvote(
        courseId,
        lessonId,
        comment,
        user.email
      );

      setComments(prev => prev.map(c => (c.id === updated.id ? updated : c)));

      if (!persisted) {
        setNotice(t(
          'lessonDiscussion.voteOfflineNotice',
          'Your vote was saved on this device, but we could not reach the server.'
        ));
      }
    } catch (err) {
      console.error('Error updating upvote:', err);
      setComments(previousComments);
      setNotice(t('lessonDiscussion.voteFailed', 'Could not register your vote. Please try again.'));
    } finally {
      setPendingVoteIds(ids => ids.filter(id => id !== comment.id));
    }
  };

  const getAvatar = (comment: LessonComment) => {
    if (comment.photoURL) return comment.photoURL;
    return AVATARS[comment.avatarId || '1'] || AVATARS['1'];
  };

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return t('lessonDiscussion.time.justNow', 'Just now');
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    } catch {
      return 'Recently';
    }
  };

  // Group top-level comments and replies
  const rootComments = comments.filter(c => !c.parentId);
  const getReplies = (parentId: string) => comments.filter(c => c.parentId === parentId);

  return (
    <div className="mt-12 border border-black/20 dark:border-white/10 rounded-2xl bg-glass overflow-hidden shadow-lg transition-all">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primaryLight">
            <MessageSquare size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-textMain">
              {t('lessonDiscussion.title', 'Lesson Discussion & Q&A')}
            </h3>
            <p className="text-xs text-textMuted mt-0.5">
              {t('lessonDiscussion.subtitle', 'Ask questions, share insights, and discuss with fellow learners')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primaryLight border border-primary/20">
            {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
          </span>
          {isOpen ? <ChevronUp size={20} className="text-textMuted" /> : <ChevronDown size={20} className="text-textMuted" />}
        </div>
      </button>

      {/* Accordion Body */}
      {isOpen && (
        <div className="p-6 border-t border-black/10 dark:border-white/10 space-y-6 animate-fade-in">
          {/* Anything that did not reach the server. Previously these failures
              were swallowed and the user had no way to know. */}
          {notice && (
            <div
              role="status"
              className="flex items-start gap-2 p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-500 dark:text-orange-300 text-xs font-medium"
            >
              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
              <span>{notice}</span>
            </div>
          )}

          {/* Post Comment Input */}
          {user ? (
            <form onSubmit={(e) => handlePostComment(e)} className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <img
                  src={user.photoURL || AVATARS[user.settings?.avatarId || '1']}
                  alt={user.username}
                  className="w-10 h-10 rounded-full border border-primary/30 object-cover shrink-0 mt-1"
                />
                <div className="flex-1 relative">
                  <textarea
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={t('lessonDiscussion.placeholder', 'Ask a question or share a thought about this lesson...')}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/20 dark:border-white/10 rounded-xl p-3 text-sm text-textMain placeholder:text-textMuted focus:outline-none focus:border-primaryLight focus:ring-1 focus:ring-primaryLight transition-all resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={!newComment.trim() || submitting}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-main text-white font-bold text-sm shadow-md hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Posting...</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>{t('lessonDiscussion.submit', 'Post Comment')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="p-4 rounded-xl bg-white/5 border border-black/10 dark:border-white/10 text-center text-textMuted text-sm">
              {t('lessonDiscussion.loginRequired', 'Please log in to join the discussion and post questions.')}
            </div>
          )}

          {/* Comment List */}
          {loading ? (
            <div className="flex items-center justify-center py-8 text-textMuted gap-2">
              <Loader2 size={20} className="animate-spin text-primaryLight" />
              <span>Loading discussions...</span>
            </div>
          ) : rootComments.length === 0 ? (
            <div className="text-center py-10 text-textMuted border border-dashed border-black/10 dark:border-white/10 rounded-xl">
              <MessageSquare size={32} className="mx-auto mb-2 opacity-50 text-primaryLight" />
              <p className="font-medium text-sm">
                {t('lessonDiscussion.emptyTitle', 'No discussions yet')}
              </p>
              <p className="text-xs mt-1">
                {t('lessonDiscussion.emptySubtitle', 'Be the first to ask a question or leave a note on this lesson!')}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {rootComments.map(comment => {
                const replies = getReplies(comment.id);
                const hasUpvoted = user && comment.upvotedBy?.includes(user.email);

                return (
                  <div key={comment.id} className="space-y-4">
                    {/* Top Level Comment Card */}
                    <div className="p-4 rounded-xl bg-white/40 dark:bg-white/5 border border-black/10 dark:border-white/10 transition-all hover:border-primary/20">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={getAvatar(comment)}
                            alt={comment.username}
                            className="w-9 h-9 rounded-full border border-black/10 dark:border-white/10 object-cover"
                          />
                          <div>
                            <div className="font-bold text-sm text-textMain">{comment.username}</div>
                            <div className="text-[10px] text-textMuted">{formatTimestamp(comment.createdAt)}</div>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-textMain leading-relaxed mb-3 whitespace-pre-wrap">
                        {comment.content}
                      </p>

                      <div className="flex items-center gap-4 text-xs font-medium">
                        <button
                          onClick={() => handleUpvote(comment)}
                          disabled={!user || pendingVoteIds.includes(comment.id)}
                          aria-pressed={!!hasUpvoted}
                          aria-label={`${hasUpvoted ? 'Remove your upvote from' : 'Upvote'} ${comment.username}'s comment`}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                            hasUpvoted
                              ? 'bg-primary/20 border-primary/40 text-primaryLight font-bold'
                              : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-textMuted hover:text-textMain hover:bg-black/10 dark:hover:bg-white/10'
                          }`}
                        >
                          <ThumbsUp size={14} className={hasUpvoted ? 'fill-primaryLight' : ''} />
                          <span>{comment.upvotes || 0}</span>
                        </button>

                        {user && (
                          <button
                            onClick={() => {
                              setReplyToId(replyToId === comment.id ? null : comment.id);
                              setReplyText('');
                            }}
                            className="flex items-center gap-1 text-textMuted hover:text-textMain transition-colors"
                          >
                            <Reply size={14} />
                            <span>Reply</span>
                          </button>
                        )}
                      </div>

                      {/* Reply Input Form */}
                      {replyToId === comment.id && user && (
                        <form onSubmit={(e) => handlePostComment(e, comment.id)} className="mt-4 pt-3 border-t border-black/10 dark:border-white/10 flex flex-col gap-2 animate-fade-in">
                          <textarea
                            rows={2}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`Reply to @${comment.username}...`}
                            className="w-full bg-black/5 dark:bg-white/5 border border-black/20 dark:border-white/10 rounded-xl p-2.5 text-xs text-textMain placeholder:text-textMuted focus:outline-none focus:border-primaryLight transition-all resize-none"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setReplyToId(null)}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium text-textMuted hover:text-textMain"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={!replyText.trim() || submitting}
                              className="px-4 py-1.5 rounded-lg bg-gradient-main text-white font-bold text-xs shadow hover:scale-105 transition-all disabled:opacity-50"
                            >
                              Reply
                            </button>
                          </div>
                        </form>
                      )}
                    </div>

                    {/* Nested Replies */}
                    {replies.length > 0 && (
                      <div className="pl-6 space-y-3 border-l-2 border-primary/20 ml-4">
                        {replies.map(reply => {
                          const replyHasUpvoted = user && reply.upvotedBy?.includes(user.email);
                          return (
                            <div key={reply.id} className="p-3 rounded-xl bg-white/20 dark:bg-white/[0.03] border border-black/5 dark:border-white/5 flex items-start gap-3">
                              <CornerDownRight size={14} className="text-primaryLight shrink-0 mt-2" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={getAvatar(reply)}
                                      alt={reply.username}
                                      className="w-6 h-6 rounded-full border border-black/10 dark:border-white/10 object-cover"
                                    />
                                    <span className="font-bold text-xs text-textMain">{reply.username}</span>
                                    <span className="text-[10px] text-textMuted">{formatTimestamp(reply.createdAt)}</span>
                                  </div>
                                </div>
                                <p className="text-xs text-textMain leading-relaxed mb-2 whitespace-pre-wrap">
                                  {reply.content}
                                </p>
                                <button
                                  onClick={() => handleUpvote(reply)}
                                  disabled={!user || pendingVoteIds.includes(reply.id)}
                                  aria-pressed={!!replyHasUpvoted}
                                  aria-label={`${replyHasUpvoted ? 'Remove your upvote from' : 'Upvote'} ${reply.username}'s reply`}
                                  className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] border transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                                    replyHasUpvoted
                                      ? 'bg-primary/20 border-primary/40 text-primaryLight font-bold'
                                      : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-textMuted hover:text-textMain'
                                  }`}
                                >
                                  <ThumbsUp size={12} className={replyHasUpvoted ? 'fill-primaryLight' : ''} />
                                  <span>{reply.upvotes || 0}</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
