'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import useSWR from 'swr';

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
  fatherAlive: boolean;
  motherAlive: boolean;
  numberOfBrothers: number;
  numberOfMarriedBrothers: number;
  numberOfSisters: number;
  numberOfMarriedSisters: number;
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
  submittedBy?: 'Main Admin' | 'Partner Matchmaker';
  matchmakerName?: string;
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

interface ClientAccess {
  _id: string;
  email: string;
  name: string;
  profileId: {
    _id: string;
    name: string;
    gender: string;
    age: number;
  } | string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // SWR fetcher function
  const fetcher = (url: string) => fetch(url).then(res => res.json());
  
  // Use SWR for profiles with caching
  const { data: profilesData, error: profilesError, mutate: refreshProfiles } = useSWR(
    session ? '/api/profiles?limit=1000' : null,
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
    return profilesData?.profiles || profilesData || [];
  }, [profilesData]);
  
  const loading = !profilesData && !profilesError;
  
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [matches, setMatches] = useState<Profile[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // Cache match counts - persist in localStorage with expiry
  const [profileMatches, setProfileMatches] = useState<Record<string, number>>(() => {
    // Load from localStorage on mount
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('profileMatchCounts');
      const cacheTime = localStorage.getItem('profileMatchCounts_timestamp');
      
      if (cached && cacheTime) {
        try {
          const timestamp = parseInt(cacheTime);
          const now = Date.now();
          // Cache valid for 30 seconds - shorter to catch new matches faster
          if (now - timestamp < 30 * 1000) {
            return JSON.parse(cached);
          } else {
            // Cache expired, clear it
            localStorage.removeItem('profileMatchCounts');
            localStorage.removeItem('profileMatchCounts_timestamp');
          }
        } catch {
          return {};
        }
      }
    }
    return {};
  });
  
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
          
          // Clear match counts cache when status changes
          setProfileMatches({});
          localStorage.removeItem('profileMatchCounts');
          localStorage.removeItem('profileMatchCounts_timestamp');
          
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
    
    // Load match counts when profiles are loaded (only once per session)
    // Use longer delay and larger batches for better perceived performance
    if (profiles.length > 0 && Object.keys(profileMatches).length === 0) {
      const activeProfiles = profiles.filter((p: Profile) => p.status === 'Active' || !p.status);
      
      // Batch load match counts with delays to prevent server overload
      setTimeout(async () => {
        const batchSize = 5; // Increased batch size from 3 to 5
        for (let i = 0; i < activeProfiles.length; i += batchSize) {
          const batch = activeProfiles.slice(i, i + batchSize);
          
          // Parallel fetch for this batch
          const batchPromises = batch.map(async (profile: Profile) => {
            try {
              const profileId = getProfileId(profile);
              const response = await fetch(`/api/profiles/${profileId}/matches`);
              
              if (response.ok) {
                const data = await response.json();
                return { profileId, count: data.matches?.length || 0 };
              }
              return { profileId, count: 0 };
            } catch {
              return { profileId: getProfileId(profile), count: 0 };
            }
          });
          
          const results = await Promise.all(batchPromises);
          
          // Update state progressively for better UX
          setProfileMatches(prev => ({
            ...prev,
            ...Object.fromEntries(results.map(r => [r.profileId, r.count]))
          }));
          
          // Reduced delay between batches from 200ms to 100ms
          if (i + batchSize < activeProfiles.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      }, 500); // Reduced initial delay from 1000ms to 500ms
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
      console.error('Error creating client:', error);
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
      console.error('Error deleting client:', error);
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

      <div className="max-w-md mx-auto px-4 py-4">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            <h2 className="text-base font-semibold text-gray-900">Search & Filters</h2>
            <div className="text-emerald-600 transition-transform duration-200" style={{ transform: isFiltersOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {isFiltersOpen && (
            <div className="mt-4">
              <div className="space-y-3 mb-4">
            <input
              type="text"
              name="search"
              placeholder="Search by name..."
              value={filters.search}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                name="ageMin"
                placeholder="Min Age"
                value={filters.ageMin}
                onChange={handleFilterChange}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
              <input
                type="number"
                name="ageMax"
                placeholder="Max Age"
                value={filters.ageMax}
                onChange={handleFilterChange}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <input
              type="text"
              name="education"
              placeholder="Education"
              value={filters.education}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
            <input
              type="text"
              name="occupation"
              placeholder="Occupation"
              value={filters.occupation}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
            <select
              name="submittedBy"
              value={filters.submittedBy}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            >
              <option value="">All Submissions</option>
              <option value="Main Admin">Direct Clients</option>
              <option value="Partner Matchmaker">Partner Clients</option>
            </select>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={applyFilters}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 active:from-emerald-600 active:to-teal-700 text-white px-4 py-2 rounded-lg transition-all shadow-md active:scale-95 text-sm"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="flex-1 bg-gray-500 active:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors text-sm active:scale-95"
            >
              Clear
            </button>
          </div>
            </div>
          )}
        </div>

        {/* Compare Button */}
        <div className="mb-4">
          <Link
            href="/compare"
            className="flex items-center justify-center space-x-2 bg-blue-500 active:bg-blue-600 text-white px-4 py-2.5 rounded-lg transition-colors text-sm shadow-md active:scale-95 w-full"
          >
            <span>🔄</span>
            <span>Compare Profiles</span>
          </Link>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-4">
          <div className="flex gap-2 p-3">
            <button
              onClick={() => setActiveTab('profiles')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all active:scale-95 ${
                activeTab === 'profiles'
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-gray-100 text-gray-700 active:bg-gray-200'
              }`}
            >
              Profiles ({profiles.length})
            </button>
            <button
              onClick={() => setActiveTab('clients')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all active:scale-95 ${
                activeTab === 'clients'
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-100 text-gray-700 active:bg-gray-200'
              }`}
            >
              Client Access ({clients.length})
            </button>
          </div>
        </div>

        {activeTab === 'profiles' ? (
          <>
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-lg shadow-md p-3">
            <div className="text-xl font-bold text-emerald-600">{profiles.length}</div>
            <div className="text-gray-600 text-xs">Total Profiles</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-3">
            <div className="text-xl font-bold text-teal-600">{profiles.filter((p: Profile) => p.age >= 18 && p.age <= 25).length}</div>
            <div className="text-gray-600 text-xs">Young (18-25)</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-3">
            <div className="text-xl font-bold text-emerald-500">{profiles.filter((p: Profile) => p.age >= 26 && p.age <= 35).length}</div>
            <div className="text-gray-600 text-xs">Adults (26-35)</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-3">
            <div className="text-xl font-bold text-teal-500">{profiles.filter((p: Profile) => p.age > 35).length}</div>
            <div className="text-gray-600 text-xs">Mature (35+)</div>
          </div>
        </div>

        {/* Profiles List */}
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
            <>
              {/* Mobile Card View */}
              <div>
                <div className="space-y-3">
                  {profiles.map((profile: Profile) => (
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
                                <span className="text-white text-xs font-bold">
                                  {profileMatches[getProfileId(profile)] || 0}
                                </span>
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
                            <span className="text-xs font-medium text-emerald-600">Matches:</span>
                            <span className="text-xs bg-white px-2 py-0.5 rounded border border-gray-200">
                              {(profile.status === 'Active' || !profile.status) ? 
                                <span className="font-medium text-emerald-600">{profileMatches[getProfileId(profile)] || 0}</span> : 
                                <span className="text-gray-500">Inactive</span>
                              }
                            </span>
                            <div className="mt-1 flex items-center justify-between px-0.5">
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] text-gray-500">Added:</span>
                                <span className="text-[10px] text-gray-700">
                                  {profile.createdAt ? (() => {
                                    try {
                                      const date = new Date(profile.createdAt);
                                      if (isNaN(date.getTime())) return '-';
                                      return date.toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                      });
                                    } catch {
                                      return '-';
                                    }
                                  })() : '-'}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] text-gray-500">Time:</span>
                                <span className="text-[10px] text-gray-700">
                                  {profile.createdAt ? (() => {
                                    try {
                                      const date = new Date(profile.createdAt);
                                      if (isNaN(date.getTime())) return '-';
                                      return date.toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true
                                      });
                                    } catch {
                                      return '-';
                                    }
                                  })() : '-'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-purple-600">Shared:</span>
                            <span className="ml-1 text-sm text-gray-900">{getSharedCount(profile)} shared</span>
                          </div>
                        </div>

                        {/* Buttons Row - Three button layout */}
                        <div className="flex space-x-2.5 mb-2">
                          {/* View Details Button */}
                          <button
                            onClick={() => setSelectedProfile(profile)}
                            className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-medium py-2.5 rounded-md transition-colors border border-emerald-200"
                          >
                            View
                          </button>
                          
                          {/* Edit Profile Button */}
                          <button
                            onClick={() => handleEditProfile(profile)}
                            className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-medium py-2.5 rounded-md transition-colors border border-blue-200"
                          >
                            Edit
                          </button>
                          
                          {/* Create Client Access Button */}
                          <button
                            onClick={() => openClientModal(profile)}
                            className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-600 text-xs font-medium py-2.5 rounded-md transition-colors border border-purple-200"
                            title="Give client access to view their matches"
                          >
                            👤 Client
                          </button>

                          {/* View All Matches Button */}
                          <Link
                            href={`/matches?id=${getProfileId(profile)}&name=${encodeURIComponent(profile.name)}`}
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold py-2.5 text-center transition-colors rounded-md shadow-sm"
                          >
                            Matches
                          </Link>
                        </div>

                        {/* Status & Badge Row - 35-65 split */}
                        <div className="flex gap-3 items-stretch">
                          {/* Status Dropdown - 35% */}
                          <div className="w-[35%]">
                            <label className="block text-xs text-gray-600 mb-1">
                              Status
                            </label>
                            <select 
                              value={profile.status || 'Active'}
                              onChange={(e) => {
                                const newStatus = e.target.value as 'Active' | 'Matched' | 'Engaged' | 'Married' | 'Inactive';
                                if (newStatus !== (profile.status || 'Active')) {
                                  updateProfileStatus(getProfileId(profile), newStatus);
                                }
                              }}
                              className={`w-full px-2 py-1.5 text-xs border border-gray-200 rounded focus:ring-emerald-500 focus:border-emerald-500 bg-white ${
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

                          {/* Submitted By - 65% */}
                          <div className="w-[65%]">
                            <label className="block text-xs text-gray-600 mb-1">
                              Submitted By
                            </label>
                            <div className="w-full bg-gray-50 rounded px-2 py-1.5 border border-gray-200 min-h-[27px] flex items-center">
                              {profile.submittedBy ? (
                                <div className="flex items-center gap-2 w-full overflow-hidden">
                                  <span className={`inline-flex items-center shrink-0 px-1.5 py-0.5 rounded text-[11px] font-medium ${
                                    profile.submittedBy === 'Main Admin' 
                                      ? 'bg-blue-50 text-blue-700' 
                                      : 'bg-green-50 text-green-700'
                                  }`}>
                                    {profile.submittedBy === 'Main Admin' ? '👤 Direct' : '🤝 Partner'}
                                  </span>
                                  {profile.submittedBy === 'Partner Matchmaker' && profile.matchmakerName && (
                                    <span className="text-[11px] text-gray-500 truncate">
                                      {profile.matchmakerName}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-gray-50 text-gray-600">
                                  ❓ Not specified
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        </>
        ) : (
          /* Client Access Tab */
          <div className="bg-white rounded-xl shadow-lg">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">Client Access Accounts</h2>
            </div>
            
            {clientsLoading ? (
              <div className="p-6 text-center">
                <div className="flex items-center justify-center space-x-1 mb-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <p className="text-sm text-gray-600">Loading clients...</p>
              </div>
            ) : clients.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 text-2xl">👥</span>
                </div>
                <p className="font-medium mb-2">No Client Access Created Yet</p>
                <p className="text-sm">Create client access from any profile to let them view their matches</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {clients.map((client: ClientAccess) => (
                  <div key={client._id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-sm font-semibold text-gray-900">{client.name}</h3>
                          {client.isActive ? (
                            <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>
                          ) : (
                            <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Inactive</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-2">📧 {client.email}</p>
                        {client.profileId && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <span>👤</span>
                            <span>Profile: {typeof client.profileId === 'object' ? client.profileId.name : 'N/A'}</span>
                            {typeof client.profileId === 'object' && (
                              <>
                                <span>•</span>
                                <span>{client.profileId.gender}</span>
                                <span>•</span>
                                <span>{client.profileId.age} yrs</span>
                              </>
                            )}
                          </div>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          Created: {new Date(client.createdAt).toLocaleDateString('en-GB')}
                        </p>
                      </div>
                      <div className="flex-shrink-0 ml-3">
                        <button
                          onClick={() => {
                            setClientToDelete(client);
                            setShowClientDeleteConfirm(true);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors active:scale-95"
                          title="Delete client access"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                        className="w-12 h-12 object-cover rounded-full border-2 border-emerald-300 shadow-sm"
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
                <div className="mb-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">💕</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-emerald-800">Match Analysis</h3>
                        <p className="text-xs text-emerald-600">
                          {(selectedProfile.status === 'Active' || !selectedProfile.status) ? 
                            `${profileMatches[selectedProfile._id]} compatible profiles found` :
                            'No matches available - Profile is Inactive'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-emerald-700">
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
              <div className="space-y-4">
                
                {/* Left Side - Basic Info */}
                <div className="space-y-3 sm:space-y-4">

                  {/* Personal Information */}
                  {/* Personal Information */}
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <h3 className="text-base text-gray-800 heading mb-2">👤 Personal Information</h3>
                    <div className="divide-y divide-gray-200">
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 heading">Name:</span>
                        <span className="text-xs text-gray-900 font-medium">{selectedProfile.name}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 heading">Father&apos;s Name:</span>
                        <span className="text-xs text-gray-900 font-light">{selectedProfile.fatherName}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 heading">Gender:</span>
                        <span className="text-xs text-gray-900 font-light">{selectedProfile.gender}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 heading">Age:</span>
                        <span className="text-xs text-gray-900 font-light">{selectedProfile.age} years</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 heading">Height:</span>
                        <span className="text-xs text-gray-900 font-light">{selectedProfile.height}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 heading">Weight:</span>
                        <span className="text-xs text-gray-900 font-light">{selectedProfile.weight}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 heading">Complexion:</span>
                        <span className="text-xs text-gray-900 font-light">{selectedProfile.color}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 heading">Cast:</span>
                        <span className="text-xs text-gray-900 font-light">{selectedProfile.cast}</span>
                      </div>
                      {selectedProfile.maslak && (
                        <div className="flex justify-between items-center py-1.5 px-2">
                          <span className="text-xs text-gray-600 heading">Maslak:</span>
                          <span className="text-xs text-gray-900 font-light">{selectedProfile.maslak}</span>
                        </div>
                      )}
                      {selectedProfile.maritalStatus && (
                        <div className="flex justify-between items-center py-1.5 px-2">
                          <span className="text-xs text-gray-600 heading">Marital Status:</span>
                          <span className="text-xs text-gray-900 font-light">{selectedProfile.maritalStatus}</span>
                        </div>
                      )}
                      {selectedProfile.motherTongue && (
                        <div className="flex justify-between items-center py-1.5 px-2">
                          <span className="text-xs text-gray-600 heading">Mother Tongue:</span>
                          <span className="text-xs text-gray-900 font-light">{selectedProfile.motherTongue}</span>
                        </div>
                      )}
                      {selectedProfile.belongs && (
                        <div className="flex justify-between items-center py-1.5 px-2">
                          <span className="text-xs text-gray-600 heading">Belongs:</span>
                          <span className="text-xs text-gray-900 font-light">{selectedProfile.belongs}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Professional & Education */}
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <h3 className="text-base text-gray-800 heading mb-2">🎓 Education & Career</h3>
                    <div className="divide-y divide-gray-200">
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 heading">Education:</span>
                        <span className="text-xs text-gray-900 font-light">{selectedProfile.education}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 heading">Occupation:</span>
                        <span className="text-xs text-gray-900 font-light">{selectedProfile.occupation}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 heading">Income:</span>
                        <span className="text-xs text-gray-900 font-light">{selectedProfile.income}</span>
                      </div>
                      {selectedProfile.houseType && (
                        <div className="flex justify-between items-center py-1.5 px-2">
                          <span className="text-xs text-gray-600 heading">House Type:</span>
                          <span className="text-xs text-gray-900 font-light">{selectedProfile.houseType}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <h3 className="text-base text-gray-800 heading mb-2">📱 Contact Information</h3>
                    <div className="divide-y divide-gray-200">
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 heading">Phone:</span>
                        <span className="text-xs text-gray-900 font-light">{selectedProfile.contactNumber}</span>
                      </div>
                      <div className="flex justify-between items-start py-1.5 px-2">
                        <span className="text-xs text-gray-600 heading">Address:</span>
                        <span className="text-xs text-gray-900 font-light text-right max-w-xs">{selectedProfile.address || 'Not provided'}</span>
                      </div>
                      {selectedProfile.email && (
                        <div className="flex justify-between items-center py-1.5 px-2">
                          <span className="text-xs text-gray-600 heading">Email:</span>
                          <span className="text-xs text-gray-900 font-light break-all">{selectedProfile.email}</span>
                        </div>
                      )}
                      {selectedProfile.country && (
                        <div className="flex justify-between items-center py-1.5 px-2">
                          <span className="text-xs text-gray-600 heading">Country:</span>
                          <span className="text-xs text-gray-900 font-light">{selectedProfile.country}</span>
                        </div>
                      )}
                      {selectedProfile.city && (
                        <div className="flex justify-between items-center py-1.5 px-2">
                          <span className="text-xs text-gray-600 heading">City:</span>
                          <span className="text-xs text-gray-900 font-light">{selectedProfile.city}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side - Professional + Requirements */}
                <div className="space-y-3">
                  {/* Professional Information */}
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <h3 className="text-base text-gray-800 heading mb-2">💼 Professional Information</h3>
                    <div className="divide-y divide-gray-200">
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 heading">Education:</span>
                        <span className="text-xs text-gray-900 font-light">{selectedProfile.education}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 heading">Occupation:</span>
                        <span className="text-xs text-gray-900 font-light">{selectedProfile.occupation}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 heading">Income:</span>
                        <span className="text-xs text-gray-900 font-light">{selectedProfile.income}</span>
                      </div>
                    </div>
                  </div>

                  {/* Family Details */}
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <h3 className="text-base text-gray-800 heading mb-2">👨‍👩‍👧‍👦 Family Details</h3>
                    <div className="space-y-3">
                      {/* Parents Status */}
                      <div className="flex flex-wrap gap-3 px-2">
                        <div className="flex items-center">
                          <span className={`w-2.5 h-2.5 rounded-full ${selectedProfile.fatherAlive ? 'bg-green-500' : 'bg-gray-400'} mr-2`}></span>
                          <span className="text-xs text-gray-700 font-light">Father {selectedProfile.fatherAlive ? '(Living)' : '(Deceased)'}</span>
                        </div>
                        <div className="flex items-center">
                          <span className={`w-2.5 h-2.5 rounded-full ${selectedProfile.motherAlive ? 'bg-green-500' : 'bg-gray-400'} mr-2`}></span>
                          <span className="text-xs text-gray-700 font-light">Mother {selectedProfile.motherAlive ? '(Living)' : '(Deceased)'}</span>
                        </div>
                      </div>

                      {/* Siblings */}
                      <div className="grid grid-cols-2 gap-3 px-2">
                        <div>
                          <h4 className="text-xs text-gray-600 mb-1">Brothers</h4>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-600">Total:</span>
                              <span className="text-xs text-gray-900 font-light">{selectedProfile.numberOfBrothers}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-600">Married:</span>
                              <span className="text-xs text-gray-900 font-light">{selectedProfile.numberOfMarriedBrothers}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs text-gray-600 mb-1">Sisters</h4>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-600">Total:</span>
                              <span className="text-xs text-gray-900 font-light">{selectedProfile.numberOfSisters}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-600">Married:</span>
                              <span className="text-xs text-gray-900 font-light">{selectedProfile.numberOfMarriedSisters}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Additional Details */}
                      <div className="px-2">
                        <h4 className="text-xs text-gray-600 mb-1">Additional Details</h4>
                        <p className="text-xs text-gray-900 font-light leading-relaxed">
                          {selectedProfile.familyDetails || 'No additional family details provided'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Partner Requirements */}
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <h3 className="text-base text-gray-800 heading mb-2">💕 Partner Requirements</h3>
                    <div className="divide-y divide-gray-200">
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 heading">Age Range:</span>
                        <span className="text-xs text-gray-900 font-light">
                          {selectedProfile.requirements.ageRange.min} - {selectedProfile.requirements.ageRange.max} years
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 heading">Height Range:</span>
                        <span className="text-xs text-gray-900 font-light">
                          {selectedProfile.requirements.heightRange.min} - {selectedProfile.requirements.heightRange.max}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 heading">Education:</span>
                        <span className="text-xs text-gray-900 font-light">
                          {selectedProfile.requirements.education || 'Any'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 heading">Occupation:</span>
                        <span className="text-xs text-gray-900 font-light">
                          {selectedProfile.requirements.occupation || 'Any'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 heading">Family Type:</span>
                        <span className="text-xs text-gray-900 font-light">
                          {selectedProfile.requirements.familyType || 'Any'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 heading">Location:</span>
                        <span className="text-xs text-gray-900 font-light">
                          {Array.isArray(selectedProfile.requirements.location) 
                            ? selectedProfile.requirements.location.join(', ') || 'Any'
                            : selectedProfile.requirements.location || 'Any'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-xs text-gray-600 heading">Cast:</span>
                        <span className="text-xs text-gray-900 font-light">
                          {Array.isArray(selectedProfile.requirements.cast) 
                            ? selectedProfile.requirements.cast.join(', ') || 'Any'
                            : selectedProfile.requirements.cast || 'Any'}
                        </span>
                      </div>
                      {selectedProfile.requirements.maslak && Array.isArray(selectedProfile.requirements.maslak) && selectedProfile.requirements.maslak.length > 0 && (
                        <div className="flex justify-between items-center py-1.5 px-2">
                          <span className="text-xs text-gray-600 heading">Maslak:</span>
                          <span className="text-xs text-gray-900 font-light">
                            {selectedProfile.requirements.maslak.join(', ')}
                          </span>
                        </div>
                      )}
                      {selectedProfile.requirements.maritalStatus && Array.isArray(selectedProfile.requirements.maritalStatus) && selectedProfile.requirements.maritalStatus.length > 0 && (
                        <div className="flex justify-between items-center py-1.5 px-2">
                          <span className="text-xs text-gray-600 heading">Marital Status:</span>
                          <span className="text-xs text-gray-900 font-light">
                            {selectedProfile.requirements.maritalStatus.join(', ')}
                          </span>
                        </div>
                      )}
                      {selectedProfile.requirements.motherTongue && Array.isArray(selectedProfile.requirements.motherTongue) && selectedProfile.requirements.motherTongue.length > 0 && (
                        <div className="flex justify-between items-center py-1.5 px-2">
                          <span className="text-xs text-gray-600 heading">Mother Tongue:</span>
                          <span className="text-xs text-gray-900 font-light">
                            {selectedProfile.requirements.motherTongue.join(', ')}
                          </span>
                        </div>
                      )}
                      {selectedProfile.requirements.belongs && Array.isArray(selectedProfile.requirements.belongs) && selectedProfile.requirements.belongs.length > 0 && (
                        <div className="flex justify-between items-center py-1.5 px-2">
                          <span className="text-xs text-gray-600 heading">Nationality:</span>
                          <span className="text-xs text-gray-900 font-light">
                            {selectedProfile.requirements.belongs.join(', ')}
                          </span>
                        </div>
                      )}
                      {selectedProfile.requirements.houseType && Array.isArray(selectedProfile.requirements.houseType) && selectedProfile.requirements.houseType.length > 0 && (
                        <div className="flex justify-between items-center py-1.5 px-2">
                          <span className="text-xs text-gray-600 heading">House Type:</span>
                          <span className="text-xs text-gray-900 font-light">
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
      {isEditingProfile && editData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-0">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
            
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
                    type="button"
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
                handleInputChange={handleInputChange}
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

      {/* Client Access Modal */}
      {showClientModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm sm:max-w-md w-full p-4 sm:p-6 mx-2">
            <div className="mb-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-purple-600 text-xl sm:text-2xl">👤</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 text-center">Create Client Access</h3>
              <p className="text-xs sm:text-sm text-gray-600 text-center mb-4">
                Give your client login credentials to view their matches (without contact numbers)
              </p>
            </div>

            {clientMessage && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                clientMessage.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {clientMessage.text}
              </div>
            )}

            <form onSubmit={handleCreateClient} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  value={clientFormData.name}
                  onChange={(e) => setClientFormData({ ...clientFormData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Email (Login ID)
                </label>
                <input
                  type="email"
                  value={clientFormData.email}
                  onChange={(e) => setClientFormData({ ...clientFormData, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                  placeholder="client@example.com"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="text"
                  value={clientFormData.password}
                  onChange={(e) => setClientFormData({ ...clientFormData, password: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                />
                <p className="text-xs text-gray-500 mt-1">Share this password with your client</p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="text-xs text-purple-800">
                  <strong>Note:</strong> Client will be able to view their profile and matches, but contact numbers will be hidden for privacy.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowClientModal(false);
                    setClientMessage(null);
                  }}
                  className="w-full sm:flex-1 px-3 py-2.5 sm:px-4 sm:py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:flex-1 px-3 py-2.5 sm:px-4 sm:py-2 text-sm bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all"
                >
                  Create Client Access
                </button>
              </div>
            </form>
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

      {/* Client Delete Confirmation Modal */}
      {showClientDeleteConfirm && clientToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm sm:max-w-md w-full p-4 sm:p-6 mx-2">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-red-600 text-xl sm:text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Delete Client Access</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                Are you sure you want to delete client access for <strong>{clientToDelete.name}</strong>?
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mb-2">
                <strong>Email:</strong> {clientToDelete.email}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                This will remove their login access. The profile will remain unchanged.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    setShowClientDeleteConfirm(false);
                    setClientToDelete(null);
                  }}
                  disabled={isDeletingClient}
                  className="w-full sm:flex-1 px-3 py-2.5 sm:px-4 sm:py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteClient}
                  disabled={isDeletingClient}
                  className="w-full sm:flex-1 px-3 py-2.5 sm:px-4 sm:py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeletingClient ? 'Deleting...' : 'Delete Access'}
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
      {/* Profile Submission Details */}
      <div>
        <h2 className="text-lg sm:text-xl text-gray-900 mb-4 heading">Profile Submission Details</h2>
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          
          {/* Submission Type - 50/50 Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-blue-500">👤</span> Submitted By
              </label>
              <select
                name="submittedBy"
                value={editData.submittedBy || ''}
                onChange={handleInputChange}
                className={selectClasses}
              >
                <option value="">Not Specified</option>
                <option value="Main Admin">Main Admin (Direct Client)</option>
                <option value="Partner Matchmaker">Partner Matchmaker</option>
              </select>
            </div>

            {/* Matchmaker Name - Only show if Partner Matchmaker is selected */}
            {editData.submittedBy === 'Partner Matchmaker' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-green-500">🤝</span> Matchmaker Name
                </label>
                <input
                  type="text"
                  name="matchmakerName"
                  value={editData.matchmakerName || ''}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="Enter matchmaker's name"
                />
              </div>
            )}
          </div>
          
        </div>
      </div>

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
              <label className="block text-sm font-medium text-gray-700 mb-2">Cast *</label>
              <select
                name="cast"
                value={editData.cast}
                onChange={handleInputChange}
                className={selectClasses}
              >
                <option value="">Select Cast</option>
                {/* Major Casts */}
                <optgroup label="Major Casts">
                  <option value="Rajput">Rajput</option>
                  <option value="Jat">Jat</option>
                  <option value="Gujjar">Gujjar</option>
                  <option value="Awan">Awan</option>
                  <option value="Arain">Arain</option>
                  <option value="Sheikh">Sheikh</option>
                  <option value="Malik">Malik</option>
                  <option value="Chaudhary">Chaudhary</option>
                </optgroup>
                
                {/* Religious/Tribal */}
                <optgroup label="Religious/Tribal">
                  <option value="Syed">Syed</option>
                  <option value="Qureshi">Qureshi</option>
                  <option value="Ansari">Ansari</option>
                  <option value="Mughal">Mughal</option>
                  <option value="Pathan">Pathan</option>
                  <option value="Baloch">Baloch</option>
                </optgroup>
                
                {/* Professional/Occupational */}
                <optgroup label="Professional">
                  <option value="Butt">Butt</option>
                  <option value="Dar">Dar</option>
                  <option value="Lone">Lone</option>
                  <option value="Khan">Khan</option>
                  <option value="Khatri">Khatri</option>
                </optgroup>
                
                {/* Others */}
                <optgroup label="Others">
                  <option value="Kashmiri">Kashmiri</option>
                  <option value="Punjabi">Punjabi</option>
                  <option value="Sindhi">Sindhi</option>
                  <option value="Other">Other</option>
                </optgroup>
              </select>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Maslak (Religious Sect) *</label>
              <select
                name="maslak"
                value={editData.maslak || ''}
                onChange={handleInputChange}
                className={selectClasses}
              >
                <option value="">Select Maslak</option>
                
                {/* Sunni Maslak */}
                <optgroup label="Sunni Islam">
                  <option value="Hanafi">Hanafi</option>
                  <option value="Shafi'i">Shafi&apos;i</option>
                  <option value="Maliki">Maliki</option>
                  <option value="Hanbali">Hanbali</option>
                  <option value="Ahle Hadith">Ahle Hadith (Salafi)</option>
                  <option value="Deobandi">Deobandi</option>
                  <option value="Barelvi">Barelvi</option>
                  <option value="Jamaat-e-Islami">Jamaat-e-Islami</option>
                </optgroup>
                
                {/* Shia Maslak */}
                <optgroup label="Shia Islam">
                  <option value="Twelver Shia">Twelver Shia (Ithna Ashariyya)</option>
                  <option value="Ismaili">Ismaili</option>
                  <option value="Zaidi">Zaidi</option>
                  <option value="Alavi Bohra">Alavi Bohra</option>
                  <option value="Dawoodi Bohra">Dawoodi Bohra</option>
                </optgroup>
                
                {/* Sufi Orders */}
                <optgroup label="Sufi Orders">
                  <option value="Chishti">Chishti</option>
                  <option value="Qadri">Qadri</option>
                  <option value="Naqshbandi">Naqshbandi</option>
                  <option value="Suhrawardi">Suhrawardi</option>
                </optgroup>
                
                {/* Other Islamic Sects */}
                <optgroup label="Other Islamic Sects">
                  <option value="Ahmadiyya">Ahmadiyya</option>
                  <option value="Quranist">Quranist</option>
                  <option value="Non-denominational">Non-denominational Muslim</option>
                </optgroup>
                
                {/* Non-Muslim Options */}
                <optgroup label="Other Religions">
                  <option value="Christian">Christian</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Sikh">Sikh</option>
                  <option value="Other Religion">Other Religion</option>
                </optgroup>
              </select>
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
              <select
                name="motherTongue"
                value={editData.motherTongue || ''}
                onChange={handleInputChange}
                className={selectClasses}
              >
                <option value="">Select Language</option>
                <option value="Urdu">Urdu</option>
                <option value="English">English</option>
                <option value="Punjabi">Punjabi</option>
                <option value="Sindhi">Sindhi</option>
                <option value="Pashto">Pashto</option>
                <option value="Balochi">Balochi</option>
                <option value="Saraiki">Saraiki</option>
                <option value="Hindko">Hindko</option>
                <option value="Kashmiri">Kashmiri</option>
                <option value="Arabic">Arabic</option>
                <option value="Persian">Persian</option>
                <option value="Turkish">Turkish</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Belongs *</label>
              <select
                name="belongs"
                value={editData.belongs || ''}
                onChange={handleInputChange}
                className={selectClasses}
              >
                <option value="">Select Country</option>
                <option value="Pakistan">Pakistan</option>
                <option value="Bangladesh">Bangladesh</option>
                <option value="India">India</option>
                <option value="Afghanistan">Afghanistan</option>
                <option value="Iran">Iran</option>
                <option value="Turkey">Turkey</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="UAE">UAE</option>
                <option value="UK">UK</option>
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Other">Other</option>
              </select>
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
              <option value="Family House">Family House</option>
              <option value="Own House">Own House</option>
              <option value="Rent">Rent</option>
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
        <div className="space-y-4 sm:space-y-6">
          {/* Parents Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Father Status</label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="fatherAlive"
                  name="fatherAlive"
                  checked={editData.fatherAlive}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-emerald-400 focus:ring-emerald-400/50"
                />
                <label htmlFor="fatherAlive" className="text-sm text-gray-600">Father is Living</label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mother Status</label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="motherAlive"
                  name="motherAlive"
                  checked={editData.motherAlive}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-emerald-400 focus:ring-emerald-400/50"
                />
                <label htmlFor="motherAlive" className="text-sm text-gray-600">Mother is Living</label>
              </div>
            </div>
          </div>

          {/* Siblings Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Brothers</h3>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Total Brothers</label>
                  <input
                    type="number"
                    name="numberOfBrothers"
                    value={editData.numberOfBrothers}
                    onFocus={(e) => e.target.value === '0' && (e.target.value = '')}
                    onChange={handleInputChange}
                    min="0"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Married Brothers</label>
                  <input
                    type="number"
                    name="numberOfMarriedBrothers"
                    value={editData.numberOfMarriedBrothers}
                    onFocus={(e) => e.target.value === '0' && (e.target.value = '')}
                    onChange={handleInputChange}
                    min="0"
                    max={editData.numberOfBrothers}
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Sisters</h3>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Total Sisters</label>
                  <input
                    type="number"
                    name="numberOfSisters"
                    value={editData.numberOfSisters}
                    onFocus={(e) => e.target.value === '0' && (e.target.value = '')}
                    onChange={handleInputChange}
                    min="0"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Married Sisters</label>
                  <input
                    type="number"
                    name="numberOfMarriedSisters"
                    value={editData.numberOfMarriedSisters}
                    onFocus={(e) => e.target.value === '0' && (e.target.value = '')}
                    onChange={handleInputChange}
                    min="0"
                    max={editData.numberOfSisters}
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Family Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Family Details</label>
            <textarea
              name="familyDetails"
              rows={3}
              value={editData.familyDetails}
              onChange={handleInputChange}
              className={textareaClasses}
              placeholder="Tell us about additional family background..."
            />
          </div>
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

            {/* Cast Preference */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <span className="text-pink-500">👥</span>
                Cast Preference (comma separated)
              </label>
              <input
                type="text"
                name="requirements.cast"
                value={Array.isArray(editData.requirements.cast) ? editData.requirements.cast.join(', ') : editData.requirements.cast || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  const castArray = value.split(',').map(item => item.trim()).filter(item => item);
                  handleInputChange({
                    target: {
                      name: 'requirements.cast',
                      value: castArray.join(', ')
                    }
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
                placeholder="Same Cast, Any, Rajput, Shaikh"
                className={inputClasses}
              />
            </div>

            {/* Maslak Preference */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <span className="text-pink-500">🕌</span>
                Maslak Preference (comma separated)
              </label>
              <input
                type="text"
                name="requirements.maslak"
                value={Array.isArray(editData.requirements.maslak) ? editData.requirements.maslak.join(', ') : editData.requirements.maslak || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  const maslakArray = value.split(',').map(item => item.trim()).filter(item => item);
                  handleInputChange({
                    target: {
                      name: 'requirements.maslak',
                      value: maslakArray.join(', ')
                    }
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
                placeholder="Sunni, Shia, Any"
                className={inputClasses}
              />
            </div>

            {/* Marital Status Preference */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <span className="text-pink-500">💍</span>
                Preferred Marital Status (comma separated)
              </label>
              <input
                type="text"
                name="requirements.maritalStatus"
                value={Array.isArray(editData.requirements.maritalStatus) ? editData.requirements.maritalStatus.join(', ') : editData.requirements.maritalStatus || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  const statusArray = value.split(',').map(item => item.trim()).filter(item => item);
                  handleInputChange({
                    target: {
                      name: 'requirements.maritalStatus',
                      value: statusArray.join(', ')
                    }
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
                placeholder="Single, Divorced, Widowed"
                className={inputClasses}
              />
            </div>

            {/* Mother Tongue Preference */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <span className="text-pink-500">�️</span>
                Mother Tongue Preference (comma separated)
              </label>
              <input
                type="text"
                name="requirements.motherTongue"
                value={Array.isArray(editData.requirements.motherTongue) ? editData.requirements.motherTongue.join(', ') : editData.requirements.motherTongue || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  const tongueArray = value.split(',').map(item => item.trim()).filter(item => item);
                  handleInputChange({
                    target: {
                      name: 'requirements.motherTongue',
                      value: tongueArray.join(', ')
                    }
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
                placeholder="Urdu, English, Punjabi"
                className={inputClasses}
              />
            </div>

            {/* Nationality/Origin Preference */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <span className="text-pink-500">🌍</span>
                Nationality/Origin Preference (comma separated)
              </label>
              <input
                type="text"
                name="requirements.belongs"
                value={Array.isArray(editData.requirements.belongs) ? editData.requirements.belongs.join(', ') : editData.requirements.belongs || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  const belongsArray = value.split(',').map(item => item.trim()).filter(item => item);
                  handleInputChange({
                    target: {
                      name: 'requirements.belongs',
                      value: belongsArray.join(', ')
                    }
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
                placeholder="Pakistan, Bangladesh, Any"
                className={inputClasses}
              />
            </div>

            {/* House Type Preference */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <span className="text-pink-500">🏡</span>
                House Type Preference (comma separated)
              </label>
              <input
                type="text"
                name="requirements.houseType"
                value={Array.isArray(editData.requirements.houseType) ? editData.requirements.houseType.join(', ') : editData.requirements.houseType || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  const houseArray = value.split(',').map(item => item.trim()).filter(item => item);
                  handleInputChange({
                    target: {
                      name: 'requirements.houseType',
                      value: houseArray.join(', ')
                    }
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
                placeholder="Own House, Rent, Any"
                className={inputClasses}
              />
            </div>

            <p className="text-sm text-gray-600 bg-white/80 p-3 rounded-lg">
              💡 <strong>Tip:</strong> For multiple preferences, separate with commas. Example: &quot;Single, Divorced&quot; or &quot;Same Cast, Any&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
