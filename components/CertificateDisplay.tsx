import React from 'react';
import { Award } from 'lucide-react';

export interface CertificateData {
  username: string;
  courseTitle: string;
  score: number | string;
  date: string;
  credentialId: string;
}

interface CertificateDisplayProps {
  data: CertificateData;
  isPrinting?: boolean;
}

export const CertificateDisplay: React.FC<CertificateDisplayProps> = ({ data, isPrinting = false }) => {
  return (
    <div 
      id="certificate-container" 
      className={`relative w-full max-w-[1000px] aspect-[1.414/1] bg-[#0B1220] ${!isPrinting ? 'bg-gradient-to-br from-[#0B1220] to-[#1E293B] shadow-2xl' : ''} text-white p-6 md:p-12 flex flex-col items-center justify-between overflow-hidden mx-auto`}
      style={isPrinting ? { width: '1000px', height: '707px', maxWidth: 'none', transform: 'scale(1)', transformOrigin: 'top left' } : {}}
    >
      {/* Background Texture/Pattern */}
      {!isPrinting && <div className="absolute inset-0 opacity-5 certificate-pattern"></div>}
      {!isPrinting && (
        <>
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#6968A6] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#CF9893] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
        </>
      )}

      {/* Fancy Border */}
      <div className="absolute inset-4 border-2 border-[#F5C97A]/30 rounded-lg pointer-events-none"></div>
      <div className="absolute inset-6 border border-[#6968A6]/50 rounded-lg pointer-events-none"></div>

      {/* Decorative Corners */}
      <div className="absolute top-6 left-6 w-12 md:w-16 h-12 md:h-16 border-t-2 border-l-2 border-[#F5C97A] rounded-tl-xl pointer-events-none"></div>
      <div className="absolute top-6 right-6 w-12 md:w-16 h-12 md:h-16 border-t-2 border-r-2 border-[#F5C97A] rounded-tr-xl pointer-events-none"></div>
      <div className="absolute bottom-6 left-6 w-12 md:w-16 h-12 md:h-16 border-b-2 border-l-2 border-[#F5C97A] rounded-bl-xl pointer-events-none"></div>
      <div className="absolute bottom-6 right-6 w-12 md:w-16 h-12 md:h-16 border-b-2 border-r-2 border-[#F5C97A] rounded-br-xl pointer-events-none"></div>

      {/* Header */}
      <div className="text-center mt-4 md:mt-8 w-full relative z-10 flex-shrink-0">
        <div className="flex justify-center items-center gap-3 mb-4 md:mb-6">
          <div className="w-8 md:w-10 h-8 md:h-10 rounded-lg bg-gradient-to-r from-[#6968A6] to-[#CF9893] flex items-center justify-center text-white font-bold shadow-lg text-sm md:text-lg">SV</div>
          <span className="text-lg md:text-xl font-bold tracking-[0.2em] text-white uppercase">SkillVerse Academy</span>
        </div>
        
        <h1 className="font-display font-bold text-4xl md:text-6xl text-[#F5C97A] mb-2 md:mb-4 uppercase tracking-widest drop-shadow-sm">
          Certificate
        </h1>
        <h2 className="text-lg md:text-2xl font-light text-[#B9B6E3] uppercase tracking-[0.3em]">
          of Completion
        </h2>
      </div>

      {/* Main Content */}
      <div className="text-center relative z-10 flex-1 flex flex-col justify-center px-8">
        <p className="text-base md:text-lg text-gray-400 italic mb-2 md:mb-4">This is to certify that</p>
        
        <div className="text-3xl md:text-5xl font-display font-bold text-white mb-4 md:mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          {data.username}
        </div>
        
        <div className="h-px w-48 md:w-64 bg-gradient-to-r from-transparent via-[#F5C97A] to-transparent mx-auto mb-4 md:mb-8 opacity-50"></div>

        <p className="text-base md:text-lg text-gray-400 italic mb-2 md:mb-4">Has successfully demonstrated mastery in</p>
        
        <div className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text mb-4 md:mb-8" style={{ backgroundImage: 'linear-gradient(90deg, #6968A6, #CF9893)' }}>
          {data.courseTitle}
        </div>

        <p className="text-[#B9B6E3] max-w-2xl mx-auto leading-relaxed text-xs md:text-base px-4">
          By passing the comprehensive assessment with a score of <strong className="text-[#F5C97A]">{data.score}%</strong> on {data.date}, 
          affirming competence in the fundamental and advanced concepts of this subject.
        </p>
      </div>

      {/* Footer */}
      <div className="w-full flex justify-between items-end mt-4 md:mt-8 px-4 md:px-8 relative z-10 flex-shrink-0 mb-4 md:mb-0">
        <div className="text-center w-24 md:w-40">
           <div className="text-[#F5C97A] font-mono mb-2 text-sm md:text-lg">{data.date}</div>
           <div className="w-full border-t border-[#6968A6]/50 pt-2">
              <p className="text-[10px] md:text-xs font-bold uppercase text-gray-500 tracking-wider">Date Issued</p>
           </div>
        </div>
        
        <div className="flex flex-col items-center mb-2">
           <div className="relative">
              <div className="absolute inset-0 bg-[#F5C97A] rounded-full blur-xl opacity-20"></div>
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-2 border-[#F5C97A] flex items-center justify-center bg-[#0B1220] relative z-10">
                <div className="w-12 h-12 md:w-20 md:h-20 rounded-full border border-[#6968A6] flex items-center justify-center">
                   <div className="text-center">
                     <Award size={18} className="text-[#F5C97A] mx-auto mb-1 md:w-6 md:h-6" />
                     <div className="text-[6px] md:text-[8px] font-bold text-[#B9B6E3] tracking-wider uppercase">Verified</div>
                   </div>
                </div>
              </div>
           </div>
           <div className="mt-2 md:mt-4 font-mono text-[10px] md:text-xs text-[#F5C97A] tracking-wider opacity-80 text-center">ID: {data.credentialId}</div>
        </div>

        <div className="text-center w-24 md:w-40">
           <div className="mb-2 h-8 md:h-10 flex items-end justify-center">
             <span className="text-xl md:text-2xl text-white opacity-80" style={{ fontFamily: 'cursive' }}>SkillVerse</span>
           </div>
           <div className="w-full border-t border-[#6968A6]/50 pt-2">
              <p className="text-[10px] md:text-xs font-bold uppercase text-gray-500 tracking-wider">Platform Director</p>
           </div>
        </div>
      </div>
    </div>
  );
};
