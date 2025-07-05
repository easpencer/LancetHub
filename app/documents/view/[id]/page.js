'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaDownload, FaExternalLinkAlt, FaFilePdf, FaFileWord, FaFilePowerpoint, FaExclamationTriangle } from 'react-icons/fa';
import styles from './document-viewer.module.css';

export default function DocumentViewPage() {
  const params = useParams();
  const router = useRouter();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { id } = params;
  
  // This would be fetched from an API in a real application
  const documents = {
    'lancet-commission-announcement': {
      title: 'Lancet Commission on US Societal Resilience - Announcement',
      description: 'Official announcement of the Lancet Commission on US Societal Resilience in a Global Pandemic Age',
      fileType: 'pdf',
      path: '/documents/PIIS0140673624027211.pdf',
      date: '2024-07-01',
      author: 'The Lancet & University of California San Diego',
      keywords: ['commission', 'announcement', 'pandemic', 'resilience']
    },
    'lancet-roadmap-2025': {
      title: 'Lancet Commission Roadmap 2025',
      description: 'Strategic planning deck for the Lancet Commission on Societal Resilience',
      fileType: 'pptx',
      path: '/documents/Lancet roadmap deck 2025.pptx',
      date: '2023-11-15',
      author: 'Lancet Commission Strategy Team',
      keywords: ['roadmap', 'strategy', 'planning', 'resilience']
    },
    'lancet-3-0': {
      title: 'Lancet 3.0 Framework',
      description: 'Comprehensive framework document for the third phase of the Lancet Commission',
      fileType: 'docx',
      path: '/documents/Lancet 3.0.docx',
      date: '2023-10-05',
      author: 'Lancet Commission Research Team',
      keywords: ['framework', 'methodology', 'community resilience']
    },
    'community-resilience-framework': {
      title: 'Community Resilience Framework',
      description: 'Framework for assessing and building community resilience across different contexts',
      fileType: 'pdf',
      path: '/documents/community-resilience-framework.pdf',
      date: '2024-02-20',
      author: 'Resilience Research Group',
      keywords: ['resilience', 'framework', 'assessment', 'community']
    },
    'social-cohesion-report': {
      title: 'Social Cohesion in Crisis Response',
      description: 'Analysis of how social cohesion influences community resilience during crises',
      fileType: 'pdf',
      path: '/documents/social-cohesion-report.pdf',
      date: '2024-01-10',
      author: 'Resilience Research Group',
      keywords: ['social cohesion', 'crisis', 'response', 'community']
    }
  };
  
  useEffect(() => {
    if (id) {
      setLoading(true);
      
      // Check if document exists in our collection
      const doc = documents[id];
      
      if (doc) {
        setDocument(doc);
        // After initial load, check if file exists
        fetch(doc.path)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Document file not available: ${response.status}`);
            }
          })
          .catch(err => {
            console.error('Error checking document file:', err);
            setError('The document file could not be loaded. It may not exist on the server.');
          });
      } else {
        setError('Document not found');
        // Wait a moment before redirecting
        setTimeout(() => router.push('/documents'), 2000);
      }
      
      setLoading(false);
    }
  }, [id, router]);
  
  const getFileIcon = (fileType) => {
    switch(fileType) {
      case 'pdf': return <FaFilePdf className={styles.pdfIcon} />;
      case 'pptx': return <FaFilePowerpoint className={styles.pptIcon} />;
      case 'docx': return <FaFileWord className={styles.docIcon} />;
      default: return <FaFilePdf className={styles.pdfIcon} />;
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <h2>Loading document...</h2>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <FaExclamationTriangle className={styles.errorIcon} />
        <h2>Error Loading Document</h2>
        <p>{error}</p>
        <Link href="/documents" className={styles.backLink}>
          <FaArrowLeft /> Return to Documents
        </Link>
      </div>
    );
  }
  
  if (!document) {
    return (
      <div className={styles.errorContainer}>
        <FaExclamationTriangle className={styles.errorIcon} />
        <h2>Document Not Found</h2>
        <p>The requested document could not be found.</p>
        <Link href="/documents" className={styles.backLink}>
          <FaArrowLeft /> Return to Documents
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.backLinkContainer}>
        <Link href="/documents" className={styles.backLink}>
          <FaArrowLeft /> All Documents
        </Link>
        
        <a href={document.path} download className={styles.downloadButton}>
          <FaDownload /> Download
        </a>
      </div>
      
      <div className={styles.documentHeader}>
        <div className={styles.fileTypeIconLarge}>
          {getFileIcon(document.fileType)}
        </div>
        
        <h1>{document.title}</h1>
        <p className={styles.documentMeta}>
          {document.author} • {new Date(document.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
        
        <p className={styles.documentDescription}>{document.description}</p>
        
        <div className={styles.keywordsContainer}>
          {document.keywords && document.keywords.map((keyword, idx) => (
            <span key={idx} className={styles.keyword}>{keyword}</span>
          ))}
        </div>
      </div>
      
      <div className={styles.documentViewer}>
        {document.fileType === 'pdf' ? (
          <object 
            data={document.path}
            type="application/pdf"
            className={styles.pdfViewer}
            title={document.title}
          >
            <p>Your browser does not support PDF viewing. Please <a href={document.path} download>download the PDF</a> to view it.</p>
          </object>
        ) : (
          <div className={styles.nonPdfViewer}>
            <div className={styles.nonPdfIcon}>
              {getFileIcon(document.fileType)}
            </div>
            <h3>This document cannot be previewed in browser</h3>
            <p>Please download the file to view its contents.</p>
            <a href={document.path} download className={styles.downloadButtonLarge}>
              <FaDownload /> Download {document.fileType.toUpperCase()} File
            </a>
          </div>
        )}
      </div>
      
      <div className={styles.viewerNote}>
        <FaExternalLinkAlt className={styles.externalIcon} />
        <p>Having trouble viewing this document? <a href={document.path} download>Download it</a> to view offline.</p>
      </div>
    </div>
  );
}
