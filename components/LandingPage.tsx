import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, CheckCircle, Award, Zap, BarChart, Shield, 
  PlayCircle, BookOpen, X, Trophy, Briefcase, 
  Bot, FileCheck, Fingerprint, Download, Sparkles, Check,
  ChevronDown, HelpCircle, Mail, FileText, Globe, Server, 
  HardDrive, Users, Eye, Heart, Layout, Code2, LineChart, Target, Calendar,
  TrendingUp, Activity, Terminal
} from 'lucide-react';
import { GoldSnow } from './GoldSnow';

interface LandingPageProps {
  onGetStarted: () => void;
}

const StylishLogo: React.FC<{ size?: number, className?: string }> = ({ size = 40, className = "" }) => {
  const getContainerClass = () => {
     if (size === 32) return "w-8 h-8";
     if (size === 36) return "w-9 h-9";
     return "w-12 h-12";
  };

  return (
  <div className={`relative group cursor-pointer ${className} ${getContainerClass()}`}>
    <div className="absolute inset-0 bg-gradient-main rounded-xl blur-lg opacity-40 group-hover:opacity-80 transition-opacity duration-500 animate-pulse-slow"></div>
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 group-hover:ring-primaryLight/50 transition-all duration-300 group-hover:scale-105">
       <img src="/skillverse-logo.png" alt="SkillVerse Logo" className="w-full h-full object-cover" />
    </div>
  </div>
  );
};

// --------------------------------------------------------------------------------
// FRAMER MOTION UTILS
// --------------------------------------------------------------------------------
const staggerContainer: any = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const fadeInUp: any = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } }
};

const blurReveal: any = {
  hidden: { opacity: 0, filter: "blur(20px)", scale: 0.95 },
  show: { opacity: 1, filter: "blur(0px)", scale: 1, transition: { duration: 0.8, ease: "easeOut" } }
};

// Magnetic Button Wrapper
const MagneticButton: React.FC<{ children: React.ReactNode, onClick: () => void, className?: string }> = ({ children, onClick, className }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
};

// 3D Tilt Card Wrapper
const TiltCard: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// --------------------------------------------------------------------------------
// COMPLEX DASHBOARD MOCKUP (Hero Graphic)
// --------------------------------------------------------------------------------
const FloatingDashboard = () => {
  return (
    <TiltCard className="relative w-full max-w-5xl mx-auto h-[600px] mt-16 perspective-1000 z-20 hidden lg:block">
       <div className="w-full h-full bg-[#03060C]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-primary/20 flex overflow-hidden">
          
          {/* Sidebar */}
          <div className="w-64 h-full border-r border-white/5 p-6 flex flex-col gap-8 bg-black/20">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-main" />
                <div className="w-24 h-4 bg-white/10 rounded" />
             </div>
             
             <div className="space-y-4">
                <div className="w-full h-8 bg-white/10 rounded-lg flex items-center px-3 gap-3">
                   <Layout size={16} className="text-primaryLight" />
                   <div className="w-16 h-3 bg-white/20 rounded" />
                </div>
                {[BookOpen, Trophy, Target, Calendar].map((Icon, i) => (
                   <div key={i} className="w-full h-8 flex items-center px-3 gap-3 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
                      <Icon size={16} className="text-white" />
                      <div className="w-20 h-3 bg-white/10 rounded" />
                   </div>
                ))}
             </div>

             <div className="mt-auto p-4 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20">
                <div className="w-10 h-10 rounded-full bg-primary/30 mb-3 flex items-center justify-center">
                   <Sparkles size={18} className="text-primaryLight" />
                </div>
                <div className="text-sm font-bold text-white mb-1">Upgrade to Pro</div>
                <div className="text-xs text-textMuted mb-3">Unlock all AI features</div>
                <div className="w-full h-6 bg-white/10 rounded" />
             </div>
          </div>

          {/* Main Area */}
          <div className="flex-1 p-8 flex flex-col gap-6 relative">
             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

             {/* Header */}
             <div className="flex justify-between items-center z-10">
                <div>
                   <div className="text-2xl font-bold text-white mb-1">Welcome back, Alex</div>
                   <div className="text-sm text-textMuted">You're on a 14-day learning streak! 🔥</div>
                </div>
                <div className="flex gap-3">
                   <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                      <BellIcon />
                   </div>
                   <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500" />
                </div>
             </div>

             {/* Top Stats */}
             <div className="grid grid-cols-3 gap-4 z-10">
                {[
                   { icon: Activity, title: 'XP Earned', val: '12,450', color: 'text-green-400', bg: 'bg-green-400/10' },
                   { icon: Code2, title: 'Problems Solved', val: '342', color: 'text-blue-400', bg: 'bg-blue-400/10' },
                   { icon: Award, title: 'Certificates', val: '4', color: 'text-yellow-400', bg: 'bg-yellow-400/10' }
                ].map((stat, i) => (
                   <motion.div 
                      key={i}
                      whileHover={{ y: -5 }}
                      className="p-5 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-3 backdrop-blur-sm"
                   >
                      <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                         <stat.icon size={20} className={stat.color} />
                      </div>
                      <div>
                         <div className="text-sm text-textMuted">{stat.title}</div>
                         <div className="text-2xl font-bold text-white">{stat.val}</div>
                      </div>
                   </motion.div>
                ))}
             </div>

             {/* Bottom Grid */}
             <div className="flex gap-4 flex-1 z-10">
                {/* Main Graph Area */}
                <div className="flex-1 rounded-xl bg-white/5 border border-white/5 p-6 flex flex-col">
                   <div className="flex justify-between items-center mb-6">
                      <div className="text-white font-bold">Performance Analytics</div>
                      <div className="flex gap-2">
                         <div className="w-16 h-6 rounded bg-white/10" />
                         <div className="w-16 h-6 rounded bg-primary/20" />
                      </div>
                   </div>
                   {/* Fake Graph */}
                   <div className="flex-1 flex items-end gap-2 px-2 relative">
                      {[40, 65, 45, 80, 55, 90, 70, 100, 85].map((h, i) => (
                         <div key={i} className="flex-1 flex flex-col justify-end gap-2 group">
                            <motion.div 
                               initial={{ height: 0 }}
                               animate={{ height: `${h}%` }}
                               transition={{ delay: 0.5 + (i * 0.1), type: "spring" }}
                               className="w-full bg-gradient-to-t from-primary/40 to-primaryLight rounded-t-md opacity-80 group-hover:opacity-100 transition-opacity relative"
                            >
                               <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                  {h}xp
                               </div>
                            </motion.div>
                         </div>
                      ))}
                   </div>
                </div>

                {/* AI Assistant Chat Preview */}
                <div className="w-72 rounded-xl bg-white/5 border border-white/5 p-4 flex flex-col">
                   <div className="flex items-center gap-2 mb-4">
                      <Bot size={18} className="text-primaryLight" />
                      <div className="text-white font-bold text-sm">SkillVerse AI</div>
                   </div>
                   <div className="flex-1 space-y-4 overflow-hidden">
                      <div className="w-4/5 p-3 rounded-xl bg-white/10 text-xs text-white self-end ml-auto">
                         Can you explain React Server Components?
                      </div>
                      <div className="w-11/12 p-3 rounded-xl bg-primary/20 border border-primary/30 text-xs text-white">
                         Sure! RSCs allow you to render components on the server...
                         <div className="mt-2 w-full h-12 bg-black/40 rounded border border-white/5 font-mono text-[8px] p-2 text-green-400">
                            export default async function Page() &#123;<br/>
                            &nbsp;&nbsp;const data = await fetch()...<br/>
                            &#125;
                         </div>
                      </div>
                   </div>
                   <div className="w-full h-10 mt-auto bg-white/5 rounded-lg border border-white/10 flex items-center px-3">
                      <div className="w-4 h-4 rounded-full bg-white/20 animate-pulse" />
                   </div>
                </div>
             </div>

          </div>
       </div>
    </TiltCard>
  );
};

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

// --------------------------------------------------------------------------------
// BENTO GRID (Platform Features)
// --------------------------------------------------------------------------------
const BentoGrid = () => {
   return (
      <section className="py-32 px-6 relative max-w-7xl mx-auto">
         <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
         >
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">Built for the top 1%</h2>
            <p className="text-xl text-textMuted max-w-2xl mx-auto">
               Everything you need to master your craft, engineered with precision and speed.
            </p>
         </motion.div>

         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[250px]">
            
            {/* Bento Box 1: Analytics (Span 2 col, 2 row) */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="md:col-span-2 md:row-span-2 rounded-3xl bg-glass border border-white/10 p-8 flex flex-col relative overflow-hidden group hover:border-white/20 transition-colors"
            >
               <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
               <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6">
                     <BarChart size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Granular Analytics</h3>
                  <p className="text-textMuted max-w-md">Track every keystroke, quiz score, and concept mastery with real-time heatmaps and velocity graphs.</p>
               </div>
               {/* Visual Mockup */}
               <div className="absolute bottom-0 right-0 w-[80%] h-[50%] bg-black/40 border-t border-l border-white/10 rounded-tl-2xl p-6 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500">
                  <div className="w-full h-full flex items-end gap-3">
                     {[30, 45, 60, 40, 80, 55, 95, 75].map((h, i) => (
                        <motion.div 
                           key={i}
                           initial={{ height: 0 }}
                           whileInView={{ height: `${h}%` }}
                           transition={{ duration: 1, delay: i * 0.1 }}
                           viewport={{ once: true }}
                           className="flex-1 bg-gradient-to-t from-blue-500/20 to-blue-400 rounded-t-lg"
                        />
                     ))}
                  </div>
               </div>
            </motion.div>

            {/* Bento Box 2: AI Assistant (Span 1 col, 2 row) */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="md:col-span-1 md:row-span-2 rounded-3xl bg-glass border border-white/10 p-8 flex flex-col relative overflow-hidden group hover:border-white/20 transition-colors"
            >
               <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
               <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6">
                  <Bot size={24} />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">AI Mentor</h3>
               <p className="text-textMuted text-sm">24/7 personalized explanations and code debugging.</p>
               
               <div className="mt-8 flex-1 w-full flex flex-col gap-3">
                  <div className="w-4/5 p-3 rounded-xl bg-white/5 text-xs text-textMuted self-end">Fix my loop?</div>
                  <div className="w-[90%] p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200">
                     You have an off-by-one error. Change <code className="bg-black/30 px-1 rounded">i &lt;= len</code> to <code className="bg-black/30 px-1 rounded">i &lt; len</code>.
                  </div>
               </div>
            </motion.div>

            {/* Bento Box 3: Certificates (Span 1 col, 1 row) */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="md:col-span-1 md:row-span-1 rounded-3xl bg-glass border border-white/10 p-8 flex flex-col relative overflow-hidden group hover:border-white/20 transition-colors justify-center items-center text-center"
            >
               <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent pointer-events-none" />
               <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-400 mb-4 group-hover:rotate-12 transition-transform duration-500">
                  <Award size={32} />
               </div>
               <h3 className="text-lg font-bold text-white mb-1">Verified Certs</h3>
               <p className="text-xs text-textMuted">Blockchain-backed proof.</p>
            </motion.div>

            {/* Bento Box 4: Terminal Mode (Span 2 col, 1 row) */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: 0.3 }}
               className="md:col-span-2 lg:col-span-1 md:row-span-1 rounded-3xl bg-black border border-white/10 p-6 flex flex-col relative overflow-hidden group hover:border-white/20 transition-colors"
            >
               <div className="flex items-center gap-2 mb-4 opacity-50">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
               </div>
               <div className="font-mono text-sm text-green-400 opacity-80">
                  <p>$ npx skillverse start</p>
                  <motion.p 
                     initial={{ opacity: 0 }}
                     whileInView={{ opacity: 1 }}
                     transition={{ delay: 0.5 }}
                  >
                     &gt; Initializing environment...
                  </motion.p>
                  <motion.p 
                     initial={{ opacity: 0 }}
                     whileInView={{ opacity: 1 }}
                     transition={{ delay: 1 }}
                  >
                     &gt; Ready to code.
                  </motion.p>
               </div>
            </motion.div>

         </div>
      </section>
   );
};

// --------------------------------------------------------------------------------
// ANIMATED TIMELINE (How It Works)
// --------------------------------------------------------------------------------
const AnimatedTimeline = () => {
   const containerRef = useRef<HTMLDivElement>(null);
   const { scrollYProgress } = useScroll({
     target: containerRef,
     offset: ["start center", "end center"]
   });

   const steps = [
      { num: '01', title: 'Choose Your Stack', desc: 'Select from carefully curated tracks in Programming, Design, or Data Science. No fluff, just industry-standard curriculum.' },
      { num: '02', title: 'Interactive Learning', desc: 'Read concise notes, watch micro-lectures, and immediately test your knowledge with adaptive quizzes that scale to your level.' },
      { num: '03', title: 'Earn Credentials', desc: 'Pass the rigorous final exams to mint a verifiable, cryptographic certificate that recruiters trust.' }
   ];

   return (
      <section ref={containerRef} className="py-32 px-6 relative max-w-5xl mx-auto">
         <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">The Path to Mastery</h2>
         </div>

         <div className="relative">
            {/* Glowing Scroll Line */}
            <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-[2px] bg-white/5 -translate-x-1/2">
               <motion.div 
                  className="w-full bg-gradient-to-b from-primaryLight via-primary to-transparent"
                  style={{ height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]), transformOrigin: "top" }}
               />
            </div>

            <div className="space-y-24">
               {steps.map((step, i) => (
                  <motion.div 
                     key={i}
                     initial={{ opacity: 0, y: 50 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true, margin: "-100px" }}
                     transition={{ duration: 0.6, type: "spring" }}
                     className={`flex flex-col md:flex-row gap-8 md:gap-16 items-start md:items-center relative z-10 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                  >
                     <div className={`flex-1 ${i % 2 !== 0 ? 'md:text-right' : ''}`}>
                        <h3 className="text-3xl font-bold text-white mb-4">{step.title}</h3>
                        <p className="text-textMuted text-lg leading-relaxed">{step.desc}</p>
                     </div>
                     <div className="w-14 h-14 rounded-full bg-[#050911] border-2 border-primary/30 flex items-center justify-center font-display font-bold text-primaryLight shadow-[0_0_20px_rgba(var(--color-primary),0.3)] shrink-0 z-10">
                        {step.num}
                     </div>
                     <div className="flex-1 hidden md:block" />
                  </motion.div>
               ))}
            </div>
         </div>
      </section>
   );
};

// --------------------------------------------------------------------------------
// CERTIFICATE COMPONENT REUSED & ENHANCED
// --------------------------------------------------------------------------------
const CertificatePreview: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`relative w-full max-w-[550px] aspect-[1.414/1] bg-gradient-to-br from-[#0B1220] to-[#1E293B] shadow-2xl flex flex-col items-center justify-between overflow-hidden rounded-lg border-4 border-[#F5C97A]/20 select-none ${className}`}>
    {/* Animated Shine Sweep */}
    <motion.div 
       animate={{ x: ["-100%", "200%"] }}
       transition={{ repeat: Infinity, duration: 3, ease: "linear", repeatDelay: 4 }}
       className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] z-50 pointer-events-none"
    />

    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[size:24px_24px]"></div>
    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#6968A6] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#CF9893] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
    
    <div className="absolute inset-2 border border-[#F5C97A]/40 rounded pointer-events-none"></div>
    <div className="absolute inset-3 border-2 border-dotted border-[#6968A6]/30 rounded pointer-events-none"></div>

    <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#F5C97A] rounded-tl-xl"></div>
    <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#F5C97A] rounded-tr-xl"></div>
    <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#F5C97A] rounded-bl-xl"></div>
    <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#F5C97A] rounded-br-xl"></div>

    <div className="text-center w-full relative z-10 mt-6">
       <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-6 h-6 rounded bg-gradient-main flex items-center justify-center text-[10px] font-bold text-white">SV</div>
          <span className="text-[10px] tracking-[0.2em] text-white uppercase font-bold">SkillVerse Academy</span>
       </div>
       <div className="font-display font-bold text-4xl text-[#F5C97A] uppercase tracking-widest drop-shadow-md">Certificate</div>
       <div className="text-[10px] font-light text-[#B9B6E3] uppercase tracking-[0.3em] mb-1">of Completion</div>
    </div>
    
    <div className="flex-1 flex flex-col justify-center items-center w-full relative z-10 -mt-2 px-4">
       <div className="text-[10px] text-gray-400 italic mb-1">This is to certify that</div>
       <div className="font-display font-bold text-3xl text-white mb-2 drop-shadow-sm text-center">
          Alex Morgan
       </div>
       <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#F5C97A] to-transparent mx-auto mb-3 opacity-60"></div>
       <div className="text-[10px] text-gray-400 italic mb-1">Has successfully demonstrated mastery in</div>
       <div className="font-bold text-xl text-[#6968A6] mb-3 text-center bg-gradient-to-r from-[#6968A6] to-[#CF9893] bg-clip-text text-transparent px-2">
          Advanced System Design
       </div>
    </div>
    
    <div className="w-full flex justify-between items-end relative z-10 px-8 pb-6">
       <div className="text-center">
          <div className="font-handwriting text-sm text-white opacity-90 mb-0.5 font-['cursive']">Sarah Jenkins</div>
          <div className="w-24 border-t border-[#6968A6]/50 pt-1">
             <p className="text-[8px] font-bold uppercase text-gray-500 tracking-wider">Instructor</p>
          </div>
       </div>
       
       <div className="relative -mb-4 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full border-2 border-[#F5C97A] flex items-center justify-center bg-[#0B1220] shadow-lg relative overflow-hidden">
             <div className="absolute inset-0 bg-[#F5C97A] opacity-10"></div>
             <Award className="text-[#F5C97A] w-6 h-6" />
          </div>
          <div className="mt-1 text-[8px] font-mono text-[#F5C97A]">ID: SV-882910</div>
       </div>
       
       <div className="text-center">
          <div className="text-[10px] text-[#F5C97A] mb-0.5 font-mono">Today</div>
          <div className="w-24 border-t border-[#6968A6]/50 pt-1">
             <p className="text-[8px] font-bold uppercase text-gray-500 tracking-wider">Date Issued</p>
          </div>
       </div>
    </div>
  </div>
);


// --------------------------------------------------------------------------------
// MAIN EXPORT
// --------------------------------------------------------------------------------
export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  useEffect(() => {
    if (activeModal) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [activeModal]);

  return (
    <div className="min-h-screen bg-[#03060C] text-textMain overflow-x-hidden font-sans selection:bg-primaryLight selection:text-background relative">
      <GoldSnow />
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[#03060C]/60 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StylishLogo size={36} />
            <span className="text-2xl font-display font-bold text-white tracking-tight">SkillVerse</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={onGetStarted} className="hidden md:block text-textMuted hover:text-white font-medium transition-colors">Log In</button>
            <MagneticButton onClick={onGetStarted} className="px-6 py-2.5 rounded-full bg-white text-black font-bold hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all flex items-center gap-2 group">
               Get Started <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </MagneticButton>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 lg:pt-48 pb-20 px-6 min-h-screen flex flex-col items-center">
        {/* Cinematic Background Glows */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-secondary/30 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

        <motion.div 
           variants={staggerContainer}
           initial="hidden"
           animate="show"
           className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-sm font-medium mb-8 backdrop-blur-md">
            <Sparkles size={16} className="text-primaryLight" /> SkillVerse 2.0 is Live
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl font-display font-bold mb-8 leading-[1.1] tracking-tighter text-white">
            Master engineering.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primaryLight via-primary to-secondary">Without the friction.</span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-textMuted max-w-2xl mx-auto mb-12 font-light">
            The enterprise-grade platform for learning, practicing, and proving your technical skills. Built for ambitious developers.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto">
            <MagneticButton 
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-shadow flex items-center justify-center gap-2 group"
            >
              Start Building <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </MagneticButton>
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-transparent border border-white/20 text-white font-bold text-lg hover:bg-white/5 transition-colors"
            >
              View Documentation
            </button>
          </motion.div>
        </motion.div>

        {/* 3D Floating Dashboard Mockup */}
        <motion.div 
           variants={blurReveal}
           initial="hidden"
           animate="show"
           className="w-full mt-24"
        >
           <FloatingDashboard />
        </motion.div>
      </section>

      <BentoGrid />
      <AnimatedTimeline />

      {/* CERTIFICATE SHOWCASE */}
      <section className="py-32 px-6 relative border-y border-white/5 bg-gradient-to-b from-transparent to-white/[0.02]">
         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
               <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
               >
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-bold text-sm mb-8">
                     <Shield size={16} /> Verified Credentials
                  </div>
                  <h2 className="text-5xl md:text-6xl font-display font-bold mb-6 text-white tracking-tight">
                     Prove it.<br/>
                     <span className="text-textMuted">On-chain & PDF.</span>
                  </h2>
                  <p className="text-xl text-textMuted mb-10 leading-relaxed font-light">
                     Every course culminates in a rigorous exam. Pass it, and earn a cryptographically verifiable certificate that integrates instantly with LinkedIn.
                  </p>
                  <button onClick={onGetStarted} className="px-8 py-4 rounded-full bg-white/10 text-white font-bold hover:bg-white hover:text-black transition-colors">
                     View Sample Certificate
                  </button>
               </motion.div>
            </div>
            
            <div className="lg:w-1/2 w-full flex justify-center">
               <TiltCard>
                  <CertificatePreview />
               </TiltCard>
            </div>
         </div>
      </section>

      {/* MASSIVE CTA */}
      <section className="py-40 px-6 text-center relative overflow-hidden">
         {/* Grid Background */}
         <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik00MCAwaC00MHY0MGg0MHoiLz48L2c+PC9zdmc+')] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] opacity-50" />
         
         <div className="max-w-4xl mx-auto relative z-10">
            <motion.h2 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="text-6xl md:text-8xl font-display font-bold mb-10 text-white tracking-tighter"
            >
               Ready to elevate<br/>your career?
            </motion.h2>
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="flex flex-col sm:flex-row justify-center gap-6"
            >
               <MagneticButton 
                 onClick={onGetStarted}
                 className="px-12 py-5 rounded-full bg-gradient-main text-white font-bold text-xl shadow-[0_0_40px_rgba(var(--color-primary),0.5)] hover:shadow-[0_0_60px_rgba(var(--color-primary),0.8)] transition-shadow"
               >
                 Create Free Account
               </MagneticButton>
               <button 
                 onClick={onGetStarted}
                 className="px-12 py-5 rounded-full bg-white/5 border border-white/10 text-white font-bold text-xl hover:bg-white/10 transition-colors"
               >
                 Contact Sales
               </button>
            </motion.div>
         </div>
      </section>

      {/* PRESERVED FOOTER */}
      <footer className="border-t border-white/10 bg-[#020408] pt-20 pb-10 px-6 relative z-10">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
               <div className="col-span-2 md:col-span-1">
                  <div className="flex items-center gap-2 mb-6">
                     <StylishLogo size={32} />
                     <span className="text-xl font-bold text-white tracking-tight">SkillVerse</span>
                  </div>
                  <p className="text-textMuted text-sm leading-relaxed">
                     Empowering the next generation of top-tier engineers. Built with precision.
                  </p>
               </div>
               <div>
                  <h4 className="font-bold text-white mb-6">Product</h4>
                  <ul className="space-y-4 text-sm text-textMuted">
                     <li className="hover:text-white cursor-pointer transition-colors">Features</li>
                     <li className="hover:text-white cursor-pointer transition-colors">Integrations</li>
                     <li className="hover:text-white cursor-pointer transition-colors">Pricing</li>
                     <li className="hover:text-white cursor-pointer transition-colors">Changelog</li>
                  </ul>
               </div>
               <div>
                  <h4 className="font-bold text-white mb-6">Resources</h4>
                  <ul className="space-y-4 text-sm text-textMuted">
                     <li className="hover:text-white cursor-pointer transition-colors">Documentation</li>
                     <li className="hover:text-white cursor-pointer transition-colors">API Reference</li>
                     <li className="hover:text-white cursor-pointer transition-colors">Blog</li>
                     <li className="hover:text-white cursor-pointer transition-colors">Community</li>
                  </ul>
               </div>
               <div>
                  <h4 className="font-bold text-white mb-6">Company</h4>
                  <ul className="space-y-4 text-sm text-textMuted">
                     <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
                     <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
                     <li className="hover:text-white cursor-pointer transition-colors">Privacy</li>
                     <li className="hover:text-white cursor-pointer transition-colors">Terms</li>
                  </ul>
               </div>
            </div>
            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-textMuted">
               <div>© 2026 SkillVerse Inc. All rights reserved.</div>
               <div className="flex gap-6 mt-4 md:mt-0">
                  <span className="hover:text-white cursor-pointer transition-colors">Twitter</span>
                  <span className="hover:text-white cursor-pointer transition-colors">GitHub</span>
                  <span className="hover:text-white cursor-pointer transition-colors">Discord</span>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
};