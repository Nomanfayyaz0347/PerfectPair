import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Ensure required environment variables are set
if (!process.env.NEXTAUTH_SECRET) {
  console.warn('⚠️ NEXTAUTH_SECRET is not set - using fallback (NOT SECURE FOR PRODUCTION)');
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'perfectpair-dev-secret-change-in-production',
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Admin authentication from environment variables (required)
          const adminEmail = process.env.ADMIN_EMAIL;
          const adminPassword = process.env.ADMIN_PASSWORD;
          
          // Only allow env-based admin login if both are set
          if (adminEmail && adminPassword && 
              credentials.email === adminEmail && 
              credentials.password === adminPassword) {
            return {
              id: 'admin-1',
              email: adminEmail,
              name: 'Admin',
              role: 'admin',
            };
          }
          
          // Try dynamic imports for database connection (avoid build-time issues)
          try {
            const { default: dbConnect } = await import('@/lib/mongodb');
            const { default: Admin } = await import('@/models/Admin');
            const { default: Client } = await import('@/models/Client');
            
            await dbConnect();
            
            // Check if user is an admin
            const admin = await Admin.findOne({ email: credentials.email });
            
            if (admin) {
              const isPasswordValid = await admin.comparePassword(credentials.password);
              if (isPasswordValid) {
                return {
                  id: admin._id.toString(),
                  email: admin.email,
                  name: admin.name,
                  role: 'admin',
                };
              }
            }
            
            // Check if user is a client
            const client = await Client.findOne({ email: credentials.email, isActive: true });
            
            if (client) {
              const isPasswordValid = await client.comparePassword(credentials.password);
              if (isPasswordValid) {
                return {
                  id: client._id.toString(),
                  email: client.email,
                  name: client.name,
                  role: 'client',
                  profileId: client.profileId.toString(),
                };
              }
            }
          } catch {

          }
          
          return null;
        } catch {
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.profileId = user.profileId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.profileId = token.profileId as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
};