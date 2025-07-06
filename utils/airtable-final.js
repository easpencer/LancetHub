/**
 * Bulletproof Airtable integration for Netlify serverless
 * This version handles all edge cases and module loading issues
 */

// Cache for Airtable instance
let cachedBase = null;
let cacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Initialize Airtable with proper error handling and caching
 */
async function initAirtable() {
  // Check cache
  if (cachedBase && Date.now() - cacheTime < CACHE_DURATION) {
    console.log('✅ Using cached Airtable connection');
    return cachedBase;
  }

  const apiKey = process.env.AIRTABLE_API_KEY;
  let baseId = process.env.AIRTABLE_BASE_ID;
  
  if (!apiKey || !baseId) {
    console.error('🔴 Airtable credentials missing');
    console.error('API Key exists:', !!apiKey);
    console.error('Base ID exists:', !!baseId);
    throw new Error('Airtable not configured');
  }
  
  // Clean base ID
  if (baseId.includes('/')) {
    baseId = baseId.split('/')[0];
  }
  
  try {
    console.log('🔄 Loading Airtable module...');
    
    // Dynamic import with multiple fallbacks
    let Airtable;
    
    try {
      // Method 1: Direct dynamic import
      const mod = await import('airtable');
      Airtable = mod.default || mod;
    } catch (e1) {
      console.log('Method 1 failed:', e1.message);
      
      try {
        // Method 2: Use eval to bypass bundler
        Airtable = eval('require("airtable")');
      } catch (e2) {
        console.log('Method 2 failed:', e2.message);
        
        // Method 3: Use global require if available
        if (typeof require !== 'undefined') {
          Airtable = require('airtable');
        } else {
          throw new Error('All Airtable loading methods failed');
        }
      }
    }
    
    if (!Airtable) {
      throw new Error('Airtable module loaded but is undefined');
    }
    
    console.log('✅ Airtable module loaded successfully');
    
    // Configure Airtable
    Airtable.configure({ apiKey });
    const base = Airtable.base(baseId);
    
    // Cache the connection
    cachedBase = base;
    cacheTime = Date.now();
    
    console.log('✅ Airtable base initialized');
    return base;
    
  } catch (error) {
    console.error('🔴 Airtable initialization failed:', error);
    console.error('Stack:', error.stack);
    cachedBase = null;
    throw error;
  }
}

/**
 * Fetch records with timeout and error handling
 */
export async function fetchRecords(tableName, options = {}) {
  console.log(`🔄 Fetching from ${tableName}...`);
  
  try {
    const base = await initAirtable();
    
    const query = {
      maxRecords: options.maxRecords || 100,
      view: options.view || 'Grid view',
      ...options
    };
    
    // Create timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Airtable request timeout')), 8000);
    });
    
    // Fetch records with timeout
    const recordsPromise = base(tableName).select(query).all();
    const records = await Promise.race([recordsPromise, timeoutPromise]);
    
    console.log(`✅ Got ${records.length} records from ${tableName}`);
    
    return records.map(record => ({
      id: record.id,
      ...record.fields
    }));
    
  } catch (error) {
    console.error(`🔴 Error fetching ${tableName}:`, error.message);
    
    // Return empty array instead of throwing in production
    if (process.env.NODE_ENV === 'production') {
      return [];
    }
    
    throw error;
  }
}

/**
 * Create a record
 */
export async function createRecord(tableName, fields) {
  console.log(`🔄 Creating record in ${tableName}...`);
  
  try {
    const base = await initAirtable();
    const records = await base(tableName).create([{ fields }]);
    
    console.log(`✅ Created record ${records[0].id}`);
    return {
      id: records[0].id,
      ...records[0].fields
    };
    
  } catch (error) {
    console.error(`🔴 Error creating record:`, error.message);
    throw error;
  }
}

/**
 * Update a record
 */
export async function updateRecord(tableName, recordId, fields) {
  console.log(`🔄 Updating ${recordId} in ${tableName}...`);
  
  try {
    const base = await initAirtable();
    const records = await base(tableName).update([
      { id: recordId, fields }
    ]);
    
    console.log(`✅ Updated record ${recordId}`);
    return {
      id: records[0].id,
      ...records[0].fields
    };
    
  } catch (error) {
    console.error(`🔴 Error updating record:`, error.message);
    throw error;
  }
}

/**
 * Delete a record
 */
export async function deleteRecord(tableName, recordId) {
  console.log(`🔄 Deleting ${recordId} from ${tableName}...`);
  
  try {
    const base = await initAirtable();
    await base(tableName).destroy([recordId]);
    
    console.log(`✅ Deleted record ${recordId}`);
    return { success: true, id: recordId };
    
  } catch (error) {
    console.error(`🔴 Error deleting record:`, error.message);
    throw error;
  }
}

// Table-specific convenience functions
export const fetchResilienceDimensions = (options) => fetchRecords('Landscape topics', options);
export const fetchCaseStudies = (options) => fetchRecords('Case study forms', options);
export const fetchPeopleData = (options) => fetchRecords('People', options);
export const fetchResilienceMetrics = (options) => fetchRecords('Metrics', options);
export const fetchLandscapeData = (options) => fetchRecords('Landscape topics', options);
export const fetchPapers = (options) => fetchRecords('Papers', options);
export const fetchBibliographyData = (options) => fetchPapers(options);

// Get available tables
export async function getAirtableTables() {
  await initAirtable(); // Ensure we can connect
  
  return [
    { id: 'case-study-forms', name: 'Case Study Forms' },
    { id: 'people', name: 'People' },
    { id: 'landscape-topics', name: 'Landscape Topics' },
    { id: 'papers', name: 'Papers/Bibliography' },
    { id: 'metrics', name: 'Resilience Metrics' }
  ];
}

// Mock analysis function
export async function analyzeResilienceData() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    totalDimensions: 7,
    topDimension: 'Social Equity & Well-being',
    topMetrics: ['Healthcare Access Index', 'Community Engagement Score'],
    recommendations: [
      'Invest in community health worker programs',
      'Strengthen cross-sector communication networks',
      'Develop localized emergency response plans'
    ],
    trends: [
      { name: 'Healthcare Accessibility', change: '+3.5%', trend: 'positive' },
      { name: 'Environmental Protections', change: '-1.2%', trend: 'negative' },
      { name: 'Civic Participation', change: '+2.8%', trend: 'positive' }
    ]
  };
}