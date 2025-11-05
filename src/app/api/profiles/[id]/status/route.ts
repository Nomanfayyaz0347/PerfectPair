import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const profileId = resolvedParams.id;
  
  console.log('=== STATUS UPDATE API START ===');
  console.log('Profile ID from params:', profileId);
  console.log('Params object:', resolvedParams);
  console.log('Request URL:', request.url);
  
  if (!profileId || profileId.trim() === '' || profileId === 'undefined') {
    console.log('❌ Invalid profile ID:', profileId);
    return NextResponse.json(
      { error: 'Profile ID is required', receivedId: profileId },
      { status: 400 }
    );
  }
  
  try {
    let body;
    try {
      body = await request.json();
      console.log('✅ Request body parsed successfully:', body);
    } catch (jsonError) {
      console.error('❌ Failed to parse JSON body:', jsonError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    const { status, matchedWith, matchedDate } = body;

    // Validate status
    const validStatuses = ['Active', 'Matched', 'Engaged', 'Married', 'Inactive'];
    if (!status || !validStatuses.includes(status)) {
      console.log('Invalid status provided:', status);
      return NextResponse.json(
        { error: 'Invalid status provided' },
        { status: 400 }
      );
    }
    
    console.log('Updating profile', profileId, 'to status:', status);

    let updatedProfile;
    let useInMemory = false;

    // First check if this looks like a MongoDB ObjectId
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(profileId);
    console.log('Profile ID format check:', { profileId, isMongoId });

    if (isMongoId) {
      try {
        // Try MongoDB first for MongoDB-style IDs
        const { default: dbConnect } = await import('@/lib/mongodb');
        await dbConnect();
        
        const updateData: {
          status: string;
          updatedAt: Date;
          matchedWith?: string | null;
          matchedDate?: Date | null;
          isMatched?: boolean;
        } = { 
          status,
          updatedAt: new Date()
        };
        
        // If status is not Active, clear matches and set isMatched to false
        if (status !== 'Active') {
          updateData.matchedWith = null;
          updateData.matchedDate = null;
          updateData.isMatched = false;
          console.log('Clearing matches for non-Active status:', status);
        } else {
          // Only set matchedWith and matchedDate for Active status
          if (matchedWith) {
            updateData.matchedWith = matchedWith;
            updateData.isMatched = true;
          }
          
          if (matchedDate) {
            updateData.matchedDate = new Date(matchedDate);
          }
        }

        const { default: Profile } = await import('@/models/Profile');
        updatedProfile = await Profile.findByIdAndUpdate(
          profileId,
          updateData,
          { new: true }
        );

        if (!updatedProfile) {
          console.log('Profile not found in MongoDB:', profileId);
          // Don't return error yet, try in-memory as fallback
          useInMemory = true;
        } else {
          console.log('Profile updated in MongoDB:', updatedProfile._id);
        }
        
      } catch (mongoError) {
        console.log('MongoDB failed, using in-memory storage:', mongoError);
        useInMemory = true;
      }
    } else {
      // Non-MongoDB ID, use in-memory directly
      useInMemory = true;
    }

    if (useInMemory) {
      console.log('Using in-memory storage for profile update');
      const { getProfiles, updateProfile } = await import('@/lib/storage');
      const profiles = getProfiles();
      console.log('Available profiles in memory:', profiles.length);
      const profileIndex = profiles.findIndex((p: { _id: string }) => p._id === profileId);
      
      if (profileIndex === -1) {
        console.log('Profile not found in memory storage:', profileId);
        console.log('Available profile IDs:', profiles.map((p: { _id: string }) => p._id));
        return NextResponse.json(
          { error: 'Profile not found in any storage system' },
          { status: 404 }
        );
      }

      const updatedProfileData = {
        ...profiles[profileIndex],
        status,
        updatedAt: new Date().toISOString()
      };

      // If status is not Active, clear matches
      if (status !== 'Active') {
        updatedProfileData.matchedWith = undefined;
        updatedProfileData.matchedDate = undefined;
        console.log('Clearing matches for non-Active status in memory:', status);
      } else {
        // Only set matchedWith and matchedDate for Active status
        if (matchedWith) {
          updatedProfileData.matchedWith = matchedWith;
        } else {
          updatedProfileData.matchedWith = undefined;
        }
        
        if (matchedDate) {
          updatedProfileData.matchedDate = matchedDate;
        } else {
          updatedProfileData.matchedDate = undefined;
        }
      }

      const result = updateProfile(profileId, updatedProfileData);
      if (!result) {
        console.log('Failed to update profile in memory storage');
        return NextResponse.json(
          { error: 'Failed to update profile in storage' },
          { status: 500 }
        );
      }
      
      updatedProfile = result;
      console.log('Profile updated in memory storage:', result._id);
    }

    console.log('Final updated profile:', updatedProfile);
    return NextResponse.json({ 
      success: true, 
      profile: updatedProfile,
      message: `Profile status updated to ${status}` 
    });

  } catch (error) {
    console.error('❌ CRITICAL ERROR updating profile status:', error);
    console.error('Error type:', typeof error);
    console.error('Error constructor:', error?.constructor?.name);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { 
        error: 'Failed to update profile status', 
        details: errorMessage,
        profileId: profileId,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}