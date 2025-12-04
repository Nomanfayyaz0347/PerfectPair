'use client';

import Link from 'next/link';
import { Profile, getProfileId, getSharedCount } from './types';

interface ProfileCardProps {
  profile: Profile;
  matchCount: number;
  onViewDetails: (profile: Profile) => void;
  onEdit: (profile: Profile) => void;
  onCreateClient: (profile: Profile) => void;
  onStatusChange: (profileId: string, status: string) => void;
  onImageClick: (photoUrl: string, name: string) => void;
}

export default function ProfileCard({
  profile,
  matchCount,
  onViewDetails,
  onEdit,
  onCreateClient,
  onStatusChange,
  onImageClick,
}: ProfileCardProps) {
  const profileId = getProfileId(profile);
  const isActive = profile.status === 'Active' || !profile.status;

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '-';
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return '-';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Active': return 'text-green-500';
      case 'Matched': return 'text-blue-500';
      case 'Engaged': return 'text-purple-500';
      case 'Married': return 'text-pink-500';
      case 'Inactive': return 'text-gray-500';
      default: return 'text-green-500';
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden ${!isActive ? 'opacity-40' : 'opacity-100'}`}>
      <div className="p-3">
        {/* Header with photo and name */}
        <div className="flex items-center space-x-3 mb-2">
          <div className="relative">
            {profile.photoUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={profile.photoUrl}
                alt={`${profile.name}'s photo`}
                className="w-14 h-14 object-cover rounded-full border-2 border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onImageClick(profile.photoUrl!, profile.name);
                }}
                title="Click to view full image"
              />
            ) : (
              <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-300">
                <span className="text-gray-500 text-lg">👤</span>
              </div>
            )}
            {isActive && (
              <div className="absolute -top-1 -left-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{matchCount}</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-lg font-semibold text-gray-900">{profile.name}</h3>
              <span className={`text-sm font-medium ${getStatusColor(profile.status)}`}>
                {profile.status || 'Active'}
              </span>
            </div>
            <p className="text-sm text-gray-500">s/o {profile.fatherName}</p>
          </div>
        </div>

        {/* Info Grid */}
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
        
        {/* Stats Row */}
        <div className="flex justify-between items-center mb-2 border-b border-gray-100 pb-2">
          <div>
            <span className="text-xs font-medium text-emerald-600">Matches:</span>
            <span className="text-xs bg-white px-2 py-0.5 rounded border border-gray-200">
              {isActive ? 
                <span className="font-medium text-emerald-600">{matchCount}</span> : 
                <span className="text-gray-500">Inactive</span>
              }
            </span>
            <div className="mt-1 flex items-center justify-between px-0.5">
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-gray-500">Added:</span>
                <span className="text-[10px] text-gray-700">{formatDate(profile.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-gray-500">Time:</span>
                <span className="text-[10px] text-gray-700">{formatTime(profile.createdAt)}</span>
              </div>
            </div>
          </div>
          <div>
            <span className="text-sm font-medium text-purple-600">Shared:</span>
            <span className="ml-1 text-sm text-gray-900">{getSharedCount(profile)} shared</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2.5 mb-2">
          <button
            onClick={() => onViewDetails(profile)}
            className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-medium py-2.5 rounded-md transition-colors border border-emerald-200"
          >
            View
          </button>
          
          <button
            onClick={() => onEdit(profile)}
            className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-medium py-2.5 rounded-md transition-colors border border-blue-200"
          >
            Edit
          </button>
          
          <button
            onClick={() => onCreateClient(profile)}
            className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-600 text-xs font-medium py-2.5 rounded-md transition-colors border border-purple-200"
            title="Give client access to view their matches"
          >
            👤 Client
          </button>

          <Link
            href={`/matches?id=${profileId}&name=${encodeURIComponent(profile.name)}`}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold py-2.5 text-center transition-colors rounded-md shadow-sm"
          >
            Matches
          </Link>
        </div>

        {/* Status & Badge Row */}
        <div className="flex gap-3 items-stretch">
          <div className="w-[35%]">
            <label className="block text-xs text-gray-600 mb-1">Status</label>
            <select 
              value={profile.status || 'Active'}
              onChange={(e) => {
                const newStatus = e.target.value;
                if (newStatus !== (profile.status || 'Active')) {
                  onStatusChange(profileId, newStatus);
                }
              }}
              className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            >
              <option value="Active">🟢 Active</option>
              <option value="Matched">🔵 Matched</option>
              <option value="Engaged">🟣 Engaged</option>
              <option value="Married">💍 Married</option>
              <option value="Inactive">⚫ Inactive</option>
            </select>
          </div>

          <div className="w-[65%]">
            <label className="block text-xs text-gray-600 mb-1">Submitted By</label>
            <div className="w-full bg-gray-50 rounded px-2 py-1.5 border border-gray-200 min-h-[27px] flex items-center">
              {profile.submittedBy ? (
                <div className="flex items-center gap-2 w-full overflow-hidden">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                    profile.submittedBy === 'Main Admin' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {profile.submittedBy === 'Main Admin' ? '👑' : '🤝'}
                    {profile.submittedBy}
                  </span>
                  {profile.matchmakerName && (
                    <span className="text-[10px] text-gray-500 truncate">
                      {profile.matchmakerName}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-xs text-gray-400">-</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
