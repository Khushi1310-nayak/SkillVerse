import React, { useState, useEffect, useCallback } from 'react';
import { NotebookPen, Trash2, Pencil, X, Check, Plus, Download, Loader2, Globe, Lock, Users, RefreshCw } from 'lucide-react';
import { storageService } from '../services/storageService';
import { firestoreService } from '../services/firestoreService';
import { generateLessonNotesPDF } from '../utils/pdfGenerator';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../hooks/useAuth';
import { LessonNote, PublicLessonNote } from '../types';

interface LessonNotesProps {
    courseId: string;
    lessonId: string;
    courseName: string;
    lessonTitle: string;
}

const AVATARS: Record<string, string> = {
    "1": "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    "2": "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
    "3": "https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor",
    "4": "https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan",
    "5": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha",
};

export const LessonNotes: React.FC<LessonNotesProps> = ({ courseId, lessonId, courseName, lessonTitle }) => {
    const { user, appUser } = useAuth();
    const { showToast } = useToast();

    const [activeTab, setActiveTab] = useState<'my-notes' | 'community'>('my-notes');
    const [notes, setNotes] = useState<LessonNote[]>([]);
    const [draft, setDraft] = useState('');
    const [draftVisibility, setDraftVisibility] = useState<'private' | 'public'>('private');

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState('');
    const [editingVisibility, setEditingVisibility] = useState<'private' | 'public'>('private');

    const [isExporting, setIsExporting] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Community Notes state
    const [communityNotes, setCommunityNotes] = useState<PublicLessonNote[]>([]);
    const [communityLoading, setCommunityLoading] = useState(false);
    const [communityError, setCommunityError] = useState<string | null>(null);
    const [editingCommunityId, setEditingCommunityId] = useState<string | null>(null);
    const [editingCommunityText, setEditingCommunityText] = useState('');

    const loadNotes = useCallback(() => {
        setNotes(storageService.getLessonNotes(courseId, lessonId));
    }, [courseId, lessonId]);

    const loadCommunityNotes = useCallback(async () => {
        setCommunityLoading(true);
        setCommunityError(null);
        try {
            const data = await firestoreService.getPublicLessonNotes(courseId, lessonId);
            setCommunityNotes(data);
        } catch (err: any) {
            console.error('Failed to load community notes:', err);
            setCommunityError('Failed to load community notes. Please try again.');
        } finally {
            setCommunityLoading(false);
        }
    }, [courseId, lessonId]);

    useEffect(() => {
        loadNotes();
        loadCommunityNotes();
    }, [loadNotes, loadCommunityNotes]);

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        const text = draft.trim();
        if (!text || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const savedNote = storageService.saveLessonNote(courseId, lessonId, text, draftVisibility);

            if (draftVisibility === 'public' && user) {
                try {
                    await firestoreService.createPublicLessonNote({
                        id: savedNote.id,
                        courseId,
                        lessonId,
                        userId: user.uid,
                        username: appUser?.username || user.displayName || 'Learner',
                        avatarId: appUser?.settings?.avatarId || '1',
                        photoURL: user.photoURL || undefined,
                        text,
                    });
                    showToast({ message: 'Note saved and shared with community!', type: 'success' });
                    loadCommunityNotes();
                } catch (err) {
                    console.error('Failed to sync public note to Firestore:', err);
                    showToast({ message: 'Note saved locally, but failed to share with community.', type: 'info' });
                }
            } else {
                showToast({ message: 'Private note saved!', type: 'success' });
            }

            setDraft('');
            setDraftVisibility('private');
            loadNotes();
        } catch (err) {
            console.error('Failed to save note:', err);
            showToast({ message: 'Failed to save note. Please try again.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const startEditing = (note: LessonNote) => {
        setEditingId(note.id);
        setEditingText(note.text);
        setEditingVisibility(note.visibility || 'private');
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditingText('');
        setEditingVisibility('private');
    };

    const handleUpdateNote = async (note: LessonNote) => {
        const text = editingText.trim();
        if (!text || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const oldVisibility = note.visibility || 'private';
            const newVisibility = editingVisibility;

            storageService.updateLessonNote(note.id, text, newVisibility);

            if (user) {
                if (oldVisibility === 'private' && newVisibility === 'public') {
                    try {
                        await firestoreService.createPublicLessonNote({
                            id: note.id,
                            courseId,
                            lessonId,
                            userId: user.uid,
                            username: appUser?.username || user.displayName || 'Learner',
                            avatarId: appUser?.settings?.avatarId || '1',
                            photoURL: user.photoURL || undefined,
                            text,
                        });
                        showToast({ message: 'Note published to community!', type: 'success' });
                    } catch (err) {
                        console.error('Failed to publish note to Firestore:', err);
                        showToast({ message: 'Updated locally, but failed to publish to community.', type: 'info' });
                    }
                } else if (oldVisibility === 'public' && newVisibility === 'private') {
                    try {
                        await firestoreService.deletePublicLessonNote(courseId, lessonId, note.id);
                        showToast({ message: 'Note is now private.', type: 'info' });
                    } catch (err) {
                        console.error('Failed to delete public note from Firestore:', err);
                    }
                } else if (oldVisibility === 'public' && newVisibility === 'public') {
                    try {
                        await firestoreService.updatePublicLessonNote(courseId, lessonId, note.id, text);
                        showToast({ message: 'Public note updated!', type: 'success' });
                    } catch (err) {
                        console.error('Failed to update public note in Firestore:', err);
                    }
                }
            }

            cancelEditing();
            loadNotes();
            loadCommunityNotes();
        } catch (err) {
            console.error('Failed to update note:', err);
            showToast({ message: 'Failed to update note.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteNote = async (note: LessonNote) => {
        storageService.deleteLessonNote(note.id);
        if ((note.visibility === 'public') && user) {
            try {
                await firestoreService.deletePublicLessonNote(courseId, lessonId, note.id);
            } catch (err) {
                console.error('Failed to delete public note from Firestore:', err);
            }
        }
        loadNotes();
        loadCommunityNotes();
        showToast({ message: 'Note deleted.', type: 'info' });
    };

    // Editing Community Note directly from Community tab
    const handleUpdateCommunityNote = async (pubNote: PublicLessonNote) => {
        const text = editingCommunityText.trim();
        if (!text || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await firestoreService.updatePublicLessonNote(courseId, lessonId, pubNote.id, text);
            // Also update in localStorage if present
            const localNotes = storageService.getAllLessonNotes();
            if (localNotes.some(n => n.id === pubNote.id)) {
                storageService.updateLessonNote(pubNote.id, text, 'public');
                loadNotes();
            }
            setEditingCommunityId(null);
            setEditingCommunityText('');
            showToast({ message: 'Community note updated!', type: 'success' });
            loadCommunityNotes();
        } catch (err) {
            console.error('Failed to update community note:', err);
            showToast({ message: 'Failed to update community note.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Deleting Community Note directly from Community tab
    const handleDeleteCommunityNote = async (pubNote: PublicLessonNote) => {
        setIsSubmitting(true);
        try {
            await firestoreService.deletePublicLessonNote(courseId, lessonId, pubNote.id);
            // Also remove from localStorage if present
            const localNotes = storageService.getAllLessonNotes();
            if (localNotes.some(n => n.id === pubNote.id)) {
                storageService.deleteLessonNote(pubNote.id);
                loadNotes();
            }
            showToast({ message: 'Community note deleted.', type: 'info' });
            loadCommunityNotes();
        } catch (err) {
            console.error('Failed to delete community note:', err);
            showToast({ message: 'Failed to delete community note.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleExportNotes = async () => {
        if (notes.length === 0 || isExporting) return;
        setIsExporting(true);
        try {
            await generateLessonNotesPDF({
                courseName,
                lessonTitle,
                date: new Date().toLocaleDateString(),
                notes: notes.map(n => ({ text: n.text, updatedAt: n.updatedAt })),
            });
            showToast({ message: 'Notes exported successfully!', type: 'success' });
        } catch (err) {
            console.error('Notes export failed:', err);
            showToast({ message: 'Failed to export notes. Please try again.', type: 'error' });
        } finally {
            setIsExporting(false);
        }
    };

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

    return (
        <div className="border-t border-black/20 dark:border-white/10 pt-8 mt-8">
            {/* Main Header & Navigation Tabs */}
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
                <div className="flex items-center gap-2 border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('my-notes')}
                        aria-label="View My Notes"
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight ${
                            activeTab === 'my-notes'
                                ? 'bg-white dark:bg-white/10 text-textMain shadow-sm'
                                : 'text-textMuted hover:text-textMain'
                        }`}
                    >
                        <NotebookPen size={18} className="text-primaryLight" />
                        <span>My Notes</span>
                        {notes.length > 0 && (
                            <span className="text-xs font-semibold text-textMuted bg-black/10 dark:bg-white/20 rounded-full px-2 py-0.5">
                                {notes.length}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab('community')}
                        aria-label="View Community Notes"
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight ${
                            activeTab === 'community'
                                ? 'bg-white dark:bg-white/10 text-textMain shadow-sm'
                                : 'text-textMuted hover:text-textMain'
                        }`}
                    >
                        <Users size={18} className="text-primaryLight" />
                        <span>Community Notes</span>
                        {communityNotes.length > 0 && (
                            <span className="text-xs font-semibold text-textMuted bg-black/10 dark:bg-white/20 rounded-full px-2 py-0.5">
                                {communityNotes.length}
                            </span>
                        )}
                    </button>
                </div>

                {activeTab === 'my-notes' && notes.length > 0 && (
                    <button
                        onClick={handleExportNotes}
                        disabled={isExporting}
                        aria-label="Export notes as PDF"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-textMuted hover:text-textMain bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                        {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                        {isExporting ? 'Exporting...' : 'Export Notes'}
                    </button>
                )}
            </div>

            {/* TAB 1: MY NOTES */}
            {activeTab === 'my-notes' && (
                <div>
                    {/* Add Note Form */}
                    <form onSubmit={handleAddNote} className="mb-6">
                        <textarea
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            placeholder="Jot down a thought, reminder, or key concept from this lesson..."
                            rows={3}
                            className="w-full resize-none rounded-xl border border-black/20 dark:border-white/10 bg-white/50 dark:bg-white/5 p-3 text-sm text-textMain placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-primaryLight"
                        />
                        <div className="flex items-center justify-between gap-2 mt-2 flex-wrap">
                            {/* Privacy Control Selector */}
                            <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-1 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setDraftVisibility('private')}
                                    aria-label="Keep note private"
                                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight ${
                                        draftVisibility === 'private'
                                            ? 'bg-white dark:bg-white/15 text-textMain shadow-sm'
                                            : 'text-textMuted hover:text-textMain'
                                    }`}
                                >
                                    <Lock size={12} /> Private
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!user) {
                                            showToast({ message: 'Please sign in to share notes with the community.', type: 'info' });
                                            return;
                                        }
                                        setDraftVisibility('public');
                                    }}
                                    aria-label="Make note public to community"
                                    disabled={!user}
                                    title={!user ? 'Sign in to share notes' : 'Share note with community'}
                                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight ${
                                        draftVisibility === 'public'
                                            ? 'bg-blue-500/20 text-blue-500 dark:text-blue-400 border border-blue-500/30 shadow-sm'
                                            : 'text-textMuted hover:text-textMain'
                                    }`}
                                >
                                    <Globe size={12} /> Make Public
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={!draft.trim() || isSubmitting}
                                className="inline-flex items-center gap-1.5 bg-gradient-main text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/25 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            >
                                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                                Add Note
                            </button>
                        </div>
                    </form>

                    {/* Personal Notes List */}
                    {notes.length === 0 ? (
                        <p className="text-sm text-textMuted italic">No personal notes yet for this lesson. Start writing above.</p>
                    ) : (
                        <div className="space-y-3">
                            {notes.map((note) => (
                                <div
                                    key={note.id}
                                    className="bg-white/50 dark:bg-white/5 border border-black/20 dark:border-white/10 rounded-xl p-4 transition-all"
                                >
                                    {editingId === note.id ? (
                                        <div>
                                            <textarea
                                                value={editingText}
                                                onChange={(e) => setEditingText(e.target.value)}
                                                rows={3}
                                                autoFocus
                                                className="w-full resize-none rounded-lg border border-black/20 dark:border-white/10 bg-white/70 dark:bg-white/10 p-2 text-sm text-textMain focus:outline-none focus:ring-2 focus:ring-primaryLight mb-2"
                                            />

                                            <div className="flex items-center justify-between gap-2 flex-wrap">
                                                {/* Edit Privacy Control */}
                                                <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-1 rounded-lg">
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditingVisibility('private')}
                                                        aria-label="Set note to private"
                                                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight ${
                                                            editingVisibility === 'private'
                                                                ? 'bg-white dark:bg-white/15 text-textMain shadow-sm'
                                                                : 'text-textMuted hover:text-textMain'
                                                        }`}
                                                    >
                                                        <Lock size={12} /> Private
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (!user) {
                                                                showToast({ message: 'Please sign in to share notes.', type: 'info' });
                                                                return;
                                                            }
                                                            setEditingVisibility('public');
                                                        }}
                                                        disabled={!user}
                                                        aria-label="Set note to public"
                                                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight ${
                                                            editingVisibility === 'public'
                                                                ? 'bg-blue-500/20 text-blue-500 dark:text-blue-400 border border-blue-500/30 shadow-sm'
                                                                : 'text-textMuted hover:text-textMain'
                                                        }`}
                                                    >
                                                        <Globe size={12} /> Public
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={cancelEditing}
                                                        disabled={isSubmitting}
                                                        className="inline-flex items-center gap-1 text-xs font-medium text-textMuted hover:text-textMain px-3 py-1.5 rounded-lg transition-colors"
                                                    >
                                                        <X size={14} /> Cancel
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleUpdateNote(note)}
                                                        disabled={!editingText.trim() || isSubmitting}
                                                        className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-primary hover:bg-primary/90 px-3 py-1.5 rounded-lg disabled:opacity-40 transition-colors"
                                                    >
                                                        {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <p className="text-sm text-textMain whitespace-pre-wrap break-words flex-1">{note.text}</p>
                                                {note.visibility === 'public' ? (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-500 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full shrink-0">
                                                        <Globe size={11} /> Public
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-textMuted bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 px-2 py-0.5 rounded-full shrink-0">
                                                        <Lock size={11} /> Private
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between mt-3 pt-2 border-t border-black/5 dark:border-white/5">
                                                <span className="text-xs text-textMuted">
                                                    {formatDate(note.updatedAt)}
                                                    {note.updatedAt !== note.createdAt && ' (edited)'}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => startEditing(note)}
                                                        aria-label="Edit note"
                                                        className="p-1.5 rounded-lg text-textMuted hover:text-textMain hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                                                    >
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteNote(note)}
                                                        aria-label="Delete note"
                                                        className="p-1.5 rounded-lg text-textMuted hover:text-danger hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: COMMUNITY NOTES */}
            {activeTab === 'community' && (
                <div>
                    {communityLoading ? (
                        <div className="flex flex-col items-center justify-center py-10 text-textMuted gap-2">
                            <Loader2 size={24} className="animate-spin text-primaryLight" />
                            <p className="text-sm">Loading community notes...</p>
                        </div>
                    ) : communityError ? (
                        <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-center">
                            <p className="text-sm text-danger mb-2">{communityError}</p>
                            <button
                                onClick={loadCommunityNotes}
                                aria-label="Retry loading community notes"
                                className="inline-flex items-center gap-1 text-xs font-semibold bg-danger text-white px-3 py-1.5 rounded-lg hover:bg-danger/90 transition-colors"
                            >
                                <RefreshCw size={12} /> Retry
                            </button>
                        </div>
                    ) : communityNotes.length === 0 ? (
                        <div className="text-center py-8 px-4 rounded-xl border border-dashed border-black/20 dark:border-white/10 bg-white/30 dark:bg-white/5">
                            <Globe size={32} className="mx-auto text-textMuted mb-2 opacity-50" />
                            <p className="text-sm text-textMuted font-medium">No community notes shared for this lesson yet.</p>
                            <p className="text-xs text-textMuted mt-1">
                                Have an insightful note? Create a note under "My Notes" and select <strong>"Make Public"</strong>!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {communityNotes.map((pubNote) => {
                                const isOwner = !!user && user.uid === pubNote.userId;

                                return (
                                    <div
                                        key={pubNote.id}
                                        className="bg-white/50 dark:bg-white/5 border border-black/20 dark:border-white/10 rounded-xl p-4 transition-all"
                                    >
                                        {editingCommunityId === pubNote.id ? (
                                            <div>
                                                <textarea
                                                    value={editingCommunityText}
                                                    onChange={(e) => setEditingCommunityText(e.target.value)}
                                                    rows={3}
                                                    autoFocus
                                                    className="w-full resize-none rounded-lg border border-black/20 dark:border-white/10 bg-white/70 dark:bg-white/10 p-2 text-sm text-textMain focus:outline-none focus:ring-2 focus:ring-primaryLight mb-2"
                                                />
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setEditingCommunityId(null);
                                                            setEditingCommunityText('');
                                                        }}
                                                        disabled={isSubmitting}
                                                        className="inline-flex items-center gap-1 text-xs font-medium text-textMuted hover:text-textMain px-3 py-1.5 rounded-lg transition-colors"
                                                    >
                                                        <X size={14} /> Cancel
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleUpdateCommunityNote(pubNote)}
                                                        disabled={!editingCommunityText.trim() || isSubmitting}
                                                        className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-primary hover:bg-primary/90 px-3 py-1.5 rounded-lg disabled:opacity-40 transition-colors"
                                                    >
                                                        {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                {/* Author Info Header */}
                                                <div className="flex items-center justify-between gap-2 mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <img
                                                            src={pubNote.photoURL || AVATARS[pubNote.avatarId || '1'] || AVATARS['1']}
                                                            alt={pubNote.username}
                                                            className="w-7 h-7 rounded-full object-cover border border-black/10 dark:border-white/10"
                                                        />
                                                        <div>
                                                            <span className="text-xs font-bold text-textMain">{pubNote.username}</span>
                                                            {isOwner && (
                                                                <span className="ml-1.5 text-[10px] font-semibold text-primaryLight bg-primaryLight/10 px-1.5 py-0.5 rounded-md">
                                                                    You
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className="text-[11px] text-textMuted">{formatDate(pubNote.updatedAt)}</span>
                                                </div>

                                                {/* Note Content */}
                                                <p className="text-sm text-textMain whitespace-pre-wrap break-words">{pubNote.text}</p>

                                                {/* Owner Actions */}
                                                {isOwner && (
                                                    <div className="flex items-center justify-end gap-1 mt-3 pt-2 border-t border-black/5 dark:border-white/5">
                                                        <button
                                                            onClick={() => {
                                                                setEditingCommunityId(pubNote.id);
                                                                setEditingCommunityText(pubNote.text);
                                                            }}
                                                            aria-label="Edit public note"
                                                            className="p-1.5 rounded-lg text-textMuted hover:text-textMain hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-xs inline-flex items-center gap-1"
                                                        >
                                                            <Pencil size={13} /> Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteCommunityNote(pubNote)}
                                                            aria-label="Delete public note"
                                                            className="p-1.5 rounded-lg text-textMuted hover:text-danger hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-xs inline-flex items-center gap-1"
                                                        >
                                                            <Trash2 size={13} /> Delete
                                                        </button>
                                                    </div>
                                                )}
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