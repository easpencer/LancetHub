import { NextResponse } from 'next/server';
import { 
  fetchBibliographyData, 
  createRecord, 
  updateRecord, 
  deleteRecord 
} from '../../../../utils/airtable';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

// Get bibliography entries
export async function GET(request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const bibliography = await fetchBibliographyData();
    return NextResponse.json({ bibliography });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: `Failed to fetch bibliography: ${error.message}` },
      { status: 500 }
    );
  }
}

// Create new bibliography entry
export async function POST(request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    const record = await createRecord('Bibliography', data);
    
    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: `Failed to create bibliography entry: ${error.message}` },
      { status: 500 }
    );
  }
}

// Update bibliography entry
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
    const record = await updateRecord('Bibliography', id, data);
    
    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: `Failed to update bibliography entry: ${error.message}` },
      { status: 500 }
    );
  }
}

// Delete bibliography entry
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
    
    await deleteRecord('Bibliography', id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: `Failed to delete bibliography entry: ${error.message}` },
      { status: 500 }
    );
  }
}
