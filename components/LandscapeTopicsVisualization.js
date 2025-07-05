'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronRight, FaUsers, FaDatabase, FaTools, FaExclamationCircle } from 'react-icons/fa';
import styles from './LandscapeTopicsVisualization.module.css';

export default function LandscapeTopicsVisualization() {
  const [landscapeData, setLandscapeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDimension, setSelectedDimension] = useState(null);
  const [expandedTopics, setExpandedTopics] = useState({});
  const [viewMode, setViewMode] = useState('grid'); // grid, list, network

  useEffect(() => {
    fetchLandscapeData();
  }, []);

  const fetchLandscapeData = async () => {
    try {
      const response = await fetch('/api/landscape-topics');
      const data = await response.json();
      setLandscapeData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching landscape data:', error);
      setLoading(false);
    }
  };

  const toggleTopic = (topicId) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  const getImportanceColor = (importance) => {
    switch (importance?.toLowerCase()) {
      case 'critical': return '#e74c3c';
      case 'high': return '#f39c12';
      case 'medium': return '#3498db';
      default: return '#95a5a6';
    }
  };

  const getDimensionIcon = (dimension) => {
    const icons = {
      'Healthcare Systems': '🏥',
      'Information Systems': '📡',
      'Social Equity & Well-being': '⚖️',
      'Economic Sustainability': '💰',
      'Governance & Civic Engagement': '🏛️',
      'Infrastructure Resilience': '🏗️',
      'Environmental Stewardship': '🌍',
      'Cultural Vitality': '🎭'
    };
    return icons[dimension] || '📊';
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Loading landscape topics...</p>
      </div>
    );
  }

  if (!landscapeData) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Resilience Landscape Topics</h2>
        <p className={styles.subtitle}>
          Explore {landscapeData.totalTopics} topics across {landscapeData.dimensions.length} resilience dimensions
        </p>
        
        <div className={styles.viewToggle}>
          <button 
            className={viewMode === 'grid' ? styles.active : ''}
            onClick={() => setViewMode('grid')}
          >
            Grid View
          </button>
          <button 
            className={viewMode === 'list' ? styles.active : ''}
            onClick={() => setViewMode('list')}
          >
            List View
          </button>
          <button 
            className={viewMode === 'network' ? styles.active : ''}
            onClick={() => setViewMode('network')}
          >
            Network View
          </button>
        </div>
      </div>

      {/* Dimension Overview */}
      <div className={styles.dimensionOverview}>
        {landscapeData.dimensionStats.map((stat, index) => (
          <motion.div
            key={stat.dimension}
            className={styles.dimensionCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedDimension(
              selectedDimension === stat.dimension ? null : stat.dimension
            )}
          >
            <div className={styles.dimensionIcon}>
              {getDimensionIcon(stat.dimension)}
            </div>
            <h3>{stat.dimension}</h3>
            <div className={styles.topicCount}>{stat.topicCount} topics</div>
            <div className={styles.keyThemes}>
              {stat.keyThemes.slice(0, 2).map((theme, i) => (
                <span key={i} className={styles.theme}>{theme}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Topics Display */}
      {viewMode === 'grid' && (
        <div className={styles.topicsGrid}>
          {Object.entries(landscapeData.groupedByDimension).map(([dimension, topics]) => (
            <AnimatePresence key={dimension}>
              {(!selectedDimension || selectedDimension === dimension) && (
                <motion.div
                  className={styles.dimensionSection}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <h3 className={styles.dimensionTitle}>
                    {getDimensionIcon(dimension)} {dimension}
                  </h3>
                  
                  <div className={styles.topicsContainer}>
                    {topics.map((topic, index) => (
                      <motion.div
                        key={topic.id}
                        className={styles.topicCard}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        style={{ 
                          borderLeftColor: getImportanceColor(topic.importance) 
                        }}
                      >
                        <div 
                          className={styles.topicHeader}
                          onClick={() => toggleTopic(topic.id)}
                        >
                          <h4>{topic.topic}</h4>
                          <div className={styles.topicMeta}>
                            <span 
                              className={styles.importance}
                              style={{ color: getImportanceColor(topic.importance) }}
                            >
                              {topic.importance}
                            </span>
                            {expandedTopics[topic.id] ? 
                              <FaChevronDown /> : <FaChevronRight />
                            }
                          </div>
                        </div>
                        
                        <AnimatePresence>
                          {expandedTopics[topic.id] && (
                            <motion.div
                              className={styles.topicDetails}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                            >
                              <div className={styles.detailSection}>
                                <h5>Context</h5>
                                <p>{topic.context}</p>
                              </div>
                              
                              <div className={styles.detailSection}>
                                <h5><FaUsers /> Leadership</h5>
                                <p>{topic.leadership}</p>
                              </div>
                              
                              <div className={styles.detailSection}>
                                <h5><FaUsers /> Teamwork</h5>
                                <p>{topic.teamwork}</p>
                              </div>
                              
                              <div className={styles.detailSection}>
                                <h5><FaDatabase /> Data</h5>
                                <p>{topic.data}</p>
                              </div>
                              
                              <div className={styles.detailSection}>
                                <h5><FaTools /> Resources</h5>
                                <p>{topic.resources}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>
      )}

      {viewMode === 'list' && (
        <div className={styles.topicsList}>
          {Object.entries(landscapeData.groupedByDimension).map(([dimension, topics]) => (
            <div key={dimension} className={styles.listDimension}>
              <h3>{getDimensionIcon(dimension)} {dimension}</h3>
              <table className={styles.topicsTable}>
                <thead>
                  <tr>
                    <th>Topic</th>
                    <th>Importance</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {topics.map(topic => (
                    <tr key={topic.id}>
                      <td>{topic.topic}</td>
                      <td>
                        <span 
                          className={styles.importanceBadge}
                          style={{ 
                            backgroundColor: getImportanceColor(topic.importance) 
                          }}
                        >
                          {topic.importance}
                        </span>
                      </td>
                      <td>{topic.category || 'General'}</td>
                      <td>
                        <button 
                          className={styles.viewButton}
                          onClick={() => toggleTopic(topic.id)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'network' && (
        <div className={styles.networkView}>
          <div className={styles.networkContainer}>
            <svg width="100%" height="600" viewBox="0 0 1200 600">
              {/* Central hub */}
              <circle cx="600" cy="300" r="50" fill="#3498db" />
              <text x="600" y="305" textAnchor="middle" fill="white" fontSize="12">
                Resilience
              </text>
              
              {/* Dimension nodes */}
              {landscapeData.dimensionStats.map((stat, index) => {
                const angle = (index / landscapeData.dimensionStats.length) * 2 * Math.PI;
                const x = 600 + 200 * Math.cos(angle);
                const y = 300 + 200 * Math.sin(angle);
                
                return (
                  <g key={stat.dimension}>
                    <line x1="600" y1="300" x2={x} y2={y} stroke="#ecf0f1" strokeWidth="2" />
                    <circle cx={x} cy={y} r="40" fill="#2ecc71" />
                    <text x={x} y={y + 5} textAnchor="middle" fill="white" fontSize="10">
                      {stat.dimension.split(' ')[0]}
                    </text>
                    <text x={x} y={y - 50} textAnchor="middle" fontSize="12">
                      {stat.topicCount} topics
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          
          <div className={styles.networkLegend}>
            <h4>Network Visualization</h4>
            <p>Each dimension connects to the central resilience hub</p>
            <p>Size represents number of topics in each dimension</p>
          </div>
        </div>
      )}
    </div>
  );
}