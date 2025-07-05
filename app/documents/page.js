'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaFilePdf, FaFilePowerpoint, FaFileWord, FaDownload, FaEye, FaSearch, FaFolder } from 'react-icons/fa';
import styles from './documents.module.css';

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  const documents = [
    {
      id: 'lancet-commission-announcement',
      title: 'Lancet Commission on US Societal Resilience - Announcement',
      description: 'Official announcement of the Lancet Commission on US Societal Resilience in a Global Pandemic Age',
      fileType: 'pdf',
      category: 'announcements',
      date: '2024-07-01',
      path: '/documents/PIIS0140673624027211.pdf'
    },
    {
      id: 'lancet-roadmap-2025',
      title: 'Lancet Commission Roadmap 2025',
      description: 'Strategic planning deck for the Lancet Commission on Societal Resilience',
      fileType: 'pptx',
      category: 'presentations',
      date: '2023-11-15',
      path: '/documents/Lancet roadmap deck 2025.pptx'
    },
    {
      id: 'lancet-3-0',
      title: 'Lancet 3.0 Framework',
      description: 'Comprehensive framework document for the third phase of the Lancet Commission',
      fileType: 'docx',
      category: 'reports',
      date: '2023-10-05',
      path: '/documents/Lancet 3.0.docx'
    },
    {
      id: 'community-resilience-framework',
      title: 'Community Resilience Framework',
      description: 'Framework for assessing and building community resilience across different contexts',
      fileType: 'pdf',
      category: 'frameworks',
      date: '2024-02-20',
      path: '/documents/community-resilience-framework.pdf'
    },
    {
      id: 'social-cohesion-report',
      title: 'Social Cohesion in Crisis Response',
      description: 'Analysis of how social cohesion influences community resilience during crises',
      fileType: 'pdf',
      category: 'reports',
      date: '2024-01-10',
      path: '/documents/social-cohesion-report.pdf'
    },
  ];
  
  const categories = [
    { id: 'all', label: 'All Documents', icon: <FaFolder /> },
    { id: 'announcements', label: 'Announcements', icon: <FaFilePdf /> },
    { id: 'reports', label: 'Reports', icon: <FaFilePdf /> },
    { id: 'presentations', label: 'Presentations', icon: <FaFilePowerpoint /> },
    { id: 'frameworks', label: 'Frameworks', icon: <FaFileWord /> },
  ];
  
  const getFileIcon = (fileType) => {
    switch(fileType) {
      case 'pdf': return <FaFilePdf className={styles.pdfIcon} />;
      case 'pptx': return <FaFilePowerpoint className={styles.pptIcon} />;
      case 'docx': return <FaFileWord className={styles.docIcon} />;
      default: return <FaFilePdf className={styles.pdfIcon} />;
    }
  };
  
  const filteredDocuments = documents.filter(document => {
    const matchesCategory = activeCategory === 'all' || document.category === activeCategory;
    const matchesSearch = document.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        document.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Working Documents</h1>
        <p className={styles.subtitle}>
          Access reports, presentations, and reference materials from the Lancet Commission on Societal Resilience
        </p>
        
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </motion.div>
      
      <div className={styles.categories}>
        {categories.map(category => (
          <button
            key={category.id}
            className={`${styles.categoryButton} ${activeCategory === category.id ? styles.active : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.icon} {category.label}
          </button>
        ))}
      </div>
      
      <div className={styles.documentsGrid}>
        {filteredDocuments.length > 0 ? (
          filteredDocuments.map(doc => (
            <motion.div 
              key={doc.id}
              className={styles.documentCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
            >
              <div className={styles.fileTypeIcon}>
                {getFileIcon(doc.fileType)}
              </div>
              
              <div className={styles.documentInfo}>
                <h2>{doc.title}</h2>
                <p className={styles.documentMeta}>
                  {new Date(doc.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className={styles.documentDescription}>{doc.description}</p>
              </div>
              
              <div className={styles.documentActions}>
                <a href={doc.path} download className={styles.downloadButton}>
                  <FaDownload /> Download
                </a>
                <Link href={`/documents/view/${doc.id}`} className={styles.viewButton}>
                  <FaEye /> View
                </Link>
              </div>
            </motion.div>
          ))
        ) : (
          <div className={styles.noResults}>
            <FaSearch className={styles.noResultsIcon} />
            <p>No documents found matching your search.</p>
            <button
              className={styles.resetButton}
              onClick={() => {
                setSearchTerm('');
                setActiveCategory('all');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
