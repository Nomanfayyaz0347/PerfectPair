'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  address: string;
  contactNumber: string;
  photoUrl?: string;
  familyDetails: string;
  status?: 'Active' | 'Matched' | 'Engaged' | 'Married' | 'Inactive';
  matchedWith?: string;
  matchedDate?: string;
  sharedCount?: number;
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

function MatchesPageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const profileId = searchParams.get('id');
  const profileName = searchParams.get('name');

  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [matches, setMatches] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<Profile | null>(null);

  const fetchMatches = useCallback(async () => {
    if (!profileId) return;
    
    setLoading(true);
    try {
      // Fetch current profile details
      const profileResponse = await fetch(`/api/profiles?id=${profileId}`);
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        if (profileData.profiles && profileData.profiles.length > 0) {
          setCurrentProfile(profileData.profiles[0]);
        }
      }

      // Fetch matches
      const matchesResponse = await fetch(`/api/profiles/${profileId}/matches`);
      if (matchesResponse.ok) {
        const matchesData = await matchesResponse.json();
        setMatches(matchesData.matches || []);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  }, [profileId]);

  const shareOnWhatsApp = async (profile: Profile) => {
    const message = `🌟 *Perfect Match Found!* 🌟

👤 *Name:* ${profile.name}
👨‍👧 *Father's Name:* ${profile.fatherName}
🎂 *Age:* ${profile.age} years
📏 *Height:* ${profile.height}
⚖️ *Weight:* ${profile.weight}
🎨 *Complexion:* ${profile.color}

📚 *Education:* ${profile.education}
💼 *Occupation:* ${profile.occupation}
💰 *Income:* ${profile.income}
📍 *Address:* ${profile.address}

👨‍👩‍👧‍👦 *Family Details:*
${profile.familyDetails}

*Requirements:*
• Age: ${profile.requirements.ageRange.min}-${profile.requirements.ageRange.max} years
• Height: ${profile.requirements.heightRange.min}-${profile.requirements.heightRange.max}
• Education: ${profile.requirements.education}
• Occupation: ${profile.requirements.occupation}
• Family Type: ${profile.requirements.familyType}
• Location: ${profile.requirements.location}

✨ *This profile has been matched through our compatibility system!*

${profile.photoUrl ? `\n📸 ${profile.photoUrl}` : ''}
📞 *For contact details, please reach out to PerfectPair Marriage Bureau*

_Shared from PerfectPair - Marriage Bureau System_`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;
    
    // Update share count in database instead of localStorage
    if (currentProfile?._id) {
      try {
        const response = await fetch(`/api/profiles/${currentProfile._id}/share`, {
          method: 'POST',
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('✅ Share count updated:', result.sharedCount);
          // Refresh the profile to get updated count
          fetchMatches();
        } else {
          console.error('❌ Failed to update share count');
        }
      } catch (error) {
        console.error('❌ Error updating share count:', error);
      }
    }
    
    window.open(whatsappUrl, '_blank');
  };

  const shareAllMatches = async () => {
    if (matches.length === 0) return;

    const message = `🌟 *${matches.length} Perfect Matches Found for ${profileName || currentProfile?.name}!* 🌟

${matches.map((match, index) => `
*${index + 1}. ${match.name}*
👨‍👧 Father: ${match.fatherName}
🎂 Age: ${match.age} years | 📏 Height: ${match.height}
📚 Education: ${match.education}
💼 Occupation: ${match.occupation}
📍 ${match.address}
${match.photoUrl ? `📸 ${match.photoUrl}` : ''}
`).join('\n')}

✨ *All profiles have been matched through our compatibility system!*

📞 *For contact details of any profile, please reach out to PerfectPair Marriage Bureau*

_Shared from PerfectPair - Marriage Bureau System_`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;
    
    // Update share count in database for bulk share
    if (currentProfile?._id) {
      try {
        // Make multiple API calls to increment count by matches.length
        const sharePromises = Array.from({ length: matches.length }, () =>
          fetch(`/api/profiles/${currentProfile._id}/share`, {
            method: 'POST',
          })
        );
        
        const responses = await Promise.all(sharePromises);
        const successCount = responses.filter(r => r.ok).length;
        
        console.log(`✅ Bulk share: ${successCount}/${matches.length} counts updated`);
        
        // Refresh the profile to get updated count
        if (successCount > 0) {
          fetchMatches();
        }
      } catch (error) {
        console.error('❌ Error updating bulk share count:', error);
      }
    }
    
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }
    
    if (!profileId) {
      router.push('/admin');
      return;
    }

    fetchMatches();
  }, [session, status, router, profileId, fetchMatches]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100/50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100/50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 sm:py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/admin"
              className="text-emerald-600 hover:text-emerald-700 flex items-center space-x-1 sm:space-x-2 flex-shrink-0"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-light text-sm sm:text-base hidden sm:inline">Back to Dashboard</span>
              <span className="font-light text-sm sm:hidden">Back</span>
            </Link>
            
            <div className="flex items-center space-x-3 min-w-0 flex-1 justify-end">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                <span className="text-white text-lg">💕</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl text-gray-900 heading tracking-wide truncate">
                  Matches for {profileName || 'Profile'}
                </h1>
                <p className="text-xs sm:text-sm font-light text-gray-600 tracking-wide">
                  Compatible profiles found
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 py-3 sm:px-6 lg:px-8 sm:py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-light">Finding matches...</p>
          </div>
        ) : (
          <>
            {/* Current Profile - Enhanced Design */}
            {currentProfile && (
              <div className={`bg-white border-2 border-emerald-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden mb-6 ${(currentProfile.status && currentProfile.status !== 'Active') ? 'opacity-40' : 'opacity-100'}`}>
                {/* Compact Header */}
                <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 px-3 py-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-white font-medium text-xs">👤 Current Profile</h2>
                    <span className="text-white text-xs">{matches.length} Matches</span>
                  </div>
                </div>
                
                {/* Compact Profile Section */}
                <div className="p-3">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="relative">
                      {currentProfile.photoUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={currentProfile.photoUrl}
                          alt={`${currentProfile.name}'s photo`}
                          className="w-12 h-12 object-cover rounded-full border-2 border-emerald-200"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center border-2 border-emerald-200">
                          <span className="text-emerald-600 text-sm">👤</span>
                        </div>
                      )}

                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-sm font-semibold text-gray-900">{currentProfile.name}</h3>
                        <span className={`text-sm font-medium ${
                          currentProfile.status === 'Active' ? 'text-green-500' :
                          currentProfile.status === 'Matched' ? 'text-blue-500' :
                          currentProfile.status === 'Engaged' ? 'text-purple-500' :
                          currentProfile.status === 'Married' ? 'text-pink-500' :
                          currentProfile.status === 'Inactive' ? 'text-gray-500' :
                          'text-green-500'
                        }`}>
                          {currentProfile.status || 'Active'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{currentProfile.age} years • {currentProfile.occupation}</p>
                    </div>
                  </div>


                  
                  {/* Compact Stats */}
                  <div className="flex justify-between items-center mb-3 text-xs">
                    <div className="bg-emerald-50 rounded px-2 py-1 border border-emerald-100">
                      <span className="text-emerald-600 font-medium">Matches: </span>
                      <span className="text-emerald-700 font-semibold">{matches.length}</span>
                    </div>
                    <div className="bg-teal-50 rounded px-2 py-1 border border-teal-100">
                      <span className="text-teal-600 font-medium">Shared: </span>
                      <span className="text-teal-700 font-semibold">
                        {currentProfile?.sharedCount || 0}
                      </span>
                    </div>
                  </div>

                  {/* Looking For */}
                  <div className="bg-emerald-50 border border-emerald-100 rounded p-2 mb-2">
                    <div className="text-xs text-emerald-600 font-medium mb-1">Looking For:</div>
                    <div className="text-xs text-gray-700">
                      🎯 {currentProfile.requirements.ageRange.min}-{currentProfile.requirements.ageRange.max} years • 🎓 {currentProfile.requirements.education}
                    </div>
                  </div>

                  {/* Matches Preview */}
                  {matches.length > 0 && (
                    <div className="bg-blue-50 border border-blue-100 rounded p-2">
                      <div className="text-xs text-blue-600 font-medium mb-2">Found Matches:</div>
                      <div className="space-y-2 max-h-24 overflow-y-auto">
                        {matches.slice(0, 3).map((match, index) => {
                          // Calculate matching criteria
                          const matchingCriteria = [];
                          if (currentProfile.requirements.ageRange.min <= match.age && match.age <= currentProfile.requirements.ageRange.max) {
                            matchingCriteria.push('Age');
                          }
                          if (currentProfile.requirements.education === match.education) {
                            matchingCriteria.push('Education');
                          }
                          if (currentProfile.requirements.location === match.address) {
                            matchingCriteria.push('Location');
                          }
                          
                          return (
                            <div key={match._id} className="bg-white border border-blue-200 rounded p-1.5">
                              <div className="flex items-center space-x-2 text-xs mb-1">
                                <div className="w-4 h-4 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-blue-600 text-xs font-medium">{index + 1}</span>
                                </div>
                                <div className="flex-1">
                                  <span className="text-gray-800 font-medium">{match.name}</span>
                                  <span className="text-gray-500 ml-1">({match.age}y)</span>
                                </div>
                              </div>
                              <div className="text-xs text-green-600 ml-6">
                                ✓ Matches: {matchingCriteria.length > 0 ? matchingCriteria.join(', ') : 'Basic criteria'}
                              </div>
                            </div>
                          );
                        })}
                        {matches.length > 3 && (
                          <div className="text-xs text-blue-500 font-medium bg-white rounded p-1 text-center">
                            +{matches.length - 3} more matches available
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Share All Button */}
            {matches.length > 0 && (
              <div className="mb-6 flex justify-center">
                <button
                  onClick={shareAllMatches}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-3 font-medium"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a11.952 11.952 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                  </svg>
                  <span>Share All {matches.length} Matches on WhatsApp</span>
                </button>
              </div>
            )}

            {/* Matches Grid */}
            {matches.length === 0 ? (
              <div className="text-center py-16 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <span className="text-gray-400 text-3xl">💔</span>
                </div>
                <h3 className="text-xl text-gray-900 heading mb-3">No matches found</h3>
                <p className="text-sm text-gray-600 font-light max-w-md mx-auto">
                  Try adjusting the requirements or add more profiles to the database
                </p>
                <Link 
                  href="/admin"
                  className="inline-block mt-6 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg transition-colors font-medium"
                >
                  Back to Dashboard
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map((match) => (
                  <div 
                    key={match._id} 
                    className={`bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden ${(match.status && match.status !== 'Active') ? 'opacity-40' : 'opacity-100'}`}
                  >
                    {/* Profile Section - Same as admin page */}
                    <div className="p-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="relative">
                          {match.photoUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={match.photoUrl}
                              alt={`${match.name}'s photo`}
                              className="w-14 h-14 object-cover rounded-full border-2 border-gray-200"
                            />
                          ) : (
                            <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-300">
                              <span className="text-gray-500 text-lg">👤</span>
                            </div>
                          )}
                          {/* Perfect Match badge */}
                          <div className="absolute -top-1 -left-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">✨</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">{match.name}</h3>
                            <span className={`text-sm font-medium ${
                              match.status === 'Active' ? 'text-green-500' :
                              match.status === 'Matched' ? 'text-blue-500' :
                              match.status === 'Engaged' ? 'text-purple-500' :
                              match.status === 'Married' ? 'text-pink-500' :
                              match.status === 'Inactive' ? 'text-gray-500' :
                              'text-green-500'
                            }`}>
                              {match.status || 'Active'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">s/o {match.fatherName}</p>
                        </div>
                      </div>

                      {/* Info Grid - Same as admin page */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div>
                          <span className="text-sm font-medium text-emerald-600">Age:</span>
                          <span className="ml-1 text-sm text-gray-900">{match.age}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-emerald-600">Height:</span>
                          <span className="ml-1 text-sm text-gray-900">{match.height}</span>
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        <span className="text-sm font-medium text-emerald-600">Education:</span>
                        <span className="ml-1 text-sm text-gray-900">{match.education}</span>
                      </div>
                      
                      <div className="mb-2">
                        <span className="text-sm font-medium text-emerald-600">Occupation:</span>
                        <span className="ml-1 text-sm text-gray-900">{match.occupation}</span>
                      </div>
                      
                      <div className="mb-4">
                        <span className="text-sm font-medium text-emerald-600">Contact:</span>
                        <span className="ml-1 text-sm text-gray-900">{match.contactNumber}</span>
                      </div>
                      
                      {/* Stats - Same as admin page */}
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <span className="text-sm font-medium text-emerald-600">Compatible:</span>
                          <span className="ml-1 text-sm text-gray-900">Perfect Match</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-purple-600">Match Score:</span>
                          <span className="ml-1 text-sm text-gray-900">95%</span>
                        </div>
                      </div>

                      {/* Buttons Row - Same as admin page */}
                      <div className="flex space-x-2 mb-3">
                        {/* View Details Button */}
                        <button
                          onClick={() => setSelectedMatch(match)}
                          className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-medium py-2 rounded-md transition-colors border border-emerald-200"
                        >
                          View Details
                        </button>

                        {/* WhatsApp Button */}
                        <button
                          onClick={() => shareOnWhatsApp(match)}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs font-medium py-2 rounded-md transition-colors flex items-center justify-center space-x-1"
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a11.952 11.952 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                          </svg>
                          <span>WhatsApp</span>
                        </button>
                      </div>

                      {/* Match Status */}
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">Match Status:</label>
                        <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-emerald-50 text-emerald-700 font-medium">
                          ✨ Perfect Match Found
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Match Profile Detail Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white/95 backdrop-blur-sm border border-gray-100 rounded-lg max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-3 sm:p-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {selectedMatch.photoUrl && (
                    <div className="flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedMatch.photoUrl}
                        alt={`${selectedMatch.name}'s profile`}
                        className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-full border-2 border-emerald-300 shadow-sm"
                      />
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg sm:text-xl text-gray-900 heading">{selectedMatch.name}</h2>
                    <p className="text-sm text-gray-600 font-light">{selectedMatch.age} years • {selectedMatch.occupation}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMatch(null)}
                  className="text-gray-400 hover:text-gray-600 p-1 flex-shrink-0"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-3 sm:p-6 space-y-4">
              {/* Personal Info */}
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                <h3 className="text-base text-gray-800 heading mb-2 sm:mb-3">👤 Personal Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 heading">Father&apos;s Name:</span>
                    <span className="text-sm text-gray-900 font-light">{selectedMatch.fatherName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 heading">Height:</span>
                    <span className="text-sm text-gray-900 font-light">{selectedMatch.height}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 heading">Weight:</span>
                    <span className="text-sm text-gray-900 font-light">{selectedMatch.weight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 heading">Complexion:</span>
                    <span className="text-sm text-gray-900 font-light">{selectedMatch.color}</span>
                  </div>
                </div>
              </div>

              {/* Professional Info */}
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                <h3 className="text-base text-gray-800 heading mb-2 sm:mb-3">💼 Professional Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 heading">Education:</span>
                    <span className="text-sm text-gray-900 font-light">{selectedMatch.education}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 heading">Income:</span>
                    <span className="text-sm text-gray-900 font-light">{selectedMatch.income}</span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                <h3 className="text-base text-gray-800 heading mb-2 sm:mb-3">📞 Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 heading">Phone:</span>
                    <span className="text-sm text-gray-900 font-light">{selectedMatch.contactNumber}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-gray-600 heading">Address:</span>
                    <span className="text-sm text-gray-900 font-light text-right max-w-xs">{selectedMatch.address}</span>
                  </div>
                </div>
              </div>

              {/* Family Details */}
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                <h3 className="text-base text-gray-800 heading mb-2 sm:mb-3">👨‍👩‍👧‍👦 Family Details</h3>
                <p className="text-sm text-gray-900 font-light leading-relaxed">
                  {selectedMatch.familyDetails || 'No family details provided'}
                </p>
              </div>

              {/* Share Button */}
              <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-3 sm:p-4 rounded-b-lg">
                <button
                  onClick={() => shareOnWhatsApp(selectedMatch)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-3 rounded-lg transition-all duration-200 shadow-sm flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a11.952 11.952 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                  </svg>
                  <span>Share Profile on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MatchesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading matches...</p>
        </div>
      </div>
    }>
      <MatchesPageContent />
    </Suspense>
  );
}