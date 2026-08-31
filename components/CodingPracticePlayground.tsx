import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CodePlayground } from './CodePlayground';
import { COURSES } from '../constants';
import { getDailyPlaygroundProblem, getCoursePlaygroundProblems } from '../utils/dailyProblemGenerator';
import { PracticeProblem } from '../utils/playgroundProblems';
import { Code2, Sparkles, BookOpen, ChevronRight, Lightbulb, CheckCircle2, Terminal, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { firestoreService } from '../services/firestoreService';

export const CodingPracticePlayground: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, appUser } = useAuthContext();
  const { showToast } = useToast();

  const codingCourses = COURSES.filter(c => c.categoryId !== 'design');

  const initialCourseId = searchParams.get('course') || codingCourses[0]?.id || 'javascript';
  const initialModuleParam = parseInt(searchParams.get('module') || '1', 10);
  const initialModuleIndex = Math.max(0, Math.min(7, initialModuleParam - 1));

  const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId);
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(initialModuleIndex);
  const [showHint, setShowHint] = useState(false);
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);

  const activeCourse = codingCourses.find(c => c.id === selectedCourseId) || codingCourses[0] || COURSES[0];
  const problemsList = getCoursePlaygroundProblems(activeCourse.id);
  const currentProblem: PracticeProblem = problemsList[selectedModuleIndex] || getDailyPlaygroundProblem(activeCourse.id, selectedModuleIndex);
  const currentLanguage = activeCourse.id;

  const handleRequestReview = async (code: string, language: string) => {
    if (isReviewSubmitting) return;
    const effectiveUserId = user?.uid || appUser?.uid;
    if (!effectiveUserId) {
      showToast({ message: 'Please log in to request a code review.', type: 'error' });
      return;
    }

    setIsReviewSubmitting(true);
    try {
      await firestoreService.createCodeReviewRequest({
        userId: effectiveUserId,
        username: appUser?.username || user?.displayName || 'Learner',
        code,
        language,
        problemContext: `${activeCourse.title}: ${currentProblem.title}`,
      });
      showToast({ message: 'Code review requested successfully.', type: 'success' });
    } catch (err) {
      console.error('Error requesting code review:', err);
      showToast({ message: 'Failed to request a code review.', type: 'error' });
    } finally {
      setIsReviewSubmitting(false);
    }
  };

  // Sync state with URL params
  useEffect(() => {
    const courseParam = searchParams.get('course');
    const moduleParam = parseInt(searchParams.get('module') || '1', 10);
    if (courseParam && codingCourses.some(c => c.id === courseParam)) {
      setSelectedCourseId(courseParam);
    }
    if (!isNaN(moduleParam)) {
      setSelectedModuleIndex(Math.max(0, Math.min(7, moduleParam - 1)));
    }
  }, [searchParams]);

  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId);
    setSelectedModuleIndex(0);
    setShowHint(false);
    setSearchParams({ course: courseId, module: '1' });
  };

  const handleModuleSelect = (index: number) => {
    setSelectedModuleIndex(index);
    setShowHint(false);
    setSearchParams({ course: selectedCourseId, module: (index + 1).toString() });
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Hard': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-textMain pt-20 pb-12 px-4 md:px-8">
      {/* Header Bar */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-glass border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/course/${activeCourse.id}`)}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-textMuted hover:text-white transition-all"
              title="Return to Course"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 text-primaryLight text-xs font-bold uppercase tracking-wider border border-primary/30">
                  <Code2 size={12} /> Interactive Playground
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                  <Sparkles size={12} /> Updated Daily
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-white">
                Candidate Coding Playground
              </h1>
            </div>
          </div>

          {/* Course Selector Dropdown (Coding Tracks Only) */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-textMuted uppercase tracking-wider hidden sm:inline">Select Track:</span>
            <select
              value={selectedCourseId}
              onChange={(e) => handleCourseChange(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-[#0f1623] border border-white/10 text-sm font-semibold text-white focus:outline-none focus:border-primaryLight transition-all cursor-pointer shadow-inner min-w-[220px]"
            >
              {codingCourses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.level})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Module Problem Selector Tabs (1-8) */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 px-1 custom-scrollbar mt-4">
          {Array.from({ length: 8 }).map((_, idx) => {
            const isActive = selectedModuleIndex === idx;
            const prob = problemsList[idx] || getDailyPlaygroundProblem(activeCourse.id, idx);
            return (
              <button
                key={idx}
                onClick={() => handleModuleSelect(idx)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 border ${
                  isActive
                    ? 'bg-gradient-main text-white border-primaryLight shadow-lg shadow-primary/20 scale-105'
                    : 'bg-glass border-white/10 text-textMuted hover:text-white hover:border-white/20'
                }`}
              >
                <span>Module {idx + 1}</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] uppercase font-mono ${getDifficultyColor(prob.difficulty)}`}>
                  {prob.difficulty}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stacked Main Workspace: Problem Statement Full Width ON TOP, Monaco Editor Full Width UNDERNEATH */}
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* TOP SECTION: Problem Statement, Constraints, Sample Cases & Hints (Full Width) */}
        <div className="bg-glass border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          {/* Header Row: Difficulty, Module Progress & Course Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider border shadow-sm ${getDifficultyColor(currentProblem.difficulty)}`}>
                {currentProblem.difficulty}
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-textMuted tracking-wider">
                Module {selectedModuleIndex + 1} of 8
              </span>
              <span className="px-3 py-1 rounded-xl bg-primary/10 border border-primary/20 text-xs font-semibold text-primaryLight">
                {activeCourse.title} Track
              </span>
            </div>
            <Link
              to={`/course/${activeCourse.id}`}
              className="inline-flex items-center gap-2 text-xs font-bold text-primaryLight hover:text-white transition-colors px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10"
            >
              <BookOpen size={14} /> Review {activeCourse.title} Theory
            </Link>
          </div>

          {/* Problem Title & Full Description */}
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
              {currentProblem.title}
            </h2>
            <p className="text-textMuted text-sm md:text-base leading-relaxed max-w-5xl">
              {currentProblem.description}
            </p>
          </div>

          {/* 3-Column Detail Cards Grid: Constraints, Samples, and Solution Hint */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            
            {/* Column 1: Constraints & Requirements */}
            {currentProblem.constraints && currentProblem.constraints.length > 0 && (
              <div className="bg-[#0f1623]/80 rounded-2xl p-5 border border-white/5 space-y-3 shadow-inner flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-textMuted uppercase tracking-wider mb-3 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-primaryLight" /> Constraints & Rules
                  </h3>
                  <ul className="space-y-2">
                    {currentProblem.constraints.map((constraint, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-textMuted font-mono">
                        <span className="text-primaryLight font-bold">•</span>
                        <span>{constraint}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Column 2: Sample Test Cases */}
            {currentProblem.sampleInputs && currentProblem.sampleInputs.length > 0 && (
              <div className="bg-[#0f1623]/80 rounded-2xl p-5 border border-white/5 space-y-3 shadow-inner">
                <h3 className="text-xs font-bold text-textMuted uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Code2 size={14} className="text-blue-400" /> Sample Test Cases
                </h3>
                <div className="space-y-3 max-h-[190px] overflow-y-auto pr-1 custom-scrollbar">
                  {currentProblem.sampleInputs.map((sample, i) => (
                    <div key={i} className="bg-black/30 rounded-xl p-3 border border-white/5 space-y-1.5 font-mono text-xs">
                      <div>
                        <span className="text-textMuted/70 text-[10px] uppercase font-bold block">Input:</span>
                        <code className="text-blue-300 bg-white/5 px-2 py-0.5 rounded text-[11px] block overflow-x-auto">{sample.input}</code>
                      </div>
                      <div>
                        <span className="text-textMuted/70 text-[10px] uppercase font-bold block">Expected Output:</span>
                        <code className="text-emerald-400 bg-white/5 px-2 py-0.5 rounded text-[11px] block overflow-x-auto">{sample.output}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Column 3: Solution Guidance & Hints */}
            <div className="bg-[#0f1623]/80 rounded-2xl p-5 border border-white/5 space-y-3 shadow-inner flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-textMuted uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Lightbulb size={14} className="text-amber-400" /> Solution Guidance
                </h3>
                <p className="text-xs text-textMuted leading-relaxed mb-3">
                  Need a hint to get started? Reveal the solution architecture tip below.
                </p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-all text-xs font-bold"
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb size={15} />
                    <span>{showHint ? 'Hide Solution Hint' : 'Reveal Solution Hint'}</span>
                  </div>
                  <ChevronRight size={15} className={`transition-transform duration-200 ${showHint ? 'rotate-90' : ''}`} />
                </button>
                {showHint && (
                  <div className="mt-3 p-3.5 rounded-xl bg-black/40 border border-amber-500/30 text-amber-200 text-xs font-mono leading-relaxed animate-fade-in shadow-inner">
                    💡 <strong>Hint:</strong> {currentProblem.solutionHint}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM SECTION: Full-Width Monaco Code Editor & Live Sandbox Terminal */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <Terminal size={16} className="text-primaryLight" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Full-Screen Candidate Starter Code Sandbox
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-primaryLight">
                {currentLanguage}
              </span>
            </div>
            <span className="text-xs text-textMuted hidden sm:inline">
              Edit the implementation below and click <strong className="text-emerald-400">"Run Code"</strong> to test live.
            </span>
          </div>
          
          {/* Full-Width Interactive Code Playground */}
          <CodePlayground
            key={`${activeCourse.id}-${selectedModuleIndex}`}
            initialCode={currentProblem.starterCode}
            language={currentLanguage}
            height="380px"
            onRequestReview={handleRequestReview}
            isReviewSubmitting={isReviewSubmitting}
          />
        </div>

      </div>
    </div>
  );
};
