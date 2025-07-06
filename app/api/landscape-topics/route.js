import { NextResponse } from 'next/server';
import { fetchLandscapeData } from '../../../utils/airtable';

export const dynamic = 'force-dynamic';

// Comprehensive fallback data for landscape topics
const fallbackLandscapeTopics = [
  {
    id: 'lt-1',
    Topic: 'Community Health Worker Networks',
    Dimension: 'Healthcare Systems',
    Context: 'Leveraging community health workers to build trust and deliver culturally competent care in underserved communities',
    Leadership: 'Local health departments partnering with community organizations',
    Teamwork: 'CHWs, nurses, physicians, and social workers collaborating',
    Data: 'Track health outcomes, vaccination rates, and community engagement',
    Resources: 'Training programs, communication tools, transportation support',
    Importance: 'High',
    Category: 'Health Equity'
  },
  {
    id: 'lt-2',
    Topic: 'Mutual Aid Networks',
    Dimension: 'Social Equity & Well-being',
    Context: 'Community-organized support systems that provide rapid response during crises',
    Leadership: 'Grassroots organizers and community members',
    Teamwork: 'Neighbors helping neighbors with food, shelter, and resources',
    Data: 'Distribution metrics, community needs assessments',
    Resources: 'Digital platforms, volunteer coordination, donation management',
    Importance: 'High',
    Category: 'Community Support'
  },
  {
    id: 'lt-3',
    Topic: 'Digital Infrastructure Equity',
    Dimension: 'Infrastructure Resilience',
    Context: 'Ensuring equitable access to digital tools and connectivity for remote work, education, and healthcare',
    Leadership: 'Public-private partnerships, educational institutions',
    Teamwork: 'ISPs, schools, libraries, community centers',
    Data: 'Broadband coverage maps, device access statistics',
    Resources: 'WiFi hotspots, device lending programs, digital literacy training',
    Importance: 'Critical',
    Category: 'Digital Equity'
  },
  {
    id: 'lt-4',
    Topic: 'Local Food Systems',
    Dimension: 'Environmental Resilience',
    Context: 'Building resilient food supply chains through urban agriculture and local production',
    Leadership: 'Urban farmers, food policy councils',
    Teamwork: 'Farmers, distributors, community gardens, schools',
    Data: 'Food production metrics, distribution networks, food security indices',
    Resources: 'Land access, seeds, farming equipment, storage facilities',
    Importance: 'High',
    Category: 'Food Security'
  },
  {
    id: 'lt-5',
    Topic: 'Small Business Resilience',
    Dimension: 'Economic Sustainability',
    Context: 'Supporting small businesses through cooperatives and mutual support networks',
    Leadership: 'Business associations, economic development agencies',
    Teamwork: 'Business owners, financial institutions, technical assistance providers',
    Data: 'Business survival rates, employment data, revenue impacts',
    Resources: 'Grants, loans, technical assistance, shared resources',
    Importance: 'Critical',
    Category: 'Economic Development'
  },
  {
    id: 'lt-6',
    Topic: 'Traditional Knowledge Systems',
    Dimension: 'Cultural Vitality',
    Context: 'Preserving and applying Indigenous and traditional practices for community resilience',
    Leadership: 'Elders, cultural practitioners, Indigenous leaders',
    Teamwork: 'Intergenerational knowledge transfer, cultural centers',
    Data: 'Cultural practice documentation, language preservation metrics',
    Resources: 'Cultural centers, documentation tools, youth programs',
    Importance: 'High',
    Category: 'Cultural Preservation'
  },
  {
    id: 'lt-7',
    Topic: 'Climate Adaptation Planning',
    Dimension: 'Environmental Resilience',
    Context: 'Community-led climate resilience planning for extreme weather events',
    Leadership: 'Environmental justice organizations, city planners',
    Teamwork: 'Residents, scientists, emergency managers, infrastructure teams',
    Data: 'Climate projections, vulnerability assessments, adaptation metrics',
    Resources: 'Green infrastructure, early warning systems, cooling centers',
    Importance: 'Critical',
    Category: 'Climate Justice'
  },
  {
    id: 'lt-8',
    Topic: 'Participatory Governance',
    Dimension: 'Governance & Civic Engagement',
    Context: 'Engaging communities in decision-making through participatory budgeting and planning',
    Leadership: 'Community organizers, local government',
    Teamwork: 'Residents, facilitators, government staff',
    Data: 'Participation rates, project outcomes, satisfaction surveys',
    Resources: 'Meeting spaces, translation services, digital platforms',
    Importance: 'Medium',
    Category: 'Democratic Participation'
  },
  {
    id: 'lt-9',
    Topic: 'Mental Health Support Systems',
    Dimension: 'Healthcare Systems',
    Context: 'Building community-based mental health support including peer networks',
    Leadership: 'Mental health advocates, peer support specialists',
    Teamwork: 'Therapists, peer counselors, community organizations',
    Data: 'Service utilization, mental health outcomes, stigma reduction',
    Resources: 'Training programs, safe spaces, crisis hotlines',
    Importance: 'High',
    Category: 'Mental Health'
  },
  {
    id: 'lt-10',
    Topic: 'Information Ecosystem Health',
    Dimension: 'Information Systems',
    Context: 'Combating misinformation and building trusted information networks',
    Leadership: 'Journalists, educators, community leaders',
    Teamwork: 'Media literacy educators, fact-checkers, trusted messengers',
    Data: 'Information spread patterns, trust metrics, media literacy rates',
    Resources: 'Training materials, verification tools, communication channels',
    Importance: 'Critical',
    Category: 'Information Integrity'
  }
];

export async function GET() {
  try {
    console.log('🔄 Fetching landscape topics data from Airtable...');
    
    // Try to fetch from Landscape table in Airtable
    const landscapeTopics = await fetchLandscapeData({
      maxRecords: 500,
      view: 'Grid view'
    });
    
    // Use the data we get
    let topics = fallbackLandscapeTopics;
    let source = 'fallback';
    
    if (landscapeTopics && landscapeTopics.length > 0) {
      console.log(`✅ Retrieved ${landscapeTopics.length} landscape topics from Airtable`);
      topics = landscapeTopics;
      source = 'airtable';
    } else {
      console.log('📋 Using fallback landscape topics data');
    }
    
    // Process data for frontend visualization
    const processedData = processLandscapeData(topics);
    
    return NextResponse.json({ 
      ...processedData,
      lastUpdated: new Date().toISOString(),
      source
    });
    
  } catch (error) {
    console.error('🔴 Error fetching landscape topics:', error);
    
    // Return processed fallback data on error
    const processedData = processLandscapeData(fallbackLandscapeTopics);
    
    return NextResponse.json({ 
      ...processedData,
      lastUpdated: new Date().toISOString(),
      source: 'fallback',
      error: error.message
    });
  }
}

// Process landscape data for frontend visualization
function processLandscapeData(topics) {
  // Group topics by dimension
  const groupedByDimension = {};
  const dimensionCounts = {};
  
  topics.forEach(topic => {
    const dimension = topic.Dimension || 'Other';
    if (!groupedByDimension[dimension]) {
      groupedByDimension[dimension] = [];
      dimensionCounts[dimension] = 0;
    }
    groupedByDimension[dimension].push({
      id: topic.id,
      topic: topic.Topic,
      dimension: dimension,
      context: topic.Context,
      leadership: topic.Leadership,
      teamwork: topic.Teamwork,
      data: topic.Data,
      resources: topic.Resources,
      importance: topic.Importance,
      category: topic.Category
    });
    dimensionCounts[dimension]++;
  });
  
  // Create dimension stats
  const dimensionStats = Object.entries(dimensionCounts).map(([dimension, count]) => ({
    dimension,
    topicCount: count,
    keyThemes: extractKeyThemes(groupedByDimension[dimension])
  }));
  
  // Get unique dimensions
  const dimensions = Object.keys(groupedByDimension);
  
  return {
    landscapeTopics: topics,
    totalTopics: topics.length,
    dimensions,
    dimensionStats,
    groupedByDimension
  };
}

// Extract key themes from topics in a dimension
function extractKeyThemes(topics) {
  const themes = [];
  topics.forEach(topic => {
    if (topic.category) themes.push(topic.category);
  });
  return [...new Set(themes)].slice(0, 3);
}

// Determine importance based on dimension and count
function determineImportance(count, dimension) {
  if (dimension === 'Social Equity & Well-being' || dimension === 'Knowledge & Learning') {
    return 'Critical';
  }
  if (count > 3) return 'High';
  if (count > 1) return 'Medium';
  return 'Low';
}