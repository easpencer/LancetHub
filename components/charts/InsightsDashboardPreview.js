'use client';

import styles from './InsightsDashboardPreview.module.css';

export default function InsightsDashboardPreview() {
  return (
    <div className={styles.previewContainer}>
      <h2>Insights Dashboard Features</h2>
      
      <div className={styles.featureGrid}>
        <div className={styles.featureCard}>
          <h3>📊 Real-Time Charts</h3>
          <ul>
            <li>Interactive line charts showing trends over time</li>
            <li>Bar charts comparing metrics across dimensions</li>
            <li>Radar charts for dimensional analysis</li>
            <li>Pie charts for outcome distribution</li>
          </ul>
        </div>
        
        <div className={styles.featureCard}>
          <h3>🌐 Network Visualization</h3>
          <ul>
            <li>Interactive knowledge graph</li>
            <li>Shows connections between case studies</li>
            <li>Highlights key themes and relationships</li>
            <li>Zoomable and draggable interface</li>
          </ul>
        </div>
        
        <div className={styles.featureCard}>
          <h3>🔍 Smart Filters</h3>
          <ul>
            <li>Filter by time period</li>
            <li>Filter by dimension</li>
            <li>Filter by study type</li>
            <li>Filter by priority level</li>
          </ul>
        </div>
        
        <div className={styles.featureCard}>
          <h3>📈 Data Visualizations</h3>
          <ul>
            <li>Treemap for keyword analysis</li>
            <li>Trend lines with benchmarks</li>
            <li>Comparative metrics</li>
            <li>Pattern clustering</li>
          </ul>
        </div>
        
        <div className={styles.featureCard}>
          <h3>📋 Export Options</h3>
          <ul>
            <li>Export as HTML report</li>
            <li>Export as Markdown</li>
            <li>Export as JSON data</li>
            <li>Download individual charts</li>
          </ul>
        </div>
        
        <div className={styles.featureCard}>
          <h3>🎯 Key Insights</h3>
          <ul>
            <li>AI-generated insights from data</li>
            <li>Priority-based recommendations</li>
            <li>Trend analysis and predictions</li>
            <li>Gap identification</li>
          </ul>
        </div>
      </div>
      
      <div className={styles.chartTypes}>
        <h3>Chart Types Implemented</h3>
        <div className={styles.chartGrid}>
          <div className={styles.chartType}>
            <div className={styles.chartIcon}>📈</div>
            <h4>Line Charts</h4>
            <p>Trend analysis over time</p>
          </div>
          <div className={styles.chartType}>
            <div className={styles.chartIcon}>📊</div>
            <h4>Bar Charts</h4>
            <p>Comparative metrics</p>
          </div>
          <div className={styles.chartType}>
            <div className={styles.chartIcon}>🎯</div>
            <h4>Radar Charts</h4>
            <p>Multi-dimensional analysis</p>
          </div>
          <div className={styles.chartType}>
            <div className={styles.chartIcon}>🥧</div>
            <h4>Pie Charts</h4>
            <p>Distribution analysis</p>
          </div>
          <div className={styles.chartType}>
            <div className={styles.chartIcon}>🌳</div>
            <h4>Treemaps</h4>
            <p>Hierarchical data</p>
          </div>
          <div className={styles.chartType}>
            <div className={styles.chartIcon}>🕸️</div>
            <h4>Network Graphs</h4>
            <p>Relationship mapping</p>
          </div>
        </div>
      </div>
    </div>
  );
}