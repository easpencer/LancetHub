import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

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

          // Fetch team members from Airtable to validate email
          const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/people`);
          if (!response.ok) {
            console.error('Failed to fetch team members');
            return null;
          }

          const data = await response.json();
          const teamMembers = data.people || [];

          // Check if email belongs to a team member
          // First try email matching
          let teamMember = teamMembers.find(member => {
            const memberEmail = member.Email || member['Email Address'] || '';
            return memberEmail.toLowerCase() === credentials.email.toLowerCase();
          });
          
          // If no email match found, try matching by name for temporary access
          if (!teamMember) {
            // Extract name from email (part before @)
            const nameFromEmail = credentials.email.split('@')[0].replace(/[._-]/g, ' ').toLowerCase();
            teamMember = teamMembers.find(member => {
              const memberName = (member.Name || '').toLowerCase();
              return memberName.includes('spencer') && nameFromEmail.includes('spencer');
            });
          }

          if (teamMember) {
            return {
              id: teamMember.id || '1',
              email: credentials.email,
              name: teamMember.Name || teamMember['Full Name'] || 'Team Member',
              role: teamMember.Role || 'member',
              affiliation: teamMember.Affiliation || teamMember.Institution || ''
            };
          }

          // Fallback for special users
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
          
          // Allow ResilientUser as a special login
          if (
            credentials.email.toLowerCase() === 'resilientuser' && 
            credentials.password === TEAM_PASSWORD
          ) {
            return {
              id: 'resilient-user',
              email: 'resilientuser',
              name: 'Resilient User',
              role: 'member'
            };
          }

          return null;
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
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
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
    }
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-here',
  debug: process.env.NODE_ENV === 'development'
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };