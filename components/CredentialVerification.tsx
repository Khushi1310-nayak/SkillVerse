import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, ShieldCheck, Download } from 'lucide-react';
import { CertificateDisplay, CertificateData } from './CertificateDisplay';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { GoldSnow } from './GoldSnow';

export const CredentialVerification: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<CertificateData | null>(null);
  const [error, setError] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    try {
      if (!token) throw new Error("No token");
      const decoded = atob(token);
      const parsed = JSON.parse(decoded);
      if (parsed.u && parsed.c && parsed.s && parsed.d && parsed.i) {
        setData({
          username: parsed.u,
          courseTitle: parsed.c,
          score: parsed.s,
          date: parsed.d,
          credentialId: parsed.i
        });
      } else {
        throw new Error("Invalid format");
      }
    } catch (e) {
      console.error(e);
      setError(true);
    }
  }, [token]);

  const handleDownloadPDF = async () => {
    const element = document.getElementById('certificate-container');
    if (!element || !data) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(element, { 
         scale: 2, 
         useCORS: true,
         backgroundColor: '#0B1220',
         logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'px', [canvas.width, canvas.height]);
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${data.courseTitle.replace(/\s+/g, '_')}_Certificate.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF", err);
    } finally {
      setIsDownloading(false);
    }
  };

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <ShieldCheck size={64} className="text-red-500 mb-6 opacity-50" />
        <h1 className="text-3xl font-bold text-textMain mb-4">Invalid Credential</h1>
        <p className="text-textMuted max-w-md mb-8">
          The credential link you provided is either malformed, tampered with, or does not exist.
        </p>
        <button onClick={() => navigate('/')} className="px-6 py-3 bg-gradient-main text-white font-bold rounded-xl">
          Return to SkillVerse
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1220] flex flex-col relative overflow-hidden">
      <GoldSnow />
      
      <div className="relative z-10 container mx-auto px-6 py-12 flex flex-col items-center">
        
        <div className="w-full max-w-5xl mb-8 flex justify-between items-center bg-white/5 backdrop-blur-md border border-black/20 dark:border-white/10 p-4 rounded-2xl shadow-2xl">
          <Link to="/" className="flex items-center text-textMuted hover:text-white transition-colors font-medium">
            <ArrowLeft size={20} className="mr-2" /> SkillVerse Academy
          </Link>
          <div className="flex items-center gap-2 text-success font-bold bg-success/10 px-4 py-2 rounded-lg border border-success/20">
             <ShieldCheck size={20} /> Verified Credential
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl items-center lg:items-start">
           
           {/* Beautiful Pentagon Badge Display */}
           <div className="lg:w-1/3 flex flex-col items-center text-center">
              <div className="relative w-64 h-64 mb-8 drop-shadow-[0_0_30px_rgba(245,201,122,0.3)] animate-float">
                <div className="absolute inset-0 bg-gradient-to-br from-[#F5C97A] via-[#D4AF37] to-[#AA7C11] badge-hexagon"></div>
                <div className="absolute inset-1 bg-gradient-to-br from-[#0B1220] to-[#1E293B] badge-hexagon"></div>
                <div className="absolute inset-2 bg-gradient-to-br from-[#0B1220] to-[#1E293B] badge-hexagon badge-hexagon-inner"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                   <Award size={64} className="text-[#F5C97A] mb-2 drop-shadow-lg" />
                   <div className="text-sm font-bold text-white tracking-widest uppercase mt-4 leading-tight">
                      {data.courseTitle}
                   </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">{data.username}</h2>
              <p className="text-[#B9B6E3] mb-6 font-medium tracking-wide">{data.courseTitle} Certified</p>

              <div className="w-full bg-white/5 border border-black/20 dark:border-white/10 rounded-2xl p-6 backdrop-blur-sm text-left">
                 <div className="mb-4">
                    <p className="text-xs text-textMuted uppercase tracking-wider mb-1">Credential ID</p>
                    <p className="font-mono text-[#F5C97A]">{data.credentialId}</p>
                 </div>
                 <div className="mb-4">
                    <p className="text-xs text-textMuted uppercase tracking-wider mb-1">Issue Date</p>
                    <p className="text-white font-medium">{data.date}</p>
                 </div>
                 <div>
                    <p className="text-xs text-textMuted uppercase tracking-wider mb-1">Final Score</p>
                    <p className="text-success font-bold text-lg">{data.score}%</p>
                 </div>
              </div>
           </div>

           {/* Certificate Preview */}
           <div className="lg:w-2/3 w-full flex flex-col">
              <div className="w-full overflow-x-auto pb-4 no-scrollbar">
                 <div className="min-w-[700px] w-full transform scale-90 md:scale-100 origin-top">
                    <CertificateDisplay data={data} isPrinting={isDownloading} />
                 </div>
              </div>
              <div className="flex justify-end mt-4">
                 <button 
                   onClick={handleDownloadPDF}
                   disabled={isDownloading}
                   className="flex items-center gap-2 bg-gradient-main text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all font-bold disabled:opacity-50 text-lg"
                 >
                   <Download size={20} /> 
                   {isDownloading ? "Generating PDF..." : "Download Official PDF"}
                 </button>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};
