'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

interface Profile {
  _id: string;
  id?: string;
  name: string;
  fatherName: string;
  gender: 'Male' | 'Female';
  age: number;
  height: string;
  weight: string;
  color: string;
  cast: string;
  maslak?: string;
  maritalStatus?: 'Single' | 'Divorced' | 'Widowed' | 'Separated';
  motherTongue?: string;
  belongs?: string;
  education: string;
  occupation: string;
  income: string;
  familyDetails: string;
  houseType?: 'Own House' | 'Rent' | 'Family House' | 'Apartment';
  country?: string;
  city?: string;
  address?: string; // Legacy field
  contactNumber: string;
  email?: string;
  photoUrl?: string;
  status?: 'Active' | 'Matched' | 'Engaged' | 'Married' | 'Inactive';
  matchedWith?: string; // ID of the matched profile
  matchedDate?: string;
  matchScore?: string; // Match percentage score
  matchedFields?: string[]; // Fields that matched the requirements
  sharedCount?: number; // Database-tracked shared count
  requirements: {
    ageRange: { min: number; max: number };
    heightRange: { min: string; max: string };
    education: string;
    occupation: string;
    familyType: string;
    location: string[] | string;
    cast: string[] | string;
    maslak?: string[];
    maritalStatus?: string[];
    motherTongue?: string[];
    belongs?: string[];
    houseType?: string[];
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
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [profileMatches, setProfileMatches] = useState<Record<string, number>>({});
  
  // Edit Profile States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [editData, setEditData] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [editMessage, setEditMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Delete Profile States
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null);

  const [filters, setFilters] = useState({
    search: '',
    ageMin: '',
    ageMax: '',
    education: '',
    occupation: ''
  });

  // Helper function to safely get profile ID - handles both MongoDB and in-memory profiles
  const getProfileId = (profile: Profile): string => {
    // MongoDB profiles have _id as ObjectId converted to string
    // In-memory profiles have _id as string  
    return profile._id || profile.id || '';
  };

  // Helper function to get shared count from profile data (now from database)
  const getSharedCount = (profile: Profile): number => {
    // Use sharedCount from database, fallback to 0
    return profile.sharedCount || 0;
  };



  const updateProfileStatus = async (profileId: string, status: string, matchedWithId?: string) => {
    console.log('🚀 updateProfileStatus CALLED with:', { profileId, status, matchedWithId });
    console.log('🚀 Profile ID type:', typeof profileId);
    console.log('🚀 Profile ID length:', profileId?.length);
    console.log('🚀 Profile ID raw:', JSON.stringify(profileId));
    
    if (!profileId || profileId.trim() === '') {
      console.log('❌ Invalid profile ID detected');
      alert('Invalid profile ID');
      return;
    }
    
    try {
      const requestBody = { 
        status, 
        matchedWith: matchedWithId,
        matchedDate: new Date().toISOString()
      };
      
      console.log('Request body:', requestBody);
      
      const apiUrl = `/api/profiles/${encodeURIComponent(profileId)}/status`;
      console.log('API URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      // Get raw response text first
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      if (response.ok) {
        try {
          const responseData = responseText ? JSON.parse(responseText) : {};
          console.log('Profile updated successfully:', responseData);
          
          // Refresh profiles to show updated status
          await fetchProfiles();
          
          // Show success message with additional info for non-Active status
          if (status !== 'Active') {
            alert(`Profile status updated to ${status} successfully!\n\nNote: Profile has been removed from matches as status is no longer Active.`);
          } else {
            alert(`Profile status updated to ${status} successfully!`);
          }
        } catch (parseError) {
          console.error('Failed to parse success response:', parseError);
          if (status !== 'Active') {
            alert(`Profile status updated to ${status} successfully!\n\nNote: Profile has been removed from matches as status is no longer Active.`);
          } else {
            alert(`Profile status updated to ${status} successfully!`);
          }
          await fetchProfiles();
        }
      } else {
        try {
          const errorData = responseText ? JSON.parse(responseText) : {};
          console.error('API Error Response:', errorData);
          alert(`Failed to update profile status: ${errorData.error || 'Unknown error'}`);
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          alert(`Failed to update profile status. Server error.`);
        }
      }
    } catch (error) {
      console.error('Error updating profile status:', error);
      alert(`Error updating profile status: ${error}`);
    }
  };

  const fetchProfiles = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams();
      
      // Set a high limit to get all profiles
      queryParams.append('limit', '1000');
      
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.ageMin) queryParams.append('ageMin', filters.ageMin);
      if (filters.ageMax) queryParams.append('ageMax', filters.ageMax);
      if (filters.education) queryParams.append('education', filters.education);
      if (filters.occupation) queryParams.append('occupation', filters.occupation);

      const response = await fetch(`/api/profiles?${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        const fetchedProfiles = data.profiles || [];
        console.log('🔍 Fetched profiles sample (first profile):', fetchedProfiles[0]);
        console.log('🔍 Profile ID structure check:', {
          hasId: !!fetchedProfiles[0]?.id,
          hasUnderscoreId: !!fetchedProfiles[0]?._id,
          idValue: fetchedProfiles[0]?.id,
          underscoreIdValue: fetchedProfiles[0]?._id,
          fullProfile: fetchedProfiles[0]
        });
        setProfiles(fetchedProfiles);
        
        // Sync MongoDB profiles to in-memory storage for status updates
        try {
          const { syncAllProfiles } = await import('@/lib/profileSync');
          syncAllProfiles(fetchedProfiles);
        } catch (syncError) {
          console.log('Profile sync failed:', syncError);
        }
        
        // Show profiles immediately, then fetch matches in parallel
        setLoading(false); // Show profiles first
        
        // Fetch matches count in parallel for Active profiles
        const matchCounts: Record<string, number> = {};
        const matchPromises = fetchedProfiles.map(async (profile: Profile) => {
          try {
            const profileId = getProfileId(profile);
            
            // Only fetch matches for Active profiles
            if (profile.status === 'Active' || !profile.status) {
              const response = await fetch(`/api/profiles/${profileId}/matches`);
              if (response.ok) {
                const matchData = await response.json();
                return { profileId, count: matchData.matches?.length || 0 };
              }
            }
            return { profileId, count: 0 };
          } catch {
            return { profileId: getProfileId(profile), count: 0 };
          }
        });

        // Wait for all match requests to complete in parallel
        const matchResults = await Promise.all(matchPromises);
        matchResults.forEach(({ profileId, count }) => {
          matchCounts[profileId] = count;
        });
        setProfileMatches(matchCounts);
        
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
      setLoading(false); // Set loading false on error
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

  // Edit Profile Functions
  const handleEditProfile = (profile: Profile) => {
    setEditingProfile(profile);
    setEditData(profile);
    setIsEditingProfile(true);
    setEditMessage(null);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (!editData) return;
    
    if (name.startsWith('requirements.')) {
      const fieldName = name.split('.')[1] as keyof Profile['requirements'];
      
      if (fieldName === 'ageRange') {
        const [min, max] = value.split('-').map(v => parseInt(v.trim()));
        setEditData({
          ...editData,
          requirements: {
            ...editData.requirements,
            ageRange: { min: min || 18, max: max || 35 }
          }
        });
      } else if (fieldName === 'heightRange') {
        const [min, max] = value.split('-').map(v => v.trim());
        setEditData({
          ...editData,
          requirements: {
            ...editData.requirements,
            heightRange: { min: min || '5.0', max: max || '6.0' }
          }
        });
      } else if (fieldName === 'location') {
        // Handle comma-separated location values
        const locationArray = value.split(',').map(item => item.trim()).filter(item => item);
        setEditData({
          ...editData,
          requirements: {
            ...editData.requirements,
            location: locationArray
          }
        });
      } else {
        setEditData({
          ...editData,
          requirements: {
            ...editData.requirements,
            [fieldName]: value
          }
        });
      }
    } else {
      setEditData({
        ...editData,
        [name]: name === 'age' ? parseInt(value) || 0 : value
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!editData || !editingProfile) return;
    
    setSaving(true);
    setEditMessage(null);
    
    try {
      const response = await fetch('/api/profiles', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId: getProfileId(editingProfile),
          ...editData
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Update local profiles state
        setProfiles(prev => prev.map(p => 
          getProfileId(p) === getProfileId(editingProfile) ? editData : p
        ));
        setIsEditingProfile(false);
        setEditMessage({ type: 'success', text: 'Profile updated successfully!' });
        
        // Clear edit state after 2 seconds
        setTimeout(() => {
          setEditMessage(null);
          setEditingProfile(null);
          setEditData(null);
        }, 2000);
      } else {
        setEditMessage({ type: 'error', text: data.error || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setEditMessage({ type: 'error', text: 'Error updating profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setEditingProfile(null);
    setEditData(null);
    setEditMessage(null);
  };

  // Delete Profile Functions
  const handleDeleteProfile = (profile: Profile) => {
    setProfileToDelete(profile);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!profileToDelete) return;
    
    setIsDeleting(true);
    try {
      const profileId = getProfileId(profileToDelete);
      const response = await fetch(`/api/profiles/${profileId}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Remove profile from the list
        setProfiles(prev => prev.filter(p => getProfileId(p) !== profileId));
        setEditMessage({ type: 'success', text: `Profile ${profileToDelete.name} deleted successfully!` });
        
        // Close modals and reset states
        setShowDeleteConfirm(false);
        setProfileToDelete(null);
        
        // If we were editing this profile, close the edit modal too
        if (editingProfile && getProfileId(editingProfile) === profileId) {
          handleCancelEdit();
        }
      } else {
        const errorData = await response.json();
        setEditMessage({ type: 'error', text: errorData.error || 'Failed to delete profile' });
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      setEditMessage({ type: 'error', text: 'Error deleting profile' });
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setProfileToDelete(null);
  };

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
      {/* Mobile-First Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 sm:py-6">
          {/* Mobile Layout */}
          <div className="sm:hidden">
            {/* Top Row: Logo + Title + Sign Out */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white text-sm">💕</span>
                </div>
                <div>
                  <h1 className="text-base text-gray-900 heading">PerfectPair Admin</h1>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-1.5 rounded-full transition-all text-xs font-light touch-manipulation shadow-md"
              >
                Sign Out
              </button>
            </div>

            {/* Bottom Row: Subtitle + Welcome */}
            <div className="flex items-center justify-between">
              <p className="text-xs font-light text-gray-600">Manage profiles and find matches</p>
              <span className="text-xs font-light text-gray-500">Welcome, {session.user?.name}</span>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex sm:justify-between sm:items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white text-lg">💕</span>
              </div>
              <div>
                <h1 className="text-2xl text-gray-900 heading tracking-wide">PerfectPair Admin</h1>
                <p className="text-sm font-light text-gray-600 tracking-wide">Manage profiles and find matches</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-light text-gray-600 tracking-wide">Welcome, {session.user?.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-full transition-all text-sm font-light tracking-wide touch-manipulation shadow-md hover:shadow-lg"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 py-4 sm:px-6 lg:px-8 sm:py-8">
        {/* Mobile-First Filters */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            <h2 className="text-base sm:text-lg heading">Search & Filters</h2>
            <div className="text-emerald-600 transition-transform duration-200" style={{ transform: isFiltersOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {isFiltersOpen && (
            <div className="mt-4">
              <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-4">
            <input
              type="text"
              name="search"
              placeholder="Search by name..."
              value={filters.search}
              onChange={handleFilterChange}
              className="px-3 py-2 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 touch-manipulation font-light"
            />
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <input
                type="number"
                name="ageMin"
                placeholder="Min Age"
                value={filters.ageMin}
                onChange={handleFilterChange}
                className="px-3 py-2 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 touch-manipulation font-light"
              />
              <input
                type="number"
                name="ageMax"
                placeholder="Max Age"
                value={filters.ageMax}
                onChange={handleFilterChange}
                className="px-3 py-2 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 touch-manipulation font-light"
              />
            </div>
            <input
              type="text"
              name="education"
              placeholder="Education"
              value={filters.education}
              onChange={handleFilterChange}
              className="px-3 py-2 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 touch-manipulation font-light"
            />
            <input
              type="text"
              name="occupation"
              placeholder="Occupation"
              value={filters.occupation}
              onChange={handleFilterChange}
              className="px-3 py-2 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 touch-manipulation font-light"
            />
          </div>
          <div className="flex space-x-3">
            <button
              onClick={applyFilters}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-1.5 rounded-md transition-all font-light shadow-sm hover:shadow-md text-sm"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1.5 rounded-md transition-colors font-light text-sm"
            >
              Clear Filters
            </button>
          </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-md shadow-sm p-3 sm:p-4">
            <div className="text-lg sm:text-2xl text-emerald-600 heading">{profiles.length}</div>
            <div className="text-gray-600 font-light text-xs sm:text-sm">Total Profiles</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-md shadow-sm p-3 sm:p-4">
            <div className="text-lg sm:text-2xl text-teal-600 heading">{profiles.filter(p => p.age >= 18 && p.age <= 25).length}</div>
            <div className="text-gray-600 font-light text-xs sm:text-sm">Young (18-25)</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-md shadow-sm p-3 sm:p-4">
            <div className="text-lg sm:text-2xl text-emerald-500 heading">{profiles.filter(p => p.age >= 26 && p.age <= 35).length}</div>
            <div className="text-gray-600 font-light text-xs sm:text-sm">Adults (26-35)</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-md shadow-sm p-3 sm:p-4">
            <div className="text-lg sm:text-2xl text-teal-500 heading">{profiles.filter(p => p.age > 35).length}</div>
            <div className="text-gray-600 font-light text-xs sm:text-sm">Mature (35+)</div>
          </div>
        </div>

        {/* Profiles Table */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg heading">All Profiles</h2>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <div className="flex items-center justify-center space-x-1 mb-3">
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <p className="text-sm text-gray-600 font-light">Loading profiles...</p>
            </div>
          ) : profiles.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="font-light">No profiles found.</p>
              <Link href="/form" className="text-emerald-600 hover:text-emerald-500 mt-2 inline-block font-light">
                Create the first profile →
              </Link>
            </div>
          ) : (
            <>
              {/* Mobile Card View - Exact Attachment Design */}
              <div className="block md:hidden">
                <div className="space-y-3">
                  {profiles.map((profile) => (
                    <div key={getProfileId(profile)} className={`bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden ${(profile.status && profile.status !== 'Active') ? 'opacity-40' : 'opacity-100'}`}>
                      
                      {/* Profile Section - Exact like attachment */}
                      <div className="p-3">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="relative">
                            {profile.photoUrl ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={profile.photoUrl}
                                alt={`${profile.name}'s photo`}
                                className="w-14 h-14 object-cover rounded-full border-2 border-gray-200"
                              />
                            ) : (
                              <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-300">
                                <span className="text-gray-500 text-lg">👤</span>
                              </div>
                            )}
                            {/* Number badge - show matches count only for Active profiles */}
                            {(profile.status === 'Active' || !profile.status) && (
                              <div className="absolute -top-1 -left-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">{profileMatches[getProfileId(profile)] || 0}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <h3 className="text-lg font-semibold text-gray-900">{profile.name}</h3>
                              <span className={`text-sm font-medium ${
                                profile.status === 'Active' ? 'text-green-500' :
                                profile.status === 'Matched' ? 'text-blue-500' :
                                profile.status === 'Engaged' ? 'text-purple-500' :
                                profile.status === 'Married' ? 'text-pink-500' :
                                profile.status === 'Inactive' ? 'text-gray-500' :
                                'text-green-500'
                              }`}>
                                {profile.status || 'Active'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">s/o {profile.fatherName}</p>
                          </div>
                        </div>

                        {/* Info Grid - Exact like attachment */}
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-2 border-b border-gray-100 pb-2">
                          <div>
                            <span className="text-sm font-medium text-emerald-600">Age:</span>
                            <span className="ml-1 text-sm text-gray-900">{profile.age}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-emerald-600">Gender:</span>
                            <span className="ml-1 text-sm text-gray-900">{profile.gender}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-emerald-600">Height:</span>
                            <span className="ml-1 text-sm text-gray-900">{profile.height}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-emerald-600">Cast:</span>
                            <span className="ml-1 text-sm text-gray-900">{profile.cast}</span>
                          </div>
                        </div>
                        
                        <div className="mb-1 border-b border-gray-100 pb-1">
                          <span className="text-sm font-medium text-emerald-600">Education:</span>
                          <span className="ml-1 text-sm text-gray-900">{profile.education}</span>
                        </div>
                        
                        <div className="mb-1 border-b border-gray-100 pb-1">
                          <span className="text-sm font-medium text-emerald-600">Occupation:</span>
                          <span className="ml-1 text-sm text-gray-900">{profile.occupation}</span>
                        </div>
                        
                        <div className="mb-2 border-b border-gray-100 pb-1">
                          <span className="text-sm font-medium text-emerald-600">Contact:</span>
                          <span className="ml-1 text-sm text-gray-900">{profile.contactNumber}</span>
                        </div>
                        
                        {/* Stats - Exact like attachment */}
                        <div className="flex justify-between items-center mb-2 border-b border-gray-100 pb-2">
                          <div>
                            <span className="text-sm font-medium text-emerald-600">Matches:</span>
                            <span className="ml-1 text-sm text-gray-900">
                              {(profile.status === 'Active' || !profile.status) ? 
                                `${profileMatches[getProfileId(profile)] || 0} found` : 
                                'No matches (Inactive)'
                              }
                            </span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-purple-600">Shared:</span>
                            <span className="ml-1 text-sm text-gray-900">{getSharedCount(profile)} shared</span>
                          </div>
                        </div>

                        {/* Buttons Row - Three button layout */}
                        <div className="flex space-x-2 mb-1">
                          {/* View Details Button */}
                          <button
                            onClick={() => setSelectedProfile(profile)}
                            className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-medium py-2 rounded-md transition-colors border border-emerald-200"
                          >
                            View
                          </button>
                          
                          {/* Edit Profile Button */}
                          <button
                            onClick={() => handleEditProfile(profile)}
                            className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-medium py-2 rounded-md transition-colors border border-blue-200"
                          >
                            Edit
                          </button>

                          {/* View All Matches Button */}
                          <Link
                            href={`/matches?id=${getProfileId(profile)}&name=${encodeURIComponent(profile.name)}`}
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium py-2 text-center transition-colors rounded-md"
                          >
                            Matches
                          </Link>
                        </div>

                        {/* Status Dropdown - Moved to bottom */}
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">
                            {(profile.status && profile.status !== 'Active') ? 'Change Status' : 'Change Status:'}
                          </label>
                          <select 
                            value={profile.status || 'Active'}
                            onChange={(e) => {
                              const newStatus = e.target.value as 'Active' | 'Matched' | 'Engaged' | 'Married' | 'Inactive';
                              if (newStatus !== (profile.status || 'Active')) {
                                updateProfileStatus(getProfileId(profile), newStatus);
                              }
                            }}
                            className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 bg-white ${
                              (profile.status && profile.status !== 'Active') ? 'cursor-pointer' : ''
                            }`}
                          >
                            <option value="Active">🟢 Active</option>
                            <option value="Matched">🔵 Matched</option>
                            <option value="Engaged">🟣 Engaged</option>
                            <option value="Married">💍 Married</option>
                            <option value="Inactive">⚫ Inactive</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider font-light">Photo</th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider font-light">Name</th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider font-light">Age</th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider font-light">Education</th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider font-light">Occupation</th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider font-light">Status</th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider font-light">Shared</th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider font-light">Contact</th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider font-light">Actions</th>
                    </tr>
                  </thead>
                <tbody className="bg-white/50 divide-y divide-gray-200">
                  {profiles.map((profile) => (
                    <tr key={getProfileId(profile)} className={`hover:bg-gray-50/50 transition-all duration-300 ${
                      profile.status !== 'Active' ? 'opacity-60 bg-gray-50/30' : ''
                    }`}>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center relative">
                          {profile.photoUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={profile.photoUrl}
                              alt={`${profile.name}'s photo`}
                              className={`w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full border-2 transition-all duration-300 ${
                                profile.status === 'Active' ? 'border-gray-200' : 
                                profile.status === 'Matched' ? 'border-blue-200' :
                                profile.status === 'Engaged' ? 'border-purple-200' :
                                profile.status === 'Married' ? 'border-pink-200' :
                                'border-gray-400 grayscale opacity-70'
                              }`}
                            />
                          ) : (
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                              profile.status === 'Active' ? 'bg-gray-200' : 'bg-gray-300'
                            }`}>
                              <span className={`text-xs sm:text-sm ${
                                profile.status === 'Active' ? 'text-gray-500' : 'text-gray-600'
                              }`}>👤</span>
                            </div>
                          )}
                          
                          {/* Match Count Badge for Desktop - Only for Active profiles */}
                          {profileMatches[profile._id] !== undefined && (profile.status === 'Active' || !profile.status) && (
                            <div className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full min-w-[18px] h-4 flex items-center justify-center px-1 shadow-md">
                              {profileMatches[profile._id]}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="flex items-center gap-1 flex-wrap">
                            <div className={`text-sm heading transition-colors duration-300 ${
                              profile.status === 'Active' ? 'text-gray-900' : 'text-gray-600'
                            }`}>{profile.name}</div>
                            {profile.status !== 'Active' && (
                              <span className={`text-xs px-1 py-0.5 rounded text-white font-medium ${
                                profile.status === 'Matched' ? 'bg-blue-500' :
                                profile.status === 'Engaged' ? 'bg-purple-500' :
                                profile.status === 'Married' ? 'bg-pink-500' :
                                'bg-gray-500'
                              }`}>
                                {profile.status === 'Matched' ? 'M' :
                                 profile.status === 'Engaged' ? 'E' :
                                 profile.status === 'Married' ? '♥' :
                                 'I'}
                              </span>
                            )}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 font-light">s/o {profile.fatherName}</div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-light">{profile.age}</td>
                      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-light">{profile.education}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-light">{profile.occupation}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          profile.status === 'Active' ? 'bg-green-100 text-green-800' :
                          profile.status === 'Matched' ? 'bg-blue-100 text-blue-800' :
                          profile.status === 'Engaged' ? 'bg-purple-100 text-purple-800' :
                          profile.status === 'Married' ? 'bg-pink-100 text-pink-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {profile.status === 'Active' ? '🟢 Active' :
                           profile.status === 'Matched' ? '🔵 Matched' :
                           profile.status === 'Engaged' ? '🟣 Engaged' :
                           profile.status === 'Married' ? '💜 Married' :
                           '⚫ Inactive'}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {getSharedCount(profile)} shared
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-light">{profile.contactNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="space-y-2">
                          <button
                            onClick={() => setSelectedProfile(profile)}
                            className="block text-emerald-600 hover:text-emerald-900 font-light text-xs"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleEditProfile(profile)}
                            className="block text-blue-600 hover:text-blue-900 font-light text-xs"
                          >
                            Edit Profile
                          </button>
                          
                          {/* Status Dropdown for Desktop */}
                          <select
                            value={profile.status || 'Active'}
                            onChange={(e) => {
                              const newStatus = e.target.value as 'Active' | 'Matched' | 'Engaged' | 'Married' | 'Inactive';
                              if (newStatus !== (profile.status || 'Active')) {
                                const profileId = getProfileId(profile);
                                console.log('🔥 DESKTOP Status dropdown changed:', { 
                                  profileId, 
                                  profileObject: profile,
                                  from: profile.status || 'Active', 
                                  to: newStatus 
                                });
                                updateProfileStatus(profileId, newStatus);
                              }
                            }}
                            className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500 font-light"
                          >
                            <option value="Active">🟢 Active</option>
                            <option value="Matched">🔵 Matched</option>
                            <option value="Engaged">🟣 Engaged</option>
                            <option value="Married">💍 Married</option>
                            <option value="Inactive">⚫ Inactive</option>
                          </select>
                          
                          {profileMatches[profile._id] > 0 && (profile.status === 'Active' || !profile.status) && (
                            <Link
                              href={`/matches?id=${profile._id}&name=${encodeURIComponent(profile.name)}`}
                              className="text-purple-600 hover:text-purple-900 font-light block text-xs"
                            >
                              All ({profileMatches[profile._id]}) →
                            </Link>
                          )}
                        </div>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white/95 backdrop-blur-sm border border-gray-100 rounded-lg max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            {/* Header with Profile Photo and Name */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-3 sm:p-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  {/* Profile Photo in Header */}
                  {selectedProfile.photoUrl && (
                    <div className="flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedProfile.photoUrl}
                        alt={`${selectedProfile.name}'s profile`}
                        className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-full border-2 border-emerald-300 shadow-sm"
                      />
                    </div>
                  )}
                  {/* Name and Basic Info */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg sm:text-xl text-gray-900 heading">{selectedProfile.name}</h2>
                    </div>
                    <p className="text-sm text-gray-600 font-light">{selectedProfile.age} years • {selectedProfile.occupation}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedProfile(null);
                    setMatches([]);
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1 flex-shrink-0"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-3 sm:p-6">
              {/* Match Summary Card */}
              {profileMatches[selectedProfile._id] !== undefined && (
                <div className="mb-4 sm:mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">💕</span>
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base text-emerald-800 heading">Match Analysis</h3>
                        <p className="text-xs sm:text-sm text-emerald-600 font-light">
                          {(selectedProfile.status === 'Active' || !selectedProfile.status) ? 
                            `${profileMatches[selectedProfile._id]} compatible profiles found` :
                            'No matches available - Profile is Inactive'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-lg sm:text-xl text-emerald-700 heading">
                          {(selectedProfile.status === 'Active' || !selectedProfile.status) ? 
                            profileMatches[selectedProfile._id] : 
                            0
                          }
                        </div>
                        <div className="text-xs text-emerald-600 font-light">matches</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg sm:text-xl text-purple-700 heading">
                          {getSharedCount(selectedProfile)}
                        </div>
                        <div className="text-xs text-purple-600 font-light">shared</div>
                      </div>
                    </div>
                  </div>
                  {profileMatches[selectedProfile._id] > 0 && (selectedProfile.status === 'Active' || !selectedProfile.status) && (
                    <div className="mt-2 sm:mt-3">
                      <Link
                        href={`/matches?id=${selectedProfile._id}&name=${encodeURIComponent(selectedProfile.name)}`}
                        className="text-xs sm:text-sm bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-full transition-colors font-light inline-block"
                      >
                        View All Matches →
                      </Link>
                    </div>
                  )}
                </div>
              )}
              
              {/* 50-50 Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                
                {/* Left Side - Basic Info */}
                <div className="space-y-3 sm:space-y-4">

                  {/* Personal Information */}
                  {/* Personal Information */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                    <h3 className="text-base sm:text-lg text-gray-800 heading mb-2 sm:mb-3">👤 Personal Information</h3>
                    <div className="divide-y divide-gray-200">
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs sm:text-sm text-gray-600 heading">Name:</span>
                        <span className="text-xs sm:text-sm text-gray-900 font-medium">{selectedProfile.name}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs sm:text-sm text-gray-600 heading">Father&apos;s Name:</span>
                        <span className="text-xs sm:text-sm text-gray-900 font-light">{selectedProfile.fatherName}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs sm:text-sm text-gray-600 heading">Gender:</span>
                        <span className="text-xs sm:text-sm text-gray-900 font-light">{selectedProfile.gender}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs sm:text-sm text-gray-600 heading">Age:</span>
                        <span className="text-xs sm:text-sm text-gray-900 font-light">{selectedProfile.age} years</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs sm:text-sm text-gray-600 heading">Height:</span>
                        <span className="text-xs sm:text-sm text-gray-900 font-light">{selectedProfile.height}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs sm:text-sm text-gray-600 heading">Weight:</span>
                        <span className="text-xs sm:text-sm text-gray-900 font-light">{selectedProfile.weight}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs sm:text-sm text-gray-600 heading">Complexion:</span>
                        <span className="text-xs sm:text-sm text-gray-900 font-light">{selectedProfile.color}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs sm:text-sm text-gray-600 heading">Cast:</span>
                        <span className="text-xs sm:text-sm text-gray-900 font-light">{selectedProfile.cast}</span>
                      </div>
                      {selectedProfile.maslak && (
                        <div className="flex justify-between items-center py-1.5 px-2">
                          <span className="text-xs sm:text-sm text-gray-600 heading">Maslak:</span>
                          <span className="text-xs sm:text-sm text-gray-900 font-light">{selectedProfile.maslak}</span>
                        </div>
                      )}
                      {selectedProfile.maritalStatus && (
                        <div className="flex justify-between items-center py-1.5 px-2">
                          <span className="text-xs sm:text-sm text-gray-600 heading">Marital Status:</span>
                          <span className="text-xs sm:text-sm text-gray-900 font-light">{selectedProfile.maritalStatus}</span>
                        </div>
                      )}
                      {selectedProfile.motherTongue && (
                        <div className="flex justify-between items-center py-1.5 px-2">
                          <span className="text-xs sm:text-sm text-gray-600 heading">Mother Tongue:</span>
                          <span className="text-xs sm:text-sm text-gray-900 font-light">{selectedProfile.motherTongue}</span>
                        </div>
                      )}
                      {selectedProfile.belongs && (
                        <div className="flex justify-between items-center py-1.5 px-2">
                          <span className="text-xs sm:text-sm text-gray-600 heading">Belongs:</span>
                          <span className="text-xs sm:text-sm text-gray-900 font-light">{selectedProfile.belongs}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Professional & Education */}
                  <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
                    <h3 className="text-base sm:text-lg text-gray-800 heading mb-2">🎓 Education & Career</h3>
                    <div className="divide-y divide-gray-200">
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs sm:text-sm text-gray-600 heading">Education:</span>
                        <span className="text-xs sm:text-sm text-gray-900 font-light">{selectedProfile.education}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs sm:text-sm text-gray-600 heading">Occupation:</span>
                        <span className="text-xs sm:text-sm text-gray-900 font-light">{selectedProfile.occupation}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs sm:text-sm text-gray-600 heading">Income:</span>
                        <span className="text-xs sm:text-sm text-gray-900 font-light">{selectedProfile.income}</span>
                      </div>
                      {selectedProfile.houseType && (
                        <div className="flex justify-between items-center py-1.5 px-2">
                          <span className="text-xs sm:text-sm text-gray-600 heading">House Type:</span>
                          <span className="text-xs sm:text-sm text-gray-900 font-light">{selectedProfile.houseType}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                    <h3 className="text-base sm:text-lg text-gray-800 heading mb-2">📱 Contact Information</h3>
                    <div className="divide-y divide-gray-200">
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs sm:text-sm text-gray-600 heading">Phone:</span>
                        <span className="text-xs sm:text-sm text-gray-900 font-light">{selectedProfile.contactNumber}</span>
                      </div>
                      <div className="flex justify-between items-start py-1.5 px-2">
                        <span className="text-xs sm:text-sm text-gray-600 heading">Address:</span>
                        <span className="text-xs sm:text-sm text-gray-900 font-light text-right max-w-xs">{selectedProfile.address}</span>
                      </div>
                      {selectedProfile.email && (
                        <div className="flex justify-between items-center py-1.5 px-2">
                          <span className="text-xs sm:text-sm text-gray-600 heading">Email:</span>
                          <span className="text-xs sm:text-sm text-gray-900 font-light break-all">{selectedProfile.email}</span>
                        </div>
                      )}
                      {selectedProfile.country && (
                        <div className="flex justify-between items-center py-1.5 px-2">
                          <span className="text-xs sm:text-sm text-gray-600 heading">Country:</span>
                          <span className="text-xs sm:text-sm text-gray-900 font-light">{selectedProfile.country}</span>
                        </div>
                      )}
                      {selectedProfile.city && (
                        <div className="flex justify-between items-center py-1.5 px-2">
                          <span className="text-xs sm:text-sm text-gray-600 heading">City:</span>
                          <span className="text-xs sm:text-sm text-gray-900 font-light">{selectedProfile.city}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side - Professional + Requirements */}
                <div className="space-y-3 sm:space-y-4">
                  {/* Professional Information */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                    <h3 className="text-base sm:text-lg text-gray-800 heading mb-2">💼 Professional Information</h3>
                    <div className="divide-y divide-gray-200">
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs sm:text-sm text-gray-600 heading">Education:</span>
                        <span className="text-xs sm:text-sm text-gray-900 font-light">{selectedProfile.education}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs sm:text-sm text-gray-600 heading">Occupation:</span>
                        <span className="text-xs sm:text-sm text-gray-900 font-light">{selectedProfile.occupation}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs sm:text-sm text-gray-600 heading">Income:</span>
                        <span className="text-xs sm:text-sm text-gray-900 font-light">{selectedProfile.income}</span>
                      </div>
                    </div>
                  </div>

                  {/* Family Details */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                    <h3 className="text-base sm:text-lg text-gray-800 heading mb-2">👨‍👩‍👧‍👦 Family Details</h3>
                    <p className="text-xs sm:text-sm text-gray-900 font-light leading-relaxed px-2">
                      {selectedProfile.familyDetails || 'No family details provided'}
                    </p>
                  </div>

                  {/* Partner Requirements */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                    <h3 className="text-base sm:text-lg text-gray-800 heading mb-2">💕 Partner Requirements</h3>
                    <div className="divide-y divide-gray-200">
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs sm:text-sm text-gray-600 heading">Age Range:</span>
                        <span className="text-xs sm:text-sm text-gray-900 font-light">
                          {selectedProfile.requirements.ageRange.min} - {selectedProfile.requirements.ageRange.max} years
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs sm:text-sm text-gray-600 heading">Height Range:</span>
                        <span className="text-xs sm:text-sm text-gray-900 font-light">
                          {selectedProfile.requirements.heightRange.min} - {selectedProfile.requirements.heightRange.max}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs sm:text-sm text-gray-600 heading">Education:</span>
                        <span className="text-xs sm:text-sm text-gray-900 font-light">
                          {selectedProfile.requirements.education || 'Any'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs sm:text-sm text-gray-600 heading">Occupation:</span>
                        <span className="text-xs sm:text-sm text-gray-900 font-light">
                          {selectedProfile.requirements.occupation || 'Any'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs sm:text-sm text-gray-600 heading">Family Type:</span>
                        <span className="text-xs sm:text-sm text-gray-900 font-light">
                          {selectedProfile.requirements.familyType || 'Any'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs sm:text-sm text-gray-600 heading">Location:</span>
                        <span className="text-xs sm:text-sm text-gray-900 font-light">
                          {Array.isArray(selectedProfile.requirements.location) 
                            ? selectedProfile.requirements.location.join(', ') || 'Any'
                            : selectedProfile.requirements.location || 'Any'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs sm:text-sm text-gray-600 heading">Cast:</span>
                        <span className="text-xs sm:text-sm text-gray-900 font-light">
                          {Array.isArray(selectedProfile.requirements.cast) 
                            ? selectedProfile.requirements.cast.join(', ') || 'Any'
                            : selectedProfile.requirements.cast || 'Any'}
                        </span>
                      </div>
                      {selectedProfile.requirements.maslak && Array.isArray(selectedProfile.requirements.maslak) && selectedProfile.requirements.maslak.length > 0 && (
                        <div className="flex justify-between items-center py-1.5 px-2">
                          <span className="text-xs sm:text-sm text-gray-600 heading">Maslak:</span>
                          <span className="text-xs sm:text-sm text-gray-900 font-light">
                            {selectedProfile.requirements.maslak.join(', ')}
                          </span>
                        </div>
                      )}
                      {selectedProfile.requirements.maritalStatus && Array.isArray(selectedProfile.requirements.maritalStatus) && selectedProfile.requirements.maritalStatus.length > 0 && (
                        <div className="flex justify-between items-center py-1.5 px-2">
                          <span className="text-xs sm:text-sm text-gray-600 heading">Marital Status:</span>
                          <span className="text-xs sm:text-sm text-gray-900 font-light">
                            {selectedProfile.requirements.maritalStatus.join(', ')}
                          </span>
                        </div>
                      )}
                      {selectedProfile.requirements.motherTongue && Array.isArray(selectedProfile.requirements.motherTongue) && selectedProfile.requirements.motherTongue.length > 0 && (
                        <div className="flex justify-between items-center py-1.5 px-2">
                          <span className="text-xs sm:text-sm text-gray-600 heading">Mother Tongue:</span>
                          <span className="text-xs sm:text-sm text-gray-900 font-light">
                            {selectedProfile.requirements.motherTongue.join(', ')}
                          </span>
                        </div>
                      )}
                      {selectedProfile.requirements.belongs && Array.isArray(selectedProfile.requirements.belongs) && selectedProfile.requirements.belongs.length > 0 && (
                        <div className="flex justify-between items-center py-1.5 px-2">
                          <span className="text-xs sm:text-sm text-gray-600 heading">Nationality:</span>
                          <span className="text-xs sm:text-sm text-gray-900 font-light">
                            {selectedProfile.requirements.belongs.join(', ')}
                          </span>
                        </div>
                      )}
                      {selectedProfile.requirements.houseType && Array.isArray(selectedProfile.requirements.houseType) && selectedProfile.requirements.houseType.length > 0 && (
                        <div className="flex justify-between items-center py-1.5 px-2">
                          <span className="text-xs sm:text-sm text-gray-600 heading">House Type:</span>
                          <span className="text-xs sm:text-sm text-gray-900 font-light">
                            {selectedProfile.requirements.houseType.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Matches Section */}
              {(matches.length > 0 || matchesLoading) && (
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg text-gray-900 heading">
                      Potential Matches {matches.length > 0 && `(${matches.length})`}
                    </h3>
                    {matchesLoading && (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
                        <span className="text-xs text-gray-600 font-light">Finding matches...</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3 sm:space-y-4 max-h-48 sm:max-h-60 overflow-y-auto">
                    {matches.map((match) => (
                      <div key={match._id} className="p-3 sm:p-4 bg-gray-50/50 rounded-lg space-y-3">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className="heading text-emerald-700 text-sm sm:text-base">{match.name}</p>
                              {match.matchScore && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                  {match.matchScore} match
                                </span>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 font-light">
                              {match.age} years, {match.education}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600 font-light">{match.occupation}</p>
                            <p className="text-xs sm:text-sm text-gray-600 font-light">{match.contactNumber}</p>
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 font-light mt-2 sm:mt-0">
                            Height: {match.height}
                          </div>
                        </div>
                        
                        {/* Matched Fields Display */}
                        {match.matchedFields && match.matchedFields.length > 0 && (
                          <div className="border-t border-gray-200 pt-2">
                            <p className="text-xs text-gray-500 font-medium mb-1">Matched Fields:</p>
                            <div className="flex flex-wrap gap-1">
                              {match.matchedFields.map((field, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-light bg-blue-100 text-blue-700"
                                >
                                  ✓ {field}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* No matches found message */}
                  {matches.length === 0 && !matchesLoading && (
                    <div className="text-center py-4 sm:py-6">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-gray-400 text-lg">💔</span>
                      </div>
                      <p className="text-sm sm:text-base text-gray-600 font-light">No matches found</p>
                      <p className="text-xs sm:text-sm text-gray-500 font-light mt-1">
                        Try adjusting the requirements or add more profiles
                      </p>
                    </div>
                  )}
                </div>
              )}

              {matchesLoading && (
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 text-center">
                  <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-emerald-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600 font-light text-sm sm:text-base">Finding matches...</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => findMatches(selectedProfile._id)}
                  disabled={matchesLoading}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-2.5 rounded-md transition-all disabled:opacity-50 text-sm font-light shadow-md hover:shadow-lg"
                >
                  {matchesLoading ? 'Finding...' : 'Find Matches'}
                </button>
                <button
                  onClick={() => {
                    setSelectedProfile(null);
                    setMatches([]);
                  }}
                  className="flex-1 sm:flex-initial bg-gray-500 hover:bg-gray-600 text-white px-4 py-2.5 rounded-md transition-colors text-sm font-light"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal - Mobile Optimized */}
      {isEditingProfile && editData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100/50 rounded-none sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl h-full sm:h-auto sm:max-h-[90vh] flex flex-col">
            
            {/* Modal Header - Mobile First */}
            <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100 p-3 sm:p-6 sticky top-0 z-10">
              {/* Mobile Header Layout */}
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm sm:text-lg">💕</span>
                  </div>
                  <div>
                    <h1 className="text-sm sm:text-xl text-gray-900 tracking-wide heading font-semibold">
                      Edit Profile
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-600 font-light hidden sm:block">
                      Update {editData.name}&apos;s information
                    </p>
                  </div>
                </div>
                
                {/* Mobile Close Button */}
                <button
                  onClick={handleCancelEdit}
                  className="sm:hidden w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <span className="text-lg">✕</span>
                </button>
              </div>
              
              {/* Mobile Profile Name */}
              <div className="sm:hidden mb-3">
                <p className="text-xs text-gray-600">
                  Editing: <span className="font-medium text-gray-800">{editData.name}</span>
                </p>
              </div>
              
              {/* Action Buttons - Mobile: Bottom Fixed, Desktop: Inline */}
              <div className="hidden sm:flex justify-between items-center">
                <button
                  onClick={() => handleDeleteProfile(editingProfile!)}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-2 py-1.5 rounded-md transition-all font-light shadow-sm hover:shadow-md text-xs"
                >
                  🗑️ Delete
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-3 py-1.5 rounded-md transition-all font-light shadow-sm hover:shadow-md disabled:opacity-50 text-xs"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
              
              {editMessage && (
                <div className={`mt-3 sm:mt-4 p-3 rounded-lg text-xs sm:text-sm ${
                  editMessage.type === 'success' 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {editMessage.text}
                </div>
              )}
            </div>

            {/* Modal Body - Mobile Optimized Scrollable Content */}
            <div className="flex-1 overflow-y-auto overscroll-y-contain webkit-overflow-scrolling-touch modal-scroll p-3 sm:p-6 pb-4 sm:pb-6">
              <EditProfileFormAdmin 
                editData={editData}
                handleInputChange={handleEditInputChange}
              />
            </div>
            
            {/* Mobile Bottom Action Buttons */}
            <div className="sm:hidden flex-shrink-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-3 safe-area-inset-bottom">
              <div className="flex flex-col space-y-2">
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-md transition-colors text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-2 px-3 rounded-md transition-all font-medium shadow-sm hover:shadow-md disabled:opacity-50 text-xs"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => handleDeleteProfile(editingProfile!)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 px-3 rounded-md transition-all font-medium shadow-sm hover:shadow-md text-xs"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && profileToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm sm:max-w-md w-full p-4 sm:p-6 mx-2">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-red-600 text-xl sm:text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Delete Profile</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                Are you sure you want to delete <strong>{profileToDelete.name}</strong>&apos;s profile? 
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                This action cannot be undone and will permanently remove all profile data.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={cancelDelete}
                  disabled={isDeleting}
                  className="w-full sm:flex-1 px-3 py-2.5 sm:px-4 sm:py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="w-full sm:flex-1 px-3 py-2.5 sm:px-4 sm:py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Edit Profile Form Component for Admin
function EditProfileFormAdmin({ 
  editData, 
  handleInputChange
}: {
  editData: Profile;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}) {
  const inputClasses = "w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400/50 focus:border-emerald-400 transition-colors duration-200 touch-manipulation font-light";
  const selectClasses = "w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400/50 focus:border-emerald-400 transition-colors duration-200 touch-manipulation font-light bg-white";
  const textareaClasses = "w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400/50 focus:border-emerald-400 transition-colors duration-200 touch-manipulation font-light resize-none";

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div>
        <h2 className="text-lg sm:text-xl text-gray-900 mb-4 heading">Personal Information</h2>
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {/* Name Fields - 50/50 Layout */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleInputChange}
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Father&apos;s Name *</label>
              <input
                type="text"
                name="fatherName"
                value={editData.fatherName}
                onChange={handleInputChange}
                className={inputClasses}
              />
            </div>
          </div>

          {/* Gender and Cast - 50/50 Layout */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
              <select
                name="gender"
                value={editData.gender || 'Male'}
                onChange={handleInputChange}
                className={selectClasses}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cast/Caste *</label>
              <input
                type="text"
                name="cast"
                value={editData.cast}
                onChange={handleInputChange}
                className={inputClasses}
              />
            </div>
          </div>

          {/* Age, Height, Weight - 3 Column Layout */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
              <input
                type="number"
                name="age"
                value={editData.age}
                onChange={handleInputChange}
                className={inputClasses}
                min="18"
                max="80"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
              <input
                type="text"
                name="height"
                value={editData.height}
                onChange={handleInputChange}
                placeholder="5.6"
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
              <input
                type="text"
                name="weight"
                value={editData.weight}
                onChange={handleInputChange}
                placeholder="70kg"
                className={inputClasses}
              />
            </div>
          </div>

          {/* Complexion */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Complexion</label>
            <select
              name="color"
              value={editData.color}
              onChange={handleInputChange}
              className={selectClasses}
            >
              <option value="">Select Complexion</option>
              <option value="Very Fair">Very Fair</option>
              <option value="Fair">Fair</option>
              <option value="Medium">Medium</option>
              <option value="Dark">Dark</option>
            </select>
          </div>

          {/* Maslak and Marital Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maslak *</label>
              <input
                type="text"
                name="maslak"
                value={editData.maslak || ''}
                onChange={handleInputChange}
                className={inputClasses}
                placeholder="e.g., Sunni, Shia, Hanafi"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status *</label>
              <select
                name="maritalStatus"
                value={editData.maritalStatus || 'Single'}
                onChange={handleInputChange}
                className={selectClasses}
              >
                <option value="Single">Single</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
                <option value="Separated">Separated</option>
              </select>
            </div>
          </div>

          {/* Mother Tongue and Nationality */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mother Tongue *</label>
              <input
                type="text"
                name="motherTongue"
                value={editData.motherTongue || ''}
                onChange={handleInputChange}
                className={inputClasses}
                placeholder="e.g., Urdu, English, Punjabi"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nationality/Origin *</label>
              <input
                type="text"
                name="belongs"
                value={editData.belongs || ''}
                onChange={handleInputChange}
                className={inputClasses}
                placeholder="e.g., Pakistan, Bangladesh"
              />
            </div>
          </div>

        </div>

          {/* Photo Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center">
              {editData.photoUrl ? (
                <div className="space-y-4">
                  <div className="relative inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={editData.photoUrl}
                      alt="Profile preview"
                      className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-full mx-auto border-4 border-emerald-200"
                    />
                  </div>
                  <p className="text-sm text-gray-600">Current photo</p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Photo URL</label>
                    <input
                      type="url"
                      name="photoUrl"
                      value={editData.photoUrl || ''}
                      onChange={handleInputChange}
                      placeholder="https://example.com/photo.jpg"
                      className={inputClasses}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-4xl sm:text-6xl">📸</div>
                  <div>
                    <p className="text-sm sm:text-base text-gray-600 mb-2">No photo uploaded</p>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Photo URL</label>
                    <input
                      type="url"
                      name="photoUrl"
                      value={editData.photoUrl || ''}
                      onChange={handleInputChange}
                      placeholder="https://example.com/photo.jpg"
                      className={inputClasses}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
      </div>

      {/* Education & Career */}
      <div>
        <h2 className="text-lg sm:text-xl text-gray-900 mb-4 heading">Education & Career</h2>
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {/* Education */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Education *</label>
            <input
              type="text"
              name="education"
              value={editData.education}
              onChange={handleInputChange}
              className={inputClasses}
              placeholder="e.g., Bachelor's in Computer Science"
            />
          </div>
          
          {/* Job/Occupation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job/Business/Occupation *</label>
            <input
              type="text"
              name="occupation"
              value={editData.occupation}
              onChange={handleInputChange}
              className={inputClasses}
              placeholder="e.g., Software Engineer, Doctor, Teacher"
            />
          </div>
          
          {/* Income */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Income/Salary *</label>
            <input
              type="text"
              name="income"
              value={editData.income}
              onChange={handleInputChange}
              className={inputClasses}
              placeholder="e.g., 50,000 PKR, 1 Lakh, As per Requirement"
            />
          </div>

          {/* House Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">House Type *</label>
            <select
              name="houseType"
              value={editData.houseType || 'Family House'}
              onChange={handleInputChange}
              className={selectClasses}
            >
              <option value="">Select House Type</option>
              <option value="Own House">Own House</option>
              <option value="Rent">Rent</option>
              <option value="Family House">Family House</option>
              <option value="Apartment">Apartment</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h2 className="text-lg sm:text-xl text-gray-900 mb-4 heading">Contact Information</h2>
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {/* Country and City */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
              <input
                type="text"
                name="country"
                value={editData.country || ''}
                onChange={handleInputChange}
                className={inputClasses}
                placeholder="Pakistan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
              <input
                type="text"
                name="city"
                value={editData.city || ''}
                onChange={handleInputChange}
                className={inputClasses}
                placeholder="Karachi"
              />
            </div>
          </div>
          
          {/* Contact Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number *</label>
            <input
              type="tel"
              name="contactNumber"
              value={editData.contactNumber}
              onChange={handleInputChange}
              className={inputClasses}
              placeholder="+92 300 1234567"
            />
          </div>
        </div>
      </div>

      {/* Family Details */}
      <div>
        <h2 className="text-lg sm:text-xl text-gray-900 mb-4 heading">Family Details</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Family Details *</label>
          <textarea
            name="familyDetails"
            value={editData.familyDetails}
            onChange={handleInputChange}
            rows={4}
            className={textareaClasses}
            placeholder="Describe your family background, number of siblings, parents occupation, family values etc..."
          />
        </div>
      </div>

      {/* Partner Requirements */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200 rounded-xl relative overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-pink-100 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-100 rounded-full translate-y-8 -translate-x-8 opacity-50"></div>
          
          {/* Header */}
          <div className="relative z-10 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">💕</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Partner Requirements</h2>
            </div>
            <p className="text-sm text-gray-600 ml-11">Edit your ideal life partner preferences</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:gap-6 relative z-10">
            {/* Age Range */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <span className="text-pink-500">🎂</span>
                Preferred Age Range
              </label>
              <input
                type="text"
                name="requirements.ageRange"
                value={`${editData.requirements.ageRange.min}-${editData.requirements.ageRange.max}`}
                onChange={handleInputChange}
                placeholder="e.g., 25-35"
                className={inputClasses}
              />
            </div>
            
            {/* Height Range */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <span className="text-pink-500">📏</span>
                Preferred Height Range
              </label>
              <input
                type="text"
                name="requirements.heightRange"
                value={`${editData.requirements.heightRange.min}-${editData.requirements.heightRange.max}`}
                onChange={handleInputChange}
                placeholder="e.g., 5.2-6.0"
                className={inputClasses}
              />
            </div>

            {/* Education & Occupation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <span className="text-pink-500">🎓</span>
                  Education Preference
                </label>
                <input
                  type="text"
                  name="requirements.education"
                  value={editData.requirements.education}
                  onChange={handleInputChange}
                  placeholder="Any, Bachelor's, Master's, etc."
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <span className="text-pink-500">💼</span>
                  Occupation Preference
                </label>
                <input
                  type="text"
                  name="requirements.occupation"
                  value={editData.requirements.occupation}
                  onChange={handleInputChange}
                  placeholder="Any, Doctor, Engineer, etc."
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Family Type */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <span className="text-pink-500">🏠</span>
                Family Type Preference
              </label>
              <input
                type="text"
                name="requirements.familyType"
                value={editData.requirements.familyType || ''}
                onChange={handleInputChange}
                placeholder="Joint, Nuclear, Any"
                className={inputClasses}
              />
            </div>

            {/* Location */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <span className="text-pink-500">📍</span>
                Location Preference (comma separated)
              </label>
              <input
                type="text"
                name="requirements.location"
                value={Array.isArray(editData.requirements.location) ? editData.requirements.location.join(', ') : editData.requirements.location || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  const locationArray = value.split(',').map(item => item.trim()).filter(item => item);
                  handleInputChange({
                    target: {
                      name: 'requirements.location',
                      value: locationArray.join(', ')
                    }
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
                placeholder="Karachi, Lahore, Any"
                className={inputClasses}
              />
            </div>

            <p className="text-sm text-gray-600 bg-white/80 p-3 rounded-lg">
              💡 <strong>Tip:</strong> For multiple preferences (cast, maslak, etc.), separate with commas. Example: &quot;Same Cast, Any&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
