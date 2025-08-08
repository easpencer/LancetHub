import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authConfig, getAuthUrl } from '../../../../utils/auth-config';

// Hardcoded password for all team members
const TEAM_PASSWORD = 'WeAreResilient1s';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          // Check if credentials exist
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          // Check if password matches
          if (credentials.password !== TEAM_PASSWORD) {
            return null;
          }

          // Allow ResilientUser as a special login
          if (
            (credentials.email.toLowerCase() === 'resilientuser@lancethub.org' || 
             credentials.email.toLowerCase() === 'resilientuser@example.com' ||
             credentials.email.toLowerCase() === 'resilientuser') && 
            credentials.password === TEAM_PASSWORD
          ) {
            return {
              id: 'resilient-user',
              email: 'resilientuser@lancethub.org',
              name: 'Resilient User',
              role: 'member'
            };
          }

          // For production, allow any email with the correct password
          // Since we can't fetch from Airtable during auth in production
          // We'll validate team membership but allow access with correct password
          
          // Check for admin credentials
          if (
            credentials.email === process.env.ADMIN_EMAIL && 
            credentials.password === process.env.ADMIN_PASSWORD
          ) {
            return {
              id: 'admin',
              email: credentials.email,
              name: 'Administrator',
              role: 'admin'
            };
          }

          // Allow specific known team members
          const knownTeamMembers = [
            'earonoffspencer@health.ucsd.edu',
            'spencer@health.ucsd.edu',
            // Add more team member emails as needed
          ];

          if (knownTeamMembers.some(email => email.toLowerCase() === credentials.email.toLowerCase())) {
            return {
              id: credentials.email,
              email: credentials.email,
              name: credentials.email.split('@')[0].replace(/[._-]/g, ' '),
              role: 'member'
            };
          }

          // For any other email with correct password, allow access
          // This ensures the site works even if we can't validate against Airtable
          return {
            id: credentials.email,
            email: credentials.email,
            name: credentials.email.split('@')[0].replace(/[._-]/g, ' '),
            role: 'member'
          };

        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login'
  },
  session: authConfig.session,
  jwt: authConfig.jwt,
  cookies: authConfig.cookies,
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role || 'member';
        token.affiliation = user.affiliation;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name,
        role: token.role,
        affiliation: token.affiliation
      };
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle redirects properly
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  secret: authConfig.secret,
  trustHost: authConfig.trustHost,
  debug: process.env.NODE_ENV === 'development'
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };