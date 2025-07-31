import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  // Only allow in development or with special header
  const isDev = process.env.NODE_ENV !== 'production';
  
  if (!isDev) {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }
  
  return NextResponse.json({
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      USE_AIRTABLE: process.env.USE_AIRTABLE,
      USE_MOCK_DATA: process.env.USE_MOCK_DATA,
      AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY ? '✓ Set' : '✗ Missing',
      AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID ? '✓ Set' : '✗ Missing',
    },
    deployment: {
      isProduction: process.env.NODE_ENV === 'production',
      isNetlify: !!process.env.NETLIFY,
      netlifyContext: process.env.CONTEXT,
    }
  });
}