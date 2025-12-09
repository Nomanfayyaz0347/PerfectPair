import { z } from 'zod';

// Profile Creation Schema
export const profileSchema = z.object({
  // Personal Information
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  fatherName: z.string().min(2, 'Father name must be at least 2 characters').max(100),
  gender: z.enum(['Male', 'Female'], {
    message: 'Gender must be Male or Female',
  }),
  age: z.coerce.number().int().min(18, 'Age must be at least 18').max(100, 'Age must be less than 100'),
  height: z.string().min(1, 'Height is required'),
  weight: z.string().min(1, 'Weight is required'),
  color: z.string().min(1, 'Complexion is required'),
  cast: z.string().min(1, 'Cast is required'),
  maslak: z.string().min(1, 'Maslak is required'),
  maritalStatus: z.string().min(1, 'Marital status is required'),
  motherTongue: z.string().min(1, 'Mother tongue is required'),
  belongs: z.string().min(1, 'Belongs is required'),

  // Education & Career
  education: z.string().min(1, 'Education is required'),
  occupation: z.string().min(1, 'Occupation is required'),
  income: z.string().optional(),
  houseType: z.string().min(1, 'House type is required'),

  // Family Details
  fatherAlive: z.boolean(),
  motherAlive: z.boolean(),
  numberOfBrothers: z.number().int().min(0).max(20),
  numberOfMarriedBrothers: z.number().int().min(0).max(20),
  numberOfSisters: z.number().int().min(0).max(20),
  numberOfMarriedSisters: z.number().int().min(0).max(20),
  familyDetails: z.string().optional(),

  // Contact Information
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
  address: z.string().optional().or(z.literal('')),
  contactNumber: z.string().min(10, 'Contact number must be at least 10 digits').max(20),

  // Photo
  photoUrl: z.string().optional().or(z.literal('')),
  cloudinaryPublicId: z.string().optional(),

  // Submission Details
  submittedBy: z.enum(['Main Admin', 'Partner Matchmaker'], {
    message: 'Please select who is submitting this profile',
  }),
  matchmakerName: z.string().optional(),

  // Status
  status: z.enum(['Active', 'Matched', 'Engaged', 'Married', 'Inactive']).optional(),

  // Partner Requirements
  requirements: z.object({
    ageRange: z.object({
      min: z.number().int().min(18).max(100),
      max: z.number().int().min(18).max(100),
    }),
    heightRange: z.object({
      min: z.string(),
      max: z.string(),
    }),
    education: z.string().optional(),
    occupation: z.string().optional(),
    familyType: z.string().optional(),
    location: z.array(z.string()).optional(),
    cast: z.array(z.string()).optional(),
    maslak: z.array(z.string()).optional(),
    maritalStatus: z.array(z.string()).optional(),
    motherTongue: z.array(z.string()).optional(),
    belongs: z.array(z.string()).optional(),
    houseType: z.array(z.string()).optional(),
  }),
}).refine(
  (data) => data.numberOfMarriedBrothers <= data.numberOfBrothers,
  {
    message: 'Married brothers cannot be more than total brothers',
    path: ['numberOfMarriedBrothers'],
  }
).refine(
  (data) => data.numberOfMarriedSisters <= data.numberOfSisters,
  {
    message: 'Married sisters cannot be more than total sisters',
    path: ['numberOfMarriedSisters'],
  }
).refine(
  (data) => data.requirements.ageRange.min <= data.requirements.ageRange.max,
  {
    message: 'Minimum age cannot be greater than maximum age',
    path: ['requirements', 'ageRange'],
  }
);

// Profile Update Schema (all fields optional except ID)
export const profileUpdateSchema = profileSchema.partial();

// Login Schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Client Access Schema
export const clientAccessSchema = z.object({
  profileId: z.string().min(1, 'Profile ID is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(50),
});

// Status Update Schema
export const statusUpdateSchema = z.object({
  status: z.enum(['Active', 'Matched', 'Engaged', 'Married', 'Inactive']),
});

// Type exports for TypeScript
export type ProfileInput = z.infer<typeof profileSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ClientAccessInput = z.infer<typeof clientAccessSchema>;
export type StatusUpdateInput = z.infer<typeof statusUpdateSchema>;
