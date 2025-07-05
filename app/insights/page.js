'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaChartBar, 
  FaChartPie, 
  FaChartLine, 
  FaLightbulb, 
  FaExclamationTriangle, 
  FaArrowUp, 
  FaArrowDown,
  FaRedoAlt 
} from 'react-icons/fa';
import LoadingState from '../../components/LoadingState';
import styles from './insights.module.css';

export default function InsightsPage() {
  const [metrics, setMetrics] = useState([]);
  const [dimensions, setDimensions] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Core resilience dimensions based on Commission framework
  const coreDimensions = [
    "Healthcare Systems", 
    "Information Systems",
    "Social Equity & Well-being",
    "Economic Sustainability",
    "Governance & Civic Engagement",
    "Infrastructure Resilience",
    "Environmental Stewardship",
    "Cultural Vitality"
  ];
  
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch insights from our new insights API
      const response = await fetch('/api/insights');
      if (!response.ok) {
        throw new Error(`Failed to fetch insights: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Insights data:', data);
      
      // Set the insights and metrics from API
      if (data.insights) {
        setInsights(data.insights);
      }
      
      if (data.metrics) {
        // Transform metrics to match existing structure
        const transformedMetrics = data.metrics.map(metric => ({
          id: metric.id,
          name: metric.name,
          value: `${metric.value}`,
          changePercent: '0', // API doesn't provide change yet
          dimension: metric.description || 'General',
          trend: metric.trend || 'Stable',
          description: metric.description
        }));
        setMetrics(transformedMetrics);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching insights:', err);
      setError(err.message);
      
      // Fall back to sample data if API fails
      try {
      
      // Enhanced metrics data based on Commission focus areas
      const sampleMetrics = [
        { id: 'm1', name: 'Pandemic Preparedness Index', value: '72/100', changePercent: '8.3', dimension: 'Healthcare Systems', trend: 'Positive', description: 'Community capacity to respond to infectious disease outbreaks' },
        { id: 'm2', name: 'Information Trust Score', value: '58/100', changePercent: '-4.2', dimension: 'Information Systems', trend: 'Negative', description: 'Level of trust in public health information and scientific guidance' },
        { id: 'm3', name: 'Social Cohesion Index', value: '67/100', changePercent: '2.1', dimension: 'Social Equity & Well-being', trend: 'Positive', description: 'Community bonds and mutual support networks' },
        { id: 'm4', name: 'Economic Resilience Score', value: '65/100', changePercent: '1.8', dimension: 'Economic Sustainability', trend: 'Positive', description: 'Local economic capacity to withstand and recover from shocks' },
        { id: 'm5', name: 'Adaptive Governance Index', value: '71/100', changePercent: '3.7', dimension: 'Governance & Civic Engagement', trend: 'Positive', description: 'Government responsiveness and coordination capabilities' },
        { id: 'm6', name: 'Technology Infrastructure', value: '78/100', changePercent: '5.4', dimension: 'Infrastructure Resilience', trend: 'Positive', description: 'Digital infrastructure reliability and accessibility' },
        { id: 'm7', name: 'Cultural Adaptation Capacity', value: '69/100', changePercent: '0.9', dimension: 'Cultural Vitality', trend: 'Positive', description: 'Community ability to maintain cultural practices during disruption' },
        { id: 'm8', name: 'Environmental Health Score', value: '61/100', changePercent: '-1.5', dimension: 'Environmental Stewardship', trend: 'Negative', description: 'Environmental factors supporting community health and resilience' }
      ];
      
      // Enhanced insights data focused on pandemic resilience and Commission priorities
      const sampleInsights = [
        { 
          dimension: 'Healthcare Systems', 
          type: 'Positive Progress', 
          message: 'Pandemic preparedness significantly improved with 8.3% increase following enhanced surveillance systems and community health worker training programs', 
          priority: 'low',
          recommendation: 'Continue investment in community health infrastructure and maintain surveillance capacity'
        },
        { 
          dimension: 'Information Systems', 
          type: 'Critical Concern', 
          message: 'Information trust scores declining by 4.2%, indicating growing misinformation challenges and reduced confidence in public health guidance', 
          priority: 'high',
          recommendation: 'Implement community-based trusted messenger programs and enhance science communication strategies'
        },
        { 
          dimension: 'Social Equity & Well-being', 
          type: 'Steady Improvement', 
          message: 'Social cohesion strengthening with 2.1% improvement as communities build mutual support networks and inclusive response mechanisms', 
          priority: 'medium',
          recommendation: 'Expand community engagement programs and address remaining equity gaps'
        },
        { 
          dimension: 'Governance & Civic Engagement', 
          type: 'Strong Performance', 
          message: 'Adaptive governance capacity improving by 3.7% with enhanced coordination between government levels and improved crisis response protocols', 
          priority: 'low',
          recommendation: 'Maintain cross-sector coordination mechanisms and update emergency response plans'
        },
        { 
          dimension: 'Infrastructure Resilience', 
          type: 'Excellent Progress', 
          message: 'Technology infrastructure showing robust 5.4% growth in reliability and accessibility, supporting remote work and digital health services', 
          priority: 'low',
          recommendation: 'Ensure equitable access and maintain cybersecurity investments'
        },
        {
          dimension: 'Environmental Stewardship',
          type: 'Attention Needed',
          message: 'Environmental health indicators declining by 1.5%, with potential impacts on disease emergence and community health resilience',
          priority: 'medium',
          recommendation: 'Strengthen One Health approaches and environmental monitoring systems'
        }
      ];
      
        setMetrics(sampleMetrics);
        setInsights(sampleInsights);
        setLoading(false);
      } catch (fallbackErr) {
        console.error('Error with fallback data:', fallbackErr);
        setError('Failed to load insights data');
        setLoading(false);
      }
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  // Function to calculate and format percentage change
  const formatPercentChange = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '0%';
    
    const formatted = Math.abs(num).toFixed(1) + '%';
    return num >= 0 ? '+' + formatted : '-' + formatted;
  };
  
  // Function to determine the color based on trend
  const getTrendColor = (trend) => {
    switch (trend?.toLowerCase()) {
      case 'positive':
        return 'var(--secondary-color)';
      case 'negative':
        return 'var(--danger-color)';
      case 'neutral':
        return 'var(--light-text)';
      default:
        return 'var(--light-text)';
    }
  };
  
  if (loading) {
    return <LoadingState message="Analyzing resilience data..." submessage="Gathering insights from community case studies and metrics" />;
  }
  
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <FaExclamationTriangle className={styles.errorIcon} />
        <h2>Error Loading Insights</h2>
        <p>{error}</p>
        <button onClick={fetchData} className={styles.retryButton}>
          <FaRedoAlt /> Retry
        </button>
        <p className={styles.errorHelp}>
          You can continue exploring with sample data to see how the dashboard works.
        </p>
        <button 
          onClick={() => {
            // Use fallback data for demo purposes
            setMetrics([
              { id: 'm1', name: 'Healthcare Access Index', value: '68/100', changePercent: '3.5', dimension: 'Social Equity & Well-being', trend: 'Positive' },
              { id: 'm2', name: 'Water Security Score', value: '75/100', changePercent: '-2.1', dimension: 'Environmental Stewardship', trend: 'Negative' },
              { id: 'm3', name: 'Local Business Resilience', value: '63/100', changePercent: '5.2', dimension: 'Economic Sustainability', trend: 'Positive' },
              { id: 'm4', name: 'Community Knowledge Index', value: '81/100', changePercent: '1.7', dimension: 'Knowledge & Learning', trend: 'Positive' }
            ]);
            setInsights([
              { dimension: 'Environmental Stewardship', type: 'Concerning Trend', message: 'Water security has declined by 2.1%', priority: 'high' },
              { dimension: 'Social Equity & Well-being', type: 'Positive Progress', message: 'Healthcare access has improved by 3.5%', priority: 'low' },
            ]);
            setError(null);
          }}
          className={styles.continueButton}
        >
          Continue with Sample Data
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Resilience Insights</h1>
        <p className={styles.subtitle}>
          Data-driven analysis of community resilience metrics and patterns
        </p>
      </motion.div>
      
      <div className={styles.tabs}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'overview' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <FaChartPie /> Overview
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'metrics' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('metrics')}
        >
          <FaChartBar /> Metrics
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'insights' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          <FaLightbulb /> Key Insights
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'trends' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('trends')}
        >
          <FaChartLine /> Trends
        </button>
      </div>
      
      <div className={styles.content}>
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={styles.overviewSection}
          >
            <h2>The 7 Core Resilience Dimensions</h2>
            
            <div className={styles.dimensionsGrid}>
              {coreDimensions.map((dimension, index) => (
                <motion.div
                  key={dimension}
                  className={styles.dimensionCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <h3>{dimension}</h3>
                  <div className={styles.dimensionStats}>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>
                        {metrics.filter(m => m.dimension === dimension).length || 0}
                      </span>
                      <span className={styles.statLabel}>Metrics</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>
                        {insights.filter(i => i.dimension === dimension).length || 0}
                      </span>
                      <span className={styles.statLabel}>Insights</span>
                    </div>
                  </div>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill} 
                      style={{ 
                        width: `${Math.min(100, Math.max(10, Math.floor(Math.random() * 100)))}%`,
                        backgroundColor: `hsl(${index * 30}, 80%, 50%)`
                      }}
                    ></div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className={styles.summarySection}>
              <h2>Resilience Analysis Summary</h2>
              
              <div className={styles.summaryStats}>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryValue}>{metrics.length}</div>
                  <div className={styles.summaryLabel}>Total Metrics</div>
                </div>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryValue}>
                    {metrics.filter(m => m.trend === 'Positive').length}
                  </div>
                  <div className={styles.summaryLabel}>Positive Trends</div>
                </div>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryValue}>
                    {metrics.filter(m => m.trend === 'Negative').length}
                  </div>
                  <div className={styles.summaryLabel}>Negative Trends</div>
                </div>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryValue}>
                    {insights.filter(i => i.priority === 'high').length}
                  </div>
                  <div className={styles.summaryLabel}>High Priority Insights</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {activeTab === 'metrics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={styles.metricsSection}
          >
            <h2>Key Resilience Metrics</h2>
            
            <div className={styles.metricsTable}>
              <div className={styles.tableHeader}>
                <div className={styles.thName}>Metric Name</div>
                <div className={styles.thDimension}>Dimension</div>
                <div className={styles.thValue}>Value</div>
                <div className={styles.thChange}>Change</div>
                <div className={styles.thTrend}>Trend</div>
              </div>
              
              <div className={styles.tableBody}>
                {metrics.length > 0 ? (
                  metrics.slice(0, 10).map((metric, index) => (
                    <motion.div 
                      key={metric.id || index}
                      className={styles.tableRow}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <div className={styles.tdName}>{metric.name}</div>
                      <div className={styles.tdDimension}>{metric.dimension}</div>
                      <div className={styles.tdValue}>{metric.value}</div>
                      <div 
                        className={styles.tdChange}
                        style={{ 
                          color: parseFloat(metric.changePercent) >= 0 ? 
                            'var(--secondary-color)' : 'var(--danger-color)'
                        }}
                      >
                        {formatPercentChange(metric.changePercent)}
                        {parseFloat(metric.changePercent) >= 0 ? 
                          <FaArrowUp className={styles.trendIcon} /> : 
                          <FaArrowDown className={styles.trendIcon} />}
                      </div>
                      <div 
                        className={styles.tdTrend}
                        style={{ color: getTrendColor(metric.trend) }}
                      >
                        {metric.trend}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className={styles.noData}>
                    <p>No metrics data available</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
        
        {activeTab === 'insights' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={styles.insightsSection}
          >
            <h2>Key Insights and Findings</h2>
            
            <div className={styles.insightsGrid}>
              {insights.length > 0 ? (
                insights.slice(0, 6).map((insight, index) => (
                  <motion.div
                    key={index}
                    className={`${styles.insightCard} ${styles[insight.priority]}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <div className={styles.insightType}>{insight.type}</div>
                    <h3>{insight.dimension}</h3>
                    <p>{insight.message}</p>
                    <div className={`${styles.insightPriority} ${styles[insight.priority]}`}>
                      {insight.priority.charAt(0).toUpperCase() + insight.priority.slice(1)} Priority
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className={styles.noData}>
                  <p>No insights data available</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
        
        {activeTab === 'trends' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={styles.trendsSection}
          >
            <h2>Resilience Trends Over Time</h2>
            
            <div className={styles.trendsGrid}>
              {coreDimensions.slice(0, 4).map((dimension, index) => (
                <div key={dimension} className={styles.trendChart}>
                  <h3>{dimension}</h3>
                  <div className={styles.chartPlaceholder}>
                    <div 
                      className={styles.chartLine} 
                      style={{ 
                        clipPath: `polygon(
                          0% ${50 + Math.random() * 30}%, 
                          20% ${30 + Math.random() * 40}%, 
                          40% ${50 + Math.random() * 30}%, 
                          60% ${40 + Math.random() * 30}%, 
                          80% ${30 + Math.random() * 20}%, 
                          100% ${20 + Math.random() * 30}%
                        )`,
                        backgroundColor: `hsl(${index * 60}, 80%, 60%)`
                      }}
                    ></div>
                    <div className={styles.chartXAxis}>
                      <span>Jan</span>
                      <span>Mar</span>
                      <span>May</span>
                      <span>Jul</span>
                      <span>Sep</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
