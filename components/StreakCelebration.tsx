import React, { useState } from 'react';
import { X, Flame, Twitter, Linkedin, CheckCircle, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { User } from '../types';

interface StreakCelebrationProps {
  user: User;
  onClose: () => void;
}

export const StreakCelebration: React.FC<StreakCelebrationProps> = ({ user, onClose }) => {
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const todayStr = new Date().toLocaleDateString();

  const generateShareImageBlob = async (elementId: string): Promise<Blob | null> => {
    const element = document.getElementById(elementId);
    if (!element) return null;
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0B1220',
        logging: false
      });
      return new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png');
      });
    } catch (err) {
      console.error('Failed to generate image blob:', err);
      return null;
    }
  };

  const handleShareTwitter = () => {
    const text = `I just hit a ${user.streak}-day learning streak on SkillVerse! 🔥🚀 Consistency is key. Join me in learning daily:`;
    const shareUrl = window.location.origin;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareLinkedIn = async () => {
    setIsSharing(true);
    try {
      const shareUrl = window.location.origin;
      const text = `I've hit a ${user.streak}-day learning streak on SkillVerse! 🔥 Consistent daily learning is helping me level up my skills. Check it out: ${shareUrl}`;
      
      const blob = await generateShareImageBlob('streak-share-card');
      if (blob && navigator.canShare && navigator.canShare({ files: [new File([blob], 'streak.png', { type: 'image/png' })] })) {
        const file = new File([blob], 'streak.png', { type: 'image/png' });
        await navigator.share({
          files: [file],
          title: `${user.streak}-Day Learning Streak on SkillVerse`,
          text: text,
        });
      } else {
        // Fallback: Download image and open LinkedIn share URL
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `SkillVerse_${user.streak}_Day_Streak.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          setCopied(true);
          setTimeout(() => setCopied(false), 3000);
        }
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        window.open(linkedinUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      console.error('LinkedIn share failed:', err);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      {/* Dark Overlay with Blur */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Celebration Modal Container */}
      <div className="relative w-full max-w-lg bg-[#0B1220]/90 border border-orange-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-orange-500/10 animate-fade-in-up z-10 overflow-hidden text-white">
        
        {/* Animated Background Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/20 rounded-full blur-[80px] pointer-events-none animate-pulse-slow"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-yellow-500/20 rounded-full blur-[80px] pointer-events-none animate-pulse-slow"></div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-textMuted hover:text-white rounded-full hover:bg-white/5 transition-all"
          title="Close"
        >
          <X size={20} />
        </button>

        {/* Modal Content */}
        <div className="flex flex-col items-center text-center relative z-10">
          
          {/* Flame Icon Container with Glowing Ripple Effect */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-orange-500 rounded-full blur-2xl opacity-40 animate-pulse"></div>
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-orange-600 to-yellow-400 flex items-center justify-center border-4 border-orange-500/40 shadow-lg shadow-orange-500/20 hover:scale-105 transition-transform duration-300">
              <Flame size={48} className="text-white fill-white animate-bounce" />
            </div>
          </div>

          {/* Celebration Text */}
          <h2 className="text-3xl font-display font-extrabold text-white tracking-wide mb-2">
            STREAK CHAMPION!
          </h2>
          <div className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent mb-4 tracking-widest">
            {user.streak} DAYS ACTIVE
          </div>

          <p className="text-[#B9B6E3] text-sm max-w-sm mb-8 leading-relaxed">
            Unstoppable! You are building an incredible learning habit. Share your achievement to inspire others to start their journey!
          </p>

          {/* Social Share Buttons */}
          <div className="w-full flex flex-col sm:flex-row gap-4 mb-6">
            <button 
              onClick={handleShareTwitter}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl font-semibold transition-all group"
            >
              <Twitter size={18} className="text-[#1DA1F2] group-hover:scale-110 transition-transform" />
              Share to Twitter
            </button>
            <button 
              onClick={handleShareLinkedIn}
              disabled={isSharing}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-2xl font-semibold shadow-lg shadow-orange-500/10 hover:shadow-orange-500/25 transition-all disabled:opacity-50 group"
            >
              {isSharing ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Linkedin size={18} className="text-white fill-white group-hover:scale-110 transition-transform" />
              )}
              {isSharing ? "Generating..." : "Share to LinkedIn"}
            </button>
          </div>

          {/* Notification Toast for Image Fallback */}
          {copied && (
            <div className="text-xs text-orange-400 font-medium mb-4 animate-fade-in flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 px-3.5 py-2 rounded-xl">
              <CheckCircle size={14} className="text-success" />
              Streak card downloaded! You can now upload it to LinkedIn.
            </div>
          )}

          {/* Secondary Action */}
          <button 
            onClick={onClose}
            className="text-xs font-semibold uppercase tracking-wider text-textMuted hover:text-white transition-colors"
          >
            Keep Learning
          </button>
        </div>
      </div>

      {/* ----------------- HIDDEN SOCIAL SHARE CARD ----------------- */}
      <div 
        id="streak-share-card" 
        style={{ 
          position: 'absolute', 
          left: '-9999px', 
          top: '-9999px', 
          width: '1200px', 
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px',
          boxSizing: 'border-box',
          fontFamily: '"Plus Jakarta Sans", sans-serif'
        }}
        className="bg-[#0B1220] text-white border-8 border-orange-500 rounded-[32px] relative overflow-hidden"
      >
        {/* Glow Effects */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F97316_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
        <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[120%] bg-orange-600 rounded-full blur-[140px] opacity-25 pointer-events-none"></div>
        <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[120%] bg-yellow-600 rounded-full blur-[140px] opacity-25 pointer-events-none"></div>

        {/* Decorative Inner Border */}
        <div className="absolute inset-4 border-2 border-orange-500/20 rounded-2xl pointer-events-none"></div>

        {/* Card Header */}
        <div className="flex justify-between items-start z-10 w-full">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center text-white font-bold shadow-lg text-2xl font-display">SV</div>
            <div>
              <div className="text-lg font-bold tracking-[0.25em] text-[#B9B6E3] uppercase">SkillVerse Academy</div>
              <div className="text-xs text-gray-500 font-mono tracking-wider">HABIT BUILDER ACHIEVEMENT</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-mono text-orange-400 font-bold uppercase tracking-widest">STREAK AWARD</div>
            <div className="text-xs text-gray-400 font-mono mt-1">{todayStr}</div>
          </div>
        </div>

        {/* Card Main Body */}
        <div className="text-center z-10 my-auto flex flex-col items-center w-full">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-orange-500 rounded-full blur-2xl opacity-40"></div>
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-orange-600 to-yellow-400 flex items-center justify-center border-4 border-orange-500/50 shadow-2xl relative z-10">
              <Flame className="text-white fill-white" size={60} />
            </div>
          </div>
          
          <h2 className="text-5xl font-extrabold text-white tracking-wide mb-3 drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]">
            {user.username}
          </h2>
          <div className="text-3xl font-extrabold text-orange-400 uppercase tracking-widest mb-4">
            {user.streak}-Day Learning Streak! ⚡
          </div>
          
          <div className="w-48 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mb-6"></div>
          
          <p className="text-lg text-[#B9B6E3] max-w-2xl mx-auto leading-relaxed italic">
            "Consistency is the key to mastery. Logging in and learning day after day to build a brighter future in tech."
          </p>
        </div>

        {/* Card Footer */}
        <div className="flex justify-between items-end z-10 w-full">
          <div className="flex items-center gap-3">
            <Flame className="text-orange-500 fill-orange-500" size={32} />
            <span className="text-sm font-bold text-[#B9B6E3] tracking-widest uppercase">SkillVerse Habit Loop</span>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400 font-mono">skillverse-academy.web.app</div>
          </div>
        </div>
      </div>
    </div>
  );
};
