import { NextResponse } from 'next/server';
import { fetchResilienceDimensions } from '../../../../utils/airtable';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export const dynamic = 'force-dynamic';

// Get resilience dimensions
export async function GET(request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const dimensions = await fetchResilienceDimensions();
    return NextResponse.json({ dimensions });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: `Failed to fetch dimensions: ${error.message}` },
      { status: 500 }
    );
  }
}
