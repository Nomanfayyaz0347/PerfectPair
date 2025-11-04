import { NextRequest, NextResponse } from 'next/server';

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
        console.log('⚠️ Profile missing gender data:', currentProfile.name);
        return NextResponse.json({ 
          error: 'Profile gender data missing. Please update profile.',
          matches: []
        });
      }
      
      console.log('🔍 Current Profile:', { 
        name: currentProfile.name, 
        gender: currentProfile.gender,
        id: currentProfile._id 
      });
      
      // Determine opposite gender - handle case insensitive
      const currentGender = (currentProfile.gender || '').toLowerCase();
      const oppositeGender = currentGender === 'male' ? 'female' : 'male';
      console.log(`🎯 Current gender: ${currentGender}, Looking for: ${oppositeGender}`);
      
      // Get all other profiles with opposite gender only (case insensitive)
      const allProfiles = await Profile.find({ 
        _id: { $ne: profileId },
        gender: { $regex: new RegExp(`^${oppositeGender}$`, 'i') }  // Case insensitive search
      });
      console.log('👥 Opposite gender profiles found:', allProfiles.length);
      
      // DYNAMIC & PERCENTAGE-BASED AUTHENTIC MATCHING
      matches = allProfiles.filter(p => {
        console.log(`\n👤 Checking profile: ${p.name} (${p.gender})`);
        
        if (!p.gender) {
          console.log(`❌ Profile missing gender: ${p.name}`);
          return false;
        }
        
        const matchedFields = [];
        let matchScore = 0;
        let totalValidRequirements = 0;
        
        // Helper function to check if requirement is valid
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isValidReq = (req: any) => {
          if (!req) return false;
          if (Array.isArray(req)) return req.length > 0 && !req.includes('any');
          if (typeof req === 'string') return req !== '' && !['any', 'Any'].includes(req);
          if (typeof req === 'object' && 'min' in req && 'max' in req) return true;
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
          console.log(`🎂 Age: ${currentProfile.requirements.ageRange.min}-${currentProfile.requirements.ageRange.max} vs ${p.age} = ${ageMatch}`);
          
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
            console.log(`📏 Height: ${reqMinHeight}-${reqMaxHeight} vs ${profileHeight} = ${heightMatch}`);
            
            if (heightMatch) {
              matchedFields.push('Height Range');
              matchScore++;
            }
          }
        }
        
        // 3. Education matching - ONLY if specific requirements exist
        if (isValidReq(currentProfile.requirements?.education)) {
          totalValidRequirements++;
          const reqEdu = currentProfile.requirements.education.toLowerCase();
          const profileEdu = (p.education || '').toLowerCase();
          
          console.log(`📚 Education: "${reqEdu}" vs "${profileEdu}"`);
          
          let eduMatch = false;
          
          if (reqEdu.includes('graduate') && (profileEdu.includes('bachelor') || profileEdu.includes('graduate') || profileEdu.includes('master'))) {
            eduMatch = true;
          } else if (reqEdu.includes('bachelor') && (profileEdu.includes('bachelor') || profileEdu.includes('master') || profileEdu.includes('phd'))) {
            eduMatch = true;
          } else if (reqEdu.includes('master') && (profileEdu.includes('master') || profileEdu.includes('phd'))) {
            eduMatch = true;
          } else if (profileEdu.includes(reqEdu) || reqEdu.includes(profileEdu)) {
            eduMatch = true;
          }
          
          if (eduMatch) {
            matchedFields.push('Education Level');
            matchScore++;
            console.log(`✅ Education matched`);
          } else {
            console.log(`❌ Education mismatch`);
          }
        }
        
        // 4. Occupation matching - ONLY if specific requirements exist
        if (currentProfile.requirements?.occupation && 
            currentProfile.requirements.occupation !== '' && 
            !['any', 'Any', 'any occupation'].includes(currentProfile.requirements.occupation)) {
            
          const reqOcc = currentProfile.requirements.occupation.toLowerCase();
          const profileOcc = (p.occupation || '').toLowerCase();
          
          console.log(`💼 Occupation: "${reqOcc}" vs "${profileOcc}"`);
          
          let occMatch = false;
          
          if (reqOcc.includes('professional') && (profileOcc.includes('engineer') || profileOcc.includes('doctor') || 
              profileOcc.includes('teacher') || profileOcc.includes('manager') || profileOcc.includes('officer'))) {
            occMatch = true;
          } else if (reqOcc.includes('business') && (profileOcc.includes('business') || profileOcc.includes('entrepreneur'))) {
            occMatch = true;
          } else if (profileOcc.includes(reqOcc) || reqOcc.includes(profileOcc)) {
            occMatch = true;
          }
          
          if (occMatch) {
            matchedFields.push('Work/Job');
            matchScore++;
            console.log(`✅ Occupation matched`);
          } else {
            console.log(`❌ Occupation mismatch`);
          }
        }
        
        // 5. Location matching - ONLY if specific requirements exist
        if (currentProfile.requirements?.location && 
            Array.isArray(currentProfile.requirements.location) && 
            currentProfile.requirements.location.length > 0 &&
            !currentProfile.requirements.location.includes('any')) {
            
          const reqLocations = currentProfile.requirements.location.map((loc: string) => loc.toLowerCase());
          const profileLoc = (p.city || p.address || '').toLowerCase();
          
          console.log(`📍 Location: [${reqLocations.join(', ')}] vs "${profileLoc}"`);
          
          const locationMatch = reqLocations.some((loc: string) =>
            profileLoc.includes(loc) || loc.includes(profileLoc)
          );          if (locationMatch) {
            matchedFields.push('Location');
            matchScore++;
            console.log(`✅ Location matched`);
          } else {
            console.log(`❌ Location mismatch`);
          }
        }
        
        // 6. Cast matching - ONLY if specific requirements exist
        if (currentProfile.requirements?.cast && 
            Array.isArray(currentProfile.requirements.cast) && 
            currentProfile.requirements.cast.length > 0 &&
            !currentProfile.requirements.cast.includes('any')) {
            
          const reqCasts = currentProfile.requirements.cast.map((cast: string) => cast.toLowerCase());
          const profileCast = (p.cast || '').toLowerCase();
          
          console.log(`👥 Cast: [${reqCasts.join(', ')}] vs "${profileCast}"`);
          
          const castMatch = reqCasts.some((cast: string) => 
            profileCast.includes(cast) || cast.includes(profileCast) ||
            cast === 'not specified'
          );
          
          if (castMatch) {
            matchedFields.push('Cast');
            matchScore++;
            console.log(`✅ Cast matched`);
          } else {
            console.log(`❌ Cast mismatch`);
          }
        }
        
        // 7. Marital Status - ONLY if specific requirements exist
        if (currentProfile.requirements?.maritalStatus && 
            Array.isArray(currentProfile.requirements.maritalStatus) && 
            currentProfile.requirements.maritalStatus.length > 0 &&
            !currentProfile.requirements.maritalStatus.includes('any')) {
            
          const reqStatus = currentProfile.requirements.maritalStatus.map((status: string) => status.toLowerCase());
          const profileStatus = (p.maritalStatus || '').toLowerCase();
          
          console.log(`💍 Marital: [${reqStatus.join(', ')}] vs "${profileStatus}"`);
          
          const statusMatch = reqStatus.some((status: string) => profileStatus.includes(status));
          
          if (statusMatch) {
            matchedFields.push('Marital Status');
            matchScore++;
            console.log(`✅ Marital Status matched`);
          }
        }
        
        // 8. Family Type - ONLY if specific requirements exist
        if (currentProfile.requirements?.familyType && 
            currentProfile.requirements.familyType !== '' &&
            !['any', 'Any', 'any family'].includes(currentProfile.requirements.familyType)) {
            
          const reqFamily = currentProfile.requirements.familyType.toLowerCase();
          const profileFamily = (p.familyDetails || '').toLowerCase();
          
          console.log(`🏠 Family: "${reqFamily}" vs "${profileFamily}"`);
          
          if (profileFamily.includes(reqFamily) || 
              (reqFamily.includes('joint') && profileFamily.includes('joint')) ||
              (reqFamily.includes('nuclear') && profileFamily.includes('nuclear'))) {
            matchedFields.push('Family Type');
            matchScore++;
            console.log(`✅ Family Type matched`);
          }
        }
        
        // 9. Mother Tongue - ONLY if specific requirements exist
        if (currentProfile.requirements?.motherTongue && 
            Array.isArray(currentProfile.requirements.motherTongue) && 
            currentProfile.requirements.motherTongue.length > 0 &&
            !currentProfile.requirements.motherTongue.includes('any')) {
            
          const reqLanguages = currentProfile.requirements.motherTongue.map((lang: string) => lang.toLowerCase());
          const profileLang = (p.motherTongue || '').toLowerCase();
          
          console.log(`🗣️ Language: [${reqLanguages.join(', ')}] vs "${profileLang}"`);
          
          const langMatch = reqLanguages.some((lang: string) => profileLang.includes(lang));
          
          if (langMatch) {
            matchedFields.push('Mother Tongue');
            matchScore++;
            console.log(`✅ Mother Tongue matched`);
          }
        }
        
        // 10. Maslak - ONLY if specific requirements exist
        if (currentProfile.requirements?.maslak && 
            Array.isArray(currentProfile.requirements.maslak) && 
            currentProfile.requirements.maslak.length > 0 &&
            !currentProfile.requirements.maslak.includes('any')) {
            
          const reqMaslak = currentProfile.requirements.maslak.map((m: string) => m.toLowerCase());
          const profileMaslak = (p.maslak || '').toLowerCase();
          
          console.log(`🕌 Maslak: [${reqMaslak.join(', ')}] vs "${profileMaslak}"`);
          
          const maslakMatch = reqMaslak.some((m: string) => profileMaslak.includes(m));
          
          if (maslakMatch) {
            matchedFields.push('Maslak');
            matchScore++;
            console.log(`✅ Maslak matched`);
          }
        }
        
        // 11. House Type - ONLY if specific requirements exist
        if (currentProfile.requirements?.houseType && 
            Array.isArray(currentProfile.requirements.houseType) && 
            currentProfile.requirements.houseType.length > 0 &&
            !currentProfile.requirements.houseType.includes('any')) {
            
          const reqHouse = currentProfile.requirements.houseType.map((h: string) => h.toLowerCase());
          const profileHouse = (p.houseType || '').toLowerCase();
          
          console.log(`🏠 House: [${reqHouse.join(', ')}] vs "${profileHouse}"`);
          
          const houseMatch = reqHouse.some((h: string) => profileHouse.includes(h));
          
          if (houseMatch) {
            matchedFields.push('House Type');
            matchScore++;
            console.log(`✅ House Type matched`);
          }
        }
        
        // 12. Belongs To - ONLY if specific requirements exist
        if (currentProfile.requirements?.belongs && 
            Array.isArray(currentProfile.requirements.belongs) && 
            currentProfile.requirements.belongs.length > 0 &&
            !currentProfile.requirements.belongs.includes('any')) {
            
          const reqBelongs = currentProfile.requirements.belongs.map((b: string) => b.toLowerCase());
          const profileBelongs = (p.belongs || '').toLowerCase();
          
          console.log(`🌍 Belongs: [${reqBelongs.join(', ')}] vs "${profileBelongs}"`);
          
          const belongsMatch = reqBelongs.some((b: string) => profileBelongs.includes(b));
          
          if (belongsMatch) {
            matchedFields.push('Belongs To');
            matchScore++;
            console.log(`✅ Belongs To matched`);
          }
        }
        
        // Add debug info about requirements
        console.log(`🔍 Profile ${currentProfile.name} requirements analysis:`);
        console.log(`   - Age Range: ${currentProfile.requirements?.ageRange ? 'YES' : 'NO'}`);
        console.log(`   - Height Range: ${currentProfile.requirements?.heightRange ? 'YES' : 'NO'}`);
        console.log(`   - Education: ${currentProfile.requirements?.education && currentProfile.requirements.education !== 'any' ? 'YES' : 'NO'}`);
        console.log(`   - Occupation: ${currentProfile.requirements?.occupation && currentProfile.requirements.occupation !== 'any' ? 'YES' : 'NO'}`);
        console.log(`   - Location: ${currentProfile.requirements?.location && Array.isArray(currentProfile.requirements.location) && currentProfile.requirements.location.length > 0 ? 'YES' : 'NO'}`);
        console.log(`   - Cast: ${currentProfile.requirements?.cast && Array.isArray(currentProfile.requirements.cast) && currentProfile.requirements.cast.length > 0 ? 'YES' : 'NO'}`);
        console.log(`   - Total Valid Requirements: ${[
          currentProfile.requirements?.ageRange,
          currentProfile.requirements?.heightRange,
          currentProfile.requirements?.education && currentProfile.requirements.education !== 'any',
          currentProfile.requirements?.occupation && currentProfile.requirements.occupation !== 'any',
          currentProfile.requirements?.location && Array.isArray(currentProfile.requirements.location) && currentProfile.requirements.location.length > 0,
          currentProfile.requirements?.cast && Array.isArray(currentProfile.requirements.cast) && currentProfile.requirements.cast.length > 0,
          currentProfile.requirements?.maritalStatus && Array.isArray(currentProfile.requirements.maritalStatus) && currentProfile.requirements.maritalStatus.length > 0,
          currentProfile.requirements?.familyType && currentProfile.requirements.familyType !== 'any',
          currentProfile.requirements?.motherTongue && Array.isArray(currentProfile.requirements.motherTongue) && currentProfile.requirements.motherTongue.length > 0,
          currentProfile.requirements?.maslak && Array.isArray(currentProfile.requirements.maslak) && currentProfile.requirements.maslak.length > 0,
          currentProfile.requirements?.houseType && Array.isArray(currentProfile.requirements.houseType) && currentProfile.requirements.houseType.length > 0,
          currentProfile.requirements?.belongs && Array.isArray(currentProfile.requirements.belongs) && currentProfile.requirements.belongs.length > 0
        ].filter(Boolean).length}`)
        
        // ================================
        // DYNAMIC PERCENTAGE CALCULATION
        // ================================
        
        if (totalValidRequirements === 0) {
          console.log(`⚠️ ${p.name} - No valid requirements found, skipping`);
          return false;
        }
        
        const matchPercentage = Math.round((matchScore / totalValidRequirements) * 100);
        const MINIMUM_PERCENTAGE = 80; // 80% match required
        
        console.log(`🔍 ${currentProfile.name} Requirements Summary:`);
        console.log(`   📊 Total Valid Requirements: ${totalValidRequirements}`);
        console.log(`   ✅ Fields Matched: ${matchScore}`);
        console.log(`   📈 Match Percentage: ${matchPercentage}%`);
        console.log(`   🎯 Required: ${MINIMUM_PERCENTAGE}%`);
        
        console.log(`📊 ${p.name} - Score: ${matchScore}/${totalValidRequirements} (${matchPercentage}%)`);
        console.log(`📋 Matched: [${matchedFields.join(', ')}]`);
        
        if (matchPercentage >= MINIMUM_PERCENTAGE) {
          console.log(`✅ ACCEPTING ${p.name} - ${matchPercentage}% match (Required: ${MINIMUM_PERCENTAGE}%)`);
          p._tempMatchData = { 
            matchedFields, 
            matchScore: `${matchScore}/${totalValidRequirements}`,
            percentage: matchPercentage
          };
          return true;
        } else {
          console.log(`❌ REJECTING ${p.name} - Only ${matchPercentage}% match (Required: ${MINIMUM_PERCENTAGE}%)`);
          return false;
        }
      });
      
      // Add matching data to the final matches
      matches = matches.map(match => ({
        ...match.toObject(), // Convert MongoDB document to plain object
        matchedFields: match._tempMatchData?.matchedFields || [],
        matchScore: match._tempMatchData?.matchScore || '0/12'
      }));
      
      console.log(`MongoDB matches found: ${matches.length} for profile ${currentProfile.name}`);
      
    } catch (dbError) {
      console.log('MongoDB matching failed, using in-memory storage:', dbError);
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
    
    return NextResponse.json({
      matches,
      count: matches.length,
      method: useInMemory ? 'in-memory' : 'mongodb'
    });
  } catch (error) {
    console.error('Error finding matches:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}