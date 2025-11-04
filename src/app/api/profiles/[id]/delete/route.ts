import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const resolvedParams = await params;
    const profileId = resolvedParams.id;
    
    console.log('🗑️ Delete request for profile ID:', profileId);
    
    // Try MongoDB first
    try {
      const dbModule = await import('@/lib/mongodb');
      const profileModule = await import('@/models/Profile');
      
      const dbConnect = dbModule.default;
      const Profile = profileModule.default;
      
      await dbConnect();
      
      // Check if profile exists
      const existingProfile = await Profile.findById(profileId);
      if (!existingProfile) {
        console.log('❌ Profile not found:', profileId);
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
      }
      
      console.log('📋 Found profile to delete:', existingProfile.name);
      
      // Delete the profile
      await Profile.findByIdAndDelete(profileId);
      
      console.log('✅ Profile deleted successfully from MongoDB:', profileId);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Profile deleted successfully',
        deletedProfile: {
          id: profileId,
          name: existingProfile.name
        }
      });
      
    } catch (dbError) {
      console.error('❌ MongoDB delete failed:', dbError);
      
      // Fallback to in-memory storage
      try {
        const { InMemoryStorage } = await import('@/lib/storage');
        const success = await InMemoryStorage.deleteProfile(profileId);
        
        if (success) {
          console.log('✅ Profile deleted from in-memory storage:', profileId);
          return NextResponse.json({ 
            success: true, 
            message: 'Profile deleted successfully',
            method: 'in-memory'
          });
        } else {
          return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }
      } catch (memError) {
        console.error('❌ In-memory delete also failed:', memError);
        return NextResponse.json({ error: 'Failed to delete profile' }, { status: 500 });
      }
    }
    
  } catch (error) {
    console.error('❌ Error deleting profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}