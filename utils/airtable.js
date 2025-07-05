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
  'Case study forms': [
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
  'Landscape topics': [
    {
      id: 'mock-l1',
      'Dimension': 'Social Equity & Well-being',
      'Topic': 'Healthcare Access',
      'Context': 'Ensuring equitable access to healthcare services for all population groups, particularly during health emergencies',
      'Leadership': 'Community health leaders, healthcare administrators, policy advocates',
      'Teamwork': 'Multi-sector collaboration between healthcare providers, community organizations, and government agencies',
      'Data': 'Healthcare utilization metrics, health equity assessments, population health data',
      'Resources': 'Community health centers, mobile health units, telehealth infrastructure',
      'Priority': 'High',
      'Implementation': 'Establish community health hubs, deploy mobile units to underserved areas, expand telehealth capabilities',
      'Challenges': 'Digital divide, language barriers, trust issues in marginalized communities',
      'Solutions': 'Culturally competent care, community health workers, multilingual services',
      'Impact': 'Improved health outcomes, reduced disparities, enhanced community trust',
      'Stakeholders': 'Healthcare providers, community organizations, local government, patients',
      'BestPractices': 'Community-based participatory approaches, data-driven targeting, continuous feedback loops'
    },
    {
      id: 'mock-l2',
      'Dimension': 'Environmental Resilience',
      'Topic': 'Climate Adaptation',
      'Context': 'Building community capacity to respond to climate-related health threats and environmental changes',
      'Leadership': 'Environmental planners, public health officials, community advocates',
      'Teamwork': 'Cross-sector partnerships between environmental, health, and emergency management agencies',
      'Data': 'Climate vulnerability assessments, health impact projections, environmental monitoring',
      'Resources': 'Green infrastructure, cooling centers, early warning systems',
      'Priority': 'High',
      'Implementation': 'Develop climate adaptation plans, create cooling infrastructure, establish early warning systems',
      'Challenges': 'Resource constraints, competing priorities, climate uncertainty',
      'Solutions': 'Nature-based solutions, community engagement, predictive modeling',
      'Impact': 'Reduced heat-related illnesses, improved air quality, enhanced community resilience',
      'Stakeholders': 'Environmental agencies, health departments, community groups, residents',
      'BestPractices': 'Integrated planning approaches, equity-focused interventions, adaptive management'
    },
    {
      id: 'mock-l3',
      'Dimension': 'Economic Sustainability',
      'Topic': 'Small Business Resilience',
      'Context': 'Supporting small businesses through crisis and recovery to maintain community economic stability',
      'Leadership': 'Business leaders, economic development officers, chamber of commerce',
      'Teamwork': 'Business networks, cooperative associations, public-private partnerships',
      'Data': 'Business continuity metrics, economic impact assessments, recovery indicators',
      'Resources': 'Emergency business loans, technical assistance programs, shared resources',
      'Priority': 'High',
      'Implementation': 'Create business continuity planning support, establish emergency loan funds, develop resource sharing networks',
      'Challenges': 'Limited capital reserves, supply chain disruptions, workforce challenges',
      'Solutions': 'Cooperative business models, digital transformation, diversified revenue streams',
      'Impact': 'Sustained local employment, maintained essential services, faster economic recovery',
      'Stakeholders': 'Small businesses, financial institutions, workforce agencies, customers',
      'BestPractices': 'Peer learning networks, flexible support programs, local procurement preferences'
    },
    {
      id: 'mock-l4',
      'Dimension': 'Healthcare Systems',
      'Topic': 'Surge Capacity',
      'Context': 'Developing flexible healthcare capacity to respond to sudden increases in demand during emergencies',
      'Leadership': 'Hospital administrators, emergency managers, healthcare coordinators',
      'Teamwork': 'Regional healthcare coalitions, mutual aid agreements, coordinated response teams',
      'Data': 'Bed capacity tracking, staffing levels, resource utilization metrics',
      'Resources': 'Alternative care sites, medical reserve corps, emergency medical supplies',
      'Priority': 'Critical',
      'Implementation': 'Establish surge plans, create alternative care sites, build reserve workforce',
      'Challenges': 'Staff burnout, equipment shortages, coordination complexity',
      'Solutions': 'Flexible staffing models, regional coordination, just-in-time training',
      'Impact': 'Maintained care quality during surges, reduced mortality, preserved system function',
      'Stakeholders': 'Hospitals, emergency services, public health agencies, healthcare workers',
      'BestPractices': 'Regular surge exercises, cross-training programs, tiered response protocols'
    },
    {
      id: 'mock-l5',
      'Dimension': 'Information Systems',
      'Topic': 'Crisis Communication',
      'Context': 'Establishing trusted communication channels to combat misinformation and ensure accurate information flow',
      'Leadership': 'Public information officers, community trusted messengers, media partners',
      'Teamwork': 'Joint information centers, community advisory groups, media collaborations',
      'Data': 'Information reach metrics, message testing data, trust indicators',
      'Resources': 'Multi-language communication tools, community radio, digital platforms',
      'Priority': 'Critical',
      'Implementation': 'Build trusted messenger networks, establish verification systems, create rapid response protocols',
      'Challenges': 'Misinformation spread, trust deficits, information overload',
      'Solutions': 'Community-based messaging, fact-checking partnerships, clear communication protocols',
      'Impact': 'Increased public compliance, reduced misinformation impact, enhanced trust',
      'Stakeholders': 'Media organizations, community leaders, social media platforms, public',
      'BestPractices': 'Pre-tested messages, diverse communication channels, transparency principles'
    },
    {
      id: 'mock-l6',
      'Dimension': 'Infrastructure Resilience',
      'Topic': 'Essential Services Continuity',
      'Context': 'Maintaining critical infrastructure and services during disruptions to support community functions',
      'Leadership': 'Infrastructure managers, utility operators, emergency coordinators',
      'Teamwork': 'Infrastructure working groups, public-private coordination, regional partnerships',
      'Data': 'Service disruption tracking, redundancy assessments, vulnerability mapping',
      'Resources': 'Backup systems, distributed resources, hardened infrastructure',
      'Priority': 'Critical',
      'Implementation': 'Harden critical infrastructure, build redundancies, establish restoration priorities',
      'Challenges': 'Aging infrastructure, funding gaps, interdependencies',
      'Solutions': 'Smart grid technologies, distributed systems, public-private partnerships',
      'Impact': 'Minimized service disruptions, faster restoration, maintained essential functions',
      'Stakeholders': 'Utility companies, government agencies, critical facilities, residents',
      'BestPractices': 'Risk-based prioritization, cross-sector coordination, continuous improvement'
    },
    {
      id: 'mock-l7',
      'Dimension': 'Governance & Civic Engagement',
      'Topic': 'Community Participation',
      'Context': 'Engaging community members in resilience planning and decision-making processes',
      'Leadership': 'Community organizers, civic leaders, neighborhood representatives',
      'Teamwork': 'Community coalitions, participatory planning groups, civic organizations',
      'Data': 'Participation metrics, community feedback, engagement outcomes',
      'Resources': 'Community centers, digital engagement platforms, facilitation support',
      'Priority': 'High',
      'Implementation': 'Create participatory planning processes, establish community advisory boards, support grassroots organizing',
      'Challenges': 'Power imbalances, participation barriers, representation gaps',
      'Solutions': 'Inclusive engagement methods, compensation for participation, capacity building',
      'Impact': 'Improved plan effectiveness, increased community buy-in, stronger social cohesion',
      'Stakeholders': 'Residents, community organizations, local government, advocacy groups',
      'BestPractices': 'Co-design approaches, accessible meeting formats, continuous feedback loops'
    },
    {
      id: 'mock-l8',
      'Dimension': 'Cultural Vitality',
      'Topic': 'Cultural Preservation',
      'Context': 'Maintaining cultural practices and community bonds that strengthen resilience during crises',
      'Leadership': 'Cultural leaders, faith-based organizations, community elders',
      'Teamwork': 'Cultural organizations, interfaith networks, community groups',
      'Data': 'Cultural participation data, community cohesion metrics, social capital assessments',
      'Resources': 'Cultural centers, community gathering spaces, cultural programs',
      'Priority': 'Medium',
      'Implementation': 'Support cultural institutions, facilitate interfaith cooperation, preserve cultural practices',
      'Challenges': 'Funding limitations, generational gaps, cultural tensions',
      'Solutions': 'Cultural preservation programs, intergenerational activities, inclusive celebrations',
      'Impact': 'Maintained community identity, enhanced social bonds, improved collective resilience',
      'Stakeholders': 'Cultural institutions, faith communities, artists, community members',
      'BestPractices': 'Asset-based approaches, cultural competency, inclusive programming'
    },
    {
      id: 'mock-l9',
      'Dimension': 'Economic Sustainability',
      'Topic': 'Workforce Development',
      'Context': 'Building resilient workforce capabilities to adapt to changing economic conditions and crisis scenarios',
      'Leadership': 'Workforce development boards, educational institutions, industry leaders',
      'Teamwork': 'Public-private partnerships, educational collaborations, apprenticeship programs',
      'Data': 'Skills gap analysis, employment trends, training outcomes',
      'Resources': 'Training programs, career centers, online learning platforms',
      'Priority': 'High',
      'Implementation': 'Rapid reskilling programs, career pathway development, employer partnerships',
      'Challenges': 'Changing skill requirements, funding constraints, engagement barriers',
      'Solutions': 'Flexible training models, employer-sponsored programs, career navigation support'
    },
    {
      id: 'mock-l10',
      'Dimension': 'Information Systems',
      'Topic': 'Data Integration',
      'Context': 'Creating integrated data systems to support evidence-based decision making during emergencies',
      'Leadership': 'Chief information officers, data scientists, emergency managers',
      'Teamwork': 'Cross-agency data teams, technology vendors, academic partners',
      'Data': 'System integration metrics, data quality assessments, usage analytics',
      'Resources': 'Data platforms, analytics tools, integration infrastructure',
      'Priority': 'Medium',
      'Implementation': 'Establish data governance, develop integration standards, build shared platforms',
      'Challenges': 'Data silos, privacy concerns, technical incompatibilities',
      'Solutions': 'Federated data models, privacy-preserving techniques, API standards'
    },
    {
      id: 'mock-l11',
      'Dimension': 'Healthcare Systems',
      'Topic': 'Mental Health Support',
      'Context': 'Developing comprehensive mental health support systems to address crisis-related psychological impacts',
      'Leadership': 'Mental health professionals, healthcare administrators, community advocates',
      'Teamwork': 'Integrated care teams, peer support networks, crisis response units',
      'Data': 'Mental health service utilization, outcomes tracking, community needs assessments',
      'Resources': 'Mental health facilities, crisis hotlines, peer support programs',
      'Priority': 'High',
      'Implementation': 'Expand access points, integrate with primary care, develop crisis response protocols',
      'Challenges': 'Stigma, provider shortages, funding limitations',
      'Solutions': 'Telemental health, peer support models, integrated care approaches'
    },
    {
      id: 'mock-l12',
      'Dimension': 'Environmental Resilience',
      'Topic': 'Urban Green Infrastructure',
      'Context': 'Developing green infrastructure to enhance urban resilience to climate and health challenges',
      'Leadership': 'Urban planners, environmental engineers, community designers',
      'Teamwork': 'Municipal departments, community groups, environmental organizations',
      'Data': 'Green space metrics, air quality monitoring, urban heat island data',
      'Resources': 'Parks, green roofs, bioswales, urban forests',
      'Priority': 'Medium',
      'Implementation': 'Green infrastructure planning, community greening programs, policy integration',
      'Challenges': 'Land use conflicts, maintenance costs, equitable distribution',
      'Solutions': 'Multi-benefit designs, community partnerships, innovative financing'
    },
    {
      id: 'mock-l13',
      'Dimension': 'Governance & Civic Engagement',
      'Topic': 'Emergency Governance',
      'Context': 'Establishing adaptive governance structures that maintain democratic principles during emergencies',
      'Leadership': 'Elected officials, emergency managers, legal advisors',
      'Teamwork': 'Government agencies, civil society, legal institutions',
      'Data': 'Decision-making metrics, public participation data, governance assessments',
      'Resources': 'Emergency operations centers, communication systems, legal frameworks',
      'Priority': 'High',
      'Implementation': 'Develop emergency protocols, ensure transparency, maintain accountability',
      'Challenges': 'Balancing speed with deliberation, maintaining civil liberties, public trust',
      'Solutions': 'Clear legal frameworks, public engagement mechanisms, oversight structures'
    },
    {
      id: 'mock-l14',
      'Dimension': 'Infrastructure Resilience',
      'Topic': 'Digital Infrastructure',
      'Context': 'Ensuring robust digital infrastructure to support remote work, education, and healthcare during disruptions',
      'Leadership': 'Technology leaders, infrastructure managers, digital equity advocates',
      'Teamwork': 'Internet service providers, government agencies, community organizations',
      'Data': 'Connectivity metrics, usage patterns, digital divide assessments',
      'Resources': 'Broadband networks, public wifi, device lending programs',
      'Priority': 'High',
      'Implementation': 'Expand broadband access, provide devices, digital literacy training',
      'Challenges': 'Infrastructure gaps, affordability, digital literacy',
      'Solutions': 'Public-private partnerships, subsidized access, community training programs'
    },
    {
      id: 'mock-l15',
      'Dimension': 'Social Equity & Well-being',
      'Topic': 'Food Security',
      'Context': 'Building resilient food systems that ensure access to nutritious food during disruptions',
      'Leadership': 'Food policy councils, agricultural leaders, nutrition advocates',
      'Teamwork': 'Food banks, farmers, distributors, community kitchens',
      'Data': 'Food access mapping, nutrition data, supply chain metrics',
      'Resources': 'Food distribution networks, community gardens, emergency food supplies',
      'Priority': 'High',
      'Implementation': 'Strengthen local food systems, expand food assistance, support urban agriculture',
      'Challenges': 'Supply chain vulnerabilities, food deserts, nutritional quality',
      'Solutions': 'Local food hubs, mobile markets, community-supported agriculture'
    },
    {
      id: 'mock-l16',
      'Dimension': 'Cultural Vitality',
      'Topic': 'Arts and Culture Support',
      'Context': 'Maintaining cultural activities and creative expression as sources of community resilience and healing',
      'Leadership': 'Arts organizations, cultural leaders, creative professionals',
      'Teamwork': 'Cultural institutions, artist collectives, community centers',
      'Data': 'Cultural participation rates, artist employment data, community impact assessments',
      'Resources': 'Performance spaces, art supplies, digital platforms, funding programs',
      'Priority': 'Medium',
      'Implementation': 'Support artist livelihoods, maintain cultural spaces, facilitate virtual programming',
      'Challenges': 'Funding cuts, venue closures, audience access',
      'Solutions': 'Emergency artist funds, hybrid programming, community partnerships'
    },
    {
      id: 'mock-l17',
      'Dimension': 'Healthcare Systems',
      'Topic': 'Pharmaceutical Supply Chain',
      'Context': 'Ensuring reliable access to essential medications and medical supplies during supply chain disruptions',
      'Leadership': 'Supply chain managers, pharmacists, healthcare procurement officers',
      'Teamwork': 'Pharmaceutical companies, distributors, healthcare facilities, government agencies',
      'Data': 'Inventory levels, supply chain mapping, demand forecasting',
      'Resources': 'Strategic reserves, distribution networks, manufacturing capacity',
      'Priority': 'High',
      'Implementation': 'Build strategic reserves, diversify suppliers, enhance tracking systems',
      'Challenges': 'Global dependencies, just-in-time systems, quality assurance',
      'Solutions': 'Regional manufacturing, predictive analytics, collaborative procurement'
    },
    {
      id: 'mock-l18',
      'Dimension': 'Information Systems',
      'Topic': 'Community Alert Systems',
      'Context': 'Developing multi-channel alert and communication systems for rapid emergency information dissemination',
      'Leadership': 'Emergency communication officers, technology managers, community liaisons',
      'Teamwork': 'Media partners, telecommunications providers, community organizations',
      'Data': 'Message reach metrics, response rates, system reliability data',
      'Resources': 'Alert platforms, communication channels, translation services',
      'Priority': 'High',
      'Implementation': 'Deploy multi-modal systems, ensure accessibility, test regularly',
      'Challenges': 'Alert fatigue, language barriers, technology gaps',
      'Solutions': 'Targeted messaging, multilingual capabilities, redundant systems'
    },
    {
      id: 'mock-l19',
      'Dimension': 'Economic Sustainability',
      'Topic': 'Financial Resilience',
      'Context': 'Building household and community financial resilience to weather economic disruptions',
      'Leadership': 'Financial counselors, credit unions, economic development officers',
      'Teamwork': 'Financial institutions, nonprofits, workforce agencies',
      'Data': 'Household financial health metrics, credit access data, savings rates',
      'Resources': 'Emergency funds, financial counseling, credit building programs',
      'Priority': 'High',
      'Implementation': 'Expand emergency savings programs, provide financial education, improve credit access',
      'Challenges': 'Low savings rates, predatory lending, financial literacy gaps',
      'Solutions': 'Matched savings programs, financial coaching, alternative credit models'
    },
    {
      id: 'mock-l20',
      'Dimension': 'Governance & Civic Engagement',
      'Topic': 'Youth Leadership Development',
      'Context': 'Engaging young people in resilience planning and leadership to build long-term community capacity',
      'Leadership': 'Youth organizations, educators, young leaders',
      'Teamwork': 'Schools, youth groups, mentorship programs, civic organizations',
      'Data': 'Youth engagement metrics, leadership development outcomes, program participation',
      'Resources': 'Youth centers, leadership programs, civic education curricula',
      'Priority': 'Medium',
      'Implementation': 'Create youth councils, develop leadership programs, support youth-led initiatives',
      'Challenges': 'Adult-centric planning, resource constraints, engagement barriers',
      'Solutions': 'Youth-adult partnerships, stipended positions, flexible programming'
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
  
  // Check if we should force comprehensive fallback for case studies in production
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
  const isCaseStudies = tableName.toLowerCase().includes('case study');
  
  if (isProduction && isCaseStudies) {
    console.log('🔍 Production environment detected for case studies, checking Airtable configuration...');
  }
  
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
        
        // Add timeout to prevent hanging during build
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Airtable request timeout after 10s')), 10000);
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
        console.log(`🟡 Falling back to mock data for ${tableName}`);
      }
    }
  } else {
    console.log(`🟡 Using mock data for ${tableName} (configured in environment)`);
  }
  
  // If Airtable fetch fails or is disabled, return mock data
  // Try exact match first, then lowercase match
  const mockEntry = mockData[tableName] || mockData[tableName.toLowerCase()] || [];
  
  // Special handling for case studies in production
  if (isProduction && isCaseStudies && mockEntry.length <= 2) {
    console.log('⚠️ Limited mock data for case studies in production - API should use comprehensive fallback');
    // Return an indicator that comprehensive fallback should be used
    return { useComprehensiveFallback: true, mockData: mockEntry };
  }
  
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

// Function to get Airtable tables (for admin interface)
export const getAirtableTables = async () => {
  const base = initAirtable();
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
