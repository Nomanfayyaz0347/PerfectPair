import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { InMemoryAdminStorage } from '@/lib/adminStorage';

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
          // Try MongoDB first, fallback to in-memory
          let useInMemory = false;
          let admin = null;
          
          try {
            await dbConnect();
            admin = await Admin.findOne({ email: credentials.email });
            
            if (!admin) {
              // Create default admin in MongoDB if not exists
              const defaultEmail = process.env.ADMIN_EMAIL || 'admin@matchmaker.com';
              const defaultPassword = process.env.ADMIN_PASSWORD || 'securepassword';
              
              if (credentials.email === defaultEmail) {
                admin = new Admin({
                  email: defaultEmail,
                  password: defaultPassword,
                  name: 'Default Admin'
                });
                await admin.save();
                console.log('Default admin created in MongoDB');
              }
            }
            
            if (admin) {
              const isPasswordValid = await admin.comparePassword(credentials.password);
              if (!isPasswordValid) {
                console.log('Invalid password for MongoDB admin:', credentials.email);
                return null;
              }
            }
          } catch {
            console.log('MongoDB connection failed, using in-memory admin storage');
            useInMemory = true;
          }
          
          if (useInMemory || !admin) {
            // Fallback to in-memory storage
            await InMemoryAdminStorage.initializeDefaultAdmin();
            
            const inMemoryAdmin = await InMemoryAdminStorage.findByEmail(credentials.email);
            
            if (!inMemoryAdmin) {
              console.log('Admin not found in in-memory storage:', credentials.email);
              return null;
            }

            const isPasswordValid = await InMemoryAdminStorage.verifyPassword(inMemoryAdmin, credentials.password);
            
            if (!isPasswordValid) {
              console.log('Invalid password for in-memory admin:', credentials.email);
              return null;
            }
            
            return {
              id: inMemoryAdmin.email,
              email: inMemoryAdmin.email,
              name: inMemoryAdmin.name,
              role: 'admin',
            };
          }

          // MongoDB admin found and validated
          return {
            id: admin._id.toString(),
            email: admin.email,
            name: admin.name,
            role: 'admin',
          };
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