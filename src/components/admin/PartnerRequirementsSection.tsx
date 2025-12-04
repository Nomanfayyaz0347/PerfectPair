'use client';

import { Profile } from './types';

interface PartnerRequirementsSectionProps {
  profile: Profile;
}

export default function PartnerRequirementsSection({ profile }: PartnerRequirementsSectionProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
      <h3 className="text-base text-gray-800 heading mb-2">💕 Partner Requirements</h3>
      <div className="divide-y divide-gray-200">
        <div className="flex justify-between items-center py-1.5 px-2">
          <span className="text-xs text-gray-600 heading">Age Range:</span>
          <span className="text-xs text-gray-900 font-light">
            {profile.requirements.ageRange.min} - {profile.requirements.ageRange.max} years
          </span>
        </div>
        <div className="flex justify-between items-center py-1.5 px-2">
          <span className="text-xs text-gray-600 heading">Height Range:</span>
          <span className="text-xs text-gray-900 font-light">
            {profile.requirements.heightRange.min} - {profile.requirements.heightRange.max}
          </span>
        </div>
        <div className="flex justify-between items-center py-1.5 px-2">
          <span className="text-xs text-gray-600 heading">Education:</span>
          <span className="text-xs text-gray-900 font-light">
            {Array.isArray(profile.requirements.education) 
              ? profile.requirements.education.join(', ') 
              : profile.requirements.education || 'Any'}
          </span>
        </div>
        <div className="flex justify-between items-center py-1.5 px-2">
          <span className="text-xs text-gray-600 heading">Occupation:</span>
          <span className="text-xs text-gray-900 font-light">
            {Array.isArray(profile.requirements.occupation) 
              ? profile.requirements.occupation.join(', ') 
              : profile.requirements.occupation || 'Any'}
          </span>
        </div>
        <div className="flex justify-between items-center py-1.5 px-2">
          <span className="text-xs text-gray-600 heading">Family Type:</span>
          <span className="text-xs text-gray-900 font-light">
            {Array.isArray(profile.requirements.familyType) 
              ? profile.requirements.familyType.join(', ') 
              : profile.requirements.familyType || 'Any'}
          </span>
        </div>
        <div className="flex justify-between items-center py-1.5 px-2">
          <span className="text-xs text-gray-600 heading">Location:</span>
          <span className="text-xs text-gray-900 font-light">
            {Array.isArray(profile.requirements.location) 
              ? profile.requirements.location.join(', ') 
              : profile.requirements.location || 'Any'}
          </span>
        </div>
        <div className="flex justify-between items-center py-1.5 px-2">
          <span className="text-xs text-gray-600 heading">Cast:</span>
          <span className="text-xs text-gray-900 font-light">
            {Array.isArray(profile.requirements.cast) 
              ? profile.requirements.cast.join(', ') 
              : profile.requirements.cast || 'Any'}
          </span>
        </div>
        {profile.requirements.maslak && Array.isArray(profile.requirements.maslak) && profile.requirements.maslak.length > 0 && (
          <div className="flex justify-between items-center py-1.5 px-2">
            <span className="text-xs text-gray-600 heading">Maslak:</span>
            <span className="text-xs text-gray-900 font-light">
              {profile.requirements.maslak.join(', ')}
            </span>
          </div>
        )}
        {profile.requirements.maritalStatus && Array.isArray(profile.requirements.maritalStatus) && profile.requirements.maritalStatus.length > 0 && (
          <div className="flex justify-between items-center py-1.5 px-2">
            <span className="text-xs text-gray-600 heading">Marital Status:</span>
            <span className="text-xs text-gray-900 font-light">
              {profile.requirements.maritalStatus.join(', ')}
            </span>
          </div>
        )}
        {profile.requirements.motherTongue && Array.isArray(profile.requirements.motherTongue) && profile.requirements.motherTongue.length > 0 && (
          <div className="flex justify-between items-center py-1.5 px-2">
            <span className="text-xs text-gray-600 heading">Mother Tongue:</span>
            <span className="text-xs text-gray-900 font-light">
              {profile.requirements.motherTongue.join(', ')}
            </span>
          </div>
        )}
        {profile.requirements.belongs && Array.isArray(profile.requirements.belongs) && profile.requirements.belongs.length > 0 && (
          <div className="flex justify-between items-center py-1.5 px-2">
            <span className="text-xs text-gray-600 heading">Belongs:</span>
            <span className="text-xs text-gray-900 font-light">
              {profile.requirements.belongs.join(', ')}
            </span>
          </div>
        )}
        {profile.requirements.houseType && Array.isArray(profile.requirements.houseType) && profile.requirements.houseType.length > 0 && (
          <div className="flex justify-between items-center py-1.5 px-2">
            <span className="text-xs text-gray-600 heading">House Type:</span>
            <span className="text-xs text-gray-900 font-light">
              {profile.requirements.houseType.join(', ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
