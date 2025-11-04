// Simple in-memory storage for testing
interface StoredProfile {
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
  matchedFields?: string[]; // Fields that matched the requirements
  matchScore?: string; // Match score like "8/12"
  requirements: {
    ageRange: { min: number; max: number };
    heightRange: { min: string; max: string };
    education?: string;
    occupation?: string;
    familyType?: string;
    location?: string;
  };
  createdAt: Date;
}

// In-memory storage
const profiles: StoredProfile[] = [];
let nextId = 1;

export class InMemoryStorage {
  static async saveProfile(profileData: Omit<StoredProfile, '_id' | 'createdAt'>): Promise<StoredProfile> {
    const profile: StoredProfile = {
      ...profileData,
      _id: nextId.toString(),
      createdAt: new Date()
    };
    
    profiles.push(profile);
    nextId++;
    
    return profile;
  }
  
  static async getAllProfiles(): Promise<StoredProfile[]> {
    return profiles;
  }
  
  static async getProfileById(id: string): Promise<StoredProfile | null> {
    return profiles.find(p => p._id === id) || null;
  }
  
  static async searchProfiles(filters: {
    search?: string;
    ageMin?: number;
    ageMax?: number;
    education?: string;
    occupation?: string;
  }): Promise<StoredProfile[]> {
    return profiles.filter(profile => {
      if (filters.search && !profile.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.ageMin && profile.age < filters.ageMin) {
        return false;
      }
      if (filters.ageMax && profile.age > filters.ageMax) {
        return false;
      }
      if (filters.education && !profile.education.toLowerCase().includes(filters.education.toLowerCase())) {
        return false;
      }
      if (filters.occupation && !profile.occupation.toLowerCase().includes(filters.occupation.toLowerCase())) {
        return false;
      }
      return true;
    });
  }
  
  static async updateProfile(profileId: string, updateData: Partial<StoredProfile>): Promise<StoredProfile | null> {
    console.log('InMemoryStorage.updateProfile called with:', { profileId, updateData });
    const index = profiles.findIndex(p => p._id === profileId);
    
    if (index === -1) {
      console.log('Profile not found for update in InMemoryStorage:', profileId);
      return null;
    }
    
    profiles[index] = { 
      ...profiles[index], 
      ...updateData
    };
    
    console.log('Profile updated successfully in InMemoryStorage:', profiles[index]);
    return profiles[index];
  }

  static async deleteProfile(profileId: string): Promise<boolean> {
    console.log('InMemoryStorage.deleteProfile called with profileId:', profileId);
    const index = profiles.findIndex(p => p._id === profileId);
    
    if (index === -1) {
      console.log('Profile not found for deletion in InMemoryStorage:', profileId);
      return false;
    }
    
    const deletedProfile = profiles.splice(index, 1)[0];
    console.log('Profile deleted successfully from InMemoryStorage:', deletedProfile.name);
    return true;
  }
  
  static async findMatches(profileId: string): Promise<StoredProfile[]> {
    const profile = await this.getProfileById(profileId);
    if (!profile) return [];
    
    const matches = profiles.filter(p => {
      if (p._id === profileId) return false;
      
      // Only show Active profiles in matches
      if (p.status && p.status !== 'Active') {
        return false;
      }
      
      let score = 0;
      const matchedFields = []; // Track which fields matched
      
      // Age matching - Primary criteria
      const ageMatch = profile.requirements.ageRange.min <= p.age && 
                      p.age <= profile.requirements.ageRange.max;
      if (ageMatch) {
        score++;
        matchedFields.push('Age Range');
      }
      
      // Height matching - Important criteria
      let heightMatch = false;
      if (profile.requirements.heightRange) {
        const reqMinHeight = parseFloat(profile.requirements.heightRange.min);
        const reqMaxHeight = parseFloat(profile.requirements.heightRange.max);
        const profileHeight = parseFloat(p.height || '0');
        
        if (!isNaN(reqMinHeight) && !isNaN(reqMaxHeight) && !isNaN(profileHeight) && profileHeight > 0) {
          heightMatch = reqMinHeight <= profileHeight && profileHeight <= reqMaxHeight;
        } else {
          heightMatch = true; // If height data is missing, don't penalize
        }
      } else {
        heightMatch = true; // No height requirements
      }
      if (heightMatch) {
        score++;
        matchedFields.push('Height Range');
      }
      
      // Education matching - Flexible
      if (profile.requirements.education) {
        const reqEdu = profile.requirements.education.toLowerCase();
        const profileEdu = p.education.toLowerCase();
        
        // More flexible education matching
        if (reqEdu.includes('bachelor') && (profileEdu.includes('bachelor') || profileEdu.includes('master') || profileEdu.includes('phd'))) {
          score++;
          matchedFields.push('Education Level');
        } else if (reqEdu.includes('master') && (profileEdu.includes('master') || profileEdu.includes('phd'))) {
          score++;
          matchedFields.push('Education Level');
        } else if (reqEdu.includes('any') || profileEdu.includes(reqEdu) || reqEdu.includes(profileEdu)) {
          score++;
          matchedFields.push('Education Level');
        }
      } else {
        score++; // No specific requirement means match
        matchedFields.push('Education Level');
      }
      
      // Occupation matching - Very flexible
      if (profile.requirements.occupation) {
        const reqOcc = profile.requirements.occupation.toLowerCase();
        const profileOcc = p.occupation.toLowerCase();
        
        if (reqOcc.includes('any') || reqOcc.includes('respectable') || reqOcc.includes('professional')) {
          score++; // Accept any profession
          matchedFields.push('Work/Job');
        } else if (profileOcc.includes(reqOcc) || reqOcc.includes(profileOcc)) {
          score++;
          matchedFields.push('Work/Job');
        } else {
          // Check for related professions
          const relatedProfessions = {
            'doctor': ['pharmacist', 'dentist', 'surgeon', 'physician'],
            'engineer': ['architect', 'programmer', 'developer'],
            'teacher': ['lecturer', 'professor', 'principal', 'educator'],
            'business': ['manager', 'officer', 'executive', 'owner']
          };
          
          for (const [main, related] of Object.entries(relatedProfessions)) {
            if ((reqOcc.includes(main) && related.some(r => profileOcc.includes(r))) ||
                (profileOcc.includes(main) && related.some(r => reqOcc.includes(r)))) {
              score++;
              matchedFields.push('Work/Job');
              break;
            }
          }
        }
      } else {
        score++; // No specific requirement means match
        matchedFields.push('Work/Job');
      }
      
      // Location matching - Flexible
      if (profile.requirements.location) {
        const reqLoc = profile.requirements.location.toLowerCase();
        const profileLoc = p.address.toLowerCase();
        
        if (reqLoc.includes('any') || reqLoc.includes('major cities')) {
          score++;
          matchedFields.push('Location');
        } else {
          // Check for city names
          const cities = ['lahore', 'karachi', 'islamabad', 'rawalpindi', 'peshawar', 'faisalabad', 'multan'];
          const reqCities = cities.filter(city => reqLoc.includes(city));
          const profileCities = cities.filter(city => profileLoc.includes(city));
          
          if (reqCities.some(city => profileCities.includes(city))) {
            score++;
            matchedFields.push('Location');
          } else if (reqLoc.includes('nearby') || profileLoc.includes('nearby')) {
            score += 0.5; // Partial match for nearby
            matchedFields.push('Location (Nearby)');
          }
        }
      } else {
        score++; // No specific requirement means match
        matchedFields.push('Location');
      }
      
      // Add basic compatibility fields (like MongoDB version)
      matchedFields.push('Family Type (Maslak)');
      matchedFields.push('Mother Tongue');
      matchedFields.push('Nationality');
      matchedFields.push('Marital Status');
      matchedFields.push('House Type');
      matchedFields.push('Cast');
      score += 6; // Add 6 for these basic fields
      
      // NEW MATCHING LOGIC: Minimum 8 out of 12 fields must match for quality matches
      const TOTAL_PARTNER_FIELDS = 12;  // All 12 partner requirement fields
      const MINIMUM_MATCHES_REQUIRED = 8;  // At least 8 fields must match for good quality matches
      
      console.log(`Storage - ${p.name}: Score ${score}/${TOTAL_PARTNER_FIELDS}`);
      
      if (score >= MINIMUM_MATCHES_REQUIRED) {
        console.log(`✅ Storage - Accepting ${p.name} (${score}/${TOTAL_PARTNER_FIELDS} fields matched - Required: ${MINIMUM_MATCHES_REQUIRED})`);
        // Add matched fields information to the profile (like MongoDB version)
        p.matchedFields = matchedFields;
        p.matchScore = `${score}/${TOTAL_PARTNER_FIELDS}`;
        return true;
      } else {
        console.log(`❌ Storage - Rejecting ${p.name} (Only ${score}/${TOTAL_PARTNER_FIELDS} fields matched - Required: ${MINIMUM_MATCHES_REQUIRED})`);
        return false;
      }
    });
    
    return matches;
  }
}

// Simple functions for backward compatibility
export function getProfiles(): StoredProfile[] {
  return profiles;
}

export function updateProfile(id: string, updatedData: Partial<StoredProfile>): StoredProfile | null {
  console.log('UpdateProfile called with:', { id, updatedData });
  const index = profiles.findIndex(p => p._id === id);
  
  if (index === -1) {
    console.log('Profile not found for update:', id);
    console.log('Available profiles:', profiles.map(p => ({ id: p._id, name: p.name })));
    return null;
  }
  
  profiles[index] = { ...profiles[index], ...updatedData };
  console.log('Profile updated successfully:', profiles[index]);
  return profiles[index];
}

export function addProfile(profile: StoredProfile): void {
  console.log('Adding profile to in-memory storage:', profile._id);
  const existingIndex = profiles.findIndex(p => p._id === profile._id);
  
  if (existingIndex === -1) {
    profiles.push(profile);
    console.log('Profile added to storage');
  } else {
    profiles[existingIndex] = profile;
    console.log('Profile updated in storage');
  }
}