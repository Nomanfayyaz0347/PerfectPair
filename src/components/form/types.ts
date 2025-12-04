// Form data types

export interface FormData {
  name: string;
  fatherName: string;
  gender: 'Male' | 'Female';
  age: number;
  height: string;
  weight: string;
  color: string;
  cast: string;
  maslak: string;
  maritalStatus: string;
  motherTongue: string;
  belongs: string;
  education: string;
  occupation: string;
  income: string;
  familyDetails: string;
  fatherAlive: boolean;
  motherAlive: boolean;
  numberOfBrothers: number;
  numberOfMarriedBrothers: number;
  numberOfSisters: number;
  numberOfMarriedSisters: number;
  houseType: string;
  country: string;
  city: string;
  address?: string;
  contactNumber: string;
  photoUrl?: string;
  submittedBy: 'Main Admin' | 'Partner Matchmaker' | '';
  matchmakerName?: string;
  requirements: Requirements;
}

export interface Requirements {
  ageRange: { min: number; max: number };
  heightRange: { min: string; max: string };
  education: string;
  occupation: string;
  familyType: string;
  location: string[];
  cast: string[];
  maslak: string[];
  maritalStatus: string[];
  motherTongue: string[];
  belongs: string[];
  houseType: string[];
}

export const initialFormData: FormData = {
  name: '',
  fatherName: '',
  gender: 'Male',
  age: 0,
  height: '',
  weight: '',
  color: '',
  cast: '',
  maslak: '',
  maritalStatus: 'Single',
  motherTongue: 'Urdu',
  belongs: 'Pakistan',
  education: '',
  occupation: '',
  income: '',
  familyDetails: '',
  houseType: 'Family House',
  country: 'Pakistan',
  city: 'Karachi',
  address: '',
  contactNumber: '',
  photoUrl: '',
  submittedBy: '',
  matchmakerName: '',
  fatherAlive: true,
  motherAlive: true,
  numberOfBrothers: 0,
  numberOfMarriedBrothers: 0,
  numberOfSisters: 0,
  numberOfMarriedSisters: 0,
  requirements: {
    ageRange: { min: 18, max: 35 },
    heightRange: { min: '5.0', max: '6.0' },
    education: '',
    occupation: '',
    familyType: '',
    location: [],
    cast: [],
    maslak: [],
    maritalStatus: [],
    motherTongue: [],
    belongs: [],
    houseType: []
  }
};
