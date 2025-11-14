'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useSWR from 'swr';

interface Profile {
  _id: string;
  name: string;
  fatherName: string;
  gender: 'Male' | 'Female';
  age: number;
  height: string;
  weight: string;
  color: string;
  cast: string;
  education: string;
  occupation: string;
  income: string;
  photoUrl?: string;
  status?: 'Active' | 'Matched' | 'Engaged' | 'Married' | 'Inactive';
  matchScore?: string;
  matchedFields?: string[];
  requirements?: {
    ageRange?: {
      min: number;
      max: number;
    };
    heightRange?: {
      min: string;
      max: string;
    };
    education?: string;
    cast?: string[];
    maslak?: string[];
    location?: string[];
  };
}

interface ExtendedSession {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    profileId?: string;
  };
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ClientMatchesPage() {
  const { data: session, status } = useSession() as { data: ExtendedSession | null; status: string };
  const router = useRouter();
  const [selectedMatch, setSelectedMatch] = useState<Profile | null>(null);
  const [showProfileDetails, setShowProfileDetails] = useState(false);

  // Fetch current profile with SWR
  const { data: profileData, error: profileError } = useSWR(
    session?.user.profileId ? `/api/profiles?id=${session.user.profileId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // Fetch matches with SWR
  const { data: matchesData, error: matchesError } = useSWR(
    session?.user.profileId ? `/api/profiles/${session.user.profileId}/matches` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const currentProfile = profileData?.profiles?.[0] || null;
  const matches = matchesData?.matches || [];
  const loading = !profileData && !profileError;

  // Authentication check
  if (status === 'unauthenticated' || (session && session.user.role !== 'client')) {
    router.push('/login');
    return null;
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Mobile Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-lg">💕</span>
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900">PerfectPair</h1>
                <p className="text-xs text-gray-600">Your Matches</p>
              </div>
            </div>
            <Link
              href="/api/auth/signout"
              className="px-3 py-1.5 bg-red-500 text-white rounded-full text-xs font-medium hover:bg-red-600 transition-colors shadow-sm active:scale-95"
            >
              Logout
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4">
        {/* Current Profile Info - Professional Minimal Design */}
        {currentProfile && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
            {/* Simple Header */}
            <div className="border-b border-gray-200 px-4 py-2.5 bg-gray-50">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">Your Profile</h2>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
                  {currentProfile.gender}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Photo and Name Section */}
              <div className="flex items-start gap-3 mb-4 pb-4 border-b border-gray-200">
                {currentProfile.photoUrl && (
                  <img
                    src={currentProfile.photoUrl}
                    alt={currentProfile.name}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-0.5">{currentProfile.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">{currentProfile.age} years • {currentProfile.height}</p>
                  
                  <button
                    onClick={() => setShowProfileDetails(true)}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                  >
                    View complete details
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Info Grid - Clean Layout */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Education</p>
                  <p className="text-xs font-medium text-gray-900 line-clamp-2">{currentProfile.education}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Occupation</p>
                  <p className="text-xs font-medium text-gray-900 line-clamp-2">{currentProfile.occupation}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Matches Section - Mobile */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="text-emerald-600">💑</span>
              Your Matches
            </h2>
            <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold">
              {matches.length}
            </span>
          </div>

          {matches.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">💝</div>
              <p className="text-base text-gray-700 mb-2 font-medium">No matches found yet</p>
              <p className="text-sm text-gray-500">We&apos;re working on finding the perfect match for you!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {matches.map((match: Profile) => (
                <div
                  key={match._id}
                  className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-4 active:scale-98 transition-transform"
                  onClick={() => setSelectedMatch(match)}
                >
                  <div className="flex gap-3 mb-3">
                    {match.photoUrl && (
                      <img
                        src={match.photoUrl}
                        alt={match.name}
                        className="w-20 h-20 object-cover rounded-xl shadow-sm"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-gray-900 mb-1">{match.name}</h3>
                      <p className="text-xs text-gray-600">{match.age} years • {match.height}</p>
                      {match.matchScore && (
                        <div className="mt-1">
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                            ⭐ {match.matchScore}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 text-xs mb-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="text-emerald-600">🎓</span>
                      <span className="line-clamp-1">{match.education}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="text-emerald-600">💼</span>
                      <span className="line-clamp-1">{match.occupation}</span>
                    </div>
                  </div>
                  
                  <button className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold rounded-xl shadow-sm active:scale-95 transition-transform">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Match Details Modal - Professional Style */}
      {selectedMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-gray-100 max-w-md w-full max-h-[90vh] overflow-y-auto">
            
            {/* Header with Profile Photo, Name and Status */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-3 py-2 rounded-t-xl z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {/* Profile Photo in Header */}
                  {selectedMatch.photoUrl && (
                    <div className="flex-shrink-0">
                      <img
                        src={selectedMatch.photoUrl}
                        alt={`${selectedMatch.name}'s profile`}
                        className="w-10 h-10 object-cover rounded-full border-2 border-emerald-300 shadow-sm"
                      />
                    </div>
                  )}
                  {/* Name, Basic Info and Status */}
                  <div>
                    <h2 className="text-base text-gray-900 font-bold">{selectedMatch.name}</h2>
                    <p className="text-xs text-gray-600">{selectedMatch.age} years • {selectedMatch.occupation}</p>
                    <span className="inline-block mt-0.5 text-xs px-2 py-0.5 bg-emerald-600 text-white rounded-full font-medium">
                      {selectedMatch.status || 'Active'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMatch(null)}
                  className="text-gray-400 hover:text-gray-600 p-1 flex-shrink-0"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-3">
              
              {/* 50-50 Layout */}
              <div className="grid grid-cols-1 gap-4">
                
                {/* Left Side - Details */}
                <div className="space-y-3">

                  {/* Personal Information */}
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <h3 className="text-base text-gray-800 font-bold mb-2">👤 Personal Information</h3>
                    <div className="divide-y divide-gray-200">
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 font-medium">Name:</span>
                        <span className="text-xs text-gray-900 font-medium">{selectedMatch.name}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 font-medium">Father&apos;s Name:</span>
                        <span className="text-xs text-gray-900">{selectedMatch.fatherName}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 font-medium">Gender:</span>
                        <span className="text-xs text-gray-900">{selectedMatch.gender}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 font-medium">Age:</span>
                        <span className="text-xs text-gray-900">{selectedMatch.age} years</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 font-medium">Height:</span>
                        <span className="text-xs text-gray-900">{selectedMatch.height}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 font-medium">Weight:</span>
                        <span className="text-xs text-gray-900">{selectedMatch.weight}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 font-medium">Complexion:</span>
                        <span className="text-xs text-gray-900">{selectedMatch.color}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 font-medium">Cast:</span>
                        <span className="text-xs text-gray-900">{selectedMatch.cast}</span>
                      </div>
                    </div>
                  </div>

                  {/* Education & Career */}
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <h3 className="text-base text-gray-800 font-bold mb-2">🎓 Education & Career</h3>
                    <div className="divide-y divide-gray-200">
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 font-medium">Education:</span>
                        <span className="text-xs text-gray-900 text-right">{selectedMatch.education}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 font-medium">Occupation:</span>
                        <span className="text-xs text-gray-900">{selectedMatch.occupation}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 font-medium">Income:</span>
                        <span className="text-xs text-gray-900">{selectedMatch.income}</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Side - Photo & Matched Fields */}
                <div className="space-y-3">

                  {/* Large Profile Photo */}
                  {selectedMatch.photoUrl && (
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <img
                        src={selectedMatch.photoUrl}
                        alt={selectedMatch.name}
                        className="w-full h-auto object-contain rounded-lg shadow-md"
                      />
                    </div>
                  )}

                  {/* Matched Requirements Card */}
                  {selectedMatch.matchedFields && selectedMatch.matchedFields.length > 0 && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                      <h3 className="text-base text-emerald-800 font-bold mb-2">✨ Matched Requirements</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedMatch.matchedFields.map((field, index) => (
                          <span
                            key={index}
                            className="px-2.5 py-1 bg-emerald-200 text-emerald-800 rounded-full text-xs font-medium"
                          >
                            {field}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Info Note - Bottom */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
                <p className="text-xs text-amber-900">
                  <span className="font-semibold">📞 Note:</span> For contact information and further details, 
                  please contact your matchmaker.
                </p>
              </div>

              {/* Close Button */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedMatch(null)}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Your Profile Full Details Modal - Admin Style */}
      {showProfileDetails && currentProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-gray-100 max-w-md w-full max-h-[90vh] overflow-y-auto">
            
            {/* Header with Profile Photo, Name and Status */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-3 py-2 rounded-t-xl z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {/* Profile Photo in Header */}
                  {currentProfile.photoUrl && (
                    <div className="flex-shrink-0">
                      <img
                        src={currentProfile.photoUrl}
                        alt={`${currentProfile.name}'s profile`}
                        className="w-10 h-10 object-cover rounded-full border-2 border-emerald-300 shadow-sm"
                      />
                    </div>
                  )}
                  {/* Name, Basic Info and Status */}
                  <div>
                    <h2 className="text-base text-gray-900 font-bold">{currentProfile.name}</h2>
                    <p className="text-xs text-gray-600">{currentProfile.age} years • {currentProfile.occupation}</p>
                    <span className="inline-block mt-0.5 text-xs px-2 py-0.5 bg-emerald-600 text-white rounded-full font-medium">
                      {currentProfile.status || 'Active'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowProfileDetails(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 flex-shrink-0"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-3">
              
              {/* 50-50 Layout */}
              <div className="grid grid-cols-1 gap-4">
                
                {/* Left Side - Details */}
                <div className="space-y-3">

                  {/* Personal Information */}
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <h3 className="text-base text-gray-800 font-bold mb-2">👤 Personal Information</h3>
                    <div className="divide-y divide-gray-200">
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 font-medium">Name:</span>
                        <span className="text-xs text-gray-900 font-medium">{currentProfile.name}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 font-medium">Father&apos;s Name:</span>
                        <span className="text-xs text-gray-900">{currentProfile.fatherName}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 font-medium">Gender:</span>
                        <span className="text-xs text-gray-900">{currentProfile.gender}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 font-medium">Age:</span>
                        <span className="text-xs text-gray-900">{currentProfile.age} years</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 font-medium">Height:</span>
                        <span className="text-xs text-gray-900">{currentProfile.height}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 font-medium">Weight:</span>
                        <span className="text-xs text-gray-900">{currentProfile.weight}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 font-medium">Complexion:</span>
                        <span className="text-xs text-gray-900">{currentProfile.color}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 font-medium">Cast:</span>
                        <span className="text-xs text-gray-900">{currentProfile.cast}</span>
                      </div>
                    </div>
                  </div>

                  {/* Education & Career */}
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <h3 className="text-base text-gray-800 font-bold mb-2">🎓 Education & Career</h3>
                    <div className="divide-y divide-gray-200">
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 font-medium">Education:</span>
                        <span className="text-xs text-gray-900 text-right">{currentProfile.education}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 font-medium">Occupation:</span>
                        <span className="text-xs text-gray-900">{currentProfile.occupation}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 font-medium">Income:</span>
                        <span className="text-xs text-gray-900">{currentProfile.income}</span>
                      </div>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <h3 className="text-base text-gray-800 font-bold mb-2">💍 Requirements</h3>
                    <div className="divide-y divide-gray-200">
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 font-medium">Age Range:</span>
                        <span className="text-xs text-gray-900">{currentProfile.requirements?.ageRange?.min || 'N/A'} - {currentProfile.requirements?.ageRange?.max || 'N/A'} years</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 font-medium">Height Range:</span>
                        <span className="text-xs text-gray-900">{currentProfile.requirements?.heightRange?.min || 'N/A'} - {currentProfile.requirements?.heightRange?.max || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 font-medium">Education:</span>
                        <span className="text-xs text-gray-900 text-right">{currentProfile.requirements?.education || 'Any'}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 font-medium">Cast:</span>
                        <span className="text-xs text-gray-900">{currentProfile.requirements?.cast?.join(', ') || 'Any'}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 font-medium">Maslak:</span>
                        <span className="text-xs text-gray-900">{currentProfile.requirements?.maslak?.join(', ') || 'Any'}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 font-medium">Location:</span>
                        <span className="text-xs text-gray-900 text-right">{currentProfile.requirements?.location?.join(', ') || 'Any'}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Info Note - Moved to Bottom */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
                <p className="text-xs text-amber-900">
                  <span className="font-semibold">📞 Note:</span> For contact information and further details, 
                  please contact your matchmaker.
                </p>
              </div>

              {/* Close Button */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowProfileDetails(false)}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
