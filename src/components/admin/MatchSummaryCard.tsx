'use client';

import Link from 'next/link';
import { Profile, getSharedCount } from './types';

interface MatchSummaryCardProps {
  profile: Profile;
  matchCount: number;
}

export default function MatchSummaryCard({ profile, matchCount }: MatchSummaryCardProps) {
  const isActive = profile.status === 'Active' || !profile.status;
  const hasMatches = matchCount > 0 && isActive;

  return (
    <div className="mb-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">💕</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-emerald-800">Match Analysis</h3>
            <p className="text-xs text-emerald-600">
              {isActive ? 
                `${matchCount} compatible profiles found` :
                'No matches available - Profile is Inactive'
              }
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-lg font-bold text-emerald-700">
              {isActive ? matchCount : 0}
            </div>
            <div className="text-xs text-emerald-600 font-light">matches</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl text-purple-700 heading">
              {getSharedCount(profile)}
            </div>
            <div className="text-xs text-purple-600 font-light">shared</div>
          </div>
        </div>
      </div>
      {hasMatches && (
        <div className="mt-2 sm:mt-3">
          <Link
            href={`/matches?id=${profile._id}&name=${encodeURIComponent(profile.name)}`}
            className="text-xs sm:text-sm bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-full transition-colors font-light inline-block"
          >
            View All Matches →
          </Link>
        </div>
      )}
    </div>
  );
}
