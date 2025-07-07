// Process case study data into insights metrics and visualizations

export function processCaseStudiesForInsights(caseStudies) {
  if (!caseStudies || caseStudies.length === 0) {
    return {
      metrics: [],
      insights: [],
      visualizations: {}
    };
  }

  // Count studies by dimension
  const dimensionCounts = {};
  const studyTypesCounts = {};
  const keywordFrequency = {};
  const monthlyTrends = {};
  
  caseStudies.forEach(study => {
    // Count dimensions
    if (study.dimensionsList && Array.isArray(study.dimensionsList)) {
      study.dimensionsList.forEach(dim => {
        dimensionCounts[dim] = (dimensionCounts[dim] || 0) + 1;
      });
    }
    
    // Count study types
    if (study.Type) {
      studyTypesCounts[study.Type] = (studyTypesCounts[study.Type] || 0) + 1;
    }
    
    // Count keywords
    if (study.Keywords) {
      const keywords = study.Keywords.split(',').map(k => k.trim());
      keywords.forEach(keyword => {
        if (keyword) {
          keywordFrequency[keyword] = (keywordFrequency[keyword] || 0) + 1;
        }
      });
    }
    
    // Track monthly trends
    if (study.Date) {
      const date = new Date(study.Date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyTrends[monthKey] = (monthlyTrends[monthKey] || 0) + 1;
    }
  });

  // Generate metrics from the data
  const metrics = Object.entries(dimensionCounts).map(([dimension, count]) => {
    const percentage = (count / caseStudies.length * 100).toFixed(1);
    return {
      id: `dim-${dimension.toLowerCase().replace(/\s+/g, '-')}`,
      name: `${dimension} Coverage`,
      value: `${percentage}%`,
      changePercent: (Math.random() * 10 - 5).toFixed(1), // Simulated change
      dimension: dimension,
      trend: Math.random() > 0.5 ? 'Positive' : 'Stable',
      description: `${count} case studies focus on ${dimension}`
    };
  });

  // Add overall metrics
  metrics.unshift({
    id: 'total-studies',
    name: 'Total Case Studies',
    value: caseStudies.length.toString(),
    changePercent: '0',
    dimension: 'Overall',
    trend: 'Stable',
    description: 'Total number of case studies in the database'
  });

  // Generate insights based on the data
  const insights = [];
  
  // Find the most and least studied dimensions
  const sortedDimensions = Object.entries(dimensionCounts).sort((a, b) => b[1] - a[1]);
  if (sortedDimensions.length > 0) {
    const [topDim, topCount] = sortedDimensions[0];
    const [bottomDim, bottomCount] = sortedDimensions[sortedDimensions.length - 1];
    
    insights.push({
      dimension: topDim,
      type: 'Key Finding',
      message: `${topDim} is the most studied dimension with ${topCount} case studies (${(topCount/caseStudies.length*100).toFixed(1)}% of total)`,
      priority: 'medium',
      recommendation: `Continue leveraging strong research in ${topDim} while exploring cross-dimensional connections`
    });
    
    if (bottomCount < topCount * 0.3) {
      insights.push({
        dimension: bottomDim,
        type: 'Research Gap',
        message: `${bottomDim} is underrepresented with only ${bottomCount} case studies`,
        priority: 'high',
        recommendation: `Increase focus on ${bottomDim} to ensure comprehensive resilience coverage`
      });
    }
  }

  // Analyze study type distribution
  const dominantStudyType = Object.entries(studyTypesCounts)
    .sort((a, b) => b[1] - a[1])[0];
  if (dominantStudyType) {
    insights.push({
      dimension: 'Knowledge & Learning',
      type: 'Methodology Trend',
      message: `${dominantStudyType[0]} is the dominant study type, used in ${dominantStudyType[1]} studies`,
      priority: 'low',
      recommendation: 'Consider diversifying research methodologies for more comprehensive insights'
    });
  }

  // Generate visualization data
  const visualizations = {
    dimensionDistribution: Object.entries(dimensionCounts).map(([name, value]) => ({
      name,
      value,
      percentage: (value / caseStudies.length * 100).toFixed(1)
    })),
    monthlyTrends: Object.entries(monthlyTrends).sort().map(([month, count]) => ({
      month,
      count
    })),
    topKeywords: Object.entries(keywordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([keyword, count]) => ({
        keyword,
        count
      })),
    studyTypes: Object.entries(studyTypesCounts).map(([type, count]) => ({
      type,
      count,
      percentage: (count / caseStudies.length * 100).toFixed(1)
    }))
  };

  return {
    metrics,
    insights,
    visualizations,
    summary: {
      totalStudies: caseStudies.length,
      dimensionsCovered: Object.keys(dimensionCounts).length,
      studyTypes: Object.keys(studyTypesCounts).length,
      uniqueKeywords: Object.keys(keywordFrequency).length
    }
  };
}

// Generate trend data for a specific dimension
export function generateDimensionTrendData(dimension, months = 12) {
  const data = [];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  let baseValue = 50 + Math.random() * 30;
  
  for (let i = 0; i < months; i++) {
    const monthIndex = (currentMonth - months + i + 1 + 12) % 12;
    const trend = (Math.random() - 0.4) * 5; // Slight upward bias
    const seasonalVariation = Math.sin((i / 12) * Math.PI * 2) * 3;
    
    baseValue = Math.max(20, Math.min(100, baseValue + trend + seasonalVariation));
    
    data.push({
      month: monthNames[monthIndex],
      score: Math.round(baseValue),
      benchmark: 65,
      studies: Math.floor(Math.random() * 10) + 1
    });
  }
  
  return data;
}