// Centralized authentication configuration
// This ensures consistency between NextAuth and middleware

export const getAuthSecret = () => {
  // Use environment variable if available, otherwise use a consistent fallback
  // This ensures the same secret is used everywhere
  return process.env.NEXTAUTH_SECRET || 'lancethub_secure_nextauth_secret_key_2024';
};

export const getAuthUrl = () => {
  // Get the proper URL for authentication
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  // Netlify deployment URL
  if (process.env.URL) {
    return process.env.URL;
  }
  // Netlify deploy preview URL
  if (process.env.DEPLOY_URL) {
    return process.env.DEPLOY_URL;
  }
  // Vercel deployment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NODE_ENV === 'production') {
    // Fallback for production - update this with your actual domain
    return 'https://pandemic-resilience-hub.org';
  }
  return 'http://localhost:3000';
};

export const authConfig = {
  secret: getAuthSecret(),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: undefined, // Let the browser handle this
      },
    },
    callbackUrl: {
      name: 'next-auth.callback-url',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      name: 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  // Add trust host for production
  trustHost: true,
};