// Outcome tracking and metrics extraction utilities

/**
 * Extract quantitative metrics from text
 */
export function extractMetrics(text) {
  const metrics = [];
  
  // Patterns for different types of metrics
  const patterns = [
    // Percentage patterns: "increased by 45%", "45% improvement", "reduced 30%"
    {
      regex: /(\w+(?:\s+\w+)?)\s+(?:by\s+)?(\d+(?:\.\d+)?)\s*%/gi,
      type: 'percentage',
      extract: (match) => ({
        indicator: match[1],
        value: parseFloat(match[2]),
        unit: '%',
        direction: getDirection(match[1])
      })
    },
    // Numeric patterns: "reduced from 100 to 50", "increased from 20 to 80"
    {
      regex: /(\w+)\s+from\s+(\d+(?:\.\d+)?)\s+to\s+(\d+(?:\.\d+)?)/gi,
      type: 'change',
      extract: (match) => ({
        indicator: match[1],
        baseline: parseFloat(match[2]),
        endline: parseFloat(match[3]),
        change: parseFloat(match[3]) - parseFloat(match[2]),
        changePercent: ((parseFloat(match[3]) - parseFloat(match[2])) / parseFloat(match[2]) * 100).toFixed(1),
        direction: parseFloat(match[3]) > parseFloat(match[2]) ? 'increase' : 'decrease'
      })
    },
    // Ratio patterns: "3x improvement", "2-fold increase"
    {
      regex: /(\d+(?:\.\d+)?)[x\-]?\s*(?:fold|times)?\s*(\w+)/gi,
      type: 'multiplier',
      extract: (match) => ({
        indicator: match[2],
        multiplier: parseFloat(match[1]),
        direction: getDirection(match[2])
      })
    },
    // Score patterns: "score of 85/100", "rated 4.5/5"
    {
      regex: /(?:score|rated|rating)\s+(?:of\s+)?(\d+(?:\.\d+)?)\s*\/\s*(\d+)/gi,
      type: 'score',
      extract: (match) => ({
        value: parseFloat(match[1]),
        maxValue: parseFloat(match[2]),
        percentage: (parseFloat(match[1]) / parseFloat(match[2]) * 100).toFixed(1)
      })
    }
  ];
  
  patterns.forEach(({ regex, type, extract }) => {
    let match;
    while ((match = regex.exec(text)) !== null) {
      metrics.push({
        type,
        text: match[0],
        ...extract(match)
      });
    }
  });
  
  return metrics;
}

/**
 * Determine direction of change from indicator text
 */
function getDirection(indicator) {
  const positive = ['increase', 'improve', 'enhance', 'strengthen', 'grow', 'rise', 'boost', 'expand'];
  const negative = ['decrease', 'reduce', 'decline', 'drop', 'fall', 'diminish', 'worsen'];
  
  const lowerIndicator = indicator.toLowerCase();
  
  if (positive.some(word => lowerIndicator.includes(word))) return 'increase';
  if (negative.some(word => lowerIndicator.includes(word))) return 'decrease';
  
  return 'neutral';
}

/**
 * Extract outcome statements from text
 */
export function extractOutcomes(text) {
  const outcomes = {
    quantitative: [],
    qualitative: [],
    impacts: []
  };
  
  // Split into sentences
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 10);
  
  // Outcome indicator words
  const outcomeIndicators = [
    'resulted in', 'led to', 'achieved', 'demonstrated', 'showed',
    'produced', 'yielded', 'generated', 'created', 'established',
    'improved', 'increased', 'decreased', 'reduced', 'enhanced'
  ];
  
  const impactIndicators = [
    'impact', 'effect', 'influence', 'consequence', 'outcome',
    'benefit', 'advantage', 'success', 'achievement', 'improvement'
  ];
  
  sentences.forEach(sentence => {
    const lowerSentence = sentence.toLowerCase();
    
    // Check if sentence contains outcome indicators
    const hasOutcomeIndicator = outcomeIndicators.some(indicator => 
      lowerSentence.includes(indicator)
    );
    
    const hasImpactIndicator = impactIndicators.some(indicator => 
      lowerSentence.includes(indicator)
    );
    
    if (hasOutcomeIndicator || hasImpactIndicator) {
      // Extract metrics from the sentence
      const metrics = extractMetrics(sentence);
      
      if (metrics.length > 0) {
        outcomes.quantitative.push({
          statement: sentence,
          metrics: metrics
        });
      } else {
        outcomes.qualitative.push({
          statement: sentence,
          category: categorizeOutcome(sentence)
        });
      }
      
      if (hasImpactIndicator) {
        outcomes.impacts.push({
          statement: sentence,
          type: classifyImpact(sentence)
        });
      }
    }
  });
  
  return outcomes;
}

/**
 * Categorize outcome based on content
 */
function categorizeOutcome(text) {
  const categories = {
    'health': ['health', 'medical', 'disease', 'mortality', 'morbidity', 'wellbeing'],
    'social': ['community', 'social', 'cohesion', 'trust', 'participation', 'engagement'],
    'economic': ['economic', 'financial', 'income', 'employment', 'business', 'cost'],
    'infrastructure': ['infrastructure', 'facility', 'system', 'service', 'utility'],
    'governance': ['governance', 'policy', 'regulation', 'coordination', 'leadership'],
    'environmental': ['environment', 'climate', 'sustainability', 'resource', 'ecology'],
    'capacity': ['capacity', 'capability', 'skill', 'knowledge', 'training', 'preparedness']
  };
  
  const lowerText = text.toLowerCase();
  let bestCategory = 'general';
  let maxScore = 0;
  
  Object.entries(categories).forEach(([category, keywords]) => {
    const score = keywords.reduce((sum, keyword) => 
      sum + (lowerText.includes(keyword) ? 1 : 0), 0
    );
    
    if (score > maxScore) {
      maxScore = score;
      bestCategory = category;
    }
  });
  
  return bestCategory;
}

/**
 * Classify type of impact
 */
function classifyImpact(text) {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('direct')) return 'direct';
  if (lowerText.includes('indirect')) return 'indirect';
  if (lowerText.includes('long-term') || lowerText.includes('sustainable')) return 'long-term';
  if (lowerText.includes('short-term') || lowerText.includes('immediate')) return 'short-term';
  if (lowerText.includes('systemic') || lowerText.includes('system-wide')) return 'systemic';
  
  return 'general';
}

/**
 * Standardize outcome metrics across case studies
 */
export function standardizeOutcomes(caseStudies) {
  const standardizedMetrics = {
    percentageChanges: [],
    scores: [],
    multipliers: [],
    categories: {}
  };
  
  caseStudies.forEach(study => {
    const outcomeText = [
      study.Outcomes || '',
      study.Impact || '',
      study.Results || ''
    ].join(' ');
    
    const outcomes = extractOutcomes(outcomeText);
    
    // Process quantitative outcomes
    outcomes.quantitative.forEach(({ metrics }) => {
      metrics.forEach(metric => {
        const standardized = {
          caseStudyId: study.id,
          caseStudyTitle: study.Title,
          ...metric
        };
        
        switch (metric.type) {
          case 'percentage':
          case 'change':
            standardizedMetrics.percentageChanges.push(standardized);
            break;
          case 'score':
            standardizedMetrics.scores.push(standardized);
            break;
          case 'multiplier':
            standardizedMetrics.multipliers.push(standardized);
            break;
        }
      });
    });
    
    // Process qualitative outcomes by category
    outcomes.qualitative.forEach(({ category }) => {
      if (!standardizedMetrics.categories[category]) {
        standardizedMetrics.categories[category] = [];
      }
      standardizedMetrics.categories[category].push({
        caseStudyId: study.id,
        caseStudyTitle: study.Title
      });
    });
  });
  
  return standardizedMetrics;
}

/**
 * Calculate aggregate outcomes
 */
export function calculateAggregateOutcomes(standardizedMetrics) {
  const aggregates = {
    averageImprovement: 0,
    medianImprovement: 0,
    rangeOfImpact: { min: 0, max: 0 },
    categoryDistribution: {},
    topPerformers: [],
    consistentOutcomes: []
  };
  
  // Calculate average and median improvement from percentage changes
  if (standardizedMetrics.percentageChanges.length > 0) {
    const improvements = standardizedMetrics.percentageChanges
      .filter(m => m.direction === 'increase' && m.value)
      .map(m => m.value || m.changePercent)
      .filter(v => v && !isNaN(parseFloat(v)))
      .map(v => parseFloat(v));
    
    if (improvements.length > 0) {
      aggregates.averageImprovement = 
        improvements.reduce((sum, val) => sum + val, 0) / improvements.length;
      
      // Calculate median
      const sorted = improvements.sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      aggregates.medianImprovement = sorted.length % 2 === 0 ?
        (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
      
      aggregates.rangeOfImpact = {
        min: Math.min(...improvements),
        max: Math.max(...improvements)
      };
    }
  }
  
  // Calculate category distribution
  Object.entries(standardizedMetrics.categories).forEach(([category, studies]) => {
    aggregates.categoryDistribution[category] = studies.length;
  });
  
  // Identify top performers (highest improvements)
  aggregates.topPerformers = standardizedMetrics.percentageChanges
    .filter(m => m.value && m.direction === 'increase')
    .sort((a, b) => (b.value || 0) - (a.value || 0))
    .slice(0, 5)
    .map(m => ({
      caseStudy: m.caseStudyTitle,
      improvement: m.value,
      indicator: m.indicator
    }));
  
  return aggregates;
}

/**
 * Generate outcome insights
 */
export function generateOutcomeInsights(caseStudies) {
  const standardized = standardizeOutcomes(caseStudies);
  const aggregates = calculateAggregateOutcomes(standardized);
  
  const insights = [];
  
  // Insight on average improvement
  if (aggregates.averageImprovement > 0) {
    insights.push({
      type: 'performance',
      title: 'Average Performance Improvement',
      message: `Case studies show an average improvement of ${aggregates.averageImprovement.toFixed(1)}% in measured outcomes, with a range from ${aggregates.rangeOfImpact.min.toFixed(1)}% to ${aggregates.rangeOfImpact.max.toFixed(1)}%`,
      priority: 'high',
      data: {
        average: aggregates.averageImprovement,
        median: aggregates.medianImprovement,
        range: aggregates.rangeOfImpact
      }
    });
  }
  
  // Insight on outcome categories
  const topCategories = Object.entries(aggregates.categoryDistribution)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);
  
  if (topCategories.length > 0) {
    insights.push({
      type: 'focus-areas',
      title: 'Primary Outcome Categories',
      message: `Outcomes are primarily focused on ${topCategories.map(([cat]) => cat).join(', ')}, indicating key areas of resilience impact`,
      priority: 'medium',
      data: aggregates.categoryDistribution
    });
  }
  
  // Insight on top performers
  if (aggregates.topPerformers.length > 0) {
    insights.push({
      type: 'best-practices',
      title: 'High-Impact Interventions',
      message: `Top performing case studies achieved improvements ranging from ${aggregates.topPerformers[aggregates.topPerformers.length - 1].improvement}% to ${aggregates.topPerformers[0].improvement}%`,
      priority: 'high',
      data: aggregates.topPerformers
    });
  }
  
  return {
    insights,
    metrics: standardized,
    aggregates
  };
}

/**
 * Track outcome trends over time
 */
export function trackOutcomeTrends(caseStudies) {
  const timeSeriesData = {};
  
  caseStudies.forEach(study => {
    if (!study.Date) return;
    
    const year = new Date(study.Date).getFullYear();
    if (!timeSeriesData[year]) {
      timeSeriesData[year] = {
        count: 0,
        totalImprovement: 0,
        outcomes: []
      };
    }
    
    const outcomeText = study.Outcomes || '';
    const metrics = extractMetrics(outcomeText);
    
    timeSeriesData[year].count++;
    
    metrics.forEach(metric => {
      if (metric.type === 'percentage' && metric.direction === 'increase') {
        timeSeriesData[year].totalImprovement += metric.value;
        timeSeriesData[year].outcomes.push(metric);
      }
    });
  });
  
  // Calculate yearly averages
  const yearlyAverages = {};
  Object.entries(timeSeriesData).forEach(([year, data]) => {
    yearlyAverages[year] = data.outcomes.length > 0 ?
      data.totalImprovement / data.outcomes.length : 0;
  });
  
  return {
    timeSeriesData,
    yearlyAverages,
    trend: calculateTrend(yearlyAverages)
  };
}

/**
 * Calculate trend direction
 */
function calculateTrend(yearlyAverages) {
  const years = Object.keys(yearlyAverages).sort();
  if (years.length < 2) return 'insufficient-data';
  
  const recentYears = years.slice(-3);
  const earlierYears = years.slice(0, 3);
  
  const recentAvg = recentYears.reduce((sum, year) => 
    sum + yearlyAverages[year], 0) / recentYears.length;
  
  const earlierAvg = earlierYears.reduce((sum, year) => 
    sum + yearlyAverages[year], 0) / earlierYears.length;
  
  if (recentAvg > earlierAvg * 1.1) return 'improving';
  if (recentAvg < earlierAvg * 0.9) return 'declining';
  return 'stable';
}