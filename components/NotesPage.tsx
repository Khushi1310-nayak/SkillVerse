import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Search,
  FileText,
  BookOpen,
  Sparkles,
  RefreshCcw,
  Trash2,
  Download,
  Copy,
  Check,
  ExternalLink,
  LayoutGrid,
  List,
  Clock,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { COURSES } from '../constants';
import { LessonNote, SavedAINote } from '../types';
import { generateLessonNotesPDF } from '../utils/pdfGenerator';

interface UnifiedNote {
  id: string;
  type: 'Lesson' | 'AI';
  title: string;
  courseName: string;
  courseId?: string;
  lessonId?: string;
  content: string;
  code?: string;
  date: string;
  updatedAt: string;
}

export const NotesPage: React.FC = () => {
  const { t } = useTranslation();
  const [lessonNotes, setLessonNotes] = useState<LessonNote[]>([]);
  const [aiNotes, setAiNotes] = useState<SavedAINote[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Lesson' | 'AI'>('All');
  const [selectedCourse, setSelectedCourse] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string>('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const loadAllNotes = () => {
    const lNotes = storageService.getAllLessonNotes();
    const aNotes = storageService.getSavedAINotes();
    setLessonNotes(lNotes);
    setAiNotes(aNotes);
  };

  useEffect(() => {
    loadAllNotes();
  }, []);

  const courseTitleMap = useMemo(() => {
    const map = new Map<string, string>();
    COURSES.forEach(c => map.set(c.id, c.title));
    return map;
  }, []);

  const unifiedNotes: UnifiedNote[] = useMemo(() => {
    const mappedLessonNotes: UnifiedNote[] = lessonNotes.map(n => {
      const cTitle = courseTitleMap.get(n.courseId) || n.courseId;
      return {
        id: n.id,
        type: 'Lesson',
        title: `${cTitle} - ${n.lessonId}`,
        courseName: cTitle,
        courseId: n.courseId,
        lessonId: n.lessonId,
        content: n.text,
        date: new Date(n.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
        updatedAt: n.updatedAt,
      };
    });

    const mappedAiNotes: UnifiedNote[] = aiNotes.map(n => ({
      id: n.id,
      type: 'AI',
      title: n.courseTitle ? `AI Note - ${n.courseTitle}` : 'AI Assistant Note',
      courseName: n.courseTitle || 'AI Assistant',
      content: n.text,
      date: new Date(n.savedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      updatedAt: n.savedAt,
    }));

    return [...mappedLessonNotes, ...mappedAiNotes].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [lessonNotes, aiNotes, courseTitleMap]);

  const uniqueCourses = useMemo(() => {
    const courses = new Set<string>();
    unifiedNotes.forEach(n => {
      if (n.courseName) courses.add(n.courseName);
    });
    return Array.from(courses);
  }, [unifiedNotes]);

  const filteredNotes = useMemo(() => {
    return unifiedNotes.filter(note => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.courseName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = filterType === 'All' || note.type === filterType;
      const matchesCourse = selectedCourse === 'All' || note.courseName === selectedCourse;

      return matchesSearch && matchesType && matchesCourse;
    });
  }, [unifiedNotes, searchQuery, filterType, selectedCourse]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Note copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (note: UnifiedNote) => {
    if (note.type === 'Lesson') {
      storageService.deleteLessonNote(note.id);
      setLessonNotes(prev => prev.filter(n => n.id !== note.id));
    } else {
      storageService.deleteAINote(note.id);
      setAiNotes(prev => prev.filter(n => n.id !== note.id));
    }
    showToast('Note deleted successfully.');
  };

  const handleExportPDF = async (note: UnifiedNote) => {
    setDownloadingId(note.id);
    try {
      await generateLessonNotesPDF({
        courseName: note.courseName,
        lessonTitle: note.title,
        date: new Date().toLocaleDateString(),
        notes: [{ text: note.content, updatedAt: note.updatedAt }],
      });
      showToast('PDF downloaded successfully!');
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      showToast('Failed to export PDF.');
    } finally {
      setDownloadingId(null);
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilterType('All');
    setSelectedCourse('All');
    showToast('Filters reset successfully!');
  };

  return (
    <div className="min-h-screen text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <header className="bg-gradient-to-r from-primary/30 via-slate-900/80 to-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
          <div className="absolute -right-10 -top-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-primary/20 text-primaryLight text-xs px-3 py-1 rounded-full font-semibold border border-primary/30 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Notes Hub
                </span>
                <span className="text-slate-400 text-xs flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> {unifiedNotes.length} Total Saved Notes
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent">
                My Learning Notes
              </h1>
              <p className="text-slate-400 mt-2 max-w-2xl text-sm leading-relaxed">
                Centralized vault for all your personal lesson notes and AI Assistant explanations.
              </p>
            </div>
            <button
              onClick={resetFilters}
              className="bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-2.5 rounded-xl font-medium transition flex items-center gap-2 border border-white/10 text-sm self-start md:self-auto"
            >
              <RefreshCcw className="w-4 h-4" /> Reset Filters
            </button>
          </div>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{unifiedNotes.length}</p>
                <p className="text-slate-400 text-xs">Total Notes</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-500/10 rounded-xl">
                <BookOpen className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{lessonNotes.length}</p>
                <p className="text-slate-400 text-xs">Course Lesson Notes</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/10 rounded-xl">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{aiNotes.length}</p>
                <p className="text-slate-400 text-xs">Saved AI Discussions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-4 md:p-6 flex flex-col md:flex-row gap-4 backdrop-blur-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search notes by keyword, lesson, or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primaryLight transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="bg-black/30 dark:bg-[#0f1623]/90 border border-white/15 rounded-2xl px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-primaryLight focus:ring-2 focus:ring-primaryLight/30 backdrop-blur-md shadow-md cursor-pointer transition-all duration-300 hover:border-primaryLight/50"
            >
              <option value="All" className="bg-[#0B1220] text-white">All Types</option>
              <option value="Lesson" className="bg-[#0B1220] text-white">Lesson Notes</option>
              <option value="AI" className="bg-[#0B1220] text-white">AI Notes</option>
            </select>

            {uniqueCourses.length > 0 && (
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="bg-black/30 dark:bg-[#0f1623]/90 border border-white/15 rounded-2xl px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-primaryLight focus:ring-2 focus:ring-primaryLight/30 backdrop-blur-md shadow-md cursor-pointer transition-all duration-300 hover:border-primaryLight/50 max-w-[200px]"
              >
                <option value="All" className="bg-[#0B1220] text-white">All Courses</option>
                {uniqueCourses.map(c => (
                  <option key={c} value={c} className="bg-[#0B1220] text-white truncate">{c}</option>
                ))}
              </select>
            )}

            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2.5 bg-black/20 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl text-sm transition"
              title={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Notes Content */}
        {filteredNotes.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center backdrop-blur-sm space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
              <FolderOpen className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">No Notes Found</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                {unifiedNotes.length === 0
                  ? 'You haven’t saved any notes yet. Open any course lesson or ask the AI Assistant to save your first note!'
                  : 'No notes match your current search and filter settings.'}
              </p>
            </div>
            {unifiedNotes.length === 0 && (
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition shadow-lg shadow-primary/20"
              >
                <BookOpen className="w-4 h-4" /> Browse Courses
              </Link>
            )}
          </div>
        ) : (
          <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredNotes.map(note => (
              <div
                key={note.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-primary/40 transition flex flex-col justify-between group backdrop-blur-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-2 rounded-xl shrink-0 ${note.type === 'AI' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                        {note.type === 'AI' ? <Sparkles className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-white text-sm truncate">{note.title}</p>
                        <p className="text-xs text-slate-400 truncate">{note.courseName}</p>
                      </div>
                    </div>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      note.type === 'AI' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                    }`}>
                      {note.type}
                    </span>
                  </div>

                  <p className="text-sm text-slate-300 line-clamp-4 whitespace-pre-wrap mb-4 bg-black/20 p-3 rounded-xl border border-white/5">
                    {note.content}
                  </p>

                  {note.code && (
                    <pre className="bg-[#0f1623] p-2.5 rounded-lg text-xs text-emerald-300 font-mono overflow-x-auto mb-4 border border-white/5">
                      <code>{note.code}</code>
                    </pre>
                  )}
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> {note.date}
                  </span>

                  <div className="flex items-center gap-1">
                    {note.courseId && (
                      <Link
                        to={`/course/${note.courseId}`}
                        className="p-1.5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition"
                        title="Jump to course"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    <button
                      onClick={() => handleCopy(note.id, note.content)}
                      className="p-1.5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition"
                      title="Copy note text"
                    >
                      {copiedId === note.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleExportPDF(note)}
                      disabled={downloadingId === note.id}
                      className="p-1.5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition"
                      title="Export note as PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(note)}
                      className="p-1.5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Notification Toast */}
        {notification && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900/90 border border-primary/40 rounded-2xl px-5 py-3 text-sm text-white flex items-center gap-3 shadow-2xl backdrop-blur-md animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            {notification}
          </div>
        )}

      </div>
    </div>
  );
};

export default NotesPage;