'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaExternalLinkAlt, FaQuoteRight, FaFilter, FaLayerGroup, FaTags, FaList, FaTh } from 'react-icons/fa';
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
  const [filterDimension, setFilterDimension] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState('all'); // 'all', 'dimensions'
  const [years, setYears] = useState(['all']);
  const [dimensions, setDimensions] = useState(['all']);
  const [types, setTypes] = useState(['all']);

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
        console.log("Total papers received:", data.total);
        console.log("Papers array length:", data.papers?.length);
        
        const papersData = data.papers || [];
        setPapers(papersData);
        setFilteredPapers(papersData);
        
        // Extract unique years, dimensions, and types
        const yearSet = new Set(papersData.map(paper => paper.Year).filter(Boolean));
        const dimensionSet = new Set(papersData.map(paper => paper.Dimension).filter(Boolean));
        const typeSet = new Set(papersData.map(paper => paper.Type).filter(Boolean));
        
        setYears(['all', ...Array.from(yearSet).sort().reverse()]);
        setDimensions(['all', ...Array.from(dimensionSet).sort()]);
        setTypes(['all', ...Array.from(typeSet).sort()]);
        
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
        (paper.Keywords || '').toLowerCase().includes(term) ||
        (paper.Dimension || '').toLowerCase().includes(term) ||
        (paper.Field || '').toLowerCase().includes(term)
      );
    }
    
    // Apply year filter
    if (filterYear !== 'all') {
      results = results.filter(paper => paper.Year === filterYear);
    }
    
    // Apply dimension filter
    if (filterDimension !== 'all') {
      results = results.filter(paper => paper.Dimension === filterDimension);
    }
    
    // Apply type filter
    if (filterType !== 'all') {
      results = results.filter(paper => paper.Type === filterType);
    }
    
    setFilteredPapers(results);
  }, [searchTerm, filterYear, filterDimension, filterType, papers]);

  const renderPaperCard = (paper, index) => (
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
          {paper.Type && <span className={styles.type}>{paper.Type}</span>}
        </div>
        {paper.Publication && <div className={styles.publication}>{paper.Publication}</div>}
        {paper.Dimension && <div className={styles.dimension}>{paper.Dimension}</div>}
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
        
        {paper.Field && (
          <div className={styles.field}>
            <strong>Field:</strong> {paper.Field}
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
            <span>DOI: {paper.DOI}</span>
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
  );

  const renderAllPapers = () => (
    <>
      {filteredPapers.map((paper, index) => renderPaperCard(paper, index))}
    </>
  );

  const renderByDimensions = () => {
    const dimensionGroups = {};
    
    filteredPapers.forEach(paper => {
      const dimension = paper.Dimension || 'Other';
      if (!dimensionGroups[dimension]) {
        dimensionGroups[dimension] = [];
      }
      dimensionGroups[dimension].push(paper);
    });

    const dimensionColors = {
      'Environmental Stewardship & Resource Security': '#10B981',
      'Social Equity & Well-being': '#3B82F6',
      'Healthcare System Capacity & Integration': '#EF4444',
      'Economic Stability & Crisis Protection': '#F59E0B',
      'Governance Coordination & Community Leadership': '#8B5CF6',
      'Information Infrastructure & Communication': '#06B6D4',
      'Scientific Knowledge & Innovation Systems': '#F97316',
      'Multiple': '#6B7280',
      'Other': '#9CA3AF'
    };

    return Object.entries(dimensionGroups).map(([dimension, papers]) => (
      <AnimatedSection key={dimension} type="fade" className={styles.dimensionSection}>
        <div 
          className={styles.dimensionHeader}
          style={{ borderLeftColor: dimensionColors[dimension] || '#6B7280' }}
        >
          <h2>{dimension}</h2>
          <span className={styles.paperCount}>{papers.length} papers</span>
        </div>
        <div className={styles.dimensionPapers}>
          {papers.map((paper, index) => renderPaperCard(paper, index))}
        </div>
      </AnimatedSection>
    ));
  };

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
            Comprehensive bibliography organized by the Seven Resilient Community Dimensions
          </p>
          <div className={styles.stats}>
            <span className={styles.statItem}>{papers.length} Total References</span>
            <span className={styles.statItem}>{filteredPapers.length} Displayed</span>
            <span className={styles.statItem}>{dimensions.length - 1} Dimensions</span>
          </div>
        </AnimatedSection>
        
        <div className={styles.filtersContainer}>
          <div className={styles.searchContainer}>
            <FaSearch className={styles.searchIcon} />
            <input 
              type="text" 
              className={styles.searchInput} 
              placeholder="Search by title, author, keywords, dimension..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className={styles.viewModeToggle}>
            <button 
              className={`${styles.viewModeBtn} ${viewMode === 'all' ? styles.active : ''}`}
              onClick={() => setViewMode('all')}
            >
              <FaList /> All Papers
            </button>
            <button 
              className={`${styles.viewModeBtn} ${viewMode === 'dimensions' ? styles.active : ''}`}
              onClick={() => setViewMode('dimensions')}
            >
              <FaLayerGroup /> By Dimension
            </button>
          </div>
          
          <div className={styles.filterOptions}>
            <div className={styles.filterGroup}>
              <FaLayerGroup className={styles.filterIcon} />
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
            
            <div className={styles.filterGroup}>
              <FaTags className={styles.filterIcon} />
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
          <div className={viewMode === 'dimensions' ? styles.dimensionsView : styles.papersGrid}>
            {viewMode === 'dimensions' ? renderByDimensions() : renderAllPapers()}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
