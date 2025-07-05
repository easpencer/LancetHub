import { NextResponse } from 'next/server';
import { fetchPeopleData } from '../../../utils/airtable';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    
    console.log(`🔄 Fetching people data${role ? ` for role: ${role}` : ''}...`);
    
    // Fetch all people data from Airtable
    let rawPeople = await fetchPeopleData({
      maxRecords: 100,
      view: 'Grid view'
    });
    
    console.log(`✅ Retrieved ${rawPeople.length} people from Airtable`);
    
    // Process people records to capture ALL Airtable data dynamically
    const processedPeople = rawPeople.map((record, index) => {
      // Log ALL available fields from the first few records
      if (index < 3) {
        console.log(`🔍 People record ${index + 1} fields:`, Object.keys(record));
        console.log(`🔍 People record ${index + 1} data:`, JSON.stringify(record, null, 2));
      }
      
      // Start with the record ID and then dynamically add ALL fields
      const processedRecord = {
        id: record.id || `person-${Date.now()}-${Math.random()}`,
        // Copy ALL fields from Airtable record directly
        ...record
      };
      
      // Add normalized/computed fields for consistent access
      const normalizedFields = {
        // Primary identification fields
        Name: record['Name'] || record['Full Name'] || record['First Name'] + ' ' + record['Last Name'] || 'Unknown Person',
        FirstName: record['First Name'] || record['First'] || '',
        LastName: record['Last Name'] || record['Last'] || record['Surname'] || '',
        Role: record['Role'] || record['Position'] || record['Title'] || '',
        
        // Professional information
        Affiliation: record['Affiliation'] || record['Institution'] || record['Organization'] || record['University'] || record['Company'] || '',
        Department: record['Department'] || record['Division'] || record['Unit'] || '',
        JobTitle: record['Job Title'] || record['Position Title'] || record['Professional Title'] || '',
        
        // Contact information
        Email: record['Email'] || record['Email Address'] || record['Contact Email'] || '',
        Phone: record['Phone'] || record['Phone Number'] || record['Contact Phone'] || '',
        Website: record['Website'] || record['Personal Website'] || record['URL'] || '',
        LinkedIn: record['LinkedIn'] || record['LinkedIn Profile'] || '',
        Twitter: record['Twitter'] || record['Twitter Handle'] || '',
        ORCID: record['ORCID'] || record['ORCID ID'] || '',
        
        // Professional details
        Bio: record['Bio'] || record['Biography'] || record['Description'] || record['About'] || '',
        Expertise: record['Expertise'] || record['Specialization'] || record['Areas of Expertise'] || record['Research Areas'] || '',
        Education: record['Education'] || record['Educational Background'] || record['Degrees'] || '',
        
        // Location
        Location: record['Location'] || record['City'] || record['Geographic Location'] || '',
        Country: record['Country'] || '',
        State: record['State'] || record['Province'] || '',
        
        // Professional metrics
        YearsExperience: record['Years of Experience'] || record['Experience'] || '',
        Publications: record['Publications'] || record['Number of Publications'] || '',
        Citations: record['Citations'] || record['H-Index'] || '',
        
        // Commission/project specific
        Order: record['Order'] || record['Sort Order'] || record['Display Order'] || 999,
        Status: record['Status'] || record['Active Status'] || 'Active',
        JoinDate: record['Join Date'] || record['Start Date'] || '',
        
        // Additional metadata
        Photo: record['Photo'] || record['Profile Photo'] || record['Image'] || '',
        CV: record['CV'] || record['Resume'] || record['Curriculum Vitae'] || '',
        Notes: record['Notes'] || record['Comments'] || record['Additional Info'] || '',
        
        // Research and academic fields
        ResearchInterests: record['Research Interests'] || record['Research Focus'] || '',
        CurrentProjects: record['Current Projects'] || record['Active Research'] || '',
        Grants: record['Grants'] || record['Funding'] || '',
        Awards: record['Awards'] || record['Honors'] || record['Recognition'] || '',
        
        // Social and outreach
        MediaMentions: record['Media Mentions'] || record['Press'] || '',
        SpeakingEngagements: record['Speaking Engagements'] || record['Conferences'] || '',
        BoardPositions: record['Board Positions'] || record['Advisory Roles'] || '',
        
        // Commission specific roles
        CommissionRole: record['Commission Role'] || record['Committee Role'] || '',
        WorkingGroups: record['Working Groups'] || record['Committees'] || '',
        Contributions: record['Contributions'] || record['Key Contributions'] || ''
      };
      
      // Merge original fields with normalized fields
      return {
        ...processedRecord,
        ...normalizedFields
      };
    });
    
    // Filter by role if provided
    let people = processedPeople;
    if (role && people.length > 0) {
      people = people.filter(person => 
        person.Role && person.Role.toLowerCase() === role.toLowerCase()
      );
    }
    
    // Sort by Order if available, else by Name
    people.sort((a, b) => {
      if (a.Order !== undefined && b.Order !== undefined) {
        return parseInt(a.Order) - parseInt(b.Order);
      }
      return (a.Name || '').localeCompare(b.Name || '');
    });
    
    return NextResponse.json({ people });
  } catch (error) {
    console.error('🔴 Error fetching people from Airtable:', error);
    
    // Fallback data with correct commissioners from Lancet article
    const fallbackCommissioners = [
      {
        id: 'chair-1',
        Name: 'Eliah Aronoff-Spencer',
        Role: 'Co-Chair',
        Affiliation: 'University of California San Diego',
        Contact: 'earonoffspencer@health.ucsd.edu',
        Bio: 'Co-Chair of the Lancet Commission on US Societal Resilience in a Global Pandemic Age',
        Order: 1
      },
      {
        id: 'chair-2', 
        Name: 'Richard M Carpiano',
        Role: 'Co-Chair',
        Affiliation: 'University of California Riverside',
        Bio: 'Co-Chair of the Lancet Commission on US Societal Resilience in a Global Pandemic Age',
        Order: 2
      },
      {
        id: 'chair-3',
        Name: 'Lara Vojnov',
        Role: 'Co-Chair',
        Affiliation: 'University of California San Diego',
        Bio: 'Co-Chair of the Lancet Commission on US Societal Resilience in a Global Pandemic Age',
        Order: 3
      },
      {
        id: 'comm-1',
        Name: 'Berit Anderson',
        Role: 'Commissioner',
        Affiliation: 'Scout Research',
        Bio: 'Commissioner focused on information systems and misinformation',
        Order: 4
      },
      {
        id: 'comm-2',
        Name: 'Rick Bright',
        Role: 'Commissioner',
        Affiliation: 'Bright Global Health',
        Bio: 'Former Director of BARDA, expert in pandemic preparedness',
        Order: 5
      },
      {
        id: 'comm-3',
        Name: 'Renee DiResta',
        Role: 'Commissioner',
        Affiliation: 'Stanford Internet Observatory',
        Bio: 'Expert in information operations and online misinformation',
        Order: 6
      },
      {
        id: 'comm-4',
        Name: 'Patricia Garcia',
        Role: 'Commissioner',
        Affiliation: 'Universidad Peruana Cayetano Heredia',
        Bio: 'Global health expert with focus on health systems',
        Order: 7
      },
      {
        id: 'comm-5',
        Name: 'M Chris Gibbons',
        Role: 'Commissioner',
        Affiliation: 'Johns Hopkins University',
        Bio: 'Expert in health informatics and digital health equity',
        Order: 8
      },
      {
        id: 'comm-6',
        Name: 'Tina George Karippacheril',
        Role: 'Commissioner',
        Affiliation: 'World Bank',
        Bio: 'Global health technology and systems expert',
        Order: 9
      },
      {
        id: 'comm-7',
        Name: 'Richard Gold',
        Role: 'Commissioner',
        Affiliation: 'McGill University',
        Bio: 'Expert in global health law and innovation policy',
        Order: 10
      },
      {
        id: 'comm-8',
        Name: 'Shannon Hader',
        Role: 'Commissioner',
        Affiliation: 'USAID',
        Bio: 'Global health and pandemic preparedness expert',
        Order: 11
      },
      {
        id: 'comm-9',
        Name: 'Mark S Handcock',
        Role: 'Commissioner',
        Affiliation: 'UCLA',
        Bio: 'Statistician and network analysis expert',
        Order: 12
      },
      {
        id: 'comm-10',
        Name: 'Linda A Hill',
        Role: 'Commissioner',
        Affiliation: 'Harvard Business School',
        Bio: 'Leadership and organizational behavior expert',
        Order: 13
      },
      {
        id: 'comm-11',
        Name: 'Sean Hillier',
        Role: 'Commissioner',
        Affiliation: 'Public Health Expert',
        Bio: 'Community health and resilience specialist',
        Order: 14
      },
      {
        id: 'comm-12',
        Name: 'Ilesh Jani',
        Role: 'Commissioner',
        Affiliation: 'Instituto Nacional de Saúde',
        Bio: 'Global health systems and laboratory medicine expert',
        Order: 15
      },
      {
        id: 'comm-13',
        Name: 'Paula Lantz',
        Role: 'Commissioner',
        Affiliation: 'University of Michigan',
        Bio: 'Health policy and population health expert',
        Order: 16
      },
      {
        id: 'comm-14',
        Name: 'Bill Lober',
        Role: 'Commissioner',
        Affiliation: 'University of Washington',
        Bio: 'Health informatics and surveillance systems expert',
        Order: 17
      },
      {
        id: 'comm-15',
        Name: 'Mohsen Malekinejad',
        Role: 'Commissioner',
        Affiliation: 'University of California San Francisco',
        Bio: 'Epidemiologist and global health researcher',
        Order: 18
      },
      {
        id: 'comm-16',
        Name: 'Jonna Mazet',
        Role: 'Commissioner',
        Affiliation: 'UC Davis One Health Institute',
        Bio: 'One Health and pandemic prevention expert',
        Order: 19
      },
      {
        id: 'comm-17',
        Name: 'Camille Nebeker',
        Role: 'Commissioner',
        Affiliation: 'UC San Diego',
        Bio: 'Digital health ethics and research innovation expert',
        Order: 20
      },
      {
        id: 'comm-18',
        Name: 'Anita Raj',
        Role: 'Commissioner',
        Affiliation: 'UC San Diego',
        Bio: 'Global health and gender-based violence prevention expert',
        Order: 21
      },
      {
        id: 'comm-19',
        Name: 'Stuart Sandin',
        Role: 'Commissioner',
        Affiliation: 'Scripps Institution of Oceanography',
        Bio: 'Marine ecologist and environmental health expert',
        Order: 22
      },
      {
        id: 'comm-20',
        Name: 'Robert Schooley',
        Role: 'Commissioner',
        Affiliation: 'UC San Diego',
        Bio: 'Infectious diseases physician and researcher',
        Order: 23
      },
      {
        id: 'comm-21',
        Name: 'Davey Smith',
        Role: 'Commissioner',
        Affiliation: 'UC San Diego',
        Bio: 'Infectious diseases and HIV research expert',
        Order: 24
      },
      {
        id: 'comm-22',
        Name: 'Steffanie Strathdee',
        Role: 'Commissioner',
        Affiliation: 'UC San Diego',
        Bio: 'Global health epidemiologist and infectious disease expert',
        Order: 25
      },
      {
        id: 'comm-23',
        Name: 'Steve Wanyee',
        Role: 'Commissioner',
        Affiliation: 'Community Health Expert',
        Bio: 'Community engagement and health equity specialist',
        Order: 26
      }
    ];
    
    let fallbackPeople = fallbackCommissioners;
    
    // Filter by role if requested
    if (role) {
      fallbackPeople = fallbackCommissioners.filter(person => 
        person.Role && person.Role.toLowerCase() === role.toLowerCase()
      );
    }
    
    console.log(`📋 Using fallback people data (${fallbackPeople.length} records)`);
    return NextResponse.json({ 
      people: fallbackPeople,
      source: 'fallback',
      error: error.message 
    });
  }
}
