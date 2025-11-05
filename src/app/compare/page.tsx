'use client';

import { useState } from 'react';
import Link from 'next/link';

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

export default function ComparePage() {
  const [profile1, setProfile1] = useState('');
  const [profile2, setProfile2] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState('');

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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Compare Profiles</h1>
            <p className="text-gray-600">Enter two names to check their compatibility</p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="profile1" className="block text-sm font-medium text-gray-700 mb-1">
                First Profile Name
              </label>
              <input
                type="text"
                id="profile1"
                value={profile1}
                onChange={(e) => setProfile1(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter first person's name"
              />
            </div>

            <div>
              <label htmlFor="profile2" className="block text-sm font-medium text-gray-700 mb-1">
                Second Profile Name
              </label>
              <input
                type="text"
                id="profile2"
                value={profile2}
                onChange={(e) => setProfile2(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter second person's name"
              />
            </div>

            <button
              onClick={compareProfiles}
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Comparing...' : 'Compare Profiles'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
              {result.match ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Match Results</h2>
                    <span className="text-2xl font-bold text-emerald-600">{result.matchPercentage}% Match</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Profile 1 */}
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <h3 className="font-medium text-gray-800 mb-2">{result.profiles?.profile1.name}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Age: {result.profiles?.profile1.age}</p>
                        <p>Gender: {result.profiles?.profile1.gender}</p>
                        <p>Education: {result.profiles?.profile1.education}</p>
                        <p>Cast: {result.profiles?.profile1.cast}</p>
                      </div>
                    </div>

                    {/* Profile 2 */}
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <h3 className="font-medium text-gray-800 mb-2">{result.profiles?.profile2.name}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Age: {result.profiles?.profile2.age}</p>
                        <p>Gender: {result.profiles?.profile2.gender}</p>
                        <p>Education: {result.profiles?.profile2.education}</p>
                        <p>Cast: {result.profiles?.profile2.cast}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-medium text-gray-800 mb-2">Matching Details</h3>
                    <div className="space-y-2">
                      {result.matchingFields && result.matchingFields.length > 0 && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Matching Fields:</span>{' '}
                          {result.matchingFields.join(', ')}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Age Difference:</span>{' '}
                        {result.ageDifference} years
                        {result.ageCompatible && ' (Compatible)'}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-lg font-medium text-red-600">Not Compatible</p>
                  {result.reason && <p className="mt-2 text-gray-600">{result.reason}</p>}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-center">
          <Link
            href="/admin"
            className="inline-block text-emerald-600 hover:text-emerald-700 font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}