import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request) {
  try {
    // Get session
    const session = await getServerSession(authOptions);
    
    // Get cookies
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('next-auth.session-token');
    const secureSessionToken = cookieStore.get('__Secure-next-auth.session-token');
    
    // Get environment info
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      VERCEL_URL: process.env.VERCEL_URL,
      URL: process.env.URL,
      hasSecret: !!process.env.NEXTAUTH_SECRET
    };
    
    return NextResponse.json({
      session: session || null,
      cookies: {
        sessionToken: sessionToken ? 'present' : 'missing',
        secureSessionToken: secureSessionToken ? 'present' : 'missing'
      },
      environment: envInfo,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}