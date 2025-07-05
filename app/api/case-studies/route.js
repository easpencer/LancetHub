import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('🔄 API route /api/case-studies called - returning comprehensive fallback data');
    
    // Comprehensive fallback data with 15 realistic case studies
    const fallbackData = [
      {
        id: 'sample-1',
        Title: 'Community Health Worker Networks During COVID-19: Lessons from New Mexico',
        Author: 'Dr. Maria Gonzalez',
        Type: 'Case Study',
        Date: '2024-01-15',
        Description: 'Analysis of how community health worker networks maintained continuity of care and built trust in rural New Mexico communities during the COVID-19 pandemic.',
        Focus: 'Community health worker programs as pillars of pandemic resilience in underserved rural communities, examining trust-building, culturally responsive care, and health equity outcomes.',
        Dimensions: 'Healthcare Systems, Social Equity & Well-being, Cultural Vitality',
        Relevance: 'Demonstrates how community-based health infrastructure can serve as a critical resilience asset, providing both immediate pandemic response and long-term community capacity building.',
        Institution: 'University of New Mexico School of Medicine',
        Keywords: 'community health workers, rural health, pandemic response, health equity, trust',
        Methodology: 'Mixed-methods study including interviews with 45 CHWs, health outcome data analysis, and community surveys',
        Findings: 'CHW networks increased COVID-19 testing rates by 34% and vaccination acceptance by 28% in participating communities',
        Recommendations: 'Invest in sustainable funding for CHW programs, establish formal integration with healthcare systems, and develop CHW specialization in pandemic preparedness'
      },
      {
        id: 'sample-2',
        Title: 'Faith-Based Organizations as Information Hubs: Combating Misinformation in African American Communities',
        Author: 'Rev. Dr. James Washington',
        Type: 'Field Report',
        Date: '2024-02-08',
        Description: 'Documentation of how Black churches in Atlanta developed trusted messenger programs to counter health misinformation during COVID-19.',
        Focus: 'The role of faith-based organizations in serving as trusted sources of health information and their strategies for building vaccine confidence in historically marginalized communities.',
        Dimensions: 'Information Systems, Social Equity & Well-being, Cultural Vitality, Governance & Civic Engagement',
        Relevance: 'Illustrates how existing community institutions can be leveraged to build information resilience and combat the "infodemic" that undermines public health responses.',
        Institution: 'Emory University School of Public Health',
        Keywords: 'faith-based organizations, misinformation, vaccine hesitancy, trusted messengers, African American health',
        Methodology: 'Participatory action research with 12 churches, social media analysis, and congregation survey data',
        Findings: 'Churches using trained health ambassadors saw 67% higher vaccination rates compared to control congregations',
        Recommendations: 'Develop formal partnerships between public health agencies and faith communities, provide ongoing training for faith-based health ambassadors'
      },
      {
        id: 'sample-3',
        Title: 'Mutual Aid Networks and Economic Resilience: The Oakland Model',
        Author: 'Dr. Keisha Williams',
        Type: 'Research Paper',
        Date: '2024-03-12',
        Description: 'Comprehensive analysis of grassroots mutual aid networks that emerged during COVID-19 in Oakland, CA, and their role in economic resilience.',
        Focus: 'How community-organized mutual aid filled gaps in government response and created sustainable models for economic resilience in low-income communities of color.',
        Dimensions: 'Economic Sustainability, Social Equity & Well-being, Governance & Civic Engagement',
        Relevance: 'Shows how community-led economic support systems can provide rapid response capabilities while building long-term social cohesion and collective efficacy.',
        Institution: 'UC Berkeley School of Social Welfare',
        Keywords: 'mutual aid, economic resilience, community organizing, COVID-19 response, racial equity',
        Methodology: 'Ethnographic study of 8 mutual aid groups, economic impact analysis, and 200+ participant surveys',
        Findings: 'Mutual aid networks distributed $2.3M in direct aid and created lasting community connections, with 78% of participants reporting increased civic engagement',
        Recommendations: 'Formalize mutual aid networks in emergency planning, provide capacity-building support, and create funding mechanisms that preserve community control'
      },
      {
        id: 'sample-4',
        Title: 'Digital Divide and Pandemic Learning: Rural Broadband Solutions in Montana',
        Author: 'Dr. Robert Bear Chief',
        Type: 'Case Study',
        Date: '2024-01-28',
        Description: 'Examination of innovative broadband solutions implemented by tribal and rural communities to address educational continuity during school closures.',
        Focus: 'Community-driven digital infrastructure development and the intersection of technology access, educational equity, and pandemic resilience in rural and tribal communities.',
        Dimensions: 'Infrastructure Resilience, Social Equity & Well-being, Cultural Vitality',
        Relevance: 'Demonstrates how communities can develop technological resilience through local solutions while addressing long-standing digital equity issues.',
        Institution: 'Montana State University',
        Keywords: 'digital divide, rural broadband, tribal communities, educational equity, pandemic response',
        Methodology: 'Community-based participatory research with 6 tribal nations and 15 rural districts, technology adoption tracking',
        Findings: 'Community-managed WiFi networks increased student engagement by 52% and reduced dropout risk during remote learning',
        Recommendations: 'Support community ownership models for broadband infrastructure, integrate digital equity into pandemic preparedness planning'
      },
      {
        id: 'sample-5',
        Title: 'Small Business Resilience Networks: Cooperative Models in Detroit',
        Author: 'Dr. Angela Davis-Smith',
        Type: 'Research Paper',
        Date: '2024-02-20',
        Description: 'Study of how small business cooperatives and networks provided mutual support during COVID-19 economic disruptions in Detroit.',
        Focus: 'Cooperative business models and inter-business support networks as strategies for economic resilience in post-industrial urban environments.',
        Dimensions: 'Economic Sustainability, Social Equity & Well-being, Governance & Civic Engagement',
        Relevance: 'Illustrates how collaborative economic structures can provide stability during crises while building long-term community wealth and resilience.',
        Institution: 'Wayne State University',
        Keywords: 'cooperative economics, small business resilience, urban development, COVID-19 economic impacts',
        Methodology: 'Longitudinal study of 25 business cooperatives, financial impact analysis, and stakeholder interviews',
        Findings: 'Cooperative network members had 43% higher survival rates and maintained 67% more jobs compared to individual businesses',
        Recommendations: 'Develop policy support for cooperative business models, create technical assistance programs for business network formation'
      },
      {
        id: 'sample-6',
        Title: 'Climate Adaptation in Coastal Communities: Living Shorelines in Louisiana',
        Author: 'Dr. Sarah Boudreaux',
        Type: 'Case Study',
        Date: '2024-03-05',
        Description: 'Implementation of nature-based solutions for coastal resilience in Louisiana communities facing sea level rise and increased storm intensity.',
        Focus: 'Community-led climate adaptation using traditional ecological knowledge combined with modern restoration techniques.',
        Dimensions: 'Environmental Resilience, Cultural Vitality, Infrastructure Resilience',
        Relevance: 'Shows how communities can build climate resilience through nature-based solutions while preserving cultural heritage.',
        Institution: 'Louisiana State University',
        Keywords: 'climate adaptation, coastal restoration, traditional knowledge, living shorelines',
        Methodology: 'Participatory design process with 4 coastal communities, ecological monitoring, and social impact assessment',
        Findings: 'Living shorelines reduced storm surge by 40% while supporting local fishing livelihoods',
        Recommendations: 'Scale nature-based solutions, integrate traditional knowledge into climate planning'
      },
      {
        id: 'sample-7',
        Title: 'Urban Agriculture and Food Security: Community Gardens in Phoenix',
        Author: 'Dr. Carlos Mendoza',
        Type: 'Research Paper',
        Date: '2024-01-22',
        Description: 'Analysis of community garden networks as food security infrastructure in desert urban environments.',
        Focus: 'How community-controlled food production systems build resilience against supply chain disruptions and food insecurity.',
        Dimensions: 'Environmental Resilience, Economic Sustainability, Social Equity & Well-being',
        Relevance: 'Demonstrates food system resilience through local production and community ownership models.',
        Institution: 'Arizona State University',
        Keywords: 'urban agriculture, food security, community gardens, desert farming',
        Methodology: 'Network analysis of 35 community gardens, food access surveys, and economic impact study',
        Findings: 'Community gardens increased fresh food access by 65% in participating neighborhoods',
        Recommendations: 'Expand community garden support programs, integrate food resilience into city planning'
      },
      {
        id: 'sample-8',
        Title: 'Disaster Recovery Through Cultural Practices: Indigenous Fire Management',
        Author: 'Dr. Joseph Stands Tall',
        Type: 'Field Report',
        Date: '2024-02-14',
        Description: 'Documentation of traditional fire management practices in wildfire prevention and ecosystem restoration.',
        Focus: 'Integration of Indigenous knowledge systems into contemporary wildfire management and community resilience.',
        Dimensions: 'Environmental Resilience, Cultural Vitality, Governance & Civic Engagement',
        Relevance: 'Illustrates how traditional practices can provide sustainable solutions to contemporary environmental challenges.',
        Institution: 'University of California, Davis',
        Keywords: 'traditional fire management, Indigenous knowledge, wildfire prevention, cultural practices',
        Methodology: 'Collaborative research with 3 tribal nations, fire behavior monitoring, and cultural protocol documentation',
        Findings: 'Traditional burning reduced wildfire intensity by 70% in treated areas',
        Recommendations: 'Support tribal fire management programs, integrate Indigenous practices into state fire policy'
      },
      {
        id: 'sample-9',
        Title: 'Renewable Energy Cooperatives: Community Ownership in Rural Vermont',
        Author: 'Dr. Margaret Green',
        Type: 'Case Study',
        Date: '2024-03-18',
        Description: 'Development of community-owned renewable energy projects as economic and environmental resilience strategy.',
        Focus: 'Community ownership models for renewable energy development and their role in building local economic resilience.',
        Dimensions: 'Economic Sustainability, Environmental Resilience, Governance & Civic Engagement',
        Relevance: 'Shows how communities can build energy independence while creating local economic benefits.',
        Institution: 'University of Vermont',
        Keywords: 'renewable energy, community ownership, energy democracy, rural development',
        Methodology: 'Comparative study of 8 energy cooperatives, economic analysis, and member surveys',
        Findings: 'Community-owned projects generated 45% more local economic benefit than corporate-owned installations',
        Recommendations: 'Create supportive policy frameworks for energy cooperatives, provide technical assistance for community development'
      },
      {
        id: 'sample-10',
        Title: 'Mental Health First Aid in Schools: Peer Support Networks',
        Author: 'Dr. Lisa Chen',
        Type: 'Research Paper',
        Date: '2024-01-30',
        Description: 'Implementation of peer-led mental health support systems in high schools during pandemic-related stress.',
        Focus: 'Student-led mental health initiatives and their effectiveness in building psychological resilience in educational settings.',
        Dimensions: 'Healthcare Systems, Social Equity & Well-being, Cultural Vitality',
        Relevance: 'Demonstrates how peer support networks can provide mental health resilience infrastructure in institutional settings.',
        Institution: 'Stanford University School of Medicine',
        Keywords: 'mental health, peer support, adolescent resilience, school-based interventions',
        Methodology: 'Randomized controlled trial across 12 high schools, mental health outcome measures, and qualitative interviews',
        Findings: 'Peer support programs reduced anxiety symptoms by 32% and increased help-seeking behavior by 58%',
        Recommendations: 'Integrate peer mental health programs into standard school health services, provide ongoing training and support'
      },
      {
        id: 'sample-11',
        Title: 'Transportation Justice: Community-Led Transit Solutions in Rural Areas',
        Author: 'Dr. Rosa Martinez',
        Type: 'Field Report',
        Date: '2024-02-25',
        Description: 'Development of community-controlled transportation systems addressing mobility needs in underserved rural areas.',
        Focus: 'Community organizing approaches to transportation access and their role in connecting isolated communities to services.',
        Dimensions: 'Infrastructure Resilience, Social Equity & Well-being, Economic Sustainability',
        Relevance: 'Shows how transportation access is fundamental to community resilience and can be addressed through community-led solutions.',
        Institution: 'University of Texas at Austin',
        Keywords: 'transportation justice, rural transit, community organizing, mobility access',
        Methodology: 'Participatory action research with 6 rural communities, transportation needs assessment, and service delivery analysis',
        Findings: 'Community-run transit increased healthcare access by 78% and employment opportunities by 45%',
        Recommendations: 'Support community-controlled transit models, integrate transportation equity into rural development planning'
      },
      {
        id: 'sample-12',
        Title: 'Cooperative Housing and Community Stability: Lessons from Minneapolis',
        Author: 'Dr. Ahmed Hassan',
        Type: 'Case Study',
        Date: '2024-03-08',
        Description: 'Analysis of limited equity housing cooperatives as tools for maintaining affordable housing and community stability.',
        Focus: 'Cooperative housing models as strategies for preventing displacement and building long-term community resilience.',
        Dimensions: 'Economic Sustainability, Social Equity & Well-being, Governance & Civic Engagement',
        Relevance: 'Demonstrates how alternative ownership models can provide housing stability and community control in gentrifying areas.',
        Institution: 'University of Minnesota',
        Keywords: 'cooperative housing, affordable housing, community land trust, anti-displacement',
        Methodology: 'Longitudinal study of 15 housing cooperatives, displacement tracking, and resident outcome analysis',
        Findings: 'Cooperative housing reduced displacement by 85% compared to traditional affordable housing',
        Recommendations: 'Expand cooperative housing development programs, provide technical assistance for cooperative conversion'
      },
      {
        id: 'sample-13',
        Title: 'Worker Cooperatives and Economic Democracy: Response to Plant Closures',
        Author: 'Dr. Maria Santos',
        Type: 'Research Paper',
        Date: '2024-02-12',
        Description: 'Formation of worker cooperatives as community response to industrial plant closures in the Rust Belt.',
        Focus: 'Worker ownership as strategy for economic resilience and community recovery from deindustrialization.',
        Dimensions: 'Economic Sustainability, Governance & Civic Engagement, Social Equity & Well-being',
        Relevance: 'Illustrates how communities can build economic resilience through democratic ownership and local control of production.',
        Institution: 'Case Western Reserve University',
        Keywords: 'worker cooperatives, economic democracy, deindustrialization, community development',
        Methodology: 'Comparative case study of 6 worker cooperative conversions, economic impact analysis, and worker surveys',
        Findings: 'Worker cooperatives maintained 92% of jobs and increased worker satisfaction by 67% compared to traditional buyouts',
        Recommendations: 'Develop worker cooperative conversion programs, provide financing mechanisms for employee ownership'
      },
      {
        id: 'sample-14',
        Title: 'Community Land Trusts and Affordable Housing: The Burlington Model',
        Author: 'Dr. Patricia Williams',
        Type: 'Case Study',
        Date: '2024-01-18',
        Description: 'Long-term impact analysis of the Burlington Community Land Trust model for permanently affordable housing.',
        Focus: 'Community land trust mechanisms for maintaining housing affordability and community ownership across generations.',
        Dimensions: 'Economic Sustainability, Social Equity & Well-being, Governance & Civic Engagement',
        Relevance: 'Shows how communities can maintain affordable housing stock through innovative ownership structures.',
        Institution: 'Champlain College',
        Keywords: 'community land trust, affordable housing, community ownership, housing policy',
        Methodology: '30-year longitudinal analysis of CLT properties, affordability tracking, and resident outcome studies',
        Findings: 'CLT model maintained affordability for 95% of properties over 30 years while building $45M in community wealth',
        Recommendations: 'Scale community land trust models, integrate CLTs into municipal housing strategies'
      },
      {
        id: 'sample-15',
        Title: 'Participatory Budgeting and Community Resilience: Infrastructure Priorities in Chicago',
        Author: 'Dr. Michael Johnson',
        Type: 'Field Report',
        Date: '2024-03-15',
        Description: 'Implementation of participatory budgeting processes for community-controlled infrastructure investment decisions.',
        Focus: 'Democratic decision-making processes for infrastructure investment and their impact on community resilience and civic engagement.',
        Dimensions: 'Governance & Civic Engagement, Infrastructure Resilience, Social Equity & Well-being',
        Relevance: 'Demonstrates how community participation in resource allocation can build both infrastructure and social resilience.',
        Institution: 'University of Illinois at Chicago',
        Keywords: 'participatory budgeting, civic engagement, infrastructure investment, community decision-making',
        Methodology: 'Multi-year study of participatory budgeting in 8 Chicago neighborhoods, civic engagement tracking, and infrastructure impact assessment',
        Findings: 'Participatory budgeting increased civic participation by 340% and improved infrastructure maintenance by 65%',
        Recommendations: 'Expand participatory budgeting programs, provide facilitation training and technical support for communities'
      }
    ];
    
    console.log('📋 Returning comprehensive fallback case studies data');
    return NextResponse.json({ 
      caseStudies: fallbackData,
      source: 'fallback',
      count: fallbackData.length
    });
  } catch (error) {
    console.error('🔴 Error in case studies API route:', error);
    return NextResponse.json(
      { error: 'Failed to load case studies', details: error.message },
      { status: 500 }
    );
  }
}