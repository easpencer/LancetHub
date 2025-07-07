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
      // Map the actual Airtable field names (note the trailing spaces in some field names!)
      Title: record['Case Study Title'] || record.Title || record.Name || 'Untitled',
      Type: record['Study Type '] || record.Type || 'Research', // Note the trailing space!
      Description: record['Short Description'] || record.Description || '',
      Focus: record['Study Focus'] || record.Focus || '',
      Relevance: record['Relevance to Community/Societal Resilience'] || record.Relevance || '',
      // New fields
      Results: record.Results || record.results || record['Study Results'] || '',
      Methods: record.Methods || record.methods || record.Methodology || record['Study Methods'] || '',
      Insights: record.Insights || record.insights || record['Key Insights'] || '',
      References: record.References || record.references || record['Study References'] || '',
      Findings: record.Findings || record.findings || record['Key Findings'] || '',
      Recommendations: record.Recommendations || record.recommendations || record['Study Recommendations'] || '',
      Challenges: record.Challenges || record.challenges || record['Implementation Challenges'] || '',
      Context: record.Context || record.context || record['Study Context'] || '',
      Impact: record.Impact || record.impact || record['Potential Impact'] || '',
      DataSources: record['Data Sources'] || record.DataSources || '',
      Limitations: record.Limitations || record.limitations || record['Study Limitations'] || '',
      FutureWork: record['Future Work'] || record.FutureWork || record['Next Steps'] || '',
      // Keep existing fields
      Dimensions: (() => {
        const dims = record['Resilient Dimensions '] || record.Dimensions || [];
        if (Array.isArray(dims)) {
          return dims.join(', ');
        }
        return dims;
      })(), // Note the trailing space!
      Keywords: (() => {
        const kw = record['Key Words '] || record.Keywords || [];
        if (Array.isArray(kw)) {
          return kw.join(', ');
        }
        return kw;
      })(), // Note the trailing space!
      Author: record.Name || record.People || record.Author || '',
      // Format date
      formattedDate: record.Date ? new Date(record.Date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : null,
      // Create dimensions list - handle both string and array formats
      dimensionsList: (() => {
        const dims = record['Resilient Dimensions '] || record.Dimensions || [];
        if (Array.isArray(dims)) {
          return dims.map(d => d.trim()).filter(Boolean);
        }
        return dims.split(',').map(d => d.trim()).filter(Boolean);
      })()
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