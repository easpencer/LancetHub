import { NextResponse } from 'next/server';
import { fetchLandscapeData } from '../../../utils/airtable';

export const dynamic = 'force-dynamic';

// Helper function to get fallback data
function getFallbackLandscapeData() {
  return [
    {
      id: 'land-1',
      Dimension: 'Social Equity & Well-being',
      Topic: 'Healthcare Access',
      Context: 'Ensuring equitable access to healthcare services for all population groups, particularly during health emergencies',
      Leadership: 'Community health leaders, healthcare administrators, policy advocates',
      Teamwork: 'Multi-sector collaboration between healthcare providers, community organizations, and government agencies',
      Data: 'Healthcare utilization metrics, health equity assessments, population health data',
      Resources: 'Community health centers, mobile health units, telehealth infrastructure',
      Priority: 'High',
      Implementation: 'Establish community health hubs, deploy mobile units to underserved areas, expand telehealth capabilities',
      Challenges: 'Digital divide, language barriers, trust issues in marginalized communities',
      Solutions: 'Culturally competent care, community health workers, multilingual services',
      Impact: 'Improved health outcomes, reduced disparities, enhanced community trust',
      Stakeholders: 'Healthcare providers, community organizations, local government, patients',
      BestPractices: 'Community-based participatory approaches, data-driven targeting, continuous feedback loops'
    },
    {
      id: 'land-2',
      Dimension: 'Environmental Resilience',
      Topic: 'Climate Adaptation',
      Context: 'Building community capacity to respond to climate-related health threats and environmental changes',
      Leadership: 'Environmental planners, public health officials, community advocates',
      Teamwork: 'Cross-sector partnerships between environmental, health, and emergency management agencies',
      Data: 'Climate vulnerability assessments, health impact projections, environmental monitoring',
      Resources: 'Green infrastructure, cooling centers, early warning systems',
      Priority: 'High',
      Implementation: 'Develop climate adaptation plans, create cooling infrastructure, establish early warning systems',
      Challenges: 'Resource constraints, competing priorities, climate uncertainty',
      Solutions: 'Nature-based solutions, community engagement, predictive modeling',
      Impact: 'Reduced heat-related illnesses, improved air quality, enhanced community resilience',
      Stakeholders: 'Environmental agencies, health departments, community groups, residents',
      BestPractices: 'Integrated planning approaches, equity-focused interventions, adaptive management'
    },
    {
      id: 'land-3',
      Dimension: 'Economic Sustainability',
      Topic: 'Small Business Resilience',
      Context: 'Supporting small businesses through crisis and recovery to maintain community economic stability',
      Leadership: 'Business leaders, economic development officers, chamber of commerce',
      Teamwork: 'Business networks, cooperative associations, public-private partnerships',
      Data: 'Business continuity metrics, economic impact assessments, recovery indicators',
      Resources: 'Emergency business loans, technical assistance programs, shared resources',
      Priority: 'High',
      Implementation: 'Create business continuity planning support, establish emergency loan funds, develop resource sharing networks',
      Challenges: 'Limited capital reserves, supply chain disruptions, workforce challenges',
      Solutions: 'Cooperative business models, digital transformation, diversified revenue streams',
      Impact: 'Sustained local employment, maintained essential services, faster economic recovery',
      Stakeholders: 'Small businesses, financial institutions, workforce agencies, customers',
      BestPractices: 'Peer learning networks, flexible support programs, local procurement preferences'
    },
    {
      id: 'land-4',
      Dimension: 'Healthcare Systems',
      Topic: 'Surge Capacity',
      Context: 'Developing flexible healthcare capacity to respond to sudden increases in demand during emergencies',
      Leadership: 'Hospital administrators, emergency managers, healthcare coordinators',
      Teamwork: 'Regional healthcare coalitions, mutual aid agreements, coordinated response teams',
      Data: 'Bed capacity tracking, staffing levels, resource utilization metrics',
      Resources: 'Alternative care sites, medical reserve corps, emergency medical supplies',
      Priority: 'Critical',
      Implementation: 'Establish surge plans, create alternative care sites, build reserve workforce',
      Challenges: 'Staff burnout, equipment shortages, coordination complexity',
      Solutions: 'Flexible staffing models, regional coordination, just-in-time training',
      Impact: 'Maintained care quality during surges, reduced mortality, preserved system function',
      Stakeholders: 'Hospitals, emergency services, public health agencies, healthcare workers',
      BestPractices: 'Regular surge exercises, cross-training programs, tiered response protocols'
    },
    {
      id: 'land-5',
      Dimension: 'Information Systems',
      Topic: 'Crisis Communication',
      Context: 'Establishing trusted communication channels to combat misinformation and ensure accurate information flow',
      Leadership: 'Public information officers, community trusted messengers, media partners',
      Teamwork: 'Joint information centers, community advisory groups, media collaborations',
      Data: 'Information reach metrics, message testing data, trust indicators',
      Resources: 'Multi-language communication tools, community radio, digital platforms',
      Priority: 'Critical',
      Implementation: 'Build trusted messenger networks, establish verification systems, create rapid response protocols',
      Challenges: 'Misinformation spread, trust deficits, information overload',
      Solutions: 'Community-based messaging, fact-checking partnerships, clear communication protocols',
      Impact: 'Increased public compliance, reduced misinformation impact, enhanced trust',
      Stakeholders: 'Media organizations, community leaders, social media platforms, public',
      BestPractices: 'Pre-tested messages, diverse communication channels, transparency principles'
    },
    {
      id: 'land-6',
      Dimension: 'Infrastructure Resilience',
      Topic: 'Essential Services Continuity',
      Context: 'Maintaining critical infrastructure and services during disruptions to support community functions',
      Leadership: 'Infrastructure managers, utility operators, emergency coordinators',
      Teamwork: 'Infrastructure working groups, public-private coordination, regional partnerships',
      Data: 'Service disruption tracking, redundancy assessments, vulnerability mapping',
      Resources: 'Backup systems, distributed resources, hardened infrastructure',
      Priority: 'Critical',
      Implementation: 'Harden critical infrastructure, build redundancies, establish restoration priorities',
      Challenges: 'Aging infrastructure, funding gaps, interdependencies',
      Solutions: 'Smart grid technologies, distributed systems, public-private partnerships',
      Impact: 'Minimized service disruptions, faster restoration, maintained essential functions',
      Stakeholders: 'Utility companies, government agencies, critical facilities, residents',
      BestPractices: 'Risk-based prioritization, cross-sector coordination, continuous improvement'
    },
    {
      id: 'land-7',
      Dimension: 'Governance & Civic Engagement',
      Topic: 'Community Participation',
      Context: 'Engaging community members in resilience planning and decision-making processes',
      Leadership: 'Community organizers, civic leaders, neighborhood representatives',
      Teamwork: 'Community coalitions, participatory planning groups, civic organizations',
      Data: 'Participation metrics, community feedback, engagement outcomes',
      Resources: 'Community centers, digital engagement platforms, facilitation support',
      Priority: 'High',
      Implementation: 'Create participatory planning processes, establish community advisory boards, support grassroots organizing',
      Challenges: 'Power imbalances, participation barriers, representation gaps',
      Solutions: 'Inclusive engagement methods, compensation for participation, capacity building',
      Impact: 'Improved plan effectiveness, increased community buy-in, stronger social cohesion',
      Stakeholders: 'Residents, community organizations, local government, advocacy groups',
      BestPractices: 'Co-design approaches, accessible meeting formats, continuous feedback loops'
    },
    {
      id: 'land-8',
      Dimension: 'Cultural Vitality',
      Topic: 'Cultural Preservation',
      Context: 'Maintaining cultural practices and community bonds that strengthen resilience during crises',
      Leadership: 'Cultural leaders, faith-based organizations, community elders',
      Teamwork: 'Cultural organizations, interfaith networks, community groups',
      Data: 'Cultural participation data, community cohesion metrics, social capital assessments',
      Resources: 'Cultural centers, community gathering spaces, cultural programs',
      Priority: 'Medium',
      Implementation: 'Support cultural institutions, facilitate interfaith cooperation, preserve cultural practices',
      Challenges: 'Funding limitations, generational gaps, cultural tensions',
      Solutions: 'Cultural preservation programs, intergenerational activities, inclusive celebrations',
      Impact: 'Maintained community identity, enhanced social bonds, improved collective resilience',
      Stakeholders: 'Cultural institutions, faith communities, artists, community members',
      BestPractices: 'Asset-based approaches, cultural competency, inclusive programming'
    },
    {
      id: 'land-9',
      Dimension: 'Economic Sustainability',
      Topic: 'Workforce Development',
      Context: 'Building resilient workforce capabilities to adapt to changing economic conditions and crisis scenarios',
      Leadership: 'Workforce development boards, educational institutions, industry leaders',
      Teamwork: 'Public-private partnerships, educational collaborations, apprenticeship programs',
      Data: 'Skills gap analysis, employment trends, training outcomes',
      Resources: 'Training programs, career centers, online learning platforms',
      Priority: 'High',
      Implementation: 'Rapid reskilling programs, career pathway development, employer partnerships',
      Challenges: 'Changing skill requirements, funding constraints, engagement barriers',
      Solutions: 'Flexible training models, employer-sponsored programs, career navigation support',
      Impact: 'Enhanced workforce adaptability, reduced unemployment, economic recovery',
      Stakeholders: 'Workers, employers, educational institutions, workforce agencies',
      BestPractices: 'Industry-aligned training, stackable credentials, wraparound support services'
    },
    {
      id: 'land-10',
      Dimension: 'Information Systems',
      Topic: 'Data Integration',
      Context: 'Creating integrated data systems to support evidence-based decision making during emergencies',
      Leadership: 'Chief information officers, data scientists, emergency managers',
      Teamwork: 'Cross-agency data teams, technology vendors, academic partners',
      Data: 'System integration metrics, data quality assessments, usage analytics',
      Resources: 'Data platforms, analytics tools, integration infrastructure',
      Priority: 'Medium',
      Implementation: 'Establish data governance, develop integration standards, build shared platforms',
      Challenges: 'Data silos, privacy concerns, technical incompatibilities',
      Solutions: 'Federated data models, privacy-preserving techniques, API standards',
      Impact: 'Improved decision making, faster response times, better outcomes',
      Stakeholders: 'Government agencies, healthcare systems, research institutions',
      BestPractices: 'Open standards, privacy by design, continuous validation'
    }
  ];
}

export async function GET() {
  try {
    console.log('🔄 Attempting to fetch landscape data from Airtable...');
    
    // Check if the table exists first
    let landscapeTopics = [];
    let tableExists = false;
    
    try {
      // Try to fetch from Airtable
      landscapeTopics = await fetchLandscapeData({ 
        maxRecords: 200,
        view: 'Grid view'
      });
      tableExists = true;
      console.log(`✅ Retrieved ${landscapeTopics.length} landscape topics from Airtable`);
    } catch (error) {
      console.log('⚠️ Landscape topics table not accessible:', error.message);
      console.log('📋 Using comprehensive fallback data instead');
    }
    
    // If no data or table doesn't exist, use fallback
    if (!tableExists || landscapeTopics.length === 0) {
      console.log('📋 Using fallback landscape data');
      return NextResponse.json({ 
        landscape: getFallbackLandscapeData(),
        source: 'fallback',
        message: 'Using fallback data - Landscape topics table not available in Airtable' 
      });
    }
    
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
    console.log('📋 Using fallback landscape data');
    
    return NextResponse.json({ 
      landscape: getFallbackLandscapeData(),
      source: 'fallback',
      error: error.message 
    });
  }
}