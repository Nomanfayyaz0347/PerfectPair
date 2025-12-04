// Shared types for admin components

export interface Profile {
  _id: string;
  id?: string;
  name: string;
  fatherName: string;
  gender: 'Male' | 'Female';
  age: number;
  height: string;
  weight: string;
  color: string;
  cast: string;
  maslak?: string;
  maritalStatus?: 'Single' | 'Divorced' | 'Widowed' | 'Separated';
  motherTongue?: string;
  belongs?: string;
  education: string;
  occupation: string;
  income: string;
  fatherAlive: boolean;
  motherAlive: boolean;
  numberOfBrothers: number;
  numberOfMarriedBrothers: number;
  numberOfSisters: number;
  numberOfMarriedSisters: number;
  familyDetails: string;
  houseType?: 'Own House' | 'Rent' | 'Family House' | 'Apartment';
  country?: string;
  city?: string;
  address?: string;
  contactNumber: string;
  email?: string;
  photoUrl?: string;
  status?: 'Active' | 'Matched' | 'Engaged' | 'Married' | 'Inactive';
  matchedWith?: string;
  matchedDate?: string;
  matchScore?: string;
  matchedFields?: string[];
  sharedCount?: number;
  submittedBy?: 'Main Admin' | 'Partner Matchmaker';
  matchmakerName?: string;
  requirements: {
    ageRange: { min: number; max: number };
    heightRange: { min: string; max: string };
    education: string;
    occupation: string;
    familyType: string;
    location: string[] | string;
    cast: string[] | string;
    maslak?: string[];
    maritalStatus?: string[];
    motherTongue?: string[];
    belongs?: string[];
    houseType?: string[];
  };
  createdAt: string;
}

export interface ClientAccess {
  _id: string;
  email: string;
  name: string;
  profileId: {
    _id: string;
    name: string;
    gender: string;
    age: number;
  } | string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Filters {
  search: string;
  ageMin: string;
  ageMax: string;
  education: string;
  occupation: string;
  submittedBy: string;
}

// Helper function to safely get profile ID
export const getProfileId = (profile: Profile): string => {
  return profile._id || profile.id || '';
};

// Helper function to get shared count from profile data
export const getSharedCount = (profile: Profile): number => {
  return profile.sharedCount || 0;
};
