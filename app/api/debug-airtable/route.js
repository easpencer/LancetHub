import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { fetchCaseStudies } = await import('../../../utils/airtable.js');
    
    // Fetch just one record to see all available fields
    const caseStudies = await fetchCaseStudies({ maxRecords: 1 });
    
    if (caseStudies.length > 0) {
      const firstStudy = caseStudies[0];
      console.log('Raw Airtable fields:', Object.keys(firstStudy));
      console.log('Raw Airtable data:', JSON.stringify(firstStudy, null, 2));
      
      return NextResponse.json({
        fields: Object.keys(firstStudy),
        sampleData: firstStudy
      });
    }
    
    return NextResponse.json({ error: 'No case studies found' });
  } catch (error) {
    console.error('Error fetching from Airtable:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}