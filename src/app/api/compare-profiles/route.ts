import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Profile from '@/models/Profile';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const profile1Name = searchParams.get('profile1');
    const profile2Name = searchParams.get('profile2');

    if (!profile1Name || !profile2Name) {
      return NextResponse.json({
        error: 'Both profile names are required'
      }, { status: 400 });
    }

    await dbConnect();

    // Find both profiles
    const profile1 = await Profile.findOne({
      name: { $regex: profile1Name, $options: 'i' }
    }).lean();
    
    const profile2 = await Profile.findOne({
      name: { $regex: profile2Name, $options: 'i' }
    }).lean();

    if (!profile1 || !profile2) {
      return NextResponse.json({
        error: 'One or both profiles not found'
      }, { status: 404 });
    }

    // Check basic compatibility (opposite genders)
    if ((profile1 as any).gender === (profile2 as any).gender) {
      return NextResponse.json({
        match: false,
        reason: 'Profiles are of the same gender'
      });
    }

    // Requirements-based matching (like Matches page)
    const matchingFields: string[] = [];
    let matchScore = 0;
    let totalValidRequirements = 0;

    // Helper function to check if requirement is valid
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

    // 1. Age Range matching
    if (isValidReq((profile1 as any).requirements?.ageRange)) {
      totalValidRequirements++;
      const ageMatch = (profile2 as any).age >= (profile1 as any).requirements.ageRange.min && 
                      (profile2 as any).age <= (profile1 as any).requirements.ageRange.max;
      if (ageMatch) {
        matchingFields.push('ageRange');
        matchScore++;
      }
    }

    // 2. Height Range matching
    if (isValidReq((profile1 as any).requirements?.heightRange)) {
      totalValidRequirements++;
      const reqMinHeight = parseFloat((profile1 as any).requirements.heightRange.min);
      const reqMaxHeight = parseFloat((profile1 as any).requirements.heightRange.max);
      const profileHeight = parseFloat((profile2 as any).height || '0');
      
      if (!isNaN(reqMinHeight) && !isNaN(reqMaxHeight) && !isNaN(profileHeight) && profileHeight > 0) {
        const heightMatch = profileHeight >= reqMinHeight && profileHeight <= reqMaxHeight;
        if (heightMatch) {
          matchingFields.push('heightRange');
          matchScore++;
        }
      }
    }

    // 3. Education matching
    if (isValidReq((profile1 as any).requirements?.education)) {
      totalValidRequirements++;
      const reqEdu = (profile1 as any).requirements.education.toLowerCase().trim();
      const profileEdu = ((profile2 as any).education || '').toLowerCase().trim();
      
      let eduMatch = false;
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
        matchingFields.push('education');
        matchScore++;
      }
    }

    // 4. Occupation matching
    if (isValidReq((profile1 as any).requirements?.occupation)) {
      totalValidRequirements++;
      const reqOcc = (profile1 as any).requirements.occupation.toLowerCase().trim();
      const profileOcc = ((profile2 as any).occupation || '').toLowerCase().trim();
      
      let occMatch = false;
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
        matchingFields.push('occupation');
        matchScore++;
      }
    }

    // 5. Location matching
    if (isValidReq((profile1 as any).requirements?.location)) {
      totalValidRequirements++;
      const reqLocations = (profile1 as any).requirements.location.map((loc: string) => loc.toLowerCase().trim());
      const profileLoc = ((profile2 as any).city || (profile2 as any).address || '').toLowerCase().trim();
      
      if (profileLoc && profileLoc !== '') {
        const locationMatch = reqLocations.some((loc: string) => {
          return loc && loc !== '' && (
            profileLoc.includes(loc) || 
            loc.includes(profileLoc) ||
            profileLoc === loc
          );
        });
        
        if (locationMatch) {
          matchingFields.push('location');
          matchScore++;
        }
      }
    }

    // 6. Cast matching
    if (isValidReq((profile1 as any).requirements?.cast)) {
      totalValidRequirements++;
      const reqCasts = (profile1 as any).requirements.cast.map((cast: string) => cast.toLowerCase().trim());
      const profileCast = ((profile2 as any).cast || '').toLowerCase().trim();
      
      if (profileCast && profileCast !== '' && profileCast !== 'other' && profileCast !== 'not specified') {
        const castMatch = reqCasts.some((cast: string) => {
          return cast && cast !== '' && cast !== 'other' && (
            profileCast.includes(cast) || 
            cast.includes(profileCast) ||
            profileCast === cast
          );
        });
        
        if (castMatch) {
          matchingFields.push('cast');
          matchScore++;
        }
      }
    }

    // 7. Marital Status matching
    if ((profile1 as any).requirements?.maritalStatus && 
        Array.isArray((profile1 as any).requirements.maritalStatus) && 
        (profile1 as any).requirements.maritalStatus.length > 0 &&
        !(profile1 as any).requirements.maritalStatus.includes('any')) {
        
      totalValidRequirements++;
      const reqStatus = (profile1 as any).requirements.maritalStatus.map((status: string) => status.toLowerCase());
      const profileStatus = ((profile2 as any).maritalStatus || '').toLowerCase();
      
      const statusMatch = reqStatus.some((status: string) => profileStatus.includes(status));
      
      if (statusMatch) {
        matchingFields.push('maritalStatus');
        matchScore++;
      }
    }

    // 8. Mother Tongue matching
    if (isValidReq((profile1 as any).requirements?.motherTongue)) {
      totalValidRequirements++;
      const reqTongues = Array.isArray((profile1 as any).requirements.motherTongue) 
        ? (profile1 as any).requirements.motherTongue.map((t: string) => t.toLowerCase().trim())
        : [(profile1 as any).requirements.motherTongue.toLowerCase().trim()];
      const profileTongue = ((profile2 as any).motherTongue || '').toLowerCase().trim();
      
      if (profileTongue && profileTongue !== '') {
        const tongueMatch = reqTongues.some((tongue: string) => {
          return tongue && tongue !== '' && (
            profileTongue.includes(tongue) || 
            tongue.includes(profileTongue) ||
            profileTongue === tongue
          );
        });
        
        if (tongueMatch) {
          matchingFields.push('motherTongue');
          matchScore++;
        }
      }
    }

    // 9. Maslak matching
    if (isValidReq((profile1 as any).requirements?.maslak)) {
      totalValidRequirements++;
      const reqMaslaks = Array.isArray((profile1 as any).requirements.maslak)
        ? (profile1 as any).requirements.maslak.map((m: string) => m.toLowerCase().trim())
        : [(profile1 as any).requirements.maslak.toLowerCase().trim()];
      const profileMaslak = ((profile2 as any).maslak || '').toLowerCase().trim();
      
      if (profileMaslak && profileMaslak !== '') {
        const maslakMatch = reqMaslaks.some((maslak: string) => {
          return maslak && maslak !== '' && (
            profileMaslak.includes(maslak) || 
            maslak.includes(profileMaslak) ||
            profileMaslak === maslak
          );
        });
        
        if (maslakMatch) {
          matchingFields.push('maslak');
          matchScore++;
        }
      }
    }

    // Calculate requirements-based match percentage
    const requirementMatchPercentage = totalValidRequirements > 0 
      ? Math.round((matchScore / totalValidRequirements) * 100)
      : 0;

    // DIRECT FIELD COMPARISON (Simple matching)
    const directMatchingFields: string[] = [];
    const directFieldsToCompare = [
      'cast',
      'maslak',
      'motherTongue',
      'education',
      'occupation',
      'city',
      'country',
      'maritalStatus',
      'complexion'
    ];

    for (const field of directFieldsToCompare) {
      const field1 = ((profile1 as any)[field] || '').toString().toLowerCase().trim();
      const field2 = ((profile2 as any)[field] || '').toString().toLowerCase().trim();
      
      if (field1 && field2 && field1 !== '' && field2 !== '' &&
          field1 !== 'not specified' && field2 !== 'not specified') {
        // Exact or partial match
        if (field1 === field2 || field1.includes(field2) || field2.includes(field1)) {
          directMatchingFields.push(field);
        }
      }
    }

    // Age direct comparison (within 5 years)
    const ageDiff = Math.abs((profile1 as any).age - (profile2 as any).age);
    if (ageDiff <= 5) {
      directMatchingFields.push('age');
    }

    // Height direct comparison (within 0.3 feet)
    const height1 = parseFloat((profile1 as any).height || '0');
    const height2 = parseFloat((profile2 as any).height || '0');
    if (height1 > 0 && height2 > 0 && Math.abs(height1 - height2) <= 0.3) {
      directMatchingFields.push('height');
    }

    const directMatchPercentage = Math.round((directMatchingFields.length / (directFieldsToCompare.length + 2)) * 100);

    return NextResponse.json({
      match: matchScore > 0 || directMatchingFields.length > 0,
      
      // Requirements-based matching
      requirementMatchPercentage,
      requirementMatchingFields: matchingFields,
      totalRequirements: totalValidRequirements,
      matchedRequirements: matchScore,
      
      // Direct field comparison
      directMatchPercentage,
      directMatchingFields,
      
      // Legacy support
      matchPercentage: requirementMatchPercentage,
      matchingFields,
      matchedCount: matchScore,
      
      profiles: {
        profile1: {
          name: (profile1 as any).name,
          age: (profile1 as any).age,
          gender: (profile1 as any).gender,
          education: (profile1 as any).education,
          cast: (profile1 as any).cast,
          maslak: (profile1 as any).maslak,
          motherTongue: (profile1 as any).motherTongue,
          maritalStatus: (profile1 as any).maritalStatus,
          numberOfBrothers: (profile1 as any).numberOfBrothers,
          numberOfMarriedBrothers: (profile1 as any).numberOfMarriedBrothers,
          numberOfSisters: (profile1 as any).numberOfSisters,
          numberOfMarriedSisters: (profile1 as any).numberOfMarriedSisters,
          occupation: (profile1 as any).occupation,
          monthlyIncome: (profile1 as any).monthlyIncome,
          city: (profile1 as any).city,
          country: (profile1 as any).country,
          height: (profile1 as any).height,
          complexion: (profile1 as any).complexion,
          disability: (profile1 as any).disability
        },
        profile2: {
          name: (profile2 as any).name,
          age: (profile2 as any).age,
          gender: (profile2 as any).gender,
          education: (profile2 as any).education,
          cast: (profile2 as any).cast,
          maslak: (profile2 as any).maslak,
          motherTongue: (profile2 as any).motherTongue,
          maritalStatus: (profile2 as any).maritalStatus,
          numberOfBrothers: (profile2 as any).numberOfBrothers,
          numberOfMarriedBrothers: (profile2 as any).numberOfMarriedBrothers,
          numberOfSisters: (profile2 as any).numberOfSisters,
          numberOfMarriedSisters: (profile2 as any).numberOfMarriedSisters,
          occupation: (profile2 as any).occupation,
          monthlyIncome: (profile2 as any).monthlyIncome,
          city: (profile2 as any).city,
          country: (profile2 as any).country,
          height: (profile2 as any).height,
          complexion: (profile2 as any).complexion,
          disability: (profile2 as any).disability
        }
      }
    });

  } catch (error) {
    console.error('Error in compare-profiles:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 });
  }
}