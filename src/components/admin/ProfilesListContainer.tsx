'use client';

import Link from 'next/link';
import { Profile } from './types';
import { ReactNode } from 'react';

interface ProfilesListContainerProps {
  loading: boolean;
  profiles: Profile[];
  children: ReactNode;
}

export default function ProfilesListContainer({
  loading,
  profiles,
  children,
}: ProfilesListContainerProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-base font-semibold text-gray-900">All Profiles</h2>
      </div>
      
      {loading ? (
        <div className="p-6 text-center">
          <div className="flex items-center justify-center space-x-1 mb-3">
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          <p className="text-sm text-gray-600">Loading profiles...</p>
        </div>
      ) : profiles.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <p>No profiles found.</p>
          <Link href="/form" className="text-emerald-600 active:text-emerald-700 mt-2 inline-block">
            Create the first profile →
          </Link>
        </div>
      ) : (
        <div>
          <div className="space-y-3">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
