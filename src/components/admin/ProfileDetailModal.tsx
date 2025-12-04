'use client';

import Link from 'next/link';
import { Profile, getSharedCount } from './types';

interface ProfileDetailModalProps {
  profile: Profile;
  matchCount: number;
  onClose: () => void;
  onImageClick: (photoUrl: string, name: string) => void;
  onDelete: (profile: Profile) => void;
}

export default function ProfileDetailModal({
  profile,
  matchCount,
  onClose,
  onImageClick,
  onDelete,
}: ProfileDetailModalProps) {
  const isActive = profile.status === 'Active' || !profile.status;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-3 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {profile.photoUrl && (
                <div className="flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.photoUrl}
                    alt={`${profile.name}'s profile`}
                    className="w-12 h-12 object-cover rounded-full border-2 border-emerald-300 shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onImageClick(profile.photoUrl!, profile.name);
                    }}
                  />
                </div>
              )}
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-bold text-gray-900">{profile.name}</h2>
                  {profile.submittedBy && (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      profile.submittedBy === 'Main Admin' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {profile.submittedBy === 'Main Admin' ? '👤 Direct' : '🤝 Partner'}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 font-light">{profile.age} years • {profile.occupation}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 active:text-gray-600 p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Match Summary */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">💕</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-emerald-800">Match Analysis</h3>
                  <p className="text-xs text-emerald-600">
                    {isActive ? `${matchCount} compatible profiles found` : 'No matches - Profile is Inactive'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-emerald-700">{isActive ? matchCount : 0}</div>
                  <div className="text-xs text-emerald-600">matches</div>
                </div>
                <div className="text-center">
                  <div className="text-lg text-purple-700">{getSharedCount(profile)}</div>
                  <div className="text-xs text-purple-600">shared</div>
                </div>
              </div>
            </div>
            {matchCount > 0 && isActive && (
              <div className="mt-3">
                <Link
                  href={`/matches?id=${profile._id}&name=${encodeURIComponent(profile.name)}`}
                  className="text-sm bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-full transition-colors inline-block"
                >
                  View All Matches →
                </Link>
              </div>
            )}
          </div>

          {/* Personal Information */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <h3 className="text-base text-gray-800 font-semibold mb-2">👤 Personal Information</h3>
            <div className="divide-y divide-gray-200">
              <InfoRow label="Name" value={profile.name} />
              <InfoRow label="Father's Name" value={profile.fatherName} />
              <InfoRow label="Gender" value={profile.gender} />
              <InfoRow label="Age" value={`${profile.age} years`} />
              <InfoRow label="Height" value={profile.height} />
              <InfoRow label="Weight" value={profile.weight} />
              <InfoRow label="Complexion" value={profile.color} />
              <InfoRow label="Cast" value={profile.cast} />
              {profile.maslak && <InfoRow label="Maslak" value={profile.maslak} />}
              {profile.maritalStatus && <InfoRow label="Marital Status" value={profile.maritalStatus} />}
              {profile.motherTongue && <InfoRow label="Mother Tongue" value={profile.motherTongue} />}
              {profile.belongs && <InfoRow label="Belongs" value={profile.belongs} />}
            </div>
          </div>

          {/* Education & Career */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <h3 className="text-base text-gray-800 font-semibold mb-2">🎓 Education & Career</h3>
            <div className="divide-y divide-gray-200">
              <InfoRow label="Education" value={profile.education} />
              <InfoRow label="Occupation" value={profile.occupation} />
              <InfoRow label="Income" value={profile.income} />
              {profile.houseType && <InfoRow label="House Type" value={profile.houseType} />}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <h3 className="text-base text-gray-800 font-semibold mb-2">📱 Contact Information</h3>
            <div className="divide-y divide-gray-200">
              <InfoRow label="Phone" value={profile.contactNumber} />
              <InfoRow label="Address" value={profile.address || 'Not provided'} />
              {profile.email && <InfoRow label="Email" value={profile.email} />}
              {profile.country && <InfoRow label="Country" value={profile.country} />}
              {profile.city && <InfoRow label="City" value={profile.city} />}
            </div>
          </div>

          {/* Family Details */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <h3 className="text-base text-gray-800 font-semibold mb-2">👨‍👩‍👧‍👦 Family Details</h3>
            <div className="flex flex-wrap gap-3 px-2 mb-3">
              <div className="flex items-center">
                <span className={`w-2.5 h-2.5 rounded-full ${profile.fatherAlive ? 'bg-green-500' : 'bg-gray-400'} mr-2`}></span>
                <span className="text-xs text-gray-700">Father {profile.fatherAlive ? '(Living)' : '(Deceased)'}</span>
              </div>
              <div className="flex items-center">
                <span className={`w-2.5 h-2.5 rounded-full ${profile.motherAlive ? 'bg-green-500' : 'bg-gray-400'} mr-2`}></span>
                <span className="text-xs text-gray-700">Mother {profile.motherAlive ? '(Living)' : '(Deceased)'}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 px-2">
              <div>
                <h4 className="text-xs text-gray-600 mb-1">Brothers</h4>
                <div className="text-xs">Total: {profile.numberOfBrothers}, Married: {profile.numberOfMarriedBrothers}</div>
              </div>
              <div>
                <h4 className="text-xs text-gray-600 mb-1">Sisters</h4>
                <div className="text-xs">Total: {profile.numberOfSisters}, Married: {profile.numberOfMarriedSisters}</div>
              </div>
            </div>
            {profile.familyDetails && (
              <div className="px-2 mt-2">
                <p className="text-xs text-gray-900">{profile.familyDetails}</p>
              </div>
            )}
          </div>

          {/* Partner Requirements */}
          <div className="bg-pink-50 rounded-lg p-3 border border-pink-200">
            <h3 className="text-base text-gray-800 font-semibold mb-2">💕 Partner Requirements</h3>
            <div className="divide-y divide-gray-200">
              <InfoRow label="Age Range" value={`${profile.requirements.ageRange.min} - ${profile.requirements.ageRange.max} years`} />
              <InfoRow label="Height Range" value={`${profile.requirements.heightRange.min} - ${profile.requirements.heightRange.max}`} />
              <InfoRow label="Education" value={profile.requirements.education || 'Any'} />
              <InfoRow label="Occupation" value={profile.requirements.occupation || 'Any'} />
              <InfoRow label="Family Type" value={profile.requirements.familyType || 'Any'} />
              <InfoRow label="Location" value={formatArray(profile.requirements.location)} />
              <InfoRow label="Cast" value={formatArray(profile.requirements.cast)} />
              {profile.requirements.maslak && profile.requirements.maslak.length > 0 && (
                <InfoRow label="Maslak" value={profile.requirements.maslak.join(', ')} />
              )}
              {profile.requirements.maritalStatus && profile.requirements.maritalStatus.length > 0 && (
                <InfoRow label="Marital Status" value={profile.requirements.maritalStatus.join(', ')} />
              )}
            </div>
          </div>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(profile)}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            🗑️ Delete Profile
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper component for info rows
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 px-2">
      <span className="text-xs text-gray-600">{label}:</span>
      <span className="text-xs text-gray-900">{value}</span>
    </div>
  );
}

// Helper to format array values
function formatArray(value: string[] | string): string {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(', ') : 'Any';
  }
  return value || 'Any';
}
