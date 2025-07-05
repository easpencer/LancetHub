import { NextResponse } from 'next/server';
import { fetchCaseStudies } from '../../../utils/airtable';

export async function GET() {
  try {
    console.log('🔄 Fetching case studies from Airtable...');
    
    // Fetch from Airtable with increased maxRecords for production
    const caseStudies = await fetchCaseStudies({ 
      maxRecords: 100,
      view: 'Grid view'
    });
    
    console.log(`✅ Retrieved ${caseStudies.length} case studies from Airtable`);
    
    // Process records using exact Airtable field structure
    const processedRecords = caseStudies.map((record) => {
      // Log the first record to see available fields
      if (caseStudies.indexOf(record) === 0) {
        console.log('Sample Airtable record fields:', Object.keys(record));
        console.log('Sample record data:', record);
      }
      
      return {
        id: record.id || `case-study-${Date.now()}-${Math.random()}`,
        // Primary fields from Airtable
        Title: record['Case Study Title'] || record['Title'] || 'Untitled Study',
        Author: record['Name'] || record['Author'] || record['Authors'] || 'Unknown Author',
        Type: record['Section'] || record['Type'] || record['Study Type'] || 'Case Study',
        Date: record['Date'] || record['Publication Date'] || new Date().toISOString().split('T')[0],
        Description: record['Short Description'] || record['Description'] || record['Abstract'] || 'No description available',
        Focus: record['Study Focus'] || record['Focus'] || record['Research Focus'] || '',
        Dimensions: record['Resilient Dimensions'] || record['Dimensions'] || record['Resilience Dimensions'] || '',
        Relevance: record['Relevance to Community/Societal Resilience'] || record['Relevance'] || '',
        
        // Additional fields that might be available
        Institution: record['Institution'] || record['Organization'] || record['Affiliation'] || '',
        Keywords: record['Keywords'] || record['Tags'] || '',
        Methodology: record['Methodology'] || record['Methods'] || record['Research Methods'] || '',
        Findings: record['Key Findings'] || record['Findings'] || record['Results'] || '',
        Recommendations: record['Recommendations'] || record['Policy Recommendations'] || '',
        Status: record['Status'] || record['Publication Status'] || 'Published',
        URL: record['URL'] || record['Link'] || record['External Link'] || '',
        DOI: record['DOI'] || record['doi'] || '',
        
        // Additional metadata
        Email: record['Email'] || record['Contact Email'] || '',
        Location: record['Location'] || record['Geographic Focus'] || '',
        DataSources: record['Data Sources'] || record['Data'] || '',
        Limitations: record['Limitations'] || '',
        FutureResearch: record['Future Research'] || record['Next Steps'] || '',
        Funding: record['Funding'] || record['Funding Source'] || '',
        Acknowledgments: record['Acknowledgments'] || ''
      };
    });
    
    return NextResponse.json({ caseStudies: processedRecords });
  } catch (error) {
    console.error('🔴 Error loading case studies from Airtable:', error);
    
    // Comprehensive fallback data with realistic case studies
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
      }
    ];
    
    console.log('📋 Using fallback case studies data');
    return NextResponse.json({ 
      caseStudies: fallbackData,
      source: 'fallback',
      error: error.message 
    });
  }
}
