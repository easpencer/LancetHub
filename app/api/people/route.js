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
    let people = await fetchPeopleData({
      maxRecords: 100,
      view: 'Grid view'
    });
    
    console.log(`✅ Retrieved ${people.length} people from Airtable`);
    
    // Filter by role if provided
    if (role && people.length > 0) {
      people = people.filter(person => 
        person.Role && person.Role.toLowerCase() === role.toLowerCase()
      );
    }
    
    // Sort by Order if available, else by Name
    people.sort((a, b) => {
      if (a.Order !== undefined && b.Order !== undefined) {
        return a.Order - b.Order;
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
