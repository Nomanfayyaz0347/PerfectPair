import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/authCheck';

// Simple in-memory cache for match counts
let matchCountsCache: { data: Record<string, number>; timestamp: number } | null = null;
const CACHE_DURATION = 2 * 60 * 1000; // 2 minute cache

export async function GET() {
  try {
    // Check authentication
    const auth = await checkAuth();
    if (!auth.authenticated) return auth.response;

    // Check cache first
    if (matchCountsCache && (Date.now() - matchCountsCache.timestamp) < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        matchCounts: matchCountsCache.data,
        cached: true
      });
    }

    // Connect to MongoDB
    const dbModule = await import('@/lib/mongodb');
    const profileModule = await import('@/models/Profile');
    
    const dbConnect = dbModule.default;
    const Profile = profileModule.default;
    
    await dbConnect();

    // Get all active profiles with full data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const profiles: any[] = await Profile.find({
      $or: [
        { status: 'Active' },
        { status: { $exists: false } }
      ]
    }).lean();

    const matchCounts: Record<string, number> = {};

    // Calculate match counts using EXACT same logic as matches API
    for (const currentProfile of profiles) {
      const profileId = currentProfile._id.toString();
      
      // Determine opposite gender
      const currentGender = (currentProfile.gender || '').toLowerCase();
      const oppositeGender = currentGender === 'male' ? 'female' : 'male';

      // Get potential matches (opposite gender, active profiles)
      const potentialMatches = profiles.filter(p => {
        const pGender = (p.gender || '').toLowerCase();
        return p._id.toString() !== profileId && pGender === oppositeGender;
      });

      // Count matches using EXACT same logic as matches/route.ts
      let count = 0;
      for (const p of potentialMatches) {
        if (isMatch(currentProfile, p)) {
          count++;
        }
      }

      matchCounts[profileId] = count;
    }

    // Cache the results
    matchCountsCache = {
      data: matchCounts,
      timestamp: Date.now()
    };

    return NextResponse.json({
      success: true,
      matchCounts,
      cached: false
    });
  } catch (error) {
    console.error('Error fetching match counts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch match counts' },
      { status: 500 }
    );
  }
}

// EXACT COPY of matching logic from matches/route.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isMatch(currentProfile: any, p: any): boolean {
  if (!p.gender) return false;

  let matchScore = 0;
  let totalValidRequirements = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isValidReq = (req: any) => {
    if (!req) return false;
    if (Array.isArray(req)) {
      return req.length > 0 && 
             !req.includes('any') && 
             !req.includes('Any') && 
             !req.includes('') &&
             req.some((item: string) => item && item.trim() !== '');
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

  // 1. Age matching
  if (isValidReq(currentProfile.requirements?.ageRange)) {
    totalValidRequirements++;
    const ageMatch = p.age >= currentProfile.requirements.ageRange.min && 
                    p.age <= currentProfile.requirements.ageRange.max;
    if (ageMatch) matchScore++;
  }

  // 2. Height matching
  if (isValidReq(currentProfile.requirements?.heightRange)) {
    totalValidRequirements++;
    const reqMinHeight = parseFloat(currentProfile.requirements.heightRange.min);
    const reqMaxHeight = parseFloat(currentProfile.requirements.heightRange.max);
    const profileHeight = parseFloat(p.height || '0');
    
    if (!isNaN(reqMinHeight) && !isNaN(reqMaxHeight) && !isNaN(profileHeight) && profileHeight > 0) {
      if (profileHeight >= reqMinHeight && profileHeight <= reqMaxHeight) {
        matchScore++;
      }
    }
  }

  // 3. Education matching
  if (isValidReq(currentProfile.requirements?.education)) {
    totalValidRequirements++;
    const reqEdu = currentProfile.requirements.education.toLowerCase().trim();
    const profileEdu = (p.education || '').toLowerCase().trim();
    
    if (profileEdu && profileEdu !== '' && profileEdu !== 'not specified') {
      if ((reqEdu.includes('graduate') && (profileEdu.includes('bachelor') || profileEdu.includes('graduate') || profileEdu.includes('master'))) ||
          (reqEdu.includes('bachelor') && (profileEdu.includes('bachelor') || profileEdu.includes('master') || profileEdu.includes('phd'))) ||
          (reqEdu.includes('master') && (profileEdu.includes('master') || profileEdu.includes('phd'))) ||
          profileEdu.includes(reqEdu) || reqEdu.includes(profileEdu)) {
        matchScore++;
      }
    }
  }

  // 4. Occupation matching
  if (isValidReq(currentProfile.requirements?.occupation)) {
    totalValidRequirements++;
    const reqOcc = currentProfile.requirements.occupation.toLowerCase().trim();
    const profileOcc = (p.occupation || '').toLowerCase().trim();
    
    if (profileOcc && profileOcc !== '' && profileOcc !== 'not specified' && profileOcc !== 'other') {
      if ((reqOcc.includes('professional') && (profileOcc.includes('engineer') || profileOcc.includes('doctor') || 
          profileOcc.includes('teacher') || profileOcc.includes('manager') || profileOcc.includes('officer'))) ||
          (reqOcc.includes('business') && (profileOcc.includes('business') || profileOcc.includes('entrepreneur'))) ||
          profileOcc.includes(reqOcc) || reqOcc.includes(profileOcc)) {
        matchScore++;
      }
    }
  }

  // 5. Location matching
  if (isValidReq(currentProfile.requirements?.location)) {
    totalValidRequirements++;
    const reqLocations = currentProfile.requirements.location.map((loc: string) => loc.toLowerCase().trim());
    const profileLoc = (p.city || p.address || '').toLowerCase().trim();
    
    if (profileLoc && profileLoc !== '') {
      const locationMatch = reqLocations.some((loc: string) => {
        return loc && loc !== '' && (profileLoc.includes(loc) || loc.includes(profileLoc) || profileLoc === loc);
      });
      if (locationMatch) matchScore++;
    }
  }

  // 6. Cast matching
  if (isValidReq(currentProfile.requirements?.cast)) {
    totalValidRequirements++;
    const reqCasts = currentProfile.requirements.cast.map((cast: string) => cast.toLowerCase().trim());
    const profileCast = (p.cast || '').toLowerCase().trim();
    
    if (profileCast && profileCast !== '' && profileCast !== 'other' && profileCast !== 'not specified') {
      const castMatch = reqCasts.some((cast: string) => {
        return cast && cast !== '' && cast !== 'other' && (profileCast.includes(cast) || cast.includes(profileCast) || profileCast === cast);
      });
      if (castMatch) matchScore++;
    }
  }

  // 7. Marital Status - with reverse check
  if (currentProfile.requirements?.maritalStatus && 
      Array.isArray(currentProfile.requirements.maritalStatus) && 
      currentProfile.requirements.maritalStatus.length > 0 &&
      !currentProfile.requirements.maritalStatus.includes('any')) {
    totalValidRequirements++;
    const reqStatus = currentProfile.requirements.maritalStatus.map((status: string) => status.toLowerCase());
    const profileStatus = (p.maritalStatus || '').toLowerCase();
    if (reqStatus.some((status: string) => profileStatus.includes(status))) {
      matchScore++;
    }
  }

  // 7B. REVERSE Marital Status Check
  if (p.requirements?.maritalStatus && 
      Array.isArray(p.requirements.maritalStatus) && 
      p.requirements.maritalStatus.length > 0 &&
      !p.requirements.maritalStatus.includes('any')) {
    const otherReqStatus = p.requirements.maritalStatus.map((status: string) => status.toLowerCase());
    const currentStatus = (currentProfile.maritalStatus || '').toLowerCase();
    if (!otherReqStatus.some((status: string) => currentStatus.includes(status))) {
      return false; // HARD REJECT
    }
  }

  // 8. Family Type
  if (currentProfile.requirements?.familyType && 
      currentProfile.requirements.familyType !== '' &&
      !['any', 'Any', 'any family'].includes(currentProfile.requirements.familyType)) {
    const reqFamily = currentProfile.requirements.familyType.toLowerCase();
    const profileFamily = (p.familyDetails || '').toLowerCase();
    if (profileFamily.includes(reqFamily) || 
        (reqFamily.includes('joint') && profileFamily.includes('joint')) ||
        (reqFamily.includes('nuclear') && profileFamily.includes('nuclear'))) {
      matchScore++;
    }
  }

  // 9. Mother Tongue
  if (currentProfile.requirements?.motherTongue && 
      Array.isArray(currentProfile.requirements.motherTongue) && 
      currentProfile.requirements.motherTongue.length > 0 &&
      !currentProfile.requirements.motherTongue.includes('any')) {
    const reqLanguages = currentProfile.requirements.motherTongue.map((lang: string) => lang.toLowerCase());
    const profileLang = (p.motherTongue || '').toLowerCase();
    if (reqLanguages.some((lang: string) => profileLang.includes(lang))) {
      matchScore++;
    }
  }

  // 10. Maslak
  if (currentProfile.requirements?.maslak && 
      Array.isArray(currentProfile.requirements.maslak) && 
      currentProfile.requirements.maslak.length > 0 &&
      !currentProfile.requirements.maslak.includes('any')) {
    const reqMaslak = currentProfile.requirements.maslak.map((m: string) => m.toLowerCase());
    const profileMaslak = (p.maslak || '').toLowerCase();
    if (reqMaslak.some((m: string) => profileMaslak.includes(m))) {
      matchScore++;
    }
  }

  // 11. House Type
  if (currentProfile.requirements?.houseType && 
      Array.isArray(currentProfile.requirements.houseType) && 
      currentProfile.requirements.houseType.length > 0 &&
      !currentProfile.requirements.houseType.includes('any')) {
    const reqHouse = currentProfile.requirements.houseType.map((h: string) => h.toLowerCase());
    const profileHouse = (p.houseType || '').toLowerCase();
    if (reqHouse.some((h: string) => profileHouse.includes(h))) {
      matchScore++;
    }
  }

  // 12. Belongs To
  if (currentProfile.requirements?.belongs && 
      Array.isArray(currentProfile.requirements.belongs) && 
      currentProfile.requirements.belongs.length > 0 &&
      !currentProfile.requirements.belongs.includes('any')) {
    const reqBelongs = currentProfile.requirements.belongs.map((b: string) => b.toLowerCase());
    const profileBelongs = (p.belongs || '').toLowerCase();
    if (reqBelongs.some((b: string) => profileBelongs.includes(b))) {
      matchScore++;
    }
  }

  // FINAL CHECK - same as matches/route.ts
  if (totalValidRequirements === 0) return false;
  if (totalValidRequirements < 3) return false;
  
  const matchPercentage = Math.round((matchScore / totalValidRequirements) * 100);
  const MINIMUM_PERCENTAGE = 70;
  
  return matchPercentage >= MINIMUM_PERCENTAGE;
}

// POST endpoint to clear cache
export async function POST() {
  try {
    const auth = await checkAuth();
    if (!auth.authenticated) return auth.response;

    matchCountsCache = null;
    
    return NextResponse.json({
      success: true,
      message: 'Match counts cache cleared'
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to clear cache' },
      { status: 500 }
    );
  }
}
