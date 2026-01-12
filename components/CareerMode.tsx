import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Briefcase, Search, CheckCircle, Clock, 
  ExternalLink, ChevronDown, ChevronRight, X, 
  PlayCircle, Timer, Award, Zap, Heart, Sparkles,
  BarChart, ArrowRight
} from 'lucide-react';
import { COMPANIES } from '../constants';
import { storageService } from '../services/storageService';
import { Company, InterviewQuestion, CareerProgress } from '../types';

// --- ANIMATION COMPONENTS ---

const Confetti: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: '-10px',
          backgroundColor: ['#6968A6', '#CF9893', '#6EE7B7', '#F5C97A'][Math.floor(Math.random() * 4)],
          animation: `fall ${2 + Math.random() * 2}s linear forwards`,
          animationDelay: `${Math.random() * 0.5}s`
        }}
      />
    ))}
    <style>{`
      @keyframes fall {
        to { transform: translateY(100vh) rotate(360deg); opacity: 0; }
      }
    `}</style>
  </div>
);

const ReadinessScore: React.FC<{ percentage: number }> = ({ percentage }) => {
  // Color Transition Logic
  const color = percentage < 30 ? '#EF4444' : percentage < 70 ? '#F59E0B' : '#10B981';

  return (
    <div className="relative flex items-center justify-center w-32 h-32 md:w-32 md:h-32 group shrink-0">
       <div className="flex flex-col items-center justify-center text-center z-10">
          <span className="text-4xl md:text-5xl font-bold text-textMain leading-none" style={{ color }}>{percentage}%</span>
          <span className="text-xs text-textMuted uppercase tracking-wider mt-2 font-bold">Ready</span>
       </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const CompanyCard: React.FC<{ company: Company; progress: CareerProgress; onClick: () => void }> = ({ company, progress, onClick }) => {
  const practicedCount = company.questions.filter(q => progress.practicedQuestions.includes(q.id)).length;
  const progressPercent = Math.round((practicedCount / company.questions.length) * 100);

  return (
    <div 
      onClick={onClick}
      className="group bg-glass border border-black/5 dark:border-white/20 rounded-2xl p-6 cursor-pointer hover:bg-glass-hover hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 relative overflow-hidden"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="w-16 h-16 rounded-xl bg-white border border-black/5 p-3 shadow-lg group-hover:scale-110 transition-transform duration-500 flex items-center justify-center overflow-hidden">
           <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border
           ${company.difficulty === 'Moderate' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
             company.difficulty === 'Hard' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
             'bg-red-500/10 text-red-500 border-red-500/20'}
        `}>
           {company.difficulty}
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-textMain mb-2 group-hover:text-primaryLight transition-colors">{company.name}</h3>
      <p className="text-sm text-textMuted mb-6 line-clamp-2">{company.description}</p>
      
      <div className="space-y-2">
         <div className="flex justify-between text-xs font-medium text-textMuted">
            <span>Progress</span>
            <span className={progressPercent === 100 ? 'text-success' : ''}>{practicedCount}/{company.questions.length}</span>
         </div>
         <div className="h-2 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-main rounded-full transition-all duration-1000" 
              style={{ width: `${progressPercent}%` }}
            />
         </div>
      </div>
    </div>
  );
};

const QuestionItem: React.FC<{ question: InterviewQuestion; isPracticed: boolean; isSaved: boolean; onTogglePractice: () => void; onToggleSave: () => void }> = ({ question, isPracticed, isSaved, onTogglePractice, onToggleSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showXp, setShowXp] = useState(false);

  const handlePractice = () => {
    if (!isPracticed) {
      setShowXp(true);
      setTimeout(() => setShowXp(false), 2000);
    }
    onTogglePractice();
  };

  return (
    <div className="border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 rounded-xl overflow-hidden transition-all duration-300 hover:border-primary/20 hover:bg-black/10 dark:hover:bg-white/10">
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
               +25 XP
             </div>
           )}
         </button>

         <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 mb-2">
               <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase whitespace-nowrap
                  ${question.difficulty === 'Easy' ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' : 
                    question.difficulty === 'Medium' ? 'text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 border-yellow-500/20' : 
                    'text-red-500 bg-red-500/10 border-red-500/20'}
               `}>{question.difficulty}</span>
               {question.tags.map(tag => (
                 <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-textMuted border border-black/5 dark:border-white/5 whitespace-nowrap">{tag}</span>
               ))}
            </div>
            <h4 className="font-bold text-textMain text-sm md:text-base pr-2 truncate md:whitespace-normal">{question.title}</h4>
         </div>

         <div className="flex flex-col gap-2 shrink-0">
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleSave(); }}
              className={`p-1 hover:scale-110 transition-transform ${isSaved ? 'text-primaryLight fill-primaryLight' : 'text-textMuted hover:text-textMain'}`}
            >
               <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
            </button>
            <ChevronDown size={18} className={`text-textMuted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
         </div>
      </div>

      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
         <div className="p-4 pt-0 border-t border-black/5 dark:border-white/5">
            <div className="mt-4 prose dark:prose-invert prose-sm max-w-none text-textMuted">
               <div dangerouslySetInnerHTML={{ __html: question.answer }} />
            </div>
            <div className="mt-4 flex justify-end">
               <a 
                 href={question.resourceLink} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="flex items-center gap-2 text-primaryLight text-xs font-bold hover:underline"
               >
                 View Full Solution <ExternalLink size={12} />
               </a>
            </div>
         </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

export const CareerMode: React.FC = () => {
  const [progress, setProgress] = useState<CareerProgress>(storageService.getCareerProgress());
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [activeTab, setActiveTab] = useState<'study' | 'mock'>('study');
  
  // Mock Interview State
  const [mockState, setMockState] = useState<'idle' | 'active' | 'finished'>('idle');
  const [mockQuestions, setMockQuestions] = useState<InterviewQuestion[]>([]);
  const [currentMockIndex, setCurrentMockIndex] = useState(0);
  const [timer, setTimer] = useState(0); // seconds
  const [mockAnswers, setMockAnswers] = useState<string[]>([]); // dummy text answers

  // Search Filter
  const [search, setSearch] = useState('');

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (mockState === 'active') {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [mockState]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedCompany) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedCompany]);

  const handleTogglePractice = (qId: string) => {
    const newProgress = storageService.toggleQuestionPractice(qId);
    setProgress(newProgress);
  };

  const handleToggleSave = (qId: string) => {
    const newProgress = storageService.toggleQuestionSave(qId);
    setProgress(newProgress);
  };

  const startMockInterview = () => {
    if (!selectedCompany) return;
    // Shuffle and pick 5 random questions
    const shuffled = [...selectedCompany.questions].sort(() => 0.5 - Math.random());
    setMockQuestions(shuffled.slice(0, 5));
    setMockState('active');
    setTimer(0);
    setCurrentMockIndex(0);
    setMockAnswers([]);
  };

  const finishMockInterview = () => {
    setMockState('finished');
    if (selectedCompany) {
       // Random realistic score for demo
       const score = Math.floor(Math.random() * (100 - 60 + 1) + 60); 
       storageService.saveMockInterviewScore(selectedCompany.id, score);
       // Refresh progress
       setProgress(storageService.getCareerProgress());
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  // Readiness Score Calculation
  const totalQuestions = COMPANIES.reduce((acc, c) => acc + c.questions.length, 0);
  const totalPracticed = progress.practicedQuestions.length;
  const readinessScore = Math.round((totalPracticed / (totalQuestions || 1)) * 100);

  // Filter Companies
  const filteredCompanies = COMPANIES.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

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
                <Briefcase size={14} /> Career Mode Beta
             </div>
             <h1 className="text-4xl font-display font-bold text-textMain mb-2">Interview Prep</h1>
             <p className="text-textMuted max-w-xl">
                Target specific companies, practice real questions, and simulate high-pressure interview environments.
             </p>
          </div>
          
          <div className="flex items-center gap-6 bg-glass border border-black/5 dark:border-white/10 p-4 rounded-2xl w-full md:w-auto justify-between md:justify-start">
             <div className="text-right">
                <div className="text-xs text-textMuted uppercase font-bold tracking-wider mb-1">Overall Readiness</div>
                <div className="text-sm font-medium text-textMain">{totalPracticed} / {totalQuestions} Questions</div>
             </div>
             <ReadinessScore percentage={readinessScore} />
          </div>
       </div>

       {/* Search Bar */}
       <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" size={20} />
          <input 
            type="text" 
            placeholder="Search companies (e.g. Google, Amazon)..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-glass border border-black/5 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-textMain placeholder-textMuted focus:border-primaryLight focus:outline-none transition-all"
          />
       </div>

       {/* Company Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCompanies.map(company => (
            <CompanyCard 
              key={company.id} 
              company={company} 
              progress={progress}
              onClick={() => { setSelectedCompany(company); setActiveTab('study'); setMockState('idle'); }} 
            />
          ))}
       </div>

       {/* COMPANY MODAL - Uses Portal to escape sidebar stacking context */}
       {selectedCompany && createPortal(
         <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 text-textMain">
            {/* Backdrop: Adaptive Light/Dark */}
            <div className="absolute inset-0 bg-white/90 dark:bg-[#0B1220]/90 backdrop-blur-md animate-fade-in" onClick={() => setSelectedCompany(null)} />
            
            {/* Modal Content: Adaptive Light/Dark */}
            <div className="relative z-10 w-full max-w-6xl h-[85vh] md:h-[90vh] bg-background border border-black/10 dark:border-white/10 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-fade-in-up transition-colors duration-300">
               
               {/* Modal Header */}
               <div className="shrink-0 p-5 md:p-8 border-b border-black/10 dark:border-white/10 bg-white dark:bg-gradient-to-r dark:from-[#1E293B] dark:to-[#0B1220] flex items-center justify-between">
                  <div className="flex items-center gap-4 md:gap-6">
                     <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-white border border-black/5 p-3 shadow-lg shrink-0 flex items-center justify-center overflow-hidden">
                        <img src={selectedCompany.logo} alt={selectedCompany.name} className="w-full h-full object-contain" />
                     </div>
                     <div>
                        <h2 className="text-xl md:text-3xl font-display font-bold text-textMain mb-1 md:mb-2">{selectedCompany.name}</h2>
                        <div className="flex flex-wrap gap-2">
                           {selectedCompany.focus.map(f => (
                             <span key={f} className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[10px] md:text-xs text-textMuted border border-black/5 dark:border-white/10 whitespace-nowrap">{f}</span>
                           ))}
                        </div>
                     </div>
                  </div>
                  <button onClick={() => setSelectedCompany(null)} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors shrink-0">
                     <X size={20} className="text-textMuted hover:text-textMain md:w-6 md:h-6" />
                  </button>
               </div>

               {/* Mock Interview - Active Mode Overlay */}
               {mockState === 'active' ? (
                 <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden overflow-y-auto">
                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-black/5 dark:bg-white/10">
                       <div className="h-full bg-primaryLight transition-all duration-1000" style={{ width: `${((currentMockIndex) / 5) * 100}%` }} />
                    </div>

                    <div className="absolute top-6 right-6 md:right-8 flex items-center gap-2 font-mono text-lg md:text-xl text-primaryLight animate-pulse">
                       <Timer /> {formatTime(timer)}
                    </div>

                    <div className="max-w-3xl w-full mt-10 md:mt-0">
                       <div className="text-center mb-6 md:mb-8">
                          <span className="text-textMuted uppercase tracking-widest text-xs font-bold">Question {currentMockIndex + 1} of 5</span>
                          <h3 className="text-xl md:text-4xl font-bold text-textMain mt-4 leading-tight">
                             {mockQuestions[currentMockIndex]?.title}
                          </h3>
                       </div>
                       
                       <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-4 md:p-6 min-h-[200px] mb-6 md:mb-8 relative group shadow-sm">
                          <textarea 
                            className="w-full h-full bg-transparent border-none focus:ring-0 text-textMain resize-none placeholder-textMuted/50 text-sm md:text-base"
                            placeholder="Type your notes or approach here (optional)..."
                          />
                          <div className="absolute bottom-4 right-4 text-xs text-textMuted opacity-50">Drafting Space</div>
                       </div>

                       <div className="flex justify-center gap-4">
                          {currentMockIndex < 4 ? (
                            <button 
                              onClick={() => setCurrentMockIndex(prev => prev + 1)}
                              className="px-6 py-3 md:px-8 bg-black/5 dark:bg-white text-textMain dark:text-[#0B1220] rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 text-sm md:text-base"
                            >
                              Next Question <ArrowRight size={18} />
                            </button>
                          ) : (
                            <button 
                              onClick={finishMockInterview}
                              className="px-6 py-3 md:px-8 bg-gradient-main text-white rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2 text-sm md:text-base"
                            >
                              Finish Interview <CheckCircle size={18} />
                            </button>
                          )}
                       </div>
                    </div>
                 </div>
               ) : mockState === 'finished' ? (
                 <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 text-center relative overflow-hidden overflow-y-auto">
                    <Confetti />
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mb-6 shadow-2xl animate-fade-in-up">
                       <Award size={40} className="text-white md:w-12 md:h-12" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-textMain mb-2 animate-fade-in-up">Interview Complete!</h2>
                    <p className="text-textMuted mb-8 animate-fade-in-up [animation-delay:200ms]">You simulated a real pressure environment.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-10 w-full max-w-2xl animate-fade-in-up [animation-delay:400ms]">
                       <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-xl">
                          <div className="text-xl md:text-2xl font-bold text-textMain">{formatTime(timer)}</div>
                          <div className="text-xs text-textMuted uppercase tracking-wider">Total Time</div>
                       </div>
                       <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-xl">
                          <div className="text-xl md:text-2xl font-bold text-primaryLight">5/5</div>
                          <div className="text-xs text-textMuted uppercase tracking-wider">Questions</div>
                       </div>
                       <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-xl">
                          <div className="text-xl md:text-2xl font-bold text-success">+50 XP</div>
                          <div className="text-xs text-textMuted uppercase tracking-wider">Earned</div>
                       </div>
                    </div>

                    <button 
                      onClick={() => { setMockState('idle'); setActiveTab('study'); }}
                      className="px-8 py-3 bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 hover:bg-black/10 dark:hover:bg-white/20 text-textMain dark:text-white rounded-xl font-bold transition-all"
                    >
                      Back to Study Mode
                    </button>
                 </div>
               ) : (
                 // Standard View (Tabs)
                 <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex border-b border-black/10 dark:border-white/10 px-4 md:px-8">
                       <button 
                         onClick={() => setActiveTab('study')}
                         className={`py-3 md:py-4 px-4 md:px-6 font-bold border-b-2 transition-colors text-sm md:text-base ${activeTab === 'study' ? 'border-primaryLight text-primaryLight' : 'border-transparent text-textMuted hover:text-textMain'}`}
                       >
                         Study Questions
                       </button>
                       <button 
                         onClick={() => setActiveTab('mock')}
                         className={`py-3 md:py-4 px-4 md:px-6 font-bold border-b-2 transition-colors text-sm md:text-base ${activeTab === 'mock' ? 'border-primaryLight text-primaryLight' : 'border-transparent text-textMuted hover:text-textMain'}`}
                       >
                         Mock Interview
                       </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                       {activeTab === 'study' ? (
                          <div className="max-w-4xl mx-auto space-y-4">
                             <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-lg md:text-xl text-textMain">Question Bank</h3>
                                <div className="text-sm text-textMuted">
                                   {selectedCompany.questions.filter(q => progress.practicedQuestions.includes(q.id)).length} / {selectedCompany.questions.length} Practiced
                                </div>
                             </div>
                             
                             {selectedCompany.questions.map(question => (
                               <QuestionItem 
                                 key={question.id} 
                                 question={question} 
                                 isPracticed={progress.practicedQuestions.includes(question.id)}
                                 isSaved={progress.savedQuestions.includes(question.id)}
                                 onTogglePractice={() => handleTogglePractice(question.id)}
                                 onToggleSave={() => handleToggleSave(question.id)}
                               />
                             ))}
                          </div>
                       ) : (
                          <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center py-8">
                             <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-pulse-slow">
                                <Clock size={32} className="text-primaryLight md:w-10 md:h-10" />
                             </div>
                             <h3 className="text-2xl md:text-3xl font-bold text-textMain mb-4">Ready to test yourself?</h3>
                             <p className="text-textMuted mb-8 leading-relaxed px-4">
                                You will be given <strong>5 random questions</strong> from {selectedCompany.name}'s pool. 
                                There is no time limit, but we will track your speed. Treat this like a real interview.
                             </p>
                             <ul className="text-left space-y-3 mb-10 bg-black/5 dark:bg-white/5 p-6 rounded-2xl border border-black/10 dark:border-white/10 mx-4">
                                <li className="flex items-center gap-3 text-sm text-textMain"><CheckCircle size={16} className="text-success" /> 5 Randomly selected questions</li>
                                <li className="flex items-center gap-3 text-sm text-textMain"><CheckCircle size={16} className="text-success" /> Difficulty mix (Easy - Hard)</li>
                                <li className="flex items-center gap-3 text-sm text-textMain"><CheckCircle size={16} className="text-success" /> Instant performance summary</li>
                             </ul>
                             <button 
                               onClick={startMockInterview}
                               className="px-8 py-3 md:px-10 md:py-4 bg-gradient-main text-white rounded-xl font-bold text-base md:text-lg shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all flex items-center gap-2"
                             >
                                <PlayCircle size={20} /> Start Mock Interview
                             </button>
                          </div>
                       )}
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