// Import compatibility layer for Airtable
import { getAirtable } from './airtable-compat.js';

// Cache Airtable instance
let Airtable;

/**
 * Enhanced Airtable integration with robust error handling and logging
 * Supports both real Airtable data and mock data fallback
 */

// Initialize Airtable with credentials from environment variables
const initAirtable = async () => {
  const apiKey = process.env.AIRTABLE_API_KEY;
  let baseId = process.env.AIRTABLE_BASE_ID;
  
  if (!apiKey || !baseId) {
    console.error('🔴 Airtable API key or base ID not configured in environment variables');
    console.error('🔴 AIRTABLE_API_KEY exists:', !!apiKey);
    console.error('🔴 AIRTABLE_BASE_ID exists:', !!baseId);
    return null;
  }
  
  // Clean base ID if it contains additional segments (e.g., table/view IDs)
  if (baseId.includes('/')) {
    baseId = baseId.split('/')[0];
    console.log(`🔄 Cleaned Airtable base ID: ${baseId}`);
  }
  
  try {
    console.log('🔄 Initializing Airtable connection');
    
    // Use compatibility layer to load Airtable
    if (!Airtable) {
      console.log('🔄 Loading Airtable module...');
      Airtable = await getAirtable();
      console.log('✅ Airtable module loaded');
    }
    
    Airtable.configure({ apiKey });
    const base = Airtable.base(baseId);
    console.log('✅ Airtable initialized successfully');
    return base;
  } catch (error) {
    console.error('🔴 Error initializing Airtable:', error);
    console.error('🔴 Error details:', error.stack);
    return null;
  }
};

// No mock data - real data only
// This ensures we always use actual Airtable data or return proper errors

// Generic function to fetch records from any table with enhanced error handling
export const fetchRecords = async (tableName, options = {}) => {
  console.log(`🔄 Fetching records from ${tableName}...`);
  
  const base = await initAirtable();
  if (!base) {
    throw new Error('Airtable not configured - check your environment variables');
  }
  
  try {
    const query = { 
      maxRecords: options.maxRecords || 100,
      view: options.view || 'Grid view',
      ...options
    };
    
    if (options.filterByFormula) {
      query.filterByFormula = options.filterByFormula;
    }
    
    console.log(`🔄 Executing Airtable query on ${tableName}:`, JSON.stringify(query));
    
    // Add timeout to prevent hanging - shorter timeout for serverless
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Airtable request timeout after 5s')), 5000);
    });
    
    const recordsPromise = base(tableName).select(query).all();
    const records = await Promise.race([recordsPromise, timeoutPromise]);
    
    console.log(`✅ Retrieved ${records.length} records from Airtable ${tableName}`);
    return records.map(record => ({
      id: record.id,
      ...record.fields
    }));
  } catch (error) {
    console.error(`🔴 Error fetching from Airtable ${tableName}:`, error);
    throw error; // Propagate error instead of falling back to mock data
  }
};

// Function to create a record with enhanced error handling
export const createRecord = async (tableName, fields) => {
  console.log(`🔄 Creating new record in ${tableName}...`);
  
  const base = await initAirtable();
  if (!base) {
    console.error('🔴 Airtable not configured - cannot create record');
    throw new Error("Airtable not configured - record not created");
  }
  
  try {
    console.log(`📝 Record data:`, JSON.stringify(fields));
    const record = await base(tableName).create([{ fields }]);
    console.log(`✅ Record created successfully with ID: ${record[0].id}`);
    return {
      id: record[0].id,
      ...record[0].fields
    };
  } catch (error) {
    console.error(`🔴 Error creating record in ${tableName}:`, error);
    throw new Error(`Failed to create record: ${error.message}`);
  }
};

// Function to update a record with enhanced error handling
export const updateRecord = async (tableName, recordId, fields) => {
  console.log(`🔄 Updating record ${recordId} in ${tableName}...`);
  
  const base = await initAirtable();
  if (!base) {
    console.error('🔴 Airtable not configured - cannot update record');
    throw new Error("Airtable not configured - record not updated");
  }
  
  try {
    console.log(`📝 Update data:`, JSON.stringify(fields));
    const record = await base(tableName).update([
      { id: recordId, fields }
    ]);
    console.log(`✅ Record updated successfully`);
    return {
      id: record[0].id,
      ...record[0].fields
    };
  } catch (error) {
    console.error(`🔴 Error updating record in ${tableName}:`, error);
    throw new Error(`Failed to update record: ${error.message}`);
  }
};

// Function to delete a record with enhanced error handling
export const deleteRecord = async (tableName, recordId) => {
  console.log(`🔄 Deleting record ${recordId} from ${tableName}...`);
  
  const base = await initAirtable();
  if (!base) {
    console.error('🔴 Airtable not configured - cannot delete record');
    throw new Error("Airtable not configured - record not deleted");
  }
  
  try {
    await base(tableName).destroy([recordId]);
    console.log(`✅ Record deleted successfully`);
    return { success: true, id: recordId };
  } catch (error) {
    console.error(`🔴 Error deleting record from ${tableName}:`, error);
    throw new Error(`Failed to delete record: ${error.message}`);
  }
};

// Table-specific functions with correct table names
export const fetchResilienceDimensions = async (options = {}) => {
  return fetchRecords('Landscape topics', options);
};

export const fetchCaseStudies = async (options = {}) => {
  return fetchRecords('Case study forms', options);
};

export const fetchPeopleData = async (options = {}) => {
  return fetchRecords('People', options);
};

export const fetchResilienceMetrics = async (options = {}) => {
  return fetchRecords('Metrics', options);
};

export const fetchLandscapeData = async (options = {}) => {
  console.log('🔍 Fetching landscape data from Airtable...');
  const data = await fetchRecords('Landscape topics', options);
  console.log(`📊 Retrieved ${data.length} landscape topics:`, data.slice(0, 2));
  return data;
};

export const fetchPapers = async (options = {}) => {
  return fetchRecords('Papers', options);
};

// Alias for compatibility with older code
export const fetchBibliographyData = async (options = {}) => {
  return fetchPapers(options);
};

// Function to analyze resilience data (simulation for mock/demo purposes)
export const analyzeResilienceData = async () => {
  // Simulate data analysis
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
};

// Function to get Airtable tables (for admin interface)
export const getAirtableTables = async () => {
  const base = await initAirtable();
  if (!base) {
    throw new Error('Airtable not configured');
  }
  
  // Return a list of available tables
  return [
    { id: 'case-study-forms', name: 'Case Study Forms' },
    { id: 'people', name: 'People' },
    { id: 'landscape-topics', name: 'Landscape Topics' },
    { id: 'papers', name: 'Papers/Bibliography' },
    { id: 'metrics', name: 'Resilience Metrics' }
  ];
};
