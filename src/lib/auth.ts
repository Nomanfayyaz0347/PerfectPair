import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
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
          // Simple admin authentication for production deployment
          const defaultEmail = process.env.ADMIN_EMAIL || 'admin@matchmaker.com';
          const defaultPassword = process.env.ADMIN_PASSWORD || 'securepassword';
          
          if (credentials.email === defaultEmail && credentials.password === defaultPassword) {
            return {
              id: 'admin-1',
              email: defaultEmail,
              name: 'Admin',
              role: 'admin',
            };
          }
          
          // Try dynamic imports for database connection (avoid build-time issues)
          try {
            const { default: dbConnect } = await import('@/lib/mongodb');
            const { default: Admin } = await import('@/models/Admin');
            
            await dbConnect();
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
          } catch {
            console.log('Database connection failed during auth, using default admin only');
          }
          
          return null;
        } catch (error) {
          console.error('Auth error:', error);
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
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};