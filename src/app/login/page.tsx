'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
        setError('Invalid email or password. Try: admin@matchmaker.com / securepassword');
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center py-6 px-3 sm:py-12 sm:px-4 lg:px-8">
      <div className="max-w-sm sm:max-w-md w-full space-y-6 sm:space-y-8">
        <div>
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-2xl">💕</span>
          </div>
          <h2 className="text-center text-2xl sm:text-3xl font-black bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
            PerfectPair
          </h2>
          <h3 className="text-center text-lg sm:text-xl font-bold text-gray-900 mb-2">
            Admin Login
          </h3>
          <p className="text-center text-sm text-gray-600 px-2">
            Access the PerfectPair admin dashboard
          </p>
          <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs sm:text-sm text-blue-800 text-center">
              <strong>Default Login:</strong><br />
              Email: admin@perfectpair.com<br />
              Password: securepassword
            </p>
          </div>
        </div>
        
        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6 bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="mt-1 appearance-none relative block w-full px-4 py-3 sm:px-3 sm:py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 text-base sm:text-sm touch-manipulation"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="mt-1 appearance-none relative block w-full px-4 py-3 sm:px-3 sm:py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 text-base sm:text-sm touch-manipulation"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
              className="text-purple-600 hover:text-purple-500 text-sm font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}