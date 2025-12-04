'use client';

import { Profile } from './types';

interface FamilyDetailsSectionProps {
  profile: Profile;
}

export default function FamilyDetailsSection({ profile }: FamilyDetailsSectionProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
      <h3 className="text-base text-gray-800 heading mb-2">👨‍👩‍👧‍👦 Family Details</h3>
      <div className="space-y-3">
        {/* Parents Status */}
        <div className="flex flex-wrap gap-3 px-2">
          <div className="flex items-center">
            <span className={`w-2.5 h-2.5 rounded-full ${profile.fatherAlive ? 'bg-green-500' : 'bg-gray-400'} mr-2`}></span>
            <span className="text-xs text-gray-700 font-light">Father {profile.fatherAlive ? 'Alive' : 'Not Alive'}</span>
          </div>
          <div className="flex items-center">
            <span className={`w-2.5 h-2.5 rounded-full ${profile.motherAlive ? 'bg-green-500' : 'bg-gray-400'} mr-2`}></span>
            <span className="text-xs text-gray-700 font-light">Mother {profile.motherAlive ? 'Alive' : 'Not Alive'}</span>
          </div>
        </div>

        {/* Siblings */}
        <div className="grid grid-cols-2 gap-3 px-2">
          <div>
            <h4 className="text-xs text-gray-600 mb-1">Brothers</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Total:</span>
                <span className="text-xs text-gray-900 font-light">{profile.numberOfBrothers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Married:</span>
                <span className="text-xs text-gray-900 font-light">{profile.numberOfMarriedBrothers}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-xs text-gray-600 mb-1">Sisters</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Total:</span>
                <span className="text-xs text-gray-900 font-light">{profile.numberOfSisters}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Married:</span>
                <span className="text-xs text-gray-900 font-light">{profile.numberOfMarriedSisters}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="px-2">
          <h4 className="text-xs text-gray-600 mb-1">Additional Details</h4>
          <p className="text-xs text-gray-900 font-light leading-relaxed">
            {profile.familyDetails || 'No additional family details provided'}
          </p>
        </div>
      </div>
    </div>
  );
}
