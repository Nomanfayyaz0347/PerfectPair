'use client';

import { memo } from 'react';

interface Profile {
  _id: string;
  name: string;
  fatherName: string;
  age: number;
  gender: string;
  education: string;
  occupation: string;
  city: string;
  country: string;
  height?: string;
  weight?: string;
  color?: string;
  cast: string;
  maslak: string;
  maritalStatus: string;
  motherTongue: string;
  belongs: string;
  income?: string;
  fatherAlive: boolean;
  motherAlive: boolean;
  numberOfBrothers: number;
  numberOfMarriedBrothers: number;
  numberOfSisters: number;
  numberOfMarriedSisters: number;
  familyDetails?: string;
  houseType?: string;
  photoUrl?: string;
  status?: string;
  requirements: {
    ageRange: { min: number; max: number };
    heightRange?: { min: string; max: string };
    education: string;
    occupation: string;
    familyType?: string;
    location?: string[];
    cast?: string[];
    maslak?: string[];
    maritalStatus?: string[];
    motherTongue?: string[];
    belongs?: string[];
    houseType?: string[];
  };
}

interface ProfileCardProps {
  profile: Profile;
  isExpanded: boolean;
  onToggle: () => void;
}

const ProfileCard = memo(({ profile, isExpanded, onToggle }: ProfileCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
      {/* Photo - Clickable */}
      <div 
        className="relative h-48 bg-gradient-to-br from-teal-100 to-emerald-100 overflow-hidden cursor-pointer"
        onClick={onToggle}
      >
        {profile.photoUrl ? (
          <>
            <img
              src={profile.photoUrl}
              alt={profile.name}
              className="w-full h-full object-cover blur-lg scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl">
              {profile.gender === 'Male' ? '👨' : '👩'}
            </div>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm">
          <span className="text-xs font-semibold text-gray-800">{profile.age} yrs</span>
        </div>
        <div className="absolute top-2 left-2 bg-teal-500/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm">
          <span className="text-xs font-semibold text-white">{profile.gender}</span>
        </div>
        {/* Expand/Collapse Icon */}
        <div className="absolute bottom-2 right-2 bg-white text-teal-600 rounded-full p-2.5 shadow-lg">
          <svg 
            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Profile Summary - Always Visible */}
      <div className="p-4 cursor-pointer" onClick={onToggle}>
        <h3 className="text-base font-bold text-gray-800 mb-0.5">{profile.name}</h3>
        <p className="text-xs text-gray-500 mb-0.5">S/o {profile.fatherName}</p>
        <p className="text-xs text-gray-600 mb-2">📍 {profile.city}, {profile.country}</p>
        <p className="text-xs text-teal-600 font-medium">
          {isExpanded ? '▼ Click to hide details' : '▶ Click to view full details'}
        </p>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4">
          {/* Personal Info Grid */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 mb-3 pb-3 border-t border-gray-100 pt-3">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 mb-0.5">Education</span>
              <span className="text-xs font-medium text-gray-800 truncate">{profile.education}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 mb-0.5">Occupation</span>
              <span className="text-xs font-medium text-gray-800 truncate">{profile.occupation}</span>
            </div>
            {profile.height && (
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 mb-0.5">Height</span>
                <span className="text-xs font-medium text-gray-800">{profile.height}</span>
              </div>
            )}
            {profile.weight && (
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 mb-0.5">Weight</span>
                <span className="text-xs font-medium text-gray-800">{profile.weight}</span>
              </div>
            )}
            {profile.color && (
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 mb-0.5">Color</span>
                <span className="text-xs font-medium text-gray-800 truncate">{profile.color}</span>
              </div>
            )}
            {profile.cast && (
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 mb-0.5">Cast</span>
                <span className="text-xs font-medium text-gray-800 truncate">{profile.cast}</span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 mb-0.5">Maslak</span>
              <span className="text-xs font-medium text-gray-800 truncate">{profile.maslak}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 mb-0.5">Status</span>
              <span className="text-xs font-medium text-gray-800">{profile.maritalStatus}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 mb-0.5">Mother Tongue</span>
              <span className="text-xs font-medium text-gray-800 truncate">{profile.motherTongue}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 mb-0.5">Belongs</span>
              <span className="text-xs font-medium text-gray-800 truncate">{profile.belongs}</span>
            </div>
            {profile.income && (
              <div className="flex flex-col col-span-2">
                <span className="text-[10px] text-gray-500 mb-0.5">Income</span>
                <span className="text-xs font-medium text-gray-800">{profile.income}</span>
              </div>
            )}
          </div>

          {/* Family Info */}
          <div className="mb-3 pb-3 border-b border-gray-100">
            <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
              <span className="mr-1">👨‍👩‍👧‍👦</span> Family Details
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs mb-2">
              <div className="bg-gray-50 rounded-lg px-2 py-1.5">
                <div className="text-[10px] text-gray-500 mb-0.5">Father</div>
                <div className="font-medium text-gray-800">
                  {profile.fatherAlive ? '✓ Alive' : '✕ Not Alive'}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg px-2 py-1.5">
                <div className="text-[10px] text-gray-500 mb-0.5">Mother</div>
                <div className="font-medium text-gray-800">
                  {profile.motherAlive ? '✓ Alive' : '✕ Not Alive'}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg px-2 py-1.5">
                <div className="text-[10px] text-gray-500 mb-0.5">Brothers</div>
                <div className="font-medium text-gray-800">
                  {profile.numberOfBrothers} ({profile.numberOfMarriedBrothers} married)
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg px-2 py-1.5">
                <div className="text-[10px] text-gray-500 mb-0.5">Sisters</div>
                <div className="font-medium text-gray-800">
                  {profile.numberOfSisters} ({profile.numberOfMarriedSisters} married)
                </div>
              </div>
            </div>
            {profile.houseType && (
              <div className="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-2 py-1.5">
                <span className="text-gray-600">House Type:</span>
                <span className="font-medium text-gray-800">{profile.houseType}</span>
              </div>
            )}
            {profile.familyDetails && (
              <div className="mt-2 text-xs bg-gray-50 rounded-lg px-2 py-1.5">
                <div className="text-[10px] text-gray-500 mb-0.5">Additional Details</div>
                <div className="text-gray-700 leading-relaxed">{profile.familyDetails}</div>
              </div>
            )}
          </div>

          {/* Partner Requirements */}
          <div>
            <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
              <span className="mr-1">💕</span> Looking For
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center text-xs bg-teal-50 rounded-lg px-2 py-1.5">
                <span className="mr-1.5">🎂</span>
                <span className="text-gray-700 text-[11px]">{profile.requirements.ageRange.min}-{profile.requirements.ageRange.max} yrs</span>
              </div>
              {profile.requirements.heightRange && (
                <div className="flex items-center text-xs bg-teal-50 rounded-lg px-2 py-1.5">
                  <span className="mr-1.5">📏</span>
                  <span className="text-gray-700 text-[11px] truncate">{profile.requirements.heightRange.min} - {profile.requirements.heightRange.max}</span>
                </div>
              )}
              {profile.requirements.education && (
                <div className="flex items-center text-xs bg-teal-50 rounded-lg px-2 py-1.5">
                  <span className="mr-1.5">🎓</span>
                  <span className="text-gray-700 text-[11px] truncate">{profile.requirements.education}</span>
                </div>
              )}
              {profile.requirements.occupation && (
                <div className="flex items-center text-xs bg-teal-50 rounded-lg px-2 py-1.5">
                  <span className="mr-1.5">💼</span>
                  <span className="text-gray-700 text-[11px] truncate">{profile.requirements.occupation}</span>
                </div>
              )}
              {profile.requirements.familyType && (
                <div className="flex items-center text-xs bg-teal-50 rounded-lg px-2 py-1.5">
                  <span className="mr-1.5">👪</span>
                  <span className="text-gray-700 text-[11px] truncate">{profile.requirements.familyType}</span>
                </div>
              )}
              {profile.requirements.location && Array.isArray(profile.requirements.location) && profile.requirements.location.length > 0 && (
                <div className="flex items-center text-xs bg-teal-50 rounded-lg px-2 py-1.5">
                  <span className="mr-1.5">📍</span>
                  <span className="text-gray-700 text-[11px] truncate">{profile.requirements.location.join(', ')}</span>
                </div>
              )}
              {profile.requirements.cast && Array.isArray(profile.requirements.cast) && profile.requirements.cast.length > 0 && (
                <div className="flex items-center text-xs bg-teal-50 rounded-lg px-2 py-1.5">
                  <span className="mr-1.5">🏛️</span>
                  <span className="text-gray-700 text-[11px] truncate">{profile.requirements.cast.join(', ')}</span>
                </div>
              )}
              {profile.requirements.maslak && Array.isArray(profile.requirements.maslak) && profile.requirements.maslak.length > 0 && (
                <div className="flex items-center text-xs bg-teal-50 rounded-lg px-2 py-1.5">
                  <span className="mr-1.5">🕌</span>
                  <span className="text-gray-700 text-[11px] truncate">{profile.requirements.maslak.join(', ')}</span>
                </div>
              )}
              {profile.requirements.maritalStatus && Array.isArray(profile.requirements.maritalStatus) && profile.requirements.maritalStatus.length > 0 && (
                <div className="flex items-center text-xs bg-teal-50 rounded-lg px-2 py-1.5">
                  <span className="mr-1.5">💍</span>
                  <span className="text-gray-700 text-[11px] truncate">{profile.requirements.maritalStatus.join(', ')}</span>
                </div>
              )}
              {profile.requirements.motherTongue && Array.isArray(profile.requirements.motherTongue) && profile.requirements.motherTongue.length > 0 && (
                <div className="flex items-center text-xs bg-teal-50 rounded-lg px-2 py-1.5">
                  <span className="mr-1.5">🗣️</span>
                  <span className="text-gray-700 text-[11px] truncate">{profile.requirements.motherTongue.join(', ')}</span>
                </div>
              )}
              {profile.requirements.belongs && Array.isArray(profile.requirements.belongs) && profile.requirements.belongs.length > 0 && (
                <div className="flex items-center text-xs bg-teal-50 rounded-lg px-2 py-1.5">
                  <span className="mr-1.5">🌍</span>
                  <span className="text-gray-700 text-[11px] truncate">{profile.requirements.belongs.join(', ')}</span>
                </div>
              )}
              {profile.requirements.houseType && Array.isArray(profile.requirements.houseType) && profile.requirements.houseType.length > 0 && (
                <div className="flex items-center text-xs bg-teal-50 rounded-lg px-2 py-1.5">
                  <span className="mr-1.5">🏠</span>
                  <span className="text-gray-700 text-[11px] truncate">{profile.requirements.houseType.join(', ')}</span>
                </div>
              )}
            </div>
          </div>

          {/* WhatsApp Contact Button */}
          <a
            href={`https://wa.me/923352762923?text=Hi,%20I%20want%20to%20know%20more%20about%20${encodeURIComponent(profile.name)}'s%20profile`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-3 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition-all active:scale-95"
            onClick={(e) => e.stopPropagation()}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Contact via WhatsApp
          </a>
        </div>
      )}
    </div>
  );
});

ProfileCard.displayName = 'ProfileCard';

export default ProfileCard;
