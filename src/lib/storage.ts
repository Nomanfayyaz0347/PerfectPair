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
      
      // Age matching
      const ageMatch = profile.requirements.ageRange.min <= p.age && 
                      p.age <= profile.requirements.ageRange.max;
      
      if (!ageMatch) return false;
      
      // Basic compatibility check
      if (profile.requirements.education && p.education.toLowerCase().includes(profile.requirements.education.toLowerCase())) {
        return true;
      }
      
      if (profile.requirements.occupation && p.occupation.toLowerCase().includes(profile.requirements.occupation.toLowerCase())) {
        return true;
      }
      
      return ageMatch;
    });
    
    return matches;
  }
}