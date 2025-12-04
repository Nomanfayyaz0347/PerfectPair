'use client';

import { Profile } from './types';

interface ContactInfoSectionProps {
  profile: Profile;
}

export default function ContactInfoSection({ profile }: ContactInfoSectionProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
      <h3 className="text-base text-gray-800 heading mb-2">📱 Contact Information</h3>
      <div className="divide-y divide-gray-200">
        <div className="flex justify-between items-center py-1.5 px-2">
          <span className="text-xs text-gray-600 heading">Phone:</span>
          <span className="text-xs text-gray-900 font-light">{profile.contactNumber}</span>
        </div>
        <div className="flex justify-between items-start py-1.5 px-2">
          <span className="text-xs text-gray-600 heading">Address:</span>
          <span className="text-xs text-gray-900 font-light text-right max-w-xs">{profile.address || 'Not provided'}</span>
        </div>
        {profile.email && (
          <div className="flex justify-between items-center py-1.5 px-2">
            <span className="text-xs text-gray-600 heading">Email:</span>
            <span className="text-xs text-gray-900 font-light break-all">{profile.email}</span>
          </div>
        )}
        {profile.country && (
          <div className="flex justify-between items-center py-1.5 px-2">
            <span className="text-xs text-gray-600 heading">Country:</span>
            <span className="text-xs text-gray-900 font-light">{profile.country}</span>
          </div>
        )}
        {profile.city && (
          <div className="flex justify-between items-center py-1.5 px-2">
            <span className="text-xs text-gray-600 heading">City:</span>
            <span className="text-xs text-gray-900 font-light">{profile.city}</span>
          </div>
        )}
      </div>
    </div>
  );
}
