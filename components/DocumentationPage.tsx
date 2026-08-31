import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Book, Code, Terminal, Trophy, Briefcase, 
  Bot, Shield, Database, Layout, Sparkles, Server, CheckCircle,
  Search, Copy, Check, Users, MessageSquare, Star, Flame, 
  FileText, Download, Play, Mic, RefreshCw, Zap, Award, 
  Layers, ExternalLink, HelpCircle, ChevronRight, Lock, Key, 
  Cpu, Globe, Compass, Bookmark, Share2, Eye
} from 'lucide-react';
import { GoldSnow } from './GoldSnow';
import { COURSES, COMPANIES, CATEGORIES, BADGE_DEFINITIONS, XP_STORE_THEMES, XP_STORE_CURSORS } from '../constants';

interface DocSection {
  id: string;
  category: string;
  title: string;
  icon: React.ElementType;
  badge?: string;
  description: string;
  content: React.ReactNode;
}

export const DocumentationPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (codeText: string, id: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const sections: DocSection[] = [
    // --- 1. Getting Started ---
    {
      id: 'getting-started',
      category: 'Overview & Setup',
      title: 'Getting Started & Setup',
      icon: Book,
      badge: 'v1.1.0',
      description: 'Quickstart guide, prerequisites, local setup, and environment configuration.',
      content: (
        <div className="space-y-8 animate-fade-in">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-textMain mb-3">Getting Started with SkillVerse</h2>
            <p className="text-lg text-textMuted leading-relaxed">
              SkillVerse is a premier, gamified coding, system design, and AI-powered technical interview preparation platform. It combines real Monaco code execution, interactive lesson notes, pair programming, peer reviews, and spoken voice interviews into a unified learning hub.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10">
              <div className="text-2xl font-bold text-primaryLight">{COURSES.length}</div>
              <div className="text-xs text-textMuted font-medium uppercase mt-1">Interactive Courses</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10">
              <div className="text-2xl font-bold text-emerald-400">{COMPANIES.length}</div>
              <div className="text-xs text-textMuted font-medium uppercase mt-1">Tech Interview Banks</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10">
              <div className="text-2xl font-bold text-amber-400">{CATEGORIES.length}</div>
              <div className="text-xs text-textMuted font-medium uppercase mt-1">Specialized Tracks</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10">
              <div className="text-2xl font-bold text-cyan-400">{BADGE_DEFINITIONS.length}</div>
              <div className="text-xs text-textMuted font-medium uppercase mt-1">Unlockable Badges</div>
            </div>
          </div>

          {/* Installation Terminal */}
          <div className="bg-[#0B1220] rounded-2xl p-6 border border-white/10 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
                <span className="text-xs text-gray-400 font-mono ml-2">bash — Quick Setup</span>
              </div>
              <button 
                onClick={() => handleCopy(`git clone https://github.com/Khushi1310-nayak/SkillVerse.git\ncd SkillVerse\nnpm install\nnpm run dev`, 'install-cmd')}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
              >
                {copiedCode === 'install-cmd' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copiedCode === 'install-cmd' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="font-mono text-sm text-gray-300 leading-relaxed overflow-x-auto">
              <span className="text-gray-500"># 1. Clone repository</span>{'\n'}
              git clone https://github.com/Khushi1310-nayak/SkillVerse.git{'\n'}
              cd SkillVerse{'\n\n'}
              <span className="text-gray-500"># 2. Install dependencies</span>{'\n'}
              npm install{'\n\n'}
              <span className="text-gray-500"># 3. Start high-performance Vite dev server</span>{'\n'}
              npm run dev
            </pre>
          </div>

          {/* Environment Variables */}
          <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-3">
            <h4 className="font-bold text-textMain flex items-center gap-2">
              <Key size={18} className="text-primaryLight" /> Environment Configuration (.env)
            </h4>
            <p className="text-sm text-textMuted">
              SkillVerse runs out of the box with built-in client mocks, but integrating live Firebase Authentication, Firestore real-time databases, and Gemini AI features requires your personal keys:
            </p>
            <div className="bg-[#0B1220] p-4 rounded-xl font-mono text-xs text-gray-300 space-y-1 overflow-x-auto">
              <div>VITE_FIREBASE_API_KEY=your_api_key</div>
              <div>VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com</div>
              <div>VITE_FIREBASE_PROJECT_ID=your_project_id</div>
              <div>VITE_OPENROUTER_API_KEY=sk-or-v1-your_openrouter_key</div>
            </div>
          </div>
        </div>
      )
    },

    // --- 2. Architecture & Tech Stack ---
    {
      id: 'architecture',
      category: 'Overview & Setup',
      title: 'Architecture & Tech Stack',
      icon: Layout,
      description: 'System architecture, client state flow, Firebase Firestore rules, and Service Worker caching.',
      content: (
        <div className="space-y-8 animate-fade-in">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-textMain mb-3">System Architecture & Tech Stack</h2>
            <p className="text-lg text-textMuted leading-relaxed">
              Designed as a modern, client-heavy progressive web application (PWA) with zero backend runtime overhead, leveraging Firebase Firestore for real-time multiplayer features and encrypted LocalStorage for instant sub-millisecond offline cache.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { title: 'React 19 & TypeScript', desc: 'Strictly typed component tree with lazy-loaded code-splitting for sub-second first contentful paint.', icon: Code, color: 'text-cyan-400' },
              { title: 'Vite 6 Build System', desc: 'Lightning-fast HMR and optimized rollup chunks with automatic Workbox service worker caching.', icon: Cpu, color: 'text-purple-400' },
              { title: 'Firebase Firestore', desc: 'Real-time document synchronization for Pair Programming rooms, Peer Reviews, and Public Profiles.', icon: Database, color: 'text-amber-400' },
              { title: 'Monaco Code Editor', desc: 'Full VS Code desktop engine powering the interactive playground with multi-language execution.', icon: Terminal, color: 'text-blue-400' },
              { title: 'Tailwind CSS Glassmorphism', desc: 'Tailored HSL design system with dark/light themes, custom cursors, and fluid micro-animations.', icon: Sparkles, color: 'text-pink-400' },
              { title: 'Web Speech API', desc: 'Native browser speech recognition and synthesis powering realistic spoken AI technical recruiter mock interviews.', icon: Mic, color: 'text-emerald-400' }
            ].map((stack, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-primaryLight/40 transition-all">
                <stack.icon size={24} className={`${stack.color} mb-3`} />
                <h3 className="font-bold text-textMain text-base mb-1">{stack.title}</h3>
                <p className="text-xs text-textMuted leading-relaxed">{stack.desc}</p>
              </div>
            ))}
          </div>

          {/* Architecture Mermaid Diagram Box */}
          <div className="p-6 rounded-2xl bg-black/20 border border-black/20 dark:border-white/10 space-y-4">
            <h3 className="text-xl font-bold text-textMain flex items-center gap-2">
              <Layers className="text-primaryLight" size={20} /> Data Layer Hierarchy
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="font-bold text-primaryLight text-sm mb-1">1. User UI & Interactions</div>
                <div className="text-xs text-textMuted">Monaco Editor • Voice Interviews • Quizzes • Flashcards</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="font-bold text-cyan-400 text-sm mb-1">2. Local Storage Engine</div>
                <div className="text-xs text-textMuted">Sub-ms cache • Starred Questions • Micro-Challenges • Notes</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="font-bold text-emerald-400 text-sm mb-1">3. Cloud Firestore</div>
                <div className="text-xs text-textMuted">Pair Sessions • Peer Reviews • Public Profiles • Security Rules</div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // --- 3. Interactive Course Player ---
    {
      id: 'courses',
      category: 'Learning Engine',
      title: 'Interactive Courses & Exams',
      icon: Shield,
      badge: 'Interactive',
      description: 'Markdown lessons, Monaco sandboxes, 60s/question timed exams, and missed-question retake mode.',
      content: (
        <div className="space-y-8 animate-fade-in">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-textMain mb-3">Course Player & Timed Exam Engine</h2>
            <p className="text-lg text-textMuted leading-relaxed">
              Every course in SkillVerse features deep, markdown-driven chapters, embedded interactive Monaco code editors, integrated Pomodoro focus intervals, and a realistic timed practice exam.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 space-y-3">
              <h3 className="font-bold text-textMain text-lg flex items-center gap-2">
                <Play className="text-primaryLight" size={20} /> Rich Chapter Lessons
              </h3>
              <p className="text-sm text-textMuted leading-relaxed">
                Lessons support rich markdown rendering, collapsible code examples, inline quiz checkups, and official documentation links. Learners can highlight concepts and save synchronized notes per chapter.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 space-y-3">
              <h3 className="font-bold text-textMain text-lg flex items-center gap-2">
                <Zap className="text-yellow-400" size={20} /> Timed Exam Simulation
              </h3>
              <p className="text-sm text-textMuted leading-relaxed">
                Paced at <strong>60 seconds per question</strong> to simulate real certification pressure. Includes automatic submission upon timeout, instant grading, score breakdown, and retake modes targeting only missed questions.
              </p>
            </div>
          </div>

          {/* Pomodoro Focus Timer Feature */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-background to-secondary/10 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="font-bold text-textMain text-base mb-1">⏱️ Embedded Pomodoro Focus Timer</div>
              <div className="text-sm text-textMuted">Built-in 25-minute study intervals + 5-minute recharge breaks directly in the course header.</div>
            </div>
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primaryLight font-mono text-xs font-bold shrink-0">
              FocusTimer.tsx
            </span>
          </div>
        </div>
      )
    },

    // --- 4. Starred Questions ---
    {
      id: 'starred-questions',
      category: 'Learning Engine',
      title: 'Starred Quiz Questions & Flashcards',
      icon: Star,
      badge: 'New',
      description: 'Bookmarking quiz questions for spaced review, flashcard flip mode, and instant state reactivity.',
      content: (
        <div className="space-y-8 animate-fade-in">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-textMain mb-3">Starred Questions & Flashcard Practice</h2>
            <p className="text-lg text-textMuted leading-relaxed">
              Learners can star any challenging or insightful quiz question across any course. The dedicated <code className="text-primaryLight font-mono">/starred</code> deck provides instant review and flashcard testing modes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10">
              <Star className="text-amber-400 mb-3 fill-amber-400" size={24} />
              <h4 className="font-bold text-textMain mb-1">1-Click Star Toggle</h4>
              <p className="text-xs text-textMuted">Star questions during active quizzes or result review screens with instant reactive UI updates.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10">
              <Book className="text-primaryLight mb-3" size={24} />
              <h4 className="font-bold text-textMain mb-1">Unified Starred Hub</h4>
              <p className="text-xs text-textMuted">Filter bookmarked questions by course, search question stems, and view historical answer options.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10">
              <RefreshCw className="text-emerald-400 mb-3" size={24} />
              <h4 className="font-bold text-textMain mb-1">Interactive Flashcards</h4>
              <p className="text-xs text-textMuted">Flip cards to test memory retention, pick test choices, and reveal comprehensive explanations.</p>
            </div>
          </div>

          <div className="bg-[#0B1220] p-5 rounded-2xl border border-white/10 font-mono text-xs text-gray-300">
            <div className="text-gray-500 mb-2">// storageService.ts — Starred Questions Data Schema</div>
            <div>storageService.toggleStarQuestion(courseId: string, questionId: number): void</div>
            <div>storageService.isQuestionStarred(courseId: string, questionId: number): boolean</div>
            <div>storageService.getStarredQuestions(): Array&lt;{'{'} courseId, questionId, starredAt {'}'}&gt;</div>
          </div>
        </div>
      )
    },

    // --- 5. Daily Micro-Challenge ---
    {
      id: 'micro-challenges',
      category: 'Learning Engine',
      title: 'Daily Micro-Challenge Streak Saver',
      icon: Flame,
      badge: 'Gamified',
      description: '1-minute daily algorithmic & system design micro-challenges for continuous streak preservation.',
      content: (
        <div className="space-y-8 animate-fade-in">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-textMain mb-3">Daily Micro-Challenge Streak Saver</h2>
            <p className="text-lg text-textMuted leading-relaxed">
              Designed for busy days when learners don't have 30 minutes for a full course module. Complete a curated 1-minute challenge on the dashboard to preserve your streak and earn +25 XP.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 space-y-2">
              <div className="font-bold text-textMain flex items-center gap-2">
                <Flame className="text-orange-500" size={20} /> 30 Curated Problem Bank
              </div>
              <p className="text-xs text-textMuted leading-relaxed">
                Repository in <code className="text-primaryLight font-mono">microChallengeRepository.ts</code> spanning Big-O complexity, React hooks, binary search invariants, and cache invalidation.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 space-y-2">
              <div className="font-bold text-textMain flex items-center gap-2">
                <Trophy className="text-amber-400" size={20} /> Fanfare Audio & XP Reward
              </div>
              <p className="text-xs text-textMuted leading-relaxed">
                Instant audio celebrations, streak increments, and visual success state prevents double submissions while keeping daily motivation high.
              </p>
            </div>
          </div>
        </div>
      )
    },

    // --- 6. Collaborative Pair Programming ---
    {
      id: 'pair-programming',
      category: 'Collaborative Tools',
      title: 'Collaborative Pair Programming',
      icon: Users,
      badge: 'Multiplayer',
      description: 'Real-time Monaco code collaboration, session room links, peer presence, and sandboxed terminal output.',
      content: (
        <div className="space-y-8 animate-fade-in">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-textMain mb-3">Real-Time Pair Programming</h2>
            <p className="text-lg text-textMuted leading-relaxed">
              Launch instant peer programming sessions at <code className="text-primaryLight font-mono">/pair-session/:roomId</code>. Share your unguessable room link with teammates or mentors to code, debug, and execute code together in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10">
              <Share2 className="text-primaryLight mb-3" size={24} />
              <h4 className="font-bold text-textMain mb-1">Instant Session Links</h4>
              <p className="text-xs text-textMuted">Generate secure 20-character session IDs with copyable invite links and QR codes.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10">
              <Eye className="text-cyan-400 mb-3" size={24} />
              <h4 className="font-bold text-textMain mb-1">Active Peer Avatars</h4>
              <p className="text-xs text-textMuted">See who is currently in the room with live presence indicators and real-time cursor sync.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10">
              <Terminal className="text-emerald-400 mb-3" size={24} />
              <h4 className="font-bold text-textMain mb-1">Shared Execution Output</h4>
              <p className="text-xs text-textMuted">Sandboxed terminal runs JavaScript, Python, and TypeScript with real-time synchronized console logs.</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-black/20 border border-white/10 space-y-2">
            <div className="font-bold text-textMain text-sm">Firestore Security Match:</div>
            <code className="text-xs font-mono text-cyan-300 block bg-[#0B1220] p-3 rounded-xl overflow-x-auto">
              match /pairSessions/{'{'}sessionId{'}'} {'{'} allow read, write: if true; {'}'}
            </code>
          </div>
        </div>
      )
    },

    // --- 7. Peer Code Reviews ---
    {
      id: 'peer-reviews',
      category: 'Collaborative Tools',
      title: 'Peer Code Review Queue',
      icon: MessageSquare,
      badge: 'Community',
      description: 'Community code review hub, threaded discussions, code snippets, upvoting, and resolution status.',
      content: (
        <div className="space-y-8 animate-fade-in">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-textMain mb-3">Peer Code Reviews</h2>
            <p className="text-lg text-textMuted leading-relaxed">
              Located at <code className="text-primaryLight font-mono">/code-review</code>, learners can post code snippets from courses or personal projects to receive constructive peer feedback, discuss optimizations, and learn collaborative engineering practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10">
              <h4 className="font-bold text-textMain mb-1">Threaded Feedback & Comments</h4>
              <p className="text-xs text-textMuted">Subcollection comments stored at <code className="text-primaryLight">/codeReviewRequests/{'{'}id{'}'}/comments</code> for structured multi-turn architectural discussions.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10">
              <h4 className="font-bold text-textMain mb-1">Upvotes & Resolved Tags</h4>
              <p className="text-xs text-textMuted">Community members upvote insightful suggestions; authors can mark discussions as resolved when fixes are applied.</p>
            </div>
          </div>
        </div>
      )
    },

    // --- 8. Notes Hub ---
    {
      id: 'notes-hub',
      category: 'Collaborative Tools',
      title: 'Personal & Public Notes Hub',
      icon: FileText,
      description: 'Private lesson notes, AI Tutor notes, community-shared lesson notes, and print-ready PDF export.',
      content: (
        <div className="space-y-8 animate-fade-in">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-textMain mb-3">Unified Notes Hub & PDF Exporter</h2>
            <p className="text-lg text-textMuted leading-relaxed">
              Accessible at <code className="text-primaryLight font-mono">/notes</code>, this centralized hub organizes private notes taken during chapters, AI Tutor explanations bookmarked from chat, and public notes shared by top community learners.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10">
              <Bookmark className="text-primaryLight mb-3" size={24} />
              <h4 className="font-bold text-textMain mb-1">Private Lesson Notes</h4>
              <p className="text-xs text-textMuted">Tied directly to each course module with local caching for instant availability.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10">
              <Globe className="text-cyan-400 mb-3" size={24} />
              <h4 className="font-bold text-textMain mb-1">Public Community Notes</h4>
              <p className="text-xs text-textMuted">Synced to Firestore so learners worldwide can benefit from insightful explanations.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10">
              <Download className="text-emerald-400 mb-3" size={24} />
              <h4 className="font-bold text-textMain mb-1">1-Click PDF Export</h4>
              <p className="text-xs text-textMuted">Export your personal study guides and chapter notes into formatted, high-res PDF documents via jsPDF.</p>
            </div>
          </div>
        </div>
      )
    },

    // --- 9. Career Mode & AI Interviews ---
    {
      id: 'career-mode',
      category: 'Career & Interviews',
      title: 'Career Mode & AI Voice Interviews',
      icon: Briefcase,
      badge: 'Voice AI',
      description: 'Company-specific interview tracks, Monaco coding tests, and Web Speech API spoken recruiter interviews.',
      content: (
        <div className="space-y-8 animate-fade-in">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-textMain mb-3">Career Mode & Spoken AI Interviews</h2>
            <p className="text-lg text-textMuted leading-relaxed">
              Target {COMPANIES.length} elite tech companies (Google, Meta, Apple, Amazon, Netflix, Microsoft, etc.) with real interview question tracks and live spoken voice interviews with AI recruiters <strong>Robin</strong> and <strong>Elisa</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 space-y-3">
              <h3 className="font-bold text-textMain text-lg flex items-center gap-2">
                <Mic className="text-primaryLight" size={20} /> 10-Turn Spoken Voice Interview
              </h3>
              <p className="text-sm text-textMuted leading-relaxed">
                Uses the Web Speech API for real-time speech recognition and lifelike recruiter voice synthesis. Features automated silence detection, manual speech overrides, extra time requests, and full-screen proctor locking.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 space-y-3">
              <h3 className="font-bold text-textMain text-lg flex items-center gap-2">
                <Layers className="text-cyan-400" size={20} /> Leitner 5-Box Spaced Repetition (SRS)
              </h3>
              <p className="text-sm text-textMuted leading-relaxed">
                Spaced repetition automatically schedules questions into 5 Leitner boxes. Correct answers advance questions to higher review intervals; mistakes reset them for rapid mastery.
              </p>
            </div>
          </div>
        </div>
      )
    },

    // --- 10. Certifications & QR Verification ---
    {
      id: 'certifications',
      category: 'Career & Interviews',
      title: 'Certifications & QR Verification',
      icon: Award,
      badge: 'Verifiable',
      description: 'Tamper-proof credential issuance, cryptographic certificate IDs, print-ready PDFs, and QR verification.',
      content: (
        <div className="space-y-8 animate-fade-in">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-textMain mb-3">Tamper-Proof Certifications</h2>
            <p className="text-lg text-textMuted leading-relaxed">
              Passing a course quiz with a score of <strong>70% or higher</strong> awards a verifiable Certificate of Mastery with a unique cryptographic ID and public verification link at <code className="text-primaryLight font-mono">/verify/:id</code>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10">
              <Lock className="text-primaryLight mb-3" size={24} />
              <h4 className="font-bold text-textMain mb-1">Cryptographic ID</h4>
              <p className="text-xs text-textMuted">Generated using course, user, and timestamp hashes for tamper-proof verification.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10">
              <Download className="text-emerald-400 mb-3" size={24} />
              <h4 className="font-bold text-textMain mb-1">High-Res PDF Download</h4>
              <p className="text-xs text-textMuted">Print-ready SVG and PDF formats complete with gold seals and instructor signatures.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10">
              <Share2 className="text-cyan-400 mb-3" size={24} />
              <h4 className="font-bold text-textMain mb-1">LinkedIn 1-Click Share</h4>
              <p className="text-xs text-textMuted">Direct integration with LinkedIn Add-to-Profile URL parameters.</p>
            </div>
          </div>
        </div>
      )
    },

    // --- 11. Gamification & XP Store ---
    {
      id: 'gamification',
      category: 'Gamification & AI',
      title: 'Gamification, XP Store & Portfolio',
      icon: Trophy,
      description: 'XP progression, daily streak multipliers, XP cosmetic store (themes, custom cursors), and public portfolios.',
      content: (
        <div className="space-y-8 animate-fade-in">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-textMain mb-3">Gamification, XP Store & Portfolio</h2>
            <p className="text-lg text-textMuted leading-relaxed">
              Every quiz completed, micro-challenge solved, and interview passed earns Experience Points (XP). Spend XP in the XP Store for custom themes, animated cursors, and avatar frames, and showcase badges on your public portfolio at <code className="text-primaryLight font-mono">/u/:username</code>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 text-center">
              <div className="text-3xl mb-2">🔥</div>
              <h4 className="font-bold text-textMain">Streak Multipliers</h4>
              <p className="text-xs text-textMuted mt-1">Multiplier grows with consecutive days learned.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 text-center">
              <div className="text-3xl mb-2">🎨</div>
              <h4 className="font-bold text-textMain">XP Store Themes</h4>
              <p className="text-xs text-textMuted mt-1">Unlock Cyberpunk, Synthwave, and Emerald palettes.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 text-center">
              <div className="text-3xl mb-2">✨</div>
              <h4 className="font-bold text-textMain">Custom Cursors</h4>
              <p className="text-xs text-textMuted mt-1">Classic Dot, Neon Emerald, Ruby Laser, Golden Aura.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 text-center">
              <div className="text-3xl mb-2">🌐</div>
              <h4 className="font-bold text-textMain">Public Portfolio</h4>
              <p className="text-xs text-textMuted mt-1">Shareable recruiter showcase with earned badges.</p>
            </div>
          </div>
        </div>
      )
    },

    // --- 12. AI Tutor (Gemini) ---
    {
      id: 'ai-tutor',
      category: 'Gamification & AI',
      title: '3D Mascot AI Tutor (Gemini)',
      icon: Bot,
      badge: 'Gemini 2.5',
      description: '3D robot mascot branding, course context awareness, plain text formatting rules, and AI Notes saving.',
      content: (
        <div className="space-y-8 animate-fade-in">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-textMain mb-3">AI Tutor Assistant (Gemini)</h2>
            <p className="text-lg text-textMuted leading-relaxed">
              Featuring our friendly 3D robot mascot avatar, the AI Tutor is powered by <strong>Gemini 2.5 Flash</strong> via OpenRouter. It dynamically injects your current course context to provide tailored explanations, quiz hints, and bookmarkable notes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 space-y-3">
              <h3 className="font-bold text-textMain text-lg flex items-center gap-2">
                <Bot className="text-primaryLight" size={20} /> 3D Mascot & Discovery Badge
              </h3>
              <p className="text-sm text-textMuted leading-relaxed">
                Equipped with the 3D AI robot mascot avatar (<code className="text-primaryLight">/ai-bot-avatar.png</code>) and vector SVG fallback, floating <code className="text-yellow-400">Ask AI Tutor ✨</code> pill badge, and live emerald online status indicators.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 space-y-3">
              <h3 className="font-bold text-textMain text-lg flex items-center gap-2">
                <Bookmark className="text-cyan-400" size={20} /> 1-Click Save to AI Notes
              </h3>
              <p className="text-sm text-textMuted leading-relaxed">
                Learners can click the bookmark icon on any AI response to store it directly in their personal AI Notes for quick review before exams.
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  // Group sections by category
  const categories = ['Overview & Setup', 'Learning Engine', 'Collaborative Tools', 'Career & Interviews', 'Gamification & AI'];

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const query = searchQuery.toLowerCase();
    return sections.filter(s => 
      s.title.toLowerCase().includes(query) || 
      s.description.toLowerCase().includes(query) ||
      s.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const currentSectionData = sections.find(s => s.id === activeSection) || sections[0];

  return (
    <div className="min-h-screen bg-background text-textMain overflow-hidden font-sans selection:bg-primaryLight selection:text-background flex flex-col">
      <GoldSnow />
      
      {/* Top Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-black/10 dark:border-white/10 h-20 flex items-center px-6 md:px-10 justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-textMuted hover:text-textMain transition-all active:scale-95"
            title="Return to Home"
            aria-label="Return to Home"
          >
            <ArrowLeft size={22} />
          </button>
          <div className="h-6 w-px bg-black/10 dark:bg-white/10 hidden sm:block"></div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-main flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20">
              SV
            </div>
            <div>
              <span className="text-lg font-display font-bold text-textMain leading-none block">Documentation</span>
              <span className="text-[11px] text-textMuted leading-none">Official Architecture & User Guide</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" size={15} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search docs..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-textMain placeholder-textMuted focus:outline-none focus:border-primaryLight transition-all"
            />
          </div>
          <span className="bg-primary/10 text-primaryLight px-3 py-1 rounded-full border border-primary/20 text-xs font-bold font-mono">
            v1.1.0 Stable
          </span>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex flex-1 pt-20 h-screen w-full max-w-7xl mx-auto">
        
        {/* Sticky Sidebar Navigation */}
        <aside className="w-72 hidden md:flex flex-col border-r border-black/10 dark:border-white/10 bg-background/50 backdrop-blur-sm overflow-y-auto custom-scrollbar h-full py-8 px-5 shrink-0">
          <div className="space-y-6">
            {categories.map(cat => {
              const catSections = filteredSections.filter(s => s.category === cat);
              if (catSections.length === 0) return null;

              return (
                <div key={cat} className="space-y-1.5">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-textMuted/70 px-3">{cat}</h3>
                  <nav className="space-y-1">
                    {catSections.map(section => {
                      const isActive = activeSection === section.id;
                      const Icon = section.icon;

                      return (
                        <button
                          key={section.id}
                          onClick={() => setActiveSection(section.id)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 text-xs font-medium text-left ${
                            isActive 
                              ? 'bg-gradient-main text-white shadow-md shadow-primary/20 font-bold' 
                              : 'text-textMuted hover:bg-black/5 dark:hover:bg-white/5 hover:text-textMain'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <Icon size={16} className={isActive ? 'text-white' : 'text-primaryLight'} />
                            <span className="truncate">{section.title}</span>
                          </div>
                          {section.badge && (
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                              isActive ? 'bg-white/20 text-white' : 'bg-primary/10 text-primaryLight'
                            }`}>
                              {section.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar h-full relative z-10 px-6 py-8 md:px-12 md:py-10 pb-32">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-textMuted mb-6">
              <span>Docs</span>
              <ChevronRight size={12} />
              <span>{currentSectionData.category}</span>
              <ChevronRight size={12} />
              <span className="text-primaryLight font-bold">{currentSectionData.title}</span>
            </div>

            {/* Dynamic Content */}
            {currentSectionData.content}

            {/* Pagination Navigation Footer */}
            <div className="mt-16 pt-8 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
              {(() => {
                const currentIndex = sections.findIndex(s => s.id === activeSection);
                const prev = sections[currentIndex - 1];
                const next = sections[currentIndex + 1];

                return (
                  <>
                    {prev ? (
                      <button
                        onClick={() => setActiveSection(prev.id)}
                        className="flex items-center gap-2 text-xs font-bold text-textMuted hover:text-primaryLight transition-colors"
                      >
                        <ArrowLeft size={16} />
                        <span>Previous: {prev.title}</span>
                      </button>
                    ) : <div></div>}

                    {next ? (
                      <button
                        onClick={() => setActiveSection(next.id)}
                        className="flex items-center gap-2 text-xs font-bold text-textMuted hover:text-primaryLight transition-colors ml-auto"
                      >
                        <span>Next: {next.title}</span>
                        <ChevronRight size={16} />
                      </button>
                    ) : <div></div>}
                  </>
                );
              })()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
