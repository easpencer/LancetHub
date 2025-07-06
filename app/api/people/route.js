import { NextResponse } from 'next/server';
import { fetchPeopleData } from '../../../utils/airtable';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    
    console.log(`🔄 Fetching people data${role ? ` for role: ${role}` : ''}...`);
    
    // Fetch all people data from Airtable
    let rawPeople = await fetchPeopleData({
      maxRecords: 100,
      view: 'Grid view'
    });
    
    console.log(`✅ Retrieved ${rawPeople.length} people from Airtable`);
    
    // Process and normalize fields
    const processedPeople = rawPeople.map((record) => ({
      id: record.id || `person-${Date.now()}-${Math.random()}`,
      ...record,
      Name: record.Name || record['Full Name'] || 'Unknown',
      Role: record.Role || record.Position || '',
      Affiliation: record.Affiliation || record.Institution || '',
      Order: record.Order || 999
    }));
    
    // Filter by role if provided
    let people = processedPeople;
    if (role && people.length > 0) {
      people = people.filter(person => 
        person.Role && person.Role.toLowerCase() === role.toLowerCase()
      );
    }
    
    // Sort by Order, then by Name
    people.sort((a, b) => {
      if (a.Order !== undefined && b.Order !== undefined) {
        return parseInt(a.Order) - parseInt(b.Order);
      }
      return (a.Name || '').localeCompare(b.Name || '');
    });
    
    return NextResponse.json({ people });
  } catch (error) {
    console.error('🔴 Error fetching people:', error);
    return NextResponse.json(
      { 
        error: 'Failed to load people', 
        details: error.message
      },
      { status: 500 }
    );
  }
}