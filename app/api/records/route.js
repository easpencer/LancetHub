import { NextResponse } from 'next/server';
import { 
  fetchResilienceDimensions, 
  fetchCaseStudies, 
  fetchPeopleData, 
  fetchResilienceMetrics,
  fetchLandscapeData,
  fetchBibliographyData,
  createRecord,
  updateRecord,
  deleteRecord
} from '../../../utils/airtable';
// Authentication removed for public access

// Map table IDs to fetch functions and real table names
const tableMap = {
  'resilience-dimensions': {
    fetch: fetchResilienceDimensions,
    tableName: 'Resilience Dimensions'
  },
  'case-studies': {
    fetch: fetchCaseStudies,
    tableName: 'Case Studies'
  },
  'people': {
    fetch: fetchPeopleData,
    tableName: 'People'
  },
  'metrics': {
    fetch: fetchResilienceMetrics,
    tableName: 'Metrics'
  },
  'bibliography': {
    fetch: fetchBibliographyData,
    tableName: 'Bibliography'
  },
  'landscape': {
    fetch: fetchLandscapeData,
    tableName: 'Landscape'
  }
};

// GET records from a specific table
export async function GET(request) {
  try {
    
    const { searchParams } = new URL(request.url);
    const tableId = searchParams.get('tableId');
    
    if (!tableId || !tableMap[tableId]) {
      return NextResponse.json(
        { error: 'Invalid or missing tableId parameter' },
        { status: 400 }
      );
    }
    
    const records = await tableMap[tableId].fetch();
    return NextResponse.json({ records });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: `Failed to fetch records: ${error.message}` },
      { status: 500 }
    );
  }
}

// CREATE a new record
export async function POST(request) {
  try {
    // Admin-only functionality - authentication would be checked here
    return NextResponse.json({ error: 'Feature not available' }, { status: 403 });
    
    const data = await request.json();
    const { tableId, fields } = data;
    
    if (!tableId || !tableMap[tableId]) {
      return NextResponse.json(
        { error: 'Invalid or missing tableId parameter' },
        { status: 400 }
      );
    }
    
    if (!fields || Object.keys(fields).length === 0) {
      return NextResponse.json(
        { error: 'No fields provided for new record' },
        { status: 400 }
      );
    }
    
    const record = await createRecord(tableMap[tableId].tableName, fields);
    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: `Failed to create record: ${error.message}` },
      { status: 500 }
    );
  }
}

// UPDATE a record
export async function PATCH(request) {
  try {
    // Admin-only functionality - authentication would be checked here
    return NextResponse.json({ error: 'Feature not available' }, { status: 403 });
    
    const data = await request.json();
    const { tableId, recordId, fields } = data;
    
    if (!tableId || !tableMap[tableId]) {
      return NextResponse.json(
        { error: 'Invalid or missing tableId parameter' },
        { status: 400 }
      );
    }
    
    if (!recordId) {
      return NextResponse.json(
        { error: 'Record ID is required' },
        { status: 400 }
      );
    }
    
    if (!fields || Object.keys(fields).length === 0) {
      return NextResponse.json(
        { error: 'No fields provided for update' },
        { status: 400 }
      );
    }
    
    const record = await updateRecord(tableMap[tableId].tableName, recordId, fields);
    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: `Failed to update record: ${error.message}` },
      { status: 500 }
    );
  }
}

// DELETE a record
export async function DELETE(request) {
  try {
    // Admin-only functionality - authentication would be checked here
    return NextResponse.json({ error: 'Feature not available' }, { status: 403 });
    
    const { searchParams } = new URL(request.url);
    const tableId = searchParams.get('tableId');
    const recordId = searchParams.get('recordId');
    
    if (!tableId || !tableMap[tableId]) {
      return NextResponse.json(
        { error: 'Invalid or missing tableId parameter' },
        { status: 400 }
      );
    }
    
    if (!recordId) {
      return NextResponse.json(
        { error: 'Record ID is required' },
        { status: 400 }
      );
    }
    
    await deleteRecord(tableMap[tableId].tableName, recordId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: `Failed to delete record: ${error.message}` },
      { status: 500 }
    );
  }
}
