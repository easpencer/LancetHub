// Investment data fetcher with caching and error handling
import { federalDataSources } from './data-sources-config';

// Cache configuration
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
const cache = new Map();

// Helper to build cache key
function getCacheKey(source, dataset, params) {
  return `${source}-${dataset}-${JSON.stringify(params)}`;
}

// Helper to check if cache is valid
function isCacheValid(timestamp) {
  return Date.now() - timestamp < CACHE_DURATION;
}

// Fetch BEA Foreign Direct Investment Data
export async function fetchFDIData(params = {}) {
  const {
    year = new Date().getFullYear() - 1,
    countries = 'AllCountries',
    direction = 'inward', // inward or outward
    series = 'position' // position, flows, or income
  } = params;

  const cacheKey = getCacheKey('bea', 'fdi', params);
  const cached = cache.get(cacheKey);
  
  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data;
  }

  try {
    const { bea } = federalDataSources;
    const tableMap = {
      position: bea.datasets.fdi.tables.positionByCountry,
      flows: bea.datasets.fdi.tables.flowsByCountry,
      income: bea.datasets.fdi.tables.incomeByCountry
    };

    const url = new URL(`${bea.baseUrl}`);
    url.searchParams.append('UserID', bea.apiKey);
    url.searchParams.append('method', 'GetData');
    url.searchParams.append('datasetname', bea.datasets.fdi.datasetName);
    url.searchParams.append('TableName', tableMap[series]);
    url.searchParams.append('Frequency', 'A');
    url.searchParams.append('Year', year);
    url.searchParams.append('ResultFormat', 'json');

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`BEA API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Process and structure the data
    const processedData = processBEAData(data, direction);
    
    // Add metadata and citations
    const result = {
      data: processedData,
      metadata: {
        source: bea.name,
        citation: bea.citation,
        lastUpdated: new Date().toISOString(),
        year,
        series,
        direction
      }
    };

    // Cache the result
    cache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    return result;
  } catch (error) {
    console.error('Error fetching FDI data:', error);
    throw new Error(`Failed to fetch FDI data: ${error.message}`);
  }
}

// Fetch CDC health infrastructure data
export async function fetchHealthInfrastructureData(params = {}) {
  const {
    state = null,
    metric = 'all', // hospitalCapacity, mortality, svi, infrastructure
    year = new Date().getFullYear()
  } = params;

  const cacheKey = getCacheKey('cdc', metric, params);
  const cached = cache.get(cacheKey);
  
  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data;
  }

  try {
    const { cdc } = federalDataSources;
    const datasets = [];

    // Determine which datasets to fetch
    if (metric === 'all' || metric === 'hospitalCapacity') {
      datasets.push({
        name: 'hospitalCapacity',
        endpoint: cdc.datasets.hospitalCapacity.endpoint
      });
    }
    if (metric === 'all' || metric === 'mortality') {
      datasets.push({
        name: 'mortality',
        endpoint: cdc.datasets.mortality.endpoint
      });
    }
    if (metric === 'all' || metric === 'svi') {
      datasets.push({
        name: 'socialVulnerability',
        endpoint: cdc.datasets.socialVulnerability.endpoint
      });
    }
    if (metric === 'all' || metric === 'infrastructure') {
      datasets.push({
        name: 'publicHealthInfrastructure',
        endpoint: cdc.datasets.publicHealthInfrastructure.endpoint
      });
    }

    // Fetch all datasets in parallel
    const promises = datasets.map(async (dataset) => {
      const url = `${cdc.baseUrl}${dataset.endpoint}`;
      const params = new URLSearchParams({
        $limit: 10000,
        $where: state ? `state='${state}'` : '1=1'
      });

      const response = await fetch(`${url}?${params}`);
      if (!response.ok) {
        throw new Error(`CDC API error for ${dataset.name}: ${response.status}`);
      }

      const data = await response.json();
      return {
        name: dataset.name,
        data: data
      };
    });

    const results = await Promise.all(promises);
    
    // Process and combine the data
    const processedData = processCDCData(results, state);
    
    const result = {
      data: processedData,
      metadata: {
        source: cdc.name,
        citation: cdc.citation,
        lastUpdated: new Date().toISOString(),
        year,
        state,
        metric
      }
    };

    // Cache the result
    cache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    return result;
  } catch (error) {
    console.error('Error fetching health infrastructure data:', error);
    throw new Error(`Failed to fetch health data: ${error.message}`);
  }
}

// Fetch federal health spending data
export async function fetchFederalHealthSpending(params = {}) {
  const {
    state = null,
    agency = 'all',
    fiscalYear = new Date().getFullYear()
  } = params;

  const cacheKey = getCacheKey('usaspending', 'health', params);
  const cached = cache.get(cacheKey);
  
  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data;
  }

  try {
    const { usaSpending } = federalDataSources;
    const endpoint = state 
      ? `${usaSpending.baseUrl}${usaSpending.datasets.healthSpending.endpoints.byState}${state}/`
      : `${usaSpending.baseUrl}/spending_by_agency/`;

    const payload = {
      fiscal_year: fiscalYear,
      awarding_agency_id: agency === 'all' ? null : usaSpending.datasets.healthSpending.agencies[agency]
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`USAspending API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Process the spending data
    const processedData = processSpendingData(data, state);
    
    const result = {
      data: processedData,
      metadata: {
        source: usaSpending.name,
        citation: 'USAspending.gov. (2024). Federal Spending Open Data. https://www.usaspending.gov',
        lastUpdated: new Date().toISOString(),
        fiscalYear,
        state,
        agency
      }
    };

    // Cache the result
    cache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    return result;
  } catch (error) {
    console.error('Error fetching federal spending data:', error);
    throw new Error(`Failed to fetch spending data: ${error.message}`);
  }
}

// Data processing functions
function processBEAData(rawData, direction) {
  if (!rawData.BEAAPI || !rawData.BEAAPI.Results || !rawData.BEAAPI.Results.Data) {
    throw new Error('Invalid BEA data format');
  }

  const data = rawData.BEAAPI.Results.Data;
  const processed = {};

  data.forEach(item => {
    const country = item.GeoName;
    const value = parseFloat(item.DataValue) || 0;
    
    if (country && !isNaN(value)) {
      if (!processed[country]) {
        processed[country] = {
          country,
          value: 0,
          direction,
          unit: 'millions USD'
        };
      }
      processed[country].value += value;
    }
  });

  return Object.values(processed).sort((a, b) => b.value - a.value);
}

function processCDCData(datasets, state) {
  const processed = {
    hospitalCapacity: {},
    mortality: {},
    socialVulnerability: {},
    infrastructure: {}
  };

  datasets.forEach(({ name, data }) => {
    if (name === 'hospitalCapacity' && data.length > 0) {
      // Process hospital capacity data
      const latest = data[data.length - 1];
      processed.hospitalCapacity = {
        totalBeds: parseInt(latest.inpatient_beds) || 0,
        icuBeds: parseInt(latest.icu_beds) || 0,
        utilizationRate: parseFloat(latest.inpatient_bed_utilization) || 0
      };
    }
    
    if (name === 'socialVulnerability' && data.length > 0) {
      // Process SVI data
      const avgSVI = data.reduce((sum, item) => sum + (parseFloat(item.rpl_themes) || 0), 0) / data.length;
      processed.socialVulnerability = {
        averageSVI: avgSVI,
        highVulnerabilityCounties: data.filter(item => parseFloat(item.rpl_themes) > 0.75).length
      };
    }
    
    // Process other datasets similarly
  });

  return processed;
}

function processSpendingData(rawData, state) {
  if (!rawData.results) {
    return { totalSpending: 0, byAgency: {} };
  }

  const processed = {
    totalSpending: 0,
    byAgency: {},
    byProgram: {}
  };

  rawData.results.forEach(item => {
    const amount = parseFloat(item.obligated_amount) || 0;
    const agency = item.awarding_agency_name || 'Unknown';
    
    processed.totalSpending += amount;
    
    if (!processed.byAgency[agency]) {
      processed.byAgency[agency] = 0;
    }
    processed.byAgency[agency] += amount;
  });

  return processed;
}

// Export cache management functions
export function clearCache() {
  cache.clear();
}

export function getCacheStats() {
  return {
    size: cache.size,
    entries: Array.from(cache.keys())
  };
}