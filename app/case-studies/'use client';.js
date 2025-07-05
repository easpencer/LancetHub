'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './case-studies.module.css';

export default function CaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // In a real app, this would fetch from Airtable API
    const fetchCaseStudies = async () => {
      try {
        const response = await fetch('/api/case-studies');
        
        if (!response.ok) {
          throw new Error('Failed to fetch case studies');
        }
        
        const data = await response.json();
        setCaseStudies(data.caseStudies);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCaseStudies();
  }, []);

  const sections = ['all', ...new Set(caseStudies.map(study => study.Section))];

  const filteredStudies = filter === 'all' 
    ? caseStudies 
    : caseStudies.filter(study => study.Section === filter);

  if (loading) {
    return <div className={styles.loading}>Loading case studies...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Case Studies</h1>
      <p>Explore our collection of case studies on resilience and pandemic response.</p>
      
      <div className={styles.filters}>
        <div className={styles.filterLabel}>Filter by section:</div>
        <div className={styles.filterButtons}>
          {sections.map(section => (
            <button 
              key={section}
              onClick={() => setFilter(section)}
              className={`${styles.filterButton} ${filter === section ? styles.active : ''}`}
            >
              {section === 'all' ? 'All' : section}
            </button>
          ))}
        </div>
      </div>
      
      <div className={styles.grid}>
        {filteredStudies.map((study, index) => {
          // Extract dimensions from the comma-separated string
          const dimensions = study['Resilient Dimensions'] 
            ? study['Resilient Dimensions'].split(',').map(d => d.trim()) 
            : [];
          
          return (
            <Link 
              href={`/case-studies/${encodeURIComponent(study['Case Study Title'])}`}
              key={index}
              className={styles.caseStudyCard}
            >
              <div className={styles.section}>{study.Section}</div>
              <h2 className={styles.title}>{study['Case Study Title']}</h2>
              <p className={styles.author}>By {study.Name}</p>
              <p className={styles.description}>{study['Short Description']}</p>
              
              <div className={styles.dimensions}>
                {dimensions.map((dimension, i) => (
                  <span key={i} className={styles.dimension}>{dimension}</span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
