import { NextResponse } from 'next/server';
import { dataSource } from '../../../utils/database';
import { InsightsEngine } from '../../../utils/insights-engine';
import { processCaseStudiesForInsights } from '../../../utils/insights-data-processor';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const analysisType = searchParams.get('type') || 'comprehensive';
    
    console.log('🔄 Generating insights from data...');
    
    // Check if we should use SQLite or Airtable
    const useDatabase = process.env.USE_AIRTABLE !== 'true';
    
    let caseStudies, people, landscapeData;
    
    if (useDatabase) {
      // Fetch from SQLite database
      const [dbCaseStudies, dbPeople, dbDimensions] = await Promise.all([
        dataSource.fetchCaseStudies({ maxRecords: 1000 }),
        dataSource.fetchPeople({ maxRecords: 1000 }),
        dataSource.fetchDimensions()
      ]);
      
      caseStudies = dbCaseStudies;
      people = dbPeople;
      landscapeData = dbDimensions;
    } else {
      // Fetch from Airtable
      const { fetchCaseStudies, fetchPeopleData, fetchLandscapeData } = await import('../../../utils/airtable');
      [caseStudies, people, landscapeData] = await Promise.all([
        fetchCaseStudies({ maxRecords: 100 }).catch(() => []),
        fetchPeopleData({ maxRecords: 100 }).catch(() => []),
        fetchLandscapeData({ maxRecords: 100 }).catch(() => [])
      ]);
    }

    console.log(`📊 Analyzing ${caseStudies.length} case studies, ${people.length} people, ${landscapeData.length} landscape items`);

    // Use the new insights engine for comprehensive analysis
    if (analysisType === 'comprehensive' && caseStudies.length > 0) {
      const engine = new InsightsEngine();
      await engine.initialize(caseStudies);
      const report = engine.generateInsightsReport();
      const visualizationData = engine.getVisualizationData();
      
      return NextResponse.json({
        success: true,
        analysisType: 'comprehensive',
        report,
        visualizations: visualizationData,
        metadata: {
          caseStudiesAnalyzed: caseStudies.length,
          peopleIncluded: people.length,
          landscapeItems: landscapeData.length,
          timestamp: new Date().toISOString()
        }
      });
    }

    // Original simple analysis for backward compatibility
    // Extract themes from case studies
    const dimensionCounts = {};
    const keywordCounts = {};
    const institutionCounts = {};
    const methodologyCounts = {};

    caseStudies.forEach(study => {
      // Count dimensions
      if (study['Resilient Dimensions']) {
        const dimensions = study['Resilient Dimensions'].split(',').map(d => d.trim());
        dimensions.forEach(dim => {
          dimensionCounts[dim] = (dimensionCounts[dim] || 0) + 1;
        });
      }

      // Count keywords/focus areas
      if (study.Keywords) {
        const keywords = study.Keywords.split(',').map(k => k.trim());
        keywords.forEach(keyword => {
          keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
        });
      }

      // Count institutions
      if (study.Institution) {
        institutionCounts[study.Institution] = (institutionCounts[study.Institution] || 0) + 1;
      }

      // Count methodologies
      if (study.Methodology) {
        const methods = study.Methodology.toLowerCase();
        if (methods.includes('mixed-methods')) methodologyCounts['Mixed-Methods'] = (methodologyCounts['Mixed-Methods'] || 0) + 1;
        if (methods.includes('qualitative')) methodologyCounts['Qualitative'] = (methodologyCounts['Qualitative'] || 0) + 1;
        if (methods.includes('quantitative')) methodologyCounts['Quantitative'] = (methodologyCounts['Quantitative'] || 0) + 1;
        if (methods.includes('survey')) methodologyCounts['Survey Research'] = (methodologyCounts['Survey Research'] || 0) + 1;
        if (methods.includes('ethnographic')) methodologyCounts['Ethnographic'] = (methodologyCounts['Ethnographic'] || 0) + 1;
      }
    });

    // Analyze commissioner expertise
    const expertiseCounts = {};
    people.forEach(person => {
      if (person.Expertise) {
        const areas = person.Expertise.split(',').map(e => e.trim());
        areas.forEach(area => {
          expertiseCounts[area] = (expertiseCounts[area] || 0) + 1;
        });
      }
    });

    // Generate insights based on real data
    const insights = [];

    // Top resilience dimensions insight
    const topDimensions = Object.entries(dimensionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
    
    if (topDimensions.length > 0) {
      insights.push({
        id: 'dimensions-analysis',
        type: 'Key Finding',
        title: 'Most Studied Resilience Dimensions',
        message: `Our research portfolio shows strong focus on ${topDimensions[0][0]} (${topDimensions[0][1]} studies), followed by ${topDimensions[1]?.[0] || 'other areas'} and ${topDimensions[2]?.[0] || 'additional dimensions'}.`,
        priority: 'high',
        data: topDimensions,
        category: 'Research Focus'
      });
    }

    // Methodology diversity insight
    const totalMethodologies = Object.values(methodologyCounts).reduce((a, b) => a + b, 0);
    if (totalMethodologies > 0) {
      const topMethod = Object.entries(methodologyCounts).sort(([,a], [,b]) => b - a)[0];
      insights.push({
        id: 'methodology-diversity',
        type: 'Methodological Strength',
        title: 'Research Methodology Diversity',
        message: `Our studies employ diverse methodological approaches, with ${topMethod[0]} being most common (${Math.round(topMethod[1]/totalMethodologies*100)}% of studies). This methodological diversity strengthens the evidence base for resilience interventions.`,
        priority: 'medium',
        data: methodologyCounts,
        category: 'Research Quality'
      });
    }

    // Geographic diversity insight
    const institutionCount = Object.keys(institutionCounts).length;
    if (institutionCount > 0) {
      insights.push({
        id: 'geographic-diversity',
        type: 'Geographic Reach',
        title: 'Global Research Network',
        message: `Research contributions come from ${institutionCount} institutions worldwide, demonstrating global collaboration in resilience research and ensuring diverse geographic perspectives inform our findings.`,
        priority: 'medium',
        data: institutionCounts,
        category: 'Network Analysis'
      });
    }

    // Commissioner expertise insight
    const topExpertise = Object.entries(expertiseCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 4);
    
    if (topExpertise.length > 0) {
      insights.push({
        id: 'expertise-analysis',
        type: 'Commission Strength',
        title: 'Multidisciplinary Expertise',
        message: `The Commission brings together leading expertise in ${topExpertise.map(([area]) => area).join(', ')}, providing comprehensive coverage of resilience science and practice.`,
        priority: 'low',
        data: topExpertise,
        category: 'Commission Capacity'
      });
    }

    // Emerging themes insight based on recent studies
    const recentStudies = caseStudies.filter(study => {
      const date = new Date(study.Date);
      const cutoff = new Date();
      cutoff.setFullYear(cutoff.getFullYear() - 1);
      return date > cutoff;
    });

    if (recentStudies.length > 0) {
      const recentDimensions = {};
      recentStudies.forEach(study => {
        if (study['Resilient Dimensions']) {
          const dimensions = study['Resilient Dimensions'].split(',').map(d => d.trim());
          dimensions.forEach(dim => {
            recentDimensions[dim] = (recentDimensions[dim] || 0) + 1;
          });
        }
      });

      const emergingTheme = Object.entries(recentDimensions).sort(([,a], [,b]) => b - a)[0];
      if (emergingTheme) {
        insights.push({
          id: 'emerging-themes',
          type: 'Emerging Trend',
          title: 'Current Research Priorities',
          message: `Recent research activity shows increased focus on ${emergingTheme[0]}, with ${emergingTheme[1]} studies in the past year, indicating this as a priority area for resilience building.`,
          priority: 'high',
          data: recentDimensions,
          category: 'Trends'
        });
      }
    }

    // Generate metrics based on actual data
    const metrics = [
      {
        id: 'total-studies',
        name: 'Research Studies',
        value: caseStudies.length,
        trend: 'Positive',
        description: 'Total number of completed research studies in our portfolio'
      },
      {
        id: 'commission-size',
        name: 'Commission Members',
        value: people.filter(p => p.Role && (p.Role.includes('Co-Chair') || p.Role.includes('Commissioner'))).length,
        trend: 'Stable',
        description: 'Total number of Commission co-chairs and commissioners'
      },
      {
        id: 'dimensions-covered',
        name: 'Resilience Dimensions',
        value: Object.keys(dimensionCounts).length,
        trend: 'Positive',
        description: 'Number of distinct resilience dimensions being studied'
      },
      {
        id: 'global-institutions',
        name: 'Partner Institutions',
        value: institutionCount,
        trend: 'Positive',
        description: 'Number of institutions contributing research'
      }
    ];

    console.log(`✅ Generated ${insights.length} insights and ${metrics.length} metrics from real data`);

    return NextResponse.json({ 
      success: true,
      analysisType: 'simple',
      insights,
      metrics,
      themes: {
        topDimensions: topDimensions.slice(0, 5),
        topKeywords: Object.entries(keywordCounts).sort(([,a], [,b]) => b - a).slice(0, 5),
        topExpertise: topExpertise.slice(0, 5),
        methodologies: methodologyCounts
      },
      dataSource: 'airtable',
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('🔴 Error generating insights:', error);
    
    // Fallback to enhanced sample insights
    const fallbackInsights = [
      {
        id: 'pandemic-preparedness',
        type: 'Critical Priority',
        title: 'Pandemic Preparedness Gaps',
        message: 'Analysis reveals significant gaps in community-level pandemic preparedness, particularly in information systems and trust-building mechanisms.',
        priority: 'high',
        category: 'Healthcare Systems',
        recommendation: 'Invest in community health worker programs and trusted messenger networks'
      },
      {
        id: 'information-resilience',
        type: 'Emerging Challenge',
        title: 'Information System Vulnerabilities',
        message: 'Misinformation and declining trust in public health authorities present major challenges to societal resilience during health emergencies.',
        priority: 'high',
        category: 'Information Systems',
        recommendation: 'Develop community-based information verification systems and enhance science communication'
      },
      {
        id: 'community-networks',
        type: 'Success Factor',
        title: 'Community Network Strength',
        message: 'Strong social networks and mutual aid systems emerged as key resilience factors during COVID-19, particularly in marginalized communities.',
        priority: 'medium',
        category: 'Social Equity & Well-being',
        recommendation: 'Formalize and support existing community networks in emergency planning'
      }
    ];

    const fallbackMetrics = [
      { id: 'm1', name: 'Research Studies', value: 15, trend: 'Positive' },
      { id: 'm2', name: 'Commission Members', value: 26, trend: 'Stable' },
      { id: 'm3', name: 'Resilience Dimensions', value: 8, trend: 'Positive' },
      { id: 'm4', name: 'Partner Institutions', value: 12, trend: 'Positive' }
    ];

    return NextResponse.json({ 
      success: false,
      analysisType: 'fallback',
      insights: fallbackInsights,
      metrics: fallbackMetrics,
      dataSource: 'fallback',
      error: error.message 
    });
  }
}