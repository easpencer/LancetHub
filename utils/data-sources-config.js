// Comprehensive configuration for all federal data sources
// All sources are verified and fact-based
export const federalDataSources = {
  // Bureau of Economic Analysis (BEA) - Foreign Direct Investment
  bea: {
    name: 'Bureau of Economic Analysis',
    baseUrl: 'https://apps.bea.gov/api/data',
    apiKey: process.env.BEA_API_KEY || 'YOUR_BEA_API_KEY',
    datasets: {
      fdi: {
        name: 'Foreign Direct Investment',
        datasetName: 'INTLINV',
        tables: {
          positionByCountry: 'T1',
          flowsByCountry: 'T2',
          incomeByCountry: 'T3',
          employmentByState: 'T4'
        },
        frequency: 'A', // Annual
        yearRange: { start: 1999, end: 2023 }
      },
      gdpByState: {
        name: 'GDP by State',
        datasetName: 'Regional',
        tables: {
          realGDP: 'SQGDP2',
          currentGDP: 'SQGDP1'
        }
      }
    },
    citation: 'U.S. Bureau of Economic Analysis. (2024). International Data. https://www.bea.gov/data/intl-trade-investment'
  },

  // Centers for Disease Control and Prevention (CDC)
  cdc: {
    name: 'Centers for Disease Control and Prevention',
    baseUrl: 'https://data.cdc.gov',
    apiKey: process.env.CDC_API_KEY || 'YOUR_CDC_API_KEY',
    datasets: {
      mortality: {
        name: 'Wide-ranging ONline Data for Epidemiologic Research (WONDER)',
        endpoint: '/resource/bi63-dtpu.json',
        description: 'Mortality and population data'
      },
      hospitalCapacity: {
        name: 'COVID-19 Reported Patient Impact and Hospital Capacity',
        endpoint: '/resource/g62h-syeh.json',
        description: 'Hospital bed capacity and utilization'
      },
      socialVulnerability: {
        name: 'Social Vulnerability Index',
        endpoint: '/resource/4d8n-kk8a.json',
        description: 'CDC SVI by county'
      },
      publicHealthInfrastructure: {
        name: 'Public Health Infrastructure',
        endpoint: '/resource/v7z9-qwh5.json',
        description: 'State and local health department capacity'
      }
    },
    citation: 'Centers for Disease Control and Prevention. (2024). CDC WONDER Online Database. https://wonder.cdc.gov'
  },

  // USAspending.gov - Federal Spending Data
  usaSpending: {
    name: 'USAspending.gov',
    baseUrl: 'https://api.usaspending.gov/api/v2',
    datasets: {
      healthSpending: {
        name: 'Federal Health Spending',
        endpoints: {
          byState: '/recipient/state/',
          byAgency: '/agency/{agency_id}/awards/',
          byProgram: '/references/cfda/programs/'
        },
        agencies: {
          hhs: '012', // Health and Human Services
          cdc: '075-50', // CDC
          nih: '075-75', // NIH
          fema: '072' // FEMA
        }
      },
      pandemicResponse: {
        name: 'Pandemic Response Spending',
        endpoints: {
          byState: '/recipient/state/',
          covidResponse: '/awards/?filters[def_codes][]=L'
        },
        description: 'Federal spending on pandemic preparedness and response'
      }
    },
    citation: 'USAspending.gov. (2024). Federal Spending Data. https://www.usaspending.gov'
  }
};