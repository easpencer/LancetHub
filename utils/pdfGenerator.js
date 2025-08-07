import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function generateCaseStudyPDF(caseStudy) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (2 * margin);
  let yPosition = margin;

  // Helper function to add text with word wrapping
  const addWrappedText = (text, fontSize, fontStyle = 'normal', lineHeight = fontSize * 0.4) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', fontStyle);
    const lines = pdf.splitTextToSize(text, contentWidth);
    
    lines.forEach(line => {
      if (yPosition + lineHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(line, margin, yPosition);
      yPosition += lineHeight;
    });
    
    return yPosition;
  };

  // Add header with branding
  pdf.setFillColor(0, 51, 102); // Dark blue
  pdf.rect(0, 0, pageWidth, 30, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('The Lancet Commission', margin, 15);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Pandemic Resilience Hub - Case Study', margin, 22);
  pdf.setTextColor(0, 0, 0);
  yPosition = 40;

  // Title
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  const titleLines = pdf.splitTextToSize(caseStudy.Title || 'Untitled Case Study', contentWidth);
  titleLines.forEach(line => {
    pdf.text(line, margin, yPosition);
    yPosition += 8;
  });
  yPosition += 5;

  // Metadata section
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 5;

  // Author and Institution
  if (caseStudy.AuthorNames || caseStudy.Author) {
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Author(s):', margin, yPosition);
    yPosition += 5;
    pdf.setFont('helvetica', 'normal');
    pdf.text(caseStudy.AuthorNames || caseStudy.Author, margin + 5, yPosition);
    yPosition += 5;
    
    if (caseStudy.AuthorInstitutions) {
      pdf.setFont('helvetica', 'italic');
      pdf.text(caseStudy.AuthorInstitutions, margin + 5, yPosition);
      yPosition += 5;
    }
  }

  // Date
  if (caseStudy.formattedDate) {
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Date: ${caseStudy.formattedDate}`, margin, yPosition);
    yPosition += 5;
  }

  // Study Type
  if (caseStudy.Type) {
    pdf.text(`Type: ${caseStudy.Type}`, margin, yPosition);
    yPosition += 5;
  }

  // Resilience Dimensions
  if (caseStudy.dimensionsList && caseStudy.dimensionsList.length > 0) {
    pdf.setFont('helvetica', 'bold');
    pdf.text('Resilience Dimensions:', margin, yPosition);
    yPosition += 5;
    pdf.setFont('helvetica', 'normal');
    const dimensionsText = caseStudy.dimensionsList.join(', ');
    yPosition = addWrappedText(dimensionsText, 10, 'normal', 5);
  }

  yPosition += 5;
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Main content sections
  const sections = [
    { title: 'Description', content: caseStudy.Description },
    { title: 'Study Focus', content: caseStudy.Focus },
    { title: 'Relevance to Societal Resilience', content: caseStudy.Relevance },
    { title: 'Context', content: caseStudy.Context },
    { title: 'Methodology', content: caseStudy.Methods || caseStudy.Methodology },
    { title: 'Key Findings', content: caseStudy.Results || caseStudy.Findings },
    { title: 'Recommendations', content: caseStudy.Recommendations || caseStudy.Insights },
    { title: 'Resilience Factors', content: caseStudy.ResilienceFactors },
    { title: 'Initial Lessons', content: caseStudy.InitialLessons },
    { title: 'Target Audience', content: caseStudy.Audience },
    { title: 'Implementation Challenges', content: caseStudy.Challenges },
    { title: 'Study Limitations', content: caseStudy.Limitations },
    { title: 'Future Work', content: caseStudy.FutureWork },
    { title: 'Next Steps', content: caseStudy.NextSteps }
  ];

  sections.forEach(section => {
    if (section.content) {
      // Check if we need a new page
      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = margin;
      }

      // Section title
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 51, 102);
      pdf.text(section.title, margin, yPosition);
      yPosition += 7;
      
      // Section content
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      yPosition = addWrappedText(section.content, 11, 'normal', 5);
      yPosition += 8;
    }
  });

  // Keywords
  if (caseStudy.keywordsList && caseStudy.keywordsList.length > 0) {
    if (yPosition > pageHeight - 30) {
      pdf.addPage();
      yPosition = margin;
    }
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 51, 102);
    pdf.text('Keywords:', margin, yPosition);
    yPosition += 5;
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'italic');
    const keywordsText = caseStudy.keywordsList.join(', ');
    yPosition = addWrappedText(keywordsText, 10, 'italic', 5);
  }

  // External links
  if (caseStudy.URL || caseStudy.DOI) {
    yPosition += 5;
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 5;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    if (caseStudy.URL) {
      pdf.setTextColor(0, 0, 255);
      pdf.textWithLink('External Resource', margin, yPosition, { url: caseStudy.URL });
      yPosition += 5;
    }
    
    if (caseStudy.DOI) {
      pdf.setTextColor(0, 0, 255);
      pdf.textWithLink(`DOI: ${caseStudy.DOI}`, margin, yPosition, { url: `https://doi.org/${caseStudy.DOI}` });
    }
  }

  // Footer on last page
  pdf.setTextColor(128, 128, 128);
  pdf.setFontSize(8);
  pdf.text(`Generated from Pandemic Resilience Hub - ${new Date().toLocaleDateString()}`, margin, pageHeight - 10);
  pdf.text(`Page ${pdf.internal.getNumberOfPages()}`, pageWidth - margin - 15, pageHeight - 10);

  return pdf;
}

export async function downloadCaseStudyPDF(caseStudy) {
  try {
    const pdf = await generateCaseStudyPDF(caseStudy);
    const fileName = `${caseStudy.Title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_case_study.pdf`;
    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
}

export async function downloadAllCaseStudiesPDF(caseStudies) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (2 * margin);
  let firstPage = true;

  // Title page
  pdf.setFillColor(0, 51, 102);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  const title1 = 'The Lancet Commission';
  const title1Width = pdf.getTextWidth(title1);
  pdf.text(title1, (pageWidth - title1Width) / 2, 80);
  
  pdf.setFontSize(20);
  const title2 = 'Pandemic Resilience Hub';
  const title2Width = pdf.getTextWidth(title2);
  pdf.text(title2, (pageWidth - title2Width) / 2, 95);
  
  pdf.setFontSize(24);
  const title3 = 'Case Studies Collection';
  const title3Width = pdf.getTextWidth(title3);
  pdf.text(title3, (pageWidth - title3Width) / 2, 115);
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  const subtitle = `${caseStudies.length} Case Studies`;
  const subtitleWidth = pdf.getTextWidth(subtitle);
  pdf.text(subtitle, (pageWidth - subtitleWidth) / 2, 130);
  
  pdf.setFontSize(12);
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const dateWidth = pdf.getTextWidth(date);
  pdf.text(date, (pageWidth - dateWidth) / 2, 145);

  // Table of Contents
  pdf.addPage();
  let yPosition = margin;
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Table of Contents', margin, yPosition);
  yPosition += 15;
  
  pdf.setFontSize(11);
  caseStudies.forEach((study, index) => {
    if (yPosition > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }
    
    pdf.setFont('helvetica', 'normal');
    const tocEntry = `${index + 1}. ${study.Title}`;
    const lines = pdf.splitTextToSize(tocEntry, contentWidth - 20);
    lines.forEach(line => {
      pdf.text(line, margin + 5, yPosition);
      yPosition += 5;
    });
    
    if (study.AuthorNames || study.Author) {
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(9);
      pdf.text(`   by ${study.AuthorNames || study.Author}`, margin + 10, yPosition);
      yPosition += 5;
    }
    
    yPosition += 3;
  });

  // Add each case study
  caseStudies.forEach((study, index) => {
    // Start each case study on a new page
    pdf.addPage();
    yPosition = margin;
    
    // Case study number
    pdf.setFillColor(0, 51, 102);
    pdf.rect(0, 0, pageWidth, 25, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Case Study ${index + 1} of ${caseStudies.length}`, margin, 15);
    pdf.setTextColor(0, 0, 0);
    yPosition = 35;
    
    // Title
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    const titleLines = pdf.splitTextToSize(study.Title || 'Untitled', contentWidth);
    titleLines.forEach(line => {
      pdf.text(line, margin, yPosition);
      yPosition += 7;
    });
    yPosition += 5;
    
    // Author info
    if (study.AuthorNames || study.Author) {
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Author(s): ${study.AuthorNames || study.Author}`, margin, yPosition);
      yPosition += 5;
      
      if (study.AuthorInstitutions) {
        pdf.setFont('helvetica', 'italic');
        const instLines = pdf.splitTextToSize(study.AuthorInstitutions, contentWidth);
        instLines.forEach(line => {
          pdf.text(line, margin, yPosition);
          yPosition += 5;
        });
      }
    }
    
    // Date and Type
    if (study.formattedDate) {
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Date: ${study.formattedDate}`, margin, yPosition);
      yPosition += 5;
    }
    
    if (study.Type) {
      pdf.text(`Type: ${study.Type}`, margin, yPosition);
      yPosition += 5;
    }
    
    yPosition += 5;
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;
    
    // Description
    if (study.Description) {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Description', margin, yPosition);
      yPosition += 6;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const descLines = pdf.splitTextToSize(study.Description, contentWidth);
      descLines.forEach(line => {
        if (yPosition > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin, yPosition);
        yPosition += 5;
      });
      yPosition += 5;
    }
    
    // Study Focus
    if (study.Focus) {
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = margin;
      }
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Study Focus', margin, yPosition);
      yPosition += 6;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const focusLines = pdf.splitTextToSize(study.Focus, contentWidth);
      focusLines.forEach(line => {
        if (yPosition > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin, yPosition);
        yPosition += 5;
      });
      yPosition += 5;
    }
    
    // Dimensions
    if (study.dimensionsList && study.dimensionsList.length > 0) {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = margin;
      }
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Resilience Dimensions:', margin, yPosition);
      yPosition += 6;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      const dimsText = study.dimensionsList.join(', ');
      const dimsLines = pdf.splitTextToSize(dimsText, contentWidth);
      dimsLines.forEach(line => {
        pdf.text(line, margin, yPosition);
        yPosition += 5;
      });
    }
  });
  
  // Add page numbers to all pages except title
  const pageCount = pdf.internal.getNumberOfPages();
  for (let i = 2; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setTextColor(128, 128, 128);
    pdf.setFontSize(9);
    pdf.text(`Page ${i - 1} of ${pageCount - 1}`, pageWidth - margin - 20, pageHeight - 10);
  }
  
  return pdf;
}

export async function downloadAllCaseStudies(caseStudies) {
  try {
    const pdf = await downloadAllCaseStudiesPDF(caseStudies);
    const fileName = `pandemic_resilience_hub_all_case_studies_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error('Error generating PDF collection:', error);
    return false;
  }
}