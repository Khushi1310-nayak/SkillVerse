import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface InterviewReportData {
  companyName: string;
  candidateName: string;
  date: string;
  readinessScore: number;
  strengths: string[];
  improvements: string[];
  aiFeedback: string;
}

/**
 * Generates and downloads a professional, high-DPI PDF report for the AI Interview Feedback.
 * Styled in print-friendly light mode with SkillVerse brand colors and typography.
 * Handles multi-page overflow cleanly by overlaying custom header/footer masks.
 */
export const generateInterviewReportPDF = async (data: InterviewReportData): Promise<void> => {
  // Create temporary container offscreen
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '794px'; // Standard A4 width at 96 DPI
  container.style.backgroundColor = '#FFFFFF';
  container.style.color = '#1E293B';
  container.style.padding = '60px 50px';
  container.style.boxSizing = 'border-box';

  // Inject beautiful, structured HTML report
  container.innerHTML = `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    
    <div style="font-family: 'Plus Jakarta Sans', sans-serif; line-height: 1.6;">
      <!-- Accent top border -->
      <div style="height: 8px; background: linear-gradient(90deg, #6968A6 0%, #CF9893 100%); margin: -60px -50px 40px -50px; border-top-left-radius: 4px; border-top-right-radius: 4px;"></div>
      
      <!-- Brand & Date Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #F1F5F9; padding-bottom: 24px; margin-bottom: 32px;">
        <div>
          <h1 style="font-family: 'Outfit', sans-serif; font-size: 26px; font-weight: 800; color: #0F172A; margin: 0; letter-spacing: -0.5px;">SKILLVERSE</h1>
          <p style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; tracking-wider; margin: 4px 0 0 0;">AI Interview Feedback Report</p>
        </div>
        <div style="text-align: right;">
          <p style="font-size: 12px; color: #64748B; margin: 0;">Date Evaluated: <strong style="color: #334155;">${data.date}</strong></p>
          <p style="font-size: 12px; color: #64748B; margin: 4px 0 0 0;">Candidate: <strong style="color: #334155;">${data.candidateName}</strong></p>
        </div>
      </div>

      <!-- Overview Card with Circular Gauge -->
      <div style="display: flex; gap: 28px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 20px; padding: 24px; margin-bottom: 36px; align-items: center;">
        <!-- Gauge Circle -->
        <div style="position: relative; width: 104px; height: 104px; border-radius: 50%; background: ${data.readinessScore < 50 ? '#FEF2F2' : data.readinessScore < 75 ? '#FFF7ED' : '#ECFDF5'}; border: 4px solid ${data.readinessScore < 50 ? '#EF4444' : data.readinessScore < 75 ? '#F97316' : '#10B981'}; display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <span style="font-size: 30px; font-weight: 800; color: ${data.readinessScore < 50 ? '#991B1B' : data.readinessScore < 75 ? '#C2410C' : '#065F46'}; line-height: 1;">${data.readinessScore}%</span>
          <span style="font-size: 9px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 3px;">Readiness</span>
        </div>
        <div>
          <h3 style="font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 700; color: #0F172A; margin: 0 0 6px 0;">Performance Summary</h3>
          <p style="font-size: 13.5px; color: #475569; margin: 0; line-height: 1.6;">
            This technical report documents the assessment results for ${data.candidateName} following their AI-conducted mock interview simulating hiring loops at <strong style="color: #0F172A;">${data.companyName}</strong>. 
            The score of <strong>${data.readinessScore}%</strong> ranks their readiness across technical capability, architecture layout, and language usage.
          </p>
        </div>
      </div>

      <!-- Strengths -->
      <div style="margin-bottom: 32px;">
        <h3 style="font-family: 'Outfit', sans-serif; font-size: 16px; font-weight: 700; color: #0F172A; border-left: 4px solid #10B981; padding-left: 12px; margin: 0 0 16px 0;">Technical Strengths</h3>
        <ul style="margin: 0; padding-left: 20px; font-size: 13.5px; color: #334155; line-height: 1.85;">
          ${data.strengths.map(strength => `<li style="margin-bottom: 10px; padding-left: 4px;">${strength}</li>`).join('')}
        </ul>
      </div>

      <!-- Improvements -->
      <div style="margin-bottom: 36px;">
        <h3 style="font-family: 'Outfit', sans-serif; font-size: 16px; font-weight: 700; color: #0F172A; border-left: 4px solid #F97316; padding-left: 12px; margin: 0 0 16px 0;">Improvement Areas</h3>
        <ul style="margin: 0; padding-left: 20px; font-size: 13.5px; color: #334155; line-height: 1.85;">
          ${data.improvements.map(improvement => `<li style="margin-bottom: 10px; padding-left: 4px;">${improvement}</li>`).join('')}
        </ul>
      </div>

      <!-- AI Feedback Text -->
      <div style="margin-bottom: 40px; border-top: 1px solid #E2E8F0; padding-top: 28px;">
        <h3 style="font-family: 'Outfit', sans-serif; font-size: 16px; font-weight: 700; color: #0F172A; margin: 0 0 16px 0;">Detailed AI Feedback</h3>
        <div style="font-size: 13px; color: #334155; line-height: 1.85; white-space: pre-wrap; font-family: 'Plus Jakarta Sans', sans-serif;">${data.aiFeedback}</div>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    // Render HTML container to high-resolution canvas to avoid blurriness
    const canvas = await html2canvas(container, {
      scale: 2, 
      useCORS: true,
      logging: false,
      backgroundColor: '#FFFFFF',
      windowWidth: 794
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');

    // A4 Dimensions: 210mm x 297mm
    const pdfWidth = 210;
    const pdfHeight = 297;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Convert pixel height to mm
    const imgWidth = pdfWidth;
    const imgHeight = (canvasHeight * pdfWidth) / canvasWidth;

    let heightLeft = imgHeight;
    let page = 1;

    // Decoration layer (covers sliced text lines on top/bottom margins, writes footer details)
    const decoratePage = (currentPage: number) => {
      // Top overlay block on page 2+
      if (currentPage > 1) {
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, pdfWidth, 16, 'F');
      }

      // Bottom overlay block on all pages
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, pdfHeight - 16, pdfWidth, 16, 'F');

      // Add clean divider line above footer
      pdf.setDrawColor(241, 245, 249);
      pdf.setLineWidth(0.5);
      pdf.line(15, pdfHeight - 16, pdfWidth - 15, pdfHeight - 16);

      // Write footer branding and page indexes
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.5);
      pdf.setTextColor(148, 163, 184); // #94A3B8
      pdf.text('Generated by SkillVerse AI Career Mode', 15, pdfHeight - 8);
      pdf.text(`Page ${currentPage}`, pdfWidth - 25, pdfHeight - 8);
    };

    // Render Page 1
    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
    decoratePage(page);
    heightLeft -= pdfHeight;

    // Render additional pages if content overflows A4 height
    while (heightLeft > 0) {
      page += 1;
      pdf.addPage();
      
      const position = -pdfHeight * (page - 1);
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      decoratePage(page);
      
      heightLeft -= pdfHeight;
    }

    pdf.save('Interview-Feedback-Report.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  } finally {
    // Remove temporary node from document
    document.body.removeChild(container);
  }
};
