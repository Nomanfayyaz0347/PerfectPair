'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Profile, getProfileId, getSharedCount } from './types';

interface ProfileCardProps {
  profile: Profile;
  profileMatches: Record<string, number>;
  onViewDetails: () => void;
  onEdit: () => void;
  onCreateClient: () => void;
  onStatusChange: (status: string) => void;
  onImageClick: (imageUrl: string, imageName: string) => void;
}

export default function ProfileCard({
  profile,
  profileMatches,
  onViewDetails,
  onEdit,
  onCreateClient,
  onStatusChange,
  onImageClick
}: ProfileCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className={`bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all duration-200 ${(profile.status && profile.status !== 'Active') ? 'opacity-40' : 'opacity-100'} ${isExpanded ? 'shadow-md border-emerald-300' : ''}`}
    >
      {/* Header - Always Visible */}
      <div 
        className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="relative flex-shrink-0">
            {profile.photoUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={profile.photoUrl}
                alt={`${profile.name}'s photo`}
                className="w-12 h-12 object-cover rounded-full border-2 border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onImageClick(profile.photoUrl!, profile.name);
                }}
                title="Click to view full image"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-300">
                <span className="text-gray-500 text-base">👤</span>
              </div>
            )}
            {(profile.status === 'Active' || !profile.status) && (
              <div className="absolute -top-1 -left-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">
                  {profileMatches[getProfileId(profile)] || 0}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-semibold text-gray-900 truncate">{profile.name}</h3>
              <span className={`text-xs font-medium flex-shrink-0 ${
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
            <p className="text-xs text-gray-500 truncate">{profile.age} years • {profile.gender} • {profile.cast}</p>
          </div>
          
          {/* Expand/Collapse Icon */}
          <div className="flex-shrink-0">
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
      <div className="p-3 pt-2 border-t border-gray-100">
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
        
        {/* Stats */}
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

        {/* Buttons Row */}
        <div className="flex space-x-2.5 mb-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-medium py-2.5 rounded-md transition-colors border border-emerald-200"
          >
            View
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-medium py-2.5 rounded-md transition-colors border border-blue-200"
          >
            Edit
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCreateClient();
            }}
            className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-600 text-xs font-medium py-2.5 rounded-md transition-colors border border-purple-200"
            title="Give client access to view their matches"
          >
            👤 Client
          </button>

          <Link
            href={`/matches?id=${getProfileId(profile)}&name=${encodeURIComponent(profile.name)}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold py-2.5 text-center transition-colors rounded-md shadow-sm"
          >
            Matches
          </Link>
        </div>

        {/* Status & Badge Row */}
        <div className="flex gap-3 items-stretch">
          <div className="w-[35%]" onClick={(e) => e.stopPropagation()}>
            <label className="block text-xs text-gray-600 mb-1">
              Status
            </label>
            <select 
              value={profile.status || 'Active'}
              onChange={(e) => {
                const newStatus = e.target.value;
                if (newStatus !== (profile.status || 'Active')) {
                  onStatusChange(newStatus);
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
      )}
    </div>
  );
}
