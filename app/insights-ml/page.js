'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import advancedNLP from '../../utils/advanced-nlp';
import mlInsightsEngine from '../../utils/ml-insights-engine';
import styles from './insights-ml.module.css';

// Dynamic imports for heavy visualizations
const NetworkGraph = dynamic(() => import('../../components/NetworkGraph'), { 
  ssr: false,
  loading: () => <div className={styles.loading}>Loading visualization...</div>
});

export default function MLInsightsPage() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchAndAnalyze();
  }, []);

  const fetchAndAnalyze = async () => {
    try {
      setLoading(true);
      
      // Fetch case studies
      const response = await fetch('/api/case-studies');
      const data = await response.json();
      const studies = data.caseStudies || [];
      setCaseStudies(studies);
      
      if (studies.length > 0) {
        setProcessing(true);
        
        // Initialize ML engine
        await mlInsightsEngine.initialize(studies);
        
        // Generate insights
        const mlInsights = mlInsightsEngine.generateInsights();
        
        // Process NLP insights
        const nlpInsights = processNLPInsights(studies);
        
        setInsights({
          ...mlInsights,
          nlp: nlpInsights,
          summary: generateExecutiveSummary(mlInsights, nlpInsights, studies)
        });
        
        setProcessing(false);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
      setProcessing(false);
    }
  };

  const processNLPInsights = (studies) => {
    // Extract topics across all studies
    const allTexts = studies.map(s => 
      `${s.Title || ''} ${s.Description || ''} ${s.Focus || ''}`
    );
    
    const topics = advancedNLP.extractTopics(allTexts, 5, 8);
    
    // Extract entities from all studies
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
    
    // Calculate enhanced TF-IDF
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
    
    // Key findings from ML analysis
    if (mlInsights.clusters && mlInsights.clusters.length > 0) {
      summary.keyFindings.push(
        `Research naturally groups into ${mlInsights.clusters.length} distinct clusters based on content and approach`
      );
    }
    
    if (mlInsights.anomalies && mlInsights.anomalies.length > 0) {
      summary.keyFindings.push(
        `${mlInsights.anomalies.length} studies show unusual patterns that warrant further investigation`
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
    
    // Add recommendations
    if (mlInsights.recommendations) {
      summary.recommendations = mlInsights.recommendations;
    }
    
    return summary;
  };

  const findSimilarStudies = async (studyId) => {
    if (!insights) return;
    
    const similar = mlInsightsEngine.models.similarity.findSimilar(studyId, 5);
    return similar;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <h2>Initializing ML Analysis Engine...</h2>
        <p>Processing {caseStudies.length} case studies</p>
      </div>
    );
  }

  if (processing) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <h2>Running Advanced Analysis...</h2>
        <p>Applying machine learning models</p>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className={styles.container}>
        <h1>ML-Powered Insights</h1>
        <div className={styles.error}>No insights available</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>ML-Powered Research Insights</h1>
        <p className={styles.subtitle}>
          Advanced analysis of {insights.summary.totalStudies} case studies using machine learning
        </p>
      </div>

      <div className={styles.tabs}>
        <button 
          className={activeTab === 'overview' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('overview')}
        >
          Executive Summary
        </button>
        <button 
          className={activeTab === 'clusters' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('clusters')}
        >
          Study Clusters
        </button>
        <button 
          className={activeTab === 'patterns' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('patterns')}
        >
          Patterns & Trends
        </button>
        <button 
          className={activeTab === 'predictions' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('predictions')}
        >
          Predictions
        </button>
        <button 
          className={activeTab === 'anomalies' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('anomalies')}
        >
          Anomalies
        </button>
        <button 
          className={activeTab === 'network' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('network')}
        >
          Knowledge Graph
        </button>
        <button 
          className={activeTab === 'nlp' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('nlp')}
        >
          NLP Analysis
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'overview' && (
          <div className={styles.overviewSection}>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryCard}>
                <h3>Key Findings</h3>
                <ul>
                  {insights.summary.keyFindings.map((finding, idx) => (
                    <li key={idx}>{finding}</li>
                  ))}
                </ul>
              </div>
              
              <div className={styles.summaryCard}>
                <h3>Recommendations</h3>
                {insights.summary.recommendations.map((rec, idx) => (
                  <div key={idx} className={styles.recommendation}>
                    <h4>{rec.title}</h4>
                    <p>{rec.description}</p>
                    <span className={styles[rec.priority]}>
                      {rec.priority} priority
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.metricsGrid}>
              <div className={styles.metricCard}>
                <div className={styles.metricValue}>
                  {insights.clusters.length}
                </div>
                <div className={styles.metricLabel}>Research Clusters</div>
              </div>
              <div className={styles.metricCard}>
                <div className={styles.metricValue}>
                  {insights.patterns.length}
                </div>
                <div className={styles.metricLabel}>Patterns Detected</div>
              </div>
              <div className={styles.metricCard}>
                <div className={styles.metricValue}>
                  {insights.anomalies.length}
                </div>
                <div className={styles.metricLabel}>Anomalies Found</div>
              </div>
              <div className={styles.metricCard}>
                <div className={styles.metricValue}>
                  {Math.round(
                    insights.predictions.filter(p => p.prediction.probability > 0.7).length / 
                    insights.predictions.length * 100
                  )}%
                </div>
                <div className={styles.metricLabel}>High Success Rate</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'clusters' && (
          <div className={styles.clustersSection}>
            <h2>Study Clusters</h2>
            <p className={styles.description}>
              Machine learning has identified {insights.clusters.length} distinct groups of studies
            </p>
            
            <div className={styles.clusterGrid}>
              {insights.clusters.map((cluster, idx) => (
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
                    <h4>Studies in this cluster:</h4>
                    {cluster.studies.slice(0, 3).map((study, i) => (
                      <div key={i} className={styles.studyItem}>
                        {study.Title}
                      </div>
                    ))}
                    {cluster.studies.length > 3 && (
                      <div className={styles.moreStudies}>
                        +{cluster.studies.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'patterns' && (
          <div className={styles.patternsSection}>
            <h2>Patterns & Trends</h2>
            
            {insights.patterns.map((pattern, idx) => (
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
            
            {insights.trends.map((trend, idx) => (
              <div key={idx} className={styles.trendCard}>
                <h3>{trend.title}</h3>
                <p>{trend.description}</p>
                
                {trend.type === 'growing_topics' && (
                  <div className={styles.growthList}>
                    {trend.data.map((item, i) => (
                      <div key={i} className={styles.growthItem}>
                        <span className={styles.keyword}>{item.keyword}</span>
                        <span className={styles.growth}>
                          {Math.round(item.growth * 100)}% growth
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'predictions' && (
          <div className={styles.predictionsSection}>
            <h2>Success Predictions</h2>
            <p className={styles.description}>
              ML-based predictions of intervention success probability
            </p>
            
            <div className={styles.predictionList}>
              {insights.predictions
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
                      <h5>Contributing Factors:</h5>
                      {item.prediction.factors.map((factor, i) => (
                        <div key={i} className={styles.factor}>
                          <span>{factor.factor}</span>
                          <span className={styles.impact}>{factor.impact}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className={styles.confidence}>
                      Confidence: {Math.round(item.prediction.confidence * 100)}%
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'anomalies' && (
          <div className={styles.anomaliesSection}>
            <h2>Anomaly Detection</h2>
            <p className={styles.description}>
              Studies with unusual patterns that may warrant special attention
            </p>
            
            {insights.anomalies.length === 0 ? (
              <div className={styles.noAnomalies}>
                No significant anomalies detected
              </div>
            ) : (
              <div className={styles.anomalyList}>
                {insights.anomalies.map((anomaly, idx) => (
                  <div key={idx} className={styles.anomalyCard}>
                    <h4>{anomaly.study.Title}</h4>
                    <div className={styles.anomalyScore}>
                      Anomaly Score: {anomaly.totalScore.toFixed(2)}
                    </div>
                    
                    <div className={styles.anomalyDetails}>
                      <h5>Unusual Features:</h5>
                      {Object.entries(anomaly.anomalyScores).map(([feature, score]) => (
                        <div key={feature} className={styles.anomalyFeature}>
                          <span>{feature}</span>
                          <span className={styles.zScore}>z-score: {score.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <p className={styles.explanation}>{anomaly.explanation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'network' && (
          <div className={styles.networkSection}>
            <h2>Knowledge Graph</h2>
            <p className={styles.description}>
              Interactive network showing relationships between studies, dimensions, and concepts
            </p>
            
            <div className={styles.networkContainer}>
              <div className={styles.networkPlaceholder}>
                <p>Network visualization would appear here</p>
                <p>Showing connections between:</p>
                <ul>
                  <li>{caseStudies.length} Case Studies</li>
                  <li>{insights.nlp.entities.organizations.length} Organizations</li>
                  <li>{insights.nlp.entities.people.length} People</li>
                  <li>{new Set(caseStudies.flatMap(s => 
                    s.Dimensions ? s.Dimensions.split(',').map(d => d.trim()) : []
                  )).size} Dimensions</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'nlp' && (
          <div className={styles.nlpSection}>
            <h2>Natural Language Processing Analysis</h2>
            
            <div className={styles.nlpGrid}>
              <div className={styles.nlpCard}>
                <h3>Discovered Topics</h3>
                {insights.nlp.topics.map((topic, idx) => (
                  <div key={idx} className={styles.topic}>
                    <h4>Topic {topic.id + 1}</h4>
                    <div className={styles.topicWords}>
                      {topic.words.map((word, i) => (
                        <span key={i} className={styles.topicWord}>{word}</span>
                      ))}
                    </div>
                    <div className={styles.topicDocs}>
                      {topic.documents.length} documents
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={styles.nlpCard}>
                <h3>Key Entities</h3>
                
                <div className={styles.entitySection}>
                  <h4>Organizations ({insights.nlp.entities.organizations.length})</h4>
                  <div className={styles.entityList}>
                    {insights.nlp.entities.organizations.slice(0, 10).map((org, i) => (
                      <span key={i} className={styles.entity}>{org}</span>
                    ))}
                  </div>
                </div>
                
                <div className={styles.entitySection}>
                  <h4>People ({insights.nlp.entities.people.length})</h4>
                  <div className={styles.entityList}>
                    {insights.nlp.entities.people.slice(0, 10).map((person, i) => (
                      <span key={i} className={styles.entity}>{person}</span>
                    ))}
                  </div>
                </div>
                
                <div className={styles.entitySection}>
                  <h4>Methodologies ({insights.nlp.entities.methodologies.length})</h4>
                  <div className={styles.entityList}>
                    {insights.nlp.entities.methodologies.slice(0, 10).map((method, i) => (
                      <span key={i} className={styles.entity}>{method}</span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className={styles.nlpCard}>
                <h3>Top Keywords (TF-IDF)</h3>
                <div className={styles.keywordList}>
                  {insights.nlp.keywords.slice(0, 20).map(([keyword, score], idx) => (
                    <div key={idx} className={styles.keywordItem}>
                      <span className={styles.keywordText}>{keyword}</span>
                      <div className={styles.keywordBar}>
                        <div 
                          className={styles.keywordFill}
                          style={{ 
                            width: `${(score / insights.nlp.keywords[0][1]) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}