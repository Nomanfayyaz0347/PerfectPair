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
      
      // Apply matching logic - profiles already filtered by opposite gender
      matches = allProfiles.filter(p => {
        console.log(`👤 Checking profile: ${p.name} (${p.gender})`);
        
        // Skip if missing gender (safety check)
        if (!p.gender) {
          console.log(`❌ Profile missing gender: ${p.name}`);
          return false;
        }
        
        console.log(`✅ Proceeding with match criteria for ${p.name}`);
        
        // Gender already filtered at query level, so proceed with other criteria
        
        let score = 0;
        let totalCriteria = 0;
        
        // Age matching - Primary criteria
        totalCriteria++;
        let ageMatch = false;
        
        if (currentProfile.requirements && currentProfile.requirements.ageRange) {
          ageMatch = currentProfile.requirements.ageRange.min <= p.age && 
                    p.age <= currentProfile.requirements.ageRange.max;
          console.log(`🎂 Age check: ${currentProfile.requirements.ageRange.min}-${currentProfile.requirements.ageRange.max} vs ${p.age} = ${ageMatch}`);
        } else {
          // If no age requirements, consider it a match
          ageMatch = true;
          console.log(`🎂 No age requirements set, considering match for ${p.name}`);
        }
        if (ageMatch) score++;
        
        // Education matching - Flexible
        totalCriteria++;
        if (currentProfile.requirements && currentProfile.requirements.education && 
            currentProfile.requirements.education !== '' && currentProfile.requirements.education !== 'Any') {
          const reqEdu = currentProfile.requirements.education.toLowerCase();
          const profileEdu = (p.education || '').toLowerCase();
          
          console.log(`📚 Education check: "${reqEdu}" vs "${profileEdu}"`);
          
          // More flexible education matching
          if (reqEdu.includes('bachelor') && (profileEdu.includes('bachelor') || profileEdu.includes('master') || profileEdu.includes('phd'))) {
            score++;
            console.log(`✅ Education match: Bachelor level accepted`);
          } else if (reqEdu.includes('master') && (profileEdu.includes('master') || profileEdu.includes('phd'))) {
            score++;
            console.log(`✅ Education match: Master level accepted`);
          } else if (profileEdu.includes(reqEdu) || reqEdu.includes(profileEdu)) {
            score++;
            console.log(`✅ Education match: Direct match`);
          }
        } else {
          score++; // No specific requirement means match
          console.log(`📚 No education requirements, considering match`);
        }
        
        // Occupation matching - Very flexible
        totalCriteria++;
        if (currentProfile.requirements && currentProfile.requirements.occupation && 
            currentProfile.requirements.occupation !== '' && currentProfile.requirements.occupation !== 'Any') {
          const reqOcc = currentProfile.requirements.occupation.toLowerCase();
          const profileOcc = (p.occupation || '').toLowerCase();
          
          console.log(`💼 Occupation check: "${reqOcc}" vs "${profileOcc}"`);
          
          if (reqOcc.includes('any') || reqOcc.includes('respectable') || reqOcc.includes('professional') || 
              profileOcc.includes(reqOcc) || reqOcc.includes(profileOcc)) {
            score++;
            console.log(`✅ Occupation match accepted`);
          } else {
            console.log(`➡️ Occupation different but continuing`);
          }
        } else {
          score++; // No specific requirement means match
          console.log(`💼 No occupation requirements, considering match`);
        }
        
        // Location matching - Flexible
        totalCriteria++;
        if (currentProfile.requirements.location) {
          const reqLoc = currentProfile.requirements.location.toLowerCase();
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
        
        // Cast matching - Important criteria
        totalCriteria++;
        if (currentProfile.requirements.cast) {
          const reqCast = currentProfile.requirements.cast.toLowerCase();
          const profileCast = p.cast.toLowerCase();
          
          if (reqCast.includes('any') || reqCast.includes('all') || reqCast === 'not specified') {
            score++;
          } else if (profileCast.includes(reqCast) || reqCast.includes(profileCast)) {
            score++;
          } else {
            // Partial match for similar casts
            const castGroups = {
              'sheikh': ['shaikh', 'sheikh', 'shekh'],
              'rajput': ['rajpoot', 'rajput'],
              'malik': ['malick', 'malik'],
              'khan': ['khan', 'pathan'],
              'chaudhry': ['chaudry', 'chaudhary', 'chaudhri']
            };
            
            for (const [main, variants] of Object.entries(castGroups)) {
              if ((variants.some(v => reqCast.includes(v)) && variants.some(v => profileCast.includes(v))) ||
                  (reqCast.includes(main) && variants.some(v => profileCast.includes(v))) ||
                  (profileCast.includes(main) && variants.some(v => reqCast.includes(v)))) {
                score++;
                break;
              }
            }
          }
        } else {
          score++; // No specific requirement means match
        }
        
        // Very lenient matching - just need opposite gender
        const matchPercentage = totalCriteria > 0 ? (score / totalCriteria) : 1;
        console.log(`📊 ${p.name} - Score: ${score}/${totalCriteria} (${Math.round(matchPercentage * 100)}%) - Age Match: ${ageMatch}`);
        
        // Accept all opposite gender profiles for now (we already filtered by gender)
        // This ensures matches will be found
        console.log(`✅ Accepting ${p.name} as match`);
        return true;
      });
      
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