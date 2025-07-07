// Core insights engine that combines all analysis components

import { extractThemes, compareThemes, generateRecommendations } from './theme-extractor.js';
import { clusterCaseStudies, detectPatterns, findSimilarCases } from './pattern-analyzer.js';
import { generateOutcomeInsights, trackOutcomeTrends } from './outcome-tracker.js';

/**
 * Main insights engine class
 */
export class InsightsEngine {
  constructor() {
    this.caseStudies = [];
    this.themes = {};
    this.patterns = {};
    this.outcomes = {};
    this.clusters = [];
    this.knowledgeGraph = { nodes: [], edges: [] };
  }

  /**
   * Initialize engine with case studies data
   */
  async initialize(caseStudies) {
    this.caseStudies = caseStudies;
    
    // Run all analyses in parallel for efficiency
    const [themes, patterns, outcomes, clusters] = await Promise.all([
      this.analyzeThemes(),
      this.analyzePatterns(),
      this.analyzeOutcomes(),
      this.performClustering()
    ]);
    
    this.themes = themes;
    this.patterns = patterns;
    this.outcomes = outcomes;
    this.clusters = clusters;
    
    // Build knowledge graph
    this.buildKnowledgeGraph();
    
    return this;
  }

  /**
   * Analyze themes across all case studies
   */
  async analyzeThemes() {
    const allThemes = this.caseStudies.map(cs => ({
      caseStudyId: cs.id,
      title: cs.Title,
      themes: extractThemes(cs, this.caseStudies)
    }));
    
    const comparison = compareThemes(this.caseStudies);
    
    return {
      individual: allThemes,
      comparison,
      topThemes: comparison.commonThemes.slice(0, 10),
      emergingKeywords: comparison.commonKeywords.slice(0, 20)
    };
  }

  /**
   * Analyze patterns across case studies
   */
  async analyzePatterns() {
    return detectPatterns(this.caseStudies);
  }

  /**
   * Analyze outcomes and metrics
   */
  async analyzeOutcomes() {
    const insights = generateOutcomeInsights(this.caseStudies);
    const trends = trackOutcomeTrends(this.caseStudies);
    
    return {
      ...insights,
      trends
    };
  }

  /**
   * Perform clustering analysis
   */
  async performClustering() {
    // Determine optimal number of clusters (between 3 and 8)
    const k = Math.min(8, Math.max(3, Math.floor(this.caseStudies.length / 10)));
    return clusterCaseStudies(this.caseStudies, k);
  }

  /**
   * Build knowledge graph from case studies
   */
  buildKnowledgeGraph() {
    const nodes = [];
    const edges = [];
    const nodeMap = new Map();
    
    // Add case studies as nodes
    this.caseStudies.forEach(cs => {
      const node = {
        id: `cs_${cs.id}`,
        type: 'case-study',
        label: cs.Title,
        data: cs
      };
      nodes.push(node);
      nodeMap.set(node.id, node);
    });
    
    // Add dimensions as nodes
    const dimensionNodes = new Map();
    this.caseStudies.forEach(cs => {
      if (cs['Resilient Dimensions']) {
        const dimensions = cs['Resilient Dimensions'].split(',').map(d => d.trim());
        dimensions.forEach(dim => {
          if (!dimensionNodes.has(dim)) {
            const node = {
              id: `dim_${dim.replace(/\s+/g, '_')}`,
              type: 'dimension',
              label: dim
            };
            nodes.push(node);
            dimensionNodes.set(dim, node);
          }
          
          // Add edge between case study and dimension
          edges.push({
            source: `cs_${cs.id}`,
            target: dimensionNodes.get(dim).id,
            type: 'has-dimension',
            weight: 1
          });
        });
      }
    });
    
    // Add keyword nodes and edges
    const keywordNodes = new Map();
    this.themes.individual.forEach(({ caseStudyId, themes }) => {
      themes.keywords.slice(0, 5).forEach(({ term }) => {
        if (!keywordNodes.has(term)) {
          const node = {
            id: `kw_${term.replace(/\s+/g, '_')}`,
            type: 'keyword',
            label: term
          };
          nodes.push(node);
          keywordNodes.set(term, node);
        }
        
        edges.push({
          source: `cs_${caseStudyId}`,
          target: keywordNodes.get(term).id,
          type: 'has-keyword',
          weight: 0.5
        });
      });
    });
    
    // Add similarity edges between case studies
    this.caseStudies.forEach(cs => {
      const similar = findSimilarCases(cs, this.caseStudies, 3);
      similar.forEach(({ caseStudy, similarity }) => {
        if (similarity > 0.5) {
          edges.push({
            source: `cs_${cs.id}`,
            target: `cs_${caseStudy.id}`,
            type: 'similar-to',
            weight: similarity
          });
        }
      });
    });
    
    this.knowledgeGraph = { nodes, edges };
  }

  /**
   * Generate comprehensive insights report
   */
  generateInsightsReport() {
    const report = {
      summary: this.generateExecutiveSummary(),
      thematicAnalysis: this.generateThematicAnalysis(),
      patternAnalysis: this.generatePatternAnalysis(),
      outcomeAnalysis: this.generateOutcomeAnalysis(),
      clusterAnalysis: this.generateClusterAnalysis(),
      recommendations: this.generateRecommendations(),
      metadata: {
        totalCaseStudies: this.caseStudies.length,
        analysisDate: new Date().toISOString(),
        version: '1.0'
      }
    };
    
    return report;
  }

  /**
   * Generate executive summary
   */
  generateExecutiveSummary() {
    const topThemes = this.themes.topThemes.slice(0, 3).map(([theme]) => theme);
    const avgImprovement = this.outcomes.aggregates.averageImprovement;
    const clusterCount = this.clusters.length;
    
    return {
      overview: `Analysis of ${this.caseStudies.length} case studies reveals key insights across resilience dimensions.`,
      keyFindings: [
        `Primary focus areas include ${topThemes.join(', ')}`,
        `Average performance improvement of ${avgImprovement.toFixed(1)}% observed across measured outcomes`,
        `${clusterCount} distinct intervention patterns identified through cluster analysis`,
        `${this.patterns.emergingThemes.length} emerging themes detected in recent studies`
      ],
      implications: this.generateImplications()
    };
  }

  /**
   * Generate thematic analysis section
   */
  generateThematicAnalysis() {
    return {
      topThemes: this.themes.topThemes,
      emergingThemes: this.patterns.emergingThemes,
      themeDistribution: this.themes.comparison.commonThemes,
      keywordCloud: this.themes.comparison.commonKeywords,
      methodologies: this.themes.comparison.methodologies
    };
  }

  /**
   * Generate pattern analysis section
   */
  generatePatternAnalysis() {
    return {
      temporal: {
        trends: this.patterns.temporalPatterns.trends,
        yearlyDistribution: this.patterns.temporalPatterns.yearlyData
      },
      geographic: {
        distribution: this.patterns.geographicPatterns.countryDistribution,
        diversity: this.patterns.geographicPatterns.geographicDiversity,
        topCountries: this.patterns.geographicPatterns.topCountries
      },
      methodological: {
        combinations: this.patterns.methodologicalPatterns.popularCombinations,
        byDimension: this.patterns.methodologicalPatterns.methodsByDimension
      },
      dimensional: {
        frequency: this.patterns.dimensionPatterns.frequency,
        combinations: this.patterns.dimensionPatterns.commonPairs,
        average: this.patterns.dimensionPatterns.averageDimensionsPerStudy
      }
    };
  }

  /**
   * Generate outcome analysis section
   */
  generateOutcomeAnalysis() {
    return {
      insights: this.outcomes.insights,
      metrics: {
        average: this.outcomes.aggregates.averageImprovement,
        median: this.outcomes.aggregates.medianImprovement,
        range: this.outcomes.aggregates.rangeOfImpact
      },
      topPerformers: this.outcomes.aggregates.topPerformers,
      trends: this.outcomes.trends,
      categoryDistribution: this.outcomes.aggregates.categoryDistribution
    };
  }

  /**
   * Generate cluster analysis section
   */
  generateClusterAnalysis() {
    return this.clusters.map(cluster => ({
      id: cluster.id,
      size: cluster.size,
      characteristics: cluster.characteristics,
      exemplars: cluster.cases.slice(0, 3).map(cs => ({
        id: cs.id,
        title: cs.Title
      }))
    }));
  }

  /**
   * Generate recommendations based on analysis
   */
  generateRecommendations() {
    const recommendations = [];
    
    // Theme-based recommendations
    if (this.themes.topThemes.length > 0) {
      const underrepresented = this.identifyGaps();
      if (underrepresented.length > 0) {
        recommendations.push({
          type: 'research-gap',
          priority: 'high',
          title: 'Address Research Gaps',
          description: `Consider expanding research in underrepresented areas: ${underrepresented.join(', ')}`,
          rationale: 'Comprehensive coverage of all resilience dimensions ensures holistic understanding'
        });
      }
    }
    
    // Pattern-based recommendations
    if (this.patterns.emergingThemes.length > 0) {
      recommendations.push({
        type: 'emerging-focus',
        priority: 'medium',
        title: 'Leverage Emerging Themes',
        description: `Prioritize research on emerging themes: ${this.patterns.emergingThemes.slice(0, 3).map(t => t.theme).join(', ')}`,
        rationale: 'Early focus on emerging areas positions research at the forefront of resilience science'
      });
    }
    
    // Outcome-based recommendations
    if (this.outcomes.aggregates.topPerformers.length > 0) {
      recommendations.push({
        type: 'best-practice',
        priority: 'high',
        title: 'Scale Successful Interventions',
        description: 'Replicate and scale interventions from top-performing case studies',
        rationale: `Top performers achieved ${this.outcomes.aggregates.rangeOfImpact.max.toFixed(1)}% improvement`
      });
    }
    
    // Methodology recommendations
    const methodDiversity = Object.keys(this.themes.comparison.methodologies).length;
    if (methodDiversity < 3) {
      recommendations.push({
        type: 'methodology',
        priority: 'medium',
        title: 'Diversify Research Methods',
        description: 'Incorporate more diverse methodological approaches',
        rationale: 'Methodological diversity strengthens evidence base and captures different perspectives'
      });
    }
    
    return recommendations;
  }

  /**
   * Generate implications from analysis
   */
  generateImplications() {
    const implications = [];
    
    // Based on outcome trends
    if (this.outcomes.trends.trend === 'improving') {
      implications.push('Resilience interventions show increasing effectiveness over time');
    } else if (this.outcomes.trends.trend === 'declining') {
      implications.push('Recent interventions show reduced effectiveness, suggesting need for innovation');
    }
    
    // Based on geographic distribution
    if (this.patterns.geographicPatterns.geographicDiversity < 10) {
      implications.push('Limited geographic diversity suggests need for broader global representation');
    }
    
    // Based on cluster analysis
    if (this.clusters.length > 5) {
      implications.push('High diversity in intervention approaches indicates multiple pathways to resilience');
    }
    
    return implications;
  }

  /**
   * Identify research gaps
   */
  identifyGaps() {
    const allDimensions = [
      'Healthcare Systems',
      'Information Systems',
      'Social Equity & Well-being',
      'Economic Sustainability',
      'Governance & Civic Engagement',
      'Infrastructure Resilience',
      'Environmental Stewardship',
      'Cultural Vitality'
    ];
    
    const coveredDimensions = new Set(
      this.patterns.dimensionPatterns.frequency.map(([dim]) => dim)
    );
    
    return allDimensions.filter(dim => !coveredDimensions.has(dim));
  }

  /**
   * Get insights for specific case study
   */
  getCaseStudyInsights(caseStudyId) {
    const caseStudy = this.caseStudies.find(cs => cs.id === caseStudyId);
    if (!caseStudy) return null;
    
    const themes = extractThemes(caseStudy, this.caseStudies);
    const similar = findSimilarCases(caseStudy, this.caseStudies, 5);
    const recommendations = generateRecommendations(themes, caseStudy);
    
    // Find which cluster this case study belongs to
    let cluster = null;
    for (const c of this.clusters) {
      if (c.cases.some(cs => cs.id === caseStudyId)) {
        cluster = c;
        break;
      }
    }
    
    return {
      caseStudy,
      themes,
      similar,
      recommendations,
      cluster: cluster ? {
        id: cluster.id,
        characteristics: cluster.characteristics
      } : null
    };
  }

  /**
   * Export insights to JSON format
   */
  exportToJSON() {
    return JSON.stringify(this.generateInsightsReport(), null, 2);
  }

  /**
   * Get visualization data for dashboard
   */
  getVisualizationData() {
    return {
      themeBubbleChart: this.getThemeBubbleData(),
      outcomeTrends: this.getOutcomeTrendData(),
      geographicMap: this.getGeographicData(),
      methodologyRadar: this.getMethodologyRadarData(),
      clusterNetwork: this.getClusterNetworkData(),
      knowledgeGraph: this.knowledgeGraph
    };
  }

  /**
   * Get theme bubble chart data
   */
  getThemeBubbleData() {
    return this.themes.topThemes.map(([theme, count], index) => ({
      id: theme,
      value: count,
      group: Math.floor(index / 3) + 1
    }));
  }

  /**
   * Get outcome trend data
   */
  getOutcomeTrendData() {
    const { yearlyAverages } = this.outcomes.trends;
    return Object.entries(yearlyAverages).map(([year, average]) => ({
      year: parseInt(year),
      average: average
    })).sort((a, b) => a.year - b.year);
  }

  /**
   * Get geographic distribution data
   */
  getGeographicData() {
    return Object.entries(this.patterns.geographicPatterns.countryDistribution)
      .map(([country, count]) => ({
        country,
        count,
        percentage: (count / this.caseStudies.length * 100).toFixed(1)
      }));
  }

  /**
   * Get methodology radar chart data
   */
  getMethodologyRadarData() {
    const methods = this.themes.comparison.methodologies;
    const total = Object.values(methods).reduce((sum, count) => sum + count, 0);
    
    return Object.entries(methods).map(([method, count]) => ({
      axis: method,
      value: (count / total * 100).toFixed(1)
    }));
  }

  /**
   * Get cluster network data
   */
  getClusterNetworkData() {
    const nodes = this.clusters.map(cluster => ({
      id: `cluster_${cluster.id}`,
      size: cluster.size,
      label: `Cluster ${cluster.id + 1}`
    }));
    
    const edges = [];
    
    // Add edges between clusters based on shared characteristics
    for (let i = 0; i < this.clusters.length; i++) {
      for (let j = i + 1; j < this.clusters.length; j++) {
        const shared = this.calculateSharedCharacteristics(
          this.clusters[i],
          this.clusters[j]
        );
        
        if (shared > 0.2) {
          edges.push({
            source: `cluster_${i}`,
            target: `cluster_${j}`,
            weight: shared
          });
        }
      }
    }
    
    return { nodes, edges };
  }

  /**
   * Calculate shared characteristics between clusters
   */
  calculateSharedCharacteristics(cluster1, cluster2) {
    const dims1 = new Set(cluster1.characteristics.topDimensions.map(d => d.name));
    const dims2 = new Set(cluster2.characteristics.topDimensions.map(d => d.name));
    
    const intersection = [...dims1].filter(d => dims2.has(d)).length;
    const union = new Set([...dims1, ...dims2]).size;
    
    return union > 0 ? intersection / union : 0;
  }
}

/**
 * Create and initialize insights engine
 */
export async function createInsightsEngine(caseStudies) {
  const engine = new InsightsEngine();
  await engine.initialize(caseStudies);
  return engine;
}