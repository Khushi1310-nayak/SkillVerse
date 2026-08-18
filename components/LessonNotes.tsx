import React, { useState, useEffect, useCallback } from 'react';
import { NotebookPen, Trash2, Pencil, X, Check, Plus, Download, Loader2 } from 'lucide-react';
import { storageService } from '../services/storageService';
import { generateLessonNotesPDF } from '../utils/pdfGenerator';
import { useToast } from '../contexts/ToastContext';
import { LessonNote } from '../types';

interface LessonNotesProps {
    courseId: string;
    lessonId: string;
    courseName: string;
    lessonTitle: string;
}

export const LessonNotes: React.FC<LessonNotesProps> = ({ courseId, lessonId, courseName, lessonTitle }) => {
    const [notes, setNotes] = useState<LessonNote[]>([]);
    const [draft, setDraft] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState('');
    const [isExporting, setIsExporting] = useState(false);
    const { showToast } = useToast();

    const loadNotes = useCallback(() => {
        setNotes(storageService.getLessonNotes(courseId, lessonId));
    }, [courseId, lessonId]);

    useEffect(() => {
        loadNotes();
    }, [loadNotes]);

    const handleAddNote = (e: React.FormEvent) => {
        e.preventDefault();
        const text = draft.trim();
        if (!text) return;
        storageService.saveLessonNote(courseId, lessonId, text);
        setDraft('');
        loadNotes();
    };

    const startEditing = (note: LessonNote) => {
        setEditingId(note.id);
        setEditingText(note.text);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditingText('');
    };

    const handleUpdateNote = (id: string) => {
        const text = editingText.trim();
        if (!text) return;
        storageService.updateLessonNote(id, text);
        cancelEditing();
        loadNotes();
    };

    const handleDeleteNote = (id: string) => {
        storageService.deleteLessonNote(id);
        loadNotes();
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
            <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
                <div className="flex items-center gap-2">
                    <NotebookPen size={20} className="text-primaryLight" />
                    <h3 className="text-lg font-bold text-textMain">My Notes</h3>
                    {notes.length > 0 && (
                        <span className="text-xs font-medium text-textMuted bg-black/5 dark:bg-white/10 rounded-full px-2 py-0.5">
                            {notes.length}
                        </span>
                    )}
                </div>

                {notes.length > 0 && (
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

            <form onSubmit={handleAddNote} className="mb-6">
                <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Jot down a thought, reminder, or key concept from this lesson..."
                    rows={3}
                    className="w-full resize-none rounded-xl border border-black/20 dark:border-white/10 bg-white/50 dark:bg-white/5 p-3 text-sm text-textMain placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-primaryLight"
                />
                <div className="flex justify-end mt-2">
                    <button
                        type="submit"
                        disabled={!draft.trim()}
                        className="inline-flex items-center gap-1.5 bg-gradient-main text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/25 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                        <Plus size={16} /> Add Note
                    </button>
                </div>
            </form>

            {notes.length === 0 ? (
                <p className="text-sm text-textMuted italic">No notes yet for this lesson. Start writing above.</p>
            ) : (
                <div className="space-y-3">
                    {notes.map((note) => (
                        <div
                            key={note.id}
                            className="bg-white/50 dark:bg-white/5 border border-black/20 dark:border-white/10 rounded-xl p-4"
                        >
                            {editingId === note.id ? (
                                <div>
                                    <textarea
                                        value={editingText}
                                        onChange={(e) => setEditingText(e.target.value)}
                                        rows={3}
                                        autoFocus
                                        className="w-full resize-none rounded-lg border border-black/20 dark:border-white/10 bg-white/70 dark:bg-white/10 p-2 text-sm text-textMain focus:outline-none focus:ring-2 focus:ring-primaryLight"
                                    />
                                    <div className="flex justify-end gap-2 mt-2">
                                        <button
                                            onClick={cancelEditing}
                                            className="inline-flex items-center gap-1 text-xs font-medium text-textMuted hover:text-textMain px-3 py-1.5 rounded-lg transition-colors"
                                        >
                                            <X size={14} /> Cancel
                                        </button>
                                        <button
                                            onClick={() => handleUpdateNote(note.id)}
                                            disabled={!editingText.trim()}
                                            className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-primary hover:bg-primary/90 px-3 py-1.5 rounded-lg disabled:opacity-40 transition-colors"
                                        >
                                            <Check size={14} /> Save
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm text-textMain whitespace-pre-wrap break-words">{note.text}</p>
                                    <div className="flex items-center justify-between mt-3">
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
                                                onClick={() => handleDeleteNote(note.id)}
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
    );
};