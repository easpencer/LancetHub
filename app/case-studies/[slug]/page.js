'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaUser, 
  FaTags, 
  FaQuoteRight, 
  FaExclamationTriangle,
  FaBuilding,
  FaGraduationCap,
  FaChartLine,
  FaLightbulb,
  FaClipboardList,
  FaExternalLinkAlt,
  FaBookOpen
} from 'react-icons/fa';
import LoadingState from '../../../components/LoadingState';
import styles from './case-study.module.css';

export default function CaseStudyPage({ params }) {
  const slug = params.slug;
  const router = useRouter();
  const pathname = usePathname();
  
  const [study, setStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedStudies, setRelatedStudies] = useState([]);
  
  useEffect(() => {
    async function fetchStudy() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch the specific case study
        const response = await fetch('/api/case-studies');
        if (!response.ok) {
          throw new Error(`Failed to fetch case studies: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        const allStudies = data.caseStudies || [];
        
        // Find the specific case study by ID
        const foundStudy = allStudies.find(s => s.id === slug);
        
        if (!foundStudy) {
          throw new Error('Case study not found');
        }
        
        // Enrich the study data with formatted fields
        const enrichedStudy = {
          ...foundStudy,
          formattedDate: foundStudy.Date ? new Date(foundStudy.Date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : null,
          dimensionsList: (foundStudy.Dimensions || '').split(',').map(d => d.trim()).filter(Boolean),
          keywordsList: (foundStudy.Keywords || '').split(',').map(k => k.trim()).filter(Boolean)
        };
        
        setStudy(enrichedStudy);
        
        // Find related studies by dimensions
        if (foundStudy.Dimensions) {
          const dimensions = foundStudy.Dimensions.split(',').map(d => d.trim());
          
          // Filter for studies that share at least one dimension but aren't the same study
          const related = allStudies
            .filter(s => 
              s.id !== foundStudy.id && 
              s.Dimensions && 
              dimensions.some(dim => s.Dimensions.includes(dim))
            )
            .slice(0, 4); // Get up to 4 related studies
          
          setRelatedStudies(related);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching case study:', err);
        setError(err.message);
        setLoading(false);
      }
    }
    
    fetchStudy();
  }, [slug]);
  
  const goBack = () => {
    router.back();
  };
  
  if (loading) {
    return <LoadingState message="Loading Case Study" />;
  }
  
  if (error || !study) {
    return (
      <div className={styles.errorContainer}>
        <FaExclamationTriangle className={styles.errorIcon} />
        <h2>Error Loading Case Study</h2>
        <p>{error || 'Case study not found'}</p>
        <button onClick={goBack} className={styles.backButton}>
          <FaArrowLeft /> Go Back
        </button>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <button onClick={goBack} className={styles.backButton}>
        <FaArrowLeft /> Back to Case Studies
      </button>
      
      <motion.div 
        className={styles.studyHeader}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.headerTop}>
          {study.Type && <span className={styles.studyType}>{study.Type}</span>}
          {study.Status && (
            <span className={`${styles.statusBadge} ${styles[study.Status.toLowerCase()]}`}>
              {study.Status}
            </span>
          )}
        </div>
        
        <h1>{study.Title}</h1>
        
        <div className={styles.studyMeta}>
          <div className={styles.metaItem}>
            <FaUser />
            <span>{study.Author || 'Unknown Author'}</span>
          </div>
          
          {study.Institution && (
            <div className={styles.metaItem}>
              <FaBuilding />
              <span>{study.Institution}</span>
            </div>
          )}
          
          {study.formattedDate && (
            <div className={styles.metaItem}>
              <FaCalendarAlt />
              <span>{study.formattedDate}</span>
            </div>
          )}
        </div>
        
        {study.dimensionsList.length > 0 && (
          <div className={styles.dimensionTags}>
            <FaTags className={styles.tagsIcon} />
            <div className={styles.tagsList}>
              {study.dimensionsList.map((dimension, i) => (
                <span key={i} className={styles.dimensionTag}>{dimension}</span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
      
      <motion.div 
        className={styles.studyContent}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {study.Description && (
          <div className={styles.studySummary}>
            <FaQuoteRight className={styles.quoteIcon} />
            <p>{study.Description}</p>
          </div>
        )}
        
        <div className={styles.contentGrid}>
          {study.Focus && (
            <div className={styles.contentSection}>
              <div className={styles.sectionHeader}>
                <FaChartLine className={styles.sectionIcon} />
                <h2>Study Focus</h2>
              </div>
              <p>{study.Focus}</p>
            </div>
          )}
          
          {study.Relevance && (
            <div className={styles.contentSection}>
              <div className={styles.sectionHeader}>
                <FaLightbulb className={styles.sectionIcon} />
                <h2>Relevance to Societal Resilience</h2>
              </div>
              <p>{study.Relevance}</p>
            </div>
          )}
          
          {study.Methodology && (
            <div className={styles.contentSection}>
              <div className={styles.sectionHeader}>
                <FaGraduationCap className={styles.sectionIcon} />
                <h2>Methodology</h2>
              </div>
              <p>{study.Methodology}</p>
            </div>
          )}
          
          {study.Findings && (
            <div className={styles.contentSection}>
              <div className={styles.sectionHeader}>
                <FaChartLine className={styles.sectionIcon} />
                <h2>Key Findings</h2>
              </div>
              <p>{study.Findings}</p>
            </div>
          )}
          
          {study.Recommendations && (
            <div className={styles.contentSection}>
              <div className={styles.sectionHeader}>
                <FaClipboardList className={styles.sectionIcon} />
                <h2>Recommendations</h2>
              </div>
              <p>{study.Recommendations}</p>
            </div>
          )}
        </div>
        
        {(study.keywordsList.length > 0 || study.URL || study.DOI) && (
          <div className={styles.studyFooter}>
            {study.keywordsList.length > 0 && (
              <div className={styles.keywordsSection}>
                <h3>Keywords</h3>
                <div className={styles.keywordsList}>
                  {study.keywordsList.map((keyword, i) => (
                    <span key={i} className={styles.keyword}>{keyword}</span>
                  ))}
                </div>
              </div>
            )}
            
            <div className={styles.externalLinks}>
              {study.URL && (
                <a 
                  href={study.URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.externalLink}
                >
                  <FaExternalLinkAlt /> View External Resource
                </a>
              )}
              
              {study.DOI && (
                <a 
                  href={`https://doi.org/${study.DOI}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.doiLink}
                >
                  <FaBookOpen /> DOI: {study.DOI}
                </a>
              )}
            </div>
          </div>
        )}
      </motion.div>
      
      {relatedStudies.length > 0 && (
        <motion.div 
          className={styles.relatedSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h2>Related Case Studies</h2>
          
          <div className={styles.relatedGrid}>
            {relatedStudies.map((related) => (
              <div 
                key={related.id} 
                className={styles.relatedCard}
                onClick={() => router.push(`/case-studies/${related.id}`)}
              >
                <span className={styles.relatedType}>{related.Type || 'Research'}</span>
                <h3>{related.Title}</h3>
                <p>{related.Description}</p>
                {related.Author && (
                  <div className={styles.relatedMeta}>
                    <FaUser /> {related.Author}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
