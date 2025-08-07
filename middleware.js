import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  
  // Public paths that don't require authentication
  const publicPaths = [
    '/login',
    '/api/auth',
    '/api/people', // Needed for login validation
    '/_next',
    '/favicon',
    '/images',
    '/public',
    '/site.webmanifest',
    '/apple-touch-icon.png'
  ];
  
  // Allow landing page and interactive visualization to be public
  const isPublicPage = pathname === '/' || pathname === '/landscape-interactive';
  
  // Allow APIs needed for public pages
  const isPublicAPI = pathname === '/api/case-studies' || 
                      pathname === '/api/landscape' || 
                      pathname === '/api/landscape-topics' ||
                      pathname === '/api/insights';
  
  // Check if the current path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  
  // Add CORS headers for API routes
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Allow public API paths
    if (isPublicPath) {
      return response;
    }
  }
  
  // Check authentication for protected routes
  if (!isPublicPath && !isPublicPage && !isPublicAPI) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-here' 
    });
    
    if (!token) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // If user is authenticated and trying to access login, redirect to home
  if (pathname === '/login') {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-here' 
    });
    
    if (token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|public|images).*)',
  ]
};