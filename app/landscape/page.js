'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaLayerGroup, FaUsers, FaDatabase, FaTools, FaHandshake } from 'react-icons/fa';
import AnimatedSection from '../../components/AnimatedSection';
import LoadingState from '../../components/LoadingState';
import ErrorBoundary from '../../components/ErrorBoundary';
import styles from './landscape.module.css';

export default function LandscapePage() {
  const [landscape, setLandscape] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDimension, setFilterDimension] = useState('all');
  const [dimensions, setDimensions] = useState(['all']);

  useEffect(() => {
    const fetchLandscape = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/landscape');
        
        if (!res.ok) {
          throw new Error(`Failed to fetch landscape data: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        console.log("Landscape data:", data);
        
        const landscapeData = data.landscape || [];
        setLandscape(landscapeData);
        setFilteredTopics(landscapeData);
        
        // Extract unique dimensions
        const dimensionSet = new Set(landscapeData.map(item => item.Dimension).filter(Boolean));
        setDimensions(['all', ...Array.from(dimensionSet)]);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching landscape data:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchLandscape();
  }, []);
  
  // Filter topics when search or filter changes
  useEffect(() => {
    if (!landscape.length) return;
    
    let results = [...landscape];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(topic => 
        (topic.Topic || '').toLowerCase().includes(term) ||
        (topic.Dimension || '').toLowerCase().includes(term) ||
        (topic.Context || '').toLowerCase().includes(term)
      );
    }
    
    // Apply dimension filter
    if (filterDimension !== 'all') {
      results = results.filter(topic => topic.Dimension === filterDimension);
    }
    
    setFilteredTopics(results);
  }, [searchTerm, filterDimension, landscape]);

  if (loading) {
    return <LoadingState message="Loading Resilience Landscape" submessage="Fetching resilience framework..." />;
  }
  
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Could not load landscape data</h2>
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
        <AnimatedSection type="fade" className={styles.header}>
          <h1>Resilience Framework</h1>
          <p className={styles.subtitle}>
            Explore the landscape of societal resilience across key dimensions and topics
          </p>
          <div className={styles.headerActions}>
            <a href="/landscape-interactive" className={styles.interactiveLink}>
              <FaLayerGroup className={styles.linkIcon} />
              View Interactive Visualization
            </a>
          </div>
        </AnimatedSection>
        
        <div className={styles.filtersContainer}>
          <div className={styles.searchContainer}>
            <FaSearch className={styles.searchIcon} />
            <input 
              type="text" 
              className={styles.searchInput} 
              placeholder="Search the framework..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className={styles.filterOptions}>
            <div className={styles.filterGroup}>
              <FaFilter className={styles.filterIcon} />
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
          </div>
        </div>
        
        {filteredTopics.length === 0 ? (
          <div className={styles.noResults}>
            <h3>No results found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className={styles.landscapeGrid}>
            {filteredTopics.map((topic, index) => (
              <AnimatedSection 
                key={topic.id || index} 
                type="fade" 
                delay={index * 0.1}
                className={styles.topicCard}
              >
                <div className={styles.topicHeader}>
                  <div className={styles.dimensionLabel}>{topic.Dimension}</div>
                  <h2>{topic.Topic}</h2>
                </div>
                
                {topic.Context && (
                  <div className={styles.topicSection}>
                    <FaLayerGroup className={styles.sectionIcon} />
                    <div>
                      <h3>Context</h3>
                      <p>{topic.Context}</p>
                    </div>
                  </div>
                )}
                
                {topic.Leadership && (
                  <div className={styles.topicSection}>
                    <FaUsers className={styles.sectionIcon} />
                    <div>
                      <h3>Leadership</h3>
                      <p>{topic.Leadership}</p>
                    </div>
                  </div>
                )}
                
                {topic.Teamwork && (
                  <div className={styles.topicSection}>
                    <FaHandshake className={styles.sectionIcon} />
                    <div>
                      <h3>Teamwork</h3>
                      <p>{topic.Teamwork}</p>
                    </div>
                  </div>
                )}
                
                {topic.Data && (
                  <div className={styles.topicSection}>
                    <FaDatabase className={styles.sectionIcon} />
                    <div>
                      <h3>Data</h3>
                      <p>{topic.Data}</p>
                    </div>
                  </div>
                )}
                
                {topic.Resources && (
                  <div className={styles.topicSection}>
                    <FaTools className={styles.sectionIcon} />
                    <div>
                      <h3>Resources</h3>
                      <p>{topic.Resources}</p>
                    </div>
                  </div>
                )}
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
