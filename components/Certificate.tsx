import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, CheckCircle, Loader2, Link as LinkIcon, Award } from 'lucide-react';
import { COURSES } from '../constants';
import { storageService } from '../services/storageService';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CertificateDisplay, CertificateData } from './CertificateDisplay';

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

  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const credentialId = `${course.id.toUpperCase()}-${user.username.substring(0,3).toUpperCase()}-${progress.score}`;

  const certificateData: CertificateData = {
    username: user.username,
    courseTitle: course.title,
    score: progress.score,
    date: progress.completedDate || new Date().toLocaleDateString(),
    credentialId
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
        <div className="flex items-center gap-4">
           <button 
             onClick={handleCopyLink}
             className="flex items-center gap-2 bg-white/5 dark:bg-white/10 text-textMain px-4 py-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/20 transition-all font-medium border border-black/10 dark:border-white/10"
           >
             {copied ? <CheckCircle size={18} className="text-success" /> : <LinkIcon size={18} />}
             {copied ? "Link Copied!" : "Copy Link"}
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
    </div>
  );
};
