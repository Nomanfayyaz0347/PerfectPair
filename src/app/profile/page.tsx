'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
  maslak: string;
  maritalStatus: 'Single' | 'Divorced' | 'Widowed' | 'Separated';
  motherTongue: string;
  belongs: string;
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
  houseType: 'Own House' | 'Rent' | 'Family House' | 'Apartment';
  country: string;
  city: string;
  contactNumber: string;
  photoUrl?: string;
  email?: string;
  requirements: {
    ageRange: { min: number; max: number };
    heightRange: { min: string; max: string };
    education: string;
    occupation: string;
    familyType: string;
    location: string[];
    cast: string[];
    maslak: string[];
    maritalStatus: string[];
    motherTongue: string[];
    belongs: string[];
    houseType: string[];
  };
}

function ProfilePageContent() {
  const searchParams = useSearchParams();
  const profileId = searchParams.get('id');
  
  // SWR fetcher
  const fetcher = (url: string) => fetch(url).then(res => res.json());
  
  // Use SWR for profile data
  const { data: profileData, mutate: refreshProfile } = useSWR(
    profileId ? `/api/profiles?id=${profileId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 30000, // Cache for 30 seconds
    }
  );
  
  const profile = profileData?.profiles?.[0] || null;
  const loading = !profileData && profileId !== null;
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const inputClasses = "w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400/50 focus:border-emerald-400 transition-colors duration-200 font-light";
  const selectClasses = "w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400/50 focus:border-emerald-400 transition-colors duration-200 font-light bg-white";
  const textareaClasses = "w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400/50 focus:border-emerald-400 transition-colors duration-200 font-light resize-none";

  useEffect(() => {
    if (profile && !editData) {
      setEditData(profile);
    }
  }, [profile, editData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

  const handleSave = async () => {
    if (!editData || !profileId) return;
    
    setSaving(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/profiles', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId: profileId,
          ...editData
        })
      });

      const data = await response.json();
      
      if (data.success) {
        await refreshProfile(); // Refresh from server
        setIsEditing(false);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(profile);
    setIsEditing(false);
    setMessage(null);
  };

  const handleDelete = async () => {
    if (!profile) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/profiles/${profile._id}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile deleted successfully!' });
        // Redirect to home page after successful deletion
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.error || 'Failed to delete profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error deleting profile' });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100/50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100/50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-gray-800 mb-4">Profile Not Found</h1>
          <Link href="/" className="text-emerald-600 hover:text-emerald-700">
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100/50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-md mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">💕</span>
              </div>
              <h1 className="text-lg font-bold text-gray-900">
                PerfectPair
              </h1>
            </div>
            
            <nav className="flex items-center space-x-2">
              <Link href="/" className="text-gray-600 active:text-emerald-600 px-2 py-1.5 rounded-lg active:bg-gray-50 transition-all text-xs">
                Home
              </Link>
              <Link href="/admin" className="text-gray-600 active:text-teal-600 px-2 py-1.5 rounded-lg active:bg-gray-50 transition-all text-xs">
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Edit Profile Popup Modal - Same Design as Form Page */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
              
              {/* Modal Header - Same as Form Page */}
              <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 p-6">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white text-lg">💕</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl text-gray-900 tracking-wide heading">
                      PerfectPair
                    </h1>
                  </div>
                  <h2 className="text-lg sm:text-xl text-gray-800 mb-2 heading">Edit Your Profile</h2>
                  <p className="text-sm sm:text-base text-gray-600 font-light tracking-wide">
                    Update your information to find better matches
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-2 rounded-lg transition-all font-light shadow-md hover:shadow-lg disabled:opacity-50 text-sm"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
                
                {message && (
                  <div className={`mt-4 p-3 rounded-lg text-sm ${
                    message.type === 'success' 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {message.text}
                  </div>
                )}
              </div>

              {/* Modal Body - Scrollable Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
                <EditProfileForm 
                  editData={editData!}
                  handleInputChange={handleInputChange}
                  inputClasses={inputClasses}
                  selectClasses={selectClasses}
                  textareaClasses={textareaClasses}
                />
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-red-600 text-2xl">⚠️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Profile</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this profile? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile View - Same Design as Before */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{profile.name}</h1>
              <p className="text-gray-600">{profile.age} years • {profile.occupation}</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-2 rounded-lg transition-all font-light shadow-md hover:shadow-lg"
              >
                Edit Profile
              </button>
              
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg transition-all font-light shadow-md hover:shadow-lg"
              >
                🗑️ Delete Profile
              </button>
            </div>
          </div>
        </div>

        <ViewProfile profile={profile} />
      </div>
    </div>
  );
}

// View Profile Component
function ViewProfile({ profile }: { profile: Profile }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">👤 Personal Information</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Name:</span>
            <span className="font-medium">{profile.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Father&apos;s Name:</span>
            <span className="font-medium">{profile.fatherName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Age:</span>
            <span className="font-medium">{profile.age} years</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Gender:</span>
            <span className="font-medium">{profile.gender}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Height:</span>
            <span className="font-medium">{profile.height}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Weight:</span>
            <span className="font-medium">{profile.weight}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Complexion:</span>
            <span className="font-medium">{profile.color}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Cast:</span>
            <span className="font-medium">{profile.cast}</span>
          </div>
          {profile.maslak && (
            <div className="flex justify-between">
              <span className="text-gray-600">Maslak:</span>
              <span className="font-medium">{profile.maslak}</span>
            </div>
          )}
          {profile.maritalStatus && (
            <div className="flex justify-between">
              <span className="text-gray-600">Marital Status:</span>
              <span className="font-medium">{profile.maritalStatus}</span>
            </div>
          )}
        </div>
      </div>

      {/* Education & Career */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">🎓 Education & Career</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Education:</span>
            <span className="font-medium">{profile.education}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Occupation:</span>
            <span className="font-medium">{profile.occupation}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Income:</span>
            <span className="font-medium">{profile.income}</span>
          </div>
          {profile.houseType && (
            <div className="flex justify-between">
              <span className="text-gray-600">House Type:</span>
              <span className="font-medium">{profile.houseType}</span>
            </div>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">📱 Contact Information</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Phone:</span>
            <span className="font-medium">{profile.contactNumber}</span>
          </div>
          {profile.email && (
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium break-all">{profile.email}</span>
            </div>
          )}
          {profile.country && (
            <div className="flex justify-between">
              <span className="text-gray-600">Country:</span>
              <span className="font-medium">{profile.country}</span>
            </div>
          )}
          {profile.city && (
            <div className="flex justify-between">
              <span className="text-gray-600">City:</span>
              <span className="font-medium">{profile.city}</span>
            </div>
          )}
          {profile.motherTongue && (
            <div className="flex justify-between">
              <span className="text-gray-600">Mother Tongue:</span>
              <span className="font-medium">{profile.motherTongue}</span>
            </div>
          )}
          {profile.belongs && (
            <div className="flex justify-between">
              <span className="text-gray-600">Nationality:</span>
              <span className="font-medium">{profile.belongs}</span>
            </div>
          )}
        </div>
      </div>

      {/* Family Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">👨‍👩‍👧‍👦 Family Details</h2>
        <div className="space-y-4">
          {/* Parents Status */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className={`w-3 h-3 rounded-full ${profile.fatherAlive ? 'bg-green-500' : 'bg-gray-400'} mr-2`}></span>
              <span className="text-gray-700">Father {profile.fatherAlive ? '(Living)' : '(Deceased)'}</span>
            </div>
            <div className="flex items-center">
              <span className={`w-3 h-3 rounded-full ${profile.motherAlive ? 'bg-green-500' : 'bg-gray-400'} mr-2`}></span>
              <span className="text-gray-700">Mother {profile.motherAlive ? '(Living)' : '(Deceased)'}</span>
            </div>
          </div>

          {/* Siblings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Brothers</h3>
              <div className="flex justify-between text-gray-600">
                <span>Total Brothers:</span>
                <span className="font-medium">{profile.numberOfBrothers}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Married Brothers:</span>
                <span className="font-medium">{profile.numberOfMarriedBrothers}</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Sisters</h3>
              <div className="flex justify-between text-gray-600">
                <span>Total Sisters:</span>
                <span className="font-medium">{profile.numberOfSisters}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Married Sisters:</span>
                <span className="font-medium">{profile.numberOfMarriedSisters}</span>
              </div>
            </div>
          </div>

          {/* Additional Family Details */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Additional Details</h3>
            <p className="text-gray-700">{profile.familyDetails || 'No additional family details provided'}</p>
          </div>
        </div>
      </div>

      {/* Partner Requirements - Full Width */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">💕 Partner Requirements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Age Range:</span>
            <span className="font-medium">
              {profile.requirements.ageRange.min} - {profile.requirements.ageRange.max} years
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Height Range:</span>
            <span className="font-medium">
              {profile.requirements.heightRange.min} - {profile.requirements.heightRange.max}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Education:</span>
            <span className="font-medium">{profile.requirements.education || 'Any'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Occupation:</span>
            <span className="font-medium">{profile.requirements.occupation || 'Any'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Family Type:</span>
            <span className="font-medium">{profile.requirements.familyType || 'Any'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Location:</span>
            <span className="font-medium">
              {Array.isArray(profile.requirements.location) && profile.requirements.location.length > 0
                ? profile.requirements.location.join(', ')
                : 'Any'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Edit Profile Form Component
function EditProfileForm({ 
  editData, 
  handleInputChange, 
  inputClasses, 
  selectClasses, 
  textareaClasses 
}: {
  editData: Profile;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  inputClasses: string;
  selectClasses: string;
  textareaClasses: string;
}) {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl shadow-sm p-6 space-y-6">
      {/* Personal Information */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl">👤</span>
          <h2 className="text-lg sm:text-xl text-gray-800 heading">Personal Information</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-light tracking-wide">Name</label>
            <input
              type="text"
              name="name"
              value={editData.name}
              onChange={handleInputChange}
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-light tracking-wide">Father&apos;s Name</label>
            <input
              type="text"
              name="fatherName"
              value={editData.fatherName}
              onChange={handleInputChange}
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-light tracking-wide">Age</label>
            <input
              type="number"
              name="age"
              value={editData.age}
              onChange={handleInputChange}
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-light tracking-wide">Height</label>
            <input
              type="text"
              name="height"
              value={editData.height}
              onChange={handleInputChange}
              placeholder="e.g., 5'6&quot;"
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-light tracking-wide">Weight</label>
            <input
              type="text"
              name="weight"
              value={editData.weight}
              onChange={handleInputChange}
              placeholder="e.g., 70kg"
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-light tracking-wide">Complexion</label>
            <select
              name="color"
              value={editData.color}
              onChange={handleInputChange}
              className={selectClasses}
            >
              <option value="Fair">Fair</option>
              <option value="Medium">Medium</option>
              <option value="Dark">Dark</option>
              <option value="Very Fair">Very Fair</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-light tracking-wide">Cast</label>
            <input
              type="text"
              name="cast"
              value={editData.cast}
              onChange={handleInputChange}
              className={inputClasses}
            />
          </div>
        </div>
      </div>

      {/* Education & Career */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl">🎓</span>
          <h2 className="text-lg sm:text-xl text-gray-800 heading">Education & Career</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-light tracking-wide">Education</label>
            <input
              type="text"
              name="education"
              value={editData.education}
              onChange={handleInputChange}
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-light tracking-wide">Occupation</label>
            <input
              type="text"
              name="occupation"
              value={editData.occupation}
              onChange={handleInputChange}
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-light tracking-wide">Income</label>
            <input
              type="text"
              name="income"
              value={editData.income}
              onChange={handleInputChange}
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-light tracking-wide">House Type</label>
            <select
              name="houseType"
              value={editData.houseType}
              onChange={handleInputChange}
              className={selectClasses}
            >
              <option value="Own House">Own House</option>
              <option value="Rent">Rent</option>
              <option value="Family House">Family House</option>
              <option value="Apartment">Apartment</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl">📱</span>
          <h2 className="text-lg sm:text-xl text-gray-800 heading">Contact Information</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-light tracking-wide">Phone Number</label>
            <input
              type="text"
              name="contactNumber"
              value={editData.contactNumber}
              onChange={handleInputChange}
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-light tracking-wide">Country</label>
            <input
              type="text"
              name="country"
              value={editData.country}
              onChange={handleInputChange}
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-light tracking-wide">City</label>
            <input
              type="text"
              name="city"
              value={editData.city}
              onChange={handleInputChange}
              className={inputClasses}
            />
          </div>
          {editData.email !== undefined && (
            <div>
              <label className="block text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-light tracking-wide">Email</label>
              <input
                type="email"
                name="email"
                value={editData.email || ''}
                onChange={handleInputChange}
                className={inputClasses}
              />
            </div>
          )}
        </div>
      </div>

      {/* Family Details */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl">👨‍👩‍👧‍👦</span>
          <h2 className="text-lg sm:text-xl text-gray-800 heading">Family Details</h2>
        </div>
        
        <div>
          <label className="block text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-light tracking-wide">Family Details</label>
          <textarea
            name="familyDetails"
            value={editData.familyDetails}
            onChange={handleInputChange}
            rows={4}
            className={textareaClasses}
            placeholder="Tell us about your family..."
          />
        </div>
      </div>

      {/* Partner Requirements */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl">💕</span>
          <h2 className="text-lg sm:text-xl text-gray-800 heading">Partner Requirements</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-light tracking-wide">Age Range</label>
            <input
              type="text"
              name="requirements.ageRange"
              value={`${editData.requirements.ageRange.min}-${editData.requirements.ageRange.max}`}
              onChange={handleInputChange}
              placeholder="e.g., 25-35"
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-light tracking-wide">Height Range</label>
            <input
              type="text"
              name="requirements.heightRange"
              value={`${editData.requirements.heightRange.min}-${editData.requirements.heightRange.max}`}
              onChange={handleInputChange}
              placeholder="e.g., 5.2-6.0"
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-light tracking-wide">Education Preference</label>
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
            <label className="block text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-light tracking-wide">Occupation Preference</label>
            <input
              type="text"
              name="requirements.occupation"
              value={editData.requirements.occupation}
              onChange={handleInputChange}
              placeholder="Any, Doctor, Engineer, etc."
              className={inputClasses}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-light tracking-wide">Family Type Preference</label>
            <input
              type="text"
              name="requirements.familyType"
              value={editData.requirements.familyType}
              onChange={handleInputChange}
              placeholder="Joint, Nuclear, Any"
              className={inputClasses}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrapper component with Suspense boundary
export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100/50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    }>
      <ProfilePageContent />
    </Suspense>
  );
}