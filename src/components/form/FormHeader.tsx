'use client';

import Link from 'next/link';

export default function FormHeader() {
  return (
    <header className="px-5 pt-6 pb-4">
      <div className="max-w-lg mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-11 h-11 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-200">
            <span className="text-xl">💕</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800 tracking-tight">PerfectPair</h1>
            <p className="text-[10px] text-teal-600 font-medium -mt-0.5">Create Your Profile</p>
          </div>
        </div>
        <Link 
          href="/" 
          className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center active:scale-95 transition-all shadow-sm"
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </Link>
      </div>
    </header>
  );
}
