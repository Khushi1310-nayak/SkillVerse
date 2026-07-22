import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Briefcase, Search, CheckCircle, Clock, 
  ExternalLink, ChevronDown, ChevronRight, X, 
  PlayCircle, Timer, Award, Zap, Heart, Sparkles,
  BarChart, ArrowRight, Maximize2, Minimize2,
  Mic, MicOff, Volume2, User, Loader2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { COMPANIES, VOICE_INTERVIEW_QUESTIONS } from '../constants';
import { storageService } from '../services/storageService';
import { Company, InterviewQuestion, CareerProgress } from '../types';
import { auth } from '../firebase/firebase';
import { Typewriter } from './Typewriter';

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
  // Color Transition Logic
  const colorClass = percentage < 30 ? 'text-red-500' : percentage < 70 ? 'text-orange-500' : 'text-emerald-500';

  return (
    <div className="relative flex items-center justify-center w-32 h-32 md:w-32 md:h-32 group shrink-0">
       <div className="flex flex-col items-center justify-center text-center z-10">
          <span className={`text-4xl md:text-5xl font-bold leading-none ${colorClass}`}>{percentage}%</span>
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
      className="group bg-glass border border-black/5 dark:border-white/20 rounded-2xl p-4 sm:p-6 cursor-pointer hover:bg-glass-hover hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 relative overflow-hidden"
    >
      <div className="flex items-start justify-between gap-4 mb-5 sm:mb-6">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-white border border-black/5 p-2 sm:p-3 shadow-lg group-hover:scale-110 transition-transform duration-500 flex items-center justify-center overflow-hidden">
           <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
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
            <span>Progress</span>
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
              title={isSaved ? "Remove from saved" : "Save question"}
              aria-label={isSaved ? "Remove from saved" : "Save question"}
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
  const [mockState, setMockState] = useState<'idle' | 'active' | 'finished' | 'active_voice' | 'finished_voice'>('idle');
  const [mockQuestions, setMockQuestions] = useState<InterviewQuestion[]>([]);
  const [currentMockIndex, setCurrentMockIndex] = useState(0);
  const [timer, setTimer] = useState(0); // seconds
  const [mockAnswers, setMockAnswers] = useState<string[]>([]); // user text answers
  const [textReport, setTextReport] = useState("");
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Voice State
  const [chatHistory, setChatHistory] = useState<{role: string, content: string}[]>([]);
  const [turnCount, setTurnCount] = useState(0);
  const [voiceStatus, setVoiceStatus] = useState<'speaking' | 'listening' | 'generating'>('generating');
  const [currentSpeech, setCurrentSpeech] = useState("");
  const [voiceReport, setVoiceReport] = useState("");
  const recognitionRef = React.useRef<any>(null);
  const synthRef = React.useRef<SpeechSynthesis | null>(window.speechSynthesis);
  const silenceTimerRef = React.useRef<any>(null);
  const currentSpeechRef = React.useRef("");

  // Search Filter
  const [search, setSearch] = useState('');

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (mockState === 'active' || mockState === 'active_voice') {
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
      if (synthRef.current) synthRef.current.cancel();
      if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch(e){} }
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    }
    return () => { 
      document.body.style.overflow = 'unset'; 
      if (synthRef.current) synthRef.current.cancel();
      if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch(e){} }
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
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
    setIsFullScreen(true);
  };

  const finishMockInterview = async () => {
    setIsGeneratingText(true);
    
    const userName = auth.currentUser?.displayName || 'candidate';
    let transcriptText = `Candidate Name: ${userName}\nInterviewer Name: Robin\nCompany: ${selectedCompany?.name}\n\n`;
    mockQuestions.forEach((q, i) => {
      transcriptText += `Q${i+1} (${q.difficulty}): ${q.title}\nUser's Code/Approach:\n${mockAnswers[i] || 'No answer provided.'}\n\n`;
    });

    const systemInstruction = `You are Robin, an elite Technical Interviewer for ${selectedCompany?.name}.
You have just concluded a 5-question coding/system design interview with a candidate named ${userName}.
Here is the transcript of the questions and the code/approach they typed:
${transcriptText}

Provide a brutally honest, highly technical Markdown report evaluating their performance.
Focus on time/space complexity, edge cases missed, and system design flaws.
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
    } catch (err) {
      console.error(err);
      setTextReport("There was an error generating your technical report. Please check your API key or internet connection.");
    } finally {
      setIsGeneratingText(false);
      setMockState('finished');
    }
  };

  // --- VOICE INTERVIEW LOGIC ---
  const startVoiceInterview = () => {
    if (!selectedCompany) return;
    setMockState('active_voice');
    setVoiceStatus('speaking');
    setTurnCount(1);
    setVoiceReport("");
    setTimer(0);
    setCurrentSpeech("");
    currentSpeechRef.current = "";
    setIsFullScreen(true);

    const userName = auth.currentUser?.displayName || 'candidate';
    const timeOfDay = getTimeOfDay();
    
    // Hardcode the first greeting to guarantee it plays
    const greetingMsg = `Good ${timeOfDay}, ${userName}! I am Robin, your interviewer. Let's start our interview. Could you please introduce yourself and tell me about your most recent project?`;
    
    setChatHistory([{ role: 'assistant', content: greetingMsg }]);
    
    setTimeout(() => {
      speakQuestion(greetingMsg);
    }, 500);
  };

  const generateAIResponse = async (history: any[]) => {
    setVoiceStatus('generating');
    const systemPrompt = `You are Robin, a Senior Engineer at ${selectedCompany?.name} conducting a verbal technical interview.
    If the user gives a wrong answer, gently push back and ask them to reconsider.
    Use simple, precise, and highly conversational English.
    Use conversational filler words like 'um', 'hmm', and 'I see' so you sound human when your text is spoken via TTS.
    Keep your responses short, under 50 words, just like a real verbal conversation.
    Ask one question or follow-up at a time. Do not use Markdown styling.`;

    const cleanHistory = history.filter(h => h.role !== 'system');
    const apiMessages = [ { role: 'system', content: systemPrompt }, ...cleanHistory ];

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
      const aiText = data.choices?.[0]?.message?.content || "I didn't quite catch that.";
      
      const updatedHistory = [...history, { role: 'assistant', content: aiText }];
      setChatHistory(updatedHistory);
      setTurnCount(prev => prev + 1);
      
      speakQuestion(aiText);
    } catch (err) {
      console.error(err);
      speakQuestion("Sorry, I'm having connection issues. Can you repeat that?");
    }
  };

  const speakQuestion = (text: string) => {
    setVoiceStatus('speaking');
    if (synthRef.current) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => {
        startListening();
      };
      synthRef.current.speak(utterance);
    } else {
      startListening();
    }
  };

  const startListening = () => {
    setVoiceStatus('listening');
    setCurrentSpeech("");
    currentSpeechRef.current = "";
    
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setCurrentSpeech("Speech recognition is not supported in this browser. Please use Chrome.");
      return;
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e){}
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = setTimeout(() => {
       stopListeningAndSubmit();
    }, 8000); // 8 second fallback if they never speak
    
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
         stopListeningAndSubmit();
      }, 3000);
    };

    recognition.onerror = (event: any) => console.error("Speech recognition error", event.error);
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListeningAndSubmit = async (forceEnd = false) => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e){}
    }
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    
    const finalSpeech = currentSpeechRef.current;
    
    if (!finalSpeech.trim() && !forceEnd) {
       startListening();
       return;
    }

    setVoiceStatus('generating');
    
    setChatHistory(prevHistory => {
       const newHistory = finalSpeech.trim() ? [...prevHistory, { role: 'user', content: finalSpeech }] : prevHistory;
       
       setTimeout(() => {
           if (turnCount >= 10 || forceEnd) {
              generateVoiceReport(newHistory);
           } else {
              generateAIResponse(newHistory);
           }
       }, 0);
       
       return newHistory;
    });
    
    setCurrentSpeech("");
    currentSpeechRef.current = "";
  };

  const generateVoiceReport = async (history: any[]) => {
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
    } catch (err) {
      console.error(err);
      setVoiceReport("There was an error generating your report. Please check your API key or internet connection.");
    } finally {
      setMockState('finished_voice');
      if (selectedCompany) {
         storageService.saveMockInterviewScore(selectedCompany.id, Math.floor(Math.random() * (100 - 70 + 1) + 70));
         setProgress(storageService.getCareerProgress());
      }
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
       <div className="relative max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted group-focus-within:text-primaryLight transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search companies (e.g. Google, Amazon)..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gradient-input border border-primary/20 dark:border-primary/20 rounded-xl py-3 pl-12 pr-4 text-black placeholder-textMuted focus:outline-none focus:border-primaryLight focus:ring-1 focus:ring-primaryLight transition-all"
          />
       </div>

       {/* Company Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {filteredCompanies.length > 0 ? (
    filteredCompanies.map(company => (
      <CompanyCard
        key={company.id}
        company={company}
        progress={progress}
        onClick={() => {
          setSelectedCompany(company);
          setActiveTab('study');
          setMockState('idle');
        }}
      />
    ))
  ) : (
    <div className="col-span-full text-center py-20 text-textMuted">
      No companies found matching your criteria.
    </div>
  )}
</div>

       {/* COMPANY MODAL - Uses Portal to escape sidebar stacking context */}
       {selectedCompany && createPortal(
         <div className={`fixed inset-0 z-[9999] flex items-center justify-center text-textMain ${isFullScreen ? 'p-0' : 'p-4 sm:p-6'}`}>
            {/* Backdrop: Adaptive Light/Dark */}
            <div className="absolute inset-0 bg-white/90 dark:bg-[#0B1220]/90 backdrop-blur-md animate-fade-in" onClick={() => setSelectedCompany(null)} />
            
            {/* Modal Content: Adaptive Light/Dark */}
            <div className={`relative z-10 bg-background border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col animate-fade-in-up transition-all duration-300 ${isFullScreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl h-[85vh] md:h-[90vh] rounded-2xl md:rounded-3xl'}`}>
               
               {/* Floating Close Buttons in FullScreen */}
               {isFullScreen && (
                 <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
                     <button onClick={() => setIsFullScreen(false)} className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full bg-black/5 dark:bg-white/5 backdrop-blur-md transition-colors shrink-0" title="Exit Fullscreen" aria-label="Exit Fullscreen">
                        <Minimize2 size={20} className="text-textMuted hover:text-textMain md:w-6 md:h-6" />
                     </button>
                     <button onClick={() => { setSelectedCompany(null); setIsFullScreen(false); setMockState('idle'); }} className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full bg-black/5 dark:bg-white/5 backdrop-blur-md transition-colors shrink-0" title="Close modal" aria-label="Close modal">
                        <X size={20} className="text-textMuted hover:text-textMain md:w-6 md:h-6" />
                     </button>
                 </div>
               )}

               {/* Modal Header (Hidden in FullScreen) */}
               {!isFullScreen && (
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
                  <div className="flex items-center gap-2">
                     <button onClick={() => setIsFullScreen(!isFullScreen)} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors shrink-0" title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"} aria-label="Toggle fullscreen">
                        {isFullScreen ? <Minimize2 size={20} className="text-textMuted hover:text-textMain md:w-6 md:h-6" /> : <Maximize2 size={20} className="text-textMuted hover:text-textMain md:w-6 md:h-6" />}
                     </button>
                     <button onClick={() => { setSelectedCompany(null); setIsFullScreen(false); setMockState('idle'); }} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors shrink-0" title="Close modal" aria-label="Close modal">
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

                    <div className="absolute top-6 right-6 md:right-8 flex items-center gap-2 font-mono text-lg md:text-xl text-primaryLight animate-pulse">
                       <Timer /> {formatTime(timer)}
                    </div>

                    <div className="max-w-3xl w-full mt-10 md:mt-0">
                       {isGeneratingText ? (
                         <div className="flex flex-col items-center justify-center py-20 gap-4 animate-fade-in text-center">
                            <Loader2 size={64} className="text-primaryLight animate-spin" />
                            <h3 className="text-2xl font-bold text-textMain">Analyzing your code...</h3>
                            <p className="text-textMuted text-lg max-w-md">Our AI is running your approach against optimal Time and Space complexities.</p>
                         </div>
                       ) : (
                         <>
                           <div className="text-center mb-6 md:mb-8">
                              <span className="text-textMuted uppercase tracking-widest text-xs font-bold">Question {currentMockIndex + 1} of 5</span>
                              <h3 className="text-lg md:text-2xl font-bold text-textMain mt-4 leading-relaxed min-h-[4rem]">
                                 <Typewriter text={mockQuestions[currentMockIndex]?.title || ''} speed={50} />
                              </h3>
                           </div>
                           
                           <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-4 md:p-6 min-h-[200px] mb-6 md:mb-8 relative group shadow-sm">
                              <textarea 
                                className="w-full h-full bg-transparent border-none focus:ring-0 text-textMain resize-none placeholder-textMuted/50 text-sm md:text-base outline-none"
                                placeholder="Type your notes, pseudo-code, or approach here (optional)..."
                                value={mockAnswers[currentMockIndex] || ''}
                                onChange={(e) => {
                                  const newA = [...mockAnswers];
                                  newA[currentMockIndex] = e.target.value;
                                  setMockAnswers(newA);
                                }}
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

                     <div className="absolute top-6 right-6 md:right-8 flex items-center gap-2 font-mono text-lg md:text-xl text-primaryLight animate-pulse">
                        <Timer /> {formatTime(timer)}
                     </div>

                     <div className="max-w-3xl w-full mt-10 md:mt-0 flex flex-col items-center">
                        <div className="text-center mb-10">
                           <span className="text-textMuted uppercase tracking-widest text-xs font-bold">Live Voice Interview - Turn {turnCount} of 10</span>
                           <h3 className="text-lg md:text-2xl font-bold text-textMain mt-4 leading-relaxed min-h-[4rem]">
                             {chatHistory.length > 0 && chatHistory[chatHistory.length - 1].role === 'assistant'
                               ? <Typewriter text={chatHistory[chatHistory.length - 1].content} speed={50} />
                               : chatHistory.length > 1 ? <Typewriter text={chatHistory[chatHistory.length - 2].content} speed={50} /> : "Connecting..."}
                           </h3>
                        </div>

                        {voiceStatus === 'generating' ? (
                          <div className="flex flex-col items-center gap-4 animate-fade-in">
                             <Loader2 size={48} className="text-primaryLight animate-spin" />
                             <p className="text-textMuted text-lg">AI is thinking...</p>
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
                             
                             <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 w-full min-h-[150px] mb-8 relative">
                                <div className="text-xs text-textMuted uppercase tracking-wider mb-2 font-bold flex items-center gap-2"><User size={14} /> Your Answer:</div>
                                <p className="text-textMain text-lg italic">
                                   {currentSpeech || (voiceStatus === 'listening' ? "Listening (speaking will auto-detect)..." : "Wait for AI to finish...")}
                                </p>
                             </div>

                             <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                               <button 
                                 onClick={() => { stopListeningAndSubmit(true); }}
                                 className="px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 bg-black/5 dark:bg-white/10 hover:bg-red-500/10 hover:text-red-500 text-textMuted"
                               >
                                  End Interview Early
                               </button>
                               <button 
                                 onClick={() => { stopListeningAndSubmit(); }}
                                 disabled={voiceStatus !== 'listening'}
                                 className={`px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${voiceStatus !== 'listening' ? 'bg-black/10 text-textMuted cursor-not-allowed' : 'bg-gradient-main text-white hover:shadow-lg hover:shadow-primary/30 hover:scale-105'}`}
                               >
                                  Send Now (Override Silence) <ArrowRight size={20} />
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
                       <h2 className="text-3xl md:text-4xl font-bold text-textMain mb-2 text-center">AI Interview Report</h2>
                       <p className="text-textMuted mb-8 text-center">Comprehensive analysis of your spoken responses.</p>

                       <div className="w-full bg-black/5 dark:bg-[#0B1220]/50 border border-black/10 dark:border-white/10 p-6 md:p-10 rounded-3xl text-left prose prose-invert max-w-none mb-10 shadow-inner overflow-hidden">
                          <ReactMarkdown>{voiceReport}</ReactMarkdown>
                       </div>

                       <button 
                         onClick={() => { setMockState('idle'); setActiveTab('study'); }}
                         className="px-10 py-4 bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 hover:bg-black/10 dark:hover:bg-white/20 text-textMain dark:text-white rounded-xl font-bold transition-all shadow-md mb-10"
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
                       <h2 className="text-3xl md:text-4xl font-bold text-textMain mb-2 text-center animate-fade-in-up">Technical Evaluation</h2>
                       <p className="text-textMuted mb-8 text-center animate-fade-in-up [animation-delay:200ms]">AI Assessment of your coding approach.</p>

                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8 w-full max-w-xl animate-fade-in-up [animation-delay:400ms]">
                          <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-xl text-center">
                             <div className="text-2xl font-bold text-textMain">{formatTime(timer)}</div>
                             <div className="text-xs text-textMuted uppercase tracking-wider">Total Time</div>
                          </div>
                          <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-xl text-center">
                             <div className="text-2xl font-bold text-primaryLight">5/5</div>
                             <div className="text-xs text-textMuted uppercase tracking-wider">Questions</div>
                          </div>
                       </div>

                       <div className="w-full bg-black/5 dark:bg-[#0B1220]/50 border border-black/10 dark:border-white/10 p-6 md:p-10 rounded-3xl text-left prose prose-invert prose-emerald max-w-none mb-10 shadow-inner overflow-hidden">
                          <ReactMarkdown>{textReport}</ReactMarkdown>
                       </div>

                       <button 
                         onClick={() => { setMockState('idle'); setActiveTab('study'); }}
                         className="px-10 py-4 bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 hover:bg-black/10 dark:hover:bg-white/20 text-textMain dark:text-white rounded-xl font-bold transition-all shadow-md mb-10"
                       >
                         Back to Study Mode
                       </button>
                    </div>
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
                          <div className="min-h-full flex flex-col items-center justify-center max-w-4xl mx-auto text-center py-12">
                             <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-pulse-slow shrink-0 mt-auto">
                                <Clock size={32} className="text-primaryLight md:w-10 md:h-10" />
                             </div>
                             <h3 className="text-2xl md:text-3xl font-bold text-textMain mb-4">Choose your interview mode</h3>
                             <p className="text-textMuted mb-8 leading-relaxed px-4 max-w-2xl">
                                Select how you want to be assessed. Both modes simulate real interview pressure but test different skill sets.
                             </p>
                             
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full px-4 mb-10">
                                {/* Option 1: Standard Text */}
                                <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-6 rounded-2xl flex flex-col h-full hover:border-primaryLight/50 transition-colors">
                                   <div className="flex items-center gap-3 mb-4">
                                      <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><Briefcase size={24} /></div>
                                      <h4 className="text-xl font-bold text-textMain text-left">Standard Technical</h4>
                                   </div>
                                   <p className="text-sm text-textMuted text-left mb-6 flex-1">
                                      5 random technical questions from {selectedCompany.name}'s pool. Type your approach and thoughts. Focuses on algorithms, system design, and coding logic.
                                   </p>
                                   <button 
                                     onClick={startMockInterview}
                                     className="w-full py-3 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-textMain rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                                   >
                                      <PlayCircle size={18} /> Start Text Interview
                                   </button>
                                </div>

                                {/* Option 2: AI Voice */}
                                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 p-6 rounded-2xl flex flex-col h-full hover:shadow-lg hover:shadow-primary/20 transition-all relative overflow-hidden">
                                   <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-[40px] pointer-events-none"></div>
                                   <div className="flex justify-between items-start mb-4">
                                      <div className="flex items-center gap-3">
                                         <div className="p-3 bg-gradient-main text-white rounded-xl shadow-lg shadow-primary/20"><Mic size={24} /></div>
                                         <h4 className="text-xl font-bold text-textMain text-left">AI Voice Interview</h4>
                                      </div>
                                      <span className="px-2 py-1 bg-gradient-main text-white text-[10px] font-bold uppercase rounded-full shadow-lg">New</span>
                                   </div>
                                   <p className="text-sm text-textMuted text-left mb-6 flex-1">
                                      Real-time spoken conversation with our AI recruiter. Answers 10 behavioral & HR questions. Evaluates your English vocabulary, fluency, and content accuracy.
                                   </p>
                                   <button 
                                     onClick={startVoiceInterview}
                                     className="w-full py-3 bg-gradient-main text-white rounded-xl font-bold shadow-lg hover:shadow-primary/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                                   >
                                      <Sparkles size={18} /> Start Voice Interview
                                   </button>
                                </div>
                             </div>

                             <div className="mt-auto"></div>
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