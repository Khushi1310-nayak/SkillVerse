import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Check, Zap, Target, Code, 
  Briefcase, Clock, Award, BookOpen, 
  Bell, CheckCircle, ChevronLeft
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { User, UserSettings } from '../types';
import { GoldSnow } from './GoldSnow';

interface OnboardingProps {
  user: User;
  onComplete: (updatedUser: User) => void;
}

const QUESTIONS = [
  {
    id: 'primaryGoal',
    question: "What is your primary goal?",
    type: 'single',
    options: [
      { id: 'job', label: 'Get a job', icon: Briefcase },
      { id: 'skills', label: 'Improve skills', icon: Code },
      { id: 'interviews', label: 'Prepare for interviews', icon: Target },
      { id: 'explore', label: 'Explore tech', icon: BookOpen },
      { id: 'projects', label: 'Build projects', icon: Zap },
    ]
  },
  {
    id: 'experienceLevel',
    question: "Your current experience level?",
    type: 'single',
    options: [
      { id: 'beginner', label: 'Beginner', icon: null },
      { id: 'intermediate', label: 'Intermediate', icon: null },
      { id: 'advanced', label: 'Advanced', icon: null },
    ]
  },
  {
    id: 'interests',
    question: "Which areas interest you most?",
    type: 'multi',
    options: [
      { id: 'programming', label: 'Programming', icon: Code },
      { id: 'dsa', label: 'DSA', icon: Target },
      { id: 'design', label: 'Design', icon: Zap },
      { id: 'interview', label: 'Interview Prep', icon: Briefcase },
    ]
  },
  {
    id: 'targetRoles',
    question: "Which roles are you targeting?",
    type: 'multi',
    options: [
      { id: 'frontend', label: 'Frontend Developer', icon: Code },
      { id: 'backend', label: 'Backend Developer', icon: ServerIcon },
      { id: 'fullstack', label: 'Full Stack', icon: Zap },
      { id: 'uiux', label: 'UI/UX Designer', icon: BookOpen },
    ]
  },
  {
    id: 'dailyGoal',
    question: "How much time can you study daily?",
    type: 'single',
    options: [
      { id: '15', label: '15 min', icon: Clock },
      { id: '30', label: '30 min', icon: Clock },
      { id: '60', label: '1 hour', icon: Clock },
      { id: '120', label: '2+ hours', icon: Clock },
    ]
  },
  {
    id: 'motivation',
    question: "What motivates you most?",
    type: 'single',
    options: [
      { id: 'certificates', label: 'Certificates', icon: Award },
      { id: 'xp', label: 'XP & Levels', icon: Zap },
      { id: 'job', label: 'Job Readiness', icon: Briefcase },
      { id: 'consistency', label: 'Consistency', icon: CheckCircle },
    ]
  },
  {
    id: 'learningStyle',
    question: "Preferred learning style?",
    type: 'single',
    options: [
      { id: 'reading', label: 'Reading', icon: BookOpen },
      { id: 'practice', label: 'Practice Questions', icon: Code },
      { id: 'quizzes', label: 'Quizzes', icon: CheckCircle },
      { id: 'mixed', label: 'Mixed', icon: Zap },
    ]
  },
  {
    id: 'notifications',
    question: "Can we send you helpful reminders?",
    type: 'action', // Special type for permission
    options: [
      { id: 'yes', label: 'Yes, notify me', icon: Bell },
      { id: 'no', label: 'No, I’ll manage myself 😌', icon: BellOffIcon },
    ]
  }
];

// Fallback icons if not imported
function ServerIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg> }
function BellOffIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.7 3A6 6 0 0 1 18 8a21.3 21.3 0 0 0 .6 5"/><path d="M17 17H3s3-2 3-9"/><path d="M10.3 21a1.95 1.95 0 0 0 3.4 0"/><path d="M2 2l20 20"/></svg> }

const Confetti: React.FC = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 rounded-md"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-20px',
            backgroundColor: ['#6968A6', '#CF9893', '#6EE7B7', '#F5C97A', '#3B82F6'][Math.floor(Math.random() * 5)],
            animation: `fall ${2.5 + Math.random() * 2}s linear forwards`,
            animationDelay: `${Math.random() * 0.5}s`,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          to { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
);

export const Onboarding: React.FC<OnboardingProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<UserSettings>>({
    interests: [],
    targetRoles: []
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [completed, setCompleted] = useState(false);

  const currentQ = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  const handleSelect = async (optionId: string) => {
    if (isAnimating) return;

    if (currentQ.type === 'single') {
        setAnswers(prev => ({ ...prev, [currentQ.id]: optionId }));
        // Special case for time: convert to number
        if (currentQ.id === 'dailyGoal') {
           setAnswers(prev => ({ ...prev, dailyGoal: parseInt(optionId) }));
        }
        advanceStep();
    } else if (currentQ.type === 'multi') {
        const key = currentQ.id as keyof UserSettings;
        // @ts-ignore - TS struggles with dynamic key indexing on unions
        const currentList: string[] = answers[key] || [];
        
        let newList;
        if (currentList.includes(optionId)) {
            newList = currentList.filter(id => id !== optionId);
        } else {
            newList = [...currentList, optionId];
        }
        setAnswers(prev => ({ ...prev, [key]: newList }));
    } else if (currentQ.type === 'action') {
        // Notification Logic
        if (optionId === 'yes') {
            if ('Notification' in window) {
                try {
                    const permission = await Notification.requestPermission();
                    if (permission === 'granted') {
                         new Notification("You're all set! 🚀", {
                            body: "We'll send you friendly reminders to reach your goals.",
                            icon: '/favicon.ico' 
                         });
                    }
                } catch (e) {
                    console.error("Notification permission error", e);
                }
            }
        }
        setAnswers(prev => ({ ...prev, reminders: optionId === 'yes' }));
        finishOnboarding();
    }
  };

  const advanceStep = () => {
    setIsAnimating(true);
    setTimeout(() => {
        setStep(prev => prev + 1);
        setIsAnimating(false);
    }, 300);
  };

  const finishOnboarding = () => {
     setCompleted(true);
     // Prepare final user object
     const updatedUser: User = {
         ...user,
         settings: {
             ...user.settings,
             ...answers,
             onboardingCompleted: true
         }
     };

     // Save using service
     storageService.updateUser(updatedUser);

     // Delay for confetti effect before callback
     setTimeout(() => {
         onComplete(updatedUser);
     }, 3000);
  };

  if (completed) {
      return (
          <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center text-center p-6 animate-fade-in overflow-hidden">
              <GoldSnow />
              <Confetti />
              <div className="relative z-10">
                <div className="w-24 h-24 rounded-full bg-gradient-main flex items-center justify-center mb-8 shadow-2xl animate-bounce mx-auto">
                    <Check size={48} className="text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-textMain mb-4 animate-fade-in-up">
                    You're all set!
                </h1>
                <p className="text-xl text-textMuted max-w-md animate-fade-in-up [animation-delay:200ms] mx-auto">
                    We've personalized your learning journey based on your goals. Let's get started.
                </p>
              </div>
          </div>
      );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col transition-colors duration-500 overflow-hidden">
        {/* Background Animation */}
        <GoldSnow />

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-black/5 dark:bg-white/5 relative z-20">
            <div 
                className="h-full bg-gradient-main transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }}
            />
        </div>

        {/* Content Container */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative overflow-y-auto z-10">
            
            {/* Header / Counter */}
            <div className="absolute top-8 right-8 text-xs font-bold text-textMuted uppercase tracking-wider">
                {step + 1} of {QUESTIONS.length}
            </div>

            {step > 0 && (
                <button 
                  onClick={() => setStep(step - 1)}
                  className="absolute top-8 left-8 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-textMuted transition-colors backdrop-blur-sm"
                >
                    <ChevronLeft size={24} />
                </button>
            )}

            <div className={`w-full max-w-2xl transition-all duration-300 transform ${isAnimating ? '-translate-x-10 opacity-0' : 'translate-x-0 opacity-100'}`}>
                
                <h2 className="text-3xl md:text-5xl font-display font-bold text-textMain mb-10 text-center leading-tight drop-shadow-sm">
                    {currentQ.question}
                </h2>

                <div className={`grid gap-4 ${currentQ.options.length > 4 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                    {currentQ.options.map((opt) => {
                        const Icon = opt.icon;
                        const isSelected = currentQ.type === 'multi' 
                            // @ts-ignore
                            ? (answers[currentQ.id] || []).includes(opt.id)
                            : false; 

                        return (
                            <button
                                key={opt.id}
                                onClick={() => handleSelect(opt.id)}
                                className={`
                                    group flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200
                                    hover:scale-[1.02] active:scale-[0.98] backdrop-blur-md
                                    ${isSelected 
                                        ? 'border-primaryLight bg-primary/20 shadow-lg shadow-primary/20' 
                                        : 'border-black/5 dark:border-white/10 bg-white/40 dark:bg-black/40 hover:border-primary/50 hover:bg-white/60 dark:hover:bg-black/60'
                                    }
                                `}
                            >
                                {Icon && (
                                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-primaryLight text-white' : 'bg-black/5 dark:bg-white/10 text-textMuted group-hover:text-textMain'}`}>
                                        <Icon size={24} />
                                    </div>
                                )}
                                <span className={`text-lg font-bold ${isSelected ? 'text-primary dark:text-primaryLight' : 'text-textMain'}`}>
                                    {opt.label}
                                </span>
                                {isSelected && <CheckCircle className="ml-auto text-primaryLight" size={24} />}
                            </button>
                        );
                    })}
                </div>

                {currentQ.type === 'multi' && (
                    <div className="mt-8 flex justify-end">
                        <button 
                            onClick={advanceStep}
                            className="flex items-center gap-2 bg-gradient-main text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/25 transition-all hover:scale-105 active:scale-95 z-20"
                        >
                            Continue <ArrowRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};