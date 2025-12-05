'use client';

import { useSession as _useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import useSWR from 'swr';

// Import admin components
import {
  AdminHeader,
  TabSelector,
  ProfileList,
  ProfileDetailModal,
  StatsCards,
  FilterPanel,
  ClientAccessTab,
  ImageModal,
  DeleteConfirmModal,
  ClientModal,
  EditProfileModal,
  CompareButton,
  ProfilesListContainer,
  ProfileInfoSection,
  ProfessionalInfoSection,
  ContactInfoSection,
  FamilyDetailsSection,
  PartnerRequirementsSection,
  MatchSummaryCard,
  EditFormSubmissionDetails,
  EditFormPersonalInfo,
  EditFormEducationCareer,
  EditFormContactInfo,
  EditFormFamilyDetails,
  EditFormPartnerRequirements,
  ProfileCardItem,
  Profile,
  ClientAccess,
  Filters,
  getProfileId,
  getSharedCount,
} from '@/components/admin';

// Force dynamic rendering so Next.js does not attempt to prerender and execute auth hooks server-side
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// Safe wrapper to avoid build-time crash when SessionProvider not yet mounted
function safeUseSession() {
  try {
    return _useSession();
  } catch {
    return { data: null, status: 'unauthenticated' } as const;
  }
}

export default function AdminDashboard() {
  const { data: session, status } = safeUseSession();
  const router = useRouter();
  
  // SWR fetcher function
  const fetcher = async (url: string) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };
  
  // Use SWR for profiles with caching - load only 50 initially for speed
  const { data: profilesData, error: profilesError, mutate: refreshProfiles } = useSWR(
    session ? '/api/profiles?limit=50&page=1' : null,
    fetcher,
    {
      revalidateOnFocus: false,    // Don't reload when tab changes
      revalidateOnReconnect: false, // Don't reload on reconnect
      refreshInterval: 0,           // No auto refresh
      dedupingInterval: 120000,     // Cache for 2 minutes (matches server cache)
      keepPreviousData: true,       // Show old data while loading new
    }
  );
  
  const profiles = useMemo(() => {
    const data = profilesData?.profiles || profilesData || [];
    return Array.isArray(data) ? data : [];
  }, [profilesData]);
  
  const loading = !profilesData && !profilesError;
  
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [matches, setMatches] = useState<Profile[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // Cache match counts - will be loaded from API
  const [profileMatches, setProfileMatches] = useState<Record<string, number>>({});
  
  // Save to localStorage whenever profileMatches changes
  useEffect(() => {
    if (Object.keys(profileMatches).length > 0) {
      localStorage.setItem('profileMatchCounts', JSON.stringify(profileMatches));
      localStorage.setItem('profileMatchCounts_timestamp', Date.now().toString());
    }
  }, [profileMatches]);
  
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
    occupation: '',
    submittedBy: ''
  });

  // Tab Management State
  const [activeTab, setActiveTab] = useState<'profiles' | 'clients'>('profiles');

  // Client Management States
  const [showClientModal, setShowClientModal] = useState(false);
  const [clientFormData, setClientFormData] = useState({
    name: '',
    email: '',
    password: '',
    profileId: '',
  });
  const [clientMessage, setClientMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Client Delete States
  const [showClientDeleteConfirm, setShowClientDeleteConfirm] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<ClientAccess | null>(null);
  const [isDeletingClient, setIsDeletingClient] = useState(false);

  // Image Modal States
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedImageName, setSelectedImageName] = useState<string>('');

  // Fetch clients data
  const { data: clientsData, error: clientsError, mutate: refreshClients } = useSWR(
    session && activeTab === 'clients' ? '/api/clients' : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
      dedupingInterval: 60000,
    }
  );

  const clients = useMemo(() => {
    return clientsData?.clients || [];
  }, [clientsData]);

  const clientsLoading = activeTab === 'clients' && !clientsData && !clientsError;

  const updateProfileStatus = async (profileId: string, status: string, matchedWithId?: string) => {
    if (!profileId || profileId.trim() === '') {
      alert('Invalid profile ID');
      return;
    }
    
    try {
      const requestBody = { 
        status, 
        matchedWith: matchedWithId,
        matchedDate: new Date().toISOString()
      };
      
      const apiUrl = `/api/profiles/${encodeURIComponent(profileId)}/status`;
      
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const responseText = await response.text();
      
      if (response.ok) {
        try {
          JSON.parse(responseText);
          
          // Clear match counts cache when status changes - local and server
          setProfileMatches({});
          localStorage.removeItem('profileMatchCounts');
          localStorage.removeItem('profileMatchCounts_timestamp');
          
          // Clear server cache
          fetch('/api/profiles/match-counts', { method: 'POST' }).catch(() => {});
          
          // Refresh profiles to show updated status
          await fetchProfiles();
          
          // Show success message with additional info for non-Active status
          if (status !== 'Active') {
            alert(`Profile status updated to ${status} successfully!\n\nNote: Profile has been removed from matches as status is no longer Active.`);
          } else {
            alert(`Profile status updated to ${status} successfully!`);
          }
        } catch {
          // Clear match counts cache
          setProfileMatches({});
          localStorage.removeItem('profileMatchCounts');
          localStorage.removeItem('profileMatchCounts_timestamp');
          
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
          alert(`Failed to update profile status: ${errorData.error || 'Unknown error'}`);
        } catch {
          alert(`Failed to update profile status. Server error.`);
        }
      }
    } catch (error) {
      alert(`Error updating profile status: ${error}`);
    }
  };

  const fetchProfiles = useCallback(async () => {
    // Use SWR's mutate to refresh data
    await refreshProfiles();
  }, [refreshProfiles]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }
    
    // Load all match counts in a single API call
    if (profiles.length > 0) {
      // Check if we already have cached data that's valid
      const cached = localStorage.getItem('profileMatchCounts');
      const cacheTime = localStorage.getItem('profileMatchCounts_timestamp');
      
      if (cached && cacheTime) {
        const timestamp = parseInt(cacheTime);
        const now = Date.now();
        // If cache is valid (< 2 minutes), use it
        if (now - timestamp < 2 * 60 * 1000) {
          try {
            const cachedData = JSON.parse(cached);
            if (Object.keys(cachedData).length > 0) {
              setProfileMatches(cachedData);
              return;
            }
          } catch {
            // Invalid cache, continue to fetch
          }
        }
      }
      
      // Fetch fresh match counts
      (async () => {
        try {
          const response = await fetch('/api/profiles/match-counts');
          if (response.ok) {
            const data = await response.json();
            if (data.matchCounts && Object.keys(data.matchCounts).length > 0) {
              setProfileMatches(data.matchCounts);
              // Save to localStorage
              localStorage.setItem('profileMatchCounts', JSON.stringify(data.matchCounts));
              localStorage.setItem('profileMatchCounts_timestamp', Date.now().toString());
            }
          }
        } catch {
          // Error loading match counts - will show ... in UI
        }
      })();
    }
  }, [session, status, router, profiles]); // eslint-disable-line react-hooks/exhaustive-deps

  const findMatches = async (profileId: string) => {
    setMatchesLoading(true);
    try {
      const response = await fetch(`/api/profiles/${profileId}/matches`);
      if (response.ok) {
        const data = await response.json();
        setMatches(data.matches || []);
      }
    } catch {
      // Error finding matches
    } finally {
      setMatchesLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    fetchProfiles();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      ageMin: '',
      ageMax: '',
      education: '',
      occupation: '',
      submittedBy: ''
    });
    fetchProfiles();
  };

  // Edit Profile Functions
  const handleEditProfile = (profile: Profile) => {
    setEditingProfile(profile);
    setEditData(profile);
    setIsEditingProfile(true);
    setEditMessage(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    
    if (!editData) return;
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      setEditData({
        ...editData,
        [name]: checked
      });
      return;
    }
    
    // Handle number inputs
    if (type === 'number') {
      const numValue = parseInt(value) || 0;
      setEditData({
        ...editData,
        [name]: numValue
      });
      return;
    }
    
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
      } else if (['location', 'cast', 'maslak', 'maritalStatus', 'motherTongue', 'belongs', 'houseType'].includes(fieldName)) {
        // Handle comma-separated array values
        const arrayValue = value.split(',').map(item => item.trim()).filter(item => item);
        setEditData({
          ...editData,
          requirements: {
            ...editData.requirements,
            [fieldName]: arrayValue
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
      const updatePayload = {
        profileId: getProfileId(editingProfile),
        ...editData
      };
      
      const response = await fetch('/api/profiles', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload)
      });

      const data = await response.json();
      
      if (data.success) {
        // Clear match counts cache
        setProfileMatches({});
        localStorage.removeItem('profileMatchCounts');
        localStorage.removeItem('profileMatchCounts_timestamp');
        
        // Refresh profiles from server
        await refreshProfiles();
        
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
    } catch {
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
        // Clear match counts cache
        setProfileMatches({});
        localStorage.removeItem('profileMatchCounts');
        localStorage.removeItem('profileMatchCounts_timestamp');
        
        // Refresh profiles from server
        await refreshProfiles();
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
    } catch {
      setEditMessage({ type: 'error', text: 'Error deleting profile' });
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setProfileToDelete(null);
  };

  // Client Management Functions
  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientMessage(null);

    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientFormData),
      });

      const data = await res.json();

      if (!res.ok) {
        setClientMessage({ type: 'error', text: data.error || 'Failed to create client' });
        return;
      }

      setClientMessage({ type: 'success', text: 'Client account created successfully! Share the login credentials with your client.' });
      setClientFormData({ name: '', email: '', password: '', profileId: '' });
      
      // Refresh clients list
      refreshClients();
      
      // Auto close after 3 seconds
      setTimeout(() => {
        setShowClientModal(false);
        setClientMessage(null);
      }, 3000);
    } catch (error) {
      setClientMessage({ type: 'error', text: 'Failed to create client' });
    }
  };

  const handleDeleteClient = async () => {
    if (!clientToDelete) return;
    
    setIsDeletingClient(true);
    
    try {
      const response = await fetch(`/api/clients?id=${clientToDelete._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || 'Failed to delete client');
        return;
      }

      // Refresh clients list
      refreshClients();
      
      // Close modal
      setShowClientDeleteConfirm(false);
      setClientToDelete(null);
    } catch (error) {
      alert('Failed to delete client');
    } finally {
      setIsDeletingClient(false);
    }
  };

  const openClientModal = (profile: Profile) => {
    setClientFormData({
      name: profile.name,
      email: '',
      password: '',
      profileId: getProfileId(profile),
    });
    setShowClientModal(true);
    setClientMessage(null);
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Mobile Header */}
      <AdminHeader session={session} />

      <div className="max-w-md mx-auto px-4 py-4">
        {/* Filters */}
        <FilterPanel
          filters={filters}
          isOpen={isFiltersOpen}
          onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
          onFilterChange={handleFilterChange}
          onApply={applyFilters}
          onClear={clearFilters}
        />

        {/* Compare Button */}
        <CompareButton />

        {/* Tabs */}
        <TabSelector
          activeTab={activeTab}
          onTabChange={setActiveTab}
          profilesCount={profiles.length}
          clientsCount={clients.length}
        />

        {activeTab === 'profiles' ? (
          <>
            {/* Stats */}
            <StatsCards profiles={profiles} />

            {/* Profiles List */}
            <ProfilesListContainer loading={loading} profiles={profiles}>
              {profiles.map((profile: Profile) => (
                    <ProfileCardItem
                      key={getProfileId(profile)}
                      profile={profile}
                      profileMatches={profileMatches}
                      onViewDetails={() => setSelectedProfile(profile)}
                      onEdit={() => handleEditProfile(profile)}
                      onCreateClient={() => openClientModal(profile)}
                      onStatusChange={(status) => updateProfileStatus(getProfileId(profile), status)}
                      onImageClick={(imageUrl, imageName) => {
                        setSelectedImage(imageUrl);
                        setSelectedImageName(imageName);
                        setShowImageModal(true);
                      }}
                    />
              ))}
            </ProfilesListContainer>
          </>
        ) : (
          /* Client Access Tab */
          <div className="bg-white rounded-xl shadow-lg">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">Client Access Accounts</h2>
            </div>
            <ClientAccessTab
              clients={clients}
              loading={clientsLoading}
              onDeleteClick={(client) => {
                setClientToDelete(client);
                setShowClientDeleteConfirm(true);
              }}
            />
          </div>
        )}
      </div>


      {/* Profile Detail Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header with Profile Photo and Name */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-3 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Profile Photo in Header */}
                  {selectedProfile.photoUrl && (
                    <div className="flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedProfile.photoUrl}
                        alt={`${selectedProfile.name}'s profile`}
                        className="w-12 h-12 object-cover rounded-full border-2 border-emerald-300 shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage(selectedProfile.photoUrl!);
                          setSelectedImageName(selectedProfile.name);
                          setShowImageModal(true);
                        }}
                        title="Click to view full image"
                      />
                    </div>
                  )}
                  {/* Name and Basic Info */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg font-bold text-gray-900">{selectedProfile.name}</h2>
                      {selectedProfile.submittedBy && (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          selectedProfile.submittedBy === 'Main Admin' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {selectedProfile.submittedBy === 'Main Admin' ? '👤 Direct' : '🤝 Partner'}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 font-light">{selectedProfile.age} years • {selectedProfile.occupation}</p>
                    {selectedProfile.submittedBy === 'Partner Matchmaker' && selectedProfile.matchmakerName && (
                      <p className="text-xs text-green-600 font-medium">Referred by: {selectedProfile.matchmakerName}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedProfile(null);
                    setMatches([]);
                  }}
                  className="text-gray-400 active:text-gray-600 p-1 flex-shrink-0"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-4">
              {/* Match Summary Card */}
              {profileMatches[selectedProfile._id] !== undefined && (
                <MatchSummaryCard 
                  profile={selectedProfile} 
                  matchCount={profileMatches[selectedProfile._id]} 
                />
              )}
              
              {/* Profile Information Sections */}
              <div className="space-y-4">
                <ProfileInfoSection profile={selectedProfile} />
                <ProfessionalInfoSection profile={selectedProfile} />
                <ContactInfoSection profile={selectedProfile} />
                <FamilyDetailsSection profile={selectedProfile} />
                <PartnerRequirementsSection profile={selectedProfile} />
              </div>

              {/* Matches Section */}
              {(matches.length > 0 || matchesLoading) && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base text-gray-900 heading">
                      Potential Matches {matches.length > 0 && `(${matches.length})`}
                    </h3>
                    {matchesLoading && (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
                        <span className="text-xs text-gray-600 font-light">Finding matches...</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {matches.map((match) => (
                      <div key={match._id} className="p-3 bg-gray-50/50 rounded-lg space-y-3">
                        <div className="flex flex-col justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className="heading text-emerald-700 text-sm">{match.name}</p>
                              {match.matchScore && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                  {match.matchScore} match
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 font-light">
                              {match.age} years, {match.education}
                            </p>
                            <p className="text-xs text-gray-600 font-light">{match.occupation}</p>
                            <p className="text-xs text-gray-600 font-light">{match.contactNumber}</p>
                          </div>
                          <div className="text-xs text-gray-500 font-light mt-2">
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
                    <div className="text-center py-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-gray-400 text-lg">💔</span>
                      </div>
                      <p className="text-sm text-gray-600 font-light">No matches found</p>
                      <p className="text-xs text-gray-500 font-light mt-1">
                        Try adjusting the requirements or add more profiles
                      </p>
                    </div>
                  )}
                </div>
              )}

              {matchesLoading && (
                <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600 font-light text-sm">Finding matches...</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 flex flex-col gap-2">
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
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2.5 rounded-md transition-colors text-sm font-light"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal - Mobile Optimized */}
      <EditProfileModal
        isOpen={isEditingProfile && !!editData}
        editData={editData!}
        editingProfile={editingProfile}
        saving={saving}
        message={editMessage}
        onClose={handleCancelEdit}
        onSave={handleSaveProfile}
        onDelete={handleDeleteProfile}
        onInputChange={handleInputChange}
        onImageClick={(imageUrl, imageName) => {
          setSelectedImage(imageUrl);
          setSelectedImageName(imageName);
          setShowImageModal(true);
        }}
      >
        <EditProfileFormAdmin 
          editData={editData!}
          handleInputChange={handleInputChange}
          onImageClick={(imageUrl, imageName) => {
            setSelectedImage(imageUrl);
            setSelectedImageName(imageName);
            setShowImageModal(true);
          }}
        />
      </EditProfileModal>

      {/* Client Access Modal */}
      <ClientModal
        isOpen={showClientModal}
        formData={clientFormData}
        message={clientMessage}
        onClose={() => {
          setShowClientModal(false);
          setClientMessage(null);
        }}
        onSubmit={handleCreateClient}
        onFormChange={(field, value) => setClientFormData({ ...clientFormData, [field]: value })}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteConfirm && !!profileToDelete}
        title="Delete Profile"
        message="Are you sure you want to delete this profile? This action cannot be undone."
        itemName={profileToDelete?.name || ''}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      {/* Client Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showClientDeleteConfirm && !!clientToDelete}
        title="Delete Client Access"
        message={`Are you sure you want to delete client access for this account? Email: ${clientToDelete?.email || ''}`}
        itemName={clientToDelete?.name || ''}
        isDeleting={isDeletingClient}
        onConfirm={handleDeleteClient}
        onCancel={() => {
          setShowClientDeleteConfirm(false);
          setClientToDelete(null);
        }}
      />

      {/* Image Modal */}
      <ImageModal 
        isOpen={showImageModal}
        imageUrl={selectedImage}
        imageName={selectedImageName}
        onClose={() => setShowImageModal(false)}
      />
    </div>
  );
}

// Edit Profile Form Component for Admin
function EditProfileFormAdmin({ 
  editData, 
  handleInputChange,
  onImageClick
}: {
  editData: Profile;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onImageClick: (imageUrl: string, imageName: string) => void;
}) {
  const inputClasses = "w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400/50 focus:border-emerald-400 transition-colors duration-200 touch-manipulation font-light";
  const selectClasses = "w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400/50 focus:border-emerald-400 transition-colors duration-200 touch-manipulation font-light bg-white";
  const textareaClasses = "w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400/50 focus:border-emerald-400 transition-colors duration-200 touch-manipulation font-light resize-none";

  return (
    <div className="space-y-6">
      <EditFormSubmissionDetails 
        editData={editData}
        handleInputChange={handleInputChange}
        inputClasses={inputClasses}
        selectClasses={selectClasses}
      />
      
      <EditFormPersonalInfo 
        editData={editData}
        handleInputChange={handleInputChange}
        onImageClick={onImageClick}
        inputClasses={inputClasses}
        selectClasses={selectClasses}
      />
      
      <EditFormEducationCareer 
        editData={editData}
        handleInputChange={handleInputChange}
        inputClasses={inputClasses}
        selectClasses={selectClasses}
      />
      
      <EditFormContactInfo 
        editData={editData}
        handleInputChange={handleInputChange}
        inputClasses={inputClasses}
      />
      
      <EditFormFamilyDetails 
        editData={editData}
        handleInputChange={handleInputChange}
        inputClasses={inputClasses}
        textareaClasses={textareaClasses}
      />
      
      <EditFormPartnerRequirements 
        editData={editData}
        handleInputChange={handleInputChange}
        inputClasses={inputClasses}
      />
    </div>
  );
}

// Removed duplicate inline code - now using modular components
// This function is complete and uses 6 sub-components:
// 1. EditFormSubmissionDetails
// 2. EditFormPersonalInfo  
// 3. EditFormEducationCareer
// 4. EditFormContactInfo
// 5. EditFormFamilyDetails
// 6. EditFormPartnerRequirements
