import { NextResponse } from 'next/server';
import { fetchCaseStudies } from '../../../utils/airtable';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Fetch raw data from Airtable
    const rawData = await fetchCaseStudies({ maxRecords: 2 });
    
    // Show exactly what we're getting
    return NextResponse.json({
      count: rawData.length,
      rawFields: rawData.length > 0 ? Object.keys(rawData[0]) : [],
      firstRecord: rawData[0] || null,
      processedRecord: rawData.length > 0 ? {
        id: rawData[0].id,
        Title: rawData[0]['Case Study Title'] || rawData[0].Title || 'No title',
        hasTitle: !!rawData[0]['Case Study Title'],
        allFields: rawData[0]
      } : null
    });
  } catch (error) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}