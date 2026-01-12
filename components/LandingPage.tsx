import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, CheckCircle, Award, Zap, BarChart, Shield, 
  PlayCircle, BookOpen, Lock, X, Trophy, Briefcase, 
  Bot, FileCheck, Fingerprint, Download, Sparkles, Check,
  ChevronDown, HelpCircle, Mail, FileText, Globe, Server, 
  HardDrive, Users, Eye, Heart
} from 'lucide-react';
import { GoldSnow } from './GoldSnow';

interface LandingPageProps {
  onGetStarted: () => void;
}

// --- STYLISH LOGO COMPONENT ---
const StylishLogo: React.FC<{ size?: number, className?: string }> = ({ size = 40, className = "" }) => (
  <div className={`relative group cursor-pointer ${className}`} style={{ width: size, height: size }}>
    {/* Animated Glow Background */}
    <div className="absolute inset-0 bg-gradient-main rounded-xl blur-lg opacity-40 group-hover:opacity-80 transition-opacity duration-500 animate-pulse-slow"></div>
    
    {/* Main Container */}
    <div className="relative w-full h-full bg-[#0B1220] rounded-xl border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl group-hover:border-primaryLight/50 transition-colors duration-300">
       
       {/* Inner Gradient Shine */}
       <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
       
       {/* Letters */}
       <div className="relative z-10 flex font-display font-bold leading-none select-none" style={{ fontSize: size * 0.5 }}>
          <span className="text-white transform group-hover:-translate-x-1 group-hover:-rotate-6 transition-all duration-300 ease-out drop-shadow-md">S</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-primaryLight to-[#F5C97A] transform group-hover:translate-x-1 group-hover:rotate-6 transition-all duration-300 ease-out drop-shadow-md">V</span>
       </div>
    </div>
  </div>
);

const CertificatePreview: React.FC<{ className?: string, rotate?: boolean }> = ({ className = "", rotate = false }) => (
  <div className={`relative w-full max-w-[550px] aspect-[1.414/1] bg-gradient-to-br from-[#0B1220] to-[#1E293B] shadow-2xl flex flex-col items-center justify-between overflow-hidden rounded-lg border-4 border-[#F5C97A]/20 select-none ${className} ${rotate ? 'lg:rotate-2 lg:hover:rotate-0 transition-transform duration-500' : ''}`}>
    {/* Background Patterns */}
    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
    <div className="absolute top-0 right-0 w-[150px] md:w-[300px] h-[150px] md:h-[300px] bg-[#6968A6] rounded-full blur-[80px] md:blur-[100px] opacity-20 pointer-events-none"></div>
    <div className="absolute bottom-0 left-0 w-[150px] md:w-[300px] h-[150px] md:h-[300px] bg-[#CF9893] rounded-full blur-[80px] md:blur-[100px] opacity-20 pointer-events-none"></div>
    
    {/* Ornate Border Inner */}
    <div className="absolute inset-2 border border-[#F5C97A]/40 rounded pointer-events-none"></div>
    <div className="absolute inset-3 border-2 border-dotted border-[#6968A6]/30 rounded pointer-events-none"></div>

    {/* Corner Decorations */}
    <div className="absolute top-4 left-4 w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 border-t-2 border-l-2 border-[#F5C97A] rounded-tl-xl"></div>
    <div className="absolute top-4 right-4 w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 border-t-2 border-r-2 border-[#F5C97A] rounded-tr-xl"></div>
    <div className="absolute bottom-4 left-4 w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 border-b-2 border-l-2 border-[#F5C97A] rounded-bl-xl"></div>
    <div className="absolute bottom-4 right-4 w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 border-b-2 border-r-2 border-[#F5C97A] rounded-br-xl"></div>

    {/* Header */}
    <div className="text-center w-full relative z-10 mt-3 sm:mt-4 md:mt-6">
       <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded bg-gradient-main flex items-center justify-center text-[6px] sm:text-[8px] md:text-[10px] font-bold text-white">SV</div>
          <span className="text-[6px] sm:text-[8px] md:text-[10px] tracking-[0.2em] text-white uppercase font-bold">SkillVerse Academy</span>
       </div>
       <div className="font-display font-bold text-xl sm:text-2xl md:text-4xl text-[#F5C97A] uppercase tracking-widest drop-shadow-md">Certificate</div>
       <div className="text-[6px] sm:text-[8px] md:text-[10px] font-light text-[#B9B6E3] uppercase tracking-[0.3em] mb-1">of Completion</div>
    </div>
    
    {/* Main Content */}
    <div className="flex-1 flex flex-col justify-center items-center w-full relative z-10 -mt-2 px-4">
       <div className="text-[6px] sm:text-[8px] md:text-[10px] text-gray-400 italic mb-1">This is to certify that</div>
       
       <div className="font-display font-bold text-lg sm:text-xl md:text-3xl text-white mb-1 md:mb-2 drop-shadow-sm text-center">
          Alex Morgan
       </div>
       
       <div className="h-px w-16 sm:w-20 md:w-32 bg-gradient-to-r from-transparent via-[#F5C97A] to-transparent mx-auto mb-2 md:mb-3 opacity-60"></div>

       <div className="text-[6px] sm:text-[8px] md:text-[10px] text-gray-400 italic mb-1">Has successfully demonstrated mastery in</div>
       
       <div className="font-bold text-sm sm:text-base md:text-xl text-[#6968A6] mb-2 md:mb-3 text-center bg-gradient-to-r from-[#6968A6] to-[#CF9893] bg-clip-text text-transparent px-2">
          Advanced React & Design Systems
       </div>
       
       <p className="text-[5px] sm:text-[6px] md:text-[8px] text-[#B9B6E3] max-w-[90%] md:max-w-[80%] text-center leading-relaxed">
          Demonstrating exceptional proficiency in component architecture, state management, and modern UI patterns.
       </p>
    </div>
    
    {/* Footer with Seal and Signatures */}
    <div className="w-full flex justify-between items-end relative z-10 px-4 md:px-8 pb-3 sm:pb-4 md:pb-6">
       <div className="text-center">
          <div className="font-handwriting text-[8px] sm:text-xs md:text-sm text-white opacity-90 mb-0.5" style={{ fontFamily: 'cursive' }}>Sarah Jenkins</div>
          <div className="w-12 sm:w-16 md:w-24 border-t border-[#6968A6]/50 pt-0.5 md:pt-1">
             <p className="text-[5px] sm:text-[6px] md:text-[8px] font-bold uppercase text-gray-500 tracking-wider">Instructor</p>
          </div>
       </div>
       
       <div className="relative -mb-1 sm:-mb-2 md:-mb-4 flex flex-col items-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-16 md:h-16 rounded-full border-2 border-[#F5C97A] flex items-center justify-center bg-[#0B1220] shadow-lg relative overflow-hidden">
             <div className="absolute inset-0 bg-[#F5C97A] opacity-10"></div>
             <Award className="text-[#F5C97A] w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </div>
          <div className="mt-1 text-[5px] sm:text-[6px] md:text-[8px] font-mono text-gray-500">ID: SV-882910</div>
       </div>
       
       <div className="text-center">
          <div className="text-[6px] sm:text-[8px] md:text-[10px] text-[#F5C97A] mb-0.5 font-mono">Oct 24, 2024</div>
          <div className="w-12 sm:w-16 md:w-24 border-t border-[#6968A6]/50 pt-0.5 md:pt-1">
             <p className="text-[5px] sm:text-[6px] md:text-[8px] font-bold uppercase text-gray-500 tracking-wider">Date Issued</p>
          </div>
       </div>
    </div>
  </div>
);

const AccordionItem: React.FC<{ title: string, content: string, isOpen: boolean, onClick: () => void }> = ({ title, content, isOpen, onClick }) => (
    <div className="border border-black/5 dark:border-white/10 rounded-xl overflow-hidden bg-black/5 dark:bg-white/5 transition-all duration-300">
        <button 
            onClick={onClick}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-black/10 dark:hover:bg-white/10 transition-colors group"
        >
            <span className="font-bold text-textMain group-hover:text-primaryLight transition-colors">{title}</span>
            <ChevronDown className={`text-textMuted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} size={20} />
        </button>
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="p-4 pt-0 text-textMuted text-sm leading-relaxed border-t border-black/5 dark:border-white/5 mt-2">
                {content}
            </div>
        </div>
    </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [activeModal, setActiveModal] = useState<'features' | 'certificates' | 'pricing' | 'documentation' | 'blog' | 'support' | 'privacy' | 'terms' | 'brand' | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden';
      setOpenAccordion(null); // Reset accordions
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [activeModal]);

  const closeModal = () => setActiveModal(null);

  const handleGetStarted = () => {
    closeModal();
    onGetStarted();
  };

  const toggleAccordion = (id: string) => {
      setOpenAccordion(openAccordion === id ? null : id);
  };

  const FeatureCard = ({ icon: Icon, title, desc, delay }: { icon: any, title: string, desc: string, delay: string }) => (
    <div className={`bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 group animate-fade-in-up ${delay}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primaryLight group-hover:scale-110 transition-transform duration-300">
          <Icon size={24} />
        </div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-textMuted bg-white/50 dark:bg-white/5 px-2 py-1 rounded-full border border-black/5 dark:border-white/5">Feature</div>
      </div>
      <h3 className="text-lg font-bold text-textMain mb-2 group-hover:text-primaryLight transition-colors">{title}</h3>
      <p className="text-sm text-textMuted mb-4 leading-relaxed">{desc}</p>
      
      {/* Mock Dashboard Preview */}
      <div className="w-full h-24 bg-white/50 dark:bg-[#0B1220] rounded-lg border border-black/5 dark:border-white/5 overflow-hidden relative opacity-60 group-hover:opacity-100 transition-opacity">
        <div className="absolute top-0 w-full h-4 bg-black/5 dark:bg-white/5 border-b border-black/5 dark:border-white/5 flex items-center px-2 gap-1">
           <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
           <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
           <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
        </div>
        <div className="flex h-full pt-4">
           <div className="w-1/4 h-full border-r border-black/5 dark:border-white/5 p-1 space-y-1">
              <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded" />
              <div className="w-2/3 h-1.5 bg-black/10 dark:bg-white/10 rounded" />
              <div className="w-3/4 h-1.5 bg-black/10 dark:bg-white/10 rounded" />
           </div>
           <div className="w-3/4 h-full p-2 space-y-2">
              <div className="flex gap-2">
                 <div className="w-1/2 h-8 bg-black/5 dark:bg-white/5 rounded" />
                 <div className="w-1/2 h-8 bg-black/5 dark:bg-white/5 rounded" />
              </div>
              <div className="w-full h-8 bg-black/5 dark:bg-white/5 rounded" />
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-textMain overflow-x-hidden font-sans selection:bg-primaryLight selection:text-background transition-colors duration-500">
      <GoldSnow />
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StylishLogo size={36} />
            <span className="text-2xl font-display font-bold bg-gradient-main bg-clip-text text-transparent">SkillVerse</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleGetStarted} className="hidden md:block text-textMuted hover:text-textMain font-medium transition-colors">Log In</button>
            <button 
              onClick={handleGetStarted}
              className="px-6 py-2.5 rounded-xl bg-gradient-main text-white font-bold hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/20 blur-[120px] animate-pulse-slow" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primaryLight text-sm font-semibold mb-8 animate-fade-in-up">
            ✨ The Future of E-Learning is Here
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight animate-fade-in-up [animation-delay:200ms] text-textMain">
            Learn smarter. <span className="bg-gradient-main bg-clip-text text-transparent">Grow faster.</span><br />
            Prove your skills.
          </h1>
          <p className="text-xl text-textMuted max-w-2xl mx-auto mb-10 animate-fade-in-up [animation-delay:400ms]">
            A next-gen learning platform with analytics, adaptive quizzes, professional certifications, and career-ready tools.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:600ms]">
            <button 
              onClick={handleGetStarted}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-main text-white font-bold text-lg hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              Start Learning Free <ArrowRight size={20} />
            </button>
            <button 
              onClick={handleGetStarted}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 border border-black/10 dark:border-white/10 text-textMain font-bold text-lg hover:bg-white/10 transition-all"
            >
              Explore Courses
            </button>
          </div>
          
          {/* Floating Cards Hero Graphic */}
          <div className="mt-20 relative max-w-5xl mx-auto h-[450px] hidden md:block animate-fade-in [animation-delay:800ms]">
             {/* Center Card */}
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-glass border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-20 animate-float backdrop-blur-xl">
                <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                      </div>
                      <span className="text-sm font-medium text-textMuted ml-2">My Learning Dashboard</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary" />
                   </div>
                </div>
                
                <div className="p-8 grid grid-cols-5 gap-8 h-full">
                   {/* Left Column: Course List */}
                   <div className="col-span-3 space-y-6">
                      <div>
                         <h3 className="text-lg font-bold text-textMain mb-1">Current Course</h3>
                         <p className="text-sm text-textMuted">Advanced React Patterns</p>
                      </div>
                      
                      <div className="space-y-4">
                         <div className="flex items-center gap-4 p-3 rounded-xl bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/5">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                               <PlayCircle size={20} />
                            </div>
                            <div className="flex-1">
                               <div className="text-sm font-bold text-textMain">Hooks Deep Dive</div>
                               <div className="text-xs text-textMuted">12 mins • Video</div>
                            </div>
                            <div className="text-xs font-bold text-primaryLight">Resume</div>
                         </div>

                         <div className="flex items-center gap-4 p-3 rounded-xl bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/5 opacity-60">
                            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                               <BookOpen size={20} />
                            </div>
                            <div className="flex-1">
                               <div className="text-sm font-bold text-textMain">State Management</div>
                               <div className="text-xs text-textMuted">Reading • 8 mins</div>
                            </div>
                            <Lock size={14} className="text-textMuted" />
                         </div>
                      </div>
                   </div>

                   {/* Right Column: Progress */}
                   <div className="col-span-2 flex flex-col items-center justify-center p-4 bg-white/30 dark:bg-black/20 rounded-2xl border border-black/5 dark:border-white/5">
                      <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                         <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 36 36">
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--border-color)" strokeWidth="3" />
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#CF9893" strokeWidth="3" strokeDasharray="75, 100" />
                         </svg>
                         <div className="absolute text-center">
                            <span className="text-3xl font-bold text-textMain block">75%</span>
                         </div>
                      </div>
                      <div className="text-center">
                         <div className="text-sm font-bold text-textMain">Course Progress</div>
                         <div className="text-xs text-textMuted">24/32 Modules</div>
                      </div>
                   </div>
                </div>
             </div>
             
             {/* Left Card: Quiz Passed */}
             <div className="absolute top-16 left-[-10px] w-[280px] bg-glass border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-5 z-20 animate-float [animation-delay:1s] backdrop-blur-md">
                <div className="flex items-center gap-3 mb-3">
                   <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center text-success border border-success/20">
                      <CheckCircle size={20}/>
                   </div>
                   <div>
                      <div className="font-bold text-textMain">Quiz Passed!</div>
                      <div className="text-xs text-textMuted">JavaScript Basics</div>
                   </div>
                </div>
                <div className="flex items-center justify-between text-xs font-medium text-textMuted mb-1">
                   <span>Score</span>
                   <span className="text-success">100%</span>
                </div>
                <div className="w-full bg-black/5 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
                   <div className="h-full bg-success w-full" />
                </div>
             </div>

             {/* Bottom Left Card: Certified */}
             <div className="absolute top-[280px] left-[-30px] w-[260px] bg-glass border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-5 z-20 animate-float [animation-delay:1.5s] backdrop-blur-md">
                <div className="flex items-start gap-4">
                   <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                      <Award size={24}/>
                   </div>
                   <div>
                      <div className="text-xs text-primaryLight font-bold uppercase tracking-wider mb-1">New Certification</div>
                      <div className="font-bold text-textMain leading-tight">Frontend<br/>Specialist</div>
                      <div className="text-[10px] text-textMuted mt-1">Issued Today</div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Platform Highlights */}
      <section className="py-20 px-6">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                 { icon: BarChart, title: 'Analytics', desc: 'Track your progress with detailed insights.', color: 'bg-blue-500/10 text-blue-500' },
                 { icon: Zap, title: 'Adaptive Quizzes', desc: 'Questions that adapt to your skill level.', color: 'bg-yellow-500/10 text-yellow-500' },
                 { icon: Award, title: 'Certificates', desc: 'Earn verified credentials for your resume.', color: 'bg-purple-500/10 text-purple-500' },
                 { icon: Shield, title: 'Career Skills', desc: 'Curriculum designed by industry pros.', color: 'bg-emerald-500/10 text-emerald-500' },
               ].map((item, i) => (
                 <div key={i} className="group p-8 rounded-3xl bg-glass border border-white/20 dark:border-white/10 hover:bg-glass-hover hover:-translate-y-1 transition-all duration-300">
                    <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                       <item.icon size={28} />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-textMain">{item.title}</h3>
                    <p className="text-textMuted">{item.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 relative">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-textMain">Your Path to Mastery</h2>
               <p className="text-textMuted">Three simple steps to level up your career.</p>
            </div>
            
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 hidden md:block" />
               
               {[
                 { step: '01', title: 'Choose Path', desc: 'Select from Programming, Design, or DSA.' },
                 { step: '02', title: 'Learn & Practice', desc: 'Engage with notes and interactive quizzes.' },
                 { step: '03', title: 'Get Certified', desc: 'Pass the exam and download your certificate.' },
               ].map((item, i) => (
                 <div key={i} className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-background border-4 border-primary/30 text-xl font-bold flex items-center justify-center mb-6 shadow-xl text-primaryLight z-20">
                       {item.step}
                    </div>
                    <div className="bg-glass border border-white/20 dark:border-white/10 p-8 rounded-3xl w-full hover:border-primaryLight/30 transition-colors">
                       <h3 className="text-xl font-bold mb-2 text-textMain">{item.title}</h3>
                       <p className="text-textMuted">{item.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Certificate Showcase */}
      <section className="py-20 px-6 bg-white/5 border-y border-white/10">
         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
               <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primaryLight font-bold text-sm mb-6">
                  Verified Credentials
               </div>
               <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-textMain">
                  Certificates that<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primaryLight to-primary">Get You Hired.</span>
               </h2>
               <p className="text-xl text-textMuted mb-8 leading-relaxed">
                  Don't just learn—prove it. Our certificates are verifiable and designed to be showcased on LinkedIn and resumes to catch recruiters' attention.
               </p>
               <button onClick={handleGetStarted} className="px-8 py-3 rounded-xl bg-textMain text-background font-bold hover:opacity-90 transition-opacity">
                  Start Earning Now
               </button>
            </div>
            
            <div className="lg:w-1/2 w-full flex justify-center perspective-1000">
               {/* Updated Certificate Mockup with shared component */}
               <CertificatePreview rotate />
            </div>
         </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 text-center">
         <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 text-textMain">
               Start learning today.<br/>
               Your future skills are waiting.
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <button 
                 onClick={handleGetStarted}
                 className="px-10 py-4 rounded-xl bg-gradient-main text-white font-bold text-xl shadow-lg hover:shadow-primary/40 hover:-translate-y-1 transition-all"
               >
                 Create Free Account
               </button>
               <button 
                 onClick={handleGetStarted}
                 className="px-10 py-4 rounded-xl bg-white/5 border border-black/10 dark:border-white/10 text-textMain font-bold text-xl hover:bg-white/10 transition-all"
               >
                 Log In
               </button>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/5 dark:bg-[#050911] pt-16 pb-8 px-6">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
               <div className="col-span-2 md:col-span-1 animate-fade-in-up">
                  <div 
                    className="flex items-center gap-2 mb-4 cursor-pointer group hover:scale-105 transition-transform origin-left"
                    onClick={() => setActiveModal('brand')}
                  >
                     <StylishLogo size={32} />
                     <span className="text-xl font-bold text-textMain group-hover:text-primaryLight transition-colors">SkillVerse</span>
                  </div>
                  <p className="text-textMuted text-sm mb-4">Empowering the next generation of tech leaders.</p>
               </div>
               <div className="animate-fade-in-up [animation-delay:100ms]">
                  <h4 className="font-bold text-textMain mb-4">Platform</h4>
                  <ul className="space-y-2 text-sm text-textMuted">
                     <li onClick={() => setActiveModal('features')} className="hover:text-primaryLight hover:translate-x-1 cursor-pointer transition-all">Features</li>
                     <li onClick={() => setActiveModal('certificates')} className="hover:text-primaryLight hover:translate-x-1 cursor-pointer transition-all">Certificates</li>
                     <li onClick={() => setActiveModal('pricing')} className="hover:text-primaryLight hover:translate-x-1 cursor-pointer transition-all">Pricing</li>
                  </ul>
               </div>
               <div className="animate-fade-in-up [animation-delay:200ms]">
                  <h4 className="font-bold text-textMain mb-4">Resources</h4>
                  <ul className="space-y-2 text-sm text-textMuted">
                     <li onClick={() => setActiveModal('documentation')} className="hover:text-primaryLight hover:translate-x-1 cursor-pointer transition-all">Documentation</li>
                     <li onClick={() => setActiveModal('blog')} className="hover:text-primaryLight hover:translate-x-1 cursor-pointer transition-all">Blog</li>
                     <li onClick={() => setActiveModal('support')} className="hover:text-primaryLight hover:translate-x-1 cursor-pointer transition-all">Support</li>
                  </ul>
               </div>
               <div className="animate-fade-in-up [animation-delay:300ms]">
                  <h4 className="font-bold text-textMain mb-4">Legal</h4>
                  <ul className="space-y-2 text-sm text-textMuted">
                     <li onClick={() => setActiveModal('privacy')} className="hover:text-primaryLight hover:translate-x-1 cursor-pointer transition-all">Privacy</li>
                     <li onClick={() => setActiveModal('terms')} className="hover:text-primaryLight hover:translate-x-1 cursor-pointer transition-all">Terms</li>
                  </ul>
               </div>
            </div>
            <div className="border-t border-white/10 pt-8 text-center text-sm text-textMuted animate-fade-in [animation-delay:400ms]">
               © 2026 SkillVerse Inc. All rights reserved.
            </div>
         </div>
      </footer>

      {/* MODALS */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md animate-fade-in" onClick={closeModal} />
          
          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-6xl mx-auto max-h-[90vh] overflow-y-auto rounded-3xl no-scrollbar">
            
            {/* CLOSE BUTTON */}
            <button 
              onClick={closeModal}
              className="fixed top-6 right-6 z-[110] p-2 rounded-full bg-black/10 hover:bg-black/20 text-textMain dark:bg-black/50 dark:hover:bg-black/70 dark:text-white transition-colors border border-black/10 dark:border-white/10"
            >
              <X size={24} />
            </button>

            {/* FEATURES MODAL */}
            {activeModal === 'features' && (
              <div className="bg-background border border-black/5 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
                <div className="p-6 md:p-12">
                   <div className="text-center mb-8 md:mb-12 pt-8">
                      <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primaryLight text-sm font-semibold mb-4">
                        🧠 Platform Overview
                      </div>
                      <h2 className="text-2xl md:text-5xl font-display font-bold text-textMain mb-4">
                        Everything you need to <span className="bg-gradient-main bg-clip-text text-transparent">master your craft.</span>
                      </h2>
                      <p className="text-textMuted max-w-2xl mx-auto text-base md:text-lg">
                        SkillVerse combines advanced pedagogy with gamified learning to ensure you not only learn but retain and apply knowledge.
                      </p>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                      <FeatureCard 
                        icon={BarChart} 
                        title="Smart Analytics" 
                        desc="Visualize your learning curve with granular data on time spent, quiz performance, and weak areas." 
                        delay="delay-[0ms]"
                      />
                      <FeatureCard 
                        icon={Zap} 
                        title="Adaptive Quizzes" 
                        desc="Our difficulty engine adjusts questions in real-time based on your streak and confidence levels." 
                        delay="delay-[100ms]"
                      />
                      <FeatureCard 
                        icon={Trophy} 
                        title="Gamification & XP" 
                        desc="Earn XP, maintain streaks, and unlock badges to stay motivated and compete on the global leaderboard." 
                        delay="delay-[200ms]"
                      />
                      <FeatureCard 
                        icon={Shield} 
                        title="Pro Certificates" 
                        desc="Blockchain-secured, verifiable certificates that employers can trust. Export to LinkedIn in one click." 
                        delay="delay-[300ms]"
                      />
                      <FeatureCard 
                        icon={Bot} 
                        title="AI Learning Assistant" 
                        desc="Stuck on a concept? Get 24/7 personalized explanations and code examples from your AI mentor." 
                        delay="delay-[400ms]"
                      />
                      <FeatureCard 
                        icon={Briefcase} 
                        title="Career Mode" 
                        desc="Simulate real-world junior developer tasks and build a portfolio-ready project library." 
                        delay="delay-[500ms]"
                      />
                   </div>

                   <div className="mt-12 text-center pb-8">
                      <button 
                        onClick={handleGetStarted}
                        className="px-8 py-3 md:px-10 md:py-4 rounded-xl bg-gradient-main text-white font-bold text-lg md:text-xl shadow-lg hover:shadow-primary/40 hover:-translate-y-1 transition-all"
                      >
                        Start Your Journey Free
                      </button>
                   </div>
                </div>
              </div>
            )}

            {/* CERTIFICATES MODAL */}
            {activeModal === 'certificates' && (
              <div className="bg-background border border-black/5 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up flex flex-col lg:flex-row">
                 {/* Left Content */}
                 <div className="lg:w-1/2 p-6 md:p-12 flex flex-col justify-center pt-12 md:pt-12">
                    <div className="inline-block self-start px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm font-bold mb-6">
                       🎓 Professional Verification
                    </div>
                    <h2 className="text-2xl md:text-5xl font-display font-bold text-textMain mb-6">
                       Credentials that <br/> <span className="text-[#F5C97A]">Open Doors.</span>
                    </h2>
                    <p className="text-textMuted text-base md:text-lg mb-8">
                       Stop guessing if you're ready. Our certificates prove you've mastered the material through rigorous testing.
                    </p>

                    <div className="space-y-6 mb-8">
                       <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-[#1E293B] flex items-center justify-center shrink-0">
                             <FileCheck className="text-primaryLight" size={24} />
                          </div>
                          <div>
                             <h4 className="font-bold text-textMain text-lg">HR-Ready Design</h4>
                             <p className="text-sm text-textMuted">Optimized for ATS scanners and human recruiters alike.</p>
                          </div>
                       </div>
                       <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-[#1E293B] flex items-center justify-center shrink-0">
                             <Fingerprint className="text-primaryLight" size={24} />
                          </div>
                          <div>
                             <h4 className="font-bold text-textMain text-lg">Unique Verification ID</h4>
                             <p className="text-sm text-textMuted">Every certificate has a unique permanent ID for instant validation.</p>
                          </div>
                       </div>
                       <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-[#1E293B] flex items-center justify-center shrink-0">
                             <Download className="text-primaryLight" size={24} />
                          </div>
                          <div>
                             <h4 className="font-bold text-textMain text-lg">Instant PDF Download</h4>
                             <p className="text-sm text-textMuted">High-resolution vector PDFs ready for print or digital sharing.</p>
                          </div>
                       </div>
                    </div>

                    <button 
                       onClick={handleGetStarted}
                       className="self-start px-8 py-3 rounded-xl bg-textMain text-background font-bold text-lg hover:opacity-90 transition-opacity"
                    >
                       Get Certified Now
                    </button>
                 </div>

                 {/* Right Content - Visual */}
                 <div className="lg:w-1/2 bg-black/5 dark:bg-[#1E293B] p-6 md:p-12 flex items-center justify-center relative overflow-hidden min-h-[400px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
                    
                    {/* Floating elements */}
                    <div className="absolute top-10 right-10 animate-float">
                       <Sparkles className="text-yellow-400" size={32} />
                    </div>
                    <div className="absolute bottom-10 left-10 animate-float [animation-delay:1000ms]">
                       <Award className="text-primaryLight" size={48} />
                    </div>

                    {/* Certificate Preview Reused */}
                    <CertificatePreview className="transform scale-90 md:scale-100" />
                 </div>
              </div>
            )}

            {/* PRICING MODAL */}
            {activeModal === 'pricing' && (
              <div className="max-w-4xl mx-auto bg-background border border-black/5 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
                 <div className="text-center p-8 md:p-12 pb-6 pt-12">
                    <h2 className="text-2xl md:text-5xl font-display font-bold text-textMain mb-4">
                       Simple, Transparent Pricing
                    </h2>
                    <p className="text-textMuted text-base md:text-lg">
                       Invest in your future without breaking the bank.
                    </p>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 p-6 md:p-12 pt-0">
                    {/* Free Plan */}
                    <div className="bg-black/5 dark:bg-white/5 border-2 border-primaryLight rounded-2xl p-6 md:p-8 relative transform hover:-translate-y-2 transition-transform duration-300">
                       <div className="absolute top-0 right-0 bg-primaryLight text-[#0B1220] text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl animate-pulse">
                          FREE FOREVER
                       </div>
                       <h3 className="text-2xl font-bold text-textMain mb-2">Starter</h3>
                       <div className="text-3xl font-bold text-textMain mb-6">$0 <span className="text-sm font-normal text-textMuted">/mo</span></div>
                       <ul className="space-y-4 mb-8">
                          {['Access to basic courses', 'Community support', 'Basic quizzes', 'Mobile access'].map((item, i) => (
                             <li key={i} className="flex items-center gap-3 text-textMuted text-sm">
                                <CheckCircle size={16} className="text-primaryLight" /> {item}
                             </li>
                          ))}
                       </ul>
                       <button onClick={handleGetStarted} className="w-full py-3 rounded-xl border border-primaryLight text-primaryLight font-bold hover:bg-primaryLight hover:text-[#0B1220] transition-colors">
                          Get Started
                       </button>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-gradient-to-br from-[#0B1220] to-[#1E293B] dark:from-[#1E293B] dark:to-[#0B1220] border-2 border-[#F5C97A] rounded-2xl p-6 md:p-8 relative transform hover:-translate-y-2 transition-transform duration-300 shadow-2xl">
                       <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#F5C97A] text-[#0B1220] text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                          MOST POPULAR
                       </div>
                       <h3 className="text-2xl font-bold text-white mb-2">Pro Scholar</h3>
                       <div className="text-3xl font-bold text-white mb-6">$12 <span className="text-sm font-normal text-gray-400">/mo</span></div>
                       <ul className="space-y-4 mb-8">
                          {['Unlimited course access', 'Verified Certificates', 'AI Tutor (Unlimited)', 'Career Mode Access', 'Priority Support'].map((item, i) => (
                             <li key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                                <CheckCircle size={16} className="text-[#F5C97A]" /> {item}
                             </li>
                          ))}
                       </ul>
                       <button onClick={handleGetStarted} className="w-full py-3 rounded-xl bg-[#F5C97A] text-[#0B1220] font-bold hover:bg-white transition-colors">
                          Upgrade Now
                       </button>
                    </div>
                 </div>
              </div>
            )}

            {/* DOCUMENTATION MODAL */}
            {activeModal === 'documentation' && (
              <div className="max-w-4xl mx-auto bg-background border border-black/5 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up p-8 md:p-12">
                  <div className="flex items-center gap-4 mb-8">
                      <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                          <BookOpen size={24} />
                      </div>
                      <h2 className="text-3xl font-bold text-textMain">Documentation</h2>
                  </div>
                  <div className="space-y-4">
                      <AccordionItem 
                        title="Getting Started with SkillVerse"
                        content="Welcome to SkillVerse! To begin, simply create a free account. Once logged in, you can browse courses by category (Programming, DSA, Design) or use the search bar to find specific topics. Your progress is automatically saved as you navigate through notes and quizzes."
                        isOpen={openAccordion === 'doc-1'}
                        onClick={() => toggleAccordion('doc-1')}
                      />
                      <AccordionItem 
                        title="How do Certificates work?"
                        content="Certificates are awarded upon achieving a score of 70% or higher in the final quiz of any course. Once earned, certificates can be downloaded as a PDF from your profile or the 'Certifications' tab. Each certificate contains a unique ID that can be verified by employers."
                        isOpen={openAccordion === 'doc-2'}
                        onClick={() => toggleAccordion('doc-2')}
                      />
                      <AccordionItem 
                        title="Using the AI Tutor"
                        content="Every course includes a built-in AI Tutor. You can access it by clicking the sparkle icon in the bottom right corner of the course view. You can ask for simplified explanations, code examples, or practice questions. The AI is context-aware and knows which course you are currently studying."
                        isOpen={openAccordion === 'doc-3'}
                        onClick={() => toggleAccordion('doc-3')}
                      />
                       <AccordionItem 
                        title="Career Mode Features"
                        content="Career Mode is a specialized section for interview preparation. It allows you to select target companies (like Google, Amazon, etc.) and practice real interview questions. It includes a mock interview simulator that times your responses and tracks your readiness score."
                        isOpen={openAccordion === 'doc-4'}
                        onClick={() => toggleAccordion('doc-4')}
                      />
                  </div>
              </div>
            )}

            {/* SUPPORT MODAL */}
            {activeModal === 'support' && (
               <div className="max-w-3xl mx-auto bg-background border border-black/5 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up p-8 md:p-12">
                   <div className="text-center mb-10">
                       <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                           <HelpCircle size={32} className="text-primaryLight" />
                       </div>
                       <h2 className="text-3xl font-bold text-textMain mb-2">Help Center</h2>
                       <p className="text-textMuted">Frequently asked questions and support channels.</p>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                       <a href="mailto:support@skillverse.com" className="flex items-center gap-4 p-4 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors border border-black/5 dark:border-white/5 group">
                           <div className="p-3 bg-white dark:bg-black/20 rounded-lg group-hover:scale-110 transition-transform">
                               <Mail className="text-textMain" size={24} />
                           </div>
                           <div>
                               <div className="font-bold text-textMain">Email Support</div>
                               <div className="text-xs text-textMuted">Get a response in 24h</div>
                           </div>
                       </a>
                       <button className="flex items-center gap-4 p-4 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors border border-black/5 dark:border-white/5 group">
                            <div className="p-3 bg-white dark:bg-black/20 rounded-lg group-hover:scale-110 transition-transform">
                               <Bot className="text-textMain" size={24} />
                           </div>
                           <div>
                               <div className="font-bold text-textMain">Ask AI Assistant</div>
                               <div className="text-xs text-textMuted">Instant answers</div>
                           </div>
                       </button>
                   </div>

                   <div className="space-y-4">
                       <h3 className="font-bold text-textMain ml-1 mb-4">Frequently Asked Questions</h3>
                       <AccordionItem 
                           title="How do certificates work?"
                           content="Our certificates are cryptographically signed and verifiable. Once you pass the final exam of a course with 70% or higher, a unique certificate ID is generated. You can download it as a PDF or share the link directly on LinkedIn."
                           isOpen={openAccordion === 'sup-1'}
                           onClick={() => toggleAccordion('sup-1')}
                       />
                       <AccordionItem 
                           title="How do I reset my progress?"
                           content="You can reset your progress for individual courses or your entire account in the Settings page under the 'Account' tab. Be careful, as this action cannot be undone."
                           isOpen={openAccordion === 'sup-2'}
                           onClick={() => toggleAccordion('sup-2')}
                       />
                       <AccordionItem 
                           title="Can I access courses offline?"
                           content="Currently, SkillVerse requires an active internet connection to track progress and serve dynamic content. We are working on a mobile app that will support offline downloads in Q4 2025."
                           isOpen={openAccordion === 'sup-3'}
                           onClick={() => toggleAccordion('sup-3')}
                       />
                   </div>
               </div>
            )}

            {/* PRIVACY MODAL */}
            {activeModal === 'privacy' && (
                <div className="max-w-4xl mx-auto bg-background border border-black/5 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up p-8 md:p-12">
                   <div className="text-center mb-10">
                       <h2 className="text-3xl font-bold text-textMain mb-4">Privacy Policy</h2>
                       <p className="text-textMuted">Transparent, secure, and user-centric.</p>
                   </div>

                   <div className="space-y-8">
                       <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 animate-fade-in">
                          <Shield size={24} />
                          <span className="font-bold">Your data stays on your device</span>
                       </div>

                       {[
                          { title: "Data Stored Locally", content: "We use local storage technologies to ensure your progress is saved instantly without server latency. Your quiz scores and preferences primarily reside on your device." },
                          { title: "No Third-Party Tracking", content: "Your learning habits are your business. We do not sell or share your behavioral data with advertisers or third-party brokers." },
                          { title: "User Control", content: "You maintain full ownership of your data. You can export, reset, or permanently clear your learning history at any time from the Settings menu." }
                       ].map((s, i) => (
                          <div key={i} className="animate-fade-in-up group" style={{ animationDelay: `${i * 100}ms` }}>
                             <h3 className="font-bold text-textMain mb-2 text-lg">{s.title}</h3>
                             <p className="text-textMuted leading-relaxed">{s.content}</p>
                             <div className="h-px bg-gradient-to-r from-primary/50 to-transparent mt-6 w-0 group-hover:w-full transition-all duration-1000 ease-out"></div>
                          </div>
                       ))}
                   </div>
                </div>
            )}

            {/* TERMS MODAL */}
            {activeModal === 'terms' && (
                <div className="max-w-4xl mx-auto bg-background border border-black/5 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up p-8 md:p-12 flex flex-col h-[70vh]">
                   <h2 className="text-3xl font-bold text-textMain mb-6 shrink-0">Terms of Service</h2>
                   
                   <div className="relative flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-8 pb-10">
                       <section>
                           <h3 className="font-bold text-textMain text-lg mb-2">1. Usage Guidelines</h3>
                           <p className="text-textMuted leading-relaxed">
                               SkillVerse is provided for personal educational use only. You agree not to distribute, scrape, or reverse-engineer course materials. Account sharing is prohibited to ensure certification integrity.
                           </p>
                       </section>
                       
                       <section>
                           <h3 className="font-bold text-textMain text-lg mb-2">2. Certificate Disclaimer</h3>
                           <p className="text-textMuted leading-relaxed">
                               While our certificates verify completion of rigorous curriculum and assessments, they do not guarantee employment or university credit. They are professional development credentials designed to demonstrate skill proficiency.
                           </p>
                       </section>

                       <section>
                           <h3 className="font-bold text-textMain text-lg mb-2">3. Educational Purpose</h3>
                           <p className="text-textMuted leading-relaxed">
                               All code examples, quizzes, and career mode simulations are for learning purposes. We are not responsible for errors in your own production code resulting from platform examples.
                           </p>
                       </section>

                       <section>
                           <h3 className="font-bold text-textMain text-lg mb-2">4. Future Updates</h3>
                           <p className="text-textMuted leading-relaxed">
                               We reserve the right to update curriculum, pricing, and features to match industry standards. Significant changes to terms will be communicated via the platform notification system.
                           </p>
                       </section>

                       {/* Fade Indicator */}
                       <div className="sticky bottom-0 left-0 w-full h-12 bg-gradient-to-t from-background to-transparent pointer-events-none flex items-end justify-center">
                           <ChevronDown className="text-textMuted animate-bounce" />
                       </div>
                   </div>
                </div>
            )}

            {/* BLOG MODAL */}
            {activeModal === 'blog' && (
                <div className="max-w-5xl mx-auto bg-background border border-black/5 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up p-8 md:p-12">
                    <div className="flex justify-between items-end mb-8">
                       <div>
                          <h2 className="text-3xl font-bold text-textMain mb-2">SkillVerse Blog</h2>
                          <p className="text-textMuted">Community-driven insights and learning strategies.</p>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { 
                                title: 'How to Learn DSA Effectively', 
                                desc: 'Strategies to master data structures without burning out.',
                                date: 'Oct 20, 2025', 
                                read: '6 min read', 
                                cat: 'DSA',
                                link: 'https://www.freecodecamp.org/news/learn-data-structures-and-algorithms/' 
                            },
                            { 
                                title: 'Building Consistency as a Developer', 
                                desc: 'Why showing up everyday matters more than intensity.',
                                date: 'Oct 18, 2025', 
                                read: '4 min read', 
                                cat: 'Career',
                                link: 'https://jamesclear.com/habit-guide' 
                            },
                            { 
                                title: 'UI vs UX for Beginners', 
                                desc: 'Understanding the difference and how they work together.',
                                date: 'Oct 15, 2025', 
                                read: '5 min read', 
                                cat: 'Design',
                                link: 'https://www.nngroup.com/articles/' 
                            },
                            { 
                                title: 'The Future of AI in Education', 
                                desc: 'How LLMs are reshaping the way we learn to code.',
                                date: 'Oct 08, 2025', 
                                read: '8 min read', 
                                cat: 'AI',
                                link: 'https://openai.com/blog' 
                            }
                        ].map((post, i) => (
                            <a 
                                key={i} 
                                href={post.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group cursor-pointer rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
                            >
                                <div className="h-48 bg-black/10 dark:bg-white/10 flex items-center justify-center text-textMuted/50 relative overflow-hidden">
                                   <FileText size={48} className="group-hover:scale-110 transition-transform duration-500" />
                                   <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xs font-bold text-primaryLight uppercase tracking-wider">{post.cat}</span>
                                        <span className="text-xs text-textMuted">• {post.date}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-textMain mb-2 group-hover:text-primaryLight transition-colors">{post.title}</h3>
                                    <p className="text-sm text-textMuted mb-4 line-clamp-2">{post.desc}</p>
                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-xs text-textMuted">{post.read}</span>
                                        <div className="flex items-center gap-1 text-textMain text-sm font-medium group-hover:translate-x-1 transition-transform">
                                            Read Article <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* BRAND MODAL (Our Story) */}
            {activeModal === 'brand' && (
               <div className="max-w-4xl mx-auto bg-background border border-black/5 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
                  <div className="relative p-12 md:p-16 text-center overflow-hidden">
                      {/* Animated Gradient BG */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 animate-pulse-slow"></div>
                      
                      <div className="relative z-10 flex flex-col items-center">
                          <StylishLogo size={80} className="mb-8" />
                          
                          <h2 className="text-4xl md:text-5xl font-display font-bold text-textMain mb-6 leading-tight">
                              Built for learners,<br/>
                              <span className="bg-gradient-main bg-clip-text text-transparent">by learners.</span>
                          </h2>
                          
                          <p className="text-xl text-textMuted max-w-2xl mx-auto leading-relaxed mb-10">
                              Our vision is to democratize elite-level tech education. We believe tuition shouldn't be a barrier to a tech career. 
                              SkillVerse bridges the gap between self-study and professional mastery with tools that adapt to you.
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl mb-12">
                              <div className="p-4 rounded-2xl bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-black/5 dark:border-white/10">
                                  <div className="text-3xl font-bold text-textMain mb-1">10k+</div>
                                  <div className="text-xs text-textMuted uppercase tracking-wider">Students</div>
                              </div>
                              <div className="p-4 rounded-2xl bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-black/5 dark:border-white/10">
                                  <div className="text-3xl font-bold text-textMain mb-1">50+</div>
                                  <div className="text-xs text-textMuted uppercase tracking-wider">Courses</div>
                              </div>
                              <div className="p-4 rounded-2xl bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-black/5 dark:border-white/10">
                                  <div className="text-3xl font-bold text-textMain mb-1">98%</div>
                                  <div className="text-xs text-textMuted uppercase tracking-wider">Hired</div>
                              </div>
                          </div>

                          <div className="inline-block px-4 py-1.5 rounded-full border border-black/10 dark:border-white/10 text-xs font-mono text-textMuted">
                              v1.0.4 • Stable Release
                          </div>
                      </div>
                  </div>
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};