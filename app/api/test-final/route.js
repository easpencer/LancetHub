import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    environment: {
      platform: process.platform,
      node: process.version,
      netlify: !!process.env.NETLIFY,
      hasAirtableKey: !!process.env.AIRTABLE_API_KEY,
      hasAirtableBase: !!process.env.AIRTABLE_BASE_ID,
    },
    tests: []
  };
  
  // Test 1: Simple module check
  try {
    results.tests.push({ test: 'Module exists', status: 'checking' });
    await import('airtable');
    results.tests.push({ test: 'Module exists', status: 'passed' });
  } catch (e) {
    results.tests.push({ test: 'Module exists', status: 'failed', error: e.message });
  }
  
  // Test 2: Use final implementation
  try {
    results.tests.push({ test: 'Final implementation', status: 'checking' });
    const { fetchPeopleData } = await import('../../../utils/airtable-final.js');
    const people = await fetchPeopleData({ maxRecords: 1 });
    results.tests.push({ 
      test: 'Final implementation', 
      status: 'passed',
      recordCount: people.length 
    });
  } catch (e) {
    results.tests.push({ 
      test: 'Final implementation', 
      status: 'failed', 
      error: e.message,
      stack: e.stack 
    });
  }
  
  return NextResponse.json(results);
}