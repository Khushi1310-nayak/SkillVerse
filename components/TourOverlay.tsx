
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
    imageUrl: "/assets/tour/tour_overview_1783097943357.png"
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
    imageUrl: "/assets/tour/tour_courses_1783097954059.png"
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
    imageUrl: "/assets/tour/tour_career_1783097968924.png"
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
    imageUrl: "/assets/tour/tour_certs_1783097979805.png"
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
    imageUrl: "/assets/tour/tour_settings_1783097991800.png"
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
           title="Close Tour"
           aria-label="Close Tour"
         >
           <X size={20} />
         </button>

         {/* Left Side: Visuals & Graphics (Top on Mobile) */}
         <div className="w-full md:w-5/12 min-h-[280px] md:h-full relative overflow-hidden shrink-0 group" key={currentSlide.id}>
             <img 
               src={currentSlide.imageUrl} 
               alt={currentSlide.title}
               className="absolute inset-0 w-full h-full object-cover animate-fade-in transition-transform duration-1000 group-hover:scale-110" 
             />
             {/* Subtle overlay for blending into right side */}
             <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#0B1220] opacity-90" />
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
                      <div key={i} className={`flex items-center gap-3 text-textMain/80 text-sm md:text-base animate-fade-in-up ${i === 1 ? '[animation-delay:100ms]' : i === 2 ? '[animation-delay:200ms]' : ''}`}>
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
