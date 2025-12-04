'use client';

import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';

interface AdminHeaderProps {
  session: Session;
}

export default function AdminHeader({ session }: AdminHeaderProps) {
  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-md mx-auto px-4 py-4">
        {/* Top Row: Logo + Title + Sign Out */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">💕</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">PerfectPair Admin</h1>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="bg-gradient-to-r from-red-500 to-red-600 active:from-red-600 active:to-red-700 text-white px-3 py-1.5 rounded-full transition-all text-xs shadow-md active:scale-95"
          >
            Sign Out
          </button>
        </div>

        {/* Bottom Row: Subtitle + Welcome */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-600">Manage profiles and find matches</p>
          <span className="text-xs text-gray-500">Welcome, {session.user?.name}</span>
        </div>
      </div>
    </header>
  );
}
