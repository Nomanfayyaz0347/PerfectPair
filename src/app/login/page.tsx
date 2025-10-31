'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    email: 'nomanfayyaz0347@gmail.com',
    password: '03472418269khan'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Initialize admin user when component mounts
  useEffect(() => {
    const initializeAdmin = async () => {
      try {
        await fetch('/api/setup', { method: 'POST' });
      } catch (error) {
        console.log('Setup initialization failed:', error);
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
        console.log('Setup endpoint not available, continuing with login');
      }

      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password. Try: nomanfayyaz0347@gmail.com / 03472418269khan');
      } else {
        router.push('/admin');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100/50 flex items-center justify-center py-6 px-3 sm:py-12 sm:px-4 lg:px-8">
      <div className="max-w-sm sm:max-w-md w-full space-y-6 sm:space-y-8">
        <div>
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mb-4 shadow-sm">
            <span className="text-white text-2xl">💕</span>
          </div>
          <h2 className="text-center text-2xl sm:text-3xl text-gray-900 mb-2 heading tracking-wide">
            PerfectPair
          </h2>
          <h3 className="text-center text-lg sm:text-xl text-gray-900 mb-2 heading">
            Admin Login
          </h3>
          <p className="text-center text-sm font-light text-gray-600 px-2 tracking-wide">
            Access the PerfectPair admin dashboard
          </p>

        </div>
        
        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6 bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-light text-gray-700 tracking-wide">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="mt-1 appearance-none relative block w-full px-4 py-3 sm:px-3 sm:py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 text-base sm:text-sm touch-manipulation"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-light text-gray-700 tracking-wide">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="mt-1 appearance-none relative block w-full px-4 py-3 sm:px-3 sm:py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 text-base sm:text-sm touch-manipulation"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-light rounded-full text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all tracking-wide shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
          
          <div className="text-center">
            <Link
              href="/"
              className="text-emerald-600 hover:text-emerald-500 text-sm font-light tracking-wide"
            >
              ← Back to Home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}