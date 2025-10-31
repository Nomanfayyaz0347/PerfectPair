// Utility to sync MongoDB profiles to in-memory storage
import { addProfile } from '@/lib/storage';

const syncedProfiles = new Set<string>();

interface ProfileData {
  _id: string;
  name: string;
  fatherName: string;
  age: number;
  height: string;
  weight?: string;
  color?: string;
  education: string;
  occupation: string;
  income?: string;
  familyDetails?: string;
  address: string;
  contactNumber: string;
  photoUrl?: string;
  status?: 'Active' | 'Matched' | 'Engaged' | 'Married' | 'Inactive';
  matchedWith?: string;
  matchedDate?: string;
  requirements: {
    ageRange: { min: number; max: number };
    heightRange: { min: string; max: string };
    education?: string;
    occupation?: string;
    familyType?: string;
    location?: string;
  };
  createdAt: string | Date;
}

export function syncProfileToMemory(profile: ProfileData) {
  console.log('Syncing profile to memory:', profile._id, profile.name);
  
  const profileData = {
    _id: profile._id,
    name: profile.name,
    fatherName: profile.fatherName,
    age: profile.age,
    height: profile.height,
    weight: profile.weight,
    color: profile.color,
    education: profile.education,
    occupation: profile.occupation,
    income: profile.income,
    familyDetails: profile.familyDetails,
    address: profile.address,
    contactNumber: profile.contactNumber,
    photoUrl: profile.photoUrl,
    status: profile.status || 'Active',
    matchedWith: profile.matchedWith,
    matchedDate: profile.matchedDate,
    requirements: profile.requirements,
    createdAt: new Date(profile.createdAt)
  };
  
  addProfile(profileData);
  syncedProfiles.add(profile._id);
  console.log('Profile synced successfully:', profile._id);
}

export function isProfileSynced(profileId: string): boolean {
  return syncedProfiles.has(profileId);
}

export function syncAllProfiles(profiles: ProfileData[]) {
  profiles.forEach(profile => syncProfileToMemory(profile));
}