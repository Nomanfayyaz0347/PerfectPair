import { NextRequest, NextResponse } from 'next/server';
import { InMemoryStorage } from '@/lib/storage';

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
      
      // Get all other profiles
      const allProfiles = await Profile.find({ _id: { $ne: profileId } });
      
      // Apply matching logic
      matches = allProfiles.filter(p => {
        let score = 0;
        let totalCriteria = 0;
        
        // Age matching - Primary criteria
        totalCriteria++;
        const ageMatch = currentProfile.requirements.ageRange.min <= p.age && 
                        p.age <= currentProfile.requirements.ageRange.max;
        if (ageMatch) score++;
        
        // Education matching - Flexible
        totalCriteria++;
        if (currentProfile.requirements.education) {
          const reqEdu = currentProfile.requirements.education.toLowerCase();
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
        if (currentProfile.requirements.occupation) {
          const reqOcc = currentProfile.requirements.occupation.toLowerCase();
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
        
        // Return true if at least 60% criteria match (including age as mandatory)
        return ageMatch && (score / totalCriteria) >= 0.6;
      });
      
      console.log(`MongoDB matches found: ${matches.length} for profile ${currentProfile.name}`);
      
    } catch (dbError) {
      console.log('MongoDB matching failed, using in-memory storage:', dbError);
      useInMemory = true;
      
      // Fallback to in-memory storage
      try {
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