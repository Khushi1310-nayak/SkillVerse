import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, BookOpen, Award, CheckCircle, XCircle, RefreshCcw, Download, Clock, Sparkles, Loader2 } from 'lucide-react';
import { firestoreService } from '../services/firestoreService';
import { storageService } from '../services/storageService';
import { aiService } from '../services/aiService';
import { soundManager } from '../utils/soundManager';
import { useAuth } from '../hooks/useAuth';
import { Course } from '../types';
import { AIAssistant } from './AIAssistant';
import NotFound from './NotFound';
import { createRoot } from 'react-dom/client';
import { CodePlayground } from './CodePlayground';
import { useActiveTimer } from '../hooks/useActiveTimer';
import { LessonDiscussion } from './LessonDiscussion';

export const CourseView: React.FC = () => {
  useActiveTimer();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [course, setCourse] = useState<Course | null>(null);
  const [loadingCourse, setLoadingCourse] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!id) return;
      setLoadingCourse(true);
      window.scrollTo({ top: 0, behavior: 'instant' });
      try {
        const c = await firestoreService.getCourse(id);
        if (c) {
          const q = await firestoreService.getQuiz(id);
          setCourse({
            ...c,
            quiz: q ? q.questions : []
          });
        } else {
          setCourse(null);
        }
      } catch (err) {
        console.error('Failed to load course details:', err);
        setCourse(null);
      } finally {
        setLoadingCourse(false);
      }
    };
    fetchCourseData();
  }, [id]);
  const { appUser: user, completeCourse } = useAuth();
  const settings = user?.settings;

  const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes
  const cooldownKey = `cooldown_${id}`;

  const [activeTab, setActiveTab] = useState<'learn' | 'quiz'>('learn');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [openAiExplainFor, setOpenAiExplainFor] = useState<number | null>(null);
  const [aiExplanations, setAiExplanations] = useState<Record<number, string>>({});
  const [aiExplainLoading, setAiExplainLoading] = useState<Record<number, boolean>>({});
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0); // seconds remaining in cooldown
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const rootsRef = useRef<any[]>([]);

  const cleanupRoots = () => {
    rootsRef.current.forEach(root => {
      try {
        root.unmount();
      } catch (e) {
        // Safe to ignore if already unmounted
      }
    });
    rootsRef.current = [];
  };

  useEffect(() => {
    if (activeTab !== 'learn' || loadingCourse || !course) {
      cleanupRoots();
      return;
    }

    // Small delay to ensure dangerouslySetInnerHTML has fully rendered
    const timer = setTimeout(() => {
      cleanupRoots();

      const contentContainer = contentRef.current;
      if (!contentContainer) return;

      const codeElements = Array.from(contentContainer.querySelectorAll('code'));
      const processedContainers = new Set<HTMLElement>();

      codeElements.forEach((codeEl) => {
        let container: HTMLElement | null = codeEl.parentElement;
        
        while (container && container !== contentContainer) {
          if (container.classList.contains('bg-[#0f1623]') || 
              container.className.includes('bg-[#0f1623]') || 
              container.tagName === 'PRE') {
            break;
          }
          container = container.parentElement;
        }

        if (!container || container === contentContainer) {
          container = codeEl.parentElement;
        }

        if (container && !processedContainers.has(container) && container.parentNode) {
          processedContainers.add(container);

          const initialCode = codeEl.textContent || '';
          const isInline = !initialCode.includes('\n') && initialCode.length < 50;
          if (isInline) return;

          const mountPoint = document.createElement('div');
          mountPoint.className = 'w-full my-6';

          container.parentNode.replaceChild(mountPoint, container);

          try {
            const root = createRoot(mountPoint);
            root.render(<CodePlayground initialCode={initialCode.trim()} />);
            rootsRef.current.push(root);
          } catch (err) {
            console.error('Failed to initialize CodePlayground root:', err);
          }
        }
      });
    }, 50);

    return () => {
      clearTimeout(timer);
      cleanupRoots();
    };
  }, [course?.id, activeTab, loadingCourse]);

  useEffect(() => {
    // Load existing progress
    if (id) {
      const existing = storageService.getProgress(id);
      if (existing && existing.passed) {
        setPassed(true);
        setScore(existing.score);
        setQuizSubmitted(true);
      } else if (settings?.autoSave) {
        const saved = localStorage.getItem(`quizState_${id}`);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.selectedAnswers) setSelectedAnswers(parsed.selectedAnswers);
            if (parsed.currentQuestion !== undefined) setCurrentQuestion(parsed.currentQuestion);
            if (parsed.selectedAnswers && parsed.selectedAnswers.length > 0) setActiveTab('quiz');
          } catch (e) { }
        }
      }
    }
  }, [id, settings?.autoSave]);

  useEffect(() => {
    if (id) {
      storageService.setLastVisited(id);
    }
  }, [id]);

  useEffect(() => {
    if (settings?.autoSave && id && !quizSubmitted && selectedAnswers.length > 0) {
      localStorage.setItem(`quizState_${id}`, JSON.stringify({ selectedAnswers, currentQuestion }));
    }
  }, [selectedAnswers, currentQuestion, id, settings?.autoSave, quizSubmitted]);

  // Cooldown timer — read from localStorage and start a live countdown
  const startCooldownInterval = (remaining: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(remaining);
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          localStorage.removeItem(cooldownKey);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    const saved = localStorage.getItem(cooldownKey);
    if (saved) {
      const elapsed = Date.now() - parseInt(saved, 10);
      const remaining = Math.ceil((COOLDOWN_MS - elapsed) / 1000);
      if (remaining > 0) {
        startCooldownInterval(remaining);
      } else {
        localStorage.removeItem(cooldownKey);
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [id]);

  if (!course) return <div>{t('courseView.notFound')}</div>;

  const handleOptionSelect = (optionIndex: number) => {
    if (quizSubmitted) return;
    if (settings?.instantFeedback && selectedAnswers[currentQuestion] !== undefined) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);

    if (settings?.soundEffects !== false) {
      if (optionIndex === course.quiz[currentQuestion].correctAnswer) {
        soundManager.playCorrect();
      } else {
        soundManager.playIncorrect();
      }
    }
  };

  const submitQuiz = () => {
    let correctCount = 0;
    course.quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) correctCount++;
    });

    const finalScore = Math.round((correctCount / course.quiz.length) * 100);
    const isPassed = finalScore >= 70;

    setScore(finalScore);
    setPassed(isPassed);
    setQuizSubmitted(true);

    if (isPassed && settings?.soundEffects !== false) {
      soundManager.playFanfare();
    }

    // Start cooldown on failure
    if (!isPassed) {
      localStorage.setItem(cooldownKey, Date.now().toString());
      startCooldownInterval(COOLDOWN_MS / 1000);
    }

    storageService.saveProgress({
      courseId: course.id,
      completed: true,
      score: finalScore,
      passed: isPassed,
      completedDate: new Date().toLocaleDateString()
    });

    if (isPassed && !user?.courses?.includes(course.id)) {
      // Only award XP if the user hasn't completed this course before
      completeCourse(course.id, 100).catch(console.error);
    }
  };

  const resetQuiz = () => {
    setQuizSubmitted(false);
    setSelectedAnswers([]);
    setCurrentQuestion(0);
    setScore(0);
    setPassed(false);
    if (id) localStorage.removeItem(`quizState_${id}`);
    // Note: we do NOT clear the cooldown here — it must expire naturally
  };

  const handleAskAiWhy = async (qIdx: number) => {
    // Toggle closed if already open
    if (openAiExplainFor === qIdx) {
      setOpenAiExplainFor(null);
      return;
    }
    setOpenAiExplainFor(qIdx);
    if (aiExplanations[qIdx] || !course) return;

    setAiExplainLoading(prev => ({ ...prev, [qIdx]: true }));
    try {
      const q = course.quiz[qIdx];
      const explanation = await aiService.explainQuizAnswer({
        courseTitle: course.title,
        question: q.question,
        options: q.options,
        selectedAnswerIndex: selectedAnswers[qIdx],
        correctAnswerIndex: q.correctAnswer,
      });
      setAiExplanations(prev => ({ ...prev, [qIdx]: explanation }));
    } catch (err) {
      console.error('Ask AI Why error:', err);
      setAiExplanations(prev => ({ ...prev, [qIdx]: "Sorry, I couldn't generate an explanation right now. Please try again in a moment." }));
    } finally {
      setAiExplainLoading(prev => ({ ...prev, [qIdx]: false }));
    }
  };

  const formatCooldown = (seconds: number): string => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const getProgressWidthClass = (current: number, total: number) => {
    const percent = Math.round((current / total) * 100);
    const rounded = Math.max(0, Math.min(100, Math.round(percent / 5) * 5));
    const wMap: Record<number, string> = {
      0: 'w-0', 5: 'w-[5%]', 10: 'w-[10%]', 15: 'w-[15%]', 20: 'w-[20%]', 25: 'w-[25%]', 30: 'w-[30%]', 35: 'w-[35%]', 40: 'w-[40%]', 45: 'w-[45%]', 50: 'w-[50%]', 55: 'w-[55%]', 60: 'w-[60%]', 65: 'w-[65%]', 70: 'w-[70%]', 75: 'w-[75%]', 80: 'w-[80%]', 85: 'w-[85%]', 90: 'w-[90%]', 95: 'w-[95%]', 100: 'w-full'
    };
    return wMap[rounded];
  };

  if (loadingCourse) {
    return (
      <div className="min-h-screen bg-[#03060C] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <div className="mt-4 text-textMuted text-sm font-medium animate-pulse">{t('courseView.loading')}</div>
      </div>
    );
  }

  if (!course) {
    return <NotFound />;
  }

  // Remove HTML tags for raw context for AI
  const cleanContent = course.content ? course.content.replace(/<[^>]*>?/gm, '') : '';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-fade-in relative">
      <AIAssistant courseTitle={course.title} courseContext={cleanContent} />

      {/* Sidebar Navigation */}
      <div className="lg:col-span-1 space-y-6">
        <Link to={`/category/${course.categoryId}`} className="inline-flex items-center text-textMuted hover:text-textMain transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          <ArrowLeft size={20} className="mr-2" /> {t('courseView.back')}
        </Link>

        <div className="bg-glass border border-black/20 dark:border-white/20 dark:border-white/10 rounded-2xl p-6 sticky top-28">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
            <BookOpen className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-textMain mb-2">{course.title}</h2>
          <div className="flex flex-col gap-2 mt-6" role="tablist" aria-label="Course sections">
            <button
              onClick={() => setActiveTab('learn')}
              role="tab"
              aria-selected={activeTab === 'learn'}
              className={`flex items-center justify-between p-3 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background ${activeTab === 'learn' ? 'bg-black/5 dark:bg-white/10 text-textMain font-medium' : 'text-textMuted hover:bg-black/5 dark:hover:bg-white/5'}`}
            >
              <span>{t('courseView.navigation.notesResources')}</span>
              {activeTab === 'learn' && <div className="w-2 h-2 rounded-full bg-primaryLight" />}
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              role="tab"
              aria-selected={activeTab === 'quiz'}
              className={`flex items-center justify-between p-3 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background ${activeTab === 'quiz' ? 'bg-black/5 dark:bg-white/10 text-textMain font-medium' : 'text-textMuted hover:bg-black/5 dark:hover:bg-white/5'}`}
            >
              <span>{t('courseView.navigation.finalQuiz')}</span>
              {passed ? <CheckCircle size={16} className="text-success" /> : <div className="w-2 h-2 rounded-full border border-textMuted" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-3">
        <div className="bg-glass border border-black/20 dark:border-white/20 dark:border-white/10 rounded-3xl p-8 md:p-12 min-h-[600px]">

          {activeTab === 'learn' ? (
            <div className="animate-fade-in space-y-8">
              <div className="prose dark:prose-invert prose-lg max-w-none text-textMain">
                {/* Rendering the compiled HTML containing the beautiful Tailwind layout */}
                <div ref={contentRef} dangerouslySetInnerHTML={{ __html: course.content }} />
              </div>

              <div className="border-t border-black/20 dark:border-white/10 pt-8 mt-12">
                <h3 className="text-lg font-bold text-textMain mb-4">{t('courseView.resources.title')}</h3>
                <div className="flex flex-wrap gap-4">
                  {course.resources.map((res, i) => (
                    <a key={i} href={res.url} className="px-4 py-2 bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 border border-black/20 dark:border-white/10 rounded-lg text-primaryLight text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                      {res.title} ↗
                    </a>
                  ))}
                </div>
              </div>

              {/* Lesson Discussion & Q&A Drawer */}
              <LessonDiscussion courseId={course.id} lessonId="main-lesson" user={user} />

              <div className="flex justify-end pt-8">
                <button
                  onClick={() => setActiveTab('quiz')}
                  className="bg-gradient-main text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/25 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {t('courseView.resources.proceed')}
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in max-w-2xl mx-auto">
              {!quizSubmitted ? (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-textMain">
                      {t('courseView.quiz.question', { current: currentQuestion + 1 })}{' '}
                      <span className="text-textMuted text-lg">/ {t('courseView.quiz.questionCount', { total: course.quiz.length })}</span>
                    </h2>
                    <div className="h-2 w-32 bg-black/5 dark:bg-white/10 rounded-full">
                      <div className={`h-full bg-primaryLight rounded-full transition-all duration-300 ${getProgressWidthClass(currentQuestion + 1, course.quiz.length)}`} />
                    </div>
                  </div>

                  <div className="mb-8">
                    <p className="text-xl text-textMain font-medium leading-relaxed">
                      {course.quiz[currentQuestion].question}
                    </p>
                  </div>

                  <div className="space-y-4 mb-10" role="radiogroup" aria-label={course.quiz[currentQuestion].question}>
                    {course.quiz[currentQuestion].options.map((option, idx) => {
                      const isSelected = selectedAnswers[currentQuestion] === idx;
                      const isCorrect = idx === course.quiz[currentQuestion].correctAnswer;
                      const showInstant = settings?.instantFeedback && selectedAnswers[currentQuestion] !== undefined;

                      let btnClass = isSelected
                        ? 'bg-primary/20 border-primaryLight text-textMain'
                        : 'bg-white/50 dark:bg-white/5 border-black/20 dark:border-white/10 text-textMuted hover:bg-white/80 dark:hover:bg-white/10 hover:border-black/20 dark:hover:border-black/20 dark:border-white/20';
                      let iconBorder = isSelected ? 'border-primaryLight' : 'border-black/20 dark:border-white/20';

                      if (showInstant) {
                        if (isCorrect) {
                          btnClass = 'bg-success/20 border-success text-success';
                          iconBorder = 'border-success';
                        } else if (isSelected) {
                          btnClass = 'bg-red-500/20 border-red-500 text-red-500';
                          iconBorder = 'border-red-500';
                        } else {
                          btnClass = 'bg-white/5 dark:bg-white/5 border-transparent opacity-50';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => handleOptionSelect(idx)}
                          disabled={showInstant}
                          className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background ${btnClass}`}
                        >
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${iconBorder}`}>
                            {isSelected && <div className={`w-3 h-3 rounded-full ${showInstant ? (isCorrect ? 'bg-success' : 'bg-red-500') : 'bg-primaryLight'}`} />}
                          </div>
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                      disabled={currentQuestion === 0}
                      className="px-6 py-2 rounded-lg text-textMuted hover:text-textMain disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      {t('courseView.quiz.previous')}
                    </button>
                    {currentQuestion < course.quiz.length - 1 ? (
                      <button
                        onClick={() => setCurrentQuestion(currentQuestion + 1)}
                        className="bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-textMain px-6 py-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        {t('courseView.quiz.next')}
                      </button>
                    ) : (
                      <button
                        onClick={submitQuiz}
                        disabled={selectedAnswers.length < course.quiz.length}
                        className="bg-gradient-main text-white px-8 py-2 rounded-lg font-bold shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        {t('courseView.quiz.submit')}
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-10">
                  <div className="mb-6 inline-flex p-4 rounded-full bg-white/50 dark:bg-white/5 border border-black/20 dark:border-white/10">
                    {passed ? <Award size={64} className="text-yellow-400" /> : <XCircle size={64} className="text-red-400" />}
                  </div>

                  <h2 className="text-3xl font-bold text-textMain mb-2">{passed ? t('courseView.quiz.result.congratulations') : t('courseView.quiz.result.keepTrying')}</h2>
                  <p className="text-textMuted mb-8">
                    {t('courseView.quiz.result.scorePrefix')}{' '}
                    <span className={`font-bold ${passed ? 'text-success' : 'text-red-400'}`}>{score}%</span>.
                    {passed ? ` ${t('courseView.quiz.result.earnedCertificate')}` : ` ${t('courseView.quiz.result.need70')}`}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {passed ? (
                      <Link
                        to={`/certificate/${course.id}`}
                        className="flex items-center justify-center gap-2 bg-gradient-main text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/25 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        <Download size={20} /> {t('courseView.quiz.result.viewCertificate')}
                      </Link>
                    ) : (
                      settings?.retryQuiz !== false ? (
                        <div className="flex flex-col items-center gap-3">
                          {timeLeft > 0 && (
                            <p className="text-orange-400 text-sm font-medium flex items-center gap-2">
                              <Clock size={14} />
                              {t('courseView.quiz.result.retryReminder')}
                            </p>
                          )}
                          <button
                            onClick={resetQuiz}
                            disabled={timeLeft > 0}
                            className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background
                              ${timeLeft > 0
                                ? 'bg-black/10 dark:bg-white/5 text-textMuted opacity-50 cursor-not-allowed border border-orange-500/30'
                                : 'bg-black/5 dark:bg-white/10 text-textMain hover:bg-black/10 dark:hover:bg-white/20'
                              }`}
                          >
                            {timeLeft > 0 ? (
                              <>
                                <Clock size={20} className="text-orange-400" />
                                {t('courseView.quiz.result.retryCountdown', { time: formatCooldown(timeLeft) })}
                              </>
                            ) : (
                              <>
                                <RefreshCcw size={20} /> {t('courseView.quiz.result.retry')}
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <p className="text-textMuted italic mt-4 w-full">{t('courseView.quiz.result.retryDisabled')}</p>
                      )
                    )}
                  </div>

                  {settings?.showAnswers && (
                    <div className="mt-16 space-y-6 text-left border-t border-black/20 dark:border-white/10 pt-10">
                      <h3 className="text-2xl font-bold text-textMain text-center mb-8">{t('courseView.quiz.result.reviewAnswers')}</h3>
                      {course.quiz.map((q, qIdx) => (
                        <div key={qIdx} className="bg-white/50 dark:bg-white/5 p-6 rounded-2xl border border-black/20 dark:border-white/10">
                          <p className="text-lg font-medium text-textMain mb-4">{qIdx + 1}. {q.question}</p>
                          <div className="space-y-3">
                            {q.options.map((opt, oIdx) => {
                              const isCorrect = oIdx === q.correctAnswer;
                              const isSelected = selectedAnswers[qIdx] === oIdx;
                              let colorClass = "text-textMuted";
                              if (isCorrect) colorClass = "text-success font-bold bg-success/10 p-2 rounded-lg";
                              else if (isSelected) colorClass = "text-red-500 line-through bg-red-500/10 p-2 rounded-lg";

                              return (
                                <div key={oIdx} className={`flex items-center gap-3 ${colorClass} ${(!isCorrect && !isSelected) ? 'p-2' : ''}`}>
                                  {isCorrect ? <CheckCircle size={18} /> : isSelected ? <XCircle size={18} /> : <div className="w-[18px]" />}
                                  <span>{opt}</span>
                                </div>
                              )
                            })}
                          </div>

                          {selectedAnswers[qIdx] !== undefined && selectedAnswers[qIdx] !== q.correctAnswer && (
                            <div className="mt-4">
                              <button
                                onClick={() => handleAskAiWhy(qIdx)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primaryLight text-sm font-medium hover:bg-primary/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                              >
                                <Sparkles size={16} /> Ask AI Why
                              </button>

                              {openAiExplainFor === qIdx && (
                                <div className="mt-3 p-4 rounded-xl bg-gradient-main/10 border border-primary/20 text-sm text-textMain leading-relaxed animate-fade-in">
                                  {aiExplainLoading[qIdx] ? (
                                    <span className="flex items-center gap-2 text-textMuted">
                                      <Loader2 size={14} className="animate-spin" /> Thinking...
                                    </span>
                                  ) : (
                                    aiExplanations[qIdx]
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};