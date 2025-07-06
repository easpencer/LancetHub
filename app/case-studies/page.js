'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaCalendarAlt, FaUser, FaTags, FaBuilding, FaGraduationCap, FaChartLine, FaBookOpen, FaExternalLinkAlt } from 'react-icons/fa';
import AnimatedSection from '../../components/AnimatedSection';
import LoadingState from '../../components/LoadingState';
import ErrorBoundary from '../../components/ErrorBoundary';
import styles from './case-studies.module.css';

export default function CaseStudies() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [filteredStudies, setFilteredStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDimension, setFilterDimension] = useState('all');
  const [dimensions, setDimensions] = useState([]);
  const [types, setTypes] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // grid or detailed
  const [expandedStudy, setExpandedStudy] = useState(null);

  // Fetch case studies and dimensions
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch case studies with all available fields
        const res = await fetch('/api/case-studies');
        if (!res.ok) {
          throw new Error(`Failed to fetch case studies: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        
        console.log("Case studies data:", data);
        const studies = data.caseStudies || [];
        
        // Log all available fields from first study to see what Airtable is providing
        if (studies.length > 0) {
          console.log('Available fields in case studies:', Object.keys(studies[0]));
          console.log('First case study:', studies[0]);
        }
        
        // Sort by date (newest first) and add computed fields
        const enrichedStudies = studies.map(study => ({
          ...study, // Keep ALL original fields from Airtable
          formattedDate: study.Date ? new Date(study.Date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : null,
          hasFullData: !!(study.Methodology || study.Findings || study.Recommendations || study['Key Findings'] || study['Research Methods']),
          dimensionsList: (study.Dimensions || study['Resilient Dimensions'] || study['Resilience Dimensions'] || '').split(',').map(d => d.trim()).filter(Boolean)
        })).sort((a, b) => {
          const dateA = a.Date ? new Date(a.Date) : new Date(0);
          const dateB = b.Date ? new Date(b.Date) : new Date(0);
          return dateB - dateA;
        });
        
        setCaseStudies(enrichedStudies);
        setFilteredStudies(enrichedStudies);
        
        // Extract unique types and dimensions from case studies
        const typeSet = new Set(studies.map(study => study.Type || '').filter(Boolean));
        setTypes(['all', ...Array.from(typeSet)]);
        
        // Get dimensions from all case studies and create a unique list
        const allDimensions = studies.flatMap(study => 
          (study.Dimensions || '').split(',').map(d => d.trim())
        ).filter(Boolean);
        const dimensionSet = new Set(allDimensions);
        setDimensions(['all', ...Array.from(dimensionSet)]);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching case studies:', err);
        setError(err.message);
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  // Filter case studies when filters change
  useEffect(() => {
    if (caseStudies.length === 0) return;
    
    let results = [...caseStudies];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(study => 
        (study.Title || '').toLowerCase().includes(term) ||
        (study.Author || '').toLowerCase().includes(term) ||
        (study.Description || '').toLowerCase().includes(term) ||
        (study.Focus || '').toLowerCase().includes(term)
      );
    }
    
    // Apply type filter
    if (filterType !== 'all') {
      results = results.filter(study => study.Type === filterType);
    }
    
    // Apply dimension filter
    if (filterDimension !== 'all') {
      results = results.filter(study => {
        const studyDimensions = (study.Dimensions || '').split(',').map(d => d.trim());
        return studyDimensions.includes(filterDimension);
      });
    }
    
    setFilteredStudies(results);
  }, [searchTerm, filterType, filterDimension, caseStudies]);

  if (loading) {
    return <LoadingState message="Loading Case Studies" submessage="Fetching research and case studies..." />;
  }
  
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Could not load case studies</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className={styles.retryButton}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <AnimatedSection type="fade" className={styles.pageHeader}>
          <h1>Case Studies & Research</h1>
          <p className={styles.subtitle}>
            Comprehensive collection of case studies, field reports, and research examining multiple dimensions of societal resilience
          </p>
          <div className={styles.statsBar}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{caseStudies.length}</span>
              <span className={styles.statLabel}>Total Studies</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{dimensions.length - 1}</span>
              <span className={styles.statLabel}>Resilience Dimensions</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{types.length - 1}</span>
              <span className={styles.statLabel}>Study Types</span>
            </div>
          </div>
        </AnimatedSection>
        
        <div className={styles.filtersContainer}>
          <div className={styles.searchContainer}>
            <FaSearch className={styles.searchIcon} />
            <input 
              type="text" 
              className={styles.searchInput} 
              placeholder="Search case studies..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className={styles.filterOptions}>
            <div className={styles.filterGroup}>
              <FaFilter className={styles.filterIcon} />
              <select 
                className={styles.filterSelect}
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                {types.map((type, index) => (
                  <option key={index} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </option>
                ))}
              </select>
            </div>
            
            <div className={styles.filterGroup}>
              <FaTags className={styles.filterIcon} />
              <select 
                className={styles.filterSelect}
                value={filterDimension}
                onChange={(e) => setFilterDimension(e.target.value)}
              >
                {dimensions.map((dimension, index) => (
                  <option key={index} value={dimension}>
                    {dimension === 'all' ? 'All Dimensions' : dimension}
                  </option>
                ))}
              </select>
            </div>
            
            <div className={styles.viewToggle}>
              <button 
                className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="1" y="1" width="6" height="6" rx="1"/>
                  <rect x="9" y="1" width="6" height="6" rx="1"/>
                  <rect x="1" y="9" width="6" height="6" rx="1"/>
                  <rect x="9" y="9" width="6" height="6" rx="1"/>
                </svg>
              </button>
              <button 
                className={`${styles.viewButton} ${viewMode === 'detailed' ? styles.active : ''}`}
                onClick={() => setViewMode('detailed')}
                title="Detailed View"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="1" y="2" width="14" height="3" rx="0.5"/>
                  <rect x="1" y="7" width="14" height="3" rx="0.5"/>
                  <rect x="1" y="12" width="14" height="3" rx="0.5"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {filteredStudies.length === 0 ? (
          <div className={styles.noResults}>
            <h3>No results found</h3>
            <p>Try adjusting your search or filters to find case studies.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className={styles.caseStudiesGrid}>
            {filteredStudies.map((study, index) => (
              <AnimatedSection 
                key={study.id} 
                type="scale" 
                delay={index * 0.1}
              >
                <Link 
                  href={`/case-studies/${encodeURIComponent(study.id)}`}
                  className={styles.caseStudyCard}
                >
                  <div className={styles.cardContent}>
                    <div className={styles.cardHeader}>
                      <span className={styles.studyType}>{study.Type || 'Research'}</span>
                      {study.hasFullData && <span className={styles.fullDataBadge}>Full Study</span>}
                    </div>
                    
                    <h2 className={styles.studyTitle}>{study.Title}</h2>
                    <p className={styles.studyDescription}>{study.Description}</p>
                    
                    {study.Focus && (
                      <div className={styles.studyFocus}>
                        <FaChartLine className={styles.focusIcon} />
                        <p>{study.Focus.substring(0, 150)}...</p>
                      </div>
                    )}
                    
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
                        {study.dimensionsList.map((dimension, i) => (
                          <span key={i} className={styles.dimensionTag}>{dimension}</span>
                        ))}
                      </div>
                    )}
                    
                    <div className={styles.cardFooter}>
                      <div className={styles.readMore}>View Full Study</div>
                      {study.hasFullData && (
                        <div className={styles.dataIndicators}>
                          {study.Methodology && <FaGraduationCap title="Methodology available" />}
                          {study.Findings && <FaChartLine title="Findings available" />}
                          {study.Recommendations && <FaBookOpen title="Recommendations available" />}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <div className={styles.detailedView}>
            {filteredStudies.map((study, index) => (
              <AnimatedSection 
                key={study.id} 
                type="fade" 
                delay={index * 0.05}
                className={styles.detailedStudyCard}
              >
                <div className={styles.detailedHeader}>
                  <div className={styles.detailedTitleSection}>
                    <span className={styles.studyType}>{study.Type || 'Research'}</span>
                    <h2 className={styles.detailedTitle}>{study.Title}</h2>
                    <div className={styles.detailedMeta}>
                      <span className={styles.author}>
                        <FaUser /> {study.Author || 'Unknown Author'}
                      </span>
                      {study.Institution && (
                        <span className={styles.institution}>
                          <FaBuilding /> {study.Institution}
                        </span>
                      )}
                      {study.formattedDate && (
                        <span className={styles.date}>
                          <FaCalendarAlt /> {study.formattedDate}
                        </span>
                      )}
                    </div>
                  </div>
                  {study.Status && (
                    <span className={`${styles.statusBadge} ${styles[study.Status.toLowerCase()]}`}>
                      {study.Status}
                    </span>
                  )}
                </div>
                
                <div className={styles.detailedContent}>
                  {study.Description && (
                    <div className={styles.detailedSection}>
                      <h3>Description</h3>
                      <p>{study.Description}</p>
                    </div>
                  )}
                  
                  {study.Focus && (
                    <div className={styles.detailedSection}>
                      <h3>Study Focus</h3>
                      <p>{study.Focus}</p>
                    </div>
                  )}
                  
                  {study.Relevance && (
                    <div className={styles.detailedSection}>
                      <h3>Relevance to Societal Resilience</h3>
                      <p>{study.Relevance}</p>
                    </div>
                  )}
                  
                  {study.Methodology && (
                    <div className={styles.detailedSection}>
                      <h3>Methodology</h3>
                      <p>{study.Methodology}</p>
                    </div>
                  )}
                  
                  {study.Findings && (
                    <div className={styles.detailedSection}>
                      <h3>Key Findings</h3>
                      <p>{study.Findings}</p>
                    </div>
                  )}
                  
                  {study.Recommendations && (
                    <div className={styles.detailedSection}>
                      <h3>Recommendations</h3>
                      <p>{study.Recommendations}</p>
                    </div>
                  )}
                  
                  <div className={styles.detailedFooter}>
                    {study.dimensionsList.length > 0 && (
                      <div className={styles.dimensionsList}>
                        <h4>Resilience Dimensions:</h4>
                        <div className={styles.dimensionTags}>
                          {study.dimensionsList.map((dimension, i) => (
                            <span key={i} className={styles.dimensionTag}>{dimension}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {study.Keywords && (
                      <div className={styles.keywordsList}>
                        <h4>Keywords:</h4>
                        <div className={styles.keywords}>
                          {study.Keywords.split(',').map((keyword, i) => (
                            <span key={i} className={styles.keyword}>{keyword.trim()}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className={styles.detailedActions}>
                      <Link 
                        href={`/case-studies/${encodeURIComponent(study.id)}`}
                        className={styles.viewFullButton}
                      >
                        View Full Details
                      </Link>
                      {study.URL && (
                        <a 
                          href={study.URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.externalLink}
                        >
                          <FaExternalLinkAlt /> External Link
                        </a>
                      )}
                      {study.DOI && (
                        <a 
                          href={`https://doi.org/${study.DOI}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.doiLink}
                        >
                          DOI: {study.DOI}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
