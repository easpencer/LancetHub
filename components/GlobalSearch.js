'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimes, FaSpinner, FaFileAlt, FaBook, FaUser } from 'react-icons/fa';
import styles from './GlobalSearch.module.css';

export default function GlobalSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const inputRef = useRef(null);
  const router = useRouter();
  
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);
  
  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults(null);
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&type=${activeTab}`);
      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error('Search error:', error);
      setResults({ error: true });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.length >= 2) {
        performSearch(query);
      } else {
        setResults(null);
      }
    }, 300);
    
    return () => clearTimeout(debounceTimer);
  }, [query, activeTab]);
  
  const handleResultClick = (type, item) => {
    onClose();
    
    switch (type) {
      case 'caseStudy':
        router.push(`/case-studies/${item.id}`);
        break;
      case 'paper':
        router.push(`/bibliography?highlight=${item.id}`);
        break;
      case 'person':
        router.push(`/people?highlight=${item.id}`);
        break;
    }
  };
  
  const getResultCount = () => {
    if (!results) return 0;
    return (results.caseStudies?.length || 0) + 
           (results.papers?.length || 0) + 
           (results.people?.length || 0);
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div 
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className={styles.searchModal}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.searchHeader}>
            <div className={styles.searchInputWrapper}>
              <FaSearch className={styles.searchIcon} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search case studies, papers, people..."
                className={styles.searchInput}
              />
              {loading && <FaSpinner className={styles.spinner} />}
              <button onClick={onClose} className={styles.closeButton}>
                <FaTimes />
              </button>
            </div>
            
            {query.length >= 2 && (
              <div className={styles.tabs}>
                <button 
                  className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  All Results {getResultCount() > 0 && `(${getResultCount()})`}
                </button>
                <button 
                  className={`${styles.tab} ${activeTab === 'caseStudies' ? styles.active : ''}`}
                  onClick={() => setActiveTab('caseStudies')}
                >
                  <FaFileAlt /> Case Studies {results?.caseStudies?.length > 0 && `(${results.caseStudies.length})`}
                </button>
                <button 
                  className={`${styles.tab} ${activeTab === 'papers' ? styles.active : ''}`}
                  onClick={() => setActiveTab('papers')}
                >
                  <FaBook /> Papers {results?.papers?.length > 0 && `(${results.papers.length})`}
                </button>
                <button 
                  className={`${styles.tab} ${activeTab === 'people' ? styles.active : ''}`}
                  onClick={() => setActiveTab('people')}
                >
                  <FaUser /> People {results?.people?.length > 0 && `(${results.people.length})`}
                </button>
              </div>
            )}
          </div>
          
          <div className={styles.searchResults}>
            {!query && (
              <div className={styles.placeholder}>
                <p>Start typing to search across all content...</p>
                <div className={styles.shortcuts}>
                  <span>Press <kbd>ESC</kbd> to close</span>
                </div>
              </div>
            )}
            
            {query && query.length < 2 && (
              <div className={styles.placeholder}>
                <p>Type at least 2 characters to search...</p>
              </div>
            )}
            
            {results?.error && (
              <div className={styles.error}>
                <p>Search failed. Please try again.</p>
              </div>
            )}
            
            {results && !results.error && getResultCount() === 0 && (
              <div className={styles.noResults}>
                <p>No results found for "{query}"</p>
                <p className={styles.suggestion}>Try different keywords or check your spelling</p>
              </div>
            )}
            
            {results && !results.error && getResultCount() > 0 && (
              <div className={styles.resultsList}>
                {(activeTab === 'all' || activeTab === 'caseStudies') && results.caseStudies?.length > 0 && (
                  <div className={styles.resultSection}>
                    <h3><FaFileAlt /> Case Studies</h3>
                    {results.caseStudies.map((item) => (
                      <motion.div
                        key={item.id}
                        className={styles.resultItem}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => handleResultClick('caseStudy', item)}
                      >
                        <h4>{item.title || item.Title}</h4>
                        <p dangerouslySetInnerHTML={{ __html: item.snippet || item.description || item.Description }} />
                        {item.dimensions && (
                          <div className={styles.tags}>
                            {item.dimensions.split(',').slice(0, 3).map((dim, i) => (
                              <span key={i} className={styles.tag}>{dim.trim()}</span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
                
                {(activeTab === 'all' || activeTab === 'papers') && results.papers?.length > 0 && (
                  <div className={styles.resultSection}>
                    <h3><FaBook /> Papers</h3>
                    {results.papers.map((item) => (
                      <motion.div
                        key={item.id}
                        className={styles.resultItem}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => handleResultClick('paper', item)}
                      >
                        <h4>{item.title || item.Title}</h4>
                        <p className={styles.meta}>
                          {item.authors || item.Authors} • {item.year || item.Year}
                        </p>
                        <p dangerouslySetInnerHTML={{ __html: item.snippet || item.abstract || item.Abstract }} />
                      </motion.div>
                    ))}
                  </div>
                )}
                
                {(activeTab === 'all' || activeTab === 'people') && results.people?.length > 0 && (
                  <div className={styles.resultSection}>
                    <h3><FaUser /> People</h3>
                    {results.people.map((item) => (
                      <motion.div
                        key={item.id}
                        className={styles.resultItem}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => handleResultClick('person', item)}
                      >
                        <h4>{item.name || item.Name}</h4>
                        <p className={styles.meta}>
                          {item.title || item.Title} • {item.institution || item.Institution}
                        </p>
                        <p>{item.bio || item.Bio}</p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}