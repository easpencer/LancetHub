import { NextResponse } from 'next/server';
import { fetchCaseStudies } from '../../../../utils/airtable';

export async function GET(request, { params }) {
  try {
    const title = params.title ? decodeURIComponent(params.title) : null;
    
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    console.log(`Fetching case study with title: ${title}`);
    
    // Fetch from Airtable
    const caseStudies = await fetchCaseStudies();
    
    // Find the specific case study
    const caseStudy = caseStudies.find(
      study => study['Case Study Title'] === title || study.Title === title
    );
    
    if (!caseStudy) {
      return NextResponse.json(
        { error: 'Case study not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ caseStudy });
  } catch (error) {
    console.error('Error loading case study:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to load case study' },
      { status: 500 }
    );
  }
}
