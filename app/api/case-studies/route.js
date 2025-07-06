import { NextResponse } from 'next/server';
import { fetchCaseStudies } from '../../../utils/airtable';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('🔄 Fetching case studies from Airtable...');
    
    // Fetch from Airtable
    const caseStudies = await fetchCaseStudies({ 
      maxRecords: 200,
      view: 'Grid view'
    });
    
    console.log(`✅ Retrieved ${caseStudies.length} case studies from Airtable`);
    
    // Process records
    const processedRecords = caseStudies.map((record) => ({
      ...record,
      formattedDate: record.Date ? new Date(record.Date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : null,
      dimensionsList: (record.Dimensions || record['Resilient Dimensions'] || '').split(',').map(d => d.trim()).filter(Boolean)
    }));
    
    return NextResponse.json({ 
      caseStudies: processedRecords,
      source: 'airtable',
      count: processedRecords.length
    });
  } catch (error) {
    console.error('🔴 Error in case studies route:', error);
    return NextResponse.json(
      { 
        error: 'Failed to load case studies', 
        details: error.message
      },
      { status: 500 }
    );
  }
}