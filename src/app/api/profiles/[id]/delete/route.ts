import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/authCheck';
import { deleteFromCloudinary } from '@/lib/cloudinary';

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
    // Check admin authentication
    const auth = await checkAdminAuth();
    if (!auth.authenticated) return auth.response;
    
    const resolvedParams = await params;
    const profileId = resolvedParams.id;
    
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
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
      }
      
      // Delete image from Cloudinary if exists
      if (existingProfile.cloudinaryPublicId) {
        await deleteFromCloudinary(existingProfile.cloudinaryPublicId);
      }
      
      // Delete the profile
      await Profile.findByIdAndDelete(profileId);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Profile deleted successfully',
        deletedProfile: {
          id: profileId,
          name: existingProfile.name
        }
      });
      
    } catch {      
      // Fallback to in-memory storage
      try {
        const { InMemoryStorage } = await import('@/lib/storage');
        const success = await InMemoryStorage.deleteProfile(profileId);
        
        if (success) {
          return NextResponse.json({ 
            success: true, 
            message: 'Profile deleted successfully',
            method: 'in-memory'
          });
        } else {
          return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }
      } catch {
        return NextResponse.json({ error: 'Failed to delete profile' }, { status: 500 });
      }
    }
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}