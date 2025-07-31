'use client';

import { useEffect, useState, use } from 'react';
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
  const slug = use(params).slug;
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
          // Map fields for easier access
          Title: foundStudy['Case Study Title'] || foundStudy.Title || 'Untitled',
          Author: foundStudy.Name || foundStudy.People || foundStudy.Author || '',
          AuthorNames: foundStudy.AuthorNames || foundStudy.Name || foundStudy.People || foundStudy.Author || '',
          AuthorInstitutions: foundStudy.AuthorInstitutions || '',
          Authors: foundStudy.Authors || [],
          Description: foundStudy['Short Description'] || foundStudy.Description || '',
          Focus: foundStudy['Study Focus'] || foundStudy.StudyFocus || foundStudy.Focus || '',
          Type: foundStudy['Study Type '] || foundStudy.Type || 'Research', // Note the trailing space!
          Relevance: foundStudy['Relevance to Community/Societal Resilience'] || foundStudy.Relevance || '',
          Dimensions: foundStudy['Resilient Dimensions '] || foundStudy.Dimensions || '', // Note the trailing space!
          Keywords: foundStudy['Key Words '] || foundStudy.Keywords || '', // Note the trailing space!
          // Rich text fields
          Results: foundStudy.Results || foundStudy.findings || '',
          Insights: foundStudy.Insights || foundStudy.recommendations || '',
          Methods: foundStudy.Methods || foundStudy.methodology || '',
          ResilienceFactors: foundStudy['Resilience Factors (positive and negative)'] || '',
          InitialLessons: foundStudy['Initial Lessons (What kind of actions do we need to be taking now)'] || '',
          Audience: foundStudy['Audience (who are the people these lessons are directed to)'] || '',
          NextSteps: foundStudy['Next steps'] || foundStudy['Potential next steps (expansion) of the topic'] || '',
          formattedDate: foundStudy.Date ? new Date(foundStudy.Date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : null,
          dimensionsList: (() => {
            const dims = foundStudy['Resilient Dimensions '] || foundStudy.Dimensions || [];
            if (Array.isArray(dims)) {
              return dims.map(d => d.trim()).filter(Boolean);
            }
            return (dims || '').split(',').map(d => d.trim()).filter(Boolean);
          })(),
          keywordsList: (() => {
            const kw = foundStudy['Key Words '] || foundStudy.Keywords || [];
            if (Array.isArray(kw)) {
              return kw.map(k => k.trim()).filter(Boolean);
            }
            return (kw || '').split(',').map(k => k.trim()).filter(Boolean);
          })()
        };
        
        setStudy(enrichedStudy);
        
        // Find related studies by dimensions
        if (foundStudy.Dimensions) {
          let dimensions;
          if (Array.isArray(foundStudy.Dimensions)) {
            dimensions = foundStudy.Dimensions.map(d => d.trim());
          } else {
            dimensions = (foundStudy.Dimensions || '').split(',').map(d => d.trim());
          }
          
          // Filter for studies that share at least one dimension but aren't the same study
          const related = allStudies
            .filter(s => {
              const sDimensions = s['Resilient Dimensions '] || s.Dimensions || [];
              let sDimensionsArray;
              if (Array.isArray(sDimensions)) {
                sDimensionsArray = sDimensions;
              } else {
                sDimensionsArray = (sDimensions || '').split(',').map(d => d.trim());
              }
              return s.id !== foundStudy.id && 
                sDimensionsArray.length > 0 && 
                dimensions.some(dim => sDimensionsArray.includes(dim));
            })
            .map(s => ({
              ...s,
              Title: s['Case Study Title'] || s.Title || 'Untitled',
              Author: s.Name || s.People || s.Author || '',
              Description: s['Short Description'] || s.Description || '',
              Type: s['Study Type '] || s.Type || 'Research'
            }))
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
            <div className={styles.authorInfo}>
              <span className={styles.authorName}>{study.AuthorNames || study.Author || 'Unknown Author'}</span>
              {study.AuthorInstitutions && (
                <span className={styles.authorInstitution}>{study.AuthorInstitutions}</span>
              )}
            </div>
          </div>
          
          {study.section && (
            <div className={styles.metaItem}>
              <FaBookOpen />
              <span>{study.section}</span>
            </div>
          )}
          
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
          
          {study.Context && (
            <div className={styles.contentSection}>
              <div className={styles.sectionHeader}>
                <FaBuilding className={styles.sectionIcon} />
                <h2>Study Context</h2>
              </div>
              <p>{study.Context}</p>
            </div>
          )}
          
          {(study.Methods || study.Methodology) && (
            <div className={styles.contentSection}>
              <div className={styles.sectionHeader}>
                <FaGraduationCap className={styles.sectionIcon} />
                <h2>Methods</h2>
              </div>
              <p>{study.Methods || study.Methodology}</p>
            </div>
          )}
          
          {(study.Results || study.Findings) && (
            <div className={styles.contentSection}>
              <div className={styles.sectionHeader}>
                <FaChartLine className={styles.sectionIcon} />
                <h2>{study.Results ? 'Results' : 'Key Findings'}</h2>
              </div>
              <p>{study.Results || study.Findings}</p>
            </div>
          )}
          
          
          {study.Impact && (
            <div className={styles.contentSection}>
              <div className={styles.sectionHeader}>
                <FaExclamationTriangle className={styles.sectionIcon} />
                <h2>Potential Impact</h2>
              </div>
              <p>{study.Impact}</p>
            </div>
          )}
          
          {study.Challenges && (
            <div className={styles.contentSection}>
              <div className={styles.sectionHeader}>
                <FaExclamationTriangle className={styles.sectionIcon} />
                <h2>Implementation Challenges</h2>
              </div>
              <p>{study.Challenges}</p>
            </div>
          )}
          
          {(study.Recommendations || study.Insights) && (
            <div className={styles.contentSection}>
              <div className={styles.sectionHeader}>
                <FaClipboardList className={styles.sectionIcon} />
                <h2>{study.Insights ? 'Insights & Recommendations' : 'Recommendations'}</h2>
              </div>
              <p>{study.Insights || study.Recommendations}</p>
            </div>
          )}
          
          {study.ResilienceFactors && (
            <div className={styles.contentSection}>
              <div className={styles.sectionHeader}>
                <FaLightbulb className={styles.sectionIcon} />
                <h2>Resilience Factors</h2>
              </div>
              <p>{study.ResilienceFactors}</p>
            </div>
          )}
          
          {study.InitialLessons && (
            <div className={styles.contentSection}>
              <div className={styles.sectionHeader}>
                <FaBookOpen className={styles.sectionIcon} />
                <h2>Initial Lessons</h2>
              </div>
              <p>{study.InitialLessons}</p>
            </div>
          )}
          
          {study.Audience && (
            <div className={styles.contentSection}>
              <div className={styles.sectionHeader}>
                <FaUser className={styles.sectionIcon} />
                <h2>Target Audience</h2>
              </div>
              <p>{study.Audience}</p>
            </div>
          )}
          
          {study.Limitations && (
            <div className={styles.contentSection}>
              <div className={styles.sectionHeader}>
                <FaExclamationTriangle className={styles.sectionIcon} />
                <h2>Study Limitations</h2>
              </div>
              <p>{study.Limitations}</p>
            </div>
          )}
          
          {study.FutureWork && (
            <div className={styles.contentSection}>
              <div className={styles.sectionHeader}>
                <FaChartLine className={styles.sectionIcon} />
                <h2>Future Work</h2>
              </div>
              <p>{study.FutureWork}</p>
            </div>
          )}
          
          {study.References && (
            <div className={styles.contentSection}>
              <div className={styles.sectionHeader}>
                <FaBookOpen className={styles.sectionIcon} />
                <h2>References</h2>
              </div>
              <div className={styles.references}>
                {(() => {
                  // Handle References as either string or array
                  let referencesList = [];
                  if (typeof study.References === 'string') {
                    referencesList = study.References.split('\n').filter(Boolean);
                  } else if (Array.isArray(study.References)) {
                    referencesList = study.References;
                  }
                  
                  return referencesList.map((ref, index) => (
                    <p key={index} className={styles.reference}>
                      {typeof ref === 'string' ? ref.trim() : ref}
                    </p>
                  ));
                })()}
              </div>
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
        
        {/* Authors section */}
        {study.Authors && study.Authors.length > 0 && (
          <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <FaUser className={styles.sectionIcon} />
              <h2>Authors & Contributors</h2>
            </div>
            <div className={styles.authorsGrid}>
              {study.Authors.map((author, index) => (
                <div key={index} className={styles.authorCard}>
                  <div className={styles.authorName}>{author.name}</div>
                  {author.institution && (
                    <div className={styles.authorInstitution}>{author.institution}</div>
                  )}
                  {author.role && (
                    <div className={styles.authorRole}>{author.role}</div>
                  )}
                  {author.expertise && (
                    <div className={styles.authorExpertise}>{author.expertise}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Display all other fields that don't have specific sections */}
        <div className={styles.additionalFields}>
          {Object.entries(study).map(([key, value]) => {
            // Skip fields we've already displayed or internal fields
            const displayedFields = [
              'id', 'Title', 'Author', 'Description', 'Focus', 'Type', 'Relevance', 
              'Dimensions', 'Keywords', 'formattedDate', 'dimensionsList', 'keywordsList',
              'Context', 'Methods', 'Methodology', 'Results', 'Findings', 'Insights',
              'Impact', 'Challenges', 'Recommendations', 'Limitations', 'FutureWork',
              'References', 'URL', 'DOI', 'Status', 'Institution', 'section', 'Date',
              'Case Study Title', 'Short Description', 'Study Focus', 'Study Type ',
              'Relevance to Community/Societal Resilience', 'Resilient Dimensions ',
              'Key Words ', 'Name', 'People', 'Authors', 'AuthorNames', 'AuthorInstitutions'
            ];
            
            if (displayedFields.includes(key) || !value || value === '') {
              return null;
            }
            
            return (
              <div key={key} className={styles.contentSection}>
                <div className={styles.sectionHeader}>
                  <FaBookOpen className={styles.sectionIcon} />
                  <h2>{key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()}</h2>
                </div>
                <p>{typeof value === 'object' ? JSON.stringify(value, null, 2) : value}</p>
              </div>
            );
          })}
        </div>
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
