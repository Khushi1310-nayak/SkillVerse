import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, CheckCircle, Loader2, Link as LinkIcon, Award, Twitter, Linkedin } from 'lucide-react';
import { storageService } from '../services/storageService';
import { useAuth } from '../hooks/useAuth';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CertificateDisplay, CertificateData } from './CertificateDisplay';
import { firestoreService } from '../services/firestoreService';
import { Course } from '../types';
import { useToast } from '../contexts/ToastContext';

export const Certificate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { appUser: user } = useAuth();
  const componentRef = useRef<HTMLDivElement>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourse = async () => {
      if (!id) return;
      try {
        const c = await firestoreService.getCourse(id);
        setCourse(c);
      } catch (err) {
        console.error('Failed to load course for certificate:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, [id]);

  const progress = storageService.getProgress(id || '');

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primaryLight w-12 h-12" />
        <div className="mt-4 text-textMuted text-sm font-medium animate-pulse">Loading certificate details...</div>
      </div>
    );
  }

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

  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const { showToast } = useToast();
  
  const credentialId = `${course.id.toUpperCase()}-${user.username.substring(0,3).toUpperCase()}-${progress.score}`;

  const certificateData: CertificateData = {
    username: user.username,
    courseTitle: course.title,
    score: progress.score,
    date: progress.completedDate || new Date().toLocaleDateString(),
    credentialId
  };

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
    const tokenData = {
       u: user.username,
       c: course.title,
       s: progress.score,
       d: progress.completedDate,
       i: credentialId
    };
    const token = btoa(JSON.stringify(tokenData));
    const shareUrl = `${window.location.origin}/#/credential/${token}`;
    const text = `I just earned a Certificate of Completion for "${course.title}" on SkillVerse Academy! 🎓🚀 Check out my verified credential:`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareLinkedIn = async () => {
    setIsSharing(true);
    try {
      const tokenData = {
         u: user.username,
         c: course.title,
         s: progress.score,
         d: progress.completedDate,
         i: credentialId
      };
      const token = btoa(JSON.stringify(tokenData));
      const shareUrl = `${window.location.origin}/#/credential/${token}`;
      const text = `I'm thrilled to share that I've completed "${course.title}" on SkillVerse! 🎓🌟 Verify my credential here: ${shareUrl}`;
      
      const blob = await generateShareImageBlob('certificate-share-card');
      if (blob && navigator.canShare && navigator.canShare({ files: [new File([blob], 'certificate.png', { type: 'image/png' })] })) {
        const file = new File([blob], 'certificate.png', { type: 'image/png' });
        await navigator.share({
          files: [file],
          title: `SkillVerse Completion Certificate`,
          text: text,
        });
      } else {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${course.title.replace(/\s+/g, '_')}_Certificate.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          showToast({ message: "Certificate image downloaded! Redirecting to LinkedIn to post...", type: "success" });
        } else {
          showToast({ message: "Redirecting to LinkedIn to post...", type: "info" });
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

  const handleDownloadPDF = async () => {
    const element = document.getElementById('certificate-container');
    if (!element) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(element, { 
         scale: 2, // Scale 2 is usually enough for A4 print
         useCORS: true,
         backgroundColor: '#0B1220',
         logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'px', [canvas.width, canvas.height]);
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${course.title.replace(/\s+/g, '_')}_Certificate.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLink = () => {
    // Generate Base64 token
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
    <div className="min-h-screen flex flex-col items-center p-6 animate-fade-in">
      <div className="w-full max-w-5xl mb-8 flex justify-between items-center no-print">
        <Link to="/" className="flex items-center text-textMuted hover:text-textMain transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
        </Link>
        <div className="flex flex-wrap items-center gap-3">
           <button 
             onClick={handleCopyLink}
             className="flex items-center gap-2 bg-white/5 dark:bg-white/10 text-textMain px-4 py-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/20 transition-all font-medium border border-black/20 dark:border-white/10"
           >
             {copied ? <CheckCircle size={18} className="text-success" /> : <LinkIcon size={18} />}
             {copied ? "Link Copied!" : "Copy Link"}
           </button>
           <button 
             onClick={handleShareTwitter}
             className="flex items-center gap-2 bg-white/5 dark:bg-white/10 text-textMain px-4 py-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/20 transition-all font-medium border border-black/20 dark:border-white/10 group"
           >
             <Twitter size={18} className="text-[#1DA1F2] group-hover:scale-110 transition-transform" /> Share to Twitter
           </button>
           <button 
             onClick={handleShareLinkedIn}
             disabled={isSharing}
             className="flex items-center gap-2 bg-white/5 dark:bg-white/10 text-textMain px-4 py-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/20 transition-all font-medium border border-black/20 dark:border-white/10 disabled:opacity-50 group"
           >
             {isSharing ? <Loader2 size={18} className="animate-spin" /> : <Linkedin size={18} className="text-[#0A66C2] fill-[#0A66C2] group-hover:scale-110 transition-transform" />}
             {isSharing ? "Sharing..." : "Share to LinkedIn"}
           </button>
           <button 
             onClick={handleDownloadPDF}
             disabled={isDownloading}
             className="flex items-center gap-2 bg-gradient-main text-white px-6 py-2 rounded-lg hover:shadow-lg hover:shadow-primary/20 transition-all font-medium disabled:opacity-50"
           >
             {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Printer size={18} />} 
             {isDownloading ? "Generating PDF..." : "Download PDF"}
           </button>
        </div>
      </div>

      <div className="w-full max-w-5xl overflow-x-auto pb-8 flex justify-center no-scrollbar">
         {/* We wrap it in a container so that it can scale or scroll horizontally on mobile */}
         <div className="min-w-[800px] w-full">
            {/* The CertificateDisplay component renders the actual UI */}
            {/* During download, we can use a CSS class to toggle the printing styles if needed, or rely on html2canvas parsing */}
            <CertificateDisplay data={certificateData} isPrinting={isDownloading} />
         </div>
      </div>
      
      {/* ----------------- HIDDEN SOCIAL SHARE CARD ----------------- */}
      <div 
        id="certificate-share-card" 
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
        className="bg-[#0B1220] text-white border-8 border-[#F5C97A] rounded-[32px] relative overflow-hidden"
      >
        {/* Glowing grid and background circles */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6968A6_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
        <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[120%] bg-[#6968A6] rounded-full blur-[140px] opacity-35 pointer-events-none"></div>
        <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[120%] bg-[#CF9893] rounded-full blur-[140px] opacity-35 pointer-events-none"></div>

        {/* Decorative Inner Border */}
        <div className="absolute inset-4 border border-[#6968A6]/40 rounded-2xl pointer-events-none"></div>

        {/* Card Header */}
        <div className="flex justify-between items-start z-10 w-full">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-[#6968A6] to-[#CF9893] flex items-center justify-center text-white font-bold shadow-lg text-2xl font-display">SV</div>
            <div>
              <div className="text-lg font-bold tracking-[0.25em] text-[#B9B6E3] uppercase">SkillVerse Academy</div>
              <div className="text-xs text-gray-500 font-mono tracking-wider">CREDENTIAL VERIFIED</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-mono text-[#F5C97A] font-bold">ID: {credentialId}</div>
            <div className="text-xs text-gray-400 font-mono mt-1">Issued: {progress.completedDate || new Date().toLocaleDateString()}</div>
          </div>
        </div>

        {/* Card Main Body */}
        <div className="text-center z-10 my-auto flex flex-col items-center w-full">
          <div className="text-sm uppercase tracking-[0.3em] text-gray-400 font-bold mb-3">Certificate of Completion</div>
          <h2 className="text-5xl font-extrabold text-white tracking-wide mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]">
            {user.username}
          </h2>
          <div className="w-32 h-1 bg-[#F5C97A] mb-5 opacity-70"></div>
          <div className="text-lg text-[#B9B6E3] max-w-2xl mx-auto leading-relaxed">
            has successfully completed and mastered all requirements for
          </div>
          <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#6968A6] to-[#CF9893] mt-3 tracking-wide">
            {course.title}
          </h3>
          <div className="text-sm text-gray-400 mt-4 font-mono">
            Passing Score: <span className="text-[#F5C97A] font-bold">{progress.score}%</span>
          </div>
        </div>

        {/* Card Footer */}
        <div className="flex justify-between items-end z-10 w-full">
          <div className="flex items-center gap-3">
            <Award className="text-[#F5C97A]" size={36} />
            <span className="text-sm font-bold text-[#B9B6E3] tracking-widest uppercase">Verified Achievement</span>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400 font-mono">skillverse-academy.web.app</div>
          </div>
        </div>
      </div>
    </div>
  );
};
