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
    
    // Get all profiles with their gender info
    const allProfiles = await Profile.find({}, 'name gender age').lean();
    
    const genderStats = {
      total: allProfiles.length,
      male: allProfiles.filter(p => p.gender === 'Male').length,
      female: allProfiles.filter(p => p.gender === 'Female').length,
      missing: allProfiles.filter(p => !p.gender).length
    };
    
    // Get sample profiles
    const sampleProfiles = allProfiles.slice(0, 10).map(p => ({
      name: p.name,
      gender: p.gender || 'MISSING',
      age: p.age
    }));
    
    return NextResponse.json({
      success: true,
      stats: genderStats,
      sampleProfiles,
      message: `Found ${genderStats.total} profiles. ${genderStats.missing} missing gender.`
    });
    
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to check profiles',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}