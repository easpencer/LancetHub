/**
 * Script to initialize Airtable with default data structure and sample content
 * Usage: node scripts/init-airtable.js
 */

require('dotenv').config({ path: '.env.local' });
const Airtable = require('airtable');

// Mock data from our utils/airtable.js
const mockData = {
  dimensions: [
    {
      name: 'Social Equity & Well-being',
      description: 'Systems and practices that ensure fair distribution of resources, opportunities, and outcomes',
      metrics: 'Healthcare access, Education equity, Income distribution',
      category: 'Social',
      priority: 1
    },
    // Add more mock dimensions here
  ],
  metrics: [
    { name: 'Healthcare Access Index', value: '68/100', changePercent: '3.5', dimension: 'Social Equity & Well-being', trend: 'Positive', source: 'Health Equity Report 2023' },
    // Add more mock metrics here
  ],
  // Add more data types here
};

async function initAirtable() {
  console.log('⏳ Checking Airtable configuration...');
  
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  
  if (!apiKey || !baseId) {
    console.error('❌ Airtable API key or base ID not configured in .env.local');
    console.error('Please set AIRTABLE_API_KEY and AIRTABLE_BASE_ID and try again');
    process.exit(1);
  }
  
  console.log('✅ Airtable configuration found');
  
  try {
    // Initialize Airtable API
    Airtable.configure({ apiKey });
    const base = Airtable.base(baseId);
    
    // Initialize Dimensions
    console.log('\n⏳ Initializing Resilience Dimensions...');
    const dimensionsTable = base('Resilience Dimensions');
    const existingDimensions = await dimensionsTable.select().firstPage();
    
    if (existingDimensions.length === 0) {
      console.log('No existing dimensions found, creating sample data...');
      for (const dimension of mockData.dimensions) {
        await dimensionsTable.create([{ fields: dimension }]);
      }
      console.log(`✅ Created ${mockData.dimensions.length} dimensions`);
    } else {
      console.log(`✅ Found ${existingDimensions.length} existing dimensions. Skipping creation.`);
    }
    
    // Initialize Metrics
    console.log('\n⏳ Initializing Metrics...');
    const metricsTable = base('Metrics');
    const existingMetrics = await metricsTable.select().firstPage();
    
    if (existingMetrics.length === 0) {
      console.log('No existing metrics found, creating sample data...');
      for (const metric of mockData.metrics) {
        await metricsTable.create([{ fields: metric }]);
      }
      console.log(`✅ Created ${mockData.metrics.length} metrics`);
    } else {
      console.log(`✅ Found ${existingMetrics.length} existing metrics. Skipping creation.`);
    }
    
    // Add more tables initialization here
    
    console.log('\n✅ Airtable initialization complete!');
  } catch (error) {
    console.error('\n❌ Error initializing Airtable:', error.message);
    if (error.statusCode === 404) {
      console.error('Make sure the base exists and contains the required tables: Resilience Dimensions, Metrics, etc.');
    } else if (error.statusCode === 403) {
      console.error('Authentication error - check your API key permissions.');
    }
    process.exit(1);
  }
}

// Run the initialization
initAirtable();
