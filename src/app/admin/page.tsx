'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

interface Profile {
  _id: string;
  name: string;
  fatherName: string;
  age: number;
  height: string;
  weight: string;
  color: string;
  education: string;
  occupation: string;
  income: string;
  familyDetails: string;
  address: string;
  contactNumber: string;
  photoUrl?: string;
  requirements: {
    ageRange: { min: number; max: number };
    heightRange: { min: string; max: string };
    education: string;
    occupation: string;
    familyType: string;
    location: string;
  };
  createdAt: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [matches, setMatches] = useState<Profile[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    ageMin: '',
    ageMax: '',
    education: '',
    occupation: ''
  });

  const fetchProfiles = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.ageMin) queryParams.append('ageMin', filters.ageMin);
      if (filters.ageMax) queryParams.append('ageMax', filters.ageMax);
      if (filters.education) queryParams.append('education', filters.education);
      if (filters.occupation) queryParams.append('occupation', filters.occupation);

      const response = await fetch(`/api/profiles?${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setProfiles(data.profiles || []);
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }
    fetchProfiles();
  }, [session, status, router, fetchProfiles]);

  const findMatches = async (profileId: string) => {
    setMatchesLoading(true);
    try {
      const response = await fetch(`/api/profiles/${profileId}/matches`);
      if (response.ok) {
        const data = await response.json();
        setMatches(data.matches || []);
      }
    } catch (error) {
      console.error('Error finding matches:', error);
    } finally {
      setMatchesLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    setLoading(true);
    fetchProfiles();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      ageMin: '',
      ageMax: '',
      education: '',
      occupation: ''
    });
    setLoading(true);
    fetchProfiles();
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-First Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-3 py-4 sm:px-6 lg:px-8 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm sm:text-lg">💕</span>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-black bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">PerfectPair Admin</h1>
                <p className="text-xs sm:text-sm text-gray-600">Manage profiles and find matches</p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-4">
              <span className="text-xs sm:text-sm text-gray-600 truncate">Welcome, {session.user?.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 sm:px-4 rounded-lg transition-colors text-sm touch-manipulation"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 py-4 sm:px-6 lg:px-8 sm:py-8">
        {/* Mobile-First Filters */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Search & Filters</h2>
          <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-4">
            <input
              type="text"
              name="search"
              placeholder="Search by name..."
              value={filters.search}
              onChange={handleFilterChange}
              className="px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 touch-manipulation"
            />
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <input
                type="number"
                name="ageMin"
                placeholder="Min Age"
                value={filters.ageMin}
                onChange={handleFilterChange}
                className="px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 touch-manipulation"
              />
              <input
                type="number"
                name="ageMax"
                placeholder="Max Age"
                value={filters.ageMax}
                onChange={handleFilterChange}
                className="px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 touch-manipulation"
              />
            </div>
            <input
              type="text"
              name="education"
              placeholder="Education"
              value={filters.education}
              onChange={handleFilterChange}
              className="px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 touch-manipulation"
            />
            <input
              type="text"
              name="occupation"
              placeholder="Occupation"
              value={filters.occupation}
              onChange={handleFilterChange}
              className="px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 touch-manipulation"
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={applyFilters}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-purple-600">{profiles.length}</div>
            <div className="text-gray-600">Total Profiles</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">{profiles.filter(p => p.age >= 18 && p.age <= 25).length}</div>
            <div className="text-gray-600">Young (18-25)</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">{profiles.filter(p => p.age >= 26 && p.age <= 35).length}</div>
            <div className="text-gray-600">Adults (26-35)</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-orange-600">{profiles.filter(p => p.age > 35).length}</div>
            <div className="text-gray-600">Mature (35+)</div>
          </div>
        </div>

        {/* Profiles Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">All Profiles</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading profiles...</p>
            </div>
          ) : profiles.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No profiles found.</p>
              <Link href="/form" className="text-purple-600 hover:text-purple-500 mt-2 inline-block">
                Create the first profile →
              </Link>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block md:hidden">
                <div className="divide-y divide-gray-200">
                  {profiles.map((profile) => (
                    <div key={profile._id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {profile.photoUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={profile.photoUrl}
                              alt={`${profile.name}'s photo`}
                              className="w-12 h-12 object-cover rounded-full border-2 border-gray-200"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-gray-500 text-sm">👤</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900 truncate">{profile.name}</p>
                              <p className="text-xs text-gray-500">Age: {profile.age} • {profile.education}</p>
                              <p className="text-xs text-gray-500">{profile.occupation}</p>
                            </div>
                            <div className="flex flex-col space-y-1">
                              <button
                                onClick={() => setSelectedProfile(profile)}
                                className="text-purple-600 hover:text-purple-900 text-xs font-medium px-2 py-1 rounded border border-purple-200 hover:bg-purple-50 touch-manipulation"
                              >
                                View
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedProfile(profile);
                                  findMatches(profile._id);
                                }}
                                className="text-pink-600 hover:text-pink-900 text-xs font-medium px-2 py-1 rounded border border-pink-200 hover:bg-pink-50 touch-manipulation"
                              >
                                Match
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Education</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupation</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {profiles.map((profile) => (
                    <tr key={profile._id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          {profile.photoUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={profile.photoUrl}
                              alt={`${profile.name}'s photo`}
                              className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full border-2 border-gray-200"
                            />
                          ) : (
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-gray-500 text-xs sm:text-sm">👤</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{profile.name}</div>
                          <div className="text-xs sm:text-sm text-gray-500">s/o {profile.fatherName}</div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900">{profile.age}</td>
                      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900">{profile.education}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{profile.occupation}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{profile.contactNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => setSelectedProfile(profile)}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProfile(profile);
                            findMatches(profile._id);
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          Find Matches
                        </button>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Profile Detail Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Profile Details</h2>
                <button
                  onClick={() => {
                    setSelectedProfile(null);
                    setMatches([]);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Photo and Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  
                  {/* Profile Photo */}
                  {selectedProfile.photoUrl && (
                    <div className="flex justify-center mb-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedProfile.photoUrl}
                        alt={`${selectedProfile.name}'s profile`}
                        className="w-32 h-32 object-cover rounded-full border-4 border-purple-200 shadow-lg"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedProfile.name}</p>
                    <p><span className="font-medium">Father&apos;s Name:</span> {selectedProfile.fatherName}</p>
                    <p><span className="font-medium">Age:</span> {selectedProfile.age}</p>
                    <p><span className="font-medium">Height:</span> {selectedProfile.height}</p>
                    <p><span className="font-medium">Weight:</span> {selectedProfile.weight}</p>
                    <p><span className="font-medium">Complexion:</span> {selectedProfile.color}</p>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Education:</span> {selectedProfile.education}</p>
                    <p><span className="font-medium">Occupation:</span> {selectedProfile.occupation}</p>
                    <p><span className="font-medium">Income:</span> {selectedProfile.income}</p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Contact Number:</span> {selectedProfile.contactNumber}</p>
                    <p><span className="font-medium">Address:</span> {selectedProfile.address}</p>
                  </div>
                </div>

                {/* Family Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Family Details</h3>
                  <p>{selectedProfile.familyDetails || 'Not provided'}</p>
                </div>

                {/* Requirements */}
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Partner Requirements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p><span className="font-medium">Age Range:</span> {selectedProfile.requirements.ageRange.min} - {selectedProfile.requirements.ageRange.max}</p>
                    <p><span className="font-medium">Height Range:</span> {selectedProfile.requirements.heightRange.min} - {selectedProfile.requirements.heightRange.max}</p>
                    <p><span className="font-medium">Education:</span> {selectedProfile.requirements.education || 'Any'}</p>
                    <p><span className="font-medium">Occupation:</span> {selectedProfile.requirements.occupation || 'Any'}</p>
                    <p><span className="font-medium">Family Type:</span> {selectedProfile.requirements.familyType || 'Any'}</p>
                    <p><span className="font-medium">Location:</span> {selectedProfile.requirements.location || 'Any'}</p>
                  </div>
                </div>
              </div>

              {/* Matches Section */}
              {matches.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Potential Matches ({matches.length})
                  </h3>
                  <div className="space-y-4 max-h-60 overflow-y-auto">
                    {matches.map((match) => (
                      <div key={match._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{match.name}</p>
                          <p className="text-sm text-gray-600">
                            {match.age} years, {match.education}, {match.occupation}
                          </p>
                          <p className="text-sm text-gray-600">{match.contactNumber}</p>
                        </div>
                        <div className="text-sm text-gray-500">
                          Height: {match.height}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchesLoading && (
                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Finding matches...</p>
                </div>
              )}

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => findMatches(selectedProfile._id)}
                  disabled={matchesLoading}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {matchesLoading ? 'Finding...' : 'Find Matches'}
                </button>
                <button
                  onClick={() => {
                    setSelectedProfile(null);
                    setMatches([]);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
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