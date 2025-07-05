'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, 
  FaFilter, 
  FaLayerGroup, 
  FaUsers, 
  FaDatabase, 
  FaTools, 
  FaHandshake,
  FaChartPie,
  FaSitemap,
  FaTh,
  FaProjectDiagram
} from 'react-icons/fa';
import AnimatedSection from '../../components/AnimatedSection';
import LoadingState from '../../components/LoadingState';
import ErrorBoundary from '../../components/ErrorBoundary';
import styles from './landscape-interactive.module.css';

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

// Color palette for dimensions
const dimensionColors = {
  'Social Equity & Well-being': '#FF6B6B',
  'Environmental Resilience': '#4ECDC4',
  'Economic Sustainability': '#45B7D1',
  'Healthcare Systems': '#96CEB4',
  'Information Systems': '#DDA0DD',
  'Infrastructure Resilience': '#F4A460',
  'Governance & Civic Engagement': '#98D8C8',
  'Cultural Vitality': '#FFB6C1',
  'default': '#95A5A6'
};

export default function LandscapeInteractivePage() {
  const [landscape, setLandscape] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDimension, setSelectedDimension] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [visualizationType, setVisualizationType] = useState('sunburst');
  const [dimensions, setDimensions] = useState([]);

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
        const landscapeData = data.landscape || [];
        setLandscape(landscapeData);
        setFilteredData(landscapeData);
        
        // Extract unique dimensions
        const uniqueDimensions = [...new Set(landscapeData.map(item => item.Dimension).filter(Boolean))];
        setDimensions(uniqueDimensions);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching landscape data:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchLandscape();
  }, []);

  // Filter data based on search and dimension
  useEffect(() => {
    if (!landscape.length) return;
    
    let results = [...landscape];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(topic => 
        (topic.Topic || '').toLowerCase().includes(term) ||
        (topic.Dimension || '').toLowerCase().includes(term) ||
        (topic.Context || '').toLowerCase().includes(term) ||
        (topic.Leadership || '').toLowerCase().includes(term) ||
        (topic.Teamwork || '').toLowerCase().includes(term) ||
        (topic.Data || '').toLowerCase().includes(term) ||
        (topic.Resources || '').toLowerCase().includes(term)
      );
    }
    
    if (selectedDimension !== 'all') {
      results = results.filter(topic => topic.Dimension === selectedDimension);
    }
    
    setFilteredData(results);
  }, [searchTerm, selectedDimension, landscape]);

  // Create sunburst data
  const createSunburstData = useCallback(() => {
    const root = {
      name: 'Resilience Framework',
      children: []
    };

    const dimensionMap = new Map();

    filteredData.forEach(item => {
      const dimension = item.Dimension || 'Other';
      
      if (!dimensionMap.has(dimension)) {
        dimensionMap.set(dimension, {
          name: dimension,
          children: []
        });
      }

      dimensionMap.get(dimension).children.push({
        name: item.Topic,
        value: 1,
        data: item
      });
    });

    root.children = Array.from(dimensionMap.values());
    return root;
  }, [filteredData]);

  // Create treemap data
  const createTreemapData = useCallback(() => {
    const labels = ['Resilience Framework'];
    const parents = [''];
    const values = [0];
    const colors = ['rgba(255, 255, 255, 0)'];
    const text = [''];
    const customdata = [null];

    dimensions.forEach(dimension => {
      labels.push(dimension);
      parents.push('Resilience Framework');
      values.push(0);
      colors.push(dimensionColors[dimension] || dimensionColors.default);
      text.push(dimension);
      customdata.push(null);
    });

    filteredData.forEach(item => {
      const dimension = item.Dimension || 'Other';
      labels.push(item.Topic);
      parents.push(dimension);
      values.push(1);
      colors.push(dimensionColors[dimension] || dimensionColors.default);
      text.push(item.Topic);
      customdata.push(item);
    });

    return { labels, parents, values, colors, text, customdata };
  }, [filteredData, dimensions]);

  // Create network graph data
  const createNetworkData = useCallback(() => {
    const nodes = [{ 
      id: 'center', 
      label: 'Resilience Framework', 
      size: 30,
      color: '#2C3E50'
    }];
    
    const edges = [];
    const dimensionNodes = new Set();

    filteredData.forEach((item, index) => {
      const dimension = item.Dimension || 'Other';
      const dimensionId = `dim-${dimension}`;
      
      if (!dimensionNodes.has(dimensionId)) {
        dimensionNodes.add(dimensionId);
        nodes.push({
          id: dimensionId,
          label: dimension,
          size: 20,
          color: dimensionColors[dimension] || dimensionColors.default
        });
        edges.push({
          from: 'center',
          to: dimensionId
        });
      }
      
      const topicId = `topic-${index}`;
      nodes.push({
        id: topicId,
        label: item.Topic,
        size: 10,
        color: dimensionColors[dimension] || dimensionColors.default,
        data: item
      });
      
      edges.push({
        from: dimensionId,
        to: topicId
      });
    });

    return { nodes, edges };
  }, [filteredData]);

  const renderVisualization = () => {
    switch (visualizationType) {
      case 'sunburst':
        const sunburstData = createSunburstData();
        return (
          <Plot
            data={[{
              type: 'sunburst',
              labels: sunburstData.children.flatMap(d => [d.name, ...d.children.map(c => c.name)]),
              parents: sunburstData.children.flatMap(d => ['', ...d.children.map(() => d.name)]),
              values: sunburstData.children.flatMap(d => [0, ...d.children.map(() => 1)]),
              marker: {
                colors: sunburstData.children.flatMap(d => [
                  dimensionColors[d.name] || dimensionColors.default,
                  ...d.children.map(() => dimensionColors[d.name] || dimensionColors.default)
                ])
              },
              textinfo: 'label',
              hovertemplate: '<b>%{label}</b><extra></extra>',
              customdata: sunburstData.children.flatMap(d => [null, ...d.children.map(c => c.data)])
            }]}
            layout={{
              margin: { t: 40, l: 0, r: 0, b: 0 },
              width: 800,
              height: 800,
              paper_bgcolor: 'transparent',
              plot_bgcolor: 'transparent',
              font: { size: 12, color: '#333' }
            }}
            config={{ displayModeBar: false }}
            onClick={(event) => {
              if (event.points[0].customdata) {
                setSelectedTopic(event.points[0].customdata);
              }
            }}
          />
        );

      case 'treemap':
        const treemapData = createTreemapData();
        return (
          <Plot
            data={[{
              type: 'treemap',
              labels: treemapData.labels,
              parents: treemapData.parents,
              values: treemapData.values,
              text: treemapData.text,
              textposition: 'middle center',
              marker: {
                colors: treemapData.colors,
                line: { width: 2, color: 'white' }
              },
              hovertemplate: '<b>%{label}</b><extra></extra>',
              customdata: treemapData.customdata
            }]}
            layout={{
              margin: { t: 40, l: 0, r: 0, b: 0 },
              width: 900,
              height: 600,
              paper_bgcolor: 'transparent',
              plot_bgcolor: 'transparent',
              font: { size: 14, color: '#333' }
            }}
            config={{ displayModeBar: false }}
            onClick={(event) => {
              if (event.points[0].customdata) {
                setSelectedTopic(event.points[0].customdata);
              }
            }}
          />
        );

      case 'cards':
        return (
          <div className={styles.cardsGrid}>
            {dimensions.map((dimension, dimIndex) => (
              <motion.div
                key={dimension}
                className={styles.dimensionGroup}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: dimIndex * 0.1 }}
              >
                <h3 
                  className={styles.dimensionTitle}
                  style={{ borderLeftColor: dimensionColors[dimension] || dimensionColors.default }}
                >
                  {dimension}
                </h3>
                <div className={styles.topicsGrid}>
                  {filteredData
                    .filter(item => item.Dimension === dimension)
                    .map((topic, topicIndex) => (
                      <motion.div
                        key={topic.id || topicIndex}
                        className={styles.topicCard}
                        style={{ borderTopColor: dimensionColors[dimension] || dimensionColors.default }}
                        whileHover={{ scale: 1.02, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                        onClick={() => setSelectedTopic(topic)}
                      >
                        <h4>{topic.Topic}</h4>
                        <p className={styles.contextPreview}>
                          {topic.Context ? topic.Context.substring(0, 100) + '...' : ''}
                        </p>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return <LoadingState message="Loading Interactive Visualization" submessage="Preparing resilience framework data..." />;
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
        <AnimatedSection type="fade" className={styles.pageHeader}>
          <h1>Interactive Resilience Framework</h1>
          <p className={styles.subtitle}>
            Explore the interconnected dimensions of societal resilience through interactive visualizations
          </p>
        </AnimatedSection>

        <div className={styles.controlsContainer}>
          <div className={styles.searchSection}>
            <div className={styles.searchContainer}>
              <FaSearch className={styles.searchIcon} />
              <input 
                type="text" 
                className={styles.searchInput} 
                placeholder="Search topics, dimensions, or keywords..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.filtersSection}>
            <div className={styles.filterGroup}>
              <FaFilter className={styles.filterIcon} />
              <select 
                className={styles.filterSelect}
                value={selectedDimension}
                onChange={(e) => setSelectedDimension(e.target.value)}
              >
                <option value="all">All Dimensions</option>
                {dimensions.map((dimension, index) => (
                  <option key={index} value={dimension}>{dimension}</option>
                ))}
              </select>
            </div>

            <div className={styles.visualizationToggle}>
              <button
                className={`${styles.vizButton} ${visualizationType === 'sunburst' ? styles.active : ''}`}
                onClick={() => setVisualizationType('sunburst')}
                title="Sunburst Diagram"
              >
                <FaChartPie />
              </button>
              <button
                className={`${styles.vizButton} ${visualizationType === 'treemap' ? styles.active : ''}`}
                onClick={() => setVisualizationType('treemap')}
                title="Treemap"
              >
                <FaTh />
              </button>
              <button
                className={`${styles.vizButton} ${visualizationType === 'cards' ? styles.active : ''}`}
                onClick={() => setVisualizationType('cards')}
                title="Card View"
              >
                <FaLayerGroup />
              </button>
            </div>
          </div>
        </div>

        <div className={styles.visualizationContainer}>
          <AnimatedSection type="fade">
            {renderVisualization()}
          </AnimatedSection>
        </div>

        <AnimatePresence>
          {selectedTopic && (
            <motion.div
              className={styles.topicModal}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => setSelectedTopic(null)}
            >
              <motion.div
                className={styles.topicModalContent}
                onClick={(e) => e.stopPropagation()}
                initial={{ y: 50 }}
                animate={{ y: 0 }}
              >
                <button className={styles.closeButton} onClick={() => setSelectedTopic(null)}>×</button>
                
                <div className={styles.modalHeader}>
                  <span 
                    className={styles.dimensionBadge}
                    style={{ backgroundColor: dimensionColors[selectedTopic.Dimension] || dimensionColors.default }}
                  >
                    {selectedTopic.Dimension}
                  </span>
                  <h2>{selectedTopic.Topic}</h2>
                </div>

                <div className={styles.modalBody}>
                  {selectedTopic.Context && (
                    <div className={styles.modalSection}>
                      <FaLayerGroup className={styles.modalIcon} />
                      <div>
                        <h3>Context</h3>
                        <p>{selectedTopic.Context}</p>
                      </div>
                    </div>
                  )}

                  {selectedTopic.Leadership && (
                    <div className={styles.modalSection}>
                      <FaUsers className={styles.modalIcon} />
                      <div>
                        <h3>Leadership</h3>
                        <p>{selectedTopic.Leadership}</p>
                      </div>
                    </div>
                  )}

                  {selectedTopic.Teamwork && (
                    <div className={styles.modalSection}>
                      <FaHandshake className={styles.modalIcon} />
                      <div>
                        <h3>Teamwork</h3>
                        <p>{selectedTopic.Teamwork}</p>
                      </div>
                    </div>
                  )}

                  {selectedTopic.Data && (
                    <div className={styles.modalSection}>
                      <FaDatabase className={styles.modalIcon} />
                      <div>
                        <h3>Data</h3>
                        <p>{selectedTopic.Data}</p>
                      </div>
                    </div>
                  )}

                  {selectedTopic.Resources && (
                    <div className={styles.modalSection}>
                      <FaTools className={styles.modalIcon} />
                      <div>
                        <h3>Resources</h3>
                        <p>{selectedTopic.Resources}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <h3>{dimensions.length}</h3>
            <p>Dimensions</p>
          </div>
          <div className={styles.statCard}>
            <h3>{filteredData.length}</h3>
            <p>Topics</p>
          </div>
          <div className={styles.statCard}>
            <h3>{filteredData.filter(t => t.Leadership).length}</h3>
            <p>Leadership Areas</p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}