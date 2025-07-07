// Machine Learning powered insights engine
// Browser-compatible implementation using lightweight ML algorithms

import advancedNLP from './advanced-nlp.js';

class MLInsightsEngine {
  constructor() {
    this.models = {
      clustering: null,
      similarity: null,
      prediction: null,
      anomaly: null
    };
  }

  // Initialize the engine with case studies data
  async initialize(caseStudies) {
    this.caseStudies = caseStudies;
    this.features = await this.extractFeatures(caseStudies);
    this.buildModels();
  }

  // Extract features from case studies for ML
  async extractFeatures(caseStudies) {
    const features = caseStudies.map(study => {
      // Text features
      const textFeatures = this.extractTextFeatures(study);
      
      // Categorical features
      const categoricalFeatures = this.extractCategoricalFeatures(study);
      
      // Temporal features
      const temporalFeatures = this.extractTemporalFeatures(study);
      
      // Network features (placeholder for graph-based features)
      const networkFeatures = this.extractNetworkFeatures(study);
      
      return {
        id: study.id,
        ...textFeatures,
        ...categoricalFeatures,
        ...temporalFeatures,
        ...networkFeatures,
        raw: study
      };
    });
    
    return features;
  }

  // Extract text-based features using NLP
  extractTextFeatures(study) {
    const text = `${study.Title || ''} ${study.Description || ''} ${study.Focus || ''} ${study.Relevance || ''}`;
    
    // Get sentiment
    const sentiment = advancedNLP.analyzeSentiment(text);
    
    // Get key phrases
    const keyPhrases = advancedNLP.extractKeyPhrases(text, 5);
    
    // Get entities
    const entities = advancedNLP.extractEntities(text);
    
    // Calculate text statistics
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;
    
    return {
      sentimentScore: sentiment.positiveScore - sentiment.negativeScore,
      sentimentConfidence: sentiment.confidence,
      textLength: text.length,
      wordCount: words.length,
      avgWordLength,
      keyPhrases,
      numOrganizations: entities.organizations.length,
      numPeople: entities.people.length,
      numMethodologies: entities.methodologies.length
    };
  }

  // Extract categorical features
  extractCategoricalFeatures(study) {
    const dimensions = study.Dimensions ? study.Dimensions.split(',').map(d => d.trim()) : [];
    const keywords = study.Keywords ? study.Keywords.split(',').map(k => k.trim()) : [];
    
    return {
      studyType: study.Type || 'Unknown',
      numDimensions: dimensions.length,
      dimensions,
      numKeywords: keywords.length,
      hasInstitution: !!study.Institution
    };
  }

  // Extract temporal features
  extractTemporalFeatures(study) {
    const date = study.Date ? new Date(study.Date) : null;
    const now = new Date();
    
    return {
      year: date ? date.getFullYear() : null,
      month: date ? date.getMonth() + 1 : null,
      daysAgo: date ? Math.floor((now - date) / (1000 * 60 * 60 * 24)) : null,
      isRecent: date ? (now - date) / (1000 * 60 * 60 * 24) < 365 : false
    };
  }

  // Extract network features (placeholder)
  extractNetworkFeatures(study) {
    return {
      collaboratorCount: 0, // Would be calculated from graph
      centralityScore: 0,   // Would be calculated from graph
    };
  }

  // Build ML models
  buildModels() {
    this.models.clustering = this.buildClusteringModel();
    this.models.similarity = this.buildSimilarityModel();
    this.models.prediction = this.buildPredictionModel();
    this.models.anomaly = this.buildAnomalyModel();
  }

  // K-means clustering for grouping similar studies
  buildClusteringModel() {
    const kMeans = {
      fit: (features, k = 5) => {
        // Convert features to numeric vectors
        const vectors = features.map(f => [
          f.sentimentScore || 0,
          f.numDimensions || 0,
          f.numKeywords || 0,
          f.wordCount || 0,
          f.numOrganizations || 0
        ]);
        
        // Initialize centroids randomly
        let centroids = this.initializeCentroids(vectors, k);
        let assignments = new Array(vectors.length);
        let changed = true;
        let iterations = 0;
        
        while (changed && iterations < 100) {
          changed = false;
          
          // Assign points to nearest centroid
          for (let i = 0; i < vectors.length; i++) {
            const nearest = this.findNearestCentroid(vectors[i], centroids);
            if (assignments[i] !== nearest) {
              changed = true;
              assignments[i] = nearest;
            }
          }
          
          // Update centroids
          centroids = this.updateCentroids(vectors, assignments, k);
          iterations++;
        }
        
        // Return cluster assignments and analysis
        return this.analyzeCluster(features, assignments, centroids);
      }
    };
    
    return kMeans;
  }

  // Cosine similarity for finding similar studies
  buildSimilarityModel() {
    return {
      findSimilar: (studyId, topK = 5) => {
        const targetFeature = this.features.find(f => f.id === studyId);
        if (!targetFeature) return [];
        
        // Calculate TF-IDF vectors for all studies
        const documents = this.features.map(f => f.raw.Description || '');
        const tfidfScores = advancedNLP.calculateEnhancedTFIDF(documents);
        
        // Calculate similarities
        const similarities = this.features
          .filter(f => f.id !== studyId)
          .map(feature => {
            const similarity = this.calculateSimilarity(targetFeature, feature);
            return { 
              study: feature.raw, 
              similarity,
              commonDimensions: this.findCommonElements(
                targetFeature.dimensions || [], 
                feature.dimensions || []
              ),
              similarityReasons: this.explainSimilarity(targetFeature, feature)
            };
          })
          .sort((a, b) => b.similarity - a.similarity)
          .slice(0, topK);
        
        return similarities;
      }
    };
  }

  // Simple outcome prediction model
  buildPredictionModel() {
    return {
      predictSuccess: (features) => {
        // Simple rule-based prediction
        let score = 0;
        
        // Positive indicators
        if (features.sentimentScore > 0) score += 0.3;
        if (features.numMethodologies > 2) score += 0.2;
        if (features.hasInstitution) score += 0.1;
        if (features.isRecent) score += 0.1;
        if (features.numDimensions > 1) score += 0.2;
        
        // Negative indicators
        if (features.wordCount < 50) score -= 0.2;
        if (features.numKeywords === 0) score -= 0.1;
        
        const probability = Math.max(0, Math.min(1, score));
        
        return {
          probability,
          confidence: this.calculateConfidence(features),
          factors: this.explainPrediction(features, score)
        };
      }
    };
  }

  // Anomaly detection using statistical methods
  buildAnomalyModel() {
    return {
      detectAnomalies: () => {
        const anomalies = [];
        
        // Calculate statistics for each numeric feature
        const stats = this.calculateFeatureStats();
        
        this.features.forEach(feature => {
          const anomalyScores = {};
          let totalScore = 0;
          
          // Check each feature for anomalies
          Object.entries(stats).forEach(([key, stat]) => {
            const value = feature[key];
            if (typeof value === 'number' && stat.std > 0) {
              const zScore = Math.abs((value - stat.mean) / stat.std);
              if (zScore > 2.5) {
                anomalyScores[key] = zScore;
                totalScore += zScore;
              }
            }
          });
          
          if (Object.keys(anomalyScores).length > 0) {
            anomalies.push({
              study: feature.raw,
              anomalyScores,
              totalScore,
              explanation: this.explainAnomaly(feature, anomalyScores)
            });
          }
        });
        
        return anomalies.sort((a, b) => b.totalScore - a.totalScore);
      }
    };
  }

  // Generate comprehensive insights
  generateInsights() {
    const insights = {
      clusters: this.models.clustering.fit(this.features),
      anomalies: this.models.anomaly.detectAnomalies(),
      predictions: this.generatePredictions(),
      patterns: this.detectPatterns(),
      trends: this.analyzeTrends(),
      recommendations: this.generateRecommendations()
    };
    
    return insights;
  }

  // Detect patterns in the data
  detectPatterns() {
    const patterns = [];
    
    // Pattern 1: Dimension combinations
    const dimensionPairs = new Map();
    this.features.forEach(feature => {
      const dims = feature.dimensions || [];
      for (let i = 0; i < dims.length - 1; i++) {
        for (let j = i + 1; j < dims.length; j++) {
          const pair = [dims[i], dims[j]].sort().join(' + ');
          dimensionPairs.set(pair, (dimensionPairs.get(pair) || 0) + 1);
        }
      }
    });
    
    const topPairs = Array.from(dimensionPairs.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    if (topPairs.length > 0) {
      patterns.push({
        type: 'dimension_combinations',
        title: 'Common Dimension Combinations',
        description: 'These resilience dimensions frequently appear together',
        data: topPairs.map(([pair, count]) => ({ combination: pair, count }))
      });
    }
    
    // Pattern 2: Temporal patterns
    const yearlyStats = this.calculateYearlyStats();
    if (yearlyStats.length > 1) {
      patterns.push({
        type: 'temporal_trends',
        title: 'Research Trends Over Time',
        description: 'How research focus has evolved',
        data: yearlyStats
      });
    }
    
    // Pattern 3: Methodology patterns
    const methodologyPatterns = this.analyzeMethodologyPatterns();
    if (methodologyPatterns.length > 0) {
      patterns.push({
        type: 'methodology_patterns',
        title: 'Methodology Insights',
        description: 'Common approaches and their characteristics',
        data: methodologyPatterns
      });
    }
    
    return patterns;
  }

  // Analyze trends
  analyzeTrends() {
    const trends = [];
    
    // Trend 1: Growing topics
    const recentStudies = this.features.filter(f => f.isRecent);
    const olderStudies = this.features.filter(f => !f.isRecent && f.year);
    
    if (recentStudies.length > 5 && olderStudies.length > 5) {
      const recentKeywords = this.aggregateKeywords(recentStudies);
      const olderKeywords = this.aggregateKeywords(olderStudies);
      
      const growingKeywords = Array.from(recentKeywords.entries())
        .map(([keyword, recentCount]) => {
          const olderCount = olderKeywords.get(keyword) || 0;
          const growth = olderCount > 0 ? (recentCount - olderCount) / olderCount : 1;
          return { keyword, growth, recentCount, olderCount };
        })
        .filter(item => item.growth > 0.5)
        .sort((a, b) => b.growth - a.growth)
        .slice(0, 10);
      
      if (growingKeywords.length > 0) {
        trends.push({
          type: 'growing_topics',
          title: 'Emerging Research Topics',
          description: 'Keywords showing significant growth in recent studies',
          data: growingKeywords
        });
      }
    }
    
    return trends;
  }

  // Generate recommendations
  generateRecommendations() {
    const recommendations = [];
    
    // Recommendation 1: Gap analysis
    const dimensionCoverage = this.analyzeDimensionCoverage();
    const underrepresented = dimensionCoverage.filter(d => d.percentage < 10);
    
    if (underrepresented.length > 0) {
      recommendations.push({
        type: 'research_gap',
        priority: 'high',
        title: 'Address Research Gaps',
        description: `The following resilience dimensions are underrepresented in current research: ${underrepresented.map(d => d.dimension).join(', ')}`,
        action: 'Consider prioritizing research in these areas to ensure comprehensive coverage'
      });
    }
    
    // Recommendation 2: Collaboration opportunities
    const isolatedStudies = this.findIsolatedStudies();
    if (isolatedStudies.length > 0) {
      recommendations.push({
        type: 'collaboration',
        priority: 'medium',
        title: 'Foster Collaboration',
        description: `${isolatedStudies.length} studies appear to be conducted in isolation`,
        action: 'Encourage cross-institutional collaboration to enhance research impact'
      });
    }
    
    return recommendations;
  }

  // Helper methods
  initializeCentroids(vectors, k) {
    const centroids = [];
    const indices = new Set();
    
    while (indices.size < k && indices.size < vectors.length) {
      const idx = Math.floor(Math.random() * vectors.length);
      if (!indices.has(idx)) {
        indices.add(idx);
        centroids.push([...vectors[idx]]);
      }
    }
    
    return centroids;
  }

  findNearestCentroid(vector, centroids) {
    let minDist = Infinity;
    let nearest = 0;
    
    centroids.forEach((centroid, idx) => {
      const dist = this.euclideanDistance(vector, centroid);
      if (dist < minDist) {
        minDist = dist;
        nearest = idx;
      }
    });
    
    return nearest;
  }

  euclideanDistance(v1, v2) {
    return Math.sqrt(
      v1.reduce((sum, val, idx) => sum + Math.pow(val - v2[idx], 2), 0)
    );
  }

  updateCentroids(vectors, assignments, k) {
    const newCentroids = Array(k).fill(null).map(() => []);
    const counts = Array(k).fill(0);
    
    // Sum vectors for each cluster
    vectors.forEach((vector, idx) => {
      const cluster = assignments[idx];
      if (newCentroids[cluster].length === 0) {
        newCentroids[cluster] = Array(vector.length).fill(0);
      }
      vector.forEach((val, i) => {
        newCentroids[cluster][i] += val;
      });
      counts[cluster]++;
    });
    
    // Calculate mean
    return newCentroids.map((centroid, idx) => {
      if (counts[idx] === 0) return centroid;
      return centroid.map(val => val / counts[idx]);
    });
  }

  analyzeCluster(features, assignments, centroids) {
    const clusters = Array(centroids.length).fill(null).map((_, idx) => ({
      id: idx,
      studies: [],
      characteristics: {},
      size: 0
    }));
    
    // Assign studies to clusters
    features.forEach((feature, idx) => {
      const cluster = assignments[idx];
      clusters[cluster].studies.push(feature.raw);
      clusters[cluster].size++;
    });
    
    // Analyze each cluster
    clusters.forEach((cluster, idx) => {
      if (cluster.size > 0) {
        // Find common dimensions
        const dimensionCounts = new Map();
        cluster.studies.forEach(study => {
          const dims = study.Dimensions ? study.Dimensions.split(',').map(d => d.trim()) : [];
          dims.forEach(dim => {
            dimensionCounts.set(dim, (dimensionCounts.get(dim) || 0) + 1);
          });
        });
        
        cluster.characteristics = {
          commonDimensions: Array.from(dimensionCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([dim, _]) => dim),
          avgSentiment: cluster.studies.reduce((sum, s, i) => {
            const f = features.find(f => f.raw.id === s.id);
            return sum + (f ? f.sentimentScore : 0);
          }, 0) / cluster.size
        };
      }
    });
    
    return clusters.filter(c => c.size > 0);
  }

  calculateSimilarity(feature1, feature2) {
    let similarity = 0;
    let factors = 0;
    
    // Dimension similarity
    const commonDims = this.findCommonElements(feature1.dimensions || [], feature2.dimensions || []);
    if (feature1.dimensions && feature2.dimensions) {
      similarity += commonDims.length / Math.max(feature1.dimensions.length, feature2.dimensions.length);
      factors++;
    }
    
    // Sentiment similarity
    const sentDiff = Math.abs((feature1.sentimentScore || 0) - (feature2.sentimentScore || 0));
    similarity += 1 - (sentDiff / 10); // Normalize to 0-1
    factors++;
    
    // Type similarity
    if (feature1.studyType === feature2.studyType) {
      similarity += 1;
    }
    factors++;
    
    return factors > 0 ? similarity / factors : 0;
  }

  findCommonElements(arr1, arr2) {
    return arr1.filter(item => arr2.includes(item));
  }

  calculateFeatureStats() {
    const stats = {};
    const numericFeatures = ['sentimentScore', 'wordCount', 'numDimensions', 'numKeywords'];
    
    numericFeatures.forEach(feature => {
      const values = this.features.map(f => f[feature]).filter(v => typeof v === 'number');
      if (values.length > 0) {
        const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
        const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
        stats[feature] = {
          mean,
          std: Math.sqrt(variance),
          min: Math.min(...values),
          max: Math.max(...values)
        };
      }
    });
    
    return stats;
  }

  generatePredictions() {
    return this.features.map(feature => ({
      study: feature.raw,
      prediction: this.models.prediction.predictSuccess(feature)
    }));
  }

  explainSimilarity(feature1, feature2) {
    const reasons = [];
    
    const commonDims = this.findCommonElements(feature1.dimensions || [], feature2.dimensions || []);
    if (commonDims.length > 0) {
      reasons.push(`Share ${commonDims.length} dimensions: ${commonDims.join(', ')}`);
    }
    
    if (feature1.studyType === feature2.studyType) {
      reasons.push(`Both are ${feature1.studyType} studies`);
    }
    
    if (Math.abs(feature1.sentimentScore - feature2.sentimentScore) < 1) {
      reasons.push('Similar sentiment/outcome indicators');
    }
    
    return reasons;
  }

  explainPrediction(features, score) {
    const factors = [];
    
    if (features.sentimentScore > 0) {
      factors.push({ factor: 'Positive sentiment', impact: '+30%' });
    }
    if (features.numMethodologies > 2) {
      factors.push({ factor: 'Multiple methodologies', impact: '+20%' });
    }
    if (features.hasInstitution) {
      factors.push({ factor: 'Institutional backing', impact: '+10%' });
    }
    
    return factors;
  }

  explainAnomaly(feature, anomalyScores) {
    const explanations = [];
    
    Object.entries(anomalyScores).forEach(([key, score]) => {
      if (key === 'wordCount' && score > 2.5) {
        explanations.push(`Unusually ${feature.wordCount > 500 ? 'long' : 'short'} description`);
      }
      if (key === 'numDimensions' && score > 2.5) {
        explanations.push(`Covers ${feature.numDimensions} dimensions (unusual)`);
      }
    });
    
    return explanations.join('; ');
  }

  calculateConfidence(features) {
    // More complete data = higher confidence
    let completeness = 0;
    if (features.raw.Description) completeness += 0.25;
    if (features.raw.Dimensions) completeness += 0.25;
    if (features.raw.Keywords) completeness += 0.25;
    if (features.raw.Institution) completeness += 0.25;
    
    return completeness;
  }

  aggregateKeywords(studies) {
    const keywords = new Map();
    
    studies.forEach(study => {
      if (study.raw.Keywords) {
        study.raw.Keywords.split(',').forEach(kw => {
          const cleaned = kw.trim().toLowerCase();
          keywords.set(cleaned, (keywords.get(cleaned) || 0) + 1);
        });
      }
    });
    
    return keywords;
  }

  calculateYearlyStats() {
    const yearlyData = new Map();
    
    this.features.forEach(feature => {
      if (feature.year) {
        if (!yearlyData.has(feature.year)) {
          yearlyData.set(feature.year, {
            year: feature.year,
            count: 0,
            dimensions: new Map(),
            avgSentiment: 0
          });
        }
        
        const yearData = yearlyData.get(feature.year);
        yearData.count++;
        yearData.avgSentiment += feature.sentimentScore || 0;
        
        (feature.dimensions || []).forEach(dim => {
          yearData.dimensions.set(dim, (yearData.dimensions.get(dim) || 0) + 1);
        });
      }
    });
    
    return Array.from(yearlyData.values())
      .map(data => ({
        ...data,
        avgSentiment: data.avgSentiment / data.count,
        topDimensions: Array.from(data.dimensions.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([dim, _]) => dim)
      }))
      .sort((a, b) => a.year - b.year);
  }

  analyzeMethodologyPatterns() {
    const patterns = [];
    const methodologyGroups = new Map();
    
    this.features.forEach(feature => {
      if (feature.numMethodologies > 0) {
        const key = feature.raw.Type || 'Unknown';
        if (!methodologyGroups.has(key)) {
          methodologyGroups.set(key, {
            type: key,
            studies: [],
            avgMethodologies: 0,
            avgSuccess: 0
          });
        }
        
        const group = methodologyGroups.get(key);
        group.studies.push(feature);
        group.avgMethodologies += feature.numMethodologies;
        group.avgSuccess += feature.sentimentScore > 0 ? 1 : 0;
      }
    });
    
    return Array.from(methodologyGroups.values())
      .map(group => ({
        ...group,
        avgMethodologies: group.avgMethodologies / group.studies.length,
        avgSuccess: group.avgSuccess / group.studies.length
      }))
      .filter(group => group.studies.length >= 3);
  }

  analyzeDimensionCoverage() {
    const dimensionCounts = new Map();
    let totalDimensions = 0;
    
    this.features.forEach(feature => {
      (feature.dimensions || []).forEach(dim => {
        dimensionCounts.set(dim, (dimensionCounts.get(dim) || 0) + 1);
        totalDimensions++;
      });
    });
    
    return Array.from(dimensionCounts.entries())
      .map(([dimension, count]) => ({
        dimension,
        count,
        percentage: (count / totalDimensions) * 100
      }))
      .sort((a, b) => b.count - a.count);
  }

  findIsolatedStudies() {
    // Studies with no common dimensions with others
    return this.features.filter(feature => {
      if (!feature.dimensions || feature.dimensions.length === 0) return true;
      
      const hasCommon = this.features.some(other => {
        if (other.id === feature.id) return false;
        return this.findCommonElements(feature.dimensions, other.dimensions || []).length > 0;
      });
      
      return !hasCommon;
    }).map(f => f.raw);
  }
}

// Export singleton instance
const mlInsightsEngine = new MLInsightsEngine();
export default mlInsightsEngine;