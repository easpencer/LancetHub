import { NextResponse } from 'next/server';
import { 
  fetchPeopleData, 
  createRecord, 
  updateRecord, 
  deleteRecord 
} from '../../../../utils/airtable';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

// Get people
export async function GET(request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const people = await fetchPeopleData();
    return NextResponse.json({ people });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: `Failed to fetch people: ${error.message}` },
      { status: 500 }
    );
  }
}

// Create new person
export async function POST(request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    const record = await createRecord('People', data);
    
    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: `Failed to create person: ${error.message}` },
      { status: 500 }
    );
  }
}

// Update person
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
    const record = await updateRecord('People', id, data);
    
    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: `Failed to update person: ${error.message}` },
      { status: 500 }
    );
  }
}

// Delete person
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
    
    await deleteRecord('People', id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: `Failed to delete person: ${error.message}` },
      { status: 500 }
    );
  }
}
