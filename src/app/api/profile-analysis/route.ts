import { NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/authCheck';

export async function GET() {
  try {
    // Check admin authentication
    const auth = await checkAdminAuth();
    if (!auth.authenticated) return auth.response;
    
    const dbModule = await import('@/lib/mongodb');
    const profileModule = await import('@/models/Profile');
    
    const dbConnect = dbModule.default;
    const Profile = profileModule.default;
    
    await dbConnect();
    
    // Get all profiles with essential fields
    const allProfiles = await Profile.find({}, {
      name: 1,
      gender: 1,
      age: 1,
      requirements: 1,
      _id: 1
    }).lean();
    
    const analysis = {
      totalProfiles: allProfiles.length,
      maleProfiles: allProfiles.filter(p => p.gender === 'Male').length,
      femaleProfiles: allProfiles.filter(p => p.gender === 'Female').length,
      missingGender: allProfiles.filter(p => !p.gender).length,
      missingRequirements: allProfiles.filter(p => !p.requirements || !p.requirements.ageRange).length,
      profileDetails: allProfiles.map(p => ({
        name: p.name,
        gender: p.gender || 'MISSING',
        age: p.age,
        hasRequirements: !!(p.requirements && p.requirements.ageRange),
        ageRange: p.requirements?.ageRange ? `${p.requirements.ageRange.min}-${p.requirements.ageRange.max}` : 'MISSING'
      }))
    };
    
    // Test a few matches
    const testResults = [];
    const testProfiles = allProfiles.slice(0, 3); // Test first 3 profiles
    
    for (const profile of testProfiles) {
      if (!profile.gender) {
        testResults.push({
          name: profile.name,
          error: 'Missing gender data',
          matches: 0
        });
        continue;
      }
      
      // Find opposite gender profiles (case insensitive)  
      const currentGender = (profile.gender || '').toLowerCase();
      const oppositeGender = currentGender === 'male' ? 'female' : 'male';
      const potentialMatches = allProfiles.filter(p => 
        String(p._id) !== String(profile._id) && 
        (p.gender || '').toLowerCase() === oppositeGender
      );
      
      testResults.push({
        name: profile.name,
        gender: profile.gender,
        oppositeGenderAvailable: potentialMatches.length,
        sampleMatches: potentialMatches.slice(0, 3).map(m => `${m.name} (${m.gender})`)
      });
    }
    
    return NextResponse.json({
      success: true,
      analysis,
      testResults,
      recommendations: {
        needGenderUpdate: analysis.missingGender > 0,
        needRequirementsUpdate: analysis.missingRequirements > 0,
        canMatchMales: analysis.femaleProfiles > 0,
        canMatchFemales: analysis.maleProfiles > 0
      }
    });
    
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to check profiles',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}