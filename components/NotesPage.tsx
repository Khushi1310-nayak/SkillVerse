import React, { useState } from 'react';
import { Search, FileText, BookOpen, Sparkles, Filter, Plus, Clock, CheckCircle2, Database, RefreshCcw, AlertCircle, LayoutGrid, List } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  course: string;
  type: 'Lesson' | 'AI';
  date: string;
  content: string;
  tags: string[];
}

const INITIAL_NOTES: Note[] = [
  { id: 'n-1', title: 'Introduction to Calculus', course: 'Mathematics', type: 'Lesson', date: '2026-08-20', content: 'This lesson covers the basics of limits and derivatives.', tags: ['calculus', 'derivatives'] },
  { id: 'n-2', title: 'React Hooks Deep Dive', course: 'Web Development', type: 'Lesson', date: '2026-08-21', content: 'We explored useState, useEffect, and custom hooks.', tags: ['react', 'hooks'] },
  { id: 'n-3', title: 'AI Summary: Photosynthesis', course: 'Biology', type: 'AI', date: '2026-08-22', content: 'AI generated summary of the photosynthesis process.', tags: ['ai', 'biology'] },
  { id: 'n-4', title: 'Data Structures: Stacks & Queues', course: 'Computer Science', type: 'Lesson', date: '2026-08-23', content: 'Understanding LIFO and FIFO structures.', tags: ['algorithms', 'data'] },
];

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [notification, setNotification] = useState('');

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          note.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'All' || note.type === filterType;
    return matchesSearch && matchesType;
  });

  const resetSearch = () => {
    setSearchQuery('');
    setFilterType('All');
    setNotification('Search filters reset successfully!');
    setTimeout(() => setNotification(''), 3000);
  };

  const addNote = () => {
    setNotification('Note creation modal would open here.');
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-slate-900 border border-blue-500/20 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
          <div className="absolute -right-10 -top-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-blue-500/20 text-blue-300 text-xs px-3 py-1 rounded-full font-semibold border border-blue-500/30 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> Unified Hub
                </span>
                <span className="text-slate-400 text-xs flex items-center gap-1">
                  <Database className="w-3.5 h-3.5 text-indigo-400" /> {notes.length} Notes
                </span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-blue-200 bg-clip-text text-transparent">
                Unified Notes Page
              </h1>
              <p className="text-slate-400 mt-2 max-w-2xl text-sm leading-relaxed">
                Aggregate and search lesson notes and AI notes across all courses.
              </p>
            </div>
            <button onClick={resetSearch} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-3 rounded-xl font-medium transition flex items-center gap-2 border border-slate-700 text-sm">
              <RefreshCcw className="w-4 h-4" /> Reset Filters
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-xl"><FileText className="w-6 h-6 text-blue-400" /></div>
              <div>
                <p className="text-2xl font-bold">{notes.length}</p>
                <p className="text-slate-400 text-xs">Total Notes</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/10 rounded-xl"><Sparkles className="w-6 h-6 text-emerald-400" /></div>
              <div>
                <p className="text-2xl font-bold">{notes.filter(n => n.type === 'AI').length}</p>
                <p className="text-slate-400 text-xs">AI Notes</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-500/10 rounded-xl"><BookOpen className="w-6 h-6 text-yellow-400" /></div>
              <div>
                <p className="text-2xl font-bold">{notes.filter(n => n.type === 'Lesson').length}</p>
                <p className="text-slate-400 text-xs">Lesson Notes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search notes by title, course, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Types</option>
              <option value="Lesson">Lesson</option>
              <option value="AI">AI</option>
            </select>
            <button 
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-3 rounded-xl text-sm transition"
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
            </button>
            <button 
              onClick={addNote}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl text-sm font-medium transition shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Note
            </button>
          </div>
        </div>

        {/* Notes Grid/List */}
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredNotes.map(note => (
            <div key={note.id} className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 hover:border-blue-500/30 transition group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${note.type === 'AI' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                    {note.type === 'AI' ? <Sparkles className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{note.title}</p>
                    <p className="text-xs text-slate-400">{note.course}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  note.type === 'AI' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                }`}>
                  {note.type}
                </span>
              </div>
              <p className="text-sm text-slate-300 line-clamp-2 mb-4">{note.content}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {note.tags.map(tag => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {note.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Notification */}
        {notification && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 text-sm text-blue-300 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            {notification}
          </div>
        )}

      </div>
    </div>
  );
}