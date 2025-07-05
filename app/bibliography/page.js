'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaExternalLinkAlt, FaQuoteRight, FaFilter } from 'react-icons/fa';
import AnimatedSection from '../../components/AnimatedSection';
import LoadingState from '../../components/LoadingState';
import ErrorBoundary from '../../components/ErrorBoundary';
import styles from './bibliography.module.css';

export default function Bibliography() {
  const [papers, setPapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('all');
  const [years, setYears] = useState(['all']);

  useEffect(() => {
    const fetchBibliography = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/bibliography');
        
        if (!res.ok) {
          throw new Error(`Failed to fetch bibliography: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        console.log("Bibliography data:", data);
        
        const papersData = data.papers || [];
        setPapers(papersData);
        setFilteredPapers(papersData);
        
        // Extract unique years
        const yearSet = new Set(papersData.map(paper => paper.Year).filter(Boolean));
        setYears(['all', ...Array.from(yearSet).sort().reverse()]);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bibliography:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchBibliography();
  }, []);
  
  // Filter papers when search or filter changes
  useEffect(() => {
    if (!papers.length) return;
    
    let results = [...papers];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(paper => 
        (paper.Name || '').toLowerCase().includes(term) ||
        (paper.Authors || '').toLowerCase().includes(term) ||
        (paper.Abstract || '').toLowerCase().includes(term) ||
        (paper.Keywords || '').toLowerCase().includes(term)
      );
    }
    
    // Apply year filter
    if (filterYear !== 'all') {
      results = results.filter(paper => paper.Year === filterYear);
    }
    
    setFilteredPapers(results);
  }, [searchTerm, filterYear, papers]);

  if (loading) {
    return <LoadingState message="Loading Bibliography" submessage="Fetching research papers..." />;
  }
  
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Could not load bibliography</h2>
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
          <h1>Bibliography</h1>
          <p className={styles.subtitle}>
            Explore research papers, articles and publications related to societal resilience
          </p>
        </AnimatedSection>
        
        <div className={styles.filtersContainer}>
          <div className={styles.searchContainer}>
            <FaSearch className={styles.searchIcon} />
            <input 
              type="text" 
              className={styles.searchInput} 
              placeholder="Search bibliography..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className={styles.filterOptions}>
            <div className={styles.filterGroup}>
              <FaFilter className={styles.filterIcon} />
              <select 
                className={styles.filterSelect}
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              >
                {years.map((year, index) => (
                  <option key={index} value={year}>
                    {year === 'all' ? 'All Years' : year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {filteredPapers.length === 0 ? (
          <div className={styles.noResults}>
            <h3>No results found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className={styles.papersGrid}>
            {filteredPapers.map((paper, index) => (
              <AnimatedSection 
                key={paper.id || index} 
                type="fade" 
                delay={index * 0.1}
                className={styles.paperCard}
              >
                <div className={styles.paperHeader}>
                  <h2>{paper.Name}</h2>
                  <div className={styles.paperMeta}>
                    <span className={styles.authors}>{paper.Authors}</span>
                    <span className={styles.year}>{paper.Year}</span>
                  </div>
                  {paper.Publication && <div className={styles.publication}>{paper.Publication}</div>}
                </div>
                
                <div className={styles.paperBody}>
                  {paper.Abstract && (
                    <div className={styles.abstract}>
                      <FaQuoteRight className={styles.quoteIcon} />
                      <p>{paper.Abstract}</p>
                    </div>
                  )}
                  
                  {paper.Keywords && (
                    <div className={styles.keywords}>
                      {paper.Keywords.split(',').map((keyword, i) => (
                        <span key={i} className={styles.keywordTag}>{keyword.trim()}</span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className={styles.paperFooter}>
                  {paper.DOI && (
                    <a 
                      href={`https://doi.org/${paper.DOI}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.doiLink}
                    >
                      <span>{paper.DOI}</span>
                    </a>
                  )}
                  
                  {paper.URL && (
                    <a 
                      href={paper.URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.paperLink}
                    >
                      <span>View Paper</span> <FaExternalLinkAlt />
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
