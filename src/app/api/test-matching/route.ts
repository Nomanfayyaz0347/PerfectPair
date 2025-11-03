import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🧪 Testing matching system...');
    
    const dbModule = await import('@/lib/mongodb');
    const profileModule = await import('@/models/Profile');
    
    const dbConnect = dbModule.default;
    const Profile = profileModule.default;
    
    await dbConnect();
    
    // Get all profiles to test matching
    const profiles = await Profile.find({}).lean();
    
    if (profiles.length === 0) {
      return NextResponse.json({
        error: 'No profiles found in database'
      });
    }
    
    console.log(`Found ${profiles.length} profiles to test`);
    
    const results = [];
    const testProfiles = profiles.slice(0, 5); // Test first 5
    
    for (const profile of testProfiles) {
      console.log(`\n🔍 Testing matches for: ${profile.name} (${profile.gender || 'No Gender'})`);
      
      // Direct matching logic test (bypass API)
      try {
        if (!profile.gender) {
          results.push({
            profile: { name: profile.name, gender: 'MISSING', age: profile.age },
            matchCount: 0,
            error: 'Missing gender data'
          });
          continue;
        }
        
        // Find opposite gender profiles (case insensitive)
        const currentGender = (profile.gender || '').toLowerCase();
        const oppositeGender = currentGender === 'male' ? 'female' : 'male';
        const potentialMatches = profiles.filter(p => 
          String(p._id) !== String(profile._id) && 
          (p.gender || '').toLowerCase() === oppositeGender
        );
        
        console.log(`Found ${potentialMatches.length} opposite gender profiles for ${profile.name}`);
        
        results.push({
          profile: {
            name: profile.name,
            gender: profile.gender,
            age: profile.age
          },
          matchCount: potentialMatches.length,
          oppositeGender,
          sampleMatches: potentialMatches.slice(0, 3).map(m => `${m.name} (${m.gender})`),
          error: null
        });
        
      } catch (err) {
        results.push({
          profile: {
            name: profile.name,
            gender: profile.gender || 'MISSING',
            age: profile.age
          },
          matchCount: 0,
          error: `API Error: ${err instanceof Error ? err.message : 'Unknown'}`
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Matching test completed',
      results,
      summary: {
        totalTested: results.length,
        withMatches: results.filter(r => r.matchCount > 0).length,
        withErrors: results.filter(r => r.error).length
      }
    });
    
  } catch (error) {
    console.error('❌ Test matching error:', error);
    return NextResponse.json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}