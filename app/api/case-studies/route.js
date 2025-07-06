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
    
    // Log the first record to see available fields
    if (caseStudies.length > 0) {
      console.log('First case study fields:', Object.keys(caseStudies[0]));
      console.log('First case study data:', caseStudies[0]);
    }
    
    // Process records - map Airtable field names to expected field names
    const processedRecords = caseStudies.map((record) => ({
      ...record,
      // Map the actual Airtable field names
      Title: record['Case Study Title'] || record.Title || record.Name || 'Untitled',
      Type: record['Study Type '] || record.Type || 'Research',
      Description: record['Short Description'] || record.Description || '',
      Focus: record['Study Focus'] || record.Focus || '',
      Relevance: record['Relevance to Community/Societal Resilience'] || record.Relevance || '',
      Dimensions: record['Resilient Dimensions '] || record.Dimensions || '',
      Keywords: record['Key Words '] || record.Keywords || '',
      Author: record.People || record.Author || '',
      // Format date
      formattedDate: record.Date ? new Date(record.Date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : null,
      // Create dimensions list
      dimensionsList: (record['Resilient Dimensions '] || record.Dimensions || '').split(',').map(d => d.trim()).filter(Boolean)
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