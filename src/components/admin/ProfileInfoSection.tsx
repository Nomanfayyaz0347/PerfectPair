'use client';

import { Profile } from './types';

interface ProfileInfoSectionProps {
  profile: Profile;
}

export default function ProfileInfoSection({ profile }: ProfileInfoSectionProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
      <h3 className="text-base text-gray-800 heading mb-2">👤 Personal Information</h3>
      <div className="divide-y divide-gray-200">
        <div className="flex justify-between items-center py-1.5 px-2">
          <span className="text-xs text-gray-600 heading">Name:</span>
          <span className="text-xs text-gray-900 font-medium">{profile.name}</span>
        </div>
        <div className="flex justify-between items-center py-1.5 px-2">
          <span className="text-xs text-gray-600 heading">Father&apos;s Name:</span>
          <span className="text-xs text-gray-900 font-light">{profile.fatherName}</span>
        </div>
        <div className="flex justify-between items-center py-1.5 px-2">
          <span className="text-xs text-gray-600 heading">Gender:</span>
          <span className="text-xs text-gray-900 font-light">{profile.gender}</span>
        </div>
        <div className="flex justify-between items-center py-1.5 px-2">
          <span className="text-xs text-gray-600 heading">Age:</span>
          <span className="text-xs text-gray-900 font-light">{profile.age} years</span>
        </div>
        <div className="flex justify-between items-center py-1.5 px-2">
          <span className="text-xs text-gray-600 heading">Height:</span>
          <span className="text-xs text-gray-900 font-light">{profile.height}</span>
        </div>
        <div className="flex justify-between items-center py-1.5 px-2">
          <span className="text-xs text-gray-600 heading">Weight:</span>
          <span className="text-xs text-gray-900 font-light">{profile.weight}</span>
        </div>
        <div className="flex justify-between items-center py-1.5 px-2">
          <span className="text-xs text-gray-600 heading">Complexion:</span>
          <span className="text-xs text-gray-900 font-light">{profile.color}</span>
        </div>
        <div className="flex justify-between items-center py-1.5 px-2">
          <span className="text-xs text-gray-600 heading">Cast:</span>
          <span className="text-xs text-gray-900 font-light">{profile.cast}</span>
        </div>
        {profile.maslak && (
          <div className="flex justify-between items-center py-1.5 px-2">
            <span className="text-xs text-gray-600 heading">Maslak:</span>
            <span className="text-xs text-gray-900 font-light">{profile.maslak}</span>
          </div>
        )}
        {profile.maritalStatus && (
          <div className="flex justify-between items-center py-1.5 px-2">
            <span className="text-xs text-gray-600 heading">Marital Status:</span>
            <span className="text-xs text-gray-900 font-light">{profile.maritalStatus}</span>
          </div>
        )}
        {profile.motherTongue && (
          <div className="flex justify-between items-center py-1.5 px-2">
            <span className="text-xs text-gray-600 heading">Mother Tongue:</span>
            <span className="text-xs text-gray-900 font-light">{profile.motherTongue}</span>
          </div>
        )}
        {profile.belongs && (
          <div className="flex justify-between items-center py-1.5 px-2">
            <span className="text-xs text-gray-600 heading">Belongs:</span>
            <span className="text-xs text-gray-900 font-light">{profile.belongs}</span>
          </div>
        )}
      </div>
    </div>
  );
}
