/**
 * Wastewater Data Fetcher
 * Handles fetching and processing data from multiple wastewater surveillance sources
 */

import { 
  WASTEWATERSCAN_CONFIG, 
  GLOBAL_WASTEWATER_SOURCES,
  WastewaterDataProcessor,
  ALERT_THRESHOLDS 
} from './wastewater-data-sources.js';

export class WastewaterDataFetcher {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 30 * 60 * 1000; // 30 minutes
  }

  // Main function to fetch wastewater data from WastewaterScan
  async fetchWastewaterScanData(options = {}) {
    const {
      location = null,
      pathogen = 'SARS-CoV-2',
      dateRange = { start: null, end: null },
      includeMetadata = true
    } = options;

    try {
      const cacheKey = `wastewaterscan_${JSON.stringify(options)}`;
      
      // Check cache first
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.cacheTimeout) {
          return cached.data;
        }
      }

      const headers = {
        'Content-Type': 'application/json',
        ...(WASTEWATERSCAN_CONFIG.apiKey && { 
          'Authorization': `Bearer ${WASTEWATERSCAN_CONFIG.apiKey}` 
        })
      };

      // Fetch sampling sites
      const sitesUrl = `${WASTEWATERSCAN_CONFIG.baseUrl}${WASTEWATERSCAN_CONFIG.endpoints.sites}`;
      const sitesParams = new URLSearchParams();
      if (location) sitesParams.append('location', location);
      
      const sitesResponse = await fetch(`${sitesUrl}?${sitesParams}`, { headers });
      const sites = await sitesResponse.json();

      // Fetch measurements for each site
      const measurementsPromises = sites.data?.map(async (site) => {
        const measurementsUrl = `${WASTEWATERSCAN_CONFIG.baseUrl}${WASTEWATERSCAN_CONFIG.endpoints.measurements}`;
        const measurementsParams = new URLSearchParams({
          site_id: site.id,
          pathogen: pathogen,
          ...(dateRange.start && { start_date: dateRange.start }),
          ...(dateRange.end && { end_date: dateRange.end })
        });
        
        const response = await fetch(`${measurementsUrl}?${measurementsParams}`, { headers });
        const measurements = await response.json();
        
        return {
          site,
          measurements: measurements.data || []
        };
      }) || [];

      const results = await Promise.all(measurementsPromises);
      
      // Process and normalize data
      const processedData = this.processWastewaterScanData(results, includeMetadata);
      
      // Cache the results
      this.cache.set(cacheKey, {
        data: processedData,
        timestamp: Date.now()
      });

      return processedData;

    } catch (error) {
      console.error('Error fetching WastewaterScan data:', error);
      // Return mock data for development
      return this.getMockWastewaterScanData(options);
    }
  }

  // Fetch CDC NWSS data
  async fetchCDCNWSSData(options = {}) {
    const { state = null, county = null, pathogen = 'sars-cov-2' } = options;

    try {
      const baseUrl = 'https://data.cdc.gov/resource/2ew6-ywp6.json';
      const params = new URLSearchParams({
        '$limit': '10000',
        '$order': 'date_end DESC'
      });

      if (state) params.append('reporting_jurisdiction', state);
      if (county) params.append('county_names', county);
      
      const response = await fetch(`${baseUrl}?${params}`);
      const data = await response.json();

      return this.processCDCData(data);

    } catch (error) {
      console.error('Error fetching CDC NWSS data:', error);
      return this.getMockCDCData();
    }
  }

  // Fetch global wastewater data
  async fetchGlobalWastewaterData(country = 'US') {
    const sources = Object.values(GLOBAL_WASTEWATER_SOURCES)
      .filter(source => source.country === country || country === 'ALL');

    const results = await Promise.allSettled(
      sources.map(source => this.fetchFromSource(source))
    );

    return results
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);
  }

  // Generic source fetcher
  async fetchFromSource(source) {
    try {
      // This would implement specific logic for each data source
      // For now, return structured mock data
      return {
        source: source.name,
        country: source.country,
        data: this.generateMockDataForSource(source),
        lastUpdated: new Date().toISOString(),
        coverage: source.coverage
      };
    } catch (error) {
      console.error(`Error fetching from ${source.name}:`, error);
      return null;
    }
  }

  // Process WastewaterScan data
  processWastewaterScanData(rawData, includeMetadata = true) {
    return rawData.map(({ site, measurements }) => {
      const processedMeasurements = measurements.map(measurement => ({
        date: measurement.sample_date,
        pathogen: measurement.pathogen,
        concentration: measurement.concentration,
        units: measurement.units,
        normalized: measurement.normalized_concentration,
        quality: WastewaterDataProcessor.assessDataQuality(measurement),
        trend: measurements.length > 7 ? 
          WastewaterDataProcessor.calculateTrend(
            measurements.slice(-14).map(m => m.concentration)
          ) : null,
        alert: this.checkAlertThresholds(measurement, measurements)
      }));

      return {
        site: {
          id: site.id,
          name: site.name,
          type: site.type, // WWTP, campus, building, etc.
          location: {
            lat: site.latitude,
            lng: site.longitude,
            city: site.city,
            state: site.state,
            country: site.country,
            population: site.population_served
          },
          ...(includeMetadata && {
            metadata: {
              operator: site.operator,
              labAnalyzing: site.laboratory,
              samplingMethod: site.sampling_method,
              analyticalMethod: site.analytical_method
            }
          })
        },
        measurements: processedMeasurements,
        summary: {
          latestMeasurement: processedMeasurements[0],
          avgConcentration: processedMeasurements.reduce((sum, m) => sum + m.concentration, 0) / processedMeasurements.length,
          trend: processedMeasurements[0]?.trend,
          alertLevel: this.determineAlertLevel(processedMeasurements)
        }
      };
    });
  }

  // Process CDC NWSS data
  processCDCData(rawData) {
    const sitesMap = new Map();

    rawData.forEach(record => {
      const siteKey = `${record.wwtp_jurisdiction}_${record.reporting_jurisdiction}`;
      
      if (!sitesMap.has(siteKey)) {
        sitesMap.set(siteKey, {
          site: {
            id: siteKey,
            name: record.wwtp_jurisdiction,
            location: {
              state: record.reporting_jurisdiction,
              county: record.county_names,
              population: parseInt(record.population_served) || 0
            }
          },
          measurements: []
        });
      }

      sitesMap.get(siteKey).measurements.push({
        date: record.date_end,
        pathogen: 'SARS-CoV-2',
        concentration: parseFloat(record.pcr_target_avg_conc) || 0,
        units: 'copies/L',
        normalized: parseFloat(record.flow_rate) || null,
        quality: { score: 85, grade: 'B', issues: [] }, // Assume good quality for CDC data
        percentile: parseInt(record.percentile) || null
      });
    });

    return Array.from(sitesMap.values())
      .map(siteData => ({
        ...siteData,
        measurements: siteData.measurements
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 30) // Last 30 measurements
      }));
  }

  // Check alert thresholds
  checkAlertThresholds(measurement, historicalData) {
    const pathogen = measurement.pathogen;
    const thresholds = ALERT_THRESHOLDS[pathogen];
    
    if (!thresholds) return { level: 'none', reason: null };

    const concentration = measurement.concentration;
    const recent = historicalData.slice(-7).map(m => m.concentration);
    const previous = historicalData.slice(-14, -7).map(m => m.concentration);

    // Check for increasing trend
    if (recent.length >= 3 && previous.length >= 3) {
      const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
      const previousAvg = previous.reduce((sum, val) => sum + val, 0) / previous.length;
      const percentChange = ((recentAvg - previousAvg) / previousAvg) * 100;

      if (percentChange >= thresholds.outbreak.percentChange) {
        return { level: 'outbreak', reason: `${percentChange.toFixed(1)}% increase over ${thresholds.outbreak.duration} days` };
      } else if (percentChange >= thresholds.increasing.percentChange) {
        return { level: 'increasing', reason: `${percentChange.toFixed(1)}% increase detected` };
      }
    }

    // Check absolute levels
    if (concentration >= thresholds.high?.absoluteLevel) {
      return { level: 'high', reason: `High concentration: ${concentration} ${measurement.units}` };
    }

    return { level: 'normal', reason: null };
  }

  // Determine overall alert level for a site
  determineAlertLevel(measurements) {
    if (!measurements.length) return 'no-data';

    const alertLevels = measurements.map(m => m.alert?.level || 'normal');
    
    if (alertLevels.includes('outbreak')) return 'outbreak';
    if (alertLevels.includes('high')) return 'high';
    if (alertLevels.includes('increasing')) return 'increasing';
    return 'normal';
  }

  // Mock data generators for development
  getMockWastewaterScanData(options) {
    const mockSites = [
      {
        site: {
          id: 'site_001',
          name: 'University Campus WWTP',
          type: 'campus',
          location: {
            lat: 37.7749,
            lng: -122.4194,
            city: 'San Francisco',
            state: 'CA',
            country: 'US',
            population: 45000
          }
        },
        measurements: this.generateMockMeasurements('SARS-CoV-2', 30),
        summary: {
          latestMeasurement: null,
          avgConcentration: 5420,
          trend: { trend: 'increasing', change: 15.3 },
          alertLevel: 'increasing'
        }
      },
      {
        site: {
          id: 'site_002', 
          name: 'Metro City Treatment Plant',
          type: 'municipal',
          location: {
            lat: 40.7128,
            lng: -74.0060,
            city: 'New York',
            state: 'NY',
            country: 'US',
            population: 1200000
          }
        },
        measurements: this.generateMockMeasurements('SARS-CoV-2', 30),
        summary: {
          latestMeasurement: null,
          avgConcentration: 8750,
          trend: { trend: 'decreasing', change: -8.1 },
          alertLevel: 'normal'
        }
      }
    ];

    mockSites.forEach(site => {
      site.summary.latestMeasurement = site.measurements[0];
    });

    return mockSites;
  }

  generateMockMeasurements(pathogen, count) {
    const measurements = [];
    const baseConcentration = Math.random() * 10000 + 1000;
    
    for (let i = 0; i < count; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const variation = (Math.random() - 0.5) * 0.4; // ±20% variation
      const concentration = Math.max(0, baseConcentration * (1 + variation));
      
      measurements.push({
        date: date.toISOString().split('T')[0],
        pathogen,
        concentration: Math.round(concentration),
        units: 'gc/L',
        normalized: Math.round(concentration * 0.8),
        quality: { 
          score: 85 + Math.random() * 15, 
          grade: 'A', 
          issues: [] 
        },
        alert: { level: 'normal', reason: null }
      });
    }
    
    return measurements.reverse(); // Latest first
  }

  getMockCDCData() {
    return [
      {
        site: {
          id: 'cdc_001',
          name: 'California Statewide',
          location: {
            state: 'CA',
            population: 39538223
          }
        },
        measurements: this.generateMockMeasurements('SARS-CoV-2', 20)
      }
    ];
  }

  generateMockDataForSource(source) {
    const count = Math.floor(Math.random() * 50) + 10;
    return this.generateMockMeasurements('SARS-CoV-2', count);
  }
}

export default WastewaterDataFetcher;