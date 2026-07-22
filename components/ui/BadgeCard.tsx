import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Download, CheckCircle, Link as LinkIcon } from 'lucide-react';
import { Course, Progress, User } from '../../types';

export interface BadgeCardProps {
  course: Course;
  progress: Progress;
  user: User;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ course, progress, user }) => {
  const [copied, setCopied] = useState(false);
  const credentialId = `${course.id.toUpperCase()}-${user.username.substring(0, 3).toUpperCase()}-${progress.score}`;

  const handleCopyLink = () => {
    const tokenData = {
      u: user.username,
      c: course.title,
      s: progress.score,
      d: progress.completedDate,
      i: credentialId
    };
    const token = btoa(JSON.stringify(tokenData));
    const url = `${window.location.origin}/#/credential/${token}`;

    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-glass border border-white/20 dark:border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col items-center text-center group hover:border-[#F5C97A]/50 transition-all shadow-xl">
      {/* Beautiful Pentagon/Hexagon Badge */}
      <div className="relative w-40 h-40 mb-6 drop-shadow-2xl group-hover:scale-105 transition-transform duration-500">
        {/* Outer Gold Border */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F5C97A] via-[#D4AF37] to-[#AA7C11] badge-hexagon">
        </div>
        {/* Inner Dark Background */}
        <div className="absolute inset-1 bg-gradient-to-br from-[#0B1220] to-[#1E293B] badge-hexagon">
        </div>
        {/* Inner Gold Accents */}
        <div className="absolute inset-2 bg-gradient-to-br from-[#0B1220] to-[#1E293B] badge-hexagon badge-hexagon-inner">
        </div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <Award size={40} className="text-[#F5C97A] mb-1" />
          <div className="text-[10px] font-bold text-white tracking-widest uppercase mt-2 leading-tight">
            {course.title}
          </div>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-textMain mb-1">{course.title} Certified</h3>
      <div className="text-xs font-mono text-[#F5C97A] mb-2 tracking-wider">ID: {credentialId}</div>
      <p className="text-sm text-textMuted mb-6">Issued {progress.completedDate}</p>
      
      <div className="flex gap-3 w-full">
        <button 
          onClick={handleCopyLink}
          className="flex-1 bg-white/5 dark:bg-white/5 hover:bg-white/10 border border-black/10 dark:border-white/10 text-textMain py-2.5 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors text-xs sm:text-sm"
        >
          {copied ? <CheckCircle size={16} className="text-success" /> : <LinkIcon size={16} />}
          {copied ? "Copied" : "Copy Link"}
        </button>
        <Link 
          to={`/certificate/${course.id}`}
          className="flex-1 bg-gradient-main text-white py-2.5 rounded-xl flex items-center justify-center gap-2 font-medium hover:shadow-lg transition-all text-xs sm:text-sm"
        >
          <Download size={16} /> Certificate
        </Link>
      </div>
    </div>
  );
};
