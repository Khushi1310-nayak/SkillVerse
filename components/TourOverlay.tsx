
import React, { useState, useEffect } from 'react';
import { 
  X, ChevronRight, ChevronLeft, 
  LayoutDashboard, BookOpen, Briefcase, 
  Award, Settings, CheckCircle, Zap, Star,
  BarChart, ArrowRight, MousePointer2
} from 'lucide-react';

interface TourOverlayProps {
  onClose: () => void;
}

const SLIDES = [
  {
    id: 'overview',
    title: "Welcome to SkillVerse",
    description: "Your all-in-one platform to master coding, design, and interview skills.",
    icon: LayoutDashboard,
    color: "from-blue-500 to-cyan-500",
    features: [
      "Track daily progress & streaks",
      "Visualize your learning curve",
      "Earn XP and level up"
    ],
    Graphic: () => (
      <div className="relative w-full h-40 bg-white/5 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center">
         {/* Mock Graph */}
         <div className="flex items-end gap-2 h-20">
            <div className="w-4 h-8 bg-blue-500/30 rounded-t-sm animate-pulse"></div>
            <div className="w-4 h-12 bg-blue-500/50 rounded-t-sm animate-pulse [animation-delay:100ms]"></div>
            <div className="w-4 h-16 bg-blue-500/70 rounded-t-sm animate-pulse [animation-delay:200ms]"></div>
            <div className="w-4 h-10 bg-blue-500/40 rounded-t-sm animate-pulse [animation-delay:300ms]"></div>
            <div className="w-4 h-20 bg-blue-500 rounded-t-sm animate-pulse [animation-delay:400ms]"></div>
         </div>
         <div className="absolute top-2 right-2 bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-500/20">
            +24% Growth
         </div>
      </div>
    )
  },
  {
    id: 'courses',
    title: "Structured Courses",
    description: "Dive into comprehensive modules designed by industry experts.",
    icon: BookOpen,
    color: "from-purple-500 to-pink-500",
    features: [
      "Interactive coding notes",
      "Built-in AI Tutor support",
      "Quizzes to test knowledge"
    ],
    Graphic: () => (
      <div className="relative w-full h-40 bg-white/5 rounded-xl border border-white/10 flex flex-col p-4 gap-3">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
               <BookOpen size={16} className="text-purple-400" />
            </div>
            <div className="h-2 w-24 bg-white/10 rounded-full"></div>
         </div>
         <div className="space-y-2">
            <div className="h-1.5 w-full bg-white/5 rounded-full"></div>
            <div className="h-1.5 w-3/4 bg-white/5 rounded-full"></div>
            <div className="h-1.5 w-5/6 bg-white/5 rounded-full"></div>
         </div>
         <div className="mt-auto flex justify-end">
             <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                 <Zap size={14} className="text-white fill-white" />
             </div>
         </div>
      </div>
    )
  },
  {
    id: 'career',
    title: "Career Mode",
    description: "Prepare for your dream job with real-world simulations.",
    icon: Briefcase,
    color: "from-emerald-500 to-green-500",
    features: [
      "Mock Interview Simulator",
      "Company-specific questions",
      "Readiness Score tracking"
    ],
    Graphic: () => (
       <div className="relative w-full h-40 bg-white/5 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 to-transparent"></div>
          
          {/* Company Logos Mock */}
          <div className="grid grid-cols-2 gap-4 z-10">
             <div className="w-12 h-12 bg-white/10 rounded-xl border border-white/10 flex items-center justify-center">
                <div className="w-6 h-6 bg-red-400 rounded-full opacity-80"></div>
             </div>
             <div className="w-12 h-12 bg-white/10 rounded-xl border border-white/10 flex items-center justify-center">
                <div className="w-6 h-6 bg-blue-400 rounded-sm opacity-80"></div>
             </div>
          </div>
          
          <div className="absolute bottom-3 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg shadow-emerald-500/20 flex items-center gap-1">
             <CheckCircle size={10} /> Hired
          </div>
       </div>
    )
  },
  {
    id: 'certifications',
    title: "Get Certified",
    description: "Prove your mastery with verifiable credentials.",
    icon: Award,
    color: "from-yellow-400 to-orange-500",
    features: [
      "Pass final exams (70%+)",
      "Download PDF certificates",
      "Share directly to LinkedIn"
    ],
    Graphic: () => (
       <div className="relative w-full h-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/10 to-transparent rounded-xl border border-yellow-500/20"></div>
          <div className="relative w-32 h-24 bg-[#0B1220] border-2 border-yellow-500/40 rounded-lg p-2 flex flex-col items-center justify-center shadow-2xl">
              <Award size={24} className="text-yellow-400 mb-1" />
              <div className="w-16 h-1 bg-white/20 rounded-full mb-1"></div>
              <div className="w-10 h-1 bg-white/10 rounded-full"></div>
              
              <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-yellow-400 rounded-full border-4 border-[#0B1220] flex items-center justify-center">
                  <Star size={12} className="text-[#0B1220] fill-[#0B1220]" />
              </div>
          </div>
       </div>
    )
  },
  {
    id: 'settings',
    title: "Customize Everything",
    description: "Make the learning experience truly yours.",
    icon: Settings,
    color: "from-gray-400 to-slate-400",
    features: [
      "Dark/Light themes",
      "Custom avatars",
      "Learning goal settings"
    ],
    Graphic: () => (
       <div className="relative w-full h-40 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center gap-4">
           <div className="w-12 h-12 rounded-full bg-gradient-main border-2 border-white/20"></div>
           <div className="flex flex-col gap-2">
               <div className="w-24 h-6 bg-white/10 rounded-md border border-white/5 flex items-center px-2">
                   <div className="w-3 h-3 rounded-full bg-white/20"></div>
               </div>
               <div className="w-24 h-6 bg-white/10 rounded-md border border-white/5 flex items-center px-2">
                   <div className="w-3 h-3 rounded-full bg-white/20"></div>
               </div>
           </div>
           
           <div className="absolute top-2 right-2 animate-spin-slow">
               <Settings size={20} className="text-white/20" />
           </div>
       </div>
    )
  }
];

export const TourOverlay: React.FC<TourOverlayProps> = ({ onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const currentSlide = SLIDES[currentIndex];
  const Icon = currentSlide.icon;
  const Graphic = currentSlide.Graphic;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in" onClick={onClose} />

      {/* Main Modal - Responsive Layout */}
      <div className="relative z-10 w-full max-w-4xl bg-[#0B1220] border border-white/10 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-fade-in-up max-h-[90vh] md:h-[500px]">
         
         {/* Close Button */}
         <button 
           onClick={onClose}
           className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/20 md:bg-white/5 hover:bg-black/40 md:hover:bg-white/10 text-white transition-colors"
         >
           <X size={20} />
         </button>

         {/* Left Side: Visuals & Graphics (Top on Mobile) */}
         <div className={`w-full md:w-5/12 min-h-[280px] md:h-full bg-gradient-to-br ${currentSlide.color} relative overflow-hidden p-8 flex flex-col items-center justify-center transition-colors duration-500 shrink-0`}>
             {/* Abstract Circles */}
             <div className="absolute top-[-20%] left-[-20%] w-[150%] h-[150%] bg-white/5 rounded-full blur-3xl"></div>
             <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] bg-black/10 rounded-full blur-2xl"></div>
             
             {/* Icon Container */}
             <div className="relative z-10 mb-6 bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-xl">
                 <Icon size={40} className="text-white" />
             </div>

             {/* Custom Graphic Area */}
             <div className="relative z-10 w-full max-w-[240px] animate-fade-in">
                 <Graphic />
             </div>
         </div>

         {/* Right Side: Content (Bottom on Mobile) */}
         <div className="w-full md:w-7/12 p-6 md:p-12 flex flex-col relative bg-glass overflow-y-auto">
             {/* Progress Dots */}
             <div className="flex gap-2 mb-6 md:mb-8 shrink-0">
                {SLIDES.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-primaryLight' : 'w-2 bg-white/10'}`} 
                  />
                ))}
             </div>

             {/* Text Content with Slide Animation */}
             <div key={currentIndex} className="flex-1 animate-fade-in-up">
                 <h2 className="text-2xl md:text-3xl font-display font-bold text-textMain mb-2 md:mb-4">{currentSlide.title}</h2>
                 <p className="text-textMuted text-base md:text-lg mb-6 md:mb-8 leading-relaxed">
                    {currentSlide.description}
                 </p>

                 <div className="space-y-3 md:space-y-4 mb-6">
                    {currentSlide.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 text-textMain/80 text-sm md:text-base" style={{ animationDelay: `${i * 100}ms` }}>
                         <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${currentSlide.color} flex items-center justify-center shrink-0`}>
                            <CheckCircle size={12} className="text-white" />
                         </div>
                         <span>{feature}</span>
                      </div>
                    ))}
                 </div>
             </div>

             {/* Navigation Buttons */}
             <div className="flex items-center justify-between mt-auto pt-4 md:pt-6 border-t border-white/5 shrink-0">
                <button 
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className={`flex items-center gap-2 text-textMuted font-medium transition-colors ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'hover:text-textMain'}`}
                >
                  <ChevronLeft size={20} /> <span className="hidden sm:inline">Previous</span>
                </button>

                <button 
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-textMain text-background px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity text-sm md:text-base"
                >
                  {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
                  {currentIndex === SLIDES.length - 1 ? <Zap size={18} /> : <ChevronRight size={18} />}
                </button>
             </div>
         </div>
      </div>
    </div>
  );
};
