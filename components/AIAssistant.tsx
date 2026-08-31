import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, X, Send, Sparkles, User, Loader2, ChevronDown, ChevronUp, Bookmark, BookmarkCheck } from 'lucide-react';
import { COURSES, COMPANIES, CATEGORIES } from '../constants';
import { storageService } from '../services/storageService';
import { useToast } from '../contexts/ToastContext';

interface AIAssistantProps {
  courseContext: string;
  courseTitle: string;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

/**
 * Cute AI Mascot Logo Component
 * Renders the high-res 3D avatar with an automated, zero-failure SVG vector fallback.
 */
export const AIMascotLogo: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => {
  const [imgError, setImgError] = useState(false);

  if (!imgError) {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden shadow-md ring-1.5 ring-white/30 bg-[#0E1322] ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src="/ai-bot-avatar.png"
          alt="SkillVerse AI Tutor"
          className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-300 rounded-full"
          onError={() => setImgError(true)}
          width={size}
          height={size}
        />
      </div>
    );
  }

  // Cute SVG Vector Robot Mascot Fallback
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 rounded-full bg-[#0E1322] ${className}`}
      aria-label="SkillVerse AI Mascot"
    >
      <defs>
        <linearGradient id="aiBodyGrad" x1="12" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8A89C0" />
          <stop offset="0.5" stopColor="#6968A6" />
          <stop offset="1" stopColor="#4F46E5" />
        </linearGradient>
        <linearGradient id="aiVisorGrad" x1="16" y1="20" x2="48" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0B132B" />
          <stop offset="1" stopColor="#1C2541" />
        </linearGradient>
        <linearGradient id="aiEyeGlow" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#38BDF8" />
          <stop offset="1" stopColor="#06B6D4" />
        </linearGradient>
      </defs>

      {/* Head / Body Base */}
      <rect x="12" y="14" width="40" height="36" rx="16" fill="url(#aiBodyGrad)" stroke="#A5B4FC" strokeWidth="2" />

      {/* Antennas */}
      <line x1="20" y1="14" x2="16" y2="6" stroke="#8A89C0" strokeWidth="3" strokeLinecap="round" />
      <circle cx="15" cy="5" r="4" fill="#38BDF8" className="animate-pulse" />
      <line x1="44" y1="14" x2="48" y2="6" stroke="#8A89C0" strokeWidth="3" strokeLinecap="round" />
      <circle cx="49" cy="5" r="4" fill="#38BDF8" className="animate-pulse" />

      {/* Ears / Headphone dials */}
      <rect x="7" y="24" width="6" height="16" rx="3" fill="#A5B4FC" />
      <rect x="51" y="24" width="6" height="16" rx="3" fill="#A5B4FC" />

      {/* Glass Face Screen */}
      <rect x="17" y="20" width="30" height="24" rx="10" fill="url(#aiVisorGrad)" stroke="#38BDF8" strokeWidth="1.5" strokeOpacity="0.4" />

      {/* Cute Glowing Eyes */}
      <circle cx="26" cy="30" r="4.5" fill="url(#aiEyeGlow)" />
      <circle cx="27.5" cy="28.5" r="1.5" fill="#FFFFFF" />

      <circle cx="38" cy="30" r="4.5" fill="url(#aiEyeGlow)" />
      <circle cx="39.5" cy="28.5" r="1.5" fill="#FFFFFF" />

      {/* Cute Cheeks */}
      <circle cx="22" cy="36" r="2" fill="#F472B6" fillOpacity="0.7" />
      <circle cx="42" cy="36" r="2" fill="#F472B6" fillOpacity="0.7" />

      {/* Cute Smile */}
      <path d="M28 35 Q32 39 36 35" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
};

export const AIAssistant: React.FC<AIAssistantProps> = ({ courseContext, courseTitle }) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: t('aiAssistant.welcome', { courseTitle }) }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [savedIndices, setSavedIndices] = useState<Set<number>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleBookmark = (idx: number, text: string) => {
    if (savedIndices.has(idx)) return;
    storageService.saveAINote({
      id: `${Date.now()}-${idx}`,
      text,
      courseTitle,
      savedAt: new Date().toISOString(),
    });
    setSavedIndices(prev => new Set(prev).add(idx));
    showToast({ message: 'Saved to your AI Notes', type: 'success' });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isExpanded]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const categoryNames = CATEGORIES.map(c => c.title).join(', ');
      const companyNames = COMPANIES.map(c => c.name).join(', ');

      const systemInstruction = `You are a highly intelligent and friendly AI Tutor for the course "${courseTitle}".
      
      Course Context:
      "${courseContext.substring(0, 5000)}..."
      
      YOUR RULES:
      1. **Answer directly and simply.** Do not use complex jargon unless you explain it.
      2. **NO MARKDOWN.** Do not use markdown symbols like hashtags (#) for headers or triple backticks for code blocks unless absolutely necessary for a single line of code. Write in natural, plain text paragraphs. 
      3. **Formatting:** Use paragraphs to separate ideas. You can use bullet points like "•" or "-" for lists. You can use single asterisks (*) to emphasize important words.
      4. **Be helpful.** If the user asks for a quiz, give them one question at a time. If they ask for examples, provide clear, concise text-based examples or very short code snippets.
      5. **Contextual awareness.** Use the provided course context to answer specific questions about the material.
      
      LIVE PLATFORM KNOWLEDGE (SKILLVERSE):
      - SkillVerse is a premier, gamified coding, system design, and interview prep platform.
      - **Categories Available (${CATEGORIES.length})**: ${categoryNames}.
      - **Courses Available (${COURSES.length} Courses)**: ${COURSES.length} comprehensive interactive courses featuring markdown lessons, Monaco code editors, and quizzes.
      - **Company Interview Bank (${COMPANIES.length} Companies)**: Includes top tech companies like ${companyNames}.
      - **Interview Modes Available**:
        1. **Standard Technical Interview**: 5 technical questions with Monaco editor (JavaScript, Python, Java, C++, TypeScript). Evaluates Big O, edge cases, and syntax.
        2. **AI Voice Interview**: Real-time spoken 10-turn interview using Web Speech API with selectable AI recruiters **Robin** (Male) and **Elisa** (Female), live speech-to-text, silence auto-detection, manual override, extra time requests, and full-screen locking.
      - **Spaced Repetition System (SRS)**: Leitner 5-box spaced repetition system for question review queues.
      - **Gamification & Features**: XP store, custom unlocked cursors (Classic Dot, Neon Emerald, Ruby Laser, Golden Aura), daily streak celebrations, skill radar chart visualization, and automated bug reporting.
      
      Goal: Make the user feel like they are chatting with a knowledgeable human tutor, not a robot reading a manual.`;

      // Map local state messages to OpenRouter format
      const apiMessages = [
        { role: 'system', content: systemInstruction },
        ...messages.map(m => ({
          role: m.role === 'model' ? 'assistant' : 'user',
          content: m.text
        })),
        { role: 'user', content: userMessage }
      ];

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: apiMessages,
          max_tokens: 1000
        })
      });

      if (!res.ok) {
        throw new Error(`OpenRouter API error: ${res.status}`);
      }

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content || t('aiAssistant.fallbackResponse');

      setMessages(prev => [...prev, { role: 'model', text }]);
    } catch (error: any) {
      console.error("AI Error:", error);

      let errorMessage = t('aiAssistant.error.connection');

      if (error?.message?.includes('401') || error?.message?.includes('429')) {
        errorMessage = t('aiAssistant.error.api', { userMessage, courseTitle: courseTitle || t('aiAssistant.error.defaultCourse') });
      }

      setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed z-50 transition-all duration-300 ease-in-out ${isOpen ? 'bottom-6 right-6' : 'bottom-6 right-6'}`}>
      {/* Chat Window */}
      {isOpen && (
        <div className={`
            bg-[#1A1F2E] dark:bg-[#1A1F2E] bg-white border border-black/20 dark:border-white/20 dark:border-white/10 shadow-2xl rounded-3xl overflow-hidden flex flex-col
            transition-all duration-300 origin-bottom-right backdrop-blur-xl
            ${isExpanded ? 'w-[80vw] md:w-[620px] h-[80vh]' : 'w-[90vw] md:w-[420px] h-[520px]'}
            mb-4 animate-fade-in-up
        `}>
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-primary via-secondary to-indigo-600 flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-3 text-white">
              <AIMascotLogo size={38} className="ring-2 ring-white/30 shadow-md" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm sm:text-base leading-none">{t('aiAssistant.header.title', 'SkillVerse AI Tutor')}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/20 text-cyan-200">AI</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[11px] text-white/80 leading-none">Online • {courseTitle || 'Learning Assistant'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-white/80">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hover:text-white hover:bg-white/10 rounded-lg transition-colors p-1.5"
                title={isExpanded ? t('aiAssistant.header.collapse') : t('aiAssistant.header.expand')}
                aria-label={isExpanded ? t('aiAssistant.header.collapse') : t('aiAssistant.header.expand')}
              >
                {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:text-white hover:bg-white/10 rounded-lg transition-colors p-1.5"
                title={t('aiAssistant.header.close')}
                aria-label={t('aiAssistant.header.close')}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/5 dark:bg-black/20">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 items-start ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className="shrink-0 mt-0.5">
                  {msg.role === 'user' ? (
                    <div className="w-8 h-8 rounded-full bg-primaryLight text-white flex items-center justify-center shadow-sm">
                      <User size={16} />
                    </div>
                  ) : (
                    <AIMascotLogo size={32} />
                  )}
                </div>
                <div className={`
                    max-w-[85%] rounded-2xl p-3.5 text-sm leading-relaxed shadow-sm
                    ${msg.role === 'user'
                    ? 'bg-primary text-white rounded-tr-none'
                    : 'bg-white dark:bg-[#2A303C] text-textMain border border-black/10 dark:border-white/5 rounded-tl-none'}
                `}>
                  {/* Better Plain Text Rendering */}
                  {msg.text.split('\n').map((line, i) => {
                    // Skip empty lines that are just whitespace
                    if (!line.trim() && i !== 0) return <div key={i} className="h-2" />;

                    // Basic bold handling for *word* or **word**
                    const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g).map((part, j) => {
                      if (part.startsWith('**') && part.endsWith('**')) return <strong key={j}>{part.slice(2, -2)}</strong>;
                      if (part.startsWith('*') && part.endsWith('*')) return <strong key={j}>{part.slice(1, -1)}</strong>;
                      return part;
                    });

                    return <p key={i} className="min-h-[1.2em]">{parts}</p>;
                  })}

                  {msg.role === 'model' && (
                    <div className="flex justify-end mt-2 pt-2 border-t border-black/10 dark:border-white/10">
                      <button
                        onClick={() => handleBookmark(idx, msg.text)}
                        disabled={savedIndices.has(idx)}
                        className={`flex items-center gap-1 text-xs font-medium transition-colors ${savedIndices.has(idx) ? 'text-primaryLight' : 'text-textMuted hover:text-primaryLight'
                          }`}
                        title={savedIndices.has(idx) ? 'Saved to AI Notes' : 'Save to AI Notes'}
                        aria-label={savedIndices.has(idx) ? 'Saved to AI Notes' : 'Save to AI Notes'}
                      >
                        {savedIndices.has(idx) ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                        {savedIndices.has(idx) ? 'Saved' : 'Save'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 items-start animate-fade-in">
                <AIMascotLogo size={32} />
                <div className="bg-white dark:bg-[#2A303C] rounded-2xl rounded-tl-none p-3.5 border border-black/10 dark:border-white/5 flex items-center gap-2.5 shadow-sm">
                  <Loader2 size={16} className="animate-spin text-primaryLight" />
                  <span className="text-xs font-medium text-textMuted">{t('aiAssistant.status.thinking', 'Thinking...')}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-[#1A1F2E] border-t border-black/10 dark:border-white/10 shrink-0">
            <div className="flex gap-2 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('aiAssistant.input.placeholder')}
                className="flex-1 bg-black/5 dark:bg-black/20 border border-transparent focus:border-primaryLight rounded-xl px-4 py-3 text-textMain placeholder-textMuted focus:outline-none transition-all pr-10"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-main text-white rounded-lg hover:shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                title={t('aiAssistant.input.send')}
                aria-label={t('aiAssistant.input.send')}
              >
                <Send size={16} />
              </button>
            </div>
            <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {[t('aiAssistant.suggestions.explain'), t('aiAssistant.suggestions.quiz'), t('aiAssistant.suggestions.example')].map(hint => (
                <button
                  key={hint}
                  onClick={() => { setInput(hint); }}
                  className="px-3 py-1 rounded-full bg-primary/10 text-primaryLight text-xs font-medium hover:bg-primary/20 transition-colors whitespace-nowrap"
                >
                  {hint}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      {!isOpen && (
        <div className="flex items-center gap-2.5 group/ai">
          {/* Cute Floating Tooltip Pill */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-glass border border-primary/30 text-textMain text-xs font-bold shadow-xl backdrop-blur-md hover:border-primaryLight hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <Sparkles size={14} className="text-yellow-400 animate-pulse" />
            <span>{t('aiAssistant.toggle.badge', 'Ask AI Tutor')}</span>
          </button>

          <button
            id="ai-assistant-toggle"
            onClick={() => setIsOpen(true)}
            className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary via-secondary to-indigo-600 p-[3px] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primaryLight/50"
            title={t('aiAssistant.toggle.open', 'Open AI Assistant')}
            aria-label={t('aiAssistant.toggle.open', 'Open AI Assistant')}
          >
            {/* Animated Glow Aura */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-primary to-pink-500 opacity-60 blur-md group-hover/ai:opacity-100 transition-opacity duration-300 animate-pulse"></div>

            {/* Inner mascot container */}
            <div className="relative z-10 w-full h-full rounded-full bg-[#0E1322] flex items-center justify-center overflow-hidden border border-white/20 shadow-inner">
              <img
                src="/ai-bot-avatar.png"
                alt="SkillVerse AI Tutor"
                className="w-full h-full object-cover object-center rounded-full transition-transform duration-300 group-hover/ai:scale-110 group-hover/ai:rotate-3"
              />
            </div>

            {/* Online Status Indicator */}
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 z-20">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-[#0B1220]"></span>
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

