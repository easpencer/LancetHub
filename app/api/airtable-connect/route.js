import { NextResponse } from 'next/server';
import { 
  fetchResilienceDimensions, 
  fetchCaseStudies, 
  fetchPeopleData, 
  fetchLandscapeData,
  fetchPapers
} from '../../../utils/airtable';
import { handleApiError } from '../../../utils/api-error-handler';

/**
 * Rate limiting - basic implementation
 * In production, consider using a more robust solution like Redis or a third-party service
 */
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 60; // 60 requests per minute

// Use a global variable for serverless function persistence (per instance)
const ipRequestCounts = new Map();

const cleanupOldRequests = () => {
  const now = Date.now();
  for (const [ip, requests] of ipRequestCounts.entries()) {
    const validRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW);
    if (validRequests.length === 0) {
      ipRequestCounts.delete(ip);
    } else {
      ipRequestCounts.set(ip, validRequests);
    }
  }
};

export async function GET(request) {
  // Clean up old requests periodically
  cleanupOldRequests();
  
  // Simple rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  
  if (!ipRequestCounts.has(ip)) {
    ipRequestCounts.set(ip, []);
  }
  
  const requests = ipRequestCounts.get(ip);
  const now = Date.now();
  const recentRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= MAX_REQUESTS) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    );
  }
  
  // Add this request to the count
  requests.push(now);
  ipRequestCounts.set(ip, requests);
  
  // Parse action from query string
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  try {
    console.log(`Processing API request for action: ${action}`);
    
    // Validate action parameter
    if (!action) {
      return NextResponse.json(
        { error: 'Missing action parameter' },
        { status: 400 }
      );
    }
    
    let result;
    
    switch (action) {
      case 'dimensions':
        result = await fetchResilienceDimensions();
        return NextResponse.json({ dimensions: result });
      
      case 'case-studies':
        result = await fetchCaseStudies();
        return NextResponse.json({ caseStudies: result });
      
      case 'people':
        result = await fetchPeopleData();
        return NextResponse.json({ people: result });
      
      case 'landscape':
        result = await fetchLandscapeData();
        return NextResponse.json({ landscape: result });
        
      case 'papers':
      case 'bibliography':
        result = await fetchPapers();
        return NextResponse.json({ papers: result });
      
      default:
        return NextResponse.json(
          { error: 'Invalid action parameter. Use one of: dimensions, case-studies, people, landscape, papers, bibliography' },
          { status: 400 }
        );
    }
  } catch (error) {
    return handleApiError(error, `airtable-connect/${action}`);
  }
}
