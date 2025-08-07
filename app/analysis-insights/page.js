'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaNetworkWired, 
  FaBook, 
  FaProjectDiagram,
  FaBrain, 
  FaDownload, 
  FaSearch,
  FaLightbulb,
  FaExclamationTriangle,
  FaArrowUp,
  FaClipboard,
  FaSyncAlt,
  FaChartLine,
  FaChartBar,
  FaMicroscope
} from 'react-icons/fa';
import dynamic from 'next/dynamic';
import styles from './analysis-insights.module.css';
import CaseStudyAnalyzer from '../../utils/case-study-analyzer';

// Dynamic import for network visualization
const NetworkVisualization = dynamic(() => import('../../components/charts/NetworkVisualization'), { ssr: false });

export default function ResearchIntelligenceHub() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [bibliography, setBibliography] = useState([]);
  const [networkGraph, setNetworkGraph] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDimension, setSelectedDimension] = useState('all');
  const [crossReferences, setCrossReferences] = useState([]);
  const [knowledgeGaps, setKnowledgeGaps] = useState([]);
  const [patternAnalysis, setPatternAnalysis] = useState(null);

  useEffect(() => {
    loadResearchData();
  }, []);

  useEffect(() => {
    if (caseStudies.length > 0 && bibliography.length > 0) {
      analyzeResearchLandscape();
    }
  }, [caseStudies, bibliography, selectedDimension]);

  const loadResearchData = async () => {
    try {
      setLoading(true);
      
      // Load case studies, bibliography, and network graph in parallel
      const [studiesRes, bibRes, insightsRes] = await Promise.all([
        fetch('/api/case-studies'),
        fetch('/api/bibliography'),
        fetch('/api/insights?type=comprehensive')
      ]);
      
      // Check for authentication errors
      if (studiesRes.status === 401 || bibRes.status === 401 || insightsRes.status === 401) {
        console.log('Authentication required - some features may be limited');
      }
      
      const [studiesData, bibData, insightsData] = await Promise.all([
        studiesRes.ok ? studiesRes.json() : { caseStudies: [] },
        bibRes.ok ? bibRes.json() : { papers: [] },
        insightsRes.ok ? insightsRes.json() : { insights: [] }
      ]);
      
      // Process case studies
      const processedStudies = (studiesData.caseStudies || []).map(study => {
        const resilientDims = study['Resilient Dimensions '] || study.Dimensions || [];
        const keywords = study['Key Words '] || study.Keywords || [];
        
        return {
          ...study,
          Title: study['Case Study Title'] || study.Title || 'Untitled',
          Description: study['Short Description'] || study.Description || '',
          Dimensions: Array.isArray(resilientDims) ? resilientDims.join(', ') : resilientDims,
          Keywords: Array.isArray(keywords) ? keywords.join(', ') : keywords,
          dimensionsList: Array.isArray(resilientDims) ? resilientDims : 
                        typeof resilientDims === 'string' ? resilientDims.split(',').map(d => d.trim()).filter(Boolean) : [],
          keywordsList: Array.isArray(keywords) ? keywords :
                       typeof keywords === 'string' ? keywords.split(',').map(k => k.trim()).filter(Boolean) : [],
          type: 'case-study'
        };
      });
      
      // Process bibliography
      const processedBib = (bibData.papers || []).map(paper => ({
        ...paper,
        Title: paper.Name || paper.Title || 'Untitled Paper',
        dimensionsList: paper.Dimension ? [paper.Dimension] : [],
        keywordsList: paper.Keywords ? 
          (typeof paper.Keywords === 'string' ? paper.Keywords.split(',').map(k => k.trim()).filter(Boolean) : []) : [],
        type: 'paper'
      }));
      
      setCaseStudies(processedStudies);
      setBibliography(processedBib);
      setInsights(insightsData);
      
      // Build network graph from our data
      const networkData = buildNetworkGraph(processedStudies, processedBib);
      setNetworkGraph(networkData);
      
      // Run pattern extraction on case studies
      if (processedStudies.length > 0) {
        const analyzer = new CaseStudyAnalyzer(processedStudies);
        const analysis = analyzer.runComprehensiveAnalysis();
        setPatternAnalysis(analysis);
      }
      
    } catch (error) {
      console.error('Error loading research data:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildNetworkGraph = (studies, papers) => {
    const nodes = [];
    const edges = [];
    const nodeMap = new Map();
    
    // Add case study nodes
    studies.forEach(study => {
      const nodeId = `study_${study.id || Math.random()}`;
      const node = {
        id: nodeId,
        label: study.Title.substring(0, 30) + (study.Title.length > 30 ? '...' : ''),
        type: 'case_study',
        group: 'case_study',
        title: study.Title,
        degree: 0
      };
      nodes.push(node);
      nodeMap.set(nodeId, node);
      
      // Connect to dimensions
      study.dimensionsList.forEach(dim => {
        const dimId = `dim_${dim}`;
        if (!nodeMap.has(dimId)) {
          const dimNode = {
            id: dimId,
            label: dim.substring(0, 20),
            type: 'dimension',
            group: 'dimension',
            title: dim,
            degree: 0
          };
          nodes.push(dimNode);
          nodeMap.set(dimId, dimNode);
        }
        
        edges.push({
          source: nodeId,
          target: dimId,
          weight: 2,
          type: 'has_dimension'
        });
        
        nodeMap.get(nodeId).degree++;
        nodeMap.get(dimId).degree++;
      });
      
      // Connect to keywords
      study.keywordsList.forEach(keyword => {
        const keyId = `key_${keyword}`;
        if (!nodeMap.has(keyId)) {
          const keyNode = {
            id: keyId,
            label: keyword.substring(0, 15),
            type: 'keyword',
            group: 'keyword',
            title: keyword,
            degree: 0
          };
          nodes.push(keyNode);
          nodeMap.set(keyId, keyNode);
        }
        
        edges.push({
          source: nodeId,
          target: keyId,
          weight: 1,
          type: 'has_keyword'
        });
        
        nodeMap.get(nodeId).degree++;
        nodeMap.get(keyId).degree++;
      });
    });
    
    // Add paper nodes and connect them
    papers.forEach(paper => {
      const nodeId = `paper_${paper.id || Math.random()}`;
      const node = {
        id: nodeId,
        label: (paper.Title || '').substring(0, 30) + ((paper.Title || '').length > 30 ? '...' : ''),
        type: 'paper',
        group: 'paper',
        title: paper.Title,
        degree: 0
      };
      nodes.push(node);
      nodeMap.set(nodeId, node);
      
      // Connect to dimensions
      paper.dimensionsList.forEach(dim => {
        const dimId = `dim_${dim}`;
        if (nodeMap.has(dimId)) {
          edges.push({
            source: nodeId,
            target: dimId,
            weight: 2,
            type: 'addresses_dimension'
          });
          
          nodeMap.get(nodeId).degree++;
          nodeMap.get(dimId).degree++;
        }
      });
      
      // Connect papers to keywords
      paper.keywordsList.forEach(keyword => {
        const keyId = `key_${keyword}`;
        if (nodeMap.has(keyId)) {
          edges.push({
            source: nodeId,
            target: keyId,
            weight: 1,
            type: 'has_keyword'
          });
          
          nodeMap.get(nodeId).degree++;
          nodeMap.get(keyId).degree++;
        }
      });
    });
    
    // Calculate stats
    const stats = {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      caseStudies: studies.length,
      papers: papers.length,
      dimensions: nodes.filter(n => n.type === 'dimension').length,
      keywords: nodes.filter(n => n.type === 'keyword').length,
      avgDegree: nodes.reduce((sum, n) => sum + n.degree, 0) / nodes.length
    };
    
    return {
      graph: { nodes, edges },
      stats
    };
  };

  const analyzeResearchLandscape = () => {
    // Cross-reference case studies with bibliography
    const references = findCrossReferences(caseStudies, bibliography);
    setCrossReferences(references);
    
    // Identify knowledge gaps
    const gaps = identifyKnowledgeGaps(caseStudies, bibliography);
    setKnowledgeGaps(gaps);
    
    // Update network if we have data
    if (caseStudies.length > 0 || bibliography.length > 0) {
      const networkData = buildNetworkGraph(caseStudies, bibliography);
      setNetworkGraph(networkData);
    }
  };
  
  const findCrossReferences = (studies, papers) => {
    const refs = [];
    
    studies.forEach(study => {
      const relatedPapers = papers.filter(paper => {
        // Check for keyword overlap
        const studyKeywords = study.keywordsList.map(k => k.toLowerCase());
        const paperKeywords = paper.keywordsList.map(k => k.toLowerCase());
        const keywordOverlap = studyKeywords.some(sk => 
          paperKeywords.some(pk => pk.includes(sk) || sk.includes(pk))
        );
        
        // Check for dimension match
        const dimensionMatch = study.dimensionsList.some(d => 
          paper.dimensionsList.includes(d)
        );
        
        return keywordOverlap || dimensionMatch;
      });
      
      if (relatedPapers.length > 0) {
        refs.push({
          study: study.Title,
          studyType: 'Case Study',
          relatedPapers: relatedPapers.slice(0, 3),
          connectionStrength: relatedPapers.length
        });
      }
    });
    
    return refs.sort((a, b) => b.connectionStrength - a.connectionStrength).slice(0, 10);
  };
  
  const identifyKnowledgeGaps = (studies, papers) => {
    const studyDimensions = new Set();
    const paperDimensions = new Set();
    
    studies.forEach(s => s.dimensionsList.forEach(d => studyDimensions.add(d)));
    papers.forEach(p => p.dimensionsList.forEach(d => paperDimensions.add(d)));
    
    // Find dimensions with limited case study coverage
    const gaps = [];
    paperDimensions.forEach(dim => {
      const studyCount = studies.filter(s => s.dimensionsList.includes(dim)).length;
      const paperCount = papers.filter(p => p.dimensionsList.includes(dim)).length;
      
      if (paperCount > studyCount && studyCount < 3) {
        gaps.push({
          dimension: dim,
          paperCount,
          studyCount,
          gapScore: paperCount - studyCount,
          description: `${dim} has strong theoretical foundation (${paperCount} papers) but limited practical validation (${studyCount} case studies)`
        });
      }
    });
    
    return gaps.sort((a, b) => b.gapScore - a.gapScore).slice(0, 8);
  };

  const getFilteredData = () => {
    let filteredStudies = caseStudies;
    let filteredPapers = bibliography;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredStudies = filteredStudies.filter(s => 
        s.Title.toLowerCase().includes(term) ||
        s.Description.toLowerCase().includes(term)
      );
      filteredPapers = filteredPapers.filter(p =>
        p.Title.toLowerCase().includes(term) ||
        (p.Abstract || '').toLowerCase().includes(term)
      );
    }
    
    if (selectedDimension !== 'all') {
      filteredStudies = filteredStudies.filter(s => 
        s.dimensionsList.includes(selectedDimension)
      );
      filteredPapers = filteredPapers.filter(p =>
        p.dimensionsList.includes(selectedDimension)
      );
    }
    
    return { filteredStudies, filteredPapers };
  };
  
  const { filteredStudies, filteredPapers } = getFilteredData();
  
  const dimensions = [
    'Environmental Stewardship & Resource Security',
    'Social Equity & Well-being',
    'Healthcare System Capacity & Integration',
    'Economic Stability & Crisis Protection',
    'Governance Coordination & Community Leadership',
    'Information Infrastructure & Communication',
    'Scientific Knowledge & Innovation Systems'
  ];

  const refreshData = async () => {
    await loadResearchData();
  };

  const exportReport = () => {
    console.log('Generating comprehensive research report...');
    // TODO: Implement PDF export of research synthesis
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading research intelligence...</p>
        <p className={styles.loadingSubtext}>Synthesizing case studies with comprehensive bibliography</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Research Intelligence Hub</h1>
          <p className={styles.subtitle}>
            Comprehensive synthesis of {caseStudies.length} case studies and {bibliography.length} research papers
          </p>
        </div>
        
        <div className={styles.headerActions}>
          <button className={styles.refreshButton} onClick={refreshData}>
            <FaSyncAlt /> Refresh
          </button>
          <button className={styles.exportButton} onClick={exportReport}>
            <FaDownload /> Export Report
          </button>
        </div>
      </div>
      
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <FaSearch />
          <input 
            type="text"
            placeholder="Search across case studies and bibliography..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select 
          value={selectedDimension}
          onChange={(e) => setSelectedDimension(e.target.value)}
          className={styles.dimensionFilter}
        >
          <option value="all">All Dimensions</option>
          {dimensions.map(dim => (
            <option key={dim} value={dim}>{dim}</option>
          ))}
        </select>
      </div>

      <div className={styles.viewTabs}>
        {[
          { id: 'overview', label: 'Research Overview', icon: FaClipboard },
          { id: 'network', label: 'Knowledge Network', icon: FaNetworkWired },
          { id: 'patterns', label: 'Pattern Analysis', icon: FaMicroscope },
          { id: 'synthesis', label: 'Research Synthesis', icon: FaBook },
          { id: 'gaps', label: 'Knowledge Gaps', icon: FaExclamationTriangle },
          { id: 'insights', label: 'AI Insights', icon: FaBrain }
        ].map(tab => (
          <button
            key={tab.id}
            className={`${styles.viewTab} ${activeView === tab.id ? styles.active : ''}`}
            onClick={() => setActiveView(tab.id)}
          >
            <tab.icon />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {activeView === 'overview' && (
          <motion.div 
            className={styles.overviewContent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Research Portfolio Metrics */}
            <div className={styles.metricsGrid}>
              <div className={styles.metricCard}>
                <div className={styles.metricValue}>{filteredStudies.length}</div>
                <div className={styles.metricLabel}>Case Studies</div>
                <div className={styles.metricSubtext}>Practical implementations</div>
              </div>
              
              <div className={styles.metricCard}>
                <div className={styles.metricValue}>{filteredPapers.length}</div>
                <div className={styles.metricLabel}>Research Papers</div>
                <div className={styles.metricSubtext}>Theoretical foundation</div>
              </div>
              
              <div className={styles.metricCard}>
                <div className={styles.metricValue}>{crossReferences.length}</div>
                <div className={styles.metricLabel}>Cross-References</div>
                <div className={styles.metricSubtext}>Theory-practice links</div>
              </div>
              
              <div className={styles.metricCard}>
                <div className={styles.metricValue}>{knowledgeGaps.length}</div>
                <div className={styles.metricLabel}>Knowledge Gaps</div>
                <div className={styles.metricSubtext}>Research opportunities</div>
              </div>
            </div>

            {/* Research Synthesis Summary */}
            <div className={styles.synthesisOverview}>
              <h2><FaBook /> Research Landscape Overview</h2>
              <div className={styles.landscapeGrid}>
                <div className={styles.landscapeCard}>
                  <h3>Theoretical Foundation</h3>
                  <p>
                    Our knowledge base includes <strong>{bibliography.length} peer-reviewed papers</strong> spanning 
                    all 7 resilience dimensions, providing comprehensive theoretical grounding from leading 
                    researchers and institutions worldwide.
                  </p>
                </div>

                <div className={styles.landscapeCard}>
                  <h3>Practical Implementation</h3>
                  <p>
                    <strong>{caseStudies.length} case studies</strong> demonstrate real-world applications 
                    of resilience principles, offering evidence of what works in practice across diverse 
                    contexts and communities.
                  </p>
                </div>

                <div className={styles.landscapeCard}>
                  <h3>Research Integration</h3>
                  <p>
                    <strong>{crossReferences.length} cross-references</strong> identified between theoretical 
                    papers and practical case studies, highlighting areas where research translates 
                    effectively into action.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeView === 'patterns' && patternAnalysis && (
          <motion.div 
            className={styles.patternsContent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2><FaMicroscope /> Pattern Analysis: Factual Extraction from {patternAnalysis.metadata.totalStudies} Case Studies</h2>
            <p className={styles.methodNote}>
              All patterns extracted using transparent, reproducible methods without interpretation
            </p>

            <div className={styles.analysisGrid}>
              {/* Research Questions */}
              <div className={styles.analysisCard}>
                <h3>Research Questions Identified</h3>
                <div className={styles.questionTypes}>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Descriptive:</span>
                    <span className={styles.statValue}>{patternAnalysis.researchQuestions.questionTypes.descriptive}</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Evaluative:</span>
                    <span className={styles.statValue}>{patternAnalysis.researchQuestions.questionTypes.evaluative}</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Analytical:</span>
                    <span className={styles.statValue}>{patternAnalysis.researchQuestions.questionTypes.analytical}</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Measurement:</span>
                    <span className={styles.statValue}>{patternAnalysis.researchQuestions.questionTypes.measurement}</span>
                  </div>
                </div>
                <p className={styles.note}>
                  {patternAnalysis.researchQuestions.totalWithExplicitQuestion} studies contain explicit research questions
                </p>
              </div>

              {/* Methodologies */}
              <div className={styles.analysisCard}>
                <h3>Research Methods Detected</h3>
                <div className={styles.methodsList}>
                  {Object.entries(patternAnalysis.methodologies.aggregateStats)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 8)
                    .map(([method, count]) => (
                      <div key={method} className={styles.methodItem}>
                        <span className={styles.methodName}>{method.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className={styles.methodCount}>{count} studies</span>
                      </div>
                    ))}
                </div>
                <p className={styles.note}>
                  Average methods per study: {patternAnalysis.methodologies.averageMethodsPerStudy}
                </p>
              </div>

              {/* Study Populations */}
              <div className={styles.analysisCard}>
                <h3>Study Populations</h3>
                <div className={styles.populationsList}>
                  {Object.entries(patternAnalysis.populations.aggregateStats)
                    .filter(([_, count]) => count > 0)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 8)
                    .map(([population, count]) => (
                      <div key={population} className={styles.populationItem}>
                        <span className={styles.populationName}>{population.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <div className={styles.populationBar}>
                          <div 
                            className={styles.populationFill} 
                            style={{width: `${(count / patternAnalysis.metadata.totalStudies) * 100}%`}}
                          />
                          <span className={styles.populationCount}>{count}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Resilience Mechanisms */}
              <div className={styles.analysisCard}>
                <h3>Resilience Mechanisms</h3>
                <div className={styles.mechanismsList}>
                  {Object.entries(patternAnalysis.resilienceMechanisms.aggregateStats)
                    .sort((a, b) => b[1] - a[1])
                    .map(([mechanism, count]) => (
                      <div key={mechanism} className={styles.mechanismItem}>
                        <span className={styles.mechanismName}>{mechanism.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className={styles.mechanismPercent}>
                          {Math.round((count / patternAnalysis.metadata.totalStudies) * 100)}%
                        </span>
                      </div>
                    ))}
                </div>
                <p className={styles.note}>
                  {patternAnalysis.resilienceMechanisms.studiesWithExplicitRelevance} studies provide explicit resilience relevance
                </p>
              </div>

              {/* Co-occurrence Patterns */}
              <div className={styles.analysisCard}>
                <h3>Dimension Co-occurrences</h3>
                <div className={styles.coOccurrenceList}>
                  {patternAnalysis.coOccurrences.dimensionPairs.slice(0, 6).map((pair, idx) => (
                    <div key={idx} className={styles.coOccurrenceItem}>
                      <span className={styles.pairName}>{pair.pair}</span>
                      <span className={styles.pairStats}>
                        {pair.count} studies ({pair.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Completeness */}
              <div className={styles.analysisCard}>
                <h3>Data Completeness</h3>
                <div className={styles.completenessList}>
                  {Object.entries(patternAnalysis.descriptiveStats.dataCompleteness).map(([field, stats]) => (
                    <div key={field} className={styles.completenessItem}>
                      <span className={styles.fieldName}>{field}</span>
                      <div className={styles.completenessBar}>
                        <div 
                          className={styles.completenessFill} 
                          style={{
                            width: `${stats.percentComplete}%`,
                            backgroundColor: stats.percentComplete > 80 ? '#4caf50' : 
                                           stats.percentComplete > 60 ? '#ff9800' : '#f44336'
                          }}
                        />
                        <span className={styles.completenessPercent}>{stats.percentComplete}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Temporal Patterns */}
              <div className={styles.analysisCard}>
                <h3>Temporal Distribution</h3>
                <div className={styles.temporalList}>
                  {Object.entries(patternAnalysis.temporalPatterns.studiesByYear)
                    .sort((a, b) => b[0] - a[0])
                    .slice(0, 5)
                    .map(([year, count]) => (
                      <div key={year} className={styles.temporalItem}>
                        <span className={styles.year}>{year}</span>
                        <span className={styles.yearCount}>{count} studies</span>
                      </div>
                    ))}
                </div>
                <p className={styles.note}>
                  Average: {patternAnalysis.temporalPatterns.averageStudiesPerYear} studies/year
                </p>
              </div>

              {/* Study Types Distribution */}
              <div className={styles.analysisCard}>
                <h3>Study Type Distribution</h3>
                <div className={styles.typesList}>
                  {patternAnalysis.descriptiveStats.studyTypes.map(type => (
                    <div key={type.item} className={styles.typeItem}>
                      <span className={styles.typeName}>{type.item || 'Unspecified'}</span>
                      <span className={styles.typeStats}>
                        {type.count} ({type.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeView === 'network' && networkGraph && (
          <motion.div 
            className={styles.networkContent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2><FaNetworkWired /> Knowledge Network</h2>
            <p className={styles.networkDescription}>
              Interactive network showing relationships between case studies, dimensions, people, and research themes.
              Node size indicates connection strength, colors represent different entity types.
            </p>
            <div className={styles.networkContainer}>
              <NetworkVisualization graph={networkGraph} />
            </div>
            
            <div className={styles.networkStats}>
              <div className={styles.networkStat}>
                <span className={styles.statValue}>{networkGraph.stats?.totalNodes || 0}</span>
                <span className={styles.statLabel}>Nodes</span>
              </div>
              <div className={styles.networkStat}>
                <span className={styles.statValue}>{networkGraph.stats?.totalEdges || 0}</span>
                <span className={styles.statLabel}>Connections</span>
              </div>
              <div className={styles.networkStat}>
                <span className={styles.statValue}>{networkGraph.stats?.avgDegree || 0}</span>
                <span className={styles.statLabel}>Avg Connections</span>
              </div>
            </div>
          </motion.div>
        )}

        {activeView === 'synthesis' && (
          <motion.div 
            className={styles.synthesisContent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2><FaProjectDiagram /> Theory-Practice Integration</h2>
            
            <div className={styles.crossReferencesSection}>
              <h3>Strongest Research Connections</h3>
              <div className={styles.crossRefList}>
                {crossReferences.slice(0, 6).map((ref, idx) => (
                  <div key={idx} className={styles.crossRefCard}>
                    <div className={styles.crossRefHeader}>
                      <h4>{ref.study}</h4>
                      <span className={styles.connectionBadge}>
                        {ref.connectionStrength} connections
                      </span>
                    </div>
                    <div className={styles.relatedPapers}>
                      {ref.relatedPapers.map((paper, pidx) => (
                        <div key={pidx} className={styles.paperRef}>
                          <strong>{paper.Name}</strong>
                          <span>{paper.Authors} ({paper.Year})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeView === 'gaps' && (
          <motion.div 
            className={styles.gapsContent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2><FaExclamationTriangle /> Knowledge Gaps & Research Opportunities</h2>
            
            <div className={styles.gapsGrid}>
              {knowledgeGaps.map((gap, idx) => (
                <div key={idx} className={styles.gapCard}>
                  <div className={styles.gapHeader}>
                    <h3>{gap.dimension}</h3>
                    <div className={styles.gapScore}>
                      Gap Score: {gap.gapScore}
                    </div>
                  </div>
                  
                  <div className={styles.gapStats}>
                    <div className={styles.gapStat}>
                      <span className={styles.gapValue}>{gap.paperCount}</span>
                      <span className={styles.gapLabel}>Research Papers</span>
                    </div>
                    <div className={styles.gapStat}>
                      <span className={styles.gapValue}>{gap.studyCount}</span>
                      <span className={styles.gapLabel}>Case Studies</span>
                    </div>
                  </div>
                  
                  <p className={styles.gapDescription}>{gap.description}</p>
                  
                  <div className={styles.gapActions}>
                    <span className={styles.researchOpportunity}>Research Opportunity</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeView === 'insights' && (
          <motion.div 
            className={styles.aiInsightsContent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={styles.insightsHeader}>
              <h2><FaBrain /> AI-Powered Research Insights</h2>
              <p>Comprehensive analysis of research patterns and opportunities</p>
            </div>

            <div className={styles.insightsGrid}>
              {/* Deep Case Study Analysis */}
              <div className={styles.insightCard}>
                <h3>Case Study Coverage Analysis</h3>
                <p>
                  Analyzing {caseStudies.length} case studies across {new Set(caseStudies.flatMap(s => s.dimensionsList)).size} resilience dimensions.
                </p>
                <ul style={{listStyle: 'none', padding: 0, marginTop: '1rem'}}>
                  {(() => {
                    const dimCounts = {};
                    caseStudies.forEach(s => {
                      s.dimensionsList.forEach(d => {
                        dimCounts[d] = (dimCounts[d] || 0) + 1;
                      });
                    });
                    return Object.entries(dimCounts)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 5)
                      .map(([dim, count]) => (
                        <li key={dim} style={{padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                          <strong>{dim}:</strong> {count} studies ({Math.round(count/caseStudies.length * 100)}%)
                        </li>
                      ));
                  })()}
                </ul>
              </div>

              {/* Research Methods Distribution */}
              <div className={styles.insightCard}>
                <h3>Research Methodology Patterns</h3>
                <p>
                  Study types represented in the portfolio:
                </p>
                <ul style={{listStyle: 'none', padding: 0, marginTop: '1rem'}}>
                  {(() => {
                    const typeCounts = {};
                    caseStudies.forEach(s => {
                      const type = s['Study Type '] || 'Unspecified';
                      typeCounts[type] = (typeCounts[type] || 0) + 1;
                    });
                    return Object.entries(typeCounts)
                      .sort((a, b) => b[1] - a[1])
                      .map(([type, count]) => (
                        <li key={type} style={{padding: '0.5rem 0'}}>
                          <strong>{type}:</strong> {count} studies
                        </li>
                      ));
                  })()}
                </ul>
              </div>

              {/* Geographic Distribution */}
              <div className={styles.insightCard}>
                <h3>Geographic Coverage</h3>
                <p>
                  Research spans multiple regions with focus areas:
                </p>
                <ul style={{listStyle: 'none', padding: 0, marginTop: '1rem'}}>
                  {(() => {
                    const geoCounts = {};
                    caseStudies.forEach(s => {
                      s.keywordsList.forEach(k => {
                        if (k.includes('States') || k.includes('Africa') || k.includes('Asia') || 
                            k.includes('Europe') || k.includes('America')) {
                          geoCounts[k] = (geoCounts[k] || 0) + 1;
                        }
                      });
                    });
                    return Object.entries(geoCounts)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 5)
                      .map(([region, count]) => (
                        <li key={region} style={{padding: '0.5rem 0'}}>
                          <strong>{region}:</strong> {count} studies
                        </li>
                      ));
                  })()}
                </ul>
              </div>

              {/* Network Density Analysis */}
              {networkGraph && (
                <div className={styles.insightCard}>
                  <h3>Knowledge Network Density</h3>
                  <p>
                    Network analysis reveals research interconnections:
                  </p>
                  <ul style={{listStyle: 'none', padding: 0, marginTop: '1rem'}}>
                    <li style={{padding: '0.5rem 0'}}>
                      <strong>Network Density:</strong> {(networkGraph.stats.totalEdges / (networkGraph.stats.totalNodes * (networkGraph.stats.totalNodes - 1) / 2) * 100).toFixed(2)}%
                    </li>
                    <li style={{padding: '0.5rem 0'}}>
                      <strong>Average Connections:</strong> {networkGraph.stats.avgDegree?.toFixed(1) || 0} per node
                    </li>
                    <li style={{padding: '0.5rem 0'}}>
                      <strong>Most Connected Dimensions:</strong> {networkGraph.stats.dimensions} dimension nodes linking {networkGraph.stats.caseStudies + networkGraph.stats.papers} research items
                    </li>
                  </ul>
                </div>
              )}

              {/* Theory-Practice Integration */}
              <div className={styles.insightCard}>
                <h3>Theory-Practice Integration</h3>
                <p>
                  Cross-reference analysis shows:
                </p>
                <ul style={{listStyle: 'none', padding: 0, marginTop: '1rem'}}>
                  <li style={{padding: '0.5rem 0'}}>
                    <strong>{crossReferences.length}</strong> case studies have direct theoretical foundations
                  </li>
                  <li style={{padding: '0.5rem 0'}}>
                    <strong>{Math.round(crossReferences.length / caseStudies.length * 100)}%</strong> of case studies linked to published research
                  </li>
                  <li style={{padding: '0.5rem 0'}}>
                    <strong>Average connections:</strong> {crossReferences.length > 0 ? 
                      (crossReferences.reduce((sum, r) => sum + r.connectionStrength, 0) / crossReferences.length).toFixed(1) : 0} papers per case study
                  </li>
                </ul>
              </div>

              {/* Research Opportunities */}
              <div className={styles.insightCard}>
                <h3>Strategic Research Opportunities</h3>
                <p>
                  Based on gap analysis and network patterns:
                </p>
                <ul style={{listStyle: 'none', padding: 0, marginTop: '1rem'}}>
                  {knowledgeGaps.slice(0, 3).map((gap, idx) => (
                    <li key={idx} style={{padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                      <strong>{gap.dimension}:</strong> Gap score of {gap.gapScore} 
                      <br />
                      <span style={{fontSize: '0.9em', opacity: 0.8}}>
                        {gap.paperCount} papers but only {gap.studyCount} case studies
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className={styles.strategicRecommendations}>
              <h3><FaChartLine /> Strategic Research Recommendations</h3>
              <div className={styles.recommendationsList}>
                <div className={styles.recommendationCard}>
                  <h4>Prioritize Gap Areas</h4>
                  <p>Focus new case study development in dimensions with strong theoretical foundations but limited practical validation.</p>
                </div>
                <div className={styles.recommendationCard}>
                  <h4>Strengthen Cross-References</h4>
                  <p>Enhance connections between existing papers and case studies through comparative analysis.</p>
                </div>
                <div className={styles.recommendationCard}>
                  <h4>Expand Network Analysis</h4>
                  <p>Leverage the knowledge network to identify collaboration opportunities and research synergies.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}