import { NextResponse } from 'next/server';
import { fetchLandscapeData } from '../../../utils/airtable';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('🔄 Fetching ALL landscape topics data from Airtable...');
    
    // Fetch landscape topics from Airtable - get ALL records
    const landscapeTopics = await fetchLandscapeData({
      maxRecords: 500, // Increase to ensure we get ALL records
      view: 'Grid view'
    });
    
    console.log(`✅ Retrieved ${landscapeTopics.length} landscape topics with ALL fields`);
    
    // Log first few records to see ALL available fields
    if (landscapeTopics.length > 0) {
      console.log('🔍 First landscape topic - ALL fields:', Object.keys(landscapeTopics[0]));
      console.log('📄 Sample record with ALL data:', JSON.stringify(landscapeTopics[0], null, 2));
    }
    
    // Return ALL data without filtering fields
    return NextResponse.json({ 
      landscapeTopics, // This includes ALL fields from Airtable
      totalTopics: landscapeTopics.length,
      lastUpdated: new Date().toISOString(),
      source: 'airtable'
    });
    
  } catch (error) {
    console.error('🔴 Error fetching landscape topics:', error);
    
    // No fallback - return error
    return NextResponse.json(
      { 
        error: 'Failed to load landscape topics from Airtable', 
        details: error.message,
        hint: 'Check Airtable API key and permissions for Landscape topics table',
        landscapeTopics: [],
        totalTopics: 0
      },
      { status: 500 }
    );
  }
}