import { NextResponse } from 'next/server';
import { fetchCaseStudies } from '../../../utils/airtable';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('🔄 Fetching real case studies from Airtable...');
    
    // Fetch from Airtable - no fallback!
    const caseStudies = await fetchCaseStudies({ 
      maxRecords: 200, // Increase to get ALL records
      view: 'Grid view'
    });
    
    console.log(`✅ Retrieved ${caseStudies.length} real case studies from Airtable`);
    
    // Process records to ensure we have all fields
    const processedRecords = caseStudies.map((record, index) => {
      // Log first few records to see ALL fields
      if (index < 3) {
        console.log(`🔍 Case study ${index + 1} - ALL fields:`, Object.keys(record));
        console.log(`📄 Full record data:`, JSON.stringify(record, null, 2));
      }
      
      // Return ALL fields from Airtable, not just a subset
      return {
        ...record, // Keep ALL original fields
        // Add any computed fields if needed
        formattedDate: record.Date ? new Date(record.Date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) : null,
        dimensionsList: (record.Dimensions || record['Resilient Dimensions'] || '').split(',').map(d => d.trim()).filter(Boolean)
      };
    });
    
    console.log('📋 Returning real Airtable case studies data');
    return NextResponse.json({ 
      caseStudies: processedRecords,
      source: 'airtable',
      count: processedRecords.length
    });
  } catch (error) {
    console.error('🔴 Error fetching case studies from Airtable:', error);
    // No fallback - return error
    return NextResponse.json(
      { 
        error: 'Failed to load case studies from Airtable', 
        details: error.message,
        hint: 'Check Airtable API key and base ID configuration'
      },
      { status: 500 }
    );
  }
}