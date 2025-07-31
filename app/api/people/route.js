import { NextResponse } from 'next/server';
import { fetchPeopleData } from '../../../utils/airtable';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    
    console.log(`🔄 Fetching people data${role ? ` for role: ${role}` : ''}...`);
    console.log('Environment:', process.env.NODE_ENV);
    console.log('API Key exists:', !!process.env.AIRTABLE_API_KEY);
    console.log('Base ID exists:', !!process.env.AIRTABLE_BASE_ID);
    
    // Check credentials
    if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
      console.error('Missing Airtable credentials for people API');
      return NextResponse.json(
        { 
          error: 'Configuration Error',
          details: 'Airtable credentials not configured',
          hasApiKey: !!process.env.AIRTABLE_API_KEY,
          hasBaseId: !!process.env.AIRTABLE_BASE_ID
        },
        { status: 500 }
      );
    }
    
    // Fetch all people data from Airtable
    let rawPeople;
    try {
      rawPeople = await fetchPeopleData({
        maxRecords: 100,
        view: 'Grid view'
      });
    } catch (fetchError) {
      console.error('Failed to fetch people from Airtable:', fetchError);
      return NextResponse.json(
        { 
          error: 'Airtable Fetch Error',
          details: 'Failed to fetch people data',
          errorMessage: fetchError.message
        },
        { status: 500 }
      );
    }
    
    console.log(`✅ Retrieved ${rawPeople.length} people from Airtable`);
    
    // Process and normalize fields
    const processedPeople = rawPeople.map((record) => ({
      id: record.id || `person-${Date.now()}-${Math.random()}`,
      ...record,
      Name: record.Name || record['Full Name'] || 'Unknown',
      Role: record.Role || record.Position || '',
      Affiliation: record.Affiliation || record.Institution || '',
      Order: record.Order || 999,
      // Handle image field properly
      Image: record.Image && record.Image.length > 0 ? record.Image[0].url : null,
      imageUrl: record.Image && record.Image.length > 0 ? record.Image[0].url : null
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