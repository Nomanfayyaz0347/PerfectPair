import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('🔄 Starting gender field update for existing profiles...');
    
    const dbModule = await import('@/lib/mongodb');
    const profileModule = await import('@/models/Profile');
    
    const dbConnect = dbModule.default;
    const Profile = profileModule.default;
    
    await dbConnect();
    
    // Find profiles without gender field
    const profilesWithoutGender = await Profile.find({
      $or: [
        { gender: { $exists: false } },
        { gender: null },
        { gender: '' }
      ]
    });
    
    console.log(`📊 Found ${profilesWithoutGender.length} profiles without gender`);
    
    let updatedCount = 0;
    
    for (const profile of profilesWithoutGender) {
      // Default assignment based on name patterns (you can customize this)
      let assignedGender = 'Male'; // Default to male
      
      // Female name patterns (customize as needed)
      const femaleNames = [
        'areeb', 'maheen', 'fatima', 'aisha', 'khadija', 'zainab', 'maryam', 
        'sara', 'hira', 'amna', 'farah', 'noor', 'laiba', 'rabia', 'ayesha'
      ];
      
      const nameToCheck = profile.name.toLowerCase();
      if (femaleNames.some(fname => nameToCheck.includes(fname))) {
        assignedGender = 'Female';
      }
      
      // Update the profile
      await Profile.findByIdAndUpdate(profile._id, { 
        gender: assignedGender 
      });
      
      updatedCount++;
      console.log(`✅ Updated ${profile.name} -> ${assignedGender}`);
    }
    
    return NextResponse.json({
      success: true,
      message: `Updated ${updatedCount} profiles with gender information`,
      details: {
        totalFound: profilesWithoutGender.length,
        updated: updatedCount
      }
    });
    
  } catch (error) {
    console.error('❌ Error updating gender fields:', error);
    return NextResponse.json({
      error: 'Failed to update gender fields',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const dbModule = await import('@/lib/mongodb');
    const profileModule = await import('@/models/Profile');
    
    const dbConnect = dbModule.default;
    const Profile = profileModule.default;
    
    await dbConnect();
    
    // Get gender statistics
    const totalProfiles = await Profile.countDocuments();
    const maleProfiles = await Profile.countDocuments({ gender: 'Male' });
    const femaleProfiles = await Profile.countDocuments({ gender: 'Female' });
    const noGender = await Profile.countDocuments({
      $or: [
        { gender: { $exists: false } },
        { gender: null },
        { gender: '' }
      ]
    });
    
    return NextResponse.json({
      statistics: {
        total: totalProfiles,
        male: maleProfiles,
        female: femaleProfiles,
        missing: noGender
      }
    });
    
  } catch (error) {
    console.error('Error getting gender stats:', error);
    return NextResponse.json({
      error: 'Failed to get statistics'
    }, { status: 500 });
  }
}