'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 z-50">
      <div className="max-w-lg mx-auto px-2">
        <div className="flex items-center justify-around py-1">
          <Link href="/" className={`flex flex-col items-center py-1.5 px-2 min-w-[60px] ${pathname === '/' ? 'text-teal-600' : 'text-gray-400'}`}>
            {pathname === '/' ? (
              <div className="relative">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-teal-500 rounded-full"></div>
              </div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            )}
            <span className={`text-[9px] mt-0.5 ${pathname === '/' ? 'font-semibold' : 'font-medium'}`}>Home</span>
          </Link>
          
          <Link href="/about" className={`flex flex-col items-center py-1.5 px-2 min-w-[60px] ${pathname === '/about' ? 'text-teal-600' : 'text-gray-400'}`}>
            {pathname === '/about' ? (
              <div className="relative">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-teal-500 rounded-full"></div>
              </div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className={`text-[9px] mt-0.5 ${pathname === '/about' ? 'font-semibold' : 'font-medium'}`}>About</span>
          </Link>
          
          {/* Center FAB Button - Smaller */}
          <Link href="/form" className="relative -top-3">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-300/40 active:scale-95 transition-transform">
              <span className="text-2xl">💝</span>
              <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-teal-500 rounded-full"></div>
            </div>
          </Link>
          
          <Link href="/form" className={`flex flex-col items-center py-1.5 px-2 min-w-[60px] ${pathname === '/form' ? 'text-teal-600' : 'text-gray-400'}`}>
            {pathname === '/form' ? (
              <div className="relative">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-teal-500 rounded-full"></div>
              </div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
            <span className={`text-[9px] mt-0.5 ${pathname === '/form' ? 'font-semibold' : 'font-medium'}`}>Register</span>
          </Link>
          
          <Link href="/login" className={`flex flex-col items-center py-1.5 px-2 min-w-[60px] ${pathname === '/login' ? 'text-teal-600' : 'text-gray-400'}`}>
            {pathname === '/login' ? (
              <div className="relative">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-teal-500 rounded-full"></div>
              </div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
            <span className={`text-[9px] mt-0.5 ${pathname === '/login' ? 'font-semibold' : 'font-medium'}`}>Login</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
