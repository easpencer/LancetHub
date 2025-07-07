import { NextResponse } from 'next/server';
import { fetchCaseStudies } from '../../../../utils/airtable';
import { 
  clusterCaseStudies, 
  detectPatterns, 
  findSimilarCases,
  calculateCaseSimilarity 
} from '../../../../utils/pattern-analyzer';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const analysisType = searchParams.get('type') || 'comprehensive';
    const caseStudyId = searchParams.get('caseStudyId');
    const clusterCount = parseInt(searchParams.get('clusters') || '5');
    const limit = parseInt(searchParams.get('limit') || '100');
    
    console.log('🔍 Analyzing patterns across case studies...');
    
    // Fetch case studies
    const caseStudies = await fetchCaseStudies({ maxRecords: limit });
    
    if (caseStudies.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No case studies found for pattern analysis'
      });
    }
    
    // If similarity analysis for specific case study
    if (caseStudyId && analysisType === 'similarity') {
      const targetCase = caseStudies.find(cs => cs.id === caseStudyId);
      if (!targetCase) {
        return NextResponse.json({
          success: false,
          error: 'Case study not found'
        });
      }
      
      const similar = findSimilarCases(targetCase, caseStudies, 10);
      
      return NextResponse.json({
        success: true,
        targetCase: {
          id: targetCase.id,
          title: targetCase.Title
        },
        similarCases: similar.map(({ caseStudy, similarity }) => ({
          id: caseStudy.id,
          title: caseStudy.Title,
          similarity: (similarity * 100).toFixed(1) + '%',
          dimensions: caseStudy['Resilient Dimensions'],
          methodology: caseStudy.Methodology
        })),
        timestamp: new Date().toISOString()
      });
    }
    
    // Comprehensive pattern analysis
    const patterns = detectPatterns(caseStudies);
    
    // Clustering analysis
    const clusters = clusterCaseStudies(caseStudies, clusterCount);
    
    // Generate pattern insights
    const insights = [];
    
    // Temporal insights
    if (patterns.temporalPatterns.trends.growthRate) {
      insights.push({
        type: 'temporal-trend',
        title: 'Research Growth Trend',
        message: `Research activity has ${patterns.temporalPatterns.trends.growthRate > 0 ? 'increased' : 'decreased'} by ${Math.abs(patterns.temporalPatterns.trends.growthRate)}% over the study period`,
        data: patterns.temporalPatterns.trends
      });
    }
    
    // Geographic insights
    if (patterns.geographicPatterns.geographicDiversity > 5) {
      insights.push({
        type: 'geographic-diversity',
        title: 'Global Research Distribution',
        message: `Research spans ${patterns.geographicPatterns.geographicDiversity} countries, demonstrating strong global collaboration`,
        data: {
          topCountries: patterns.geographicPatterns.topCountries.slice(0, 5),
          regionalDistribution: patterns.geographicPatterns.regionalDistribution
        }
      });
    }
    
    // Methodological insights
    if (patterns.methodologicalPatterns.popularCombinations.length > 0) {
      insights.push({
        type: 'methodology-patterns',
        title: 'Methodological Approaches',
        message: `Mixed-methods approaches are prevalent, with "${patterns.methodologicalPatterns.popularCombinations[0][0]}" being the most common combination`,
        data: patterns.methodologicalPatterns.popularCombinations
      });
    }
    
    // Dimension patterns
    if (patterns.dimensionPatterns.commonPairs.length > 0) {
      insights.push({
        type: 'dimension-combinations',
        title: 'Resilience Dimension Patterns',
        message: `Studies typically address ${patterns.dimensionPatterns.averageDimensionsPerStudy} dimensions simultaneously, with "${patterns.dimensionPatterns.commonPairs[0][0]}" being the most common combination`,
        data: {
          topPairs: patterns.dimensionPatterns.commonPairs.slice(0, 5),
          averagePerStudy: patterns.dimensionPatterns.averageDimensionsPerStudy
        }
      });
    }
    
    // Emerging themes
    if (patterns.emergingThemes.length > 0) {
      insights.push({
        type: 'emerging-themes',
        title: 'Emerging Research Areas',
        message: `${patterns.emergingThemes.length} emerging themes identified, with "${patterns.emergingThemes[0].theme}" showing the strongest growth`,
        data: patterns.emergingThemes.slice(0, 5)
      });
    }
    
    // Cluster insights
    const clusterInsights = clusters.map((cluster, idx) => ({
      clusterId: cluster.id,
      size: cluster.size,
      percentage: ((cluster.size / caseStudies.length) * 100).toFixed(1) + '%',
      characteristics: {
        primaryDimensions: cluster.characteristics.topDimensions.slice(0, 3),
        primaryKeywords: cluster.characteristics.topKeywords.slice(0, 5),
        methodology: cluster.characteristics.topMethodologies[0]?.name || 'Mixed',
        geography: cluster.characteristics.topCountries[0]?.name || 'Global'
      }
    }));
    
    return NextResponse.json({
      success: true,
      summary: {
        totalCaseStudies: caseStudies.length,
        clustersIdentified: clusters.length,
        geographicDiversity: patterns.geographicPatterns.geographicDiversity,
        temporalRange: Object.keys(patterns.temporalPatterns.yearlyData).length + ' years',
        emergingThemes: patterns.emergingThemes.length
      },
      patterns: {
        temporal: patterns.temporalPatterns,
        geographic: patterns.geographicPatterns,
        methodological: patterns.methodologicalPatterns,
        dimensional: patterns.dimensionPatterns,
        emerging: patterns.emergingThemes
      },
      clusters: clusterInsights,
      insights,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('🔴 Error in pattern analysis:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { caseStudies, analysisType = 'patterns' } = body;
    
    if (!caseStudies || !Array.isArray(caseStudies) || caseStudies.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Case studies array is required'
      }, { status: 400 });
    }
    
    let result;
    
    switch (analysisType) {
      case 'patterns':
        result = detectPatterns(caseStudies);
        break;
        
      case 'clusters':
        const k = Math.min(8, Math.max(3, Math.floor(caseStudies.length / 10)));
        result = clusterCaseStudies(caseStudies, k);
        break;
        
      case 'similarity':
        // Calculate similarity matrix for all case studies
        const similarityMatrix = [];
        for (let i = 0; i < caseStudies.length; i++) {
          const similarities = [];
          for (let j = 0; j < caseStudies.length; j++) {
            similarities.push(calculateCaseSimilarity(caseStudies[i], caseStudies[j]));
          }
          similarityMatrix.push(similarities);
        }
        result = { similarityMatrix };
        break;
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid analysis type'
        }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      analysisType,
      result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('🔴 Error in pattern analysis:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}