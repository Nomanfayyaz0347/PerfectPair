'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const ProfileCard = dynamic(() => import('@/components/ProfileCard'), {
  loading: () => (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 h-48 animate-pulse">
      <div className="bg-gray-200 h-48"></div>
    </div>
  ),
});

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

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGender, setSelectedGender] = useState<'All' | 'Male' | 'Female'>('All');
  const [expandedProfile, setExpandedProfile] = useState<string | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await fetch('/api/all-profiles');
      if (response.ok) {
        const data = await response.json();
        if (data.profiles && data.profiles.length > 0) {
          setProfiles(data.profiles);
        }
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = profiles.filter(profile => 
    selectedGender === 'All' ? true : profile.gender === selectedGender
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white py-4 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white pb-20">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-lg mx-auto px-5 py-2">
          <div className="flex items-center justify-between mb-2">
            <Link 
              href="/"
              className="inline-flex items-center text-teal-600 hover:text-teal-700"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm font-medium">Back</span>
            </Link>
            <div className="text-right">
              <h1 className="text-sm font-bold text-gray-800">All Profiles</h1>
              <p className="text-[10px] text-gray-600">Browse our collection</p>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="max-w-lg mx-auto px-5 pb-2 flex gap-2">
          <button
            onClick={() => setSelectedGender('All')}
            className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedGender === 'All'
                ? 'bg-teal-500 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedGender('Male')}
            className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedGender === 'Male'
                ? 'bg-teal-500 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Male
          </button>
          <button
            onClick={() => setSelectedGender('Female')}
            className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedGender === 'Female'
                ? 'bg-teal-500 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Female
          </button>
        </div>
      </div>

      {/* Profiles List */}
      <div className="max-w-lg mx-auto px-5 pt-4">
        {filteredProfiles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">No profiles found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProfiles.map((profile) => (
              <ProfileCard
                key={profile._id}
                profile={profile}
                isExpanded={expandedProfile === profile._id}
                onToggle={() => setExpandedProfile(expandedProfile === profile._id ? null : profile._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
