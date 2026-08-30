import React, { useCallback, useEffect, useState } from 'react';
import {
  ChevronRight,
  Clock3,
  Code2,
  FileCode2,
  Loader2,
  RefreshCw,
  UserRound,
  X,
  Check,
  CornerDownRight,
  Pencil,
  Pin,
  PinOff,
  Reply,
  Send,
  ThumbsUp,
  Trash2,
} from 'lucide-react';
import { firestoreService } from '../services/firestoreService';
import { useAuthContext } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { ReportContentButton } from './ReportContentButton';
import { CodeReviewComment, CodeReviewRequest } from '../types';

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return 'Recently';

  const diffMinutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
  if (diffMinutes < 10080) return `${Math.floor(diffMinutes / 1440)}d ago`;
  return date.toLocaleDateString();
};

const getCodePreview = (code: string) => {
  const preview = code.replace(/\s+/g, ' ').trim();
  return preview.length > 150 ? `${preview.slice(0, 150)}...` : preview;
};

export const CodeReviewQueue: React.FC = () => {
  const { user, appUser } = useAuthContext();
  const { showToast } = useToast();
  const [requests, setRequests] = useState<CodeReviewRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<CodeReviewRequest | null>(null);
  const [comments, setComments] = useState<CodeReviewComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const fetchRequests = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(false);

    try {
      const openRequests = await firestoreService.getCodeReviewRequests();
      setRequests(openRequests);
      setSelectedRequest((current) =>
        current
          ? openRequests.find((request) => request.id === current.id) || null
          : null,
      );
    } catch (err) {
      console.error('Failed to load code review requests:', err);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const fetchComments = useCallback(async (requestId: string) => {
    setCommentsLoading(true);
    try {
      setComments(await firestoreService.getCodeReviewComments(requestId));
    } catch (err) {
      console.error('Failed to load code review comments:', err);
      showToast({ message: 'Failed to load review comments.', type: 'error' });
    } finally {
      setCommentsLoading(false);
    }
  }, [showToast]);

  const handleSelectRequest = (request: CodeReviewRequest) => {
    setSelectedRequest(request);
    setReplyToId(null);
    setEditingId(null);
    fetchComments(request.id);
  };

  const getUserId = () => user?.uid || appUser?.uid || '';
  const getUsername = () => appUser?.username || user?.displayName || 'Learner';

  const handlePostComment = async (event: React.FormEvent, parentId: string | null = null) => {
    event.preventDefault();
    if (!selectedRequest || !getUserId() || submittingComment) return;
    const content = (parentId ? replyText : newComment).trim();
    if (!content) return;

    setSubmittingComment(true);
    try {
      const comment = await firestoreService.postCodeReviewComment({
        requestId: selectedRequest.id,
        userId: getUserId(),
        username: getUsername(),
        content,
        parentId,
      });
      setComments((current) => [comment, ...current]);
      if (selectedRequest.userId !== getUserId()) {
        await firestoreService.createNotification(selectedRequest.userId, {
          type: 'comment_reply',
          message: `${comment.username} commented on your code review request.`,
          actorUsername: comment.username,
          link: `/code-review/${selectedRequest.id}`,
        });
      }
      if (parentId) {
        setReplyText('');
        setReplyToId(null);
      } else {
        setNewComment('');
      }
    } catch (err) {
      console.error('Failed to post code review comment:', err);
      showToast({ message: 'Failed to post review comment.', type: 'error' });
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleUpvote = async (comment: CodeReviewComment) => {
    const userId = getUserId();
    if (!userId || !selectedRequest) return;
    try {
      const result = await firestoreService.upvoteCodeReviewComment(comment.id, userId, selectedRequest.id);
      setComments((current) => current.map((item) => item.id === comment.id ? {
        ...item,
        upvotes: result.upvotes,
        upvotedBy: result.upvoted
          ? Array.from(new Set([...item.upvotedBy, userId]))
          : item.upvotedBy.filter((id) => id !== userId),
      } : item));
    } catch (err) {
      console.error('Failed to update code review comment vote:', err);
      showToast({ message: 'Failed to update vote.', type: 'error' });
    }
  };

  const handleSaveEdit = async (commentId: string) => {
    if (!selectedRequest || !editText.trim()) return;
    try {
      await firestoreService.editCodeReviewComment(commentId, selectedRequest.id, editText.trim());
      setComments((current) => current.map((comment) => comment.id === commentId ? { ...comment, content: editText.trim() } : comment));
      setEditingId(null);
      setEditText('');
    } catch (err) {
      console.error('Failed to edit code review comment:', err);
      showToast({ message: 'Failed to update comment.', type: 'error' });
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!selectedRequest || !window.confirm('Delete this comment? This cannot be undone.')) return;
    try {
      await firestoreService.deleteCodeReviewComment(commentId, selectedRequest.id);
      setComments((current) => current.filter((comment) => comment.id !== commentId && comment.parentId !== commentId));
    } catch (err) {
      console.error('Failed to delete code review comment:', err);
      showToast({ message: 'Failed to delete comment.', type: 'error' });
    }
  };

  const handleTogglePin = async (comment: CodeReviewComment) => {
    if (!selectedRequest) return;
    try {
      if (comment.pinned) {
        await firestoreService.unpinCodeReviewComment(comment.id, selectedRequest.id);
      } else {
        await firestoreService.pinCodeReviewComment(comment.id, selectedRequest.id);
      }
      setComments((current) => current.map((item) => item.id === comment.id ? { ...item, pinned: !comment.pinned } : item));
    } catch (err) {
      console.error('Failed to update code review comment pin:', err);
      showToast({ message: 'Failed to update pin status.', type: 'error' });
    }
  };

  const isModerator = appUser?.role === 'admin' || appUser?.role === 'instructor';
  const rootComments = comments.filter((comment) => !comment.parentId).sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned));
  const getReplies = (parentId: string) => comments.filter((comment) => comment.parentId === parentId);

  const CommentActions: React.FC<{ comment: CodeReviewComment; compact?: boolean }> = ({ comment, compact = false }) => {
    const userId = getUserId();
    const canEdit = !!userId && comment.userId === userId;
    const hasUpvoted = !!userId && comment.upvotedBy.includes(userId);
    return (
      <div className={`flex items-center gap-3 ${compact ? 'text-[10px]' : 'text-xs'}`}>
        <button type="button" onClick={() => handleUpvote(comment)} className={`flex items-center gap-1 rounded-lg border px-2 py-1 transition-all ${hasUpvoted ? 'border-primary/40 bg-primary/20 text-primaryLight' : 'border-black/10 text-textMuted dark:border-white/10'}`}>
          <ThumbsUp size={compact ? 11 : 13} className={hasUpvoted ? 'fill-primaryLight' : ''} /> {comment.upvotes || 0}
        </button>
        {!compact && <button type="button" onClick={() => { setReplyToId(comment.id); setReplyText(''); }} className="flex items-center gap-1 text-textMuted hover:text-textMain"><Reply size={13} /> Reply</button>}
        {canEdit && editingId !== comment.id && <button type="button" onClick={() => { setEditingId(comment.id); setEditText(comment.content); }} className="flex items-center gap-1 text-textMuted hover:text-textMain"><Pencil size={13} /> Edit</button>}
        {canEdit && <button type="button" onClick={() => handleDelete(comment.id)} className="flex items-center gap-1 text-textMuted hover:text-red-400"><Trash2 size={13} /> Delete</button>}
        {isModerator && <button type="button" onClick={() => handleTogglePin(comment)} className="flex items-center gap-1 text-textMuted hover:text-primaryLight">{comment.pinned ? <PinOff size={13} /> : <Pin size={13} />} {comment.pinned ? 'Unpin' : 'Pin'}</button>}
        <ReportContentButton contentId={comment.id} contentType="comment" courseId={selectedRequest?.id || ''} authorId={comment.userId} authorUsername={comment.username} contentSnapshot={comment.content} user={appUser} compact={compact} />
      </div>
    );
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8 md:px-8 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-primaryLight mb-2">
            <Code2 size={18} />
            <span className="text-xs font-bold uppercase tracking-[0.18em]">
              Peer Review
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-textMain">
            Code Review Queue
          </h1>
          <p className="text-sm text-textMuted mt-1">
            Choose an open request and inspect the submitted solution.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchRequests(true)}
          disabled={loading || refreshing}
          className="inline-flex items-center justify-center gap-2 self-start md:self-auto px-4 py-2.5 rounded-xl bg-white/50 dark:bg-white/5 border border-black/15 dark:border-white/10 text-sm font-bold text-textMain hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight"
          title="Refresh review queue"
        >
          <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-20 text-textMuted">
          <Loader2 size={20} className="animate-spin text-primaryLight" />
          Loading review requests...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-8 text-center">
          <p className="text-sm font-semibold text-red-300 mb-4">
            Review requests could not be loaded.
          </p>
          <button
            type="button"
            onClick={() => fetchRequests()}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-main px-4 py-2 text-sm font-bold text-white transition-all hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight"
          >
            <RefreshCw size={15} />
            Try again
          </button>
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/15 dark:border-white/10 bg-glass p-12 text-center shadow-lg">
          <FileCode2 size={34} className="mx-auto mb-3 text-primaryLight opacity-70" />
          <h2 className="text-base font-bold text-textMain">No open review requests</h2>
          <p className="text-sm text-textMuted mt-1">
            New requests will appear here when learners ask for feedback.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7 space-y-3">
            {requests.map((request) => {
              const isSelected = selectedRequest?.id === request.id;
              return (
                <button
                  key={request.id}
                  type="button"
                  onClick={() => setSelectedRequest(request)}
                  className={`w-full text-left rounded-2xl border p-5 shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight ${
                    isSelected
                      ? 'border-primaryLight/60 bg-primary/10 shadow-primary/10'
                      : 'border-black/15 bg-glass hover:border-primary/30 dark:border-white/10 dark:hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-textMain">
                          <UserRound size={13} className="text-primaryLight" />
                          {request.username}
                        </span>
                        <span className="rounded-full border border-blue-400/25 bg-blue-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-300">
                          {request.language}
                        </span>
                        <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                          {request.status}
                        </span>
                      </div>
                      <h2 className="truncate text-base font-bold text-textMain">
                        {request.problemContext || 'General code review request'}
                      </h2>
                    </div>
                    <ChevronRight
                      size={18}
                      className={`shrink-0 text-textMuted transition-transform ${isSelected ? 'translate-x-1 text-primaryLight' : ''}`}
                    />
                  </div>

                  <p className="mt-3 line-clamp-2 font-mono text-xs leading-relaxed text-textMuted">
                    {getCodePreview(request.code)}
                  </p>

                  <div className="mt-4 flex items-center gap-1.5 text-[11px] font-medium text-textMuted">
                    <Clock3 size={13} />
                    {formatTimestamp(request.createdAt)}
                  </div>
                </button>
              );
            })}
          </div>

          {selectedRequest && (
            <aside className="lg:col-span-5 rounded-2xl border border-black/15 bg-glass p-5 shadow-xl dark:border-white/10 lg:sticky lg:top-24">
              <div className="flex items-start justify-between gap-4 border-b border-black/10 pb-4 dark:border-white/10">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primaryLight">
                    Selected Request
                  </span>
                  <h2 className="mt-1 text-lg font-bold text-textMain">
                    {selectedRequest.problemContext || 'General code review request'}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  aria-label="Close selected request"
                  className="rounded-lg p-1.5 text-textMuted transition-colors hover:bg-black/5 hover:text-textMain dark:hover:bg-white/10"
                >
                  <X size={17} />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 py-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-textMain">
                  <UserRound size={13} className="text-primaryLight" />
                  {selectedRequest.username}
                </span>
                <span className="rounded-full border border-blue-400/25 bg-blue-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-300">
                  {selectedRequest.language}
                </span>
                <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                  {selectedRequest.status}
                </span>
              </div>

              <div className="mb-3 flex items-center gap-1.5 text-xs text-textMuted">
                <Clock3 size={14} />
                Submitted {formatTimestamp(selectedRequest.createdAt)}
              </div>

              <pre className="max-h-[28rem] overflow-auto rounded-xl border border-black/10 bg-[#050911] p-4 font-mono text-xs leading-relaxed text-[#cbd5e1] shadow-inner custom-scrollbar dark:border-white/10">
                <code>{selectedRequest.code}</code>
              </pre>

              {getUserId() ? (
                <form onSubmit={(event) => handlePostComment(event)} className="mt-5 space-y-2">
                  <label htmlFor="review-comment" className="text-xs font-bold text-textMuted">
                    Add review comment
                  </label>
                  <textarea
                    id="review-comment"
                    rows={3}
                    value={newComment}
                    onChange={(event) => setNewComment(event.target.value)}
                    placeholder="Share a helpful observation about this solution..."
                    className="w-full resize-none rounded-xl border border-black/15 bg-black/5 p-3 text-sm text-textMain placeholder:text-textMuted focus:border-primaryLight focus:outline-none focus:ring-1 focus:ring-primaryLight dark:border-white/10 dark:bg-white/5"
                  />
                  <div className="flex justify-end">
                    <button type="submit" disabled={!newComment.trim() || submittingComment} className="inline-flex items-center gap-2 rounded-xl bg-gradient-main px-4 py-2 text-xs font-bold text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50">
                      {submittingComment ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                      {submittingComment ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </form>
              ) : (
                <p className="mt-5 rounded-xl border border-black/10 bg-black/5 p-3 text-center text-xs text-textMuted dark:border-white/10 dark:bg-white/5">
                  Sign in to join this review.
                </p>
              )}

              <div className="mt-6 border-t border-black/10 pt-5 dark:border-white/10">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-textMain">Review Discussion</h3>
                  <span className="text-xs text-textMuted">{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>
                </div>
                {commentsLoading ? (
                  <div className="flex items-center justify-center gap-2 py-8 text-xs text-textMuted"><Loader2 size={16} className="animate-spin text-primaryLight" /> Loading comments...</div>
                ) : rootComments.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-black/10 p-6 text-center text-xs text-textMuted dark:border-white/10">No review comments yet.</p>
                ) : (
                  <div className="space-y-4">
                    {rootComments.map((comment) => (
                      <div key={comment.id} className={`rounded-xl border p-3 ${comment.pinned ? 'border-primary/30 bg-primary/5' : 'border-black/10 bg-white/30 dark:border-white/10 dark:bg-white/5'}`}>
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-xs font-bold text-textMain">
                            <UserRound size={13} className="text-primaryLight" /> {comment.username}
                            {comment.pinned && <span className="inline-flex items-center gap-1 text-[10px] text-primaryLight"><Pin size={10} className="fill-primaryLight" /> Pinned</span>}
                          </div>
                          <span className="text-[10px] text-textMuted">{formatTimestamp(comment.createdAt)}</span>
                        </div>
                        {editingId === comment.id ? (
                          <div className="space-y-2">
                            <textarea rows={3} value={editText} onChange={(event) => setEditText(event.target.value)} className="w-full resize-none rounded-lg border border-black/10 bg-black/5 p-2 text-xs text-textMain focus:outline-none focus:ring-1 focus:ring-primaryLight dark:border-white/10 dark:bg-white/5" />
                            <div className="flex justify-end gap-2"><button type="button" onClick={() => setEditingId(null)} className="px-2 py-1 text-[10px] text-textMuted">Cancel</button><button type="button" onClick={() => handleSaveEdit(comment.id)} disabled={!editText.trim()} className="inline-flex items-center gap-1 rounded-lg bg-gradient-main px-2.5 py-1 text-[10px] font-bold text-white disabled:opacity-50"><Check size={11} /> Save</button></div>
                          </div>
                        ) : <p className="mb-3 whitespace-pre-wrap text-xs leading-relaxed text-textMain">{comment.content}</p>}
                        <CommentActions comment={comment} />

                        {replyToId === comment.id && getUserId() && (
                          <form onSubmit={(event) => handlePostComment(event, comment.id)} className="mt-3 space-y-2 border-t border-black/10 pt-3 dark:border-white/10">
                            <textarea rows={2} value={replyText} onChange={(event) => setReplyText(event.target.value)} placeholder={`Reply to @${comment.username}...`} className="w-full resize-none rounded-lg border border-black/10 bg-black/5 p-2 text-xs text-textMain focus:outline-none focus:ring-1 focus:ring-primaryLight dark:border-white/10 dark:bg-white/5" />
                            <div className="flex justify-end gap-2"><button type="button" onClick={() => setReplyToId(null)} className="px-2 py-1 text-[10px] text-textMuted">Cancel</button><button type="submit" disabled={!replyText.trim() || submittingComment} className="rounded-lg bg-gradient-main px-3 py-1 text-[10px] font-bold text-white disabled:opacity-50">Reply</button></div>
                          </form>
                        )}

                        {getReplies(comment.id).length > 0 && <div className="mt-3 space-y-2 border-l-2 border-primary/20 pl-3">{getReplies(comment.id).map((reply) => <div key={reply.id} className="rounded-lg border border-black/5 bg-black/5 p-2.5 dark:border-white/5 dark:bg-white/[0.03]"><div className="mb-1 flex items-center justify-between gap-2 text-[10px]"><span className="inline-flex items-center gap-1 font-bold text-textMain"><CornerDownRight size={11} className="text-primaryLight" /> {reply.username}</span><span className="text-textMuted">{formatTimestamp(reply.createdAt)}</span></div>{editingId === reply.id ? <div className="space-y-2"><textarea rows={2} value={editText} onChange={(event) => setEditText(event.target.value)} className="w-full resize-none rounded-lg border border-black/10 bg-black/5 p-2 text-[10px] text-textMain focus:outline-none focus:ring-1 focus:ring-primaryLight dark:border-white/10 dark:bg-white/5" /><div className="flex justify-end gap-2"><button type="button" onClick={() => setEditingId(null)} className="text-[10px] text-textMuted">Cancel</button><button type="button" onClick={() => handleSaveEdit(reply.id)} disabled={!editText.trim()} className="text-[10px] font-bold text-primaryLight">Save</button></div></div> : <p className="mb-2 whitespace-pre-wrap text-[11px] leading-relaxed text-textMain">{reply.content}</p>}<CommentActions comment={reply} compact /></div>)}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          )}
        </div>
      )}
    </section>
  );
};
