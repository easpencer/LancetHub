import { NextResponse } from 'next/server';
import Airtable from 'airtable';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

/**
 * API route to check system status and connectivity
 */
export async function GET(request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check Airtable connection
    let airtableConnected = false;
    let airtableError = null;
    let airtableDetails = null;
    
    if (process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID) {
      try {
        Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY });
        
        // Extract the base ID (remove any extra parts that might be present)
        let baseId = process.env.AIRTABLE_BASE_ID;
        if (baseId.includes('/')) {
          baseId = baseId.split('/')[0];
        }
        
        const base = Airtable.base(baseId);
        
        // Try to make a simple request to verify connection
        const tables = [
          'Resilience Dimensions',
          'Case Studies',
          'People',
          'Metrics',
          'Bibliography'
        ];
        
        const tableStatus = {};
        
        // Check each table
        for (const table of tables) {
          try {
            const records = await base(table).select({ maxRecords: 1 }).firstPage();
            tableStatus[table] = {
              exists: true,
              recordCount: records.length,
              fields: records.length > 0 ? Object.keys(records[0].fields) : []
            };
          } catch (err) {
            tableStatus[table] = {
              exists: false,
              error: err.message
            };
          }
        }
        
        airtableConnected = true;
        airtableDetails = {
          baseId: baseId,
          tables: tableStatus
        };
      } catch (err) {
        console.error('Airtable connection check failed:', err);
        airtableError = err.message;
      }
    } else {
      airtableError = 'Airtable credentials not configured';
    }
    
    // Check environment configuration
    const environmentCheck = {
      hasAirtableConfig: !!process.env.AIRTABLE_API_KEY && !!process.env.AIRTABLE_BASE_ID,
      hasAuthConfig: !!process.env.NEXTAUTH_SECRET,
      mockDataEnabled: process.env.USE_MOCK_DATA === 'true'
    };
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      airtableConnected,
      airtableError: airtableError ? airtableError : undefined,
      airtableDetails,
      environment: environmentCheck,
      nodeVersion: process.version,
    });
  } catch (error) {
    console.error('System check API error:', error);
    return NextResponse.json(
      { error: 'System check failed', details: error.message },
      { status: 500 }
    );
  }
}
