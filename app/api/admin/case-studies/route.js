import { NextResponse } from 'next/server';
import { 
  fetchCaseStudies, 
  createRecord, 
  updateRecord, 
  deleteRecord 
} from '../../../../utils/airtable';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

// Get case studies
export async function GET(request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const caseStudies = await fetchCaseStudies();
    return NextResponse.json({ caseStudies });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: `Failed to fetch case studies: ${error.message}` },
      { status: 500 }
    );
  }
}

// Create new case study
export async function POST(request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    console.log("Creating case study with data:", data);
    const record = await createRecord('Case study forms', data);
    
    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: `Failed to create case study: ${error.message}` },
      { status: 500 }
    );
  }
}

// Update case study
export async function PUT(request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Record ID is required' },
        { status: 400 }
      );
    }
    
    const data = await request.json();
    console.log(`Updating case study ${id} with data:`, data);
    const record = await updateRecord('Case study forms', id, data);
    
    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: `Failed to update case study: ${error.message}` },
      { status: 500 }
    );
  }
}

// Delete case study
export async function DELETE(request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Record ID is required' },
        { status: 400 }
      );
    }
    
    await deleteRecord('Case study forms', id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: `Failed to delete case study: ${error.message}` },
      { status: 500 }
    );
  }
}
