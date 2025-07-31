/**
 * Global Wastewater Surveillance Data Sources
 * Integrates WastewaterScan and other major wastewater monitoring networks
 */

// WastewaterScan API configuration
export const WASTEWATERSCAN_CONFIG = {
  baseUrl: 'https://api.wastewaterscan.org/v1',
  endpoints: {
    sites: '/sites',
    measurements: '/measurements',
    trends: '/trends',
    alerts: '/alerts',
    pathogens: '/pathogens'
  },
  // Note: Add your WastewaterScan API key to .env.local
  apiKey: process.env.WASTEWATERSCAN_API_KEY
};

// Global wastewater surveillance networks
export const GLOBAL_WASTEWATER_SOURCES = {
  // United States
  US_CDC_NWSS: {
    name: 'CDC National Wastewater Surveillance System',
    country: 'US',
    url: 'https://data.cdc.gov/resource/2ew6-ywp6.json',
    coverage: 'National',
    pathogens: ['SARS-CoV-2', 'Influenza A', 'RSV'],
    dataFormat: 'Socrata API',
    updateFrequency: 'Weekly'
  },
  
  // European Union
  EU_SEWAGE_SENTINEL: {
    name: 'EU Sewage Sentinel System',
    country: 'EU',
    url: 'https://sewage-sentinel.eu/api/v1',
    coverage: '27 EU countries',
    pathogens: ['SARS-CoV-2', 'Poliovirus', 'Hepatitis A'],
    dataFormat: 'REST API',
    updateFrequency: 'Daily'
  },
  
  // United Kingdom
  UK_ENV_AGENCY: {
    name: 'UK Environment Agency COVID-19 Surveillance',
    country: 'UK',
    url: 'https://environment.data.gov.uk/water-quality/view/sampling-point',
    coverage: 'England, Wales, Scotland',
    pathogens: ['SARS-CoV-2'],
    dataFormat: 'OpenData API',
    updateFrequency: 'Daily'
  },
  
  // Canada
  CA_WASTEWATER_NETWORK: {
    name: 'Canadian Wastewater Surveillance Network',
    country: 'CA', 
    url: 'https://health-infobase.canada.ca/covid-19/wastewater/',
    coverage: 'Provincial networks',
    pathogens: ['SARS-CoV-2'],
    dataFormat: 'Health Canada API',
    updateFrequency: 'Weekly'
  },
  
  // Australia
  AU_WASTEWATER_MONITORING: {
    name: 'Australian National Wastewater Monitoring Program',
    country: 'AU',
    url: 'https://www.health.gov.au/resources/datasets/covid-19-wastewater-monitoring-data',
    coverage: 'Major cities and regions',
    pathogens: ['SARS-CoV-2'],
    dataFormat: 'CSV/API',
    updateFrequency: 'Weekly'
  },
  
  // Netherlands
  NL_RIVM: {
    name: 'RIVM Sewage Surveillance',
    country: 'NL',
    url: 'https://data.rivm.nl/covid-19/sewage',
    coverage: 'National coverage',
    pathogens: ['SARS-CoV-2', 'Influenza', 'Norovirus'],
    dataFormat: 'Open Data API',
    updateFrequency: 'Daily'
  },
  
  // Israel
  IL_TECHNION: {
    name: 'Technion Wastewater Surveillance',
    country: 'IL',
    url: 'https://corona.technion.ac.il/en/',
    coverage: 'National network',
    pathogens: ['SARS-CoV-2', 'Poliovirus'],
    dataFormat: 'Research API',
    updateFrequency: 'Daily'
  },
  
  // Japan
  JP_WASTEWATER_NETWORK: {
    name: 'Japan Wastewater Surveillance Network',
    country: 'JP',
    url: 'https://www.niid.go.jp/niid/en/',
    coverage: 'Prefecture-level monitoring',
    pathogens: ['SARS-CoV-2', 'Influenza'],
    dataFormat: 'NIID API',
    updateFrequency: 'Weekly'
  },
  
  // Singapore
  SG_PUB: {
    name: 'Singapore PUB Wastewater Surveillance',
    country: 'SG',
    url: 'https://www.pub.gov.sg/wastewater',
    coverage: 'Island-wide coverage',
    pathogens: ['SARS-CoV-2'],
    dataFormat: 'Government API',
    updateFrequency: 'Daily'
  }
};

// Pathogen detection parameters
export const PATHOGEN_TARGETS = {
  'SARS-CoV-2': {
    genes: ['N1', 'N2', 'E', 'ORF1ab'],
    units: 'gc/L', // gene copies per liter
    detectionLimit: 100,
    normalizations: ['PMMoV', 'crAssphage', 'flow'],
    variants: ['Alpha', 'Beta', 'Gamma', 'Delta', 'Omicron', 'BA.1', 'BA.2', 'BA.4', 'BA.5', 'XBB', 'BQ.1']
  },
  'Influenza A': {
    genes: ['M', 'H1', 'H3'],
    units: 'gc/L',
    detectionLimit: 50,
    normalizations: ['PMMoV', 'flow'],
    subtypes: ['H1N1', 'H3N2']
  },
  'RSV': {
    genes: ['N', 'L'],
    units: 'gc/L', 
    detectionLimit: 75,
    normalizations: ['PMMoV', 'flow'],
    types: ['RSV-A', 'RSV-B']
  },
  'Norovirus': {
    genes: ['GI', 'GII'],
    units: 'gc/L',
    detectionLimit: 200,
    normalizations: ['PMMoV', 'flow'],
    genogroups: ['GI', 'GII']
  },
  'Poliovirus': {
    genes: ['VP1', '5UTR'],
    units: 'gc/L',
    detectionLimit: 10,
    normalizations: ['PMMoV'],
    types: ['WPV1', 'WPV2', 'WPV3', 'VDPV']
  }
};

// Data quality indicators
export const QUALITY_METRICS = {
  sampleCollection: {
    flowComposite: 'Time or flow-weighted composite sampling',
    preservation: 'Proper sample preservation and transport',
    chainOfCustody: 'Documented sample handling'
  },
  analyticalQuality: {
    recoveryControls: 'Spike recovery controls within acceptance criteria',
    replicates: 'Duplicate/triplicate analysis consistency',
    blanks: 'Method and field blank contamination check',
    inhibition: 'PCR inhibition assessment'
  },
  dataReporting: {
    belowDetection: 'Handling of non-detect results',
    normalization: 'Appropriate normalization methods',
    uncertainty: 'Measurement uncertainty reporting'
  }
};

// Early warning thresholds
export const ALERT_THRESHOLDS = {
  'SARS-CoV-2': {
    increasing: {
      percentChange: 50, // 50% increase over 7-day average
      duration: 3, // 3 consecutive days
      minLevel: 1000 // minimum gc/L to trigger
    },
    high: {
      absoluteLevel: 100000, // gc/L
      populationAdjusted: 10000 // gc/L per 100k population
    },
    outbreak: {
      percentChange: 200, // 200% increase
      duration: 5, // 5 consecutive days
      spatialClustering: true
    }
  },
  'Influenza A': {
    increasing: {
      percentChange: 100,
      duration: 5,
      minLevel: 500
    },
    seasonal: {
      baselineMultiplier: 3, // 3x seasonal baseline
      duration: 7
    }
  }
};

// Utility functions for data processing
export class WastewaterDataProcessor {
  static normalizeConcentration(rawValue, normalizationMethod, normalizationValue) {
    switch (normalizationMethod) {
      case 'PMMoV':
        return rawValue / normalizationValue * 1e6; // per million copies PMMoV
      case 'crAssphage':
        return rawValue / normalizationValue * 1e6;
      case 'flow':
        return rawValue * normalizationValue; // adjust for flow rate
      default:
        return rawValue;
    }
  }
  
  static calculateTrend(values, days = 7) {
    if (values.length < days) return null;
    
    const recent = values.slice(-days);
    const previous = values.slice(-days * 2, -days);
    
    const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const previousAvg = previous.reduce((sum, val) => sum + val, 0) / previous.length;
    
    return {
      current: recentAvg,
      previous: previousAvg,
      change: ((recentAvg - previousAvg) / previousAvg) * 100,
      trend: recentAvg > previousAvg ? 'increasing' : 'decreasing'
    };
  }
  
  static assessDataQuality(sample) {
    let qualityScore = 100;
    const issues = [];
    
    // Check for inhibition
    if (sample.inhibition && sample.inhibition > 50) {
      qualityScore -= 20;
      issues.push('High PCR inhibition detected');
    }
    
    // Check recovery controls
    if (sample.recoveryControl && sample.recoveryControl < 10) {
      qualityScore -= 30;
      issues.push('Poor recovery control performance');
    }
    
    // Check for contamination
    if (sample.fieldBlank && sample.fieldBlank > sample.detectionLimit) {
      qualityScore -= 25;
      issues.push('Field blank contamination detected');
    }
    
    return {
      score: Math.max(0, qualityScore),
      grade: qualityScore >= 80 ? 'A' : qualityScore >= 60 ? 'B' : qualityScore >= 40 ? 'C' : 'D',
      issues
    };
  }
}

export default {
  WASTEWATERSCAN_CONFIG,
  GLOBAL_WASTEWATER_SOURCES,
  PATHOGEN_TARGETS,
  QUALITY_METRICS,
  ALERT_THRESHOLDS,
  WastewaterDataProcessor
};