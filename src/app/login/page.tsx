'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BottomNavigation from '@/components/BottomNavigation';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Initialize admin user when component mounts
  useEffect(() => {
    const initializeAdmin = async () => {
      try {
        await fetch('/api/setup', { method: 'POST' });
      } catch {
        // Setup initialization failed
      }
    };
    
    initializeAdmin();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // First, try to setup admin user if it doesn't exist
      try {
        await fetch('/api/setup', { method: 'POST' });
      } catch {
        // Setup endpoint not available, continuing with login
      }

      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password. Please contact admin for access.');
      } else {
        // Get session to check user role
        const sessionRes = await fetch('/api/auth/session');
        const session = await sessionRes.json();
        
        // Redirect based on role
        if (session?.user?.role === 'client') {
          router.push('/client-matches');
        } else {
          router.push('/admin');
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/50 to-white flex flex-col">
      {/* Header */}
      <header className="px-5 pt-6 pb-4">
        <div className="max-w-lg mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-11 h-11 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-200">
              <span className="text-xl">💕</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 tracking-tight">PerfectPair</h1>
              <p className="text-[10px] text-teal-600 font-medium -mt-0.5">Find Your Soulmate</p>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-5 pb-24">
        <div className="max-w-md w-full">
          {/* Login Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-teal-200/50">
              <span className="text-3xl">🔐</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Welcome Back</h2>
            <p className="text-sm text-gray-500">Sign in to access your account</p>
          </div>
          
          {/* Login Form */}
          <form className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100" onSubmit={handleSubmit} autoComplete="off">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="off"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-base bg-gray-50"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-base bg-gray-50"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3.5 px-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-base font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-200/50 active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
          
          {/* Help Text */}
          <p className="text-center text-xs text-gray-400 mt-4">
            Contact admin for login credentials
          </p>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}