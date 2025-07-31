import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  // Test environment variables
  const env = {
    NODE_ENV: process.env.NODE_ENV,
    NETLIFY: !!process.env.NETLIFY,
    CONTEXT: process.env.CONTEXT,
    // Check if credentials exist (not exposing values)
    AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY ? 
      `Set (${process.env.AIRTABLE_API_KEY.substring(0, 10)}...)` : 'Not set',
    AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID ? 
      `Set (${process.env.AIRTABLE_BASE_ID})` : 'Not set',
    USE_AIRTABLE: process.env.USE_AIRTABLE,
    // Test if we can import Airtable
    canImportAirtable: false,
    airtableError: null
  };
  
  // Try to import Airtable module
  try {
    await import('airtable');
    env.canImportAirtable = true;
  } catch (error) {
    env.airtableError = error.message;
  }
  
  return NextResponse.json(env);
}