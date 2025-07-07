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
const Plot = dynamic(() => import('react-plotly.js'), { 
  ssr: false,
  loading: () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '600px',
      color: '#ffffff'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          width: '50px', 
          height: '50px', 
          border: '3px solid rgba(255, 255, 255, 0.3)',
          borderTopColor: '#8b5cf6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }} />
        <p>Loading visualization...</p>
      </div>
    </div>
  )
});

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
        const res = await fetch('/api/landscape-topics');
        
        if (!res.ok) {
          throw new Error(`Failed to fetch landscape data: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        console.log('🔍 API Response:', data);
        
        const landscapeData = data.landscapeTopics || [];
        console.log('📊 Landscape Data:', landscapeData);
        console.log('📊 First item:', landscapeData[0]);
        
        setLandscape(landscapeData);
        setFilteredData(landscapeData);
        
        // Extract unique dimensions from the API response
        const uniqueDimensions = data.dimensions || [...new Set(landscapeData.map(item => item.Dimension).filter(Boolean))];
        console.log('📊 Dimensions:', uniqueDimensions);
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
        (topic['Topic / Sub-Dimension'] || topic.Topic || '').toLowerCase().includes(term) ||
        (topic.Dimension || '').toLowerCase().includes(term) ||
        (topic.Context || '').toLowerCase().includes(term) ||
        (topic['People & Leadership'] || topic.Leadership || '').toLowerCase().includes(term) ||
        (topic['Teamwork & Organizations'] || topic.Teamwork || '').toLowerCase().includes(term) ||
        (topic['Data & Knowledge'] || topic.Data || '').toLowerCase().includes(term) ||
        (topic['Resources & Products'] || topic.Resources || '').toLowerCase().includes(term) ||
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
    console.log('🎯 Creating sunburst data with:', filteredData);
    
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
        name: item['Topic / Sub-Dimension'] || item.Topic || 'Unnamed Topic',
        value: 1,
        data: item
      });
    });

    root.children = Array.from(dimensionMap.values());
    console.log('🎯 Sunburst root:', root);
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
      labels.push(item['Topic / Sub-Dimension'] || item.Topic || 'Unnamed Topic');
      parents.push(dimension);
      values.push(1);
      colors.push(dimensionColors[dimension] || dimensionColors.default);
      text.push(item['Topic / Sub-Dimension'] || item.Topic || 'Unnamed Topic');
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
        label: item['Topic / Sub-Dimension'] || item.Topic || 'Unnamed Topic',
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
    try {
      switch (visualizationType) {
        case 'sunburst':
          const sunburstData = createSunburstData();
          if (!sunburstData || !sunburstData.children || sunburstData.children.length === 0) {
            return <div style={{ color: '#ffffff', textAlign: 'center' }}>No data available for visualization</div>;
          }
          // Create proper sunburst data structure with root
          const labels = [sunburstData.name];
          const parents = [''];
          const values = [1];  // Root should have a value
          const colors = ['rgba(255, 255, 255, 0)'];
          const customdata = [null];
          
          // Add dimensions and topics
          sunburstData.children.forEach(dimension => {
            labels.push(dimension.name);
            parents.push(sunburstData.name);
            values.push(1);  // Give dimensions a value too
            colors.push(dimensionColors[dimension.name] || dimensionColors.default);
            customdata.push(null);
            
            dimension.children.forEach(topic => {
              labels.push(topic.name);
              parents.push(dimension.name);
              values.push(1);  // All leaves have value 1
              colors.push(dimensionColors[dimension.name] || dimensionColors.default);
              customdata.push(topic.data);
            });
          });
          
          console.log('🌟 Sunburst data structure:', { labels, parents, values });
          
          return (
          <Plot
            data={[{
              type: 'sunburst',
              labels: labels,
              parents: parents,
              values: values,
              marker: {
                colors: colors,
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
              customdata: customdata,
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
        if (!treemapData || !treemapData.labels || treemapData.labels.length === 0) {
          return <div style={{ color: '#ffffff', textAlign: 'center' }}>No data available for visualization</div>;
        }
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
                        <h4>{topic['Topic / Sub-Dimension'] || topic.Topic || 'Unnamed Topic'}</h4>
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
    } catch (error) {
      console.error('Error rendering visualization:', error);
      return (
        <div style={{ color: '#ffffff', textAlign: 'center', padding: '2rem' }}>
          <p>Error loading visualization</p>
          <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>{error.message}</p>
        </div>
      );
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
                  <h2>{selectedTopic['Topic / Sub-Dimension'] || selectedTopic.Topic || 'Unnamed Topic'}</h2>
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

                  {(selectedTopic['People & Leadership'] || selectedTopic.Leadership) && (
                    <div className={styles.modalSection}>
                      <FaUsers className={styles.modalIcon} />
                      <div>
                        <h3>People & Leadership</h3>
                        <p>{selectedTopic['People & Leadership'] || selectedTopic.Leadership}</p>
                      </div>
                    </div>
                  )}

                  {(selectedTopic['Teamwork & Organizations'] || selectedTopic.Teamwork) && (
                    <div className={styles.modalSection}>
                      <FaHandshake className={styles.modalIcon} />
                      <div>
                        <h3>Teamwork & Organizations</h3>
                        <p>{selectedTopic['Teamwork & Organizations'] || selectedTopic.Teamwork}</p>
                      </div>
                    </div>
                  )}

                  {(selectedTopic['Data & Knowledge'] || selectedTopic.Data) && (
                    <div className={styles.modalSection}>
                      <FaDatabase className={styles.modalIcon} />
                      <div>
                        <h3>Data & Knowledge</h3>
                        <p>{selectedTopic['Data & Knowledge'] || selectedTopic.Data}</p>
                      </div>
                    </div>
                  )}

                  {(selectedTopic['Resources & Products'] || selectedTopic.Resources) && (
                    <div className={styles.modalSection}>
                      <FaTools className={styles.modalIcon} />
                      <div>
                        <h3>Resources & Products</h3>
                        <p>{selectedTopic['Resources & Products'] || selectedTopic.Resources}</p>
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
            <h3>{filteredData.filter(t => t['People & Leadership'] || t.Leadership).length}</h3>
            <p>Leadership Areas</p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}