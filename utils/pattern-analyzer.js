// Cross-case pattern analysis utilities
// Implements similarity scoring, clustering, and pattern detection

/**
 * Calculate Jaccard similarity between two sets
 */
function jaccardSimilarity(set1, set2) {
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return intersection.size / union.size;
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(vec1, vec2) {
  const keys = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;
  
  keys.forEach(key => {
    const val1 = vec1[key] || 0;
    const val2 = vec2[key] || 0;
    dotProduct += val1 * val2;
    magnitude1 += val1 * val1;
    magnitude2 += val2 * val2;
  });
  
  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);
  
  if (magnitude1 === 0 || magnitude2 === 0) return 0;
  return dotProduct / (magnitude1 * magnitude2);
}

/**
 * Convert case study to feature vector
 */
export function caseStudyToVector(caseStudy) {
  const vector = {};
  
  // Dimensions as features
  if (caseStudy['Resilient Dimensions']) {
    const dimensions = caseStudy['Resilient Dimensions'].split(',').map(d => d.trim());
    dimensions.forEach(dim => {
      vector[`dim_${dim}`] = 1;
    });
  }
  
  // Keywords as features
  if (caseStudy.Keywords) {
    const keywords = caseStudy.Keywords.toLowerCase().split(',').map(k => k.trim());
    keywords.forEach(keyword => {
      vector[`kw_${keyword}`] = 1;
    });
  }
  
  // Methodology features
  const methodology = (caseStudy.Methodology || '').toLowerCase();
  const methodTypes = ['qualitative', 'quantitative', 'mixed-methods', 'survey', 'interview', 'ethnographic'];
  methodTypes.forEach(method => {
    if (methodology.includes(method)) {
      vector[`method_${method}`] = 1;
    }
  });
  
  // Geographic features
  if (caseStudy.Country) {
    vector[`geo_${caseStudy.Country}`] = 1;
  }
  
  // Temporal features (year)
  if (caseStudy.Date) {
    const year = new Date(caseStudy.Date).getFullYear();
    vector[`year_${year}`] = 1;
  }
  
  return vector;
}

/**
 * Calculate similarity between two case studies
 */
export function calculateCaseSimilarity(case1, case2) {
  const vec1 = caseStudyToVector(case1);
  const vec2 = caseStudyToVector(case2);
  
  // Use cosine similarity for sparse vectors
  const similarity = cosineSimilarity(vec1, vec2);
  
  // Additional similarity based on shared dimensions
  const dims1 = new Set((case1['Resilient Dimensions'] || '').split(',').map(d => d.trim()));
  const dims2 = new Set((case2['Resilient Dimensions'] || '').split(',').map(d => d.trim()));
  const dimensionSimilarity = jaccardSimilarity(dims1, dims2);
  
  // Weighted combination
  return similarity * 0.7 + dimensionSimilarity * 0.3;
}

/**
 * Find similar case studies
 */
export function findSimilarCases(targetCase, allCases, topN = 5) {
  const similarities = allCases
    .filter(cs => cs.id !== targetCase.id) // Exclude self
    .map(cs => ({
      caseStudy: cs,
      similarity: calculateCaseSimilarity(targetCase, cs)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topN);
  
  return similarities;
}

/**
 * Perform k-means clustering on case studies
 */
export function clusterCaseStudies(caseStudies, k = 5, maxIterations = 100) {
  // Convert all case studies to vectors
  const vectors = caseStudies.map(cs => ({
    id: cs.id,
    vector: caseStudyToVector(cs),
    caseStudy: cs
  }));
  
  // Get all feature keys
  const allKeys = new Set();
  vectors.forEach(v => {
    Object.keys(v.vector).forEach(key => allKeys.add(key));
  });
  
  // Initialize centroids randomly
  let centroids = [];
  const shuffled = [...vectors].sort(() => Math.random() - 0.5);
  for (let i = 0; i < k; i++) {
    centroids.push({ ...shuffled[i].vector });
  }
  
  let clusters = [];
  let iteration = 0;
  let changed = true;
  
  while (changed && iteration < maxIterations) {
    changed = false;
    
    // Assign points to clusters
    const newClusters = Array(k).fill(null).map(() => []);
    
    vectors.forEach(point => {
      let minDistance = Infinity;
      let closestCluster = 0;
      
      // Find closest centroid
      centroids.forEach((centroid, idx) => {
        const distance = 1 - cosineSimilarity(point.vector, centroid);
        if (distance < minDistance) {
          minDistance = distance;
          closestCluster = idx;
        }
      });
      
      newClusters[closestCluster].push(point);
    });
    
    // Update centroids
    const newCentroids = newClusters.map((cluster, idx) => {
      if (cluster.length === 0) return centroids[idx]; // Keep old centroid if cluster is empty
      
      const newCentroid = {};
      allKeys.forEach(key => {
        const sum = cluster.reduce((acc, point) => acc + (point.vector[key] || 0), 0);
        newCentroid[key] = sum / cluster.length;
      });
      
      return newCentroid;
    });
    
    // Check if centroids changed
    centroids.forEach((centroid, idx) => {
      const distance = 1 - cosineSimilarity(centroid, newCentroids[idx]);
      if (distance > 0.01) changed = true;
    });
    
    centroids = newCentroids;
    clusters = newClusters;
    iteration++;
  }
  
  // Analyze clusters
  const clusterAnalysis = clusters.map((cluster, idx) => {
    const clusterInfo = {
      id: idx,
      size: cluster.length,
      cases: cluster.map(c => c.caseStudy),
      characteristics: analyzeClusterCharacteristics(cluster),
      centroid: centroids[idx]
    };
    
    return clusterInfo;
  });
  
  return clusterAnalysis;
}

/**
 * Analyze characteristics of a cluster
 */
function analyzeClusterCharacteristics(cluster) {
  const characteristics = {
    dimensions: {},
    keywords: {},
    methodologies: {},
    countries: {},
    years: {}
  };
  
  cluster.forEach(({ caseStudy }) => {
    // Count dimensions
    if (caseStudy['Resilient Dimensions']) {
      const dims = caseStudy['Resilient Dimensions'].split(',').map(d => d.trim());
      dims.forEach(dim => {
        characteristics.dimensions[dim] = (characteristics.dimensions[dim] || 0) + 1;
      });
    }
    
    // Count keywords
    if (caseStudy.Keywords) {
      const keywords = caseStudy.Keywords.split(',').map(k => k.trim());
      keywords.forEach(kw => {
        characteristics.keywords[kw] = (characteristics.keywords[kw] || 0) + 1;
      });
    }
    
    // Count methodologies
    const methodology = (caseStudy.Methodology || '').toLowerCase();
    ['qualitative', 'quantitative', 'mixed-methods'].forEach(method => {
      if (methodology.includes(method)) {
        characteristics.methodologies[method] = (characteristics.methodologies[method] || 0) + 1;
      }
    });
    
    // Count countries
    if (caseStudy.Country) {
      characteristics.countries[caseStudy.Country] = (characteristics.countries[caseStudy.Country] || 0) + 1;
    }
    
    // Count years
    if (caseStudy.Date) {
      const year = new Date(caseStudy.Date).getFullYear();
      characteristics.years[year] = (characteristics.years[year] || 0) + 1;
    }
  });
  
  // Get top characteristics
  const getTop = (obj, n = 3) => 
    Object.entries(obj)
      .sort(([, a], [, b]) => b - a)
      .slice(0, n)
      .map(([key, count]) => ({ name: key, count, percentage: (count / cluster.length * 100).toFixed(1) }));
  
  return {
    topDimensions: getTop(characteristics.dimensions),
    topKeywords: getTop(characteristics.keywords, 5),
    topMethodologies: getTop(characteristics.methodologies),
    topCountries: getTop(characteristics.countries),
    yearRange: Object.keys(characteristics.years).length > 0 ? 
      `${Math.min(...Object.keys(characteristics.years))}-${Math.max(...Object.keys(characteristics.years))}` : 
      'N/A'
  };
}

/**
 * Detect patterns across case studies
 */
export function detectPatterns(caseStudies) {
  const patterns = {
    temporalPatterns: detectTemporalPatterns(caseStudies),
    geographicPatterns: detectGeographicPatterns(caseStudies),
    methodologicalPatterns: detectMethodologicalPatterns(caseStudies),
    dimensionPatterns: detectDimensionPatterns(caseStudies),
    emergingThemes: detectEmergingThemes(caseStudies)
  };
  
  return patterns;
}

/**
 * Detect temporal patterns
 */
function detectTemporalPatterns(caseStudies) {
  const yearlyData = {};
  
  caseStudies.forEach(cs => {
    if (cs.Date) {
      const year = new Date(cs.Date).getFullYear();
      if (!yearlyData[year]) {
        yearlyData[year] = {
          count: 0,
          dimensions: {},
          keywords: {}
        };
      }
      
      yearlyData[year].count++;
      
      // Track dimensions by year
      if (cs['Resilient Dimensions']) {
        const dims = cs['Resilient Dimensions'].split(',').map(d => d.trim());
        dims.forEach(dim => {
          yearlyData[year].dimensions[dim] = (yearlyData[year].dimensions[dim] || 0) + 1;
        });
      }
      
      // Track keywords by year
      if (cs.Keywords) {
        const keywords = cs.Keywords.split(',').map(k => k.trim());
        keywords.forEach(kw => {
          yearlyData[year].keywords[kw] = (yearlyData[year].keywords[kw] || 0) + 1;
        });
      }
    }
  });
  
  // Analyze trends
  const years = Object.keys(yearlyData).sort();
  const trends = {
    growthRate: years.length > 1 ? 
      ((yearlyData[years[years.length - 1]].count - yearlyData[years[0]].count) / yearlyData[years[0]].count * 100).toFixed(1) : 
      0,
    peakYear: years.reduce((peak, year) => 
      yearlyData[year].count > yearlyData[peak].count ? year : peak, years[0]),
    emergingTopics: findEmergingTopics(yearlyData, years)
  };
  
  return { yearlyData, trends };
}

/**
 * Find emerging topics over time
 */
function findEmergingTopics(yearlyData, years) {
  if (years.length < 2) return [];
  
  const recentYear = years[years.length - 1];
  const previousYear = years[years.length - 2];
  
  const emerging = [];
  
  // Check dimensions
  Object.keys(yearlyData[recentYear].dimensions).forEach(dim => {
    const recentCount = yearlyData[recentYear].dimensions[dim];
    const previousCount = yearlyData[previousYear]?.dimensions[dim] || 0;
    
    if (recentCount > previousCount * 1.5) {
      emerging.push({
        type: 'dimension',
        name: dim,
        growth: previousCount > 0 ? ((recentCount - previousCount) / previousCount * 100).toFixed(1) : 'new'
      });
    }
  });
  
  return emerging;
}

/**
 * Detect geographic patterns
 */
function detectGeographicPatterns(caseStudies) {
  const countryData = {};
  const regionData = {
    'North America': ['United States', 'Canada', 'Mexico'],
    'Europe': ['United Kingdom', 'France', 'Germany', 'Italy', 'Spain'],
    'Asia': ['China', 'India', 'Japan', 'Singapore', 'South Korea'],
    'Africa': ['South Africa', 'Kenya', 'Nigeria', 'Ghana'],
    'South America': ['Brazil', 'Argentina', 'Chile'],
    'Oceania': ['Australia', 'New Zealand']
  };
  
  caseStudies.forEach(cs => {
    if (cs.Country) {
      countryData[cs.Country] = (countryData[cs.Country] || 0) + 1;
    }
  });
  
  // Calculate regional distribution
  const regionalDistribution = {};
  Object.entries(regionData).forEach(([region, countries]) => {
    regionalDistribution[region] = countries.reduce((sum, country) => 
      sum + (countryData[country] || 0), 0);
  });
  
  return {
    countryDistribution: countryData,
    regionalDistribution,
    topCountries: Object.entries(countryData)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10),
    geographicDiversity: Object.keys(countryData).length
  };
}

/**
 * Detect methodological patterns
 */
function detectMethodologicalPatterns(caseStudies) {
  const methodCombinations = {};
  const methodByDimension = {};
  
  caseStudies.forEach(cs => {
    const methodology = (cs.Methodology || '').toLowerCase();
    const methods = [];
    
    ['qualitative', 'quantitative', 'mixed-methods', 'survey', 'interview', 'ethnographic'].forEach(method => {
      if (methodology.includes(method)) {
        methods.push(method);
      }
    });
    
    // Track method combinations
    const combo = methods.sort().join('+');
    if (combo) {
      methodCombinations[combo] = (methodCombinations[combo] || 0) + 1;
    }
    
    // Track methods by dimension
    if (cs['Resilient Dimensions'] && methods.length > 0) {
      const dims = cs['Resilient Dimensions'].split(',').map(d => d.trim());
      dims.forEach(dim => {
        if (!methodByDimension[dim]) methodByDimension[dim] = {};
        methods.forEach(method => {
          methodByDimension[dim][method] = (methodByDimension[dim][method] || 0) + 1;
        });
      });
    }
  });
  
  return {
    popularCombinations: Object.entries(methodCombinations)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5),
    methodsByDimension: methodByDimension
  };
}

/**
 * Detect dimension patterns
 */
function detectDimensionPatterns(caseStudies) {
  const dimensionPairs = {};
  const dimensionFrequency = {};
  
  caseStudies.forEach(cs => {
    if (cs['Resilient Dimensions']) {
      const dims = cs['Resilient Dimensions'].split(',').map(d => d.trim());
      
      // Count individual dimensions
      dims.forEach(dim => {
        dimensionFrequency[dim] = (dimensionFrequency[dim] || 0) + 1;
      });
      
      // Count dimension pairs
      for (let i = 0; i < dims.length; i++) {
        for (let j = i + 1; j < dims.length; j++) {
          const pair = [dims[i], dims[j]].sort().join(' + ');
          dimensionPairs[pair] = (dimensionPairs[pair] || 0) + 1;
        }
      }
    }
  });
  
  return {
    frequency: Object.entries(dimensionFrequency)
      .sort(([, a], [, b]) => b - a),
    commonPairs: Object.entries(dimensionPairs)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10),
    averageDimensionsPerStudy: (Object.values(dimensionFrequency).reduce((a, b) => a + b, 0) / caseStudies.length).toFixed(1)
  };
}

/**
 * Detect emerging themes using trend analysis
 */
function detectEmergingThemes(caseStudies) {
  // Sort by date
  const sortedStudies = caseStudies
    .filter(cs => cs.Date)
    .sort((a, b) => new Date(a.Date) - new Date(b.Date));
  
  if (sortedStudies.length < 10) return [];
  
  // Split into early and recent periods
  const midpoint = Math.floor(sortedStudies.length / 2);
  const earlyStudies = sortedStudies.slice(0, midpoint);
  const recentStudies = sortedStudies.slice(midpoint);
  
  // Count keywords in each period
  const earlyKeywords = {};
  const recentKeywords = {};
  
  earlyStudies.forEach(cs => {
    if (cs.Keywords) {
      cs.Keywords.split(',').map(k => k.trim()).forEach(kw => {
        earlyKeywords[kw] = (earlyKeywords[kw] || 0) + 1;
      });
    }
  });
  
  recentStudies.forEach(cs => {
    if (cs.Keywords) {
      cs.Keywords.split(',').map(k => k.trim()).forEach(kw => {
        recentKeywords[kw] = (recentKeywords[kw] || 0) + 1;
      });
    }
  });
  
  // Find emerging themes
  const emerging = [];
  Object.keys(recentKeywords).forEach(kw => {
    const recentFreq = recentKeywords[kw] / recentStudies.length;
    const earlyFreq = earlyKeywords[kw] ? earlyKeywords[kw] / earlyStudies.length : 0;
    
    if (recentFreq > earlyFreq * 1.5 && recentKeywords[kw] >= 3) {
      emerging.push({
        theme: kw,
        recentCount: recentKeywords[kw],
        earlyCount: earlyKeywords[kw] || 0,
        growthFactor: earlyFreq > 0 ? (recentFreq / earlyFreq).toFixed(1) : 'new'
      });
    }
  });
  
  return emerging.sort((a, b) => b.recentCount - a.recentCount);
}