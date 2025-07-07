import { NextResponse } from 'next/server';
import { fetchCaseStudies } from '../../../../utils/airtable';
import { 
  extractOutcomes,
  standardizeOutcomes,
  calculateAggregateOutcomes,
  generateOutcomeInsights,
  trackOutcomeTrends,
  extractMetrics
} from '../../../../utils/outcome-tracker';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const caseStudyId = searchParams.get('caseStudyId');
    const analysisType = searchParams.get('type') || 'comprehensive';
    const limit = parseInt(searchParams.get('limit') || '100');
    
    console.log('📊 Analyzing outcomes and metrics...');
    
    // Fetch case studies
    const caseStudies = await fetchCaseStudies({ maxRecords: limit });
    
    if (caseStudies.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No case studies found for outcome analysis'
      });
    }
    
    // If specific case study requested
    if (caseStudyId) {
      const caseStudy = caseStudies.find(cs => cs.id === caseStudyId);
      if (!caseStudy) {
        return NextResponse.json({
          success: false,
          error: 'Case study not found'
        });
      }
      
      const outcomeText = [
        caseStudy.Outcomes || '',
        caseStudy.Impact || '',
        caseStudy.Results || '',
        caseStudy.Description || ''
      ].join(' ');
      
      const outcomes = extractOutcomes(outcomeText);
      const metrics = extractMetrics(outcomeText);
      
      return NextResponse.json({
        success: true,
        caseStudy: {
          id: caseStudy.id,
          title: caseStudy.Title
        },
        outcomes,
        metrics,
        summary: {
          quantitativeOutcomes: outcomes.quantitative.length,
          qualitativeOutcomes: outcomes.qualitative.length,
          impacts: outcomes.impacts.length,
          metricsFound: metrics.length
        },
        timestamp: new Date().toISOString()
      });
    }
    
    // Comprehensive outcome analysis
    const outcomeAnalysis = generateOutcomeInsights(caseStudies);
    const trends = trackOutcomeTrends(caseStudies);
    
    // Extract all metrics for visualization
    const allMetrics = [];
    caseStudies.forEach(cs => {
      const outcomeText = [
        cs.Outcomes || '',
        cs.Impact || '',
        cs.Results || ''
      ].join(' ');
      
      const metrics = extractMetrics(outcomeText);
      metrics.forEach(metric => {
        allMetrics.push({
          ...metric,
          caseStudyId: cs.id,
          caseStudyTitle: cs.Title
        });
      });
    });
    
    // Generate outcome-based insights
    const insights = [...outcomeAnalysis.insights];
    
    // Add trend insights
    if (trends.trend === 'improving') {
      insights.push({
        type: 'trend-analysis',
        title: 'Improving Outcome Trends',
        message: 'Analysis shows improving outcome metrics over time, indicating growing effectiveness of resilience interventions',
        priority: 'high',
        data: trends.yearlyAverages
      });
    } else if (trends.trend === 'declining') {
      insights.push({
        type: 'trend-analysis',
        title: 'Declining Outcome Trends',
        message: 'Recent interventions show reduced effectiveness compared to earlier studies, suggesting need for innovation',
        priority: 'high',
        data: trends.yearlyAverages
      });
    }
    
    // Category distribution insights
    const categoryDist = outcomeAnalysis.aggregates.categoryDistribution;
    if (Object.keys(categoryDist).length > 0) {
      const topCategory = Object.entries(categoryDist)
        .sort(([, a], [, b]) => b - a)[0];
      
      insights.push({
        type: 'outcome-categories',
        title: 'Primary Outcome Domains',
        message: `Outcomes primarily focus on ${topCategory[0]} (${topCategory[1]} studies), followed by other key areas`,
        priority: 'medium',
        data: categoryDist
      });
    }
    
    // Success metrics summary
    const successMetrics = {
      averageImprovement: outcomeAnalysis.aggregates.averageImprovement.toFixed(1) + '%',
      medianImprovement: outcomeAnalysis.aggregates.medianImprovement.toFixed(1) + '%',
      improvementRange: `${outcomeAnalysis.aggregates.rangeOfImpact.min.toFixed(1)}% - ${outcomeAnalysis.aggregates.rangeOfImpact.max.toFixed(1)}%`,
      topPerformers: outcomeAnalysis.aggregates.topPerformers.length,
      studiesWithMetrics: allMetrics.length
    };
    
    return NextResponse.json({
      success: true,
      summary: {
        totalCaseStudies: caseStudies.length,
        studiesWithQuantitativeOutcomes: outcomeAnalysis.metrics.percentageChanges.length,
        totalMetricsExtracted: allMetrics.length,
        ...successMetrics
      },
      outcomes: {
        quantitative: outcomeAnalysis.metrics.percentageChanges.slice(0, 20),
        scores: outcomeAnalysis.metrics.scores.slice(0, 10),
        multipliers: outcomeAnalysis.metrics.multipliers.slice(0, 10),
        categories: outcomeAnalysis.metrics.categories
      },
      aggregates: outcomeAnalysis.aggregates,
      trends: {
        overall: trends.trend,
        yearlyData: trends.yearlyAverages,
        timeSeriesData: trends.timeSeriesData
      },
      topPerformers: outcomeAnalysis.aggregates.topPerformers,
      insights,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('🔴 Error in outcome analysis:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { text, extractType = 'all' } = body;
    
    if (!text) {
      return NextResponse.json({
        success: false,
        error: 'Text content is required'
      }, { status: 400 });
    }
    
    let result;
    
    switch (extractType) {
      case 'metrics':
        result = extractMetrics(text);
        break;
        
      case 'outcomes':
        result = extractOutcomes(text);
        break;
        
      case 'all':
      default:
        result = {
          metrics: extractMetrics(text),
          outcomes: extractOutcomes(text)
        };
        break;
    }
    
    return NextResponse.json({
      success: true,
      extractType,
      result,
      summary: {
        metricsFound: Array.isArray(result) ? result.length : result.metrics?.length || 0,
        outcomeTypes: result.outcomes ? {
          quantitative: result.outcomes.quantitative.length,
          qualitative: result.outcomes.qualitative.length,
          impacts: result.outcomes.impacts.length
        } : null
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('🔴 Error extracting outcomes:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}