import { NextResponse } from 'next/server';
import { 
  fetchFDIData, 
  fetchHealthInfrastructureData, 
  fetchFederalHealthSpending 
} from '../../../../utils/investment-data-fetcher';
import { 
  calculateResilienceScore, 
  projectInvestmentOutcomes,
  validateInvestmentAllocation 
} from '../../../../utils/investment-resilience-models';

// GET /api/policy-modeling/investment
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dataType = searchParams.get('type') || 'summary';
    const year = searchParams.get('year') || new Date().getFullYear() - 1;
    const state = searchParams.get('state');
    const scenario = searchParams.get('scenario');

    let responseData = {};

    switch (dataType) {
      case 'fdi':
        // Fetch Foreign Direct Investment data
        responseData = await fetchFDIData({
          year: parseInt(year),
          direction: searchParams.get('direction') || 'inward',
          series: searchParams.get('series') || 'position'
        });
        break;

      case 'health-infrastructure':
        // Fetch health infrastructure metrics
        responseData = await fetchHealthInfrastructureData({
          state,
          metric: searchParams.get('metric') || 'all',
          year: parseInt(year)
        });
        break;

      case 'federal-spending':
        // Fetch federal health spending
        responseData = await fetchFederalHealthSpending({
          state,
          agency: searchParams.get('agency') || 'all',
          fiscalYear: parseInt(year)
        });
        break;

      case 'resilience-score':
        // Calculate resilience score for given indicators
        const indicators = JSON.parse(searchParams.get('indicators') || '{}');
        const score = calculateResilienceScore(indicators);
        responseData = {
          score,
          interpretation: getScoreInterpretation(score),
          recommendations: getRecommendations(indicators)
        };
        break;

      case 'summary':
      default:
        // Fetch summary data combining multiple sources
        const [fdi, health, spending] = await Promise.all([
          fetchFDIData({ year: parseInt(year) }),
          fetchHealthInfrastructureData({ state, year: parseInt(year) }),
          fetchFederalHealthSpending({ state, fiscalYear: parseInt(year) })
        ]);

        responseData = {
          summary: {
            year,
            state: state || 'National',
            totalFDI: fdi.data.reduce((sum, item) => sum + item.value, 0),
            healthMetrics: health.data,
            federalSpending: spending.data.totalSpending,
            timestamp: new Date().toISOString()
          },
          sources: {
            fdi: fdi.metadata,
            health: health.metadata,
            spending: spending.metadata
          }
        };
    }

    return NextResponse.json({
      success: true,
      data: responseData,
      parameters: {
        type: dataType,
        year,
        state,
        scenario
      }
    });

  } catch (error) {
    console.error('Policy modeling API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

// POST /api/policy-modeling/investment
export async function POST(request) {
  try {
    const body = await request.json();
    const { action, data } = body;

    let result = {};

    switch (action) {
      case 'project-outcomes':
        // Project investment outcomes
        const { investment, type, population, timeHorizon } = data;
        result = projectInvestmentOutcomes(
          investment,
          type,
          population,
          timeHorizon
        );
        break;

      case 'validate-allocation':
        // Validate investment allocation
        result = validateInvestmentAllocation(data.allocations);
        break;

      case 'compare-scenarios':
        // Compare multiple investment scenarios
        result = await compareScenarios(data.scenarios);
        break;

      case 'optimize-portfolio':
        // Optimize investment portfolio for maximum impact
        result = optimizeInvestmentPortfolio(data);
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return NextResponse.json({
      success: true,
      action,
      result
    });

  } catch (error) {
    console.error('Policy modeling POST error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 400 });
  }
}

// Helper functions
function getScoreInterpretation(score) {
  if (score >= 80) return 'Excellent resilience - Well prepared for pandemic threats';
  if (score >= 65) return 'Good resilience - Moderate preparedness with some gaps';
  if (score >= 50) return 'Fair resilience - Significant improvements needed';
  if (score >= 35) return 'Poor resilience - Major vulnerabilities present';
  return 'Critical - Extremely vulnerable to pandemic threats';
}

function getRecommendations(indicators) {
  const recommendations = [];
  
  // Analyze each dimension
  const dimensions = ['healthSystem', 'surveillance', 'governance', 'community'];
  
  dimensions.forEach(dim => {
    const dimIndicators = indicators[dim] || {};
    const gaps = [];
    
    // Check for critical gaps
    Object.entries(dimIndicators).forEach(([key, value]) => {
      if (value < 50) {
        gaps.push(key);
      }
    });
    
    if (gaps.length > 0) {
      recommendations.push({
        dimension: dim,
        priority: gaps.length > 2 ? 'high' : 'medium',
        gaps,
        action: `Strengthen ${dim} capabilities, focusing on ${gaps.join(', ')}`
      });
    }
  });
  
  return recommendations;
}

async function compareScenarios(scenarios) {
  const results = await Promise.all(
    scenarios.map(async (scenario) => {
      const outcomes = projectInvestmentOutcomes(
        scenario.investment,
        scenario.type,
        scenario.population,
        scenario.timeHorizon
      );
      
      return {
        name: scenario.name,
        investment: scenario.investment,
        outcomes,
        costBenefitRatio: outcomes.roi
      };
    })
  );
  
  // Sort by ROI
  results.sort((a, b) => b.costBenefitRatio - a.costBenefitRatio);
  
  return {
    scenarios: results,
    bestOption: results[0],
    comparison: generateComparison(results)
  };
}

function generateComparison(results) {
  const baseline = results.find(r => r.name === 'baseline') || results[0];
  
  return results.map(scenario => ({
    name: scenario.name,
    relativeROI: (scenario.costBenefitRatio / baseline.costBenefitRatio - 1) * 100,
    relativeImpact: (scenario.outcomes.economicReturn / baseline.outcomes.economicReturn - 1) * 100
  }));
}

function optimizeInvestmentPortfolio(data) {
  const { totalBudget, population, constraints = {} } = data;
  
  // Simple optimization - allocate based on ROI
  const categories = [
    { type: 'surveillanceInvestment', weight: 0.35 },
    { type: 'healthSystemInvestment', weight: 0.30 },
    { type: 'communityInvestment', weight: 0.20 },
    { type: 'researchInvestment', weight: 0.15 }
  ];
  
  let allocations = {};
  let totalAllocated = 0;
  
  categories.forEach(cat => {
    const allocation = totalBudget * cat.weight;
    allocations[cat.type] = allocation;
    totalAllocated += allocation;
  });
  
  // Project outcomes for optimal allocation
  const outcomes = {};
  Object.entries(allocations).forEach(([type, amount]) => {
    outcomes[type] = projectInvestmentOutcomes(amount, type, population, 5);
  });
  
  return {
    allocations,
    totalInvestment: totalAllocated,
    projectedOutcomes: outcomes,
    aggregateROI: calculateAggregateROI(outcomes, totalBudget)
  };
}

function calculateAggregateROI(outcomes, totalInvestment) {
  const totalReturn = Object.values(outcomes).reduce(
    (sum, outcome) => sum + outcome.economicReturn, 
    0
  );
  
  return {
    totalReturn,
    roi: (totalReturn - totalInvestment) / totalInvestment,
    paybackPeriod: totalInvestment / (totalReturn / 5) // Assuming 5-year horizon
  };
}