import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, Share2, Award } from 'lucide-react';
import { COURSES } from '../constants';
import { storageService } from '../services/storageService';

export const Certificate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const course = COURSES.find(c => c.id === id);
  const user = storageService.getUser();
  const progress = storageService.getProgress(id || '');

  if (!course || !user || !progress || !progress.passed) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="text-textMuted opacity-50" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-textMain mb-4">Certificate Unavailable</h2>
        <p className="text-textMuted mb-8">You haven't completed this course yet.</p>
        <Link to={`/course/${id}`} className="px-6 py-2 bg-gradient-main text-white rounded-lg font-bold">
            Go to Course
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 animate-fade-in">
      <div className="w-full max-w-5xl mb-8 flex justify-between items-center no-print">
        <Link to="/" className="flex items-center text-textMuted hover:text-textMain transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
        </Link>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-gradient-main text-white px-6 py-2 rounded-lg hover:shadow-lg hover:shadow-primary/20 transition-all font-medium"
        >
          <Printer size={18} /> Download / Print PDF
        </button>
      </div>

      {/* Certificate Container */}
      <div 
        id="certificate-container" 
        className="relative w-full max-w-[1000px] aspect-[1.414/1] bg-gradient-to-br from-[#0B1220] to-[#1E293B] text-white shadow-2xl p-12 flex flex-col items-center justify-between overflow-hidden"
      >
        {/* Background Texture/Pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#6968A6] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#CF9893] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

        {/* Fancy Border */}
        <div className="absolute inset-4 border-2 border-[#F5C97A]/30 rounded-lg pointer-events-none"></div>
        <div className="absolute inset-6 border border-[#6968A6]/50 rounded-lg pointer-events-none"></div>

        {/* Decorative Corners */}
        <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-[#F5C97A] rounded-tl-xl"></div>
        <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-[#F5C97A] rounded-tr-xl"></div>
        <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-[#F5C97A] rounded-bl-xl"></div>
        <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-[#F5C97A] rounded-br-xl"></div>

        {/* Header */}
        <div className="text-center mt-8 w-full relative z-10">
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-main flex items-center justify-center text-white font-bold shadow-lg text-lg">SV</div>
            <span className="text-xl font-bold tracking-[0.2em] text-white uppercase">SkillVerse Academy</span>
          </div>
          
          <h1 className="font-display font-bold text-5xl md:text-6xl text-[#F5C97A] mb-4 uppercase tracking-widest drop-shadow-sm">
            Certificate
          </h1>
          <h2 className="text-xl md:text-2xl font-light text-[#B9B6E3] uppercase tracking-[0.3em]">
            of Completion
          </h2>
        </div>

        {/* Main Content */}
        <div className="text-center relative z-10 flex-1 flex flex-col justify-center">
          <p className="text-lg text-gray-400 italic mb-4">This is to certify that</p>
          
          <div className="text-4xl md:text-5xl font-display font-bold text-white mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            {user.username}
          </div>
          
          <div className="h-px w-64 bg-gradient-to-r from-transparent via-[#F5C97A] to-transparent mx-auto mb-8 opacity-50"></div>

          <p className="text-lg text-gray-400 italic mb-4">Has successfully demonstrated mastery in</p>
          
          <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#6968A6] to-[#CF9893] bg-clip-text text-transparent mb-8">
            {course.title}
          </div>

          <p className="text-[#B9B6E3] max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
            By passing the comprehensive assessment with a score of <strong className="text-[#F5C97A]">{progress.score}%</strong> on {progress.completedDate}, 
            affirming competence in the fundamental and advanced concepts of this subject.
          </p>
        </div>

        {/* Footer */}
        <div className="w-full flex justify-between items-end mt-8 px-8 relative z-10">
          <div className="text-center">
             <div className="text-[#F5C97A] font-mono mb-2 text-lg">{progress.completedDate}</div>
             <div className="w-40 border-t border-[#6968A6]/50 pt-2">
                <p className="text-xs font-bold uppercase text-gray-500 tracking-wider">Date Issued</p>
             </div>
          </div>
          
          <div className="flex flex-col items-center -mb-4">
             <div className="relative">
                <div className="absolute inset-0 bg-[#F5C97A] rounded-full blur-xl opacity-20"></div>
                <div className="w-24 h-24 rounded-full border-2 border-[#F5C97A] flex items-center justify-center bg-[#0B1220] relative z-10">
                  <div className="w-20 h-20 rounded-full border border-[#6968A6] flex items-center justify-center">
                     <div className="text-center">
                       <Award size={24} className="text-[#F5C97A] mx-auto mb-1" />
                       <div className="text-[8px] font-bold text-[#B9B6E3] tracking-wider uppercase">Verified</div>
                     </div>
                  </div>
                </div>
             </div>
             <div className="mt-2 font-mono text-xs text-gray-600">ID: {course.id.toUpperCase()}-{user.username.substring(0,3).toUpperCase()}</div>
          </div>

          <div className="text-center">
             <div className="mb-2 h-10 flex items-end justify-center">
               <span className="font-handwriting text-2xl text-white opacity-80" style={{ fontFamily: 'cursive' }}>SkillVerse</span>
             </div>
             <div className="w-40 border-t border-[#6968A6]/50 pt-2">
                <p className="text-xs font-bold uppercase text-gray-500 tracking-wider">Platform Director</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
