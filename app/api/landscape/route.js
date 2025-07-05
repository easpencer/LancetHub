import { NextResponse } from 'next/server';
import { fetchLandscapeData } from '../../../utils/airtable';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('🔄 Fetching landscape data from Airtable...');
    
    // Fetch from Airtable with increased maxRecords for production
    const landscapeTopics = await fetchLandscapeData({ 
      maxRecords: 200,
      view: 'Grid view'
    });
    
    console.log(`✅ Retrieved ${landscapeTopics.length} landscape topics from Airtable`);
    
    // Process records using dynamic field mapping to capture ALL Airtable data
    const processedTopics = landscapeTopics.map((record, index) => {
      // Log ALL available fields from the first few records
      if (index < 3) {
        console.log(`🔍 Landscape record ${index + 1} fields:`, Object.keys(record));
        console.log(`🔍 Landscape record ${index + 1} data:`, JSON.stringify(record, null, 2));
      }
      
      // Start with the record ID and then dynamically add ALL fields
      const processedRecord = {
        id: record.id || `landscape-${Date.now()}-${Math.random()}`,
        // Copy ALL fields from Airtable record directly
        ...record
      };
      
      // Add normalized/computed fields for consistent access
      const normalizedFields = {
        // Core landscape fields
        Dimension: record['Dimension'] || record['Resilience Dimension'] || '',
        Topic: record['Topic'] || record['Topic / Sub-Dimension'] || record['Sub-Dimension'] || record['Subject'] || '',
        Context: record['Context'] || record['Background'] || record['Description'] || '',
        
        // People and organizations
        Leadership: record['Leadership'] || record['People & Leadership'] || record['Leaders'] || record['Key People'] || '',
        Teamwork: record['Teamwork'] || record['Teamwork & Organizations'] || record['Organizations'] || record['Collaboration'] || '',
        
        // Information and resources
        Data: record['Data'] || record['Data & Knowledge'] || record['Information'] || record['Evidence'] || '',
        Resources: record['Resources'] || record['Resources & Products'] || record['Tools'] || record['Assets'] || '',
        
        // Additional descriptive fields
        Description: record['Description'] || record['Summary'] || record['Overview'] || '',
        Examples: record['Examples'] || record['Case Examples'] || record['Use Cases'] || '',
        Priority: record['Priority'] || record['Importance'] || record['Level'] || 'Medium',
        
        // Implementation details
        Implementation: record['Implementation'] || record['How To'] || record['Steps'] || '',
        Challenges: record['Challenges'] || record['Barriers'] || record['Obstacles'] || '',
        Solutions: record['Solutions'] || record['Approaches'] || record['Strategies'] || '',
        
        // Impact and outcomes
        Impact: record['Impact'] || record['Outcomes'] || record['Results'] || '',
        Metrics: record['Metrics'] || record['Indicators'] || record['Measures'] || '',
        Timeline: record['Timeline'] || record['Duration'] || record['Timeframe'] || '',
        
        // Stakeholders and relationships
        Stakeholders: record['Stakeholders'] || record['Key Players'] || record['Participants'] || '',
        Partnerships: record['Partnerships'] || record['Alliances'] || record['Networks'] || '',
        Community: record['Community'] || record['Community Role'] || record['Local Involvement'] || '',
        
        // Geographic and demographic considerations
        Geography: record['Geography'] || record['Location'] || record['Region'] || '',
        Demographics: record['Demographics'] || record['Population'] || record['Target Groups'] || '',
        
        // Resilience-specific fields
        ResilienceCapacity: record['Resilience Capacity'] || record['Capacity Building'] || '',
        Vulnerability: record['Vulnerability'] || record['Risks'] || record['Threats'] || '',
        Adaptation: record['Adaptation'] || record['Adaptive Capacity'] || '',
        
        // Quality and validation
        EvidenceBase: record['Evidence Base'] || record['Research'] || record['Studies'] || '',
        BestPractices: record['Best Practices'] || record['Lessons Learned'] || '',
        Recommendations: record['Recommendations'] || record['Guidance'] || '',
        
        // Cross-cutting themes
        Equity: record['Equity'] || record['Social Justice'] || record['Inclusion'] || '',
        Sustainability: record['Sustainability'] || record['Long-term Viability'] || '',
        Innovation: record['Innovation'] || record['Novel Approaches'] || ''
      };
      
      // Merge original fields with normalized fields
      return {
        ...processedRecord,
        ...normalizedFields
      };
    });
    
    return NextResponse.json({ landscape: processedTopics });
  } catch (error) {
    console.error('🔴 Error loading landscape data from Airtable:', error);
    
    // Comprehensive fallback data based on the commission's framework
    const fallbackData = [
      {
        id: 'land-1',
        Dimension: 'Social Equity & Well-being',
        Topic: 'Healthcare Access',
        Context: 'Ensuring equitable access to healthcare services for all population groups, particularly during health emergencies',
        Leadership: 'Community health leaders, healthcare administrators, policy advocates',
        Teamwork: 'Multi-sector collaboration between healthcare providers, community organizations, and government agencies',
        Data: 'Healthcare utilization metrics, health equity assessments, population health data',
        Resources: 'Community health centers, mobile health units, telehealth infrastructure'
      },
      {
        id: 'land-2',
        Dimension: 'Environmental Resilience',
        Topic: 'Climate Adaptation',
        Context: 'Building community capacity to respond to climate-related health threats and environmental changes',
        Leadership: 'Environmental planners, public health officials, community advocates',
        Teamwork: 'Cross-sector partnerships between environmental, health, and emergency management agencies',
        Data: 'Climate vulnerability assessments, health impact projections, environmental monitoring',
        Resources: 'Green infrastructure, cooling centers, early warning systems'
      },
      {
        id: 'land-3',
        Dimension: 'Economic Sustainability',
        Topic: 'Small Business Resilience',
        Context: 'Supporting small businesses through crisis and recovery to maintain community economic stability',
        Leadership: 'Business leaders, economic development officers, chamber of commerce',
        Teamwork: 'Business networks, cooperative associations, public-private partnerships',
        Data: 'Business continuity metrics, economic impact assessments, recovery indicators',
        Resources: 'Emergency business loans, technical assistance programs, shared resources'
      },
      {
        id: 'land-4',
        Dimension: 'Healthcare Systems',
        Topic: 'Surge Capacity',
        Context: 'Developing flexible healthcare capacity to respond to sudden increases in demand during emergencies',
        Leadership: 'Hospital administrators, emergency managers, healthcare coordinators',
        Teamwork: 'Regional healthcare coalitions, mutual aid agreements, coordinated response teams',
        Data: 'Bed capacity tracking, staffing levels, resource utilization metrics',
        Resources: 'Alternative care sites, medical reserve corps, emergency medical supplies'
      },
      {
        id: 'land-5',
        Dimension: 'Information Systems',
        Topic: 'Crisis Communication',
        Context: 'Establishing trusted communication channels to combat misinformation and ensure accurate information flow',
        Leadership: 'Public information officers, community trusted messengers, media partners',
        Teamwork: 'Joint information centers, community advisory groups, media collaborations',
        Data: 'Information reach metrics, message testing data, trust indicators',
        Resources: 'Multi-language communication tools, community radio, digital platforms'
      },
      {
        id: 'land-6',
        Dimension: 'Infrastructure Resilience',
        Topic: 'Essential Services Continuity',
        Context: 'Maintaining critical infrastructure and services during disruptions to support community functions',
        Leadership: 'Infrastructure managers, utility operators, emergency coordinators',
        Teamwork: 'Infrastructure working groups, public-private coordination, regional partnerships',
        Data: 'Service disruption tracking, redundancy assessments, vulnerability mapping',
        Resources: 'Backup systems, distributed resources, hardened infrastructure'
      },
      {
        id: 'land-7',
        Dimension: 'Governance & Civic Engagement',
        Topic: 'Community Participation',
        Context: 'Engaging community members in resilience planning and decision-making processes',
        Leadership: 'Community organizers, civic leaders, neighborhood representatives',
        Teamwork: 'Community coalitions, participatory planning groups, civic organizations',
        Data: 'Participation metrics, community feedback, engagement outcomes',
        Resources: 'Community centers, digital engagement platforms, facilitation support'
      },
      {
        id: 'land-8',
        Dimension: 'Cultural Vitality',
        Topic: 'Cultural Preservation',
        Context: 'Maintaining cultural practices and community bonds that strengthen resilience during crises',
        Leadership: 'Cultural leaders, faith-based organizations, community elders',
        Teamwork: 'Cultural organizations, interfaith networks, community groups',
        Data: 'Cultural participation data, community cohesion metrics, social capital assessments',
        Resources: 'Cultural centers, community gathering spaces, cultural programs'
      }
    ];
    
    console.log('📋 Using fallback landscape data');
    return NextResponse.json({ 
      landscape: fallbackData,
      source: 'fallback',
      error: error.message 
    });
  }
}