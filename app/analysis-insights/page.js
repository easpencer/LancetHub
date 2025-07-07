'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import advancedNLP from '../../utils/advanced-nlp';
import mlInsightsEngine from '../../utils/ml-insights-engine';
import styles from './analysis-insights.module.css';

// Dynamic imports for heavy components
const KnowledgeGraph = dynamic(() => import('../../components/KnowledgeGraph'), { 
  ssr: false,
  loading: () => <div className={styles.loading}>Loading knowledge graph...</div>
});

export default function AnalysisInsightsPage() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analysisMode, setAnalysisMode] = useState('basic'); // 'basic' or 'advanced'
  const [activeTab, setActiveTab] = useState('overview');
  const [mlInsights, setMlInsights] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (analysisMode === 'advanced' && caseStudies.length > 0 && !mlInsights) {
      runMLAnalysis();
    }
  }, [analysisMode, caseStudies]);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/case-studies');
      const data = await response.json();
      const studies = data.caseStudies || data || [];
      setCaseStudies(studies);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setCaseStudies([]);
      setLoading(false);
    }
  };

  const runMLAnalysis = async () => {
    if (mlInsights || processing) return;
    
    try {
      setProcessing(true);
      
      // Initialize ML engine
      await mlInsightsEngine.initialize(caseStudies);
      
      // Generate insights
      const insights = mlInsightsEngine.generateInsights();
      
      // Process NLP insights
      const nlpInsights = processNLPInsights(caseStudies);
      
      setMlInsights({
        ...insights,
        nlp: nlpInsights,
        summary: generateExecutiveSummary(insights, nlpInsights, caseStudies)
      });
      
      setProcessing(false);
    } catch (error) {
      console.error('ML Analysis error:', error);
      setProcessing(false);
    }
  };

  const processNLPInsights = (studies) => {
    const allTexts = studies.map(s => 
      `${s.Title || ''} ${s.Description || ''} ${s.Focus || ''}`
    );
    
    const topics = advancedNLP.extractTopics(allTexts, 5, 8);
    
    const allEntities = {
      organizations: new Set(),
      people: new Set(),
      methodologies: new Set()
    };
    
    studies.forEach(study => {
      const text = `${study.Title || ''} ${study.Description || ''} ${study.Institution || ''}`;
      const entities = advancedNLP.extractEntities(text);
      
      entities.organizations.forEach(org => allEntities.organizations.add(org));
      entities.people.forEach(person => allEntities.people.add(person));
      entities.methodologies.forEach(method => allEntities.methodologies.add(method));
    });
    
    const tfidfResults = advancedNLP.calculateEnhancedTFIDF(allTexts, {
      ngramRange: [1, 3],
      maxFeatures: 50
    });
    
    return {
      topics,
      entities: {
        organizations: Array.from(allEntities.organizations),
        people: Array.from(allEntities.people),
        methodologies: Array.from(allEntities.methodologies)
      },
      keywords: tfidfResults
    };
  };

  const generateExecutiveSummary = (mlInsights, nlpInsights, studies) => {
    const summary = {
      totalStudies: studies.length,
      keyFindings: [],
      recommendations: []
    };
    
    if (mlInsights.clusters && mlInsights.clusters.length > 0) {
      summary.keyFindings.push(
        `Research naturally groups into ${mlInsights.clusters.length} distinct clusters`
      );
    }
    
    if (mlInsights.anomalies && mlInsights.anomalies.length > 0) {
      summary.keyFindings.push(
        `${mlInsights.anomalies.length} studies show unusual patterns`
      );
    }
    
    if (mlInsights.patterns && mlInsights.patterns.length > 0) {
      const dimPattern = mlInsights.patterns.find(p => p.type === 'dimension_combinations');
      if (dimPattern && dimPattern.data.length > 0) {
        summary.keyFindings.push(
          `Most common dimension combination: ${dimPattern.data[0].combination}`
        );
      }
    }
    
    if (mlInsights.recommendations) {
      summary.recommendations = mlInsights.recommendations;
    }
    
    return summary;
  };

  // Calculate basic metrics
  const totalStudies = caseStudies.length;
  
  const studyTypes = {};
  caseStudies.forEach(study => {
    const type = study.Type || 'Unknown';
    studyTypes[type] = (studyTypes[type] || 0) + 1;
  });

  const dimensions = {};
  caseStudies.forEach(study => {
    if (study.Dimensions) {
      const dims = study.Dimensions.split(',').map(d => d.trim());
      dims.forEach(dim => {
        if (dim) dimensions[dim] = (dimensions[dim] || 0) + 1;
      });
    }
  });

  const keywords = {};
  caseStudies.forEach(study => {
    if (study.Keywords) {
      const kws = study.Keywords.split(',').map(k => k.trim());
      kws.forEach(kw => {
        if (kw) keywords[kw] = (keywords[kw] || 0) + 1;
      });
    }
  });

  const institutions = {};
  caseStudies.forEach(study => {
    const inst = study.Institution || 'Unknown';
    institutions[inst] = (institutions[inst] || 0) + 1;
  });

  const topDimensions = Object.entries(dimensions).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const topKeywords = Object.entries(keywords).sort((a, b) => b[1] - a[1]).slice(0, 20);
  const topInstitutions = Object.entries(institutions).sort((a, b) => b[1] - a[1]).slice(0, 10);

  if (loading) {
    return <div className={styles.loading}>Loading analysis...</div>;
  }

  if (!caseStudies || caseStudies.length === 0) {
    return (
      <div className={styles.container}>
        <h1>Analysis & Insights</h1>
        <div className={styles.noData}>
          <p>No case studies found. Please check your data connection.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Analysis & Insights</h1>
        <p className={styles.subtitle}>
          Comprehensive analysis of {totalStudies} case studies
        </p>
      </div>

      <div className={styles.modeSelector}>
        <button 
          className={analysisMode === 'basic' ? styles.modeActive : styles.modeButton}
          onClick={() => setAnalysisMode('basic')}
        >
          Basic Analysis
        </button>
        <button 
          className={analysisMode === 'advanced' ? styles.modeActive : styles.modeButton}
          onClick={() => setAnalysisMode('advanced')}
        >
          Advanced ML Analysis
        </button>
      </div>

      {processing && (
        <div className={styles.processingBar}>
          <div className={styles.processingMessage}>
            Running machine learning analysis...
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
        </div>
      )}

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
        {analysisMode === 'advanced' && (
          <>
            <button 
              className={activeTab === 'clusters' ? styles.activeTab : styles.tab}
              onClick={() => setActiveTab('clusters')}
            >
              Clusters
            </button>
            <button 
              className={activeTab === 'patterns' ? styles.activeTab : styles.tab}
              onClick={() => setActiveTab('patterns')}
            >
              Patterns
            </button>
            <button 
              className={activeTab === 'predictions' ? styles.activeTab : styles.tab}
              onClick={() => setActiveTab('predictions')}
            >
              Predictions
            </button>
            <button 
              className={activeTab === 'nlp' ? styles.activeTab : styles.tab}
              onClick={() => setActiveTab('nlp')}
            >
              NLP Insights
            </button>
            <button 
              className={activeTab === 'network' ? styles.activeTab : styles.tab}
              onClick={() => setActiveTab('network')}
            >
              Knowledge Graph
            </button>
          </>
        )}
      </div>

      <div className={styles.content}>
        {activeTab === 'overview' && (
          <div className={styles.overviewSection}>
            {analysisMode === 'advanced' && mlInsights && (
              <div className={styles.executiveSummary}>
                <h2>Executive Summary</h2>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryCard}>
                    <h3>Key ML Findings</h3>
                    <ul>
                      {mlInsights.summary.keyFindings.map((finding, idx) => (
                        <li key={idx}>{finding}</li>
                      ))}
                    </ul>
                  </div>
                  {mlInsights.summary.recommendations.length > 0 && (
                    <div className={styles.summaryCard}>
                      <h3>Recommendations</h3>
                      {mlInsights.summary.recommendations.slice(0, 3).map((rec, idx) => (
                        <div key={idx} className={styles.recommendation}>
                          <h4>{rec.title}</h4>
                          <p>{rec.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

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
              {analysisMode === 'advanced' && mlInsights && (
                <>
                  <div className={styles.statCard}>
                    <h3>{mlInsights.clusters.length}</h3>
                    <p>Research Clusters</p>
                  </div>
                  <div className={styles.statCard}>
                    <h3>{mlInsights.patterns.length}</h3>
                    <p>Patterns Detected</p>
                  </div>
                </>
              )}
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
          <div className={styles.dimensionsSection}>
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
          <div className={styles.keywordsSection}>
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
          <div className={styles.institutionsSection}>
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

        {analysisMode === 'advanced' && mlInsights && activeTab === 'clusters' && (
          <div className={styles.clustersSection}>
            <h2>Study Clusters</h2>
            <p className={styles.description}>
              Machine learning has identified {mlInsights.clusters.length} distinct groups of studies
            </p>
            <div className={styles.clusterGrid}>
              {mlInsights.clusters.map((cluster, idx) => (
                <div key={idx} className={styles.clusterCard}>
                  <h3>Cluster {cluster.id + 1}</h3>
                  <div className={styles.clusterStats}>
                    <span>{cluster.size} studies</span>
                    <span>Sentiment: {cluster.characteristics.avgSentiment.toFixed(2)}</span>
                  </div>
                  <div className={styles.clusterCharacteristics}>
                    <h4>Common Dimensions:</h4>
                    <div className={styles.tagList}>
                      {cluster.characteristics.commonDimensions.map((dim, i) => (
                        <span key={i} className={styles.tag}>{dim}</span>
                      ))}
                    </div>
                  </div>
                  <div className={styles.clusterStudies}>
                    <h4>Sample Studies:</h4>
                    {cluster.studies.slice(0, 3).map((study, i) => (
                      <div key={i} className={styles.studyItem}>
                        {study.Title}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {analysisMode === 'advanced' && mlInsights && activeTab === 'patterns' && (
          <div className={styles.patternsSection}>
            <h2>Patterns & Trends</h2>
            {mlInsights.patterns.map((pattern, idx) => (
              <div key={idx} className={styles.patternCard}>
                <h3>{pattern.title}</h3>
                <p>{pattern.description}</p>
                {pattern.type === 'dimension_combinations' && (
                  <div className={styles.combinationList}>
                    {pattern.data.map((item, i) => (
                      <div key={i} className={styles.combinationItem}>
                        <span className={styles.combination}>{item.combination}</span>
                        <span className={styles.count}>{item.count} occurrences</span>
                      </div>
                    ))}
                  </div>
                )}
                {pattern.type === 'temporal_trends' && (
                  <div className={styles.trendChart}>
                    {pattern.data.map((year, i) => (
                      <div key={i} className={styles.yearData}>
                        <span className={styles.year}>{year.year}</span>
                        <div className={styles.yearBar}>
                          <div 
                            className={styles.yearFill}
                            style={{ width: `${(year.count / 10) * 100}%` }}
                          />
                        </div>
                        <span className={styles.yearCount}>{year.count} studies</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {analysisMode === 'advanced' && mlInsights && activeTab === 'predictions' && (
          <div className={styles.predictionsSection}>
            <h2>Success Predictions</h2>
            <p className={styles.description}>
              ML-based predictions of intervention success probability
            </p>
            <div className={styles.predictionList}>
              {mlInsights.predictions
                .sort((a, b) => b.prediction.probability - a.prediction.probability)
                .slice(0, 10)
                .map((item, idx) => (
                  <div key={idx} className={styles.predictionCard}>
                    <h4>{item.study.Title}</h4>
                    <div className={styles.probabilityBar}>
                      <div 
                        className={styles.probabilityFill}
                        style={{ 
                          width: `${item.prediction.probability * 100}%`,
                          backgroundColor: item.prediction.probability > 0.7 ? '#4CAF50' : 
                                         item.prediction.probability > 0.4 ? '#FFC107' : '#F44336'
                        }}
                      />
                      <span className={styles.probabilityText}>
                        {Math.round(item.prediction.probability * 100)}%
                      </span>
                    </div>
                    <div className={styles.factors}>
                      {item.prediction.factors.map((factor, i) => (
                        <span key={i} className={styles.factor}>
                          {factor.factor}: {factor.impact}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {analysisMode === 'advanced' && mlInsights && activeTab === 'nlp' && (
          <div className={styles.nlpSection}>
            <h2>Natural Language Processing Analysis</h2>
            <div className={styles.nlpGrid}>
              <div className={styles.nlpCard}>
                <h3>Discovered Topics</h3>
                {mlInsights.nlp.topics.map((topic, idx) => (
                  <div key={idx} className={styles.topic}>
                    <h4>Topic {topic.id + 1}</h4>
                    <div className={styles.topicWords}>
                      {topic.words.map((word, i) => (
                        <span key={i} className={styles.topicWord}>{word}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={styles.nlpCard}>
                <h3>Key Entities</h3>
                <div className={styles.entitySection}>
                  <h4>Organizations ({mlInsights.nlp.entities.organizations.length})</h4>
                  <div className={styles.entityList}>
                    {mlInsights.nlp.entities.organizations.slice(0, 10).map((org, i) => (
                      <span key={i} className={styles.entity}>{org}</span>
                    ))}
                  </div>
                </div>
                <div className={styles.entitySection}>
                  <h4>People ({mlInsights.nlp.entities.people.length})</h4>
                  <div className={styles.entityList}>
                    {mlInsights.nlp.entities.people.slice(0, 10).map((person, i) => (
                      <span key={i} className={styles.entity}>{person}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {analysisMode === 'advanced' && activeTab === 'network' && (
          <div className={styles.networkSection}>
            <h2>Knowledge Graph</h2>
            <p className={styles.description}>
              Interactive network showing relationships between case studies, dimensions, institutions, keywords, and people
            </p>
            <div className={styles.networkContainer}>
              <KnowledgeGraph 
                caseStudies={caseStudies} 
                width={1200} 
                height={700} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}