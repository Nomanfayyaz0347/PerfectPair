'use client';

import { Profile } from './types';

interface ProfessionalInfoSectionProps {
  profile: Profile;
}

export default function ProfessionalInfoSection({ profile }: ProfessionalInfoSectionProps) {
  return (
    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
      <h3 className="text-base text-gray-800 heading mb-2">🎓 Education & Career</h3>
      <div className="divide-y divide-gray-200">
        <div className="flex justify-between items-center py-1.5 px-2">
          <span className="text-xs text-gray-600 heading">Education:</span>
          <span className="text-xs text-gray-900 font-light">{profile.education}</span>
        </div>
        <div className="flex justify-between items-center py-1.5 px-2">
          <span className="text-xs text-gray-600 heading">Occupation:</span>
          <span className="text-xs text-gray-900 font-light">{profile.occupation}</span>
        </div>
        <div className="flex justify-between items-center py-1.5 px-2">
          <span className="text-xs text-gray-600 heading">Income:</span>
          <span className="text-xs text-gray-900 font-light">{profile.income}</span>
        </div>
        {profile.houseType && (
          <div className="flex justify-between items-center py-1.5 px-2">
            <span className="text-xs text-gray-600 heading">House Type:</span>
            <span className="text-xs text-gray-900 font-light">{profile.houseType}</span>
          </div>
        )}
      </div>
    </div>
  );
}
