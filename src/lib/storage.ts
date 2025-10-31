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
  
  static async findMatches(profileId: string): Promise<StoredProfile[]> {
    const profile = await this.getProfileById(profileId);
    if (!profile) return [];
    
    const matches = profiles.filter(p => {
      if (p._id === profileId) return false;
      
      let score = 0;
      let totalCriteria = 0;
      
      // Age matching - Primary criteria
      totalCriteria++;
      const ageMatch = profile.requirements.ageRange.min <= p.age && 
                      p.age <= profile.requirements.ageRange.max;
      if (ageMatch) score++;
      
      // Education matching - Flexible
      totalCriteria++;
      if (profile.requirements.education) {
        const reqEdu = profile.requirements.education.toLowerCase();
        const profileEdu = p.education.toLowerCase();
        
        // More flexible education matching
        if (reqEdu.includes('bachelor') && (profileEdu.includes('bachelor') || profileEdu.includes('master') || profileEdu.includes('phd'))) {
          score++;
        } else if (reqEdu.includes('master') && (profileEdu.includes('master') || profileEdu.includes('phd'))) {
          score++;
        } else if (reqEdu.includes('any') || profileEdu.includes(reqEdu) || reqEdu.includes(profileEdu)) {
          score++;
        }
      } else {
        score++; // No specific requirement means match
      }
      
      // Occupation matching - Very flexible
      totalCriteria++;
      if (profile.requirements.occupation) {
        const reqOcc = profile.requirements.occupation.toLowerCase();
        const profileOcc = p.occupation.toLowerCase();
        
        if (reqOcc.includes('any') || reqOcc.includes('respectable') || reqOcc.includes('professional')) {
          score++; // Accept any profession
        } else if (profileOcc.includes(reqOcc) || reqOcc.includes(profileOcc)) {
          score++;
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
              break;
            }
          }
        }
      } else {
        score++; // No specific requirement means match
      }
      
      // Location matching - Flexible
      totalCriteria++;
      if (profile.requirements.location) {
        const reqLoc = profile.requirements.location.toLowerCase();
        const profileLoc = p.address.toLowerCase();
        
        if (reqLoc.includes('any') || reqLoc.includes('major cities')) {
          score++;
        } else {
          // Check for city names
          const cities = ['lahore', 'karachi', 'islamabad', 'rawalpindi', 'peshawar', 'faisalabad', 'multan'];
          const reqCities = cities.filter(city => reqLoc.includes(city));
          const profileCities = cities.filter(city => profileLoc.includes(city));
          
          if (reqCities.some(city => profileCities.includes(city))) {
            score++;
          } else if (reqLoc.includes('nearby') || profileLoc.includes('nearby')) {
            score += 0.5; // Partial match for nearby
          }
        }
      } else {
        score++; // No specific requirement means match
      }
      
      // Return true if at least 60% criteria match (including age as mandatory)
      return ageMatch && (score / totalCriteria) >= 0.6;
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