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
  const [filterContext, setFilterContext] = useState('all');
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
    
    // Apply context filter (Pandemic vs General)
    if (filterContext !== 'all') {
      results = results.filter(topic => 
        topic.Context && topic.Context.toLowerCase() === filterContext.toLowerCase()
      );
    }
    
    setFilteredTopics(results);
  }, [searchTerm, filterDimension, filterContext, landscape]);

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
          {landscape.length > 0 && (
            <p className={styles.dataSource}>
              Displaying {landscape.length} topics from Airtable Landscape Topics
            </p>
          )}
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
            
            <div className={styles.filterGroup}>
              <FaFilter className={styles.filterIcon} />
              <select 
                className={styles.filterSelect}
                value={filterContext}
                onChange={(e) => setFilterContext(e.target.value)}
              >
                <option value="all">All Contexts</option>
                <option value="pandemic">Pandemic</option>
                <option value="general">General</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className={styles.statsSection}>
          <div className={styles.statsGrid}>
            <motion.div 
              className={styles.statCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className={styles.statIcon}>
                <FaLayerGroup />
              </div>
              <div className={styles.statInfo}>
                <div className={styles.statValue}>{dimensions.length - 1}</div>
                <div className={styles.statLabel}>Resilience Dimensions</div>
              </div>
            </motion.div>
            
            <motion.div 
              className={styles.statCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className={styles.statIcon}>
                <FaDatabase />
              </div>
              <div className={styles.statInfo}>
                <div className={styles.statValue}>{filteredTopics.length}</div>
                <div className={styles.statLabel}>Framework Topics</div>
              </div>
            </motion.div>
            
            <motion.div 
              className={styles.statCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className={styles.statIcon}>
                <FaUsers />
              </div>
              <div className={styles.statInfo}>
                <div className={styles.statValue}>{filteredTopics.filter(t => t.Leadership).length}</div>
                <div className={styles.statLabel}>Leadership Areas</div>
              </div>
            </motion.div>
            
            <motion.div 
              className={styles.statCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className={styles.statIcon}>
                <FaTools />
              </div>
              <div className={styles.statInfo}>
                <div className={styles.statValue}>{filteredTopics.filter(t => t.Resources).length}</div>
                <div className={styles.statLabel}>Resource Categories</div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {filteredTopics.length === 0 ? (
          <div className={styles.noResults}>
            <h3>No results found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className={styles.topicsGrid}>
            {filteredTopics.map((topic, index) => (
              <AnimatedSection 
                key={topic.id || index} 
                type="fade" 
                delay={index * 0.1}
                className={styles.topicCard}
              >
                <div className={styles.topicHeader}>
                  <div className={styles.topicMeta}>
                    <div className={styles.topicDimension}>{topic.Dimension}</div>
                    {topic.Context && (
                      <div className={`${styles.contextBadge} ${topic.Context.toLowerCase() === 'pandemic' ? styles.pandemicBadge : styles.generalBadge}`}>
                        {topic.Context}
                      </div>
                    )}
                    {topic.Priority && topic.Priority !== 'Medium' && (
                      <div className={styles.topicContext}>{topic.Priority} Priority</div>
                    )}
                  </div>
                  <h2 className={styles.topicTitle}>{topic['Topic / Sub-Dimension'] || topic.Topic}</h2>
                </div>
                
                <div className={styles.topicDetails}>
                  {topic.Context && (
                    <div className={styles.topicDetail}>
                      <div className={styles.detailLabel}>
                        <FaLayerGroup className={styles.sectionIcon} /> Context
                      </div>
                      <div className={styles.detailValue}>{topic.Context}</div>
                    </div>
                  )}
                  
                  {topic['People & Leadership'] && (
                    <div className={styles.topicDetail}>
                      <div className={styles.detailLabel}>
                        <FaUsers className={styles.sectionIcon} /> People & Leadership
                      </div>
                      <div className={styles.detailValue}>{topic['People & Leadership']}</div>
                    </div>
                  )}
                  
                  {topic['Teamwork & Organizations'] && (
                    <div className={styles.topicDetail}>
                      <div className={styles.detailLabel}>
                        <FaHandshake className={styles.sectionIcon} /> Teamwork & Organizations
                      </div>
                      <div className={styles.detailValue}>{topic['Teamwork & Organizations']}</div>
                    </div>
                  )}
                  
                  {topic['Data & Knowledge'] && (
                    <div className={styles.topicDetail}>
                      <div className={styles.detailLabel}>
                        <FaDatabase className={styles.sectionIcon} /> Data & Knowledge
                      </div>
                      <div className={styles.detailValue}>{topic['Data & Knowledge']}</div>
                    </div>
                  )}
                  
                  {topic['Resources & Products'] && (
                    <div className={styles.topicDetail}>
                      <div className={styles.detailLabel}>
                        <FaTools className={styles.sectionIcon} /> Resources & Products
                      </div>
                      <div className={styles.detailValue}>{topic['Resources & Products']}</div>
                    </div>
                  )}
                  
                  {/* Show additional fields if available */}
                  {topic.Examples && (
                    <div className={styles.topicDetail}>
                      <div className={styles.detailLabel}>Examples</div>
                      <div className={styles.detailValue}>{topic.Examples}</div>
                    </div>
                  )}
                  
                  {topic.Implementation && (
                    <div className={styles.topicDetail}>
                      <div className={styles.detailLabel}>Implementation</div>
                      <div className={styles.detailValue}>{topic.Implementation}</div>
                    </div>
                  )}
                  
                  {topic.Challenges && (
                    <div className={styles.topicDetail}>
                      <div className={styles.detailLabel}>Challenges</div>
                      <div className={styles.detailValue}>{topic.Challenges}</div>
                    </div>
                  )}
                  
                  {topic.Solutions && (
                    <div className={styles.topicDetail}>
                      <div className={styles.detailLabel}>Solutions</div>
                      <div className={styles.detailValue}>{topic.Solutions}</div>
                    </div>
                  )}
                  
                  {topic.Impact && (
                    <div className={styles.topicDetail}>
                      <div className={styles.detailLabel}>Impact</div>
                      <div className={styles.detailValue}>{topic.Impact}</div>
                    </div>
                  )}
                  
                  {topic.Stakeholders && (
                    <div className={styles.topicDetail}>
                      <div className={styles.detailLabel}>Stakeholders</div>
                      <div className={styles.detailValue}>{topic.Stakeholders}</div>
                    </div>
                  )}
                  
                  {topic.BestPractices && (
                    <div className={styles.topicDetail}>
                      <div className={styles.detailLabel}>Best Practices</div>
                      <div className={styles.detailValue}>{topic.BestPractices}</div>
                    </div>
                  )}
                  
                  {topic.Recommendations && (
                    <div className={styles.topicDetail}>
                      <div className={styles.detailLabel}>Recommendations</div>
                      <div className={styles.detailValue}>{topic.Recommendations}</div>
                    </div>
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
