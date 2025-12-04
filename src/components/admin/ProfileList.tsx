'use client';

import Link from 'next/link';
import ProfileCard from './ProfileCard';
import { Profile, getProfileId } from './types';

interface ProfileListProps {
  profiles: Profile[];
  loading: boolean;
  profileMatches: Record<string, number>;
  onViewDetails: (profile: Profile) => void;
  onEdit: (profile: Profile) => void;
  onCreateClient: (profile: Profile) => void;
  onStatusChange: (profileId: string, status: string) => void;
  onImageClick: (photoUrl: string, name: string) => void;
}

export default function ProfileList({
  profiles,
  loading,
  profileMatches,
  onViewDetails,
  onEdit,
  onCreateClient,
  onStatusChange,
  onImageClick,
}: ProfileListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">All Profiles</h2>
        </div>
        <div className="p-6 text-center">
          <div className="flex items-center justify-center space-x-1 mb-3">
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          <p className="text-sm text-gray-600">Loading profiles...</p>
        </div>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">All Profiles</h2>
        </div>
        <div className="p-8 text-center text-gray-500">
          <p>No profiles found.</p>
          <Link href="/form" className="text-emerald-600 active:text-emerald-700 mt-2 inline-block">
            Create the first profile →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-base font-semibold text-gray-900">All Profiles</h2>
      </div>
      <div className="p-3 space-y-3">
        {profiles.map((profile: Profile) => (
          <ProfileCard
            key={getProfileId(profile)}
            profile={profile}
            matchCount={profileMatches[getProfileId(profile)] || 0}
            onViewDetails={onViewDetails}
            onEdit={onEdit}
            onCreateClient={onCreateClient}
            onStatusChange={onStatusChange}
            onImageClick={onImageClick}
          />
        ))}
      </div>
    </div>
  );
}
