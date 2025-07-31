import { NextResponse } from 'next/server';
import { dataSource } from '../../../utils/database';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type'); // 'all', 'caseStudies', 'papers', 'people'
    
    if (!query) {
      return NextResponse.json({ 
        error: 'Search query is required' 
      }, { status: 400 });
    }
    
    // Perform search
    const results = await dataSource.search(query);
    
    // Filter by type if specified
    let filteredResults = results;
    if (type && type !== 'all') {
      filteredResults = {
        caseStudies: type === 'caseStudies' ? results.caseStudies : [],
        papers: type === 'papers' ? results.papers : [],
        people: type === 'people' ? results.people || [] : []
      };
    }
    
    return NextResponse.json({ 
      query,
      results: filteredResults,
      totalResults: (filteredResults.caseStudies?.length || 0) + 
                   (filteredResults.papers?.length || 0) +
                   (filteredResults.people?.length || 0)
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed', details: error.message },
      { status: 500 }
    );
  }
}