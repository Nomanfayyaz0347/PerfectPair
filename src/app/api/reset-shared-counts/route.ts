import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('🔄 Resetting all profile shared counts...');
    
    const dbModule = await import('@/lib/mongodb');
    const profileModule = await import('@/models/Profile');
    
    const dbConnect = dbModule.default;
    const Profile = profileModule.default;
    
    await dbConnect();
    
    // Update all profiles to have sharedCount: 0
    const result = await Profile.updateMany(
      {}, // Empty filter = update all documents
      { $set: { sharedCount: 0 } }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} profiles with sharedCount: 0`);
    
    // Get count to verify
    const totalProfiles = await Profile.countDocuments();
    const profilesWithCount = await Profile.countDocuments({ sharedCount: { $exists: true } });
    
    return NextResponse.json({
      success: true,
      message: 'All profile shared counts reset to 0',
      totalProfiles,
      profilesUpdated: result.modifiedCount,
      profilesWithSharedCount: profilesWithCount,
      timestamp: new Date().toISOString()
    });

  } catch (error: unknown) {
    console.error('❌ Reset shared counts failed:', error);
    return NextResponse.json({
      error: 'Failed to reset shared counts',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}