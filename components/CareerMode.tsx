import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Briefcase, Search, CheckCircle, Clock,
  ExternalLink, ChevronDown, ChevronRight, X,
  PlayCircle, Timer, Award, Zap, Heart, Sparkles,
  BarChart, ArrowRight, Maximize2, Minimize2,
  Mic, MicOff, Volume2, User, Loader2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useSearchParams } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { Company, InterviewQuestion, CareerProgress, User as AppUser } from '../types';
import { getRecommendedCompanies } from '../utils/recommendations';
import { firestoreService } from '../services/firestoreService';
import { auth } from '../firebase/firebase';
import { Typewriter } from './Typewriter';
import Editor from '@monaco-editor/react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useToast } from '../contexts/ToastContext';
import { useTranslation } from 'react-i18next';

const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
};

const getPercentClass = (p: number) => {
  const rounded = Math.max(0, Math.min(100, Math.round(p / 5) * 5));
  const wMap: Record<number, string> = {
    0: 'w-0', 5: 'w-[5%]', 10: 'w-[10%]', 15: 'w-[15%]', 20: 'w-[20%]', 25: 'w-[25%]', 30: 'w-[30%]', 35: 'w-[35%]', 40: 'w-[40%]', 45: 'w-[45%]', 50: 'w-[50%]', 55: 'w-[55%]', 60: 'w-[60%]', 65: 'w-[65%]', 70: 'w-[70%]', 75: 'w-[75%]', 80: 'w-[80%]', 85: 'w-[85%]', 90: 'w-[90%]', 95: 'w-[95%]', 100: 'w-full'
  };
  return wMap[rounded];
};

// --- ANIMATION COMPONENTS ---

const Confetti: React.FC = () => {
  const styles = [...Array(20)].map((_, i) => `
    .confetti-${i} {
      left: ${Math.random() * 100}%;
      top: -10px;
      background-color: ${['#6968A6', '#CF9893', '#6EE7B7', '#F5C97A'][Math.floor(Math.random() * 4)]};
      animation: fall ${2 + Math.random() * 2}s linear forwards;
      animation-delay: ${Math.random() * 0.5}s;
    }
  `).join('\n');

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      <style>{styles}</style>
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className={`absolute w-2 h-2 rounded-full confetti-${i}`}
        />
      ))}
      <style>{`
        @keyframes fall {
          to { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

const ReadinessScore: React.FC<{ percentage: number }> = ({ percentage }) => {
  const { t } = useTranslation();
  // Color Transition Logic
  const colorClass = percentage < 30 ? 'text-red-500' : percentage < 70 ? 'text-orange-500' : 'text-emerald-500';

  return (
    <div className="relative flex items-center justify-center w-32 h-32 md:w-32 md:h-32 group shrink-0">
      <div className="flex flex-col items-center justify-center text-center z-10">
        <span className={`text-4xl md:text-5xl font-bold leading-none ${colorClass}`}>{percentage}%</span>
        <span className="text-xs text-textMuted uppercase tracking-wider mt-2 font-bold">{t("careerMode.header.ready")}</span>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const CompanyCardComponent: React.FC<{ company: Company; progress: CareerProgress; onClick: (company: Company) => void }> = ({ company, progress, onClick }) => {
  const { t } = useTranslation();
  const practicedCount = company.questions.filter(q => progress.practicedQuestions.includes(q.id)).length;
  const progressPercent = Math.round((practicedCount / company.questions.length) * 100);

  return (
    <div
      onClick={() => onClick(company)}
      className="group bg-glass border border-black/20 dark:border-white/20 rounded-2xl p-4 sm:p-6 cursor-pointer hover:bg-glass-hover hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 relative overflow-hidden"
    >
      <div className="flex items-start justify-between gap-4 mb-5 sm:mb-6">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-white border border-black/20 p-2 sm:p-3 shadow-lg group-hover:scale-110 transition-transform duration-500 flex items-center justify-center overflow-hidden">
<img
  src={company.logo}
  alt={company.name}
  className="w-full h-full object-contain"
  loading="lazy"
  width={64}
  height={64}
/>
        </div>
        <div className={`shrink-0 whitespace-nowrap px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border text-center
           ${company.difficulty === 'Moderate' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
            company.difficulty === 'Hard' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
              'bg-red-500/10 text-red-500 border-red-500/20'}
        `}>
          {company.difficulty}
        </div>
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-textMain mb-2 group-hover:text-primaryLight transition-colors">{company.name}</h3>
      <p className="text-sm text-textMuted mb-4 line-clamp-2">{company.description}</p>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-medium text-textMuted">
          <span>{t('careerMode.companyCards.progress')}</span>
          <span className={progressPercent === 100 ? 'text-success' : ''}>{practicedCount}/{company.questions.length}</span>
        </div>
        <div className="h-2 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-main rounded-full transition-all duration-1000 ${getPercentClass(progressPercent)}`}
          />
        </div>
      </div>
    </div>
  );
};

const CompanyCard = React.memo(CompanyCardComponent);

interface QuestionItemProps {
  question: InterviewQuestion;
  isPracticed: boolean;
  isSaved: boolean;
  onTogglePractice: (qId: string) => void;
  onToggleSave: (qId: string) => void;
  srsData?: any;
  onSrsUpdate?: (qId: string, gotRight: boolean) => void;
}

const QuestionItemComponent: React.FC<QuestionItemProps> = ({ 
  question, 
  isPracticed, 
  isSaved, 
  onTogglePractice, 
  onToggleSave,
  srsData,
  onSrsUpdate
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [showXp, setShowXp] = useState(false);

  const handlePractice = () => {
    if (!isPracticed) {
      setShowXp(true);
      setTimeout(() => setShowXp(false), 2000);
    }
    onTogglePractice(question.id);
  };

  return (
    <div className="border border-black/20 dark:border-white/10 bg-black/5 dark:bg-white/5 rounded-xl overflow-hidden transition-all duration-300 hover:border-primary/20 hover:bg-black/10 dark:hover:bg-white/10">
      <div
        className="p-4 cursor-pointer flex items-start gap-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <button
          onClick={(e) => { e.stopPropagation(); handlePractice(); }}
          className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 relative shrink-0
             ${isPracticed
              ? 'bg-success border-success text-white'
              : 'border-textMuted text-transparent hover:border-primaryLight'}
           `}
         >
           <CheckCircle size={14} className={isPracticed ? 'scale-100' : 'scale-0'} />
           {/* XP Popup Animation */}
           {showXp && (
             <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-success font-bold text-sm animate-fade-in-up whitespace-nowrap">
               {t('careerMode.question.xpAward')}
             </div>
           )}
         </button>

         <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 mb-2">
               {question.difficulty === 'Easy'
  ? t('careerMode.question.difficulty.easy')
  : question.difficulty === 'Medium'
  ? t('careerMode.question.difficulty.medium')
  : question.difficulty === 'Hard'
  ? t('careerMode.question.difficulty.hard')
  : question.difficulty}
               {question.tags.map(tag => (
                 <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-textMuted border border-black/20 dark:border-white/5 whitespace-nowrap">{tag}</span>
               ))}
               {srsData && (
                 <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/10 text-orange-500 border border-orange-500/20 font-bold uppercase whitespace-nowrap">
                   {t('careerMode.question.box', {
  number: srsData.srsInterval,
})}
                 </span>
               )}
            </div>
          <h4 className="font-bold text-textMain text-sm md:text-base pr-2 truncate md:whitespace-normal">{question.title}</h4>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleSave(question.id); }}
            className={`p-1 hover:scale-110 transition-transform ${isSaved ? 'text-primaryLight fill-primaryLight' : 'text-textMuted hover:text-textMain'}`}
            title={
  isSaved
    ? t('careerMode.question.removeSaved')
    : t('careerMode.question.saveQuestion')
}
aria-label={
  isSaved
    ? t('careerMode.question.removeSaved')
    : t('careerMode.question.saveQuestion')
}
          >
            <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
          </button>
          <ChevronDown size={18} className={`text-textMuted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
         <div className="p-4 pt-0 border-t border-black/20 dark:border-white/5">
            <div className="mt-4 prose dark:prose-invert prose-sm max-w-none text-textMuted">
               <div dangerouslySetInnerHTML={{ __html: question.answer }} />
            </div>
            
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-black/5 dark:bg-white/5 p-4 rounded-xl">
               <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-textMuted uppercase tracking-wider">{t('careerMode.question.srsStage')}</span>
                  {srsData ? (
                     <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded">
                           Box {srsData.srsInterval}
                        </span>
                        <span className="text-[10px] text-textMuted">
                           {t('careerMode.question.nextReview')} {new Date(srsData.nextReviewDate).toLocaleDateString()}
                        </span>
                     </div>
                  ) : (
                     <span className="text-xs text-textMuted italic">{t('careerMode.question.notScheduled')}</span>
                  )}
               </div>
               
               {onSrsUpdate && (
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                     <button
                       onClick={() => onSrsUpdate(question.id, false)}
                       className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 font-bold text-xs transition-colors"
                     >
                        {t('careerMode.question.forgotWrong')}
                     </button>
                     <button
                       onClick={() => onSrsUpdate(question.id, true)}
                       className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-500 font-bold text-xs transition-colors"
                     >
                        {t('careerMode.question.rememberedRight')}
                     </button>
                  </div>
               )}
            </div>

            <div className="mt-4 flex justify-end">
               <a 
                 href={question.resourceLink} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="flex items-center gap-2 text-primaryLight text-xs font-bold hover:underline"
               >
                 {t('careerMode.question.viewSolution')} <ExternalLink size={12} />
               </a>
            </div>
         </div>
      </div>
    </div>
  );
};

const QuestionItem = React.memo(QuestionItemComponent);

interface InterviewTimerProps {
  initialTime: number;
  extraTimeSeconds: number;
  mockState: 'idle' | 'active' | 'finished' | 'active_voice' | 'finished_voice';
  onTimeUp: () => void;
  timerRef: React.MutableRefObject<number>;
}

const InterviewTimer: React.FC<InterviewTimerProps> = ({
  initialTime,
  extraTimeSeconds,
  mockState,
  onTimeUp,
  timerRef
}) => {
  const [localTimer, setLocalTimer] = useState(initialTime);
const onTimeUpRef = useRef(onTimeUp);

useEffect(() => {
  timerRef.current = localTimer;
}, [localTimer, timerRef]);

  // Handle when parent adds extra time
// Handle when parent adds extra time
const prevExtraTimeRef = useRef(extraTimeSeconds);

useEffect(() => {
  const diff = extraTimeSeconds - prevExtraTimeRef.current;
  if (diff > 0) {
    setLocalTimer(prev => prev + diff);
  }
  prevExtraTimeRef.current = extraTimeSeconds;
}, [extraTimeSeconds]);

// Keep the latest callback in the ref
useEffect(() => {
  onTimeUpRef.current = onTimeUp;
}, [onTimeUp]);

// Tick down
useEffect(() => {
  let interval: any;

  if (mockState === 'active' || mockState === 'active_voice') {
    interval = setInterval(() => {
      setLocalTimer(t => {
        if (t <= 1) {
          clearInterval(interval);
          onTimeUpRef.current();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  return () => clearInterval(interval);
}, [mockState]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className={`flex items-center gap-2 font-mono text-lg md:text-xl bg-white/5 border border-white/10 rounded-full px-4 py-2 ${localTimer < 300 ? 'text-red-500 animate-pulse' : 'text-primaryLight'}`}>
      <Timer /> {formatTime(localTimer)}
    </div>
  );
};

interface VoiceChatProps {
  chatHistory: { role: string; content: string }[];
}

const VoiceChatComponent: React.FC<VoiceChatProps> = ({ chatHistory }) => {
  const { t } = useTranslation();
  const currentMessage = chatHistory.length > 0 && chatHistory[chatHistory.length - 1].role === 'assistant'
    ? chatHistory[chatHistory.length - 1].content
    : chatHistory.length > 1 ? chatHistory[chatHistory.length - 2].content : t('careerMode.timer.connecting');

  return (
    <>
      {/* Hidden live region for screen readers to announce the full response at once */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {currentMessage}
      </div>
      {/* Visual typewriter effect hidden from screen readers to prevent character-by-character spelling */}
      <h3 className="text-lg md:text-2xl font-bold text-textMain mt-4 leading-relaxed min-h-[4rem]" aria-hidden="true">
        <Typewriter text={currentMessage} speed={50} />
      </h3>
    </>
  );
};

const VoiceChat = React.memo(VoiceChatComponent, (prevProps, nextProps) => {
  return prevProps.chatHistory === nextProps.chatHistory;
});

// --- MAIN COMPONENT ---
interface CareerModeProps {
  user?: AppUser;
}

export const CareerMode: React.FC<CareerModeProps> = ({ user }) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const showReviewQueue = searchParams.get('review') === 'true';
  const [progress, setProgress] = useState<CareerProgress>(storageService.getCareerProgress());
  const [companiesList, setCompaniesList] = useState<Company[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);

  const dueQuestions = useMemo(() => {
    const list: { question: InterviewQuestion; company: Company }[] = [];
    const now = new Date();
    const srsMap = progress.srsData || {};
    
    companiesList.forEach(company => {
      company.questions.forEach(q => {
        const srs = srsMap[q.id];
        if (srs) {
          const nextReview = new Date(srs.nextReviewDate);
          if (nextReview <= now) {
            list.push({ question: q, company });
          }
        }
      });
    });
    return list;
  }, [companiesList, progress]);
  const recommendedCompanies = useMemo(
    () => getRecommendedCompanies(user?.settings, progress, companiesList),
    [user?.settings, progress, companiesList]
  );
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [activeTab, setActiveTab] = useState<'study' | 'mock'>('study');

  // Mock Interview State
  const [mockState, setMockState] = useState<'idle' | 'active' | 'finished' | 'active_voice' | 'finished_voice'>('idle');
  const [mockQuestions, setMockQuestions] = useState<InterviewQuestion[]>([]);
  const [currentMockIndex, setCurrentMockIndex] = useState(0);
  const [timer, setTimer] = useState(0); // seconds
  const timerRef = useRef(0);

  // References to keep callbacks stable and break circular dependency
  const startListeningRef = useRef<() => void>(() => {});
  const stopListeningAndSubmitRef = useRef<(forceEnd?: boolean) => Promise<void>>(async () => {});
  const speakQuestionRef = useRef<(text: string) => void>(() => {});
  const generateAIResponseRef = useRef<(history: any[]) => Promise<void>>(async () => {});
  const generateVoiceReportRef = useRef<(history: any[]) => Promise<void>>(async () => {});
  const [mockAnswers, setMockAnswers] = useState<string[]>([]); // user text answers
  const [textReport, setTextReport] = useState("");
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [editorLanguage, setEditorLanguage] = useState<string>('javascript');

  const editorOptions = useMemo(() => ({
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on' as const,
    scrollBeyondLastLine: false,
    wordWrap: 'on' as const,
    padding: { top: 16 }
  }), []);

  // Voice State
  const [chatHistory, setChatHistory] = useState<{ role: string, content: string }[]>([]);
  const [turnCount, setTurnCount] = useState(0);
  const [voiceStatus, setVoiceStatus] = useState<'speaking' | 'listening' | 'generating'>('generating');
  const [currentSpeech, setCurrentSpeech] = useState("");
  const [voiceReport, setVoiceReport] = useState("");
  const recognitionRef = React.useRef<any>(null);
  const synthRef = React.useRef<SpeechSynthesis | null>(window.speechSynthesis);
  const silenceTimerRef = React.useRef<any>(null);
  const currentSpeechRef = React.useRef("");
  const [extraTimeUsed, setExtraTimeUsed] = useState(0); // tracks extra minutes requested
  const [voiceType, setVoiceType] = useState<'robin' | 'elisa'>('robin');
  const voiceTypeRef = React.useRef<'robin' | 'elisa'>('robin');
  const [showVoiceSelectModal, setShowVoiceSelectModal] = useState(false);
  // Ref for the Voice Persona Selection modal container (used by the focus trap)
  const voiceSelectModalRef = useRef<HTMLDivElement>(null);
  // Trap focus inside the Voice Select modal while it is open
  useFocusTrap(voiceSelectModalRef, showVoiceSelectModal, () => setShowVoiceSelectModal(false));

  const handleRequestTime = useCallback(() => {
    if (extraTimeUsed >= 30) return;

    const input = window.prompt(t('careerMode.timer.extraTimePrompt'));
    if (!input) return;

    let requested = parseInt(input);
    if (isNaN(requested) || requested <= 0) return;

    let responseText = "";
    if (requested > 30) {
      requested = 30;
      responseText = t('careerMode.timer.extraTimeLimitReached', { max: 30 });
    } else {
      responseText = t('careerMode.timer.extraTimeGranted', { requested });
    }

    if (requested + extraTimeUsed > 30) {
      requested = 30 - extraTimeUsed;
      responseText = t('careerMode.timer.extraTimeTotalLimitReached', { remaining: requested });
    }

    setExtraTimeUsed(prev => prev + requested);
    timerRef.current = timerRef.current + (requested * 60);

    // Play Robin's Voice
    if (synthRef.current) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(responseText);
      synthRef.current.speak(utterance);
    }
  }, [extraTimeUsed]);

  // Search Filter
  const [search, setSearch] = useState('');



  const handleSelectCompany = useCallback((company: Company) => {
    setSelectedCompany(company);
    setActiveTab('study');
    setMockState('idle');
  }, []);

  const handleTogglePractice = useCallback((qId: string) => {
    const newProgress = storageService.toggleQuestionPractice(qId);
    setProgress(newProgress);
  }, []);

  const handleToggleSave = useCallback((qId: string) => {
    const newProgress = storageService.toggleQuestionSave(qId);
    setProgress(newProgress);
  }, []);

  const handleSrsUpdate = useCallback((qId: string, gotRight: boolean) => {
    const newProgress = storageService.updateQuestionSRS(qId, gotRight);
    setProgress(newProgress);
    showToast({
      message: gotRight
        ? t('careerMode.question.toast.reviewScheduled')
        : t('careerMode.question.toast.reviewReset'),
      type: gotRight ? "success" : "info"
    });
  }, [showToast]);

  const handleExitInterview = useCallback(() => {
    setSelectedCompany(null);
    setIsFullScreen(false);
    setMockState('idle');
  }, []);

  const handleEndInterviewEarly = useCallback(() => {
    stopListeningAndSubmitRef.current(true);
  }, []);

  const handleSendNowOverride = useCallback(() => {
    stopListeningAndSubmitRef.current();
  }, []);

  const handleBackToStudy = useCallback(() => {
    setMockState('idle');
    setActiveTab('study');
  }, []);

  const startMockInterview = useCallback(() => {
    if (!selectedCompany) return;
    // Shuffle and pick up to 5 random unique questions for the mock interview
    const shuffled = [...selectedCompany.questions].sort(() => 0.5 - Math.random());
    setMockQuestions(shuffled.slice(0, 5));
    setMockState('active');
    timerRef.current = 9000;
    setTimer(9000); // 150 minutes
    setExtraTimeUsed(0);
    setCurrentMockIndex(0);
    setMockAnswers([]);
    setIsFullScreen(true);
  }, [selectedCompany]);

  const finishMockInterview = useCallback(async () => {
    setIsGeneratingText(true);

    const userName = auth.currentUser?.displayName || 'candidate';
    let transcriptText = `Candidate Name: ${userName}\nInterviewer Name: Robin\nCompany: ${selectedCompany?.name}\nLanguage Used: ${editorLanguage}\n\n`;
    mockQuestions.forEach((q, i) => {
      transcriptText += `Q${i + 1} (${q.difficulty}): ${q.title}\nUser's Code/Approach:\n${mockAnswers[i] || 'No answer provided.'}\n\n`;
    });

    const systemInstruction = `You are Robin, an elite Technical Interviewer for ${selectedCompany?.name}.
You have just concluded a 5-question coding/system design interview with a candidate named ${userName}.
Here is the transcript of the questions and the code/approach they typed:
${transcriptText}

Provide a brutally honest, highly technical Markdown report evaluating their performance.
Focus on time/space complexity (Big O), edge cases missed, and syntax errors.
Since they typed code in ${editorLanguage}, specifically evaluate their idiomatic use of the language.
IMPORTANT STYLING RULES:
- Use very simple, precise, and easy-to-understand English.
- NEVER write dense paragraphs. Every single sentence or point MUST be separated by a double newline (blank line).
- Use bullet points abundantly to make it highly readable.
- If the user provided no answer, simply state "No answer provided" and move on instead of writing a huge dense paragraph about what they missed. Keep it clean.
At the very end of your report, provide a final score on a scale of 0 to 100 in the exact format: [SCORE: 85]`;

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${(import.meta as any).env.VITE_OPENROUTER_API_KEY || process.env.API_KEY || ''}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [{ role: 'user', content: systemInstruction }],
          max_tokens: 2000
        })
      });

      if (!res.ok) throw new Error("API failed");
      const data = await res.json();
      const report = data.choices?.[0]?.message?.content || "Could not generate report.";
      setTextReport(report);

      const match = report.match(/\[SCORE:\s*(\d+)\]/i);
      let parsedScore = match ? parseInt(match[1]) : Math.floor(Math.random() * (100 - 60 + 1) + 60);

      if (selectedCompany) {
        storageService.saveMockInterviewScore(selectedCompany.id, parsedScore);
        setProgress(storageService.getCareerProgress());
      }
      setTimer(timerRef.current);
      // Resolved React state bug: setMockState('finished') is kept in the try block (not finally)
      // to avoid overwriting setMockState('idle') in the catch block on completions request failures.
      setMockState('finished');
    } catch (err) {
      console.error(err);
      showToast({ message: t('careerMode.reports.aiUnavailable'), type: "error" });
      setTextReport(t('careerMode.reports.errorGeneratingTextReport'));
      setMockState('idle');
      setIsFullScreen(false);
    } finally {
      setIsGeneratingText(false);
    }
  }, [selectedCompany, editorLanguage, mockQuestions, mockAnswers, setProgress, showToast]);

  // --- VOICE INTERVIEW LOGIC ---
  const startVoiceInterview = useCallback(() => {
    if (!selectedCompany) return;
    setMockState('active_voice');
    setVoiceStatus('speaking');
    setTurnCount(1);
    setVoiceReport("");
    timerRef.current = 2700;
    setTimer(2700); // 45 minutes
    setExtraTimeUsed(0);
    setCurrentSpeech("");
    currentSpeechRef.current = "";
    setIsFullScreen(true);

    const userName = auth.currentUser?.displayName || 'candidate';
    const timeOfDay = getTimeOfDay();

    // Hardcode the first greeting to guarantee it plays
    const interviewerName = voiceTypeRef.current === 'robin' ? 'Robin' : 'Elisa';
    const greetingMsg = `Good ${timeOfDay}, ${userName}! I am ${interviewerName}, your interviewer. Let's start our interview. Could you please introduce yourself and tell me about your most recent project?`;

    setChatHistory([{ role: 'assistant', content: greetingMsg }]);

    setTimeout(() => {
      speakQuestionRef.current(greetingMsg);
    }, 500);
  }, [selectedCompany]);

  const generateAIResponse = useCallback(async (history: any[]) => {
    setVoiceStatus('generating');
    const interviewerName = voiceTypeRef.current === 'robin' ? 'Robin' : 'Elisa';
    const systemPrompt = `You are ${interviewerName}, a Senior Engineer at ${selectedCompany?.name} conducting a verbal technical interview.
    If the user gives a wrong answer, gently push back and ask them to reconsider.
    Use simple, precise, and highly conversational English.
    Use conversational filler words like 'um', 'hmm', and 'I see' so you sound human when your text is spoken via TTS.
    Keep your responses short, under 50 words, just like a real verbal conversation.
    Ask one question or follow-up at a time. Do not use Markdown styling.`;

    const cleanHistory = history.filter(h => h.role !== 'system');
    const apiMessages = [{ role: 'system', content: systemPrompt }, ...cleanHistory];

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${(import.meta as any).env.VITE_OPENROUTER_API_KEY || process.env.API_KEY || ''}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: apiMessages,
          max_tokens: 150
        })
      });

      if (!res.ok) throw new Error("API failed");
      const data = await res.json();
      const aiText = data.choices?.[0]?.message?.content || t('careerMode.timer.fallbackSpeech');

      const updatedHistory = [...history, { role: 'assistant', content: aiText }];
      setChatHistory(updatedHistory);
      setTurnCount(prev => prev + 1);

      speakQuestionRef.current(aiText);
    } catch (err) {
      console.error(err);
      showToast({ message: "AI is currently unavailable, please try again or check your API key settings.", type: "error" });
      setMockState('idle');
      setIsFullScreen(false);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) { }
      }
      if (synthRef.current) {
        try { synthRef.current.cancel(); } catch (e) { }
      }
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    }
  }, [selectedCompany, showToast]);

  const speakQuestion = useCallback((text: string) => {
    setVoiceStatus('speaking');
    if (synthRef.current) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);

      const voices = synthRef.current.getVoices();
      if (voiceTypeRef.current === 'robin') {
        const maleVoice = voices.find(v => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('guy') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('mark') || v.name.toLowerCase().includes('google uk english male'));
        if (maleVoice) utterance.voice = maleVoice;
      } else {
        const femaleVoice = voices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('girl') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('woman') || v.name.toLowerCase().includes('hazel') || v.name.toLowerCase().includes('victoria')) || voices.find(v => v.lang.startsWith('en') && !v.name.toLowerCase().includes('male') && !v.name.toLowerCase().includes('guy') && !v.name.toLowerCase().includes('david'));
        if (femaleVoice) utterance.voice = femaleVoice;
      }

      utterance.onend = () => {
        startListeningRef.current();
      };
      synthRef.current.speak(utterance);
    } else {
      startListeningRef.current();
    }
  }, []);

  const startListening = useCallback(() => {
    setVoiceStatus('listening');
    setCurrentSpeech("");
    currentSpeechRef.current = "";

    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setCurrentSpeech(t('careerMode.timer.speechNotSupported'));
      return;
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) { }
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;

    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = setTimeout(() => {
      speakQuestionRef.current("Are you there? Take your time, let me know if you need me to repeat the question.");
    }, 60000); // 60 second idle detection

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
      }
      if (finalTranscript) {
        setCurrentSpeech(prev => {
          const updated = prev + " " + finalTranscript;
          currentSpeechRef.current = updated.trim();
          return updated.trim();
        });
      }
      // Reset silence timer on any audio activity
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        stopListeningAndSubmitRef.current();
      }, 3000);
    };

    recognition.onerror = (event: any) => console.error("Speech recognition error", event.error);
    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  const stopListeningAndSubmit = useCallback(async (forceEnd = false) => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) { }
    }
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

    const finalSpeech = currentSpeechRef.current;

    if (!finalSpeech.trim() && !forceEnd) {
      startListeningRef.current();
      return;
    }

    setVoiceStatus('generating');

    setChatHistory(prevHistory => {
      const newHistory = finalSpeech.trim() ? [...prevHistory, { role: 'user', content: finalSpeech }] : prevHistory;

      setTimeout(() => {
        if (turnCount >= 10 || forceEnd) {
          generateVoiceReportRef.current(newHistory);
        } else {
          generateAIResponseRef.current(newHistory);
        }
      }, 0);

      return newHistory;
    });

    setCurrentSpeech("");
    currentSpeechRef.current = "";
  }, [turnCount]);

  const generateVoiceReport = useCallback(async (history: any[]) => {
    const userName = auth.currentUser?.displayName || 'candidate';
    const transcriptText = history.map(h => `${h.role === 'user' ? userName : 'Robin'}: ${h.content}`).join('\n\n');

    const systemInstruction = `You are Robin, an expert HR Interviewer and Senior Engineer.
Analyze the following transcript of a real-time mock interview with candidate ${userName}.
Please provide a brutally honest, highly technical Markdown report.
IMPORTANT STYLING RULES:
- Use very simple, precise, and easy-to-understand English.
- NEVER write dense paragraphs. Every single sentence or point MUST be separated by a double newline (blank line).
- Use bullet points abundantly to make it highly readable.
Your report MUST include:
1. **Overall Performance**: Summary of how they did.
2. **Technical Accuracy**: Did their answers make sense for the coding/system design questions?
3. **Communication**: Assess their verbal clarity and structure.
4. **Key Strengths**: What they did well.
5. **Areas for Improvement**: What they need to work on.

Transcript:
${transcriptText}`;

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${(import.meta as any).env.VITE_OPENROUTER_API_KEY || process.env.API_KEY || ''}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [{ role: 'user', content: systemInstruction }],
          max_tokens: 1500
        })
      });

      if (!res.ok) throw new Error("API failed");
      const data = await res.json();
      const report = data.choices?.[0]?.message?.content || "Could not generate report.";
      setVoiceReport(report);
      // Resolved React state bug: setMockState('finished_voice') is kept in the try block (not finally)
      // to avoid overwriting setMockState('idle') in the catch block on completions request failures.
      setMockState('finished_voice');
      if (selectedCompany) {
        storageService.saveMockInterviewScore(selectedCompany.id, Math.floor(Math.random() * (100 - 70 + 1) + 70));
        setProgress(storageService.getCareerProgress());
      }
    } catch (err) {
      console.error(err);
      showToast({ message: "AI is currently unavailable, please try again or check your API key settings.", type: "error" });
      setVoiceReport(t('careerMode.reports.errorGeneratingVoiceReport'));
      setMockState('idle');
      setIsFullScreen(false);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) { }
      }
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    }
  }, [selectedCompany, showToast, progress]);

  // Assign ref implementations on every render to ensure they capture latest closure state
  speakQuestionRef.current = speakQuestion;
  startListeningRef.current = startListening;
  stopListeningAndSubmitRef.current = stopListeningAndSubmit;
  generateAIResponseRef.current = generateAIResponse;
  generateVoiceReportRef.current = generateVoiceReport;

  // Timer handleTimeUp callback
  const handleTimeUp = useCallback(() => {
    if (mockState === 'active') finishMockInterview();
    if (mockState === 'active_voice') stopListeningAndSubmitRef.current(true);
  }, [mockState, finishMockInterview]);

  // Fetch Live Firestore Companies
  useEffect(() => {
    const fetchLiveCompanies = async () => {
      try {
        const liveData = await firestoreService.getCompanies();
        setCompaniesList(liveData);
      } catch (error) {
        console.error("Error fetching live companies from Firestore:", error);
      } finally {
        setTimeout(() => {
          setIsLoadingCompanies(false);
        }, 1000);
      }
    };
    fetchLiveCompanies();
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedCompany) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      if (synthRef.current) synthRef.current.cancel();
      if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch (e) { } }
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    }
    return () => {
      document.body.style.overflow = 'unset';
      if (synthRef.current) synthRef.current.cancel();
      if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch (e) { } }
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, [selectedCompany]);



  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  // Readiness Score Calculation
  const totalQuestions = companiesList.reduce((acc, c) => acc + c.questions.length, 0);
  const totalPracticed = progress.practicedQuestions.length;
  const readinessScore = Math.round((totalPracticed / (totalQuestions || 1)) * 100);

  // Filter Companies
  const filteredCompanies = companiesList.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));




  if (showReviewQueue) {
    return (
      <div className="space-y-8 animate-fade-in pb-20">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
               <button 
                 onClick={() => setSearchParams({})} 
                 className="flex items-center gap-2 text-primaryLight font-bold text-sm mb-2 hover:underline"
               >
                  &larr; {t('careerMode.reviewQueue.backToCompanies')}
               </button>
               <h2 className="text-3xl font-display font-bold text-textMain flex items-center gap-2">
                  <Clock size={28} className="text-orange-500" />
                  {t('careerMode.reviewQueue.title')}
               </h2>
               <p className="text-textMuted mt-1">{t('careerMode.reviewQueue.description')}</p>
            </div>
         </div>

         <div className="bg-glass border border-black/20 dark:border-white/10 rounded-3xl p-6 md:p-8">
            {dueQuestions.length > 0 ? (
               <div className="space-y-4 max-w-4xl">
                  <p className="text-sm text-textMuted mb-4">
                     {t('careerMode.reviewQueue.instructions')}
                  </p>
                  {dueQuestions.map(({ question, company }) => (
                     <div key={question.id} className="relative">
                        <div className="absolute top-4 right-12 bg-primary/10 text-primaryLight text-[10px] px-2 py-0.5 rounded border border-primary/20 font-bold uppercase z-10">
                           {company.name}
                        </div>
                        <QuestionItem 
                          question={question}
                          isPracticed={progress.practicedQuestions.includes(question.id)}
                          isSaved={progress.savedQuestions.includes(question.id)}
                          onTogglePractice={handleTogglePractice}
                          onToggleSave={handleToggleSave}
                          srsData={progress.srsData?.[question.id]}
                          onSrsUpdate={handleSrsUpdate}
                        />
                     </div>
                  ))}
               </div>
            ) : (
               <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 text-emerald-500">
                     <CheckCircle size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-textMain mb-2">{t('careerMode.reviewQueue.caughtUpTitle')}</h3>
                  <p className="text-textMuted max-w-md mx-auto mb-6">
                     {t('careerMode.reviewQueue.caughtUpDescription')}
                  </p>
                  <button 
                    onClick={() => setSearchParams({})}
                    className="px-6 py-2.5 bg-gradient-main text-white rounded-lg font-medium transition-all"
                  >
                     {t('careerMode.reviewQueue.exploreCompanies')}
                  </button>
               </div>
            )}
         </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8 pb-20 relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] rounded-full bg-emerald-500/10 blur-[100px]" />
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primaryLight text-xs font-bold uppercase tracking-wider mb-4 border border-primary/20">
            <Briefcase size={14} /> {t('careerMode.header.badge')}
          </div>
          <h1 className="text-4xl font-display font-bold text-textMain mb-2">{t('careerMode.header.title')}</h1>
          <p className="text-textMuted max-w-xl">
            {t('careerMode.header.description')}
          </p>
        </div>

        <div className="flex items-center gap-6 bg-glass border border-black/20 dark:border-white/10 p-4 rounded-2xl w-full md:w-auto justify-between md:justify-start">
          <div className="text-right">
            <div className="text-xs text-textMuted uppercase font-bold tracking-wider mb-1">{t('careerMode.header.readiness')}</div>
            <div className="text-sm font-medium text-textMain">{totalPracticed} / {totalQuestions} {t('careerMode.header.questionsLabel')}</div>
          </div>
          <ReadinessScore percentage={readinessScore} />
        </div>
      </div>

{/* Search Bar */}
<div className="relative max-w-md group">
  <Search
    className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted group-focus-within:text-primaryLight transition-colors"
    size={20}
  />
  <input
    type="text"
    placeholder={t('careerMode.roleSearchFilters.placeholder')}
    aria-label={t('careerMode.roleSearchFilters.label')}
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full bg-gradient-input border border-primary/20 dark:border-primary/20 rounded-xl py-3 pl-12 pr-4 text-black placeholder-textMuted focus:outline-none focus:border-primaryLight focus:ring-1 focus:ring-primaryLight transition-all"
  />
</div>

{/* Recommended Companies */}
{!isLoadingCompanies && recommendedCompanies.length > 0 && (
  <div>
    <h3 className="text-lg font-bold text-textMain mb-4 flex items-center gap-2">
      <span className="w-2 h-5 rounded-full bg-primaryLight" />
      {t('careerMode.companyCards.recommendedTitle')}
    </h3>

    <div className="flex gap-4 overflow-x-auto pb-2">
      {recommendedCompanies.map(company => (
        <div
          key={company.id}
          onClick={() => handleSelectCompany(company)}
          className="group flex-shrink-0 w-64 bg-glass hover:bg-glass-hover border border-black/5 dark:border-white/20 rounded-2xl p-4 cursor-pointer hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-lg bg-white border border-black/5 p-1.5 shrink-0 flex items-center justify-center overflow-hidden">
            <img
              src={company.logo}
              alt={company.name}
              className="w-full h-full object-contain"
              loading="lazy"
              width={40}
              height={40}
            />
          </div>

          <div className="min-w-0">
            <h4 className="text-sm font-bold text-textMain truncate group-hover:text-primaryLight transition-colors">
              {company.name}
            </h4>
            <p className="text-xs text-textMuted truncate">
              {company.focus.join(', ')}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

      {/* Company Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoadingCompanies ? (
          [...Array(8)].map((_, idx) => (
            <div
              key={idx}
              className="bg-glass border border-black/20 dark:border-white/10 rounded-2xl p-4 sm:p-6 animate-pulse flex flex-col"
            >
              <div className="flex items-start justify-between gap-4 mb-5 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-white/10" />
                <div className="h-6 w-20 rounded-full bg-white/10" />
              </div>
              <div className="h-6 w-3/4 rounded bg-white/10 mb-3" />
              <div className="h-4 w-full rounded bg-white/10 mb-2" />
              <div className="h-4 w-5/6 rounded bg-white/10 mb-6 flex-1" />
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-textMuted">
                  <div className="h-4 w-16 rounded bg-white/10" />
                  <div className="h-4 w-10 rounded bg-white/10" />
                </div>
                <div className="h-2 rounded-full bg-white/10" />
              </div>
            </div>
          ))
        ) : filteredCompanies.length > 0 ? (
          filteredCompanies.map(company => (
            <CompanyCard
              key={company.id}
              company={company}
              progress={progress}
              onClick={handleSelectCompany}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-textMuted">
            {t('careerMode.companyCards.emptyState')}
          </div>
        )}
      </div>

      {/* COMPANY MODAL - Uses Portal to escape sidebar stacking context */}
      {selectedCompany && createPortal(
        <div className={`fixed inset-0 z-[9999] flex items-center justify-center text-textMain ${isFullScreen ? 'p-0' : 'p-4 sm:p-6'}`}>
          {/* Backdrop: Adaptive Light/Dark */}
          <div className="absolute inset-0 bg-white/90 dark:bg-[#0B1220]/90 backdrop-blur-md animate-fade-in" onClick={() => setSelectedCompany(null)} />

          {/* Modal Content: Adaptive Light/Dark */}
          <div className={`relative z-10 bg-background border border-black/20 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col animate-fade-in-up transition-all duration-300 ${isFullScreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl h-[85vh] md:h-[90vh] rounded-2xl md:rounded-3xl'}`}>

            {/* Floating Close Buttons in FullScreen */}
            {isFullScreen && (
              <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
                <button onClick={() => setIsFullScreen(false)} className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full bg-black/5 dark:bg-white/5 backdrop-blur-md transition-colors shrink-0" title={t('careerMode.modal.exitFullscreen')} aria-label={t('careerMode.modal.exitFullscreen')}>
                  <Minimize2 size={20} className="text-textMuted hover:text-textMain md:w-6 md:h-6" />
                </button>
                <button onClick={handleExitInterview} className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full bg-black/5 dark:bg-white/5 backdrop-blur-md transition-colors shrink-0" title={t('careerMode.modal.closeModal')} aria-label={t('careerMode.modal.closeModal')}>
                  <X size={20} className="text-textMuted hover:text-textMain md:w-6 md:h-6" />
                </button>
              </div>
            )}

            {/* Modal Header (Hidden in FullScreen) */}
            {!isFullScreen && (
              <div className="shrink-0 p-5 md:p-8 border-b border-black/20 dark:border-white/10 bg-white dark:bg-gradient-to-r dark:from-[#1E293B] dark:to-[#0B1220] flex items-center justify-between">
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-white border border-black/20 p-3 shadow-lg shrink-0 flex items-center justify-center overflow-hidden">
                    <img src={selectedCompany.logo} alt={selectedCompany.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-3xl font-display font-bold text-textMain mb-1 md:mb-2">{selectedCompany.name}</h2>
                    <div className="flex flex-wrap gap-2">
                      {selectedCompany.focus.map(f => (
                        <span key={f} className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[10px] md:text-xs text-textMuted border border-black/20 dark:border-white/10 whitespace-nowrap">{f}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsFullScreen(!isFullScreen)} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors shrink-0" title={isFullScreen ? t('careerMode.modal.exitFullscreen') : t('careerMode.modal.toggleFullscreen')} aria-label={t('careerMode.modal.toggleFullscreen')}>
                    {isFullScreen ? <Minimize2 size={20} className="text-textMuted hover:text-textMain md:w-6 md:h-6" /> : <Maximize2 size={20} className="text-textMuted hover:text-textMain md:w-6 md:h-6" />}
                  </button>
                  <button onClick={handleExitInterview} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors shrink-0" title={t('careerMode.modal.closeModal')} aria-label={t('careerMode.modal.closeModal')}>
                    <X size={20} className="text-textMuted hover:text-textMain md:w-6 md:h-6" />
                  </button>
                </div>
              </div>
            )}

            {/* Mock Interview - Active Mode Overlay */}
            {mockState === 'active' ? (
              <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden overflow-y-auto">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-black/5 dark:bg-white/10">
                  <div className={`h-full bg-primaryLight transition-all duration-1000 ${getPercentClass(((currentMockIndex + 1) / 5) * 100)}`} />
                </div>

                <div className="absolute top-6 left-6 md:left-8 flex items-center gap-4">
                  <InterviewTimer
                    initialTime={9000}
                    extraTimeSeconds={extraTimeUsed * 60}
                    mockState={mockState}
                    onTimeUp={handleTimeUp}
                    timerRef={timerRef}
                  />

                  <button
                    onClick={() => handleRequestTime()}
                    disabled={extraTimeUsed >= 30}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${extraTimeUsed >= 30 ? 'bg-black/5 dark:bg-white/5 border-transparent text-textMuted cursor-not-allowed' : 'bg-black/5 dark:bg-white/10 border-black/20 dark:border-white/20 text-textMain hover:bg-primary/20 hover:text-primaryLight hover:border-primary/30 backdrop-blur-sm'}`}
                  >
                    {t('careerMode.timer.requestTime', { interviewer: 'Robin' })}
                  </button>
                </div>

                <div className="max-w-3xl w-full mt-16 md:mt-0">
                  {isGeneratingText ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 animate-fade-in text-center">
                      <Loader2 size={64} className="text-primaryLight animate-spin" />
                      <h3 className="text-2xl font-bold text-textMain">{t('careerMode.timer.analyzingCode')}</h3>
                      <p className="text-textMuted text-lg max-w-md">{t('careerMode.timer.analysisDescription')}</p>
                    </div>
                  ) : (
                    <>
                      <div className="text-center mb-6 md:mb-8">
                        <span className="text-textMuted uppercase tracking-widest text-xs font-bold">{t('careerMode.timer.questionProgress', { current: currentMockIndex + 1, total: 5 })}</span>
                        <h3 className="text-lg md:text-2xl font-bold text-textMain mt-4 leading-relaxed min-h-[4rem]">
                          <Typewriter text={mockQuestions[currentMockIndex]?.title || ''} speed={50} />
                        </h3>
                      </div>

                      <div className="bg-white dark:bg-[#1E1E1E] border border-black/20 dark:border-white/10 rounded-2xl p-4 min-h-[400px] h-[50vh] mb-6 md:mb-8 relative group shadow-sm flex flex-col">
                        <div className="flex justify-end mb-2">
                          <select
                            value={editorLanguage}
                            onChange={(e) => setEditorLanguage(e.target.value)}
                            className="bg-black/5 dark:bg-white/10 border border-black/20 dark:border-white/20 rounded-lg text-xs md:text-sm font-bold text-textMain px-4 py-2 focus:ring-2 focus:ring-primaryLight outline-none cursor-pointer backdrop-blur-sm shadow-sm appearance-none hover:bg-black/10 dark:hover:bg-white/20 transition-all"
                          >
                            <option value="javascript" className="bg-background text-textMain">{t('careerMode.editor.languages.javascript')}</option>
                            <option value="python" className="bg-background text-textMain">{t('careerMode.editor.languages.python')}</option>
                            <option value="java" className="bg-background text-textMain">{t('careerMode.editor.languages.java')}</option>
                            <option value="cpp" className="bg-background text-textMain">{t('careerMode.editor.languages.cpp')}</option>
                            <option value="typescript" className="bg-background text-textMain">{t('careerMode.editor.languages.typescript')}</option>
                          </select>
                        </div>
                        <div className="flex-1 w-full rounded-xl overflow-hidden border border-black/20 dark:border-white/5">
                          <Editor
                            height="100%"
                            language={editorLanguage}
                            theme={document.documentElement.classList.contains('dark') ? 'vs-dark' : 'light'}
                            value={mockAnswers[currentMockIndex] || ''}
                            onChange={(value) => {
                              const newA = [...mockAnswers];
                              newA[currentMockIndex] = value || '';
                              setMockAnswers(newA);
                            }}
                            options={editorOptions}
                          />
                        </div>
                      </div>

                      <div className="flex justify-center gap-4">
                        {currentMockIndex < 4 ? (
                          <button
                            onClick={() => setCurrentMockIndex(prev => prev + 1)}
                            className="px-6 py-3 md:px-8 bg-black/5 dark:bg-white text-textMain dark:text-[#0B1220] rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 text-sm md:text-base"
                          >
                            {t('careerMode.timer.nextQuestion')} <ArrowRight size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={finishMockInterview}
                            className="px-6 py-3 md:px-8 bg-gradient-main text-white rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2 text-sm md:text-base"
                          >
                            {t('careerMode.timer.finishInterview')} <CheckCircle size={18} />
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : mockState === 'active_voice' ? (
              <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden overflow-y-auto">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-black/5 dark:bg-white/10">
                  <div className={`h-full bg-gradient-main transition-all duration-1000 ${getPercentClass((turnCount / 10) * 100)}`} />
                </div>

                <div className="absolute top-6 left-6 md:left-8 flex items-center gap-4">
                  <InterviewTimer
                    initialTime={2700}
                    extraTimeSeconds={extraTimeUsed * 60}
                    mockState={mockState}
                    onTimeUp={handleTimeUp}
                    timerRef={timerRef}
                  />

                  <button
                    onClick={() => handleRequestTime()}
                    disabled={extraTimeUsed >= 30}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${extraTimeUsed >= 30 ? 'bg-black/5 dark:bg-white/5 border-transparent text-textMuted cursor-not-allowed' : 'bg-black/5 dark:bg-white/10 border-black/20 dark:border-white/20 text-textMain hover:bg-primary/20 hover:text-primaryLight hover:border-primary/30 backdrop-blur-sm'}`}
                  >
                    {t('careerMode.timer.requestTime', { interviewer: voiceType === 'robin' ? 'Robin' : 'Elisa' })}
                  </button>
                </div>

                <div className="max-w-3xl w-full mt-16 md:mt-0 flex flex-col items-center">
                  <div className="text-center mb-10">
                    <span className="text-textMuted uppercase tracking-widest text-xs font-bold">{t('careerMode.timer.voiceTurnProgress', { current: turnCount, total: 10 })}</span>
                    <VoiceChat chatHistory={chatHistory} />
                  </div>

                  {voiceStatus === 'generating' ? (
                    <div className="flex flex-col items-center gap-4 animate-fade-in">
                      <Loader2 size={48} className="text-primaryLight animate-spin" />
                      <p className="text-textMuted text-lg">{t('careerMode.timer.aiThinking')}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center w-full max-w-xl">
                      {/* Visualizer / Mic indicator */}
                      <div className="relative mb-8">
                        {voiceStatus === 'listening' && (
                          <>
                            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping scale-150"></div>
                            <div className="absolute inset-0 bg-primary/40 rounded-full animate-pulse scale-110"></div>
                          </>
                        )}
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center relative z-10 transition-colors duration-500 ${voiceStatus === 'listening' ? 'bg-gradient-main text-white shadow-lg shadow-primary/40' : 'bg-black/5 dark:bg-white/10 text-textMuted'}`}>
                          {voiceStatus === 'listening' ? <Mic size={40} /> : <Volume2 size={40} className="animate-pulse" />}
                        </div>
                      </div>

                      <div className="bg-black/5 dark:bg-white/5 border border-black/20 dark:border-white/10 rounded-2xl p-6 w-full min-h-[150px] mb-8 relative">
                        <div className="text-xs text-textMuted uppercase tracking-wider mb-2 font-bold flex items-center gap-2"><User size={14} /> {t('careerMode.modal.yourAnswer')}</div>
                        <p className="text-textMain text-lg italic">
                          {currentSpeech || (voiceStatus === 'listening' ? t('careerMode.timer.listeningStatus') : t('careerMode.timer.waitingStatus'))}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <button
                          onClick={handleEndInterviewEarly}
                          className="px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 bg-black/5 dark:bg-white/10 hover:bg-red-500/10 hover:text-red-500 text-textMuted"
                        >
                          {t('careerMode.timer.endInterviewEarly')}
                        </button>
                        <button
                          onClick={handleSendNowOverride}
                          disabled={voiceStatus !== 'listening'}
                          className={`px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${voiceStatus !== 'listening' ? 'bg-black/10 text-textMuted cursor-not-allowed' : 'bg-gradient-main text-white hover:shadow-lg hover:shadow-primary/30 hover:scale-105'}`}
                        >
                          {t('careerMode.timer.sendNowOverride')} <ArrowRight size={20} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : mockState === 'finished_voice' ? (
              <div className="flex-1 flex flex-col items-center p-4 md:p-8 relative overflow-hidden overflow-y-auto w-full custom-scrollbar">
                <div className="w-full max-w-4xl mx-auto flex flex-col items-center animate-fade-in-up pt-10">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center mb-6 shadow-xl">
                    <Sparkles size={32} className="text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-textMain mb-2 text-center">{t('careerMode.reports.aiInterviewReport')}</h2>
                  <p className="text-textMuted mb-8 text-center">{t('careerMode.reports.aiInterviewDescription')}</p>

                  <div className="w-full bg-black/5 dark:bg-[#0B1220]/50 border border-black/20 dark:border-white/10 p-6 md:p-10 rounded-3xl text-left prose prose-invert max-w-none mb-10 shadow-inner overflow-hidden">
                    <ReactMarkdown>{voiceReport}</ReactMarkdown>
                  </div>

                  <button
                    onClick={handleBackToStudy}
                    className="px-10 py-4 bg-black/5 dark:bg-white/10 border border-black/20 dark:border-white/20 hover:bg-black/10 dark:hover:bg-white/20 text-textMain dark:text-white rounded-xl font-bold transition-all shadow-md mb-10"
                  >
                    Back to Study Mode
                  </button>
                </div>
              </div>
            ) : mockState === 'finished' ? (
              <div className="flex-1 flex flex-col items-center p-4 md:p-8 relative overflow-hidden overflow-y-auto w-full custom-scrollbar">
                <div className="w-full max-w-4xl mx-auto flex flex-col items-center animate-fade-in-up pt-10">
                  <Confetti />
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mb-6 shadow-2xl animate-fade-in-up">
                    <Award size={40} className="text-white md:w-12 md:h-12" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-textMain mb-2 text-center animate-fade-in-up">{t('careerMode.reports.technicalEvaluation')}</h2>
                  <p className="text-textMuted mb-8 text-center animate-fade-in-up [animation-delay:200ms]">{t('careerMode.reports.technicalEvaluationDescription')}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8 w-full max-w-xl animate-fade-in-up [animation-delay:400ms]">
                    <div className="bg-black/5 dark:bg-white/5 border border-black/20 dark:border-white/10 p-4 rounded-xl text-center">
                      <div className="text-2xl font-bold text-textMain">{formatTime(timer)}</div>
                      <div className="text-xs text-textMuted uppercase tracking-wider">{t('careerMode.timer.totalTime')}</div>
                    </div>
                    <div className="bg-black/5 dark:bg-white/5 border border-black/20 dark:border-white/10 p-4 rounded-xl text-center">
                      <div className="text-2xl font-bold text-primaryLight">5/5</div>
                      <div className="text-xs text-textMuted uppercase tracking-wider">{t('careerMode.timer.questions')}</div>
                    </div>
                  </div>

                  <div className="w-full bg-black/5 dark:bg-[#0B1220]/50 border border-black/20 dark:border-white/10 p-6 md:p-10 rounded-3xl text-left prose prose-invert prose-emerald max-w-none mb-10 shadow-inner overflow-hidden">
                    <ReactMarkdown>{textReport}</ReactMarkdown>
                  </div>

                  <button
                    onClick={handleBackToStudy}
                    className="px-10 py-4 bg-black/5 dark:bg-white/10 border border-black/20 dark:border-white/20 hover:bg-black/10 dark:hover:bg-white/20 text-textMain dark:text-white rounded-xl font-bold transition-all shadow-md mb-10"
                  >
                    Back to Study Mode
                  </button>
                </div>
              </div>
            ) : (
              // Standard View (Tabs)
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex border-b border-black/20 dark:border-white/10 px-4 md:px-8">
                  <button
                    onClick={() => setActiveTab('study')}
                    className={`py-3 md:py-4 px-4 md:px-6 font-bold border-b-2 transition-colors text-sm md:text-base ${activeTab === 'study' ? 'border-primaryLight text-primaryLight' : 'border-transparent text-textMuted hover:text-textMain'}`}
                  >
                    {t('careerMode.standardView.studyQuestions')}
                  </button>
                  <button
                    onClick={() => setActiveTab('mock')}
                    className={`py-3 md:py-4 px-4 md:px-6 font-bold border-b-2 transition-colors text-sm md:text-base ${activeTab === 'mock' ? 'border-primaryLight text-primaryLight' : 'border-transparent text-textMuted hover:text-textMain'}`}
                  >
                    {t('careerMode.standardView.mockInterview')}
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                  {activeTab === 'study' ? (
                    <div className="max-w-4xl mx-auto space-y-4">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg md:text-xl text-textMain">{t('careerMode.standardView.questionBank')}</h3>
                        <div className="text-sm text-textMuted">
                          {t('careerMode.standardView.practiced', { practiced: selectedCompany.questions.filter(q => progress.practicedQuestions.includes(q.id)).length, total: selectedCompany.questions.length })}
                        </div>
                      </div>

                      {selectedCompany.questions.map(question => (
                        <QuestionItem
                          key={question.id}
                          question={question}
                          isPracticed={progress.practicedQuestions.includes(question.id)}
                          isSaved={progress.savedQuestions.includes(question.id)}
                          onTogglePractice={handleTogglePractice}
                          onToggleSave={handleToggleSave}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="min-h-full flex flex-col items-center justify-center max-w-4xl mx-auto text-center py-12">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-pulse-slow shrink-0 mt-auto">
                        <Clock size={32} className="text-primaryLight md:w-10 md:h-10" />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-textMain mb-4">{t('careerMode.standardView.chooseModeTitle')}</h3>
                      <p className="text-textMuted mb-8 leading-relaxed px-4 max-w-2xl">
                        {t('careerMode.standardView.chooseModeDescription')}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full px-4 mb-10">
                        {/* Option 1: Standard Text */}
                        <div className="bg-black/5 dark:bg-white/5 border border-black/20 dark:border-white/10 p-6 rounded-2xl flex flex-col h-full hover:border-primaryLight/50 transition-colors">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><Briefcase size={24} /></div>
                            <h4 className="text-xl font-bold text-textMain text-left">{t('careerMode.standardView.standardTechnical')}</h4>
                          </div>
                          <p className="text-sm text-textMuted text-left mb-6 flex-1">
                            {t('careerMode.standardView.standardTechnicalDescription', { companyName: selectedCompany.name })}
                          </p>
                          <button
                            onClick={startMockInterview}
                            className="w-full py-3 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-textMain rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                          >
                            <PlayCircle size={18} /> {t('careerMode.standardView.startTextInterview')}
                          </button>
                        </div>

                        {/* Option 2: AI Voice */}
                        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 p-6 rounded-2xl flex flex-col h-full hover:shadow-lg hover:shadow-primary/20 transition-all relative overflow-hidden">
                          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-[40px] pointer-events-none"></div>
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-3 bg-gradient-main text-white rounded-xl shadow-lg shadow-primary/20"><Mic size={24} /></div>
                              <h4 className="text-xl font-bold text-textMain text-left">{t('careerMode.standardView.aiVoiceInterview')}</h4>
                            </div>
                            <span className="px-2 py-1 bg-gradient-main text-white text-[10px] font-bold uppercase rounded-full shadow-lg">{t('careerMode.standardView.newBadge')}</span>
                          </div>
                          <p className="text-sm text-textMuted text-left mb-6 flex-1">
                            {t('careerMode.standardView.aiVoiceDescription')}
                          </p>
                          <button
                            onClick={() => setShowVoiceSelectModal(true)}
                            className="w-full py-3 bg-gradient-main text-white rounded-xl font-bold shadow-lg hover:shadow-primary/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                          >
                            <Sparkles size={18} /> {t('careerMode.standardView.startVoiceInterview')}
                          </button>
                        </div>
                      </div>

                      <div className="mt-auto"></div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Voice Select Modal (Rendered inside the portal to be on top) */}
            {showVoiceSelectModal && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowVoiceSelectModal(false)}></div>
                <div
                  ref={voiceSelectModalRef}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="voice-select-title"
                  tabIndex={-1}
                  className="relative bg-glass border border-black/20 dark:border-white/20 p-8 rounded-3xl max-w-lg w-full text-center animate-fade-in-up shadow-2xl"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Mic size={32} className="text-primaryLight" />
                  </div>
                  <h3 id="voice-select-title" className="text-2xl font-bold text-textMain mb-2">{t('careerMode.modal.chooseInterviewer')}</h3>
                  <p className="text-textMuted mb-8">{t('careerMode.modal.selectPersona')}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => { setVoiceType('robin'); voiceTypeRef.current = 'robin'; setShowVoiceSelectModal(false); startVoiceInterview(); }}
                      className="flex flex-col items-center p-6 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/20 dark:border-white/10 hover:border-primaryLight/50 rounded-2xl transition-all group"
                    >
                      <span className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">👨</span>
                      <span className="font-bold text-textMain text-lg">Robin</span>
                      <span className="text-xs text-textMuted mt-1">{t('careerMode.modal.maleVoice')}</span>
                    </button>

                    <button
                      onClick={() => { setVoiceType('elisa'); voiceTypeRef.current = 'elisa'; setShowVoiceSelectModal(false); startVoiceInterview(); }}
                      className="flex flex-col items-center p-6 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/20 dark:border-white/10 hover:border-primaryLight/50 rounded-2xl transition-all group"
                    >
                      <span className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">👩</span>
                      <span className="font-bold text-textMain text-lg">Elisa</span>
                      <span className="text-xs text-textMuted mt-1">{t('careerMode.modal.femaleVoice')}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
