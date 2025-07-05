import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Simple authentication for admin access
        if (
          credentials?.email === process.env.ADMIN_EMAIL && 
          credentials?.password === process.env.ADMIN_PASSWORD
        ) {
          return {
            id: '1',
            email: credentials.email,
            name: 'Administrator'
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/admin/signin'
  },
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = 'admin';
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };