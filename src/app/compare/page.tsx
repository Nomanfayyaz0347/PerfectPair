'use client';

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';

interface Profile {
  _id: string;
  id?: string;
  name: string;
  age: number;
  gender: string;
  education: string;
  cast: string;
}

interface ComparisonResult {
  match: boolean;
  matchPercentage?: number;
  matchingFields?: string[];
  profiles?: {
    profile1: {
      name: string;
      age: number;
      gender: string;
      education: string;
      cast: string;
    };
    profile2: {
      name: string;
      age: number;
      gender: string;
      education: string;
      cast: string;
    };
  };
  ageCompatible?: boolean;
  ageDifference?: number;
  reason?: string;
}

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ComparePage() {
  const [profile1, setProfile1] = useState('');
  const [profile2, setProfile2] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState('');
  
  // Use SWR for profiles with caching
  const { data: profilesData, isLoading: loadingProfiles } = useSWR(
    '/api/profiles?limit=1000',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 30000, // 30 seconds
    }
  );

  const profiles: Profile[] = profilesData?.profiles || profilesData || [];
  
  // Batch compare states
  const [batchMode, setBatchMode] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState('');
  const [batchResults, setBatchResults] = useState<Array<{
    name: string; 
    match: boolean; 
    percentage?: number;
    requirementMatchPercentage?: number;
    directMatchPercentage?: number;
    matchingFields?: string[];
    requirementMatchingFields?: string[];
    directMatchingFields?: string[];
    profiles?: {
      profile1: { name: string; age: number; gender: string; education: string; cast: string; [key: string]: string | number };
      profile2: { name: string; age: number; gender: string; education: string; cast: string; [key: string]: string | number };
    };
  }>>([]);
  const [batchLoading, setBatchLoading] = useState(false);
  const [detailsPopup, setDetailsPopup] = useState<{
    name: string;
    percentage?: number;
    requirementMatchPercentage?: number;
    directMatchPercentage?: number;
    matchingFields?: string[];
    requirementMatchingFields?: string[];
    directMatchingFields?: string[];
    profiles?: {
      profile1: { name: string; age: number; gender: string; education: string; cast: string; [key: string]: string | number };
      profile2: { name: string; age: number; gender: string; education: string; cast: string; [key: string]: string | number };
    };
  } | null>(null);

  const compareProfiles = async () => {
    if (!profile1 || !profile2) {
      setError('Please enter both profile names');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(
        `/api/compare-profiles?profile1=${encodeURIComponent(profile1)}&profile2=${encodeURIComponent(profile2)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to compare profiles');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const batchCompare = async () => {
    if (!selectedProfile) {
      setError('Please select a profile to compare');
      return;
    }

    setBatchLoading(true);
    setError('');
    setBatchResults([]);

    const selectedGender = profiles.find(p => p.name === selectedProfile)?.gender;
    const oppositeGender = selectedGender === 'Male' ? 'Female' : 'Male';
    const targetProfiles = profiles.filter(p => p.gender === oppositeGender);

    const results = [];

    for (const target of targetProfiles) {
      try {
        const response = await fetch(
          `/api/compare-profiles?profile1=${encodeURIComponent(selectedProfile)}&profile2=${encodeURIComponent(target.name)}`
        );
        const data = await response.json();

        if (response.ok && data.match) {
          results.push({
            name: target.name,
            match: true,
            percentage: data.matchPercentage,
            requirementMatchPercentage: data.requirementMatchPercentage,
            directMatchPercentage: data.directMatchPercentage,
            matchingFields: data.matchingFields,
            requirementMatchingFields: data.requirementMatchingFields,
            directMatchingFields: data.directMatchingFields,
            profiles: data.profiles
          });
        }
      } catch {
        // Skip failed comparisons
      }
    }

    // Sort by match percentage
    results.sort((a, b) => (b.percentage || 0) - (a.percentage || 0));
    setBatchResults(results);
    setBatchLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Mode Toggle */}
        <div className="bg-white rounded-lg shadow-sm p-3 mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setBatchMode(false)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                !batchMode 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Single Compare
            </button>
            <button
              onClick={() => setBatchMode(true)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                batchMode 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Batch Compare
            </button>
          </div>
        </div>

        {!batchMode ? (
          /* Single Compare Mode */
          <>
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">Compare Profiles</h1>
            <p className="text-xs sm:text-sm text-gray-600">Enter two names to check their compatibility</p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="profile1" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                First Profile Name (Female)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  id="profile1"
                  value={profile1}
                  onChange={(e) => setProfile1(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter or select name"
                  list="profile1-list"
                />
                <select
                  value={profile1}
                  onChange={(e) => setProfile1(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  disabled={loadingProfiles}
                >
                  <option value="">-- Select Female Profile --</option>
                  {profiles
                    .filter(profile => profile.gender === 'Female')
                    .map((profile) => (
                    <option key={profile._id || profile.id} value={profile.name}>
                      {profile.name} ({profile.age} yrs)
                    </option>
                  ))}
                </select>
              </div>
              {loadingProfiles && (
                <p className="text-xs text-gray-500 mt-1">Loading profiles...</p>
              )}
            </div>

            <div>
              <label htmlFor="profile2" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Second Profile Name (Male)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  id="profile2"
                  value={profile2}
                  onChange={(e) => setProfile2(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter or select name"
                  list="profile2-list"
                />
                <select
                  value={profile2}
                  onChange={(e) => setProfile2(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  disabled={loadingProfiles}
                >
                  <option value="">-- Select Male Profile --</option>
                  {profiles
                    .filter(profile => profile.gender === 'Male')
                    .map((profile) => (
                    <option key={profile._id || profile.id} value={profile.name}>
                      {profile.name} ({profile.age} yrs)
                    </option>
                  ))}
                </select>
              </div>
              {loadingProfiles && (
                <p className="text-xs text-gray-500 mt-1">Loading profiles...</p>
              )}
            </div>

            <button
              onClick={compareProfiles}
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white py-2.5 sm:py-3 rounded-lg text-sm font-medium transition-colors"
            >
              {loading ? 'Comparing...' : 'Compare Profiles'}
            </button>
          </div>

          {error && (
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs sm:text-sm text-red-600">{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-gray-50 border border-gray-200 rounded-lg">
              {result.match ? (
                <>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-800">Match Results</h2>
                    <span className="text-lg sm:text-xl font-bold text-emerald-600">{result.matchPercentage}% Match</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Profile 1 */}
                    <div className="p-3 sm:p-4 bg-white rounded-lg border border-gray-200">
                      <h3 className="text-sm font-medium text-gray-800 mb-2">{result.profiles?.profile1.name}</h3>
                      <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                        <p>Age: {result.profiles?.profile1.age}</p>
                        <p>Gender: {result.profiles?.profile1.gender}</p>
                        <p>Education: {result.profiles?.profile1.education}</p>
                        <p>Cast: {result.profiles?.profile1.cast}</p>
                      </div>
                    </div>

                    {/* Profile 2 */}
                    <div className="p-3 sm:p-4 bg-white rounded-lg border border-gray-200">
                      <h3 className="text-sm font-medium text-gray-800 mb-2">{result.profiles?.profile2.name}</h3>
                      <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                        <p>Age: {result.profiles?.profile2.age}</p>
                        <p>Gender: {result.profiles?.profile2.gender}</p>
                        <p>Education: {result.profiles?.profile2.education}</p>
                        <p>Cast: {result.profiles?.profile2.cast}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-4">
                    <h3 className="text-sm font-medium text-gray-800 mb-2">Matching Details</h3>
                    <div className="space-y-2">
                      {result.matchingFields && result.matchingFields.length > 0 && (
                        <p className="text-xs sm:text-sm text-gray-600">
                          <span className="font-medium">Matching Fields:</span>{' '}
                          {result.matchingFields.join(', ')}
                        </p>
                      )}
                      <p className="text-xs sm:text-sm text-gray-600">
                        <span className="font-medium">Age Difference:</span>{' '}
                        {result.ageDifference} years
                        {result.ageCompatible && ' (Compatible)'}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-3 sm:py-4">
                  <p className="text-base sm:text-lg font-medium text-red-600">Not Compatible</p>
                  {result.reason && <p className="mt-2 text-xs sm:text-sm text-gray-600">{result.reason}</p>}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-center">
          <Link
            href="/admin"
            className="inline-block text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>
        </>
        ) : (
          /* Batch Compare Mode */
          <div className="space-y-4">
            {/* Profile Selection */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-3">Select Profile</h2>
              <select
                value={selectedProfile}
                onChange={(e) => setSelectedProfile(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Choose a profile...</option>
                {profiles.map((profile) => (
                  <option key={profile._id} value={profile.name}>
                    {profile.name} ({profile.age} yrs, {profile.gender})
                  </option>
                ))}
              </select>
              
              <button
                onClick={batchCompare}
                disabled={!selectedProfile || batchLoading}
                className="w-full mt-4 bg-emerald-500 text-white py-3 px-4 rounded-lg hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium transition-colors"
              >
                {batchLoading ? 'Comparing...' : 'Compare with All Matches'}
              </button>
            </div>

            {/* Results Display */}
            {batchResults.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-3">
                  Match Results ({batchResults.length})
                </h2>
                <div className="grid gap-2">
                  {batchResults.map((result, index) => (
                    <div
                      key={index}
                      onClick={() => setDetailsPopup(result)}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors cursor-pointer hover:bg-emerald-50"
                    >
                      <div>
                        <span className="font-medium text-gray-800 text-sm">
                          {index + 1}. {result.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-emerald-600">
                          {result.percentage}%
                        </span>
                        <span className="text-xs text-gray-500 ml-1">Match</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Details Popup */}
            {detailsPopup && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50" onClick={() => setDetailsPopup(null)}>
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                  <div className="p-3 sm:p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3 sm:mb-4 pb-3 sm:pb-4 border-b">
                      <div>
                        <h2 className="text-base sm:text-xl font-bold text-gray-800">Match Details</h2>
                        <p className="text-xs sm:text-sm text-gray-600">{detailsPopup.name}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex gap-2 items-baseline">
                          <div>
                            <div className="text-lg sm:text-2xl font-bold text-purple-600">{detailsPopup.requirementMatchPercentage || detailsPopup.percentage}%</div>
                            <div className="text-xs text-gray-500">Requirements</div>
                          </div>
                          <div className="text-gray-400">|</div>
                          <div>
                            <div className="text-lg sm:text-2xl font-bold text-emerald-600">{detailsPopup.directMatchPercentage || 0}%</div>
                            <div className="text-xs text-gray-500">Direct</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Requirements-Based Matching Fields */}
                    {detailsPopup.requirementMatchingFields && detailsPopup.requirementMatchingFields.length > 0 && (
                      <div className="mb-4 sm:mb-6">
                        <h3 className="text-sm sm:text-lg font-semibold text-purple-600 mb-2 sm:mb-3 flex items-center">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          Requirements Match ({detailsPopup.requirementMatchingFields.length})
                        </h3>
                        <div className="grid gap-1.5 sm:gap-2">
                          {detailsPopup.requirementMatchingFields.map((field, idx) => (
                            <div key={idx} className="flex items-center p-2 sm:p-3 bg-purple-50 border border-purple-200 rounded-lg">
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mr-2 sm:mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                              </svg>
                              <span className="text-xs sm:text-sm font-medium text-purple-800 capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Direct Field Matching */}
                    {detailsPopup.directMatchingFields && detailsPopup.directMatchingFields.length > 0 && (
                      <div className="mb-4 sm:mb-6">
                        <h3 className="text-sm sm:text-lg font-semibold text-emerald-600 mb-2 sm:mb-3 flex items-center">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          Direct Field Match ({detailsPopup.directMatchingFields.length})
                        </h3>
                        <div className="grid gap-1.5 sm:gap-2">
                          {detailsPopup.directMatchingFields.map((field, idx) => (
                            <div key={idx} className="flex items-center p-2 sm:p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 mr-2 sm:mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                              </svg>
                              <span className="text-xs sm:text-sm font-medium text-emerald-800 capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Legacy support - show old matchingFields if new fields not available */}
                    {!detailsPopup.requirementMatchingFields && !detailsPopup.directMatchingFields && detailsPopup.matchingFields && detailsPopup.matchingFields.length > 0 && (
                      <div className="mb-4 sm:mb-6">
                        <h3 className="text-sm sm:text-lg font-semibold text-emerald-600 mb-2 sm:mb-3 flex items-center">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          Matching Fields ({detailsPopup.matchingFields.length})
                        </h3>
                        <div className="grid gap-1.5 sm:gap-2">
                          {detailsPopup.matchingFields.map((field, idx) => (
                            <div key={idx} className="flex items-center p-2 sm:p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 mr-2 sm:mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                              </svg>
                              <span className="text-xs sm:text-sm font-medium text-emerald-800 capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Non-Matching Fields */}
                    {detailsPopup.profiles && (
                      <div className="mb-3 sm:mb-4">
                        <h3 className="text-sm sm:text-lg font-semibold text-red-600 mb-2 sm:mb-3 flex items-center">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                          </svg>
                          Non-Matching Fields
                        </h3>
                        <div className="grid gap-1.5 sm:gap-2">
                          {Object.keys(detailsPopup.profiles.profile1).map((field) => {
                            // Check if field is in any matching category
                            const isRequirementMatch = detailsPopup.requirementMatchingFields?.includes(field);
                            const isDirectMatch = detailsPopup.directMatchingFields?.includes(field);
                            const isLegacyMatch = detailsPopup.matchingFields?.includes(field);
                            
                            // Skip if matching or name/gender
                            if (isRequirementMatch || isDirectMatch || isLegacyMatch || field === 'name' || field === 'gender') return null;
                            
                            return (
                              <div key={field} className="p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-start">
                                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                                  </svg>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs sm:text-sm font-medium text-red-800 capitalize mb-1">
                                      {field.replace(/([A-Z])/g, ' $1').trim()}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-xs">
                                      <div className="bg-white p-2 rounded">
                                        <span className="text-gray-500">{detailsPopup.profiles?.profile1.name}:</span>
                                        <span className="font-medium text-gray-800 ml-1">
                                          {detailsPopup.profiles?.profile1[field] || 'N/A'}
                                        </span>
                                      </div>
                                      <div className="bg-white p-2 rounded">
                                        <span className="text-gray-500">{detailsPopup.profiles?.profile2.name}:</span>
                                        <span className="font-medium text-gray-800 ml-1">
                                          {detailsPopup.profiles?.profile2[field] || 'N/A'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Close Button */}
                    <button
                      onClick={() => setDetailsPopup(null)}
                      className="w-full mt-3 sm:mt-4 bg-gray-500 text-white py-2 sm:py-3 px-4 rounded-lg hover:bg-gray-600 text-xs sm:text-sm font-medium transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}