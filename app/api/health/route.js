import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      NODE_VERSION: process.version,
      AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY ? '✅ Set' : '❌ Missing',
      AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID ? '✅ Set' : '❌ Missing',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Not set',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing',
      USE_MOCK_DATA: process.env.USE_MOCK_DATA || 'Not set',
      VERCEL_ENV: process.env.VERCEL_ENV || 'Not set',
      NETLIFY: process.env.NETLIFY || 'Not set',
      NETLIFY_DEV: process.env.NETLIFY_DEV || 'Not set',
    };

    // Test basic functionality
    const timestamp = new Date().toISOString();
    
    return NextResponse.json({
      status: 'ok',
      timestamp,
      environment: envCheck,
      runtime: 'nodejs',
      message: 'API is running'
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}