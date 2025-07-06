/**
 * Airtable integration that works in both local and Netlify serverless environments
 * This handles the CommonJS/ESM compatibility issues
 */

let Airtable;
let airtableCache = null;

// Initialize Airtable with proper module loading
const getAirtable = async () => {
  if (!Airtable) {
    try {
      // Try dynamic import first
      const airtableModule = await import('airtable');
      Airtable = airtableModule.default || airtableModule;
    } catch (error) {
      console.error('Failed to import Airtable:', error);
      // Try require as fallback
      try {
        Airtable = require('airtable');
      } catch (requireError) {
        console.error('Failed to require Airtable:', requireError);
        throw new Error('Cannot load Airtable module');
      }
    }
  }
  return Airtable;
};

// Initialize Airtable base
const initAirtable = async () => {
  if (airtableCache) return airtableCache;
  
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  
  if (!apiKey || !baseId) {
    console.error('Airtable credentials missing');
    return null;
  }
  
  try {
    const AirtableLib = await getAirtable();
    AirtableLib.configure({ apiKey });
    airtableCache = AirtableLib.base(baseId);
    return airtableCache;
  } catch (error) {
    console.error('Failed to initialize Airtable:', error);
    return null;
  }
};

// Generic fetch function
export const fetchRecords = async (tableName, options = {}) => {
  try {
    const base = await initAirtable();
    if (!base) {
      console.error('No Airtable base available');
      return [];
    }
    
    const query = { 
      maxRecords: options.maxRecords || 100,
      view: options.view || 'Grid view',
      ...options
    };
    
    // Add timeout for serverless
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Airtable timeout')), 8000);
    });
    
    const recordsPromise = base(tableName).select(query).all();
    const records = await Promise.race([recordsPromise, timeoutPromise]);
    
    return records.map(record => ({
      id: record.id,
      ...record.fields
    }));
  } catch (error) {
    console.error(`Error fetching ${tableName}:`, error.message);
    return [];
  }
};

// Table-specific functions
export const fetchCaseStudies = async (options = {}) => {
  return fetchRecords('Case study forms', options);
};

export const fetchPeopleData = async (options = {}) => {
  return fetchRecords('People', options);
};

export const fetchLandscapeData = async (options = {}) => {
  return fetchRecords('Landscape topics', options);
};

export const fetchPapers = async (options = {}) => {
  return fetchRecords('Papers', options);
};

export const fetchBibliographyData = fetchPapers;

// Add missing exports that other files are importing
export const fetchResilienceDimensions = async (options = {}) => {
  return fetchRecords('Resilience Dimensions', options).catch(() => []);
};

export const fetchResilienceMetrics = async (options = {}) => {
  return fetchRecords('Metrics', options).catch(() => []);
};

export const getAirtableTables = async () => {
  // Return a list of available tables
  return [
    { id: 'case-study-forms', name: 'Case Study Forms' },
    { id: 'people', name: 'People' },
    { id: 'landscape-topics', name: 'Landscape Topics' },
    { id: 'papers', name: 'Papers/Bibliography' },
    { id: 'metrics', name: 'Resilience Metrics' }
  ];
};

// Re-export other functions for compatibility
export const createRecord = async () => {
  throw new Error('Write operations not supported in this implementation');
};

export const updateRecord = async () => {
  throw new Error('Write operations not supported in this implementation');
};

export const deleteRecord = async () => {
  throw new Error('Write operations not supported in this implementation');
};