import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/authCheck';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authentication
  const auth = await checkAuth();
  if (!auth.authenticated) return auth.response;
  
  const resolvedParams = await params;
  const profileId = resolvedParams.id;
  
  if (!profileId || profileId.trim() === '' || profileId === 'undefined') {
    return NextResponse.json(
      { error: 'Profile ID is required', receivedId: profileId },
      { status: 400 }
    );
  }
  
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    const { status, matchedWith, matchedDate } = body;

    // Validate status
    const validStatuses = ['Active', 'Matched', 'Engaged', 'Married', 'Inactive'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status provided' },
        { status: 400 }
      );
    }
    
    let updatedProfile;
    let useInMemory = false;

    // First check if this looks like a MongoDB ObjectId
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(profileId);

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
          // Don't return error yet, try in-memory as fallback
          useInMemory = true;
        }
        
      } catch {
        useInMemory = true;
      }
    } else {
      // Non-MongoDB ID, use in-memory directly
      useInMemory = true;
    }

    if (useInMemory) {
      const { getProfiles, updateProfile } = await import('@/lib/storage');
      const profiles = getProfiles();
      const profileIndex = profiles.findIndex((p: { _id: string }) => p._id === profileId);
      
      if (profileIndex === -1) {
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
        return NextResponse.json(
          { error: 'Failed to update profile in storage' },
          { status: 500 }
        );
      }
      
      updatedProfile = result;
    }
    return NextResponse.json({ 
      success: true, 
      profile: updatedProfile,
      message: `Profile status updated to ${status}` 
    });

  } catch (error) {
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