import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Book, Code, Terminal, Trophy, Briefcase, 
  Bot, Shield, Database, Layout, Sparkles, Server, CheckCircle 
} from 'lucide-react';
import { GoldSnow } from './GoldSnow';

export const DocumentationPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    { id: 'getting-started', title: 'Getting Started', icon: Book },
    { id: 'architecture', title: 'Architecture & Tech Stack', icon: Layout },
    { id: 'courses', title: 'Courses & Certification', icon: Shield },
    { id: 'career-mode', title: 'Career Mode Simulator', icon: Briefcase },
    { id: 'gamification', title: 'Gamification System (XP)', icon: Trophy },
    { id: 'ai-tutor', title: 'AI Integration (Gemini)', icon: Bot },
    { id: 'local-storage', title: 'Local Storage & Data', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-background text-textMain overflow-hidden font-sans selection:bg-primaryLight selection:text-background flex flex-col">
      <GoldSnow />
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-black/20 dark:border-white/10 h-20 flex items-center px-6 md:px-10 justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 rounded-full hover:bg-white/10 text-textMuted hover:text-textMain transition-colors"
            title="Back to Home"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-main flex items-center justify-center font-bold text-white shadow-lg">
              SV
            </div>
            <span className="text-xl font-display font-bold text-textMain hidden sm:block">Documentation</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-textMuted">
          <span className="bg-primary/10 text-primaryLight px-3 py-1 rounded-full border border-primary/20">
            v1.0.0 Stable
          </span>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 pt-20 h-screen w-full max-w-7xl mx-auto">
        
        {/* Sidebar */}
        <aside className="w-72 hidden md:flex flex-col border-r border-black/20 dark:border-white/10 bg-background/50 backdrop-blur-sm overflow-y-auto custom-scrollbar h-full py-8 px-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-textMuted mb-4">Contents</h3>
          <nav className="space-y-1">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium ${
                  activeSection === section.id 
                    ? 'bg-primary/10 text-primaryLight border border-primary/20' 
                    : 'text-textMuted hover:bg-white/5 hover:text-textMain border border-transparent'
                }`}
              >
                <section.icon size={18} className={activeSection === section.id ? 'text-primaryLight' : 'text-textMuted'} />
                {section.title}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar h-full relative z-10 px-6 py-8 md:px-12 md:py-12 pb-32">
          <div className="max-w-3xl">
            {activeSection === 'getting-started' && (
              <div className="animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-textMain mb-6">Getting Started</h1>
                <p className="text-lg text-textMuted leading-relaxed mb-8">
                  Welcome to the official documentation for SkillVerse! This platform is designed as an advanced E-Learning SaaS product that focuses heavily on user engagement, interactive learning, and career readiness.
                </p>
                <div className="bg-glass border border-black/20 dark:border-white/10 rounded-2xl p-6 mb-8 hover:border-primaryLight/30 transition-colors">
                  <h3 className="text-xl font-bold text-textMain mb-4 flex items-center gap-2">
                    <Terminal className="text-primaryLight" /> Installation
                  </h3>
                  <div className="bg-[#0B1220] rounded-xl p-4 font-mono text-sm text-gray-300 mb-4 overflow-x-auto shadow-inner border border-black/20 dark:border-white/5">
                    <div className="mb-2 text-gray-500"># Clone the repository</div>
                    <div>git clone https://github.com/Khushi1310-nayak/skillverse.git</div>
                    <div>cd skillverse</div>
                    <div className="mt-4 mb-2 text-gray-500"># Install dependencies</div>
                    <div>npm install</div>
                    <div className="mt-4 mb-2 text-gray-500"># Start development server</div>
                    <div>npm run dev</div>
                  </div>
                </div>
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-500/90 text-sm flex gap-3">
                  <Sparkles className="shrink-0" />
                  <p>Remember to create a <code className="bg-black/30 px-1 rounded text-yellow-500">.env</code> file containing your <code className="bg-black/30 px-1 rounded text-yellow-500">GEMINI_API_KEY</code> before starting the application for AI features to work.</p>
                </div>
              </div>
            )}

            {activeSection === 'architecture' && (
              <div className="animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-textMain mb-6">Architecture & Tech Stack</h1>
                <p className="text-lg text-textMuted leading-relaxed mb-8">
                  SkillVerse is a client-heavy React application built on top of Vite. It relies heavily on local browser APIs to provide a seamless offline-first experience without a dedicated backend server.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {[
                    { label: 'Framework', val: 'React 19 + TypeScript', icon: Code },
                    { label: 'Build Tool', val: 'Vite 6', icon: Layout },
                    { label: 'Styling', val: 'Tailwind CSS', icon: Sparkles },
                    { label: 'Icons', val: 'Lucide React', icon: CheckCircle },
                    { label: 'Routing', val: 'React Router v7', icon: Server },
                    { label: 'AI Provider', val: 'Google GenAI SDK', icon: Bot },
                  ].map((item, i) => (
                    <div key={i} className="bg-black/5 dark:bg-white/5 border border-black/20 dark:border-white/10 rounded-xl p-4 flex items-center gap-4">
                      <div className="p-3 bg-white/5 rounded-lg text-primaryLight"><item.icon size={20} /></div>
                      <div>
                        <div className="text-xs text-textMuted">{item.label}</div>
                        <div className="font-bold text-textMain">{item.val}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <h3 className="text-2xl font-bold text-textMain mb-4">Project Structure</h3>
                <ul className="space-y-3 text-textMuted text-sm">
                  <li className="flex gap-2"><code className="text-primaryLight bg-primary/10 px-1.5 py-0.5 rounded">/components</code> React UI Components and Pages</li>
                  <li className="flex gap-2"><code className="text-primaryLight bg-primary/10 px-1.5 py-0.5 rounded">/services</code> Business logic (Storage, API calls)</li>
                  <li className="flex gap-2"><code className="text-primaryLight bg-primary/10 px-1.5 py-0.5 rounded">constants.ts</code> Static data (Companies, Courses, etc.)</li>
                  <li className="flex gap-2"><code className="text-primaryLight bg-primary/10 px-1.5 py-0.5 rounded">types.ts</code> Global TypeScript definitions</li>
                </ul>
              </div>
            )}

            {activeSection === 'courses' && (
              <div className="animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-textMain mb-6">Courses & Certification</h1>
                <p className="text-lg text-textMuted leading-relaxed mb-6">
                  Courses are divided into categories: <strong>Programming, DSA, and Design</strong>. Each course contains exactly 8 modules dynamically generated with rich content and Official Documentation Links.
                </p>
                <div className="bg-glass border border-black/20 dark:border-white/10 rounded-2xl p-6 mb-8">
                  <h3 className="text-xl font-bold text-textMain mb-3">Certification Logic</h3>
                  <p className="text-textMuted mb-4">
                    Upon completing a course, users are challenged with a 12-question quiz. A score of <strong>70% or higher</strong> is required to unlock a certificate.
                  </p>
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl text-sm font-mono text-gray-300">
                    <div className="text-purple-400">if</div> (score &gt;= <span className="text-orange-400">70</span>) {'{'}
                    <div className="pl-4">awardCertificate(courseId, date);</div>
                    <div className="pl-4">addXP(<span className="text-orange-400">500</span>);</div>
                    {'}'}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'career-mode' && (
              <div className="animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-textMain mb-6">Career Mode</h1>
                <p className="text-lg text-textMuted leading-relaxed mb-6">
                  The Career Mode Simulator provides curated interview prep for 20 top tech companies (Google, Meta, Netflix, Uber, etc.). 
                </p>
                <div className="space-y-4">
                  <div className="bg-black/20 p-5 rounded-2xl border border-black/20 dark:border-white/5 hover:border-black/20 dark:border-white/10 transition-colors">
                    <h4 className="font-bold text-textMain mb-2">Company Mock Data</h4>
                    <p className="text-sm text-textMuted">Each company has specific focus areas (e.g. Google focuses on Graph Algorithms and System Design, Netflix focuses on Concurrency). Questions are generated based on these focuses and are categorized as Easy, Medium, or Hard.</p>
                  </div>
                  <div className="bg-black/20 p-5 rounded-2xl border border-black/20 dark:border-white/5 hover:border-black/20 dark:border-white/10 transition-colors">
                    <h4 className="font-bold text-textMain mb-2">Readiness Score</h4>
                    <p className="text-sm text-textMuted">A proprietary Readiness Score calculates the user's performance against the difficulty of the questions answered, helping them gauge when they are ready for the real interview.</p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'gamification' && (
              <div className="animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-textMain mb-6">Gamification & XP</h1>
                <p className="text-lg text-textMuted leading-relaxed mb-6">
                  User engagement is driven by an immersive gamification engine tracking XP, Levels, and Streaks.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="bg-glass border border-black/20 dark:border-white/10 rounded-2xl p-5 text-center transform transition-transform hover:-translate-y-1">
                    <div className="text-3xl mb-2">🔥</div>
                    <h4 className="font-bold text-textMain">Streaks</h4>
                    <p className="text-xs text-textMuted mt-2">Daily logins increase streak count, applying multipliers to XP gains.</p>
                  </div>
                  <div className="bg-glass border border-black/20 dark:border-white/10 rounded-2xl p-5 text-center transform transition-transform hover:-translate-y-1">
                    <div className="text-3xl mb-2">⭐</div>
                    <h4 className="font-bold text-textMain">Levels</h4>
                    <p className="text-xs text-textMuted mt-2">Dynamic level caps based on total accumulated XP.</p>
                  </div>
                  <div className="bg-glass border border-black/20 dark:border-white/10 rounded-2xl p-5 text-center transform transition-transform hover:-translate-y-1">
                    <div className="text-3xl mb-2">🏅</div>
                    <h4 className="font-bold text-textMain">Badges</h4>
                    <p className="text-xs text-textMuted mt-2">Earn badges for specific achievements like first 100% quiz.</p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'ai-tutor' && (
              <div className="animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-textMain mb-6">AI Integration (Gemini)</h1>
                <p className="text-lg text-textMuted leading-relaxed mb-6">
                  The <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">AIAssistant.tsx</code> component interfaces directly with the <strong>Google GenAI SDK</strong> (<code className="text-sm">@google/genai</code>) to act as a personal tutor.
                </p>
                <div className="bg-black/20 rounded-2xl p-6 border border-black/20 dark:border-white/5">
                  <h3 className="font-bold text-textMain mb-3">Context Aware Prompts</h3>
                  <p className="text-sm text-textMuted mb-4">
                    The assistant injects the user's current context (e.g., currently viewed course or category) into the system instructions, ensuring the Gemini model provides highly relevant answers and code snippets tailored to what the user is actively studying.
                  </p>
                  <p className="text-sm text-textMuted">
                    API calls are made securely from the client side using the provided <code className="text-yellow-500">import.meta.env.VITE_GEMINI_API_KEY</code> which maps to <code className="text-yellow-500">process.env.API_KEY</code> via Vite config.
                  </p>
                </div>
              </div>
            )}

            {activeSection === 'local-storage' && (
              <div className="animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-textMain mb-6">Data Persistence</h1>
                <p className="text-lg text-textMuted leading-relaxed mb-6">
                  SkillVerse persists user settings in <code className="bg-white/10 px-1.5 py-0.5 rounded">Firebase Firestore</code> for seamless cross-device synchronization, while using <code className="bg-white/10 px-1.5 py-0.5 rounded">localStorage</code> for local course progress and career mode tracking.
                </p>
                <div className="bg-glass border border-black/20 dark:border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-textMain mb-4">storageService & Firestore Integration</h3>
                  <p className="text-sm text-textMuted mb-4">
                    The <code className="text-primaryLight">storageService</code> coordinates with Firebase Auth and Firestore to persist and synchronize:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm text-textMuted ml-2">
                    <li>User Settings (Theme, Gradient Intensity, Daily Goals, Quiz & Notification Preferences)</li>
                    <li>Onboarding completion state and user goals (stored in Firestore)</li>
                    <li>Course Progress & Quiz Scores (localStorage fallback)</li>
                    <li>Earned Certificates & Career Mode Practice Data</li>
                  </ul>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};
