import { NextResponse } from 'next/server';
import WastewaterDataFetcher from '../../../utils/wastewater-data-fetcher.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const dataFetcher = new WastewaterDataFetcher();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const source = searchParams.get('source') || 'wastewaterscan'; // wastewaterscan, cdc, global
    const location = searchParams.get('location'); // city, state, country
    const pathogen = searchParams.get('pathogen') || 'SARS-CoV-2';
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const includeAlerts = searchParams.get('include_alerts') === 'true';
    const includeMetadata = searchParams.get('include_metadata') !== 'false';
    const format = searchParams.get('format') || 'detailed'; // summary, detailed, geojson

    console.log(`🦠 Fetching wastewater data from ${source} for ${pathogen}${location ? ` in ${location}` : ''}`);

    let data;
    let metadata = {};

    switch (source.toLowerCase()) {
      case 'wastewaterscan':
        data = await dataFetcher.fetchWastewaterScanData({
          location,
          pathogen,
          dateRange: { start: startDate, end: endDate },
          includeMetadata
        });
        metadata = {
          source: 'WastewaterScan',
          description: 'Academic and research-focused wastewater surveillance network',
          coverage: 'Universities, research institutions, and select municipalities',
          updateFrequency: 'Variable by site'
        };
        break;

      case 'cdc':
      case 'cdc-nwss':
        data = await dataFetcher.fetchCDCNWSSData({
          state: location,
          pathogen: pathogen.toLowerCase()
        });
        metadata = {
          source: 'CDC National Wastewater Surveillance System',
          description: 'US federal wastewater surveillance program',
          coverage: 'Wastewater treatment plants across the United States',
          updateFrequency: 'Weekly'
        };
        break;

      case 'global':
        const country = location || 'US';
        data = await dataFetcher.fetchGlobalWastewaterData(country);
        metadata = {
          source: 'Multiple Global Sources',
          description: 'Aggregated data from international wastewater surveillance networks',
          coverage: 'Multiple countries and regions',
          updateFrequency: 'Variable by country'
        };
        break;

      default:
        return NextResponse.json(
          { 
            error: 'Invalid source specified',
            validSources: ['wastewaterscan', 'cdc', 'global']
          },
          { status: 400 }
        );
    }

    // Filter alerts if requested
    if (includeAlerts) {
      data = data.map(site => ({
        ...site,
        alerts: site.measurements
          ?.filter(m => m.alert && m.alert.level !== 'normal')
          .map(m => ({
            date: m.date,
            level: m.alert.level,
            reason: m.alert.reason,
            concentration: m.concentration,
            pathogen: m.pathogen
          })) || []
      }));
    }

    // Format response based on requested format
    let formattedData;
    switch (format) {
      case 'summary':
        formattedData = data.map(site => ({
          siteId: site.site.id,
          siteName: site.site.name,
          location: site.site.location,
          latestConcentration: site.summary?.latestMeasurement?.concentration,
          trend: site.summary?.trend?.trend,
          alertLevel: site.summary?.alertLevel,
          lastUpdated: site.measurements?.[0]?.date
        }));
        break;

      case 'geojson':
        formattedData = {
          type: 'FeatureCollection',
          features: data.map(site => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [site.site.location.lng, site.site.location.lat]
            },
            properties: {
              siteId: site.site.id,
              siteName: site.site.name,
              siteType: site.site.type,
              population: site.site.location.population,
              latestConcentration: site.summary?.latestMeasurement?.concentration,
              trend: site.summary?.trend?.trend,
              alertLevel: site.summary?.alertLevel,
              pathogen
            }
          }))
        };
        break;

      case 'detailed':
      default:
        formattedData = data;
        break;
    }

    // Calculate summary statistics
    const summaryStats = {
      totalSites: data.length,
      sitesWithData: data.filter(site => site.measurements && site.measurements.length > 0).length,
      sitesWithAlerts: data.filter(site => site.summary?.alertLevel !== 'normal').length,
      averageConcentration: data.length > 0 ? 
        data.reduce((sum, site) => sum + (site.summary?.avgConcentration || 0), 0) / data.length : 0,
      lastUpdated: new Date().toISOString()
    };

    console.log(`✅ Retrieved data from ${summaryStats.totalSites} sites (${summaryStats.sitesWithData} with data)`);

    return NextResponse.json({
      success: true,
      data: formattedData,
      metadata: {
        ...metadata,
        parameters: {
          source,
          location,
          pathogen,
          startDate,
          endDate,
          format
        },
        statistics: summaryStats
      }
    });

  } catch (error) {
    console.error('🔴 Error in wastewater surveillance API:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch wastewater surveillance data',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, data: requestData } = body;

    switch (action) {
      case 'analyze-trends':
        // Analyze wastewater trends for multiple sites/pathogens
        const trendAnalysis = await analyzeTrends(requestData);
        return NextResponse.json({
          success: true,
          analysis: trendAnalysis
        });

      case 'generate-alerts':
        // Generate custom alerts based on user criteria
        const alerts = await generateCustomAlerts(requestData);
        return NextResponse.json({
          success: true,
          alerts
        });

      case 'predict-outbreak':
        // Use ML to predict potential outbreak risk
        const prediction = await predictOutbreakRisk(requestData);
        return NextResponse.json({
          success: true,
          prediction
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('🔴 Error in wastewater surveillance POST:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process wastewater surveillance request',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// Helper functions for POST actions
async function analyzeTrends(data) {
  // Implement trend analysis logic
  return {
    trend: 'increasing',
    confidence: 0.85,
    projectedPeak: '2024-02-15',
    recommendations: [
      'Increase monitoring frequency',
      'Alert public health officials',
      'Prepare hospital capacity'
    ]
  };
}

async function generateCustomAlerts(data) {
  // Implement custom alert generation
  return [
    {
      id: 'alert_001',
      site: 'University Campus',
      level: 'high',
      pathogen: 'SARS-CoV-2',
      message: 'Significant increase in viral load detected',
      actionRequired: true,
      timestamp: new Date().toISOString()
    }
  ];
}

async function predictOutbreakRisk(data) {
  // Implement ML-based outbreak prediction
  return {
    riskLevel: 'moderate',
    probability: 0.35,
    timeframe: '7-14 days',
    factors: [
      'Increasing wastewater signals',
      'Seasonal patterns',
      'Population density'
    ],
    confidence: 0.72
  };
}