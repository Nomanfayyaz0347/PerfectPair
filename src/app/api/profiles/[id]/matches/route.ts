import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory cache for matches
const matchesCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const resolvedParams = await params;
    const profileId = resolvedParams.id;
    
    // Check cache first
    const cached = matchesCache.get(profileId);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      return NextResponse.json({
        ...cached.data,
        cached: true
      });
    }
    
    let matches = [];
    let useInMemory = false;
    
    try {
      // Try MongoDB first
      const dbModule = await import('@/lib/mongodb');
      const profileModule = await import('@/models/Profile');
      
      const dbConnect = dbModule.default;
      const Profile = profileModule.default;
      
      await dbConnect();
      
      // Get the current profile from MongoDB
      const currentProfile = await Profile.findById(profileId);
      if (!currentProfile) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
      }
      
      // Check if profile has gender data
      if (!currentProfile.gender) {
        return NextResponse.json({ 
          error: 'Profile gender data missing. Please update profile.',
          matches: []
        });
      }
      
      // Determine opposite gender - handle case insensitive
      const currentGender = (currentProfile.gender || '').toLowerCase();
      const oppositeGender = currentGender === 'male' ? 'female' : 'male';
      
      // Get all other profiles with opposite gender only (case insensitive)
      const allProfiles = await Profile.find({ 
        _id: { $ne: profileId },
        gender: { $regex: new RegExp(`^${oppositeGender}$`, 'i') }
      }).lean().select('-__v').limit(100); // Use lean() for faster queries and limit results
      
      // DYNAMIC & PERCENTAGE-BASED AUTHENTIC MATCHING
      matches = allProfiles.filter(p => {
        
        if (!p.gender) {
          return false;
        }
        
        const matchedFields = [];
        let matchScore = 0;
        let totalValidRequirements = 0;
        
        // Helper function to check if requirement is valid - STRICT VERSION
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isValidReq = (req: any) => {
          if (!req) return false;
          if (Array.isArray(req)) {
            return req.length > 0 && 
                   !req.includes('any') && 
                   !req.includes('Any') && 
                   !req.includes('') &&
                   req.some(item => item && item.trim() !== '');
          }
          if (typeof req === 'string') {
            const trimmed = req.trim().toLowerCase();
            return trimmed !== '' && 
                   !['any', 'not specified', 'n/a', 'none'].includes(trimmed);
          }
          if (typeof req === 'object' && 'min' in req && 'max' in req) {
            return req.min && req.max && req.min !== req.max;
          }
          return false;
        };
        
        // ================================
        // DYNAMIC FIELD-BY-FIELD VERIFICATION
        // ================================
        
        // 1. Age matching - Count as valid requirement if exists
        if (isValidReq(currentProfile.requirements?.ageRange)) {
          totalValidRequirements++;
          const ageMatch = p.age >= currentProfile.requirements.ageRange.min && 
                          p.age <= currentProfile.requirements.ageRange.max;

          
          if (ageMatch) {
            matchedFields.push('Age Range');
            matchScore++;
          }
        }
        
        // 2. Height matching - ONLY if requirements exist
        if (isValidReq(currentProfile.requirements?.heightRange)) {
          totalValidRequirements++;
          const reqMinHeight = parseFloat(currentProfile.requirements.heightRange.min);
          const reqMaxHeight = parseFloat(currentProfile.requirements.heightRange.max);
          const profileHeight = parseFloat(p.height || '0');
          
          if (!isNaN(reqMinHeight) && !isNaN(reqMaxHeight) && !isNaN(profileHeight) && profileHeight > 0) {
            const heightMatch = profileHeight >= reqMinHeight && profileHeight <= reqMaxHeight;

            
            if (heightMatch) {
              matchedFields.push('Height Range');
              matchScore++;
            }
          }
        }
        
        // 3. Education matching - STRICT VALIDATION
        if (isValidReq(currentProfile.requirements?.education)) {
          totalValidRequirements++;
          const reqEdu = currentProfile.requirements.education.toLowerCase().trim();
          const profileEdu = (p.education || '').toLowerCase().trim();
          

          
          let eduMatch = false;
          
          // Only match if profile has valid education data
          if (profileEdu && profileEdu !== '' && profileEdu !== 'not specified') {
            if (reqEdu.includes('graduate') && (profileEdu.includes('bachelor') || profileEdu.includes('graduate') || profileEdu.includes('master'))) {
              eduMatch = true;
            } else if (reqEdu.includes('bachelor') && (profileEdu.includes('bachelor') || profileEdu.includes('master') || profileEdu.includes('phd'))) {
              eduMatch = true;
            } else if (reqEdu.includes('master') && (profileEdu.includes('master') || profileEdu.includes('phd'))) {
              eduMatch = true;
            } else if (profileEdu.includes(reqEdu) || reqEdu.includes(profileEdu)) {
              eduMatch = true;
            }
          }
          
          if (eduMatch) {
            matchedFields.push('Education Level');
            matchScore++;

          } else {

          }
        }
        
        // 4. Occupation matching - STRICT VALIDATION
        if (isValidReq(currentProfile.requirements?.occupation)) {
          totalValidRequirements++;
          const reqOcc = currentProfile.requirements.occupation.toLowerCase().trim();
          const profileOcc = (p.occupation || '').toLowerCase().trim();
          

          
          let occMatch = false;
          
          // Only match if profile has valid occupation data
          if (profileOcc && profileOcc !== '' && profileOcc !== 'not specified' && profileOcc !== 'other') {
            if (reqOcc.includes('professional') && (profileOcc.includes('engineer') || profileOcc.includes('doctor') || 
                profileOcc.includes('teacher') || profileOcc.includes('manager') || profileOcc.includes('officer'))) {
              occMatch = true;
            } else if (reqOcc.includes('business') && (profileOcc.includes('business') || profileOcc.includes('entrepreneur'))) {
              occMatch = true;
            } else if (profileOcc.includes(reqOcc) || reqOcc.includes(profileOcc)) {
              occMatch = true;
            }
          }
          
          if (occMatch) {
            matchedFields.push('Work/Job');
            matchScore++;

          } else {

          }
        }
        
        // 5. Location matching - STRICT VALIDATION
        if (isValidReq(currentProfile.requirements?.location)) {
          totalValidRequirements++;
          const reqLocations = currentProfile.requirements.location.map((loc: string) => loc.toLowerCase().trim());
          const profileLoc = (p.city || p.address || '').toLowerCase().trim();
          

          
          // STRICT: Profile must have non-empty location AND match requirement
          if (profileLoc && profileLoc !== '') {
            const locationMatch = reqLocations.some((loc: string) => {
              return loc && loc !== '' && (
                profileLoc.includes(loc) || 
                loc.includes(profileLoc) ||
                profileLoc === loc
              );
            });
            
            if (locationMatch) {
              matchedFields.push('Location');
              matchScore++;

            } else {

            }
          } else {

          }
        }
        
        // 6. Cast matching - STRICT VALIDATION
        if (isValidReq(currentProfile.requirements?.cast)) {
          totalValidRequirements++;
          const reqCasts = currentProfile.requirements.cast.map((cast: string) => cast.toLowerCase().trim());
          const profileCast = (p.cast || '').toLowerCase().trim();
          

          
          // STRICT: Profile must have non-empty cast AND match requirement
          if (profileCast && profileCast !== '' && profileCast !== 'other' && profileCast !== 'not specified') {
            const castMatch = reqCasts.some((cast: string) => {
              return cast && cast !== '' && cast !== 'other' && (
                profileCast.includes(cast) || 
                cast.includes(profileCast) ||
                profileCast === cast
              );
            });
            
            if (castMatch) {
              matchedFields.push('Cast');
              matchScore++;

            } else {

            }
          } else {

          }
        }
        
        // 7. Marital Status - BIDIRECTIONAL MATCHING
        if (currentProfile.requirements?.maritalStatus && 
            Array.isArray(currentProfile.requirements.maritalStatus) && 
            currentProfile.requirements.maritalStatus.length > 0 &&
            !currentProfile.requirements.maritalStatus.includes('any')) {
            
          totalValidRequirements++;
          const reqStatus = currentProfile.requirements.maritalStatus.map((status: string) => status.toLowerCase());
          const profileStatus = (p.maritalStatus || '').toLowerCase();
          

          
          const statusMatch = reqStatus.some((status: string) => profileStatus.includes(status));
          
          if (statusMatch) {
            matchedFields.push('Marital Status');
            matchScore++;

          } else {

          }
        }
        
        // 7B. REVERSE Marital Status Check - Other profile's requirements vs current profile's status
        if (p.requirements?.maritalStatus && 
            Array.isArray(p.requirements.maritalStatus) && 
            p.requirements.maritalStatus.length > 0 &&
            !p.requirements.maritalStatus.includes('any')) {
            
          const otherReqStatus = p.requirements.maritalStatus.map((status: string) => status.toLowerCase());
          const currentStatus = (currentProfile.maritalStatus || '').toLowerCase();
          

          
          const reverseStatusMatch = otherReqStatus.some((status: string) => currentStatus.includes(status));
          
          if (!reverseStatusMatch) {

            return false; // HARD REJECT if other profile doesn't want this marital status
          } else {

          }
        }
        
        // 8. Family Type - ONLY if specific requirements exist
        if (currentProfile.requirements?.familyType && 
            currentProfile.requirements.familyType !== '' &&
            !['any', 'Any', 'any family'].includes(currentProfile.requirements.familyType)) {
            
          const reqFamily = currentProfile.requirements.familyType.toLowerCase();
          const profileFamily = (p.familyDetails || '').toLowerCase();
          

          
          if (profileFamily.includes(reqFamily) || 
              (reqFamily.includes('joint') && profileFamily.includes('joint')) ||
              (reqFamily.includes('nuclear') && profileFamily.includes('nuclear'))) {
            matchedFields.push('Family Type');
            matchScore++;

          }
        }
        
        // 9. Mother Tongue - ONLY if specific requirements exist
        if (currentProfile.requirements?.motherTongue && 
            Array.isArray(currentProfile.requirements.motherTongue) && 
            currentProfile.requirements.motherTongue.length > 0 &&
            !currentProfile.requirements.motherTongue.includes('any')) {
            
          const reqLanguages = currentProfile.requirements.motherTongue.map((lang: string) => lang.toLowerCase());
          const profileLang = (p.motherTongue || '').toLowerCase();
          

          
          const langMatch = reqLanguages.some((lang: string) => profileLang.includes(lang));
          
          if (langMatch) {
            matchedFields.push('Mother Tongue');
            matchScore++;

          }
        }
        
        // 10. Maslak - ONLY if specific requirements exist
        if (currentProfile.requirements?.maslak && 
            Array.isArray(currentProfile.requirements.maslak) && 
            currentProfile.requirements.maslak.length > 0 &&
            !currentProfile.requirements.maslak.includes('any')) {
            
          const reqMaslak = currentProfile.requirements.maslak.map((m: string) => m.toLowerCase());
          const profileMaslak = (p.maslak || '').toLowerCase();
          

          
          const maslakMatch = reqMaslak.some((m: string) => profileMaslak.includes(m));
          
          if (maslakMatch) {
            matchedFields.push('Maslak');
            matchScore++;

          }
        }
        
        // 11. House Type - ONLY if specific requirements exist
        if (currentProfile.requirements?.houseType && 
            Array.isArray(currentProfile.requirements.houseType) && 
            currentProfile.requirements.houseType.length > 0 &&
            !currentProfile.requirements.houseType.includes('any')) {
            
          const reqHouse = currentProfile.requirements.houseType.map((h: string) => h.toLowerCase());
          const profileHouse = (p.houseType || '').toLowerCase();
          

          
          const houseMatch = reqHouse.some((h: string) => profileHouse.includes(h));
          
          if (houseMatch) {
            matchedFields.push('House Type');
            matchScore++;

          }
        }
        
        // 12. Belongs To - ONLY if specific requirements exist
        if (currentProfile.requirements?.belongs && 
            Array.isArray(currentProfile.requirements.belongs) && 
            currentProfile.requirements.belongs.length > 0 &&
            !currentProfile.requirements.belongs.includes('any')) {
            
          const reqBelongs = currentProfile.requirements.belongs.map((b: string) => b.toLowerCase());
          const profileBelongs = (p.belongs || '').toLowerCase();
          

          
          const belongsMatch = reqBelongs.some((b: string) => profileBelongs.includes(b));
          
          if (belongsMatch) {
            matchedFields.push('Belongs To');
            matchScore++;

          }
        }
        

        // ================================
        // DYNAMIC PERCENTAGE CALCULATION
        // ================================
        
        if (totalValidRequirements === 0) {
          return false;
        }
        
        // STRICT REQUIREMENTS: Must have at least 3 valid requirements to be meaningful
        if (totalValidRequirements < 3) {
          return false;
        }
        
        const matchPercentage = Math.round((matchScore / totalValidRequirements) * 100);
        const MINIMUM_PERCENTAGE = 70; // Reduced to 70% for faster and more matches
        
        if (matchPercentage >= MINIMUM_PERCENTAGE) {
          // Adding temp data for processing
          (p as Record<string, unknown>)._tempMatchData = { 
            matchedFields, 
            matchScore: `${matchScore}/${totalValidRequirements}`,
            percentage: matchPercentage
          };
          return true;
        } else {
          return false;
        }
      });
      
      // Add matching data to the final matches - optimized for lean() queries
      matches = matches.map(match => {
        // Accessing temp data
        const tempData = (match as Record<string, unknown>)._tempMatchData as { matchedFields: string[]; matchScore: string } || {};
        return {
          ...match, // Already a plain object from lean()
          matchedFields: tempData.matchedFields || [],
          matchScore: tempData.matchScore || '0/12'
        };
      });
      

      
    } catch {
      useInMemory = true;
      
      // Fallback to in-memory storage
      try {
        const { InMemoryStorage } = await import('@/lib/storage');
        matches = await InMemoryStorage.findMatches(profileId);
        console.log(`In-memory matches found: ${matches.length}`);
      } catch (memError) {
        console.error('In-memory matching also failed:', memError);
        return NextResponse.json({ error: 'Failed to find matches' }, { status: 500 });
      }
    }
    
    const response = {
      matches,
      count: matches.length,
      method: useInMemory ? 'in-memory' : 'mongodb'
    };
    
    // Store in cache
    matchesCache.set(profileId, {
      data: response,
      timestamp: Date.now()
    });
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error finding matches:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}