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

// Color palette for dimensions - vibrant gradient colors
const dimensionColors = {
  'Social Equity & Well-being': '#ec4899',
  'Environmental Stewardship & Resource Security': '#10b981',
  'Economic Vitality & Diversity': '#3b82f6',
  'Knowledge & Learning': '#f59e0b',
  'Governance & Civic Engagement': '#8b5cf6',
  'Infrastructure & Built Environment': '#ef4444',
  'Cultural Vitality & Heritage': '#06b6d4',
  'Environmental Resilience': '#10b981',
  'Economic Sustainability': '#3b82f6',
  'Healthcare Systems': '#ec4899',
  'Information Systems': '#8b5cf6',
  'Infrastructure Resilience': '#ef4444',
  'Cultural Vitality': '#06b6d4',
  'default': '#6b7280'
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
        (topic.Resources || '').toLowerCase().includes(term) ||
        (topic.Description || '').toLowerCase().includes(term) ||
        (topic.Examples || '').toLowerCase().includes(term) ||
        (topic.Implementation || '').toLowerCase().includes(term) ||
        (topic.Challenges || '').toLowerCase().includes(term) ||
        (topic.Solutions || '').toLowerCase().includes(term) ||
        (topic.Impact || '').toLowerCase().includes(term) ||
        (topic.Stakeholders || '').toLowerCase().includes(term) ||
        (topic.BestPractices || '').toLowerCase().includes(term) ||
        (topic.Recommendations || '').toLowerCase().includes(term) ||
        (topic.Priority || '').toLowerCase().includes(term)
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
                ]),
                line: {
                  color: 'rgba(255, 255, 255, 0.2)',
                  width: 2
                }
              },
              textinfo: 'label',
              textfont: {
                size: 14,
                color: 'white',
                family: 'system-ui, -apple-system, sans-serif'
              },
              hoverlabel: {
                bgcolor: 'rgba(0, 0, 0, 0.8)',
                bordercolor: 'rgba(255, 255, 255, 0.2)',
                font: {
                  size: 14,
                  color: 'white'
                }
              },
              hovertemplate: '<b>%{label}</b><br>Click to view details<extra></extra>',
              customdata: sunburstData.children.flatMap(d => [null, ...d.children.map(c => c.data)]),
              branchvalues: 'total',
              insidetextorientation: 'radial'
            }]}
            layout={{
              margin: { t: 40, l: 0, r: 0, b: 0 },
              width: 900,
              height: 900,
              paper_bgcolor: 'transparent',
              plot_bgcolor: 'transparent',
              font: { 
                size: 14, 
                color: '#ffffff',
                family: 'system-ui, -apple-system, sans-serif'
              },
              showlegend: false,
              sunburstcolorway: Object.values(dimensionColors)
            }}
            config={{ 
              displayModeBar: true,
              displaylogo: false,
              modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d', 'autoScale2d', 'resetScale2d'],
              toImageButtonOptions: {
                format: 'png',
                filename: 'resilience-framework',
                height: 1200,
                width: 1200,
                scale: 2
              }
            }}
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
              textfont: {
                size: 16,
                color: 'white',
                family: 'system-ui, -apple-system, sans-serif',
                weight: 600
              },
              marker: {
                colors: treemapData.colors,
                line: { 
                  width: 3, 
                  color: 'rgba(255, 255, 255, 0.3)' 
                },
                cornerradius: 10,
                opacity: 0.9
              },
              hoverlabel: {
                bgcolor: 'rgba(0, 0, 0, 0.9)',
                bordercolor: 'rgba(255, 255, 255, 0.3)',
                font: {
                  size: 16,
                  color: 'white',
                  family: 'system-ui, -apple-system, sans-serif'
                }
              },
              hovertemplate: '<b>%{label}</b><br>%{value} topics<br>Click to explore<extra></extra>',
              customdata: treemapData.customdata,
              pathbar: {
                visible: true,
                thickness: 30,
                textfont: {
                  size: 12,
                  color: 'white'
                }
              }
            }]}
            layout={{
              margin: { t: 50, l: 10, r: 10, b: 10 },
              width: 1000,
              height: 700,
              paper_bgcolor: 'transparent',
              plot_bgcolor: 'transparent',
              font: { 
                size: 16, 
                color: '#ffffff',
                family: 'system-ui, -apple-system, sans-serif'
              },
              treemapcolorway: Object.values(dimensionColors),
              transition: {
                duration: 500,
                easing: 'cubic-in-out'
              }
            }}
            config={{ 
              displayModeBar: true,
              displaylogo: false,
              modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d', 'autoScale2d', 'resetScale2d'],
              toImageButtonOptions: {
                format: 'png',
                filename: 'resilience-framework',
                height: 1200,
                width: 1200,
                scale: 2
              }
            }}
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

                  {selectedTopic.Examples && (
                    <div className={styles.modalSection}>
                      <FaLayerGroup className={styles.modalIcon} />
                      <div>
                        <h3>Examples</h3>
                        <p>{selectedTopic.Examples}</p>
                      </div>
                    </div>
                  )}

                  {selectedTopic.Implementation && (
                    <div className={styles.modalSection}>
                      <FaProjectDiagram className={styles.modalIcon} />
                      <div>
                        <h3>Implementation</h3>
                        <p>{selectedTopic.Implementation}</p>
                      </div>
                    </div>
                  )}

                  {selectedTopic.Challenges && (
                    <div className={styles.modalSection}>
                      <FaTools className={styles.modalIcon} />
                      <div>
                        <h3>Challenges</h3>
                        <p>{selectedTopic.Challenges}</p>
                      </div>
                    </div>
                  )}

                  {selectedTopic.Solutions && (
                    <div className={styles.modalSection}>
                      <FaHandshake className={styles.modalIcon} />
                      <div>
                        <h3>Solutions</h3>
                        <p>{selectedTopic.Solutions}</p>
                      </div>
                    </div>
                  )}

                  {selectedTopic.Impact && (
                    <div className={styles.modalSection}>
                      <FaChartPie className={styles.modalIcon} />
                      <div>
                        <h3>Impact</h3>
                        <p>{selectedTopic.Impact}</p>
                      </div>
                    </div>
                  )}

                  {selectedTopic.Stakeholders && (
                    <div className={styles.modalSection}>
                      <FaUsers className={styles.modalIcon} />
                      <div>
                        <h3>Stakeholders</h3>
                        <p>{selectedTopic.Stakeholders}</p>
                      </div>
                    </div>
                  )}

                  {selectedTopic.BestPractices && (
                    <div className={styles.modalSection}>
                      <FaDatabase className={styles.modalIcon} />
                      <div>
                        <h3>Best Practices</h3>
                        <p>{selectedTopic.BestPractices}</p>
                      </div>
                    </div>
                  )}

                  {selectedTopic.Recommendations && (
                    <div className={styles.modalSection}>
                      <FaLayerGroup className={styles.modalIcon} />
                      <div>
                        <h3>Recommendations</h3>
                        <p>{selectedTopic.Recommendations}</p>
                      </div>
                    </div>
                  )}

                  {selectedTopic.Priority && selectedTopic.Priority !== 'Medium' && (
                    <div className={styles.modalSection}>
                      <div className={styles.priorityBadge} data-priority={selectedTopic.Priority.toLowerCase()}>
                        Priority: {selectedTopic.Priority}
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