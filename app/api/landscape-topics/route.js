import { NextResponse } from 'next/server';
import { fetchLandscapeData } from '../../../utils/airtable';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('🔄 Fetching landscape topics data...');
    
    // Fetch landscape topics from Airtable
    const landscapeTopics = await fetchLandscapeData({
      maxRecords: 100,
      view: 'Grid view'
    });
    
    console.log(`✅ Retrieved ${landscapeTopics.length} landscape topics`);
    
    // Group topics by dimension for better visualization
    const groupedByDimension = {};
    
    landscapeTopics.forEach(topic => {
      const dimension = topic.Dimension || 'Other';
      if (!groupedByDimension[dimension]) {
        groupedByDimension[dimension] = [];
      }
      groupedByDimension[dimension].push({
        id: topic.id,
        topic: topic.Topic,
        context: topic.Context,
        leadership: topic.Leadership,
        teamwork: topic.Teamwork,
        data: topic.Data,
        resources: topic.Resources,
        importance: topic.Importance || 'Medium',
        category: topic.Category || 'General'
      });
    });
    
    // Create dimension summary statistics
    const dimensionStats = Object.entries(groupedByDimension).map(([dimension, topics]) => ({
      dimension,
      topicCount: topics.length,
      keyThemes: topics.slice(0, 3).map(t => t.topic)
    }));
    
    return NextResponse.json({ 
      landscapeTopics,
      groupedByDimension,
      dimensionStats,
      totalTopics: landscapeTopics.length,
      dimensions: Object.keys(groupedByDimension),
      lastUpdated: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('🔴 Error fetching landscape topics:', error);
    
    // Return enhanced fallback data
    const fallbackData = {
      landscapeTopics: [
        {
          id: 'lt-1',
          Dimension: 'Healthcare Systems',
          Topic: 'Pandemic Preparedness Infrastructure',
          Context: 'Healthcare systems need robust infrastructure to detect, respond to, and mitigate pandemic threats. This includes surveillance systems, laboratory capacity, and rapid response mechanisms.',
          Leadership: 'Public health officials, hospital administrators, emergency management directors, and community health leaders',
          Teamwork: 'Multi-sector collaboration between healthcare providers, public health agencies, research institutions, and community organizations',
          Data: 'Real-time disease surveillance data, healthcare capacity metrics, laboratory testing volumes, and community vulnerability assessments',
          Resources: 'Emergency medical supplies, testing laboratories, isolation facilities, trained healthcare workforce, and communication systems',
          Importance: 'Critical',
          Category: 'Infrastructure'
        },
        {
          id: 'lt-2',
          Dimension: 'Information Systems',
          Topic: 'Combating Health Misinformation',
          Context: 'Misinformation during health emergencies undermines public trust and response effectiveness. Building resilient information systems requires proactive communication strategies and trusted messenger networks.',
          Leadership: 'Science communicators, public health educators, community leaders, and trusted local voices',
          Teamwork: 'Partnerships between health departments, media organizations, community groups, and social media platforms',
          Data: 'Social media monitoring, public sentiment analysis, information spread patterns, and trust metrics',
          Resources: 'Communication platforms, fact-checking infrastructure, community education programs, and trusted messenger training',
          Importance: 'High',
          Category: 'Communication'
        },
        {
          id: 'lt-3',
          Dimension: 'Social Equity & Well-being',
          Topic: 'Addressing Health Disparities',
          Context: 'Pandemics disproportionately affect vulnerable populations. Building equitable systems requires targeted interventions and community-centered approaches.',
          Leadership: 'Community advocates, health equity officers, social service coordinators, and grassroots organizers',
          Teamwork: 'Cross-sector partnerships addressing social determinants of health, including housing, employment, and healthcare access',
          Data: 'Health disparity indicators, social vulnerability indices, community needs assessments, and equity metrics',
          Resources: 'Community health centers, mobile health units, social support programs, and culturally appropriate interventions',
          Importance: 'Critical',
          Category: 'Equity'
        },
        {
          id: 'lt-4',
          Dimension: 'Economic Sustainability',
          Topic: 'Economic Resilience During Health Crises',
          Context: 'Economic systems must adapt to maintain essential services while protecting public health. This requires flexible policies and support mechanisms.',
          Leadership: 'Economic development officials, business leaders, workforce development agencies, and financial institutions',
          Teamwork: 'Public-private partnerships, small business support networks, and workforce retraining collaborations',
          Data: 'Employment statistics, business continuity metrics, supply chain data, and economic recovery indicators',
          Resources: 'Emergency business loans, unemployment support systems, digital infrastructure, and workforce development programs',
          Importance: 'High',
          Category: 'Economic'
        },
        {
          id: 'lt-5',
          Dimension: 'Governance & Civic Engagement',
          Topic: 'Adaptive Governance Mechanisms',
          Context: 'Effective pandemic response requires flexible governance structures that can adapt quickly while maintaining democratic principles and community engagement.',
          Leadership: 'Government officials, emergency managers, civic leaders, and community representatives',
          Teamwork: 'Inter-agency coordination, community advisory boards, and public-private partnerships',
          Data: 'Policy effectiveness metrics, community engagement levels, response time data, and coordination assessments',
          Resources: 'Emergency management systems, communication infrastructure, decision-support tools, and community engagement platforms',
          Importance: 'High',
          Category: 'Governance'
        }
      ]
    };
    
    // Group fallback data by dimension
    const grouped = {};
    fallbackData.landscapeTopics.forEach(topic => {
      const dim = topic.Dimension;
      if (!grouped[dim]) grouped[dim] = [];
      grouped[dim].push({
        id: topic.id,
        topic: topic.Topic,
        context: topic.Context,
        leadership: topic.Leadership,
        teamwork: topic.Teamwork,
        data: topic.Data,
        resources: topic.Resources,
        importance: topic.Importance,
        category: topic.Category
      });
    });
    
    return NextResponse.json({
      landscapeTopics: fallbackData.landscapeTopics,
      groupedByDimension: grouped,
      dimensionStats: Object.entries(grouped).map(([dimension, topics]) => ({
        dimension,
        topicCount: topics.length,
        keyThemes: topics.map(t => t.topic)
      })),
      totalTopics: fallbackData.landscapeTopics.length,
      dimensions: Object.keys(grouped),
      source: 'fallback',
      error: error.message
    });
  }
}