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
    
    // Return error with no fallback data - real data only
    return NextResponse.json(
      { 
        error: 'Failed to load people from Airtable', 
        details: error.message,
        source: 'error',
        count: 0,
        people: []
      },
      { status: 500 }
    );
  }
}
