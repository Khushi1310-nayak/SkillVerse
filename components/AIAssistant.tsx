import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Bot, User, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { COURSES, COMPANIES, CATEGORIES } from '../constants';

interface AIAssistantProps {
  courseContext: string;
  courseTitle: string;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ courseContext, courseTitle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `Hi there! I'm your AI tutor for **${courseTitle}**. \n\nI can explain concepts, give you examples, or quiz you on what you've learned. How can I help you today?` }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      const systemInstruction = `You are a highly intelligent and friendly AI Tutor for the course "${courseTitle}".
      
      Course Context:
      "${courseContext.substring(0, 5000)}..."
      
      YOUR RULES:
      1. **Answer directly and simply.** Do not use complex jargon unless you explain it.
      2. **NO MARKDOWN.** Do not use markdown symbols like hashtags (#) for headers or triple backticks for code blocks unless absolutely necessary for a single line of code. Write in natural, plain text paragraphs. 
      3. **Formatting:** Use paragraphs to separate ideas. You can use bullet points like "•" or "-" for lists. You can use single asterisks (*) to emphasize important words.
      4. **Be helpful.** If the user asks for a quiz, give them one question at a time. If they ask for examples, provide clear, concise text-based examples or very short code snippets.
      5. **Contextual awareness.** Use the provided course context to answer specific questions about the material.
      
      PLATFORM KNOWLEDGE (SKILLVERSE):
      - You are the AI Tutor for "SkillVerse", a premium, gamified coding and interview prep platform.
      - **Voice Interview Feature**: The AI Voice Interviewer is named **"Robin"** (NOT Aiden). Robin acts as a strict Senior Software Engineer conducting FAANG-style bidirectional verbal interviews. If a user asks about Aiden, politely correct them that the interviewer is Robin.
      - **Latest Updates (Epic 1 & 2)**: 
        - Epic 1 introduced a fluid Animated Custom Cursor with ripple effects across the entire site.
        - Epic 2 introduced the Real-Time Voice Interview mode (using Web Speech API), full-screen distraction-free locking, a 10-question dynamic limit, an "End Interview Early" bypass flow, and strict double-spaced, bulleted Markdown AI assessment reports.
      - **Site Structure**:
        - Dashboard: Main hub showing career progress, recommended courses, and active courses.
        - Career Mode: Live mock interviews (both Voice and Text) for specific target companies.
        - Certificates: Proof of completion for finished courses.
        - Settings: User profile and onboarding data configuration.
      - **Available Content**:
        - Categories: ${CATEGORIES.map(c => c.title).join(', ')}.
        - Companies for Interviews: ${COMPANIES.map(c => c.name).join(', ')}.
        - Courses:
${COURSES.map((c: any) => `          * ${c.title} (${c.level}): ${c.description}`).join('\n')}
      
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
      const text = data.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again.";
      
      setMessages(prev => [...prev, { role: 'model', text }]);
    } catch (error: any) {
      console.error("AI Error:", error);
      
      let errorMessage = "Sorry, I'm having trouble connecting right now. Please check your connection or API key.";
      
      if (error?.message?.includes('401') || error?.message?.includes('429')) {
         errorMessage = `Whoops! There was an issue with your OpenRouter API key (billing or authentication). \n\n*Mock Response Fallback*:\nYou asked about: "${userMessage}". Since the API is down, I can see you're currently in the context of "${courseTitle || 'your dashboard'}". Keep practicing!`;
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
            bg-[#1A1F2E] dark:bg-[#1A1F2E] bg-white border border-white/20 dark:border-white/10 shadow-2xl rounded-2xl overflow-hidden flex flex-col
            transition-all duration-300 origin-bottom-right
            ${isExpanded ? 'w-[80vw] md:w-[600px] h-[80vh]' : 'w-[90vw] md:w-[400px] h-[500px]'}
            mb-4 animate-fade-in-up
        `}>
          {/* Header */}
          <div className="p-4 bg-gradient-main flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-white">
              <Bot size={20} />
              <span className="font-bold">Learning Assistant</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <button onClick={() => setIsExpanded(!isExpanded)} className="hover:text-white transition-colors p-1" title={isExpanded ? "Collapse" : "Expand"} aria-label={isExpanded ? "Collapse" : "Expand"}>
                {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
              </button>
              <button onClick={() => setIsOpen(false)} className="hover:text-white transition-colors p-1" title="Close AI Assistant" aria-label="Close AI Assistant">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/5 dark:bg-black/20">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center shrink-0
                    ${msg.role === 'user' ? 'bg-primaryLight text-white' : 'bg-gradient-to-br from-primary to-secondary text-white'}
                `}>
                  {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
                </div>
                <div className={`
                    max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed
                    ${msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-white dark:bg-[#2A303C] text-textMain border border-black/5 dark:border-white/5 rounded-tl-none'}
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
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center">
                     <Sparkles size={14} />
                  </div>
                  <div className="bg-white dark:bg-[#2A303C] rounded-2xl rounded-tl-none p-3 border border-black/5 dark:border-white/5 flex items-center gap-2">
                     <Loader2 size={16} className="animate-spin text-primaryLight" />
                     <span className="text-xs text-textMuted">Thinking...</span>
                  </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-[#1A1F2E] border-t border-black/5 dark:border-white/10 shrink-0">
             <div className="flex gap-2 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask a question..."
                  className="flex-1 bg-black/5 dark:bg-black/20 border border-transparent focus:border-primaryLight rounded-xl px-4 py-3 text-textMain placeholder-textMuted focus:outline-none transition-all pr-10"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-main text-white rounded-lg hover:shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                  title="Send message"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
             </div>
             <div className="mt-2 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {['Explain simply', 'Give me a quiz', 'Give an example'].map(hint => (
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

      {/* Toggle Button */}
      {!isOpen && (
        <button
            id="ai-assistant-toggle"
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-main text-white shadow-2xl hover:scale-110 transition-all duration-300 animate-fade-in-up"
            title="Open AI Assistant"
            aria-label="Open AI Assistant"
        >
            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 animate-pulse"></div>
            <Sparkles size={28} className="animate-pulse-slow" />
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-[#0B1220]"></span>
        </button>
      )}
    </div>
  );
};
