import Airtable from 'airtable';

/**
 * Enhanced Airtable integration with robust error handling and logging
 * Supports both real Airtable data and mock data fallback
 */

// Initialize Airtable with credentials from environment variables
const initAirtable = () => {
  const apiKey = process.env.AIRTABLE_API_KEY;
  let baseId = process.env.AIRTABLE_BASE_ID;
  
  if (!apiKey || !baseId) {
    console.error('🔴 Airtable API key or base ID not configured in environment variables');
    return null;
  }
  
  // Clean base ID if it contains additional segments (e.g., table/view IDs)
  if (baseId.includes('/')) {
    baseId = baseId.split('/')[0];
    console.log(`🔄 Cleaned Airtable base ID: ${baseId}`);
  }
  
  try {
    console.log('🔄 Initializing Airtable connection');
    Airtable.configure({ apiKey });
    const base = Airtable.base(baseId);
    console.log('✅ Airtable initialized successfully');
    return base;
  } catch (error) {
    console.error('🔴 Error initializing Airtable:', error);
    return null;
  }
};

// Include mock data as fallback
const mockData = {
  'case study forms': [
    {
      id: 'mock1',
      'Case Study Title': 'Building Community Resilience Networks',
      'Name': 'Dr. Sarah Johnson',
      'Section': 'Case Study',
      'Date': '2023-10-15',
      'Resilient Dimensions': 'Social Equity & Well-being',
      'Short Description': 'An examination of community-led resilience initiatives in urban areas.',
      'Study Focus': 'This study explores how urban communities develop resilience networks to address challenges...',
      'Relevance to Community/Societal Resilience': 'Demonstrates how localized efforts can build broader societal resilience...'
    },
    {
      id: 'mock2',
      'Case Study Title': 'Healthcare Access During Crisis',
      'Name': 'Dr. Michael Chen',
      'Section': 'Research Paper',
      'Date': '2023-08-22',
      'Resilient Dimensions': 'Healthcare Systems',
      'Short Description': 'Analysis of healthcare access patterns during emergency situations.',
      'Study Focus': 'This research examines patterns of healthcare utilization during different crisis scenarios...',
      'Relevance to Community/Societal Resilience': 'Helps identify vulnerable points in healthcare delivery systems during emergencies...'
    }
  ],
  'people': [
    {
      id: 'mock-p1',
      'Name': 'Dr. Maya Patel',
      'Affiliation': 'Global Health Institute',
      'Role': 'Research Director',
      'Contact': 'maya.patel@example.org',
      'Expertise': 'Infectious Disease, Public Health Policy',
      'Bio': 'Dr. Patel has 15 years of experience in global health initiatives and infectious disease research...'
    },
    {
      id: 'mock-p2',
      'Name': 'Prof. James Wilson',
      'Affiliation': 'University of Research',
      'Role': 'Professor of Public Health',
      'Contact': 'j.wilson@example.edu',
      'Expertise': 'Health Equity, Community Resilience',
      'Bio': 'Professor Wilson specializes in health equity research and community-based resilience building...'
    }
  ],
  'landscape topics': [
    {
      id: 'mock-l1',
      'Dimension': 'Social Equity & Well-being',
      'Topic': 'Healthcare Access',
      'Context': 'Systems and procedures that facilitate equitable access to healthcare...',
      'Leadership': 'Community health coordinators, policy makers, healthcare administrators...',
      'Teamwork': 'Multi-sector collaboration between healthcare providers, community organizations...',
      'Data': 'Healthcare access metrics, utilization patterns, health outcomes...',
      'Resources': 'Healthcare facilities, telehealth infrastructure, community health workers...'
    },
    {
      id: 'mock-l2',
      'Dimension': 'Environmental Resilience',
      'Topic': 'Climate Adaptation',
      'Context': 'Strategies and infrastructures designed to respond to climate change impacts...',
      'Leadership': 'Environmental planners, community advocates, sustainability officers...',
      'Teamwork': 'Cross-sector partnerships between government, private sector, and communities...',
      'Data': 'Climate vulnerability assessments, adaptation program outcomes...',
      'Resources': 'Green infrastructure, early warning systems, community education programs...'
    }
  ],
  'papers': [
    {
      id: 'mock-b1',
      'Title': 'Building Societal Resilience Through Community Engagement',
      'Authors': 'Johnson, S., Smith, T., & Wong, L.',
      'Publication': 'Journal of Public Health',
      'Year': '2023',
      'URL': 'https://example.org/resilience-paper',
      'DOI': '10.1234/jph.2023.0123',
      'Abstract': 'This paper examines the role of community engagement in building societal resilience...',
      'Keywords': 'community engagement, resilience, public health'
    },
    {
      id: 'mock-b2',
      'Title': 'Healthcare Systems Adaptation During Crisis',
      'Authors': 'Chen, M., Williams, A., & Garcia, J.',
      'Publication': 'Health Policy Review',
      'Year': '2022',
      'URL': 'https://example.org/healthcare-crisis',
      'DOI': '10.5678/hpr.2022.7890',
      'Abstract': 'Analysis of how healthcare systems adapt during multiple types of crisis events...',
      'Keywords': 'healthcare systems, adaptation, crisis management'
    }
  ]
};

// Generic function to fetch records from any table with enhanced error handling
export const fetchRecords = async (tableName, options = {}) => {
  console.log(`🔄 Fetching records from ${tableName}...`);
  
  // First try to fetch from real Airtable if conditions allow
  if (process.env.USE_MOCK_DATA !== 'true') {
    const base = initAirtable();
    if (base) {
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
        const records = await base(tableName).select(query).all();
        
        console.log(`✅ Retrieved ${records.length} records from Airtable ${tableName}`);
        return records.map(record => ({
          id: record.id,
          ...record.fields
        }));
      } catch (error) {
        console.error(`🔴 Error fetching from Airtable ${tableName}:`, error);
        console.log(`🟡 Falling back to mock data for ${tableName}`);
      }
    }
  } else {
    console.log(`🟡 Using mock data for ${tableName} (configured in environment)`);
  }
  
  // If Airtable fetch fails or is disabled, return mock data
  const mockEntry = mockData[tableName.toLowerCase()] || [];
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
  console.log(`🟡 Returning ${mockEntry.length} mock records for ${tableName}`);
  return mockEntry;
};

// Function to create a record with enhanced error handling
export const createRecord = async (tableName, fields) => {
  console.log(`🔄 Creating new record in ${tableName}...`);
  
  const base = initAirtable();
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
  
  const base = initAirtable();
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
  
  const base = initAirtable();
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
