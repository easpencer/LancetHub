import { NextResponse } from 'next/server';

export function middleware(request) {
  // Log API requests for debugging
  if (request.nextUrl.pathname.startsWith('/api/')) {
    console.log(`[API Request] ${request.method} ${request.nextUrl.pathname}`);
    console.log(`[API Headers] ${JSON.stringify(Object.fromEntries(request.headers.entries()))}`);
  }

  // Add CORS headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};