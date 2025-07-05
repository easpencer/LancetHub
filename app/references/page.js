'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFileAlt, FaExternalLinkAlt, FaDownload, FaFilter } from 'react-icons/fa';
import AnimatedSection from '../../components/AnimatedSection';
import LoadingState from '../../components/LoadingState';
import ErrorBoundary from '../../components/ErrorBoundary';
import styles from './references.module.css';

export default function References() {
  const [references, setReferences] = useState([]);
  const [filteredReferences, setFilteredReferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [types, setTypes] = useState(['all']);

  useEffect(() => {
    const fetchReferences = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Mock data for references - replace with actual API call
        const mockReferences = [
          {
            id: 'ref-1',
            title: 'The Lancet Commission Report: US Societal Resilience in a Global Pandemic Age',
            type: 'Commission Report',
            year: '2024',
            authors: 'Commission Members',
            description: 'Full report of The Lancet Commission on US Societal Resilience in a Global Pandemic Age: Lessons for the Present from the Future.',
            url: 'https://www.thelancet.com/commissions/us-resilience',
            downloadUrl: '/documents/commission-report-2024.pdf',
            tags: ['Commission Report', 'Policy', 'Framework']
          },
          {
            id: 'ref-2',
            title: 'Community Resilience Framework: Implementation Guide',
            type: 'Implementation Guide',
            year: '2024',
            authors: 'Framework Working Group',
            description: 'Practical guide for implementing the seven dimensions of community resilience at local and regional levels.',
            url: '/documents/resilience-framework-guide.pdf',
            downloadUrl: '/documents/resilience-framework-guide.pdf',
            tags: ['Framework', 'Implementation', 'Community']
          },
          {
            id: 'ref-3',
            title: 'Pandemic Vulnerability Assessment Methodology',
            type: 'Technical Document',
            year: '2024',
            authors: 'Technical Advisory Group',
            description: 'Detailed methodology for assessing pandemic vulnerability across different geographic regions and populations.',
            url: '/documents/vulnerability-methodology.pdf',
            downloadUrl: '/documents/vulnerability-methodology.pdf',
            tags: ['Methodology', 'Assessment', 'Technical']
          },
          {
            id: 'ref-4',
            title: 'Policy Brief: Building Resilient Healthcare Systems',
            type: 'Policy Brief',
            year: '2024',
            authors: 'Healthcare Resilience Task Force',
            description: 'Key policy recommendations for strengthening healthcare system resilience in preparation for future pandemics.',
            url: '/documents/healthcare-policy-brief.pdf',
            downloadUrl: '/documents/healthcare-policy-brief.pdf',
            tags: ['Policy', 'Healthcare', 'Systems']
          },
          {
            id: 'ref-5',
            title: 'Community Engagement Toolkit',
            type: 'Toolkit',
            year: '2024',
            authors: 'Community Engagement Working Group',
            description: 'Resources and tools for engaging communities in resilience building activities and initiatives.',
            url: '/documents/community-toolkit.pdf',
            downloadUrl: '/documents/community-toolkit.pdf',
            tags: ['Toolkit', 'Community', 'Engagement']
          },
          {
            id: 'ref-6',
            title: 'Data Standards for Resilience Metrics',
            type: 'Standards Document',
            year: '2024',
            authors: 'Data Standards Committee',
            description: 'Standardized metrics and data collection protocols for measuring community resilience.',
            url: '/documents/data-standards.pdf',
            downloadUrl: '/documents/data-standards.pdf',
            tags: ['Standards', 'Data', 'Metrics']
          }
        ];
        
        setReferences(mockReferences);
        setFilteredReferences(mockReferences);
        
        // Extract unique types
        const typeSet = new Set(mockReferences.map(ref => ref.type));
        setTypes(['all', ...Array.from(typeSet)]);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching references:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchReferences();
  }, []);
  
  // Filter references when search or filter changes
  useEffect(() => {
    if (!references.length) return;
    
    let results = [...references];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(ref => 
        (ref.title || '').toLowerCase().includes(term) ||
        (ref.authors || '').toLowerCase().includes(term) ||
        (ref.description || '').toLowerCase().includes(term) ||
        (ref.tags || []).some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    // Apply type filter
    if (filterType !== 'all') {
      results = results.filter(ref => ref.type === filterType);
    }
    
    setFilteredReferences(results);
  }, [searchTerm, filterType, references]);

  if (loading) {
    return <LoadingState message="Loading References" submessage="Fetching commission documents and resources..." />;
  }
  
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Could not load references</h2>
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
          <h1>References & Resources</h1>
          <p className={styles.subtitle}>
            Official documents, reports, and resources from The Lancet Commission on US Societal Resilience
          </p>
        </AnimatedSection>
        
        <div className={styles.filtersContainer}>
          <div className={styles.searchContainer}>
            <FaSearch className={styles.searchIcon} />
            <input 
              type="text" 
              className={styles.searchInput} 
              placeholder="Search references..." 
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
          </div>
        </div>
        
        {filteredReferences.length === 0 ? (
          <div className={styles.noResults}>
            <h3>No results found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className={styles.referencesGrid}>
            {filteredReferences.map((reference, index) => (
              <AnimatedSection 
                key={reference.id} 
                type="fade" 
                delay={index * 0.1}
                className={styles.referenceCard}
              >
                <div className={styles.referenceHeader}>
                  <span className={styles.referenceType}>{reference.type}</span>
                  <span className={styles.referenceYear}>{reference.year}</span>
                </div>
                
                <h2 className={styles.referenceTitle}>{reference.title}</h2>
                
                <div className={styles.referenceAuthors}>
                  <FaFileAlt className={styles.authorIcon} />
                  <span>{reference.authors}</span>
                </div>
                
                <p className={styles.referenceDescription}>{reference.description}</p>
                
                {reference.tags && reference.tags.length > 0 && (
                  <div className={styles.referenceTags}>
                    {reference.tags.map((tag, i) => (
                      <span key={i} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                )}
                
                <div className={styles.referenceActions}>
                  {reference.url && (
                    <a 
                      href={reference.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.viewButton}
                    >
                      <FaExternalLinkAlt /> View Online
                    </a>
                  )}
                  
                  {reference.downloadUrl && (
                    <a 
                      href={reference.downloadUrl}
                      download
                      className={styles.downloadButton}
                    >
                      <FaDownload /> Download PDF
                    </a>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}