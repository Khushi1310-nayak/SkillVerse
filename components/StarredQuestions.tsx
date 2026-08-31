import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Star,
  Search,
  BookOpen,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Layers,
  CheckCircle
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { firestoreService } from '../services/firestoreService';
import { COURSES } from '../constants';
import { Course, QuizQuestion, StarredQuestion } from '../types';
import { getDailyQuiz } from '../utils/dailyQuizGenerator';

interface ResolvedStarredQuestion {
  courseId: string;
  questionId: number;
  starredAt: string;
  courseTitle: string;
  question: QuizQuestion;
}

export const StarredQuestions: React.FC = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [starredQuestions, setStarredQuestions] = useState<StarredQuestion[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('All');
  const [practiceMode, setPracticeMode] = useState(false);
  const [currentDeckIndex, setCurrentDeckIndex] = useState(0);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [deckSelectedAnswers, setDeckSelectedAnswers] = useState<Record<string, number>>({});
  const [toastMessage, setToastMessage] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    const loadData = async () => {
      const storedStarred = storageService.getStarredQuestions();
      setStarredQuestions(storedStarred);

      try {
        const firestoreCourses = await firestoreService.getCourses();
        if (firestoreCourses && firestoreCourses.length > 0) {
          const courseMap = new Map<string, Course>();
          COURSES.forEach(c => courseMap.set(c.id, c));
          firestoreCourses.forEach(c => courseMap.set(c.id, c));
          setCourses(Array.from(courseMap.values()));
        }
      } catch (err) {
        console.error('Error fetching courses in StarredQuestions:', err);
      }
    };

    loadData();
  }, []);

  const resolvedStarredList: ResolvedStarredQuestion[] = useMemo(() => {
    const list: ResolvedStarredQuestion[] = [];

    starredQuestions.forEach(sq => {
      const course = courses.find(c => c.id === sq.courseId);
      if (!course) return;

      let quizQuestions = course.quiz || [];
      if (quizQuestions.length === 0) {
        quizQuestions = getDailyQuiz(course.title);
      }

      const questionObj = quizQuestions.find(q => q.id === sq.questionId);
      if (questionObj) {
        list.push({
          courseId: sq.courseId,
          questionId: sq.questionId,
          starredAt: sq.starredAt,
          courseTitle: course.title,
          question: questionObj,
        });
      }
    });

    return list.sort(
      (a, b) => new Date(b.starredAt).getTime() - new Date(a.starredAt).getTime()
    );
  }, [starredQuestions, courses]);

  const uniqueCourses = useMemo(() => {
    const map = new Map<string, string>();
    resolvedStarredList.forEach(item => {
      map.set(item.courseId, item.courseTitle);
    });
    return Array.from(map.entries());
  }, [resolvedStarredList]);

  const filteredQuestions = useMemo(() => {
    return resolvedStarredList.filter(item => {
      const matchesCourse = selectedCourseId === 'All' || item.courseId === selectedCourseId;
      const qText = item.question.question.toLowerCase();
      const optionsText = item.question.options.join(' ').toLowerCase();
      const courseText = item.courseTitle.toLowerCase();
      const query = searchQuery.toLowerCase().trim();

      const matchesSearch = !query || qText.includes(query) || optionsText.includes(query) || courseText.includes(query);

      return matchesCourse && matchesSearch;
    });
  }, [resolvedStarredList, selectedCourseId, searchQuery]);

  const handleUnstar = (courseId: string, questionId: number) => {
    const updated = storageService.toggleStarQuestion(courseId, questionId);
    setStarredQuestions(updated);
    showToast('Question removed from starred deck.');
  };

  const toggleRevealAnswer = (key: string) => {
    setRevealedAnswers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDeckOptionSelect = (key: string, optionIndex: number) => {
    setDeckSelectedAnswers(prev => ({ ...prev, [key]: optionIndex }));
  };

  const currentDeckQuestion = filteredQuestions[currentDeckIndex];
  const currentDeckKey = currentDeckQuestion ? `${currentDeckQuestion.courseId}_${currentDeckQuestion.questionId}` : '';

  return (
    <div className="animate-fade-in space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/20 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-amber-500/10 text-amber-400 text-xs px-3 py-1 rounded-full font-semibold border border-amber-500/20 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-amber-400" /> Starred Review Deck
            </span>
            <span className="text-textMuted text-xs flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-primaryLight" /> {filteredQuestions.length} Questions Saved
            </span>
          </div>
          <h1 className="text-3xl font-display font-bold text-textMain">Starred Quiz Questions</h1>
          <p className="text-textMuted mt-1">Review and practice quiz questions saved across all your courses.</p>
        </div>

        {filteredQuestions.length > 0 && (
          <button
            onClick={() => {
              setPracticeMode(!practiceMode);
              setCurrentDeckIndex(0);
            }}
            className={`px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight ${
              practiceMode
                ? 'bg-black/10 dark:bg-white/10 text-textMain hover:bg-black/20 dark:hover:bg-white/20'
                : 'bg-gradient-main text-white hover:shadow-primary/25'
            }`}
          >
            {practiceMode ? (
              <>
                <Layers className="w-4 h-4" /> View All Cards
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Practice Deck ({filteredQuestions.length})
              </>
            )}
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      {!practiceMode && (
        <div className="bg-glass border border-black/20 dark:border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted" />
            <input
              type="text"
              placeholder="Search question text, options, or course..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/50 dark:bg-white/5 border border-black/20 dark:border-white/10 rounded-xl text-sm text-textMain placeholder:text-textMuted focus:outline-none focus:border-primaryLight transition"
            />
          </div>

          {uniqueCourses.length > 0 && (
            <select
              value={selectedCourseId}
              onChange={e => setSelectedCourseId(e.target.value)}
              className="bg-white/50 dark:bg-white/5 border border-black/20 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-textMain focus:outline-none focus:border-primaryLight transition max-w-xs"
            >
              <option value="All" className="bg-background text-textMain">All Courses ({resolvedStarredList.length})</option>
              {uniqueCourses.map(([cId, title]) => (
                <option key={cId} value={cId} className="bg-background text-textMain">
                  {title}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Main Content Area */}
      {filteredQuestions.length === 0 ? (
        <div className="bg-glass border border-black/20 dark:border-white/10 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
            <Star className="w-8 h-8 fill-amber-400" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-xl font-bold text-textMain">No Starred Questions Found</h3>
            <p className="text-sm text-textMuted">
              {starredQuestions.length === 0
                ? 'Star questions while taking course quizzes to build your custom review deck!'
                : 'No starred questions match your active search and filter criteria.'}
            </p>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-main text-white text-sm font-bold shadow-lg hover:shadow-primary/25 transition"
          >
            <BookOpen className="w-4 h-4" /> Explore Courses
          </Link>
        </div>
      ) : practiceMode ? (
        /* Interactive Deck Practice Mode */
        <div className="bg-glass border border-black/20 dark:border-white/10 rounded-3xl p-6 sm:p-10 space-y-8 animate-fade-in max-w-3xl mx-auto">
          {/* Deck Header */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-textMuted uppercase tracking-wider">
              Card {currentDeckIndex + 1} of {filteredQuestions.length}
            </span>
            <div className="flex items-center gap-2">
              <Link
                to={`/course/${currentDeckQuestion.courseId}`}
                className="text-xs text-primaryLight font-medium hover:underline inline-flex items-center gap-1"
              >
                {currentDeckQuestion.courseTitle} <ExternalLink size={12} />
              </Link>
              <button
                onClick={() => handleUnstar(currentDeckQuestion.courseId, currentDeckQuestion.questionId)}
                className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-500/10 transition"
                title="Unstar Question"
              >
                <Star size={18} className="fill-amber-400" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-main transition-all duration-300"
              style={{ width: `${((currentDeckIndex + 1) / filteredQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <h2 className="text-xl sm:text-2xl font-bold text-textMain leading-relaxed">
            {currentDeckQuestion.question.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {currentDeckQuestion.question.options.map((option, idx) => {
              const selectedIdx = deckSelectedAnswers[currentDeckKey];
              const isSelected = selectedIdx === idx;
              const isCorrect = idx === currentDeckQuestion.question.correctAnswer;
              const isAnswered = selectedIdx !== undefined;

              let btnStyle = 'bg-white/50 dark:bg-white/5 border-black/20 dark:border-white/10 text-textMuted hover:bg-white/80 dark:hover:bg-white/10';
              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-success/20 border-success text-success font-semibold';
                } else if (isSelected) {
                  btnStyle = 'bg-red-500/20 border-red-500 text-red-500';
                } else {
                  btnStyle = 'bg-white/5 border-transparent opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleDeckOptionSelect(currentDeckKey, idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${btnStyle}`}
                >
                  <span>{option}</span>
                  {isAnswered && (
                    isCorrect ? <CheckCircle size={18} className="text-success shrink-0" /> :
                    isSelected ? <XCircle size={18} className="text-red-500 shrink-0" /> : null
                  )}
                </button>
              );
            })}
          </div>

          {/* Deck Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-black/10 dark:border-white/10">
            <button
              onClick={() => setCurrentDeckIndex(prev => Math.max(0, prev - 1))}
              disabled={currentDeckIndex === 0}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-textMain font-medium disabled:opacity-40 transition flex items-center gap-2 text-sm"
            >
              <ArrowLeft size={16} /> Previous
            </button>

            <button
              onClick={() => toggleRevealAnswer(currentDeckKey)}
              className="px-4 py-2 rounded-xl bg-primary/10 text-primaryLight hover:bg-primary/20 transition flex items-center gap-2 text-sm font-medium"
            >
              {revealedAnswers[currentDeckKey] ? <EyeOff size={16} /> : <Eye size={16} />}
              {revealedAnswers[currentDeckKey] ? 'Hide Answer' : 'Reveal Answer'}
            </button>

            <button
              onClick={() => setCurrentDeckIndex(prev => Math.min(filteredQuestions.length - 1, prev + 1))}
              disabled={currentDeckIndex === filteredQuestions.length - 1}
              className="px-4 py-2 rounded-xl bg-gradient-main text-white font-medium disabled:opacity-40 transition flex items-center gap-2 text-sm"
            >
              Next <ArrowRight size={16} />
            </button>
          </div>

          {/* Revealed Answer Box */}
          {revealedAnswers[currentDeckKey] && (
            <div className="p-4 rounded-2xl bg-success/10 border border-success/30 text-sm text-textMain space-y-1 animate-fade-in">
              <p className="font-semibold text-success flex items-center gap-1.5">
                <CheckCircle2 size={16} /> Correct Answer:
              </p>
              <p className="font-medium text-textMain pl-5">
                {currentDeckQuestion.question.options[currentDeckQuestion.question.correctAnswer]}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Grid Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredQuestions.map((item, idx) => {
            const itemKey = `${item.courseId}_${item.questionId}`;
            const isRevealed = !!revealedAnswers[itemKey];

            return (
              <div
                key={itemKey}
                className="bg-glass border border-black/20 dark:border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-primary/40 transition-all duration-300 shadow-md group"
              >
                <div>
                  {/* Card Top */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <Link
                      to={`/course/${item.courseId}`}
                      className="text-xs font-bold text-primaryLight hover:underline truncate flex items-center gap-1"
                    >
                      <BookOpen size={14} /> {item.courseTitle}
                    </Link>
                    <button
                      onClick={() => handleUnstar(item.courseId, item.questionId)}
                      className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-500/10 transition shrink-0"
                      title="Unstar Question"
                    >
                      <Star size={18} className="fill-amber-400" />
                    </button>
                  </div>

                  {/* Question Title */}
                  <h3 className="text-lg font-bold text-textMain mb-4 leading-snug">
                    {idx + 1}. {item.question.question}
                  </h3>

                  {/* Options List */}
                  <div className="space-y-2 mb-4">
                    {item.question.options.map((opt, oIdx) => {
                      const isCorrect = oIdx === item.question.correctAnswer;
                      let optionClass = 'bg-white/50 dark:bg-white/5 text-textMuted border-black/10 dark:border-white/5';
                      if (isRevealed) {
                        if (isCorrect) {
                          optionClass = 'bg-success/20 text-success font-semibold border-success/40';
                        }
                      }

                      return (
                        <div
                          key={oIdx}
                          className={`p-3 rounded-xl border text-sm transition-colors flex items-center justify-between ${optionClass}`}
                        >
                          <span>{opt}</span>
                          {isRevealed && isCorrect && <CheckCircle size={16} className="text-success shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => toggleRevealAnswer(itemKey)}
                    className="text-xs font-semibold text-primaryLight hover:text-textMain transition flex items-center gap-1.5"
                  >
                    {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                    {isRevealed ? 'Hide Answer' : 'Reveal Answer'}
                  </button>

                  <span className="text-[11px] text-textMuted">
                    Saved {new Date(item.starredAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-background/90 border border-primary/40 rounded-2xl px-5 py-3 text-sm text-textMain flex items-center gap-3 shadow-2xl backdrop-blur-md animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default StarredQuestions;
