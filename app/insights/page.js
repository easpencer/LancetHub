'use client';

import { useEffect, useState } from 'react';
import styles from './insights.module.css';

export default function InsightsPage() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/case-studies');
      const data = await response.json();
      console.log('API response:', data);
      // Extract the caseStudies array from the response object
      const studies = data.caseStudies || data || [];
      console.log('Case studies data:', data);
      if (studies.length > 0) {
        console.log('Available fields in case studies:', Object.keys(studies[0]));
        console.log('First case study:', studies[0]);
      }
      setCaseStudies(studies);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setCaseStudies([]);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading insights...</div>;
  }

  if (!caseStudies || caseStudies.length === 0) {
    return (
      <div className={styles.container}>
        <h1>Research Insights Dashboard</h1>
        <div className={styles.noData}>
          <p>No case studies found. Please check your data connection.</p>
        </div>
      </div>
    );
  }

  // Calculate real metrics from the data
  const totalStudies = caseStudies.length;
  
  // Count by study type
  const studyTypes = {};
  caseStudies.forEach(study => {
    const type = study.Type || 'Unknown';
    studyTypes[type] = (studyTypes[type] || 0) + 1;
  });

  // Count by dimensions
  const dimensions = {};
  caseStudies.forEach(study => {
    if (study.Dimensions) {
      const dims = study.Dimensions.split(',').map(d => d.trim());
      dims.forEach(dim => {
        if (dim) dimensions[dim] = (dimensions[dim] || 0) + 1;
      });
    }
  });

  // Extract keywords
  const keywords = {};
  caseStudies.forEach(study => {
    if (study.Keywords) {
      const kws = study.Keywords.split(',').map(k => k.trim());
      kws.forEach(kw => {
        if (kw) keywords[kw] = (keywords[kw] || 0) + 1;
      });
    }
  });

  // Count by institution
  const institutions = {};
  caseStudies.forEach(study => {
    const inst = study.Institution || 'Unknown';
    institutions[inst] = (institutions[inst] || 0) + 1;
  });

  // Get top items
  const topDimensions = Object.entries(dimensions).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const topKeywords = Object.entries(keywords).sort((a, b) => b[1] - a[1]).slice(0, 20);
  const topInstitutions = Object.entries(institutions).sort((a, b) => b[1] - a[1]).slice(0, 10);

  return (
    <div className={styles.container}>
      <h1>Research Insights Dashboard</h1>
      <p className={styles.subtitle}>Analysis of {totalStudies} case studies</p>

      <div className={styles.tabs}>
        <button 
          className={activeTab === 'overview' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'dimensions' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('dimensions')}
        >
          Dimensions
        </button>
        <button 
          className={activeTab === 'keywords' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('keywords')}
        >
          Keywords
        </button>
        <button 
          className={activeTab === 'institutions' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('institutions')}
        >
          Institutions
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className={styles.content}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>{totalStudies}</h3>
              <p>Total Case Studies</p>
            </div>
            <div className={styles.statCard}>
              <h3>{Object.keys(dimensions).length}</h3>
              <p>Resilience Dimensions</p>
            </div>
            <div className={styles.statCard}>
              <h3>{Object.keys(keywords).length}</h3>
              <p>Unique Keywords</p>
            </div>
            <div className={styles.statCard}>
              <h3>{Object.keys(institutions).length}</h3>
              <p>Contributing Institutions</p>
            </div>
          </div>

          <div className={styles.section}>
            <h2>Study Types Distribution</h2>
            <div className={styles.barChart}>
              {Object.entries(studyTypes).map(([type, count]) => (
                <div key={type} className={styles.barItem}>
                  <div className={styles.barLabel}>{type}</div>
                  <div className={styles.barContainer}>
                    <div 
                      className={styles.bar} 
                      style={{ width: `${(count / totalStudies) * 100}%` }}
                    >
                      {count}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'dimensions' && (
        <div className={styles.content}>
          <h2>Resilience Dimensions Analysis</h2>
          <p className={styles.description}>
            Distribution of case studies across different resilience dimensions
          </p>
          <div className={styles.dimensionsList}>
            {topDimensions.map(([dimension, count]) => (
              <div key={dimension} className={styles.dimensionItem}>
                <div className={styles.dimensionName}>{dimension}</div>
                <div className={styles.dimensionBar}>
                  <div 
                    className={styles.dimensionFill}
                    style={{ width: `${(count / topDimensions[0][1]) * 100}%` }}
                  />
                </div>
                <div className={styles.dimensionCount}>{count} studies</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'keywords' && (
        <div className={styles.content}>
          <h2>Keyword Analysis</h2>
          <p className={styles.description}>
            Most common keywords and themes across all case studies
          </p>
          <div className={styles.keywordCloud}>
            {topKeywords.map(([keyword, count]) => (
              <span 
                key={keyword} 
                className={styles.keyword}
                style={{ 
                  fontSize: `${Math.max(0.8, Math.min(2, count / 5))}rem`,
                  opacity: Math.max(0.6, Math.min(1, count / 10))
                }}
              >
                {keyword} ({count})
              </span>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'institutions' && (
        <div className={styles.content}>
          <h2>Contributing Institutions</h2>
          <p className={styles.description}>
            Organizations contributing case studies to the research
          </p>
          <div className={styles.institutionsList}>
            {topInstitutions.map(([institution, count]) => (
              <div key={institution} className={styles.institutionItem}>
                <div className={styles.institutionName}>{institution}</div>
                <div className={styles.institutionCount}>{count} studies</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}