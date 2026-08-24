import React, { useEffect, useState } from 'react';
import {
  Plus, Edit, Trash2, Save, X, BookOpen, Brain,
  Briefcase, Shield, ChevronRight, PlayCircle, Loader2,
  Trash, ArrowRight, Eye, CheckCircle, AlertTriangle, RefreshCcw,
  Flag, ShieldCheck
} from 'lucide-react';
import { firestoreService } from '../services/firestoreService';
import { Course, Company, QuizQuestion, Chapter, Lesson, Category, ContentReport, ReportStatus } from '../types';
import { useToast } from '../contexts/ToastContext';
import { CATEGORIES } from '../constants';

const REPORT_REASON_LABELS: Record<string, string> = {
  spam: 'Spam',
  harassment: 'Harassment / Abuse',
  inappropriate: 'Inappropriate',
  misleading: 'Misleading',
  other: 'Other',
};

export const AdminDashboard: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'courses' | 'quizzes' | 'prep' | 'moderation'>('courses');
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  // Moderation queue state
  const [reports, setReports] = useState<ContentReport[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsLoaded, setReportsLoaded] = useState(false);

  // Data states
  const [courses, setCourses] = useState<Course[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  // Selected entities for editing
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // Form edit states
  const [courseForm, setCourseForm] = useState<Partial<Course>>({});
  const [chapterForm, setChapterForm] = useState<Partial<Chapter>>({});
  const [lessonForm, setLessonForm] = useState<Partial<Lesson>>({});
  const [companyForm, setCompanyForm] = useState<Partial<Company>>({});

  // Quiz editing states
  const [selectedQuizCourseId, setSelectedQuizCourseId] = useState<string>('');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<Partial<QuizQuestion> | null>(null);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);

  // Modal open states
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [chapterModalOpen, setChapterModalOpen] = useState(false);
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [companyModalOpen, setCompanyModalOpen] = useState(false);

  // Load resources and seed database on mount
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        setSeeding(true);
        await firestoreService.seedDatabase();
        setSeeding(false);
        await refreshData();
      } catch (err) {
        showToast({ message: 'Failed to initialize database.', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const refreshData = async () => {
    try {
      const c = await firestoreService.getCourses();
      const comp = await firestoreService.getCompanies();
      setCourses(c);
      setCompanies(comp);

      // Auto select quiz course if empty
      if (c.length > 0 && !selectedQuizCourseId) {
        handleSelectQuizCourse(c[0].id);
      }
    } catch (err) {
      console.error('Error refreshing data:', err);
    }
  };

  const loadReports = async () => {
    setReportsLoading(true);
    try {
      const data = await firestoreService.getReports();
      setReports(data);
      setReportsLoaded(true);
    } catch (err) {
      console.error('Error loading moderation queue:', err);
      showToast({ message: 'Failed to load moderation queue.', type: 'error' });
    } finally {
      setReportsLoading(false);
    }
  };

  const handleUpdateReportStatus = async (reportId: string, status: ReportStatus) => {
    const previous = reports;
    setReports(prev => prev.map(r => (r.id === reportId ? { ...r, status } : r)));
    try {
      await firestoreService.updateReportStatus(reportId, status);
    } catch (err) {
      console.error('Error updating report status:', err);
      setReports(previous);
      showToast({ message: 'Failed to update report status.', type: 'error' });
    }
  };

  const handleSelectQuizCourse = async (courseId: string) => {
    setSelectedQuizCourseId(courseId);
    setQuizQuestions([]);
    setEditingQuestion(null);
    setEditingQuestionIndex(null);
    try {
      const q = await firestoreService.getQuiz(courseId);
      if (q) {
        setQuizQuestions(q.questions || []);
      }
    } catch (err) {
      console.error('Error loading quiz:', err);
    }
  };

  // Helper to compile chapter & lesson contents to single course.content HTML string
  const compileContent = (title: string, chapters: Chapter[]): string => {
    return `
      <div class="space-y-8">
        <div class="p-8 bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-primaryLight rounded-r-3xl mb-12 animate-fade-in shadow-lg">
            <h1 class="text-4xl font-display font-bold text-textMain mb-3">Mastering ${title}</h1>
            <p class="text-textMuted text-xl leading-relaxed">A comprehensive structured learning pathway.</p>
        </div>
        <div class="grid gap-8">
        ${chapters.map((chap, i) => `
            <div class="group relative bg-glass border border-white/10 rounded-3xl p-8 hover:bg-glass-hover hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                <div class="absolute -right-4 -top-4 text-9xl font-bold text-white/5 group-hover:text-primary/10 transition-colors pointer-events-none select-none z-0">
                  ${i + 1}
                </div>
                <div class="relative z-10">
                  <div class="flex items-center gap-5 mb-6">
                      <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-3xl shadow-xl">
                          🎓
                      </div>
                      <h2 class="text-2xl md:text-3xl font-bold text-textMain">
                          ${chap.title}
                      </h2>
                  </div>
                  <div class="prose dark:prose-invert max-w-none text-textMuted text-lg leading-relaxed mb-8">
                      ${chap.lessons.map(les => `
                        <div class="mb-6 border-b border-white/5 pb-4 last:border-0">
                          <h3 class="text-xl font-bold text-textMain mb-2">${les.title}</h3>
                          <div>${les.content}</div>
                        </div>
                      `).join('')}
                  </div>
                  <div class="flex items-center justify-between border-t border-white/10 pt-6">
                    <span class="text-xs font-bold text-textMuted uppercase tracking-widest">Chapter ${i + 1} of ${chapters.length}</span>
                  </div>
                </div>
            </div>
        `).join('')}
        </div>
      </div>
    `;
  };

  // --- COURSE CRUD ACTIONS ---
  const openCourseCreate = () => {
    setCourseForm({
      id: '',
      categoryId: CATEGORIES[0]?.id || 'programming',
      title: '',
      description: '',
      icon: 'BookOpen',
      duration: '8 Hours',
      level: 'Beginner',
      resources: [{ title: 'Documentation', url: '#' }],
      chapters: []
    });
    setCourseModalOpen(true);
  };

  const openCourseEdit = (course: Course) => {
    setSelectedCourse(course);
    setCourseForm(course);
    setCourseModalOpen(true);
  };

  const handleSaveCourse = async () => {
    if (!courseForm.id || !courseForm.title) {
      showToast({ message: 'Course ID and Title are required.', type: 'error' });
      return;
    }

    try {
      if (selectedCourse) {
        // Edit Mode
        const compiled = compileContent(courseForm.title, courseForm.chapters || []);
        const updated: Course = {
          ...selectedCourse,
          ...courseForm,
          content: compiled
        } as Course;
        await firestoreService.updateCourse(selectedCourse.id, updated);
        showToast({ message: 'Course updated successfully.', type: 'success' });
      } else {
        // Create Mode
        const formattedId = courseForm.id.toLowerCase().replace(/\s+/g, '-');
        const updated: Course = {
          ...courseForm,
          id: formattedId,
          content: compileContent(courseForm.title, []),
          chapters: []
        } as Course;
        await firestoreService.createCourse(updated);
        showToast({ message: 'Course created successfully.', type: 'success' });
      }
      setCourseModalOpen(false);
      setSelectedCourse(null);
      await refreshData();
    } catch (err) {
      showToast({ message: 'Failed to save course.', type: 'error' });
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course and its quiz?')) return;
    try {
      await firestoreService.deleteCourse(id);
      showToast({ message: 'Course deleted successfully.', type: 'success' });
      await refreshData();
    } catch (err) {
      showToast({ message: 'Failed to delete course.', type: 'error' });
    }
  };

  // --- CHAPTER ACTIONS ---
  const handleSaveChapter = async () => {
    if (!chapterForm.title || !selectedCourse) return;

    let updatedChapters = [...(selectedCourse.chapters || [])];

    if (selectedChapter) {
      // Edit
      updatedChapters = updatedChapters.map(c => c.id === selectedChapter.id ? { ...c, title: chapterForm.title! } : c);
    } else {
      // Add
      const newChapter: Chapter = {
        id: `chap-${Date.now()}`,
        title: chapterForm.title,
        lessons: []
      };
      updatedChapters.push(newChapter);
    }

    try {
      const compiled = compileContent(selectedCourse.title, updatedChapters);
      await firestoreService.updateCourse(selectedCourse.id, {
        chapters: updatedChapters,
        content: compiled
      });
      showToast({ message: 'Chapter saved.', type: 'success' });
      setChapterModalOpen(false);
      setSelectedChapter(null);

      // Update local states
      const c = await firestoreService.getCourse(selectedCourse.id);
      if (c) setSelectedCourse(c);
      await refreshData();
    } catch (err) {
      showToast({ message: 'Failed to save chapter.', type: 'error' });
    }
  };

  const handleDeleteChapter = async (chapId: string) => {
    if (!selectedCourse || !confirm('Delete this chapter and all its lessons?')) return;
    const updatedChapters = (selectedCourse.chapters || []).filter(c => c.id !== chapId);
    try {
      const compiled = compileContent(selectedCourse.title, updatedChapters);
      await firestoreService.updateCourse(selectedCourse.id, {
        chapters: updatedChapters,
        content: compiled
      });
      showToast({ message: 'Chapter deleted.', type: 'success' });
      const c = await firestoreService.getCourse(selectedCourse.id);
      if (c) setSelectedCourse(c);
      await refreshData();
    } catch (err) {
      showToast({ message: 'Failed to delete chapter.', type: 'error' });
    }
  };

  // --- LESSON ACTIONS ---
  const handleSaveLesson = async () => {
    if (!lessonForm.title || !selectedCourse || !selectedChapter) return;

    let updatedChapters = [...(selectedCourse.chapters || [])];
    const targetChapIndex = updatedChapters.findIndex(c => c.id === selectedChapter.id);
    if (targetChapIndex === -1) return;

    let updatedLessons = [...(updatedChapters[targetChapIndex].lessons || [])];

    if (selectedLesson) {
      // Edit
      updatedLessons = updatedLessons.map(l => l.id === selectedLesson.id ? {
        ...l,
        title: lessonForm.title!,
        content: lessonForm.content!
      } : l);
    } else {
      // Add
      const newLesson: Lesson = {
        id: `les-${Date.now()}`,
        title: lessonForm.title,
        content: lessonForm.content || ''
      };
      updatedLessons.push(newLesson);
    }

    updatedChapters[targetChapIndex] = {
      ...updatedChapters[targetChapIndex],
      lessons: updatedLessons
    };

    try {
      const compiled = compileContent(selectedCourse.title, updatedChapters);
      await firestoreService.updateCourse(selectedCourse.id, {
        chapters: updatedChapters,
        content: compiled
      });
      showToast({ message: 'Lesson saved.', type: 'success' });
      setLessonModalOpen(false);
      setSelectedLesson(null);

      const c = await firestoreService.getCourse(selectedCourse.id);
      if (c) {
        setSelectedCourse(c);
        const updatedChap = c.chapters?.find(ch => ch.id === selectedChapter.id);
        if (updatedChap) setSelectedChapter(updatedChap);
      }
      await refreshData();
    } catch (err) {
      showToast({ message: 'Failed to save lesson.', type: 'error' });
    }
  };

  const handleDeleteLesson = async (lesId: string) => {
    if (!selectedCourse || !selectedChapter || !confirm('Delete this lesson?')) return;

    let updatedChapters = [...(selectedCourse.chapters || [])];
    const targetChapIndex = updatedChapters.findIndex(c => c.id === selectedChapter.id);
    if (targetChapIndex === -1) return;

    const updatedLessons = (updatedChapters[targetChapIndex].lessons || []).filter(l => l.id !== lesId);
    updatedChapters[targetChapIndex] = {
      ...updatedChapters[targetChapIndex],
      lessons: updatedLessons
    };

    try {
      const compiled = compileContent(selectedCourse.title, updatedChapters);
      await firestoreService.updateCourse(selectedCourse.id, {
        chapters: updatedChapters,
        content: compiled
      });
      showToast({ message: 'Lesson deleted.', type: 'success' });
      const c = await firestoreService.getCourse(selectedCourse.id);
      if (c) {
        setSelectedCourse(c);
        const updatedChap = c.chapters?.find(ch => ch.id === selectedChapter.id);
        if (updatedChap) setSelectedChapter(updatedChap);
      }
      await refreshData();
    } catch (err) {
      showToast({ message: 'Failed to delete lesson.', type: 'error' });
    }
  };

  // --- QUIZ ACTIONS ---
  const handleAddQuestion = () => {
    setEditingQuestion({
      id: quizQuestions.length + 1,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    });
    setEditingQuestionIndex(null);
  };

  const handleEditQuestion = (index: number) => {
    setEditingQuestion({ ...quizQuestions[index] });
    setEditingQuestionIndex(index);
  };

  const handleSaveQuestion = async () => {
    if (!editingQuestion || !editingQuestion.question || !selectedQuizCourseId) return;

    let updated = [...quizQuestions];

    if (editingQuestionIndex !== null) {
      // Edit
      updated[editingQuestionIndex] = editingQuestion as QuizQuestion;
    } else {
      // Add
      updated.push(editingQuestion as QuizQuestion);
    }

    try {
      await firestoreService.updateQuiz(selectedQuizCourseId, updated);
      showToast({ message: 'Quiz updated.', type: 'success' });
      setQuizQuestions(updated);
      setEditingQuestion(null);
      setEditingQuestionIndex(null);
    } catch (err) {
      showToast({ message: 'Failed to update quiz.', type: 'error' });
    }
  };

  const handleDeleteQuestion = async (index: number) => {
    if (!confirm('Delete this question?')) return;
    const updated = quizQuestions.filter((_, idx) => idx !== index).map((q, i) => ({ ...q, id: i + 1 }));
    try {
      await firestoreService.updateQuiz(selectedQuizCourseId, updated);
      showToast({ message: 'Question deleted.', type: 'success' });
      setQuizQuestions(updated);
    } catch (err) {
      showToast({ message: 'Failed to delete question.', type: 'error' });
    }
  };

  // --- COMPANY CRUD ACTIONS ---
  const openCompanyCreate = () => {
    setCompanyForm({
      id: '',
      name: '',
      logo: '',
      description: '',
      roles: ['SDE I', 'SDE II', 'Frontend', 'Backend'],
      difficulty: 'Moderate',
      focus: [],
      questions: []
    });
    setCompanyModalOpen(true);
  };

  const openCompanyEdit = (company: Company) => {
    setSelectedCompany(company);
    setCompanyForm(company);
    setCompanyModalOpen(true);
  };

  const handleSaveCompany = async () => {
    if (!companyForm.id || !companyForm.name) {
      showToast({ message: 'Company ID and Name are required.', type: 'error' });
      return;
    }

    try {
      if (selectedCompany) {
        await firestoreService.updateCompany(selectedCompany.id, companyForm);
        showToast({ message: 'Company updated successfully.', type: 'success' });
      } else {
        const formattedId = companyForm.id.toLowerCase().replace(/\s+/g, '-');
        const defaultLogo = `https://ui-avatars.com/api/?name=${encodeURIComponent(companyForm.name)}&background=random&color=fff&rounded=true&bold=true&size=128`;
        const updated: Company = {
          ...companyForm,
          id: formattedId,
          logo: companyForm.logo || defaultLogo,
          questions: []
        } as Company;
        await firestoreService.createCompany(updated);
        showToast({ message: 'Company created successfully.', type: 'success' });
      }
      setCompanyModalOpen(false);
      setSelectedCompany(null);
      await refreshData();
    } catch (err) {
      showToast({ message: 'Failed to save company.', type: 'error' });
    }
  };

  const handleDeleteCompany = async (id: string) => {
    if (!confirm('Are you sure you want to delete this company?')) return;
    try {
      await firestoreService.deleteCompany(id);
      showToast({ message: 'Company deleted successfully.', type: 'success' });
      await refreshData();
    } catch (err) {
      showToast({ message: 'Failed to delete company.', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primaryLight w-12 h-12" />
        <div className="mt-4 text-textMuted text-sm font-medium">
          {seeding ? 'Initializing Firestore Data...' : 'Loading Administrative Tools...'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-display font-bold text-textMain">Admin Control Center</h1>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primaryLight text-xs font-bold uppercase tracking-wider border border-primary/20">
              <Shield size={14} /> Authorized
            </span>
          </div>
          <p className="text-textMuted mt-1">Manage courses, quizzes, and company preparation contents.</p>
        </div>
        <button
          onClick={async () => {
            if (!confirm("Warning: This will overwrite all courses with the default templates. Any custom changes to default courses will be lost! Are you sure?")) return;
            try {
              setSeeding(true);
              await firestoreService.forceReseedDatabase();
              await refreshData();
              alert("Successfully re-seeded the database!");
            } catch (e) {
              console.error(e);
              alert("Error re-seeding database.");
            } finally {
              setSeeding(false);
            }
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/20 font-bold transition-all shadow-lg"
        >
          <RefreshCcw size={18} />
          Force Reseed Database
        </button>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-black/20 dark:border-white/10 gap-6">
        <button
          onClick={() => setActiveTab('courses')}
          className={`pb-4 text-lg font-bold flex items-center gap-2 border-b-2 transition-all ${activeTab === 'courses'
              ? 'border-primaryLight text-textMain'
              : 'border-transparent text-textMuted hover:text-textMain'
            }`}
        >
          <BookOpen size={20} /> Courses
        </button>
        <button
          onClick={() => setActiveTab('quizzes')}
          className={`pb-4 text-lg font-bold flex items-center gap-2 border-b-2 transition-all ${activeTab === 'quizzes'
              ? 'border-primaryLight text-textMain'
              : 'border-transparent text-textMuted hover:text-textMain'
            }`}
        >
          <Brain size={20} /> Quizzes
        </button>
        <button
          onClick={() => setActiveTab('prep')}
          className={`pb-4 text-lg font-bold flex items-center gap-2 border-b-2 transition-all ${activeTab === 'prep'
              ? 'border-primaryLight text-textMain'
              : 'border-transparent text-textMuted hover:text-textMain'
            }`}
        >
          <Briefcase size={20} /> Interview Prep
        </button>
        <button
          onClick={() => {
            setActiveTab('moderation');
            if (!reportsLoaded) loadReports();
          }}
          className={`pb-4 text-lg font-bold flex items-center gap-2 border-b-2 transition-all ${activeTab === 'moderation'
              ? 'border-primaryLight text-textMain'
              : 'border-transparent text-textMuted hover:text-textMain'
            }`}
        >
          <Flag size={20} /> Moderation
          {reportsLoaded && reports.some(r => r.status === 'pending') && (
            <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
              {reports.filter(r => r.status === 'pending').length}
            </span>
          )}
        </button>
      </div>

      {/* TABS INNER CONTENT */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Courses List */}
          <div className="lg:col-span-1 bg-glass border border-black/20 dark:border-white/10 rounded-2xl p-6 h-fit">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-textMain">All Courses</h2>
              <button
                onClick={openCourseCreate}
                className="p-2 bg-gradient-main text-white rounded-lg hover:shadow-lg transition-all"
                title="Create Course"
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="space-y-3">
              {courses.map(c => (
                <div
                  key={c.id}
                  onClick={() => { setSelectedCourse(c); setSelectedChapter(null); setSelectedLesson(null); }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${selectedCourse?.id === c.id
                      ? 'bg-primary/20 border-primaryLight text-textMain'
                      : 'bg-white/5 border-black/20 dark:border-white/5 text-textMuted hover:bg-white/10'
                    }`}
                >
                  <div>
                    <h3 className="font-bold text-textMain">{c.title}</h3>
                    <span className="text-xs text-textMuted uppercase tracking-wider">{c.level} • {c.duration}</span>
                  </div>
                  <ChevronRight size={16} />
                </div>
              ))}
            </div>
          </div>

          {/* Chapters & Lessons Workspace */}
          <div className="lg:col-span-2 space-y-6">
            {selectedCourse ? (
              <div className="bg-glass border border-black/20 dark:border-white/10 rounded-2xl p-8">
                <div className="flex justify-between items-start border-b border-black/20 dark:border-white/10 pb-6 mb-6">
                  <div>
                    <span className="text-xs font-bold text-primaryLight uppercase tracking-widest">{selectedCourse.level} Course</span>
                    <h2 className="text-2xl font-bold text-textMain mt-1">{selectedCourse.title}</h2>
                    <p className="text-sm text-textMuted mt-1">{selectedCourse.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openCourseEdit(selectedCourse)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-black/20 dark:border-white/10 rounded-lg text-sm text-textMain flex items-center gap-1.5 transition-colors"
                    >
                      <Edit size={14} /> Edit Details
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(selectedCourse.id)}
                      className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-sm text-red-400 flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 size={14} /> Delete Course
                    </button>
                  </div>
                </div>

                {/* Chapter List */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-textMain">Course Curriculum Chapters</h3>
                    <button
                      onClick={() => { setChapterForm({ title: '' }); setChapterModalOpen(true); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primaryLight rounded-lg text-xs font-bold border border-primary/20 transition-all"
                    >
                      <Plus size={14} /> Add Chapter
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(selectedCourse.chapters || []).map((chap, cIdx) => (
                      <div key={chap.id} className="border border-black/20 dark:border-white/10 rounded-xl bg-black/5 dark:bg-white/5 overflow-hidden">
                        <div className="p-4 flex items-center justify-between border-b border-black/20 dark:border-white/10">
                          <div>
                            <span className="text-xs text-textMuted uppercase font-bold tracking-wider">Chapter {cIdx + 1}</span>
                            <h4 className="font-bold text-textMain">{chap.title}</h4>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => { setSelectedChapter(chap); setLessonForm({ title: '', content: '' }); setLessonModalOpen(true); }}
                              className="text-xs text-primaryLight hover:underline font-bold"
                            >
                              + Add Lesson
                            </button>
                            <button
                              onClick={() => { setSelectedChapter(chap); setChapterForm(chap); setChapterModalOpen(true); }}
                              className="text-xs text-textMuted hover:text-textMain font-bold"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteChapter(chap.id)}
                              className="text-xs text-red-400 hover:text-red-300 font-bold"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        {/* Lessons Sub list */}
                        <div className="p-4 space-y-2 bg-black/10 dark:bg-black/20">
                          {(chap.lessons || []).map((les, lIdx) => (
                            <div key={les.id} className="p-3 bg-white/5 border border-black/10 dark:border-white/5 rounded-lg flex items-center justify-between">
                              <span className="text-sm font-medium text-textMain">{lIdx + 1}. {les.title}</span>
                              <div className="flex gap-3">
                                <button
                                  onClick={() => { setSelectedChapter(chap); setSelectedLesson(les); setLessonForm(les); setLessonModalOpen(true); }}
                                  className="text-xs text-primaryLight hover:underline font-medium"
                                >
                                  Edit Content
                                </button>
                                <button
                                  onClick={() => { setSelectedChapter(chap); handleDeleteLesson(les.id); }}
                                  className="text-xs text-red-400 hover:text-red-300 font-medium"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                          {(!chap.lessons || chap.lessons.length === 0) && (
                            <div className="text-xs text-textMuted italic py-2">No lessons added to this chapter yet.</div>
                          )}
                        </div>
                      </div>
                    ))}
                    {(!selectedCourse.chapters || selectedCourse.chapters.length === 0) && (
                      <div className="text-center py-12 text-textMuted border border-dashed border-black/20 dark:border-white/10 rounded-xl">
                        No curriculum chapters configured for this course yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[400px] flex items-center justify-center bg-glass border border-black/20 dark:border-white/10 rounded-2xl text-textMuted font-medium">
                Select a course from the list to manage its curriculum.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'quizzes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Courses Selector */}
          <div className="lg:col-span-1 bg-glass border border-black/20 dark:border-white/10 rounded-2xl p-6 h-fit">
            <h2 className="text-xl font-bold text-textMain mb-6 font-display">Select Course Quiz</h2>
            <div className="space-y-3">
              {courses.map(c => (
                <div
                  key={c.id}
                  onClick={() => handleSelectQuizCourse(c.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${selectedQuizCourseId === c.id
                      ? 'bg-primary/20 border-primaryLight text-textMain'
                      : 'bg-white/5 border-black/20 dark:border-white/5 text-textMuted hover:bg-white/10'
                    }`}
                >
                  <span className="font-bold text-textMain">{c.title} Quiz</span>
                  <ChevronRight size={16} />
                </div>
              ))}
            </div>
          </div>

          {/* Quiz Editor */}
          <div className="lg:col-span-2 space-y-6">
            {selectedQuizCourseId ? (
              <div className="bg-glass border border-black/20 dark:border-white/10 rounded-2xl p-8">
                <div className="flex justify-between items-center border-b border-black/20 dark:border-white/10 pb-6 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-textMain font-display">Manage Course MCQ Quiz</h2>
                    <p className="text-sm text-textMuted mt-1">Configure questions, options, and answers required for course certifications.</p>
                  </div>
                  {!editingQuestion && (
                    <button
                      onClick={handleAddQuestion}
                      className="flex items-center gap-1.5 px-4 py-2 bg-gradient-main text-white rounded-xl text-sm font-bold shadow-lg transition-all"
                    >
                      <Plus size={16} /> Add MCQ Question
                    </button>
                  )}
                </div>

                {editingQuestion ? (
                  <div className="bg-white/5 border border-black/20 dark:border-white/10 rounded-xl p-6 space-y-6">
                    <h3 className="text-lg font-bold text-textMain font-display">{editingQuestionIndex !== null ? 'Edit MCQ' : 'Create MCQ'}</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-textMuted uppercase mb-2">Question Title / Text</label>
                        <input
                          type="text"
                          value={editingQuestion.question || ''}
                          onChange={e => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
                          className="w-full bg-gradient-input border border-primary/20 rounded-xl py-3 px-4 text-textMain focus:outline-none focus:border-primaryLight transition-all"
                          placeholder="e.g., What is the output of console.log(typeof null)?"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(editingQuestion.options || []).map((opt, oIdx) => (
                          <div key={oIdx}>
                            <label className="block text-xs font-bold text-textMuted uppercase mb-2">Option {oIdx + 1}</label>
                            <input
                              type="text"
                              value={opt}
                              onChange={e => {
                                const newOpts = [...(editingQuestion.options || [])];
                                newOpts[oIdx] = e.target.value;
                                setEditingQuestion({ ...editingQuestion, options: newOpts });
                              }}
                              className="w-full bg-gradient-input border border-primary/20 rounded-xl py-3 px-4 text-textMain focus:outline-none focus:border-primaryLight transition-all"
                              placeholder={`Option ${oIdx + 1}`}
                            />
                          </div>
                        ))}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-textMuted uppercase mb-2">Correct Option Answer Index</label>
                        <select
                          value={editingQuestion.correctAnswer || 0}
                          onChange={e => setEditingQuestion({ ...editingQuestion, correctAnswer: parseInt(e.target.value, 10) })}
                          title="Correct option index"
                          className="w-full bg-primary/10 border border-primary/20 rounded-xl py-3 px-4 text-textMain focus:outline-none focus:border-primaryLight transition-all"
                        >
                          {(editingQuestion.options || []).map((_, oIdx) => (
                            <option key={oIdx} value={oIdx} className="bg-background text-textMain">Option {oIdx + 1}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex gap-4 pt-4 border-t border-black/10 dark:border-white/5">
                        <button
                          onClick={handleSaveQuestion}
                          className="flex-1 py-3 bg-gradient-main text-white rounded-xl font-bold hover:shadow-lg transition-all"
                        >
                          Save Question
                        </button>
                        <button
                          onClick={() => setEditingQuestion(null)}
                          className="px-6 py-3 bg-white/5 hover:bg-white/10 text-textMuted hover:text-textMain border border-black/20 dark:border-white/10 rounded-xl font-bold transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {quizQuestions.map((q, idx) => (
                      <div key={q.id} className="border border-black/20 dark:border-white/10 rounded-xl p-5 bg-white/5 space-y-4">
                        <div className="flex justify-between items-start border-b border-black/10 dark:border-white/5 pb-3">
                          <h4 className="font-bold text-textMain leading-relaxed"><span className="text-primaryLight font-mono">Q{idx + 1}.</span> {q.question}</h4>
                          <div className="flex gap-3 ml-4">
                            <button onClick={() => handleEditQuestion(idx)} className="text-xs text-primaryLight hover:underline font-bold">Edit</button>
                            <button onClick={() => handleDeleteQuestion(idx)} className="text-xs text-red-400 hover:underline font-bold">Delete</button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-textMuted">
                          {q.options.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className={`p-3 rounded-lg border flex items-center gap-2 ${oIdx === q.correctAnswer
                                  ? 'bg-success/15 border-success text-success font-semibold'
                                  : 'bg-white/5 border-transparent'
                                }`}
                            >
                              <div className={`w-2.5 h-2.5 rounded-full ${oIdx === q.correctAnswer ? 'bg-success' : 'bg-white/20'}`} />
                              <span>{opt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {quizQuestions.length === 0 && (
                      <div className="text-center py-20 text-textMuted border border-dashed border-black/20 dark:border-white/10 rounded-xl">
                        No quiz questions created for this course yet.
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-[400px] flex items-center justify-center bg-glass border border-black/20 dark:border-white/10 rounded-2xl text-textMuted font-medium">
                Select a course from the list to manage its Quiz MCQs.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'prep' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Companies List */}
          <div className="lg:col-span-1 bg-glass border border-black/20 dark:border-white/10 rounded-2xl p-6 h-fit">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-textMain font-display">Companies</h2>
              <button
                onClick={openCompanyCreate}
                className="p-2 bg-gradient-main text-white rounded-lg hover:shadow-lg transition-all"
                title="Create Company"
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="space-y-3">
              {companies.map(c => (
                <div
                  key={c.id}
                  onClick={() => { setSelectedCompany(c); setCompanyForm(c); }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${selectedCompany?.id === c.id
                      ? 'bg-primary/20 border-primaryLight text-textMain'
                      : 'bg-white/5 border-black/20 dark:border-white/5 text-textMuted hover:bg-white/10'
                    }`}
                >
                  <img src={c.logo} alt={c.name} className="w-10 h-10 object-contain rounded-lg bg-white p-1" />
                  <div className="flex-1 overflow-hidden">
                    <h3 className="font-bold text-textMain truncate">{c.name}</h3>
                    <span className="text-xs text-textMuted">{c.difficulty} Difficulty</span>
                  </div>
                  <ChevronRight size={16} className="shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Company Prep Questions Manager */}
          <div className="lg:col-span-2 space-y-6">
            {selectedCompany ? (
              <div className="bg-glass border border-black/20 dark:border-white/10 rounded-2xl p-8">
                <div className="flex justify-between items-start border-b border-black/20 dark:border-white/10 pb-6 mb-6">
                  <div className="flex items-center gap-4">
                    <img src={selectedCompany.logo} alt={selectedCompany.name} className="w-16 h-16 object-contain rounded-xl bg-white p-2" />
                    <div>
                      <span className="text-xs font-bold text-primaryLight uppercase tracking-widest">{selectedCompany.difficulty}</span>
                      <h2 className="text-2xl font-bold text-textMain">{selectedCompany.name}</h2>
                      <p className="text-sm text-textMuted mt-1">{selectedCompany.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openCompanyEdit(selectedCompany)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-black/20 dark:border-white/10 rounded-lg text-sm text-textMain flex items-center gap-1.5 transition-colors"
                    >
                      <Edit size={14} /> Edit Company
                    </button>
                    <button
                      onClick={() => handleDeleteCompany(selectedCompany.id)}
                      className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-sm text-red-400 flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 size={14} /> Delete Company
                    </button>
                  </div>
                </div>

                {/* Company Questions CRUD */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-textMain">Interview Practice Questions</h3>
                    <button
                      onClick={() => {
                        const newQ = {
                          id: `${selectedCompany.id}-q${(selectedCompany.questions || []).length + 1}`,
                          title: '',
                          difficulty: 'Easy' as const,
                          tags: [],
                          answer: '',
                          resourceLink: 'https://leetcode.com'
                        };
                        const updated = [...(selectedCompany.questions || []), newQ];
                        firestoreService.updateCompany(selectedCompany.id, { questions: updated })
                          .then(() => {
                            showToast({ message: 'Question skeleton created. Click edit below.', type: 'success' });
                            return firestoreService.getCompany(selectedCompany.id);
                          })
                          .then(comp => { if (comp) setSelectedCompany(comp); })
                          .catch(() => showToast({ message: 'Error adding question.', type: 'error' }));
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primaryLight rounded-lg text-xs font-bold border border-primary/20 transition-all"
                    >
                      <Plus size={14} /> Add Prep Question
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(selectedCompany.questions || []).map((q, idx) => (
                      <div key={q.id} className="border border-black/20 dark:border-white/10 rounded-xl p-5 bg-white/5">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border mr-3 ${q.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                q.difficulty === 'Medium' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                  'bg-red-500/10 text-red-500 border-red-500/20'
                              }`}>
                              {q.difficulty}
                            </span>
                            <span className="font-bold text-textMain text-sm">{q.title || 'Untitled Question'}</span>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const newTitle = prompt('Enter question title:', q.title);
                                if (newTitle === null) return;
                                const updated = (selectedCompany.questions || []).map(item => item.id === q.id ? { ...item, title: newTitle } : item);
                                firestoreService.updateCompany(selectedCompany.id, { questions: updated })
                                  .then(() => {
                                    showToast({ message: 'Question title updated.', type: 'success' });
                                    return firestoreService.getCompany(selectedCompany.id);
                                  })
                                  .then(comp => { if (comp) setSelectedCompany(comp); });
                              }}
                              className="text-xs text-primaryLight hover:underline"
                            >
                              Edit Title
                            </button>
                            <button
                              onClick={() => {
                                const solution = prompt('Enter solution answer HTML:', q.answer);
                                if (solution === null) return;
                                const updated = (selectedCompany.questions || []).map(item => item.id === q.id ? { ...item, answer: solution } : item);
                                firestoreService.updateCompany(selectedCompany.id, { questions: updated })
                                  .then(() => {
                                    showToast({ message: 'Question solution updated.', type: 'success' });
                                    return firestoreService.getCompany(selectedCompany.id);
                                  })
                                  .then(comp => { if (comp) setSelectedCompany(comp); });
                              }}
                              className="text-xs text-primaryLight hover:underline"
                            >
                              Edit Solution
                            </button>
                            <button
                              onClick={() => {
                                if (!confirm('Delete this question?')) return;
                                const updated = (selectedCompany.questions || []).filter(item => item.id !== q.id);
                                firestoreService.updateCompany(selectedCompany.id, { questions: updated })
                                  .then(() => {
                                    showToast({ message: 'Question deleted.', type: 'success' });
                                    return firestoreService.getCompany(selectedCompany.id);
                                  })
                                  .then(comp => { if (comp) setSelectedCompany(comp); });
                              }}
                              className="text-xs text-red-400 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <div className="text-xs text-textMuted flex gap-4">
                          <span>Tags: {q.tags.join(', ') || 'None'}</span>
                          <span>Link: <a href={q.resourceLink} target="_blank" rel="noreferrer" className="underline">{q.resourceLink}</a></span>
                        </div>
                      </div>
                    ))}
                    {(!selectedCompany.questions || selectedCompany.questions.length === 0) && (
                      <div className="text-center py-12 text-textMuted border border-dashed border-black/20 dark:border-white/10 rounded-xl">
                        No practice questions configured for this company yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[400px] flex items-center justify-center bg-glass border border-black/20 dark:border-white/10 rounded-2xl text-textMuted font-medium">
                Select a company from the list to manage its interview details.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Moderation Queue */}
      {activeTab === 'moderation' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-2xl font-bold text-textMain flex items-center gap-2">
              <Flag size={22} className="text-primaryLight" />
              Moderation Queue
            </h2>
            <button
              onClick={loadReports}
              disabled={reportsLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primaryLight border border-primary/20 hover:bg-primary/20 font-bold text-sm transition-colors disabled:opacity-50"
            >
              {reportsLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCcw size={14} />}
              Refresh
            </button>
          </div>

          {reportsLoading ? (
            <div className="h-[300px] flex items-center justify-center text-textMuted gap-2">
              <Loader2 size={24} className="animate-spin text-primaryLight" />
              <span>Loading reports...</span>
            </div>
          ) : reports.length === 0 ? (
            <div className="h-[300px] flex flex-col items-center justify-center bg-glass border border-black/20 dark:border-white/10 rounded-2xl text-textMuted gap-2">
              <ShieldCheck size={32} className="opacity-50" />
              <p className="font-bold text-textMain">No reports to review</p>
              <p className="text-sm">Reported comments and reviews will show up here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map(report => (
                <div key={report.id} className="p-5 rounded-2xl bg-glass border border-black/20 dark:border-white/10">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primaryLight border border-primary/20">
                        {report.contentType}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
                        {REPORT_REASON_LABELS[report.reason] || report.reason}
                      </span>
                      <span className="text-xs text-textMuted">{new Date(report.createdAt).toLocaleString()}</span>
                    </div>

                    <select
                      value={report.status}
                      onChange={e => handleUpdateReportStatus(report.id, e.target.value as ReportStatus)}
                      aria-label={`Status for report ${report.id}`}
                      className={`text-xs font-bold uppercase tracking-wider rounded-lg border px-3 py-1.5 bg-transparent focus:outline-none cursor-pointer ${report.status === 'pending' ? 'text-amber-500 border-amber-500/30' :
                          report.status === 'reviewed' ? 'text-blue-400 border-blue-500/30' :
                            report.status === 'resolved' ? 'text-emerald-400 border-emerald-500/30' :
                              'text-textMuted border-black/10 dark:border-white/10'
                        }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="resolved">Resolved</option>
                      <option value="dismissed">Dismissed</option>
                    </select>
                  </div>

                  {report.contentSnapshot && (
                    <p className="text-sm text-textMain bg-black/5 dark:bg-white/5 rounded-xl p-3 mb-3 whitespace-pre-wrap">
                      "{report.contentSnapshot}"
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-textMuted">
                    <span>
                      Reported by <span className="font-mono text-textMain">{report.reporterId}</span>
                      {report.contentAuthorUsername && (
                        <> &middot; Author: <span className="font-semibold text-textMain">{report.contentAuthorUsername}</span></>
                      )}
                    </span>
                    <a
                      href={`#/course/${report.courseId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 font-bold text-primaryLight hover:underline"
                    >
                      View Content <ArrowRight size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- MODALS --- */}

      {/* Course Edit/Create Modal */}
      {courseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setCourseModalOpen(false)} />
          <div className="relative bg-background border border-primary/20 rounded-3xl p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-[0_0_40px_rgba(var(--color-primary),0.15)] space-y-6 animate-fade-in-up">
            <h3 className="text-2xl font-bold text-textMain font-display bg-gradient-to-r from-primary to-primaryLight bg-clip-text text-transparent">{selectedCourse ? 'Edit Course Details' : 'Create New Course'}</h3>
            <div className="space-y-4">
              {!selectedCourse && (
                <div>
                  <label className="block text-xs font-bold text-primaryLight uppercase mb-2 tracking-wider">Unique Course ID (e.g. dynamic-dsa)</label>
                  <input
                    type="text"
                    value={courseForm.id || ''}
                    onChange={e => setCourseForm({ ...courseForm, id: e.target.value })}
                    className="w-full bg-primary/5 border border-primary/20 rounded-xl py-3 px-4 text-textMain focus:outline-none focus:border-primary focus:bg-primary/10 focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-primaryLight uppercase mb-2 tracking-wider">Title</label>
                <input
                  type="text"
                  value={courseForm.title || ''}
                  onChange={e => setCourseForm({ ...courseForm, title: e.target.value })}
                  className="w-full bg-primary/5 border border-primary/20 rounded-xl py-3 px-4 text-textMain focus:outline-none focus:border-primary focus:bg-primary/10 focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primaryLight uppercase mb-2 tracking-wider">Category</label>
                  <select
                    value={courseForm.categoryId || 'programming'}
                    onChange={e => setCourseForm({ ...courseForm, categoryId: e.target.value })}
                    title="Course category"
                    className="w-full bg-primary/5 border border-primary/20 rounded-xl py-3 px-4 text-textMain focus:outline-none focus:border-primary focus:bg-primary/10 focus:ring-1 focus:ring-primary transition-all"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id} className="bg-background text-textMain">{c.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-primaryLight uppercase mb-2 tracking-wider">Level</label>
                  <select
                    value={courseForm.level || 'Beginner'}
                    onChange={e => setCourseForm({ ...courseForm, level: e.target.value as any })}
                    title="Course level"
                    className="w-full bg-primary/5 border border-primary/20 rounded-xl py-3 px-4 text-textMain focus:outline-none focus:border-primary focus:bg-primary/10 focus:ring-1 focus:ring-primary transition-all"
                  >
                    <option value="Beginner" className="bg-background text-textMain">Beginner</option>
                    <option value="Intermediate" className="bg-background text-textMain">Intermediate</option>
                    <option value="Advanced" className="bg-background text-textMain">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primaryLight uppercase mb-2 tracking-wider">Duration (e.g. 10 Hours)</label>
                  <input
                    type="text"
                    value={courseForm.duration || ''}
                    onChange={e => setCourseForm({ ...courseForm, duration: e.target.value })}
                    className="w-full bg-primary/5 border border-primary/20 rounded-xl py-3 px-4 text-textMain focus:outline-none focus:border-primary focus:bg-primary/10 focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primaryLight uppercase mb-2 tracking-wider">Icon</label>
                  <input
                    type="text"
                    value={courseForm.icon || 'BookOpen'}
                    onChange={e => setCourseForm({ ...courseForm, icon: e.target.value })}
                    className="w-full bg-primary/5 border border-primary/20 rounded-xl py-3 px-4 text-textMain focus:outline-none focus:border-primary focus:bg-primary/10 focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-primaryLight uppercase mb-2 tracking-wider">Short Description</label>
                <textarea
                  value={courseForm.description || ''}
                  onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
                  rows={3}
                  className="w-full bg-primary/5 border border-primary/20 rounded-xl py-3 px-4 text-textMain focus:outline-none focus:border-primary focus:bg-primary/10 focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>
            <div className="flex gap-4 pt-2">
              <button onClick={handleSaveCourse} className="flex-1 py-3.5 bg-primary hover:bg-primaryLight text-white rounded-xl font-bold shadow-[0_0_20px_rgba(var(--color-primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--color-primary),0.5)] transition-all">Save Changes</button>
              <button onClick={() => setCourseModalOpen(false)} className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Chapter Modal */}
      {chapterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setChapterModalOpen(false)} />
          <div className="relative bg-background border border-primary/20 rounded-3xl p-8 max-w-sm w-full max-h-[85vh] overflow-y-auto shadow-[0_0_40px_rgba(var(--color-primary),0.15)] space-y-6 animate-fade-in-up">
            <h3 className="text-2xl font-bold text-textMain font-display bg-gradient-to-r from-primary to-primaryLight bg-clip-text text-transparent">{selectedChapter ? 'Edit Chapter Title' : 'Add New Chapter'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-primaryLight uppercase mb-2 tracking-wider">Chapter Title</label>
                <input
                  type="text"
                  value={chapterForm.title || ''}
                  onChange={e => setChapterForm({ ...chapterForm, title: e.target.value })}
                  className="w-full bg-primary/5 border border-primary/20 rounded-xl py-3 px-4 text-textMain focus:outline-none focus:border-primary focus:bg-primary/10 focus:ring-1 focus:ring-primary transition-all"
                  placeholder="e.g. 1. Setup Environment"
                />
              </div>
            </div>
            <div className="flex gap-4 pt-2">
              <button onClick={handleSaveChapter} className="flex-1 py-3.5 bg-primary hover:bg-primaryLight text-white rounded-xl font-bold shadow-[0_0_20px_rgba(var(--color-primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--color-primary),0.5)] transition-all">Save Changes</button>
              <button onClick={() => setChapterModalOpen(false)} className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Modal */}
      {lessonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setLessonModalOpen(false)} />
          <div className="relative bg-background border border-primary/20 rounded-3xl p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-[0_0_40px_rgba(var(--color-primary),0.15)] space-y-6 animate-fade-in-up">
            <h3 className="text-2xl font-bold text-textMain font-display bg-gradient-to-r from-primary to-primaryLight bg-clip-text text-transparent">{selectedLesson ? 'Edit Lesson' : 'Add New Lesson'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-primaryLight uppercase mb-2 tracking-wider">Lesson Title</label>
                <input
                  type="text"
                  value={lessonForm.title || ''}
                  onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })}
                  className="w-full bg-primary/5 border border-primary/20 rounded-xl py-3 px-4 text-textMain focus:outline-none focus:border-primary focus:bg-primary/10 focus:ring-1 focus:ring-primary transition-all"
                  placeholder="e.g. Introduction to Variables"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-primaryLight uppercase mb-2 tracking-wider">Lesson Content (HTML supported)</label>
                <textarea
                  value={lessonForm.content || ''}
                  onChange={e => setLessonForm({ ...lessonForm, content: e.target.value })}
                  rows={8}
                  className="w-full bg-primary/5 border border-primary/20 rounded-xl py-3 px-4 text-textMain font-mono text-sm focus:outline-none focus:border-primary focus:bg-primary/10 focus:ring-1 focus:ring-primary transition-all custom-scrollbar"
                  placeholder="e.g. <p>In this lesson, we will explore variables...</p>"
                />
              </div>
            </div>
            <div className="flex gap-4 pt-2">
              <button onClick={handleSaveLesson} className="flex-1 py-3.5 bg-primary hover:bg-primaryLight text-white rounded-xl font-bold shadow-[0_0_20px_rgba(var(--color-primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--color-primary),0.5)] transition-all">Save Changes</button>
              <button onClick={() => setLessonModalOpen(false)} className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Company Modal */}
      {companyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setCompanyModalOpen(false)} />
          <div className="relative bg-background border border-primary/20 rounded-3xl p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-[0_0_40px_rgba(var(--color-primary),0.15)] space-y-6 animate-fade-in-up">
            <h3 className="text-2xl font-bold text-textMain font-display bg-gradient-to-r from-primary to-primaryLight bg-clip-text text-transparent">{selectedCompany ? 'Edit Company Info' : 'Create New Company'}</h3>
            <div className="space-y-4">
              {!selectedCompany && (
                <div>
                  <label className="block text-xs font-bold text-primaryLight uppercase mb-2 tracking-wider">Company ID / Key (e.g. google, microsoft)</label>
                  <input
                    type="text"
                    value={companyForm.id || ''}
                    onChange={e => setCompanyForm({ ...companyForm, id: e.target.value })}
                    className="w-full bg-primary/5 border border-primary/20 rounded-xl py-3 px-4 text-textMain focus:outline-none focus:border-primary focus:bg-primary/10 focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-primaryLight uppercase mb-2 tracking-wider">Name</label>
                <input
                  type="text"
                  value={companyForm.name || ''}
                  onChange={e => setCompanyForm({ ...companyForm, name: e.target.value })}
                  className="w-full bg-primary/5 border border-primary/20 rounded-xl py-3 px-4 text-textMain focus:outline-none focus:border-primary focus:bg-primary/10 focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primaryLight uppercase mb-2 tracking-wider">Difficulty</label>
                  <select
                    value={companyForm.difficulty || 'Moderate'}
                    onChange={e => setCompanyForm({ ...companyForm, difficulty: e.target.value as any })}
                    title="Company difficulty"
                    className="w-full bg-primary/5 border border-primary/20 rounded-xl py-3 px-4 text-textMain focus:outline-none focus:border-primary focus:bg-primary/10 focus:ring-1 focus:ring-primary transition-all"
                  >
                    <option value="Moderate" className="bg-background text-textMain">Moderate</option>
                    <option value="Hard" className="bg-background text-textMain">Hard</option>
                    <option value="Very Hard" className="bg-background text-textMain">Very Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-primaryLight uppercase mb-2 tracking-wider">Custom Logo URL (Optional)</label>
                  <input
                    type="text"
                    value={companyForm.logo || ''}
                    onChange={e => setCompanyForm({ ...companyForm, logo: e.target.value })}
                    className="w-full bg-primary/5 border border-primary/20 rounded-xl py-3 px-4 text-textMain focus:outline-none focus:border-primary focus:bg-primary/10 focus:ring-1 focus:ring-primary transition-all"
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-primaryLight uppercase mb-2 tracking-wider">Focus Areas (Comma-separated)</label>
                <input
                  type="text"
                  value={(companyForm.focus || []).join(', ')}
                  onChange={e => setCompanyForm({ ...companyForm, focus: e.target.value.split(',').map(s => s.trim()) })}
                  className="w-full bg-primary/5 border border-primary/20 rounded-xl py-3 px-4 text-textMain focus:outline-none focus:border-primary focus:bg-primary/10 focus:ring-1 focus:ring-primary transition-all"
                  placeholder="e.g. DSA, System Design"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-primaryLight uppercase mb-2 tracking-wider">Short Description</label>
                <textarea
                  value={companyForm.description || ''}
                  onChange={e => setCompanyForm({ ...companyForm, description: e.target.value })}
                  rows={3}
                  className="w-full bg-primary/5 border border-primary/20 rounded-xl py-3 px-4 text-textMain focus:outline-none focus:border-primary focus:bg-primary/10 focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>
            <div className="flex gap-4 pt-2">
              <button onClick={handleSaveCompany} className="flex-1 py-3.5 bg-primary hover:bg-primaryLight text-white rounded-xl font-bold shadow-[0_0_20px_rgba(var(--color-primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--color-primary),0.5)] transition-all">Save Changes</button>
              <button onClick={() => setCompanyModalOpen(false)} className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};