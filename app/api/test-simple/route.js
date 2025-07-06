import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json({
      status: 'ok',
      message: 'Simple test endpoint working',
      timestamp: new Date().toISOString(),
      runtime: process.version,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        NETLIFY: !!process.env.NETLIFY,
      }
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Test endpoint error',
        details: error.message
      },
      { status: 500 }
    );
  }
}