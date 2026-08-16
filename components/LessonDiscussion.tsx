import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, ThumbsUp, Send, ChevronDown, ChevronUp, Reply, CornerDownRight, Loader2, Pencil, Trash2, Check, X } from 'lucide-react';
import { firestoreService } from '../services/firestoreService';
import { useToast } from '../contexts/ToastContext';
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
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(true);
  const [comments, setComments] = useState<LessonComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

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
    try {
      const created = await firestoreService.postLessonComment({
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
    } catch (err) {
      console.error('Error posting comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (commentId: string) => {
    if (!user) return;
    const updatedComments = await firestoreService.upvoteLessonComment(commentId, user.email, courseId, lessonId);
    setComments(updatedComments);
  };

  const handleStartEdit = (comment: LessonComment) => {
    setEditingId(comment.id);
    setEditText(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleSaveEdit = async (commentId: string) => {
    const trimmed = editText.trim();
    if (!trimmed) return;
    try {
      const updated = await firestoreService.editLessonComment(commentId, courseId, lessonId, trimmed);
      setComments(updated);
      setEditingId(null);
      setEditText('');
    } catch (err) {
      console.error('Error editing comment:', err);
      showToast({ message: 'Failed to update comment.', type: 'error' });
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Delete this comment? This cannot be undone.')) return;
    try {
      const updated = await firestoreService.deleteLessonComment(commentId, courseId, lessonId);
      setComments(updated);
      showToast({ message: 'Comment deleted.', type: 'success' });
    } catch (err) {
      console.error('Error deleting comment:', err);
      showToast({ message: 'Failed to delete comment.', type: 'error' });
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

                      {editingId === comment.id ? (
                        <div className="mb-3 flex flex-col gap-2">
                          <textarea
                            rows={3}
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full bg-black/5 dark:bg-white/5 border border-black/20 dark:border-white/10 rounded-xl p-3 text-sm text-textMain focus:outline-none focus:border-primaryLight focus:ring-1 focus:ring-primaryLight transition-all resize-none"
                          />
                          <div className="flex justify-end gap-2">
                            <button type="button" onClick={handleCancelEdit} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-textMuted hover:text-textMain">
                              <X size={14} /> Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(comment.id)}
                              disabled={!editText.trim()}
                              className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-gradient-main text-white font-bold text-xs shadow hover:scale-105 transition-all disabled:opacity-50"
                            >
                              <Check size={14} /> Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-textMain leading-relaxed mb-3 whitespace-pre-wrap">
                          {comment.content}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs font-medium">
                        <button
                          onClick={() => handleUpvote(comment.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${hasUpvoted
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

                        {user && user.email === comment.userId && editingId !== comment.id && (
                          <>
                            <button onClick={() => handleStartEdit(comment)} className="flex items-center gap-1 text-textMuted hover:text-textMain transition-colors" aria-label="Edit comment">
                              <Pencil size={14} />
                              <span>Edit</span>
                            </button>
                            <button onClick={() => handleDelete(comment.id)} className="flex items-center gap-1 text-textMuted hover:text-red-500 transition-colors" aria-label="Delete comment">
                              <Trash2 size={14} />
                              <span>Delete</span>
                            </button>
                          </>
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
                                {editingId === reply.id ? (
                                  <div className="mb-2 flex flex-col gap-2">
                                    <textarea
                                      rows={2}
                                      value={editText}
                                      onChange={(e) => setEditText(e.target.value)}
                                      className="w-full bg-black/5 dark:bg-white/5 border border-black/20 dark:border-white/10 rounded-lg p-2 text-xs text-textMain focus:outline-none focus:border-primaryLight transition-all resize-none"
                                    />
                                    <div className="flex justify-end gap-2">
                                      <button type="button" onClick={handleCancelEdit} className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium text-textMuted hover:text-textMain">
                                        <X size={12} /> Cancel
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleSaveEdit(reply.id)}
                                        disabled={!editText.trim()}
                                        className="flex items-center gap-1 px-3 py-1 rounded bg-gradient-main text-white font-bold text-[10px] disabled:opacity-50"
                                      >
                                        <Check size={12} /> Save
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-xs text-textMain leading-relaxed mb-2 whitespace-pre-wrap">
                                    {reply.content}
                                  </p>
                                )}
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => handleUpvote(reply.id)}
                                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] border transition-all ${replyHasUpvoted
                                        ? 'bg-primary/20 border-primary/40 text-primaryLight font-bold'
                                        : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-textMuted hover:text-textMain'
                                      }`}
                                  >
                                    <ThumbsUp size={12} className={replyHasUpvoted ? 'fill-primaryLight' : ''} />
                                    <span>{reply.upvotes || 0}</span>
                                  </button>
                                  {user && user.email === reply.userId && editingId !== reply.id && (
                                    <>
                                      <button onClick={() => handleStartEdit(reply)} className="flex items-center gap-1 text-[10px] text-textMuted hover:text-textMain transition-colors" aria-label="Edit reply">
                                        <Pencil size={12} /> Edit
                                      </button>
                                      <button onClick={() => handleDelete(reply.id)} className="flex items-center gap-1 text-[10px] text-textMuted hover:text-red-500 transition-colors" aria-label="Delete reply">
                                        <Trash2 size={12} /> Delete
                                      </button>
                                    </>
                                  )}
                                </div>
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
