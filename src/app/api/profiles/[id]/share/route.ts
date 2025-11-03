import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Profile from '@/models/Profile';

// POST /api/profiles/[id]/share - Increment share count
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: profileId } = await params;
    
    if (!profileId) {
      return NextResponse.json(
        { error: 'Profile ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find and update the profile's share count
    const profile = await Profile.findByIdAndUpdate(
      profileId,
      { 
        $inc: { sharedCount: 1 } // Increment sharedCount by 1
      },
      { 
        new: true, // Return updated document
        runValidators: true 
      }
    );

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    console.log(`✅ Share count incremented for profile ${profileId}: ${profile.sharedCount}`);

    return NextResponse.json({
      success: true,
      message: 'Share count updated successfully',
      profileId: profileId,
      sharedCount: profile.sharedCount,
      timestamp: new Date().toISOString()
    });

  } catch (error: unknown) {
    console.error('❌ Error updating share count:', error);
    return NextResponse.json(
      {
        error: 'Failed to update share count',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// GET /api/profiles/[id]/share - Get current share count
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Profile ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const profile = await Profile.findById(id).select('name sharedCount');

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      profileId: id,
      name: profile.name,
      sharedCount: profile.sharedCount || 0,
      timestamp: new Date().toISOString()
    });

  } catch (error: unknown) {
    console.error('❌ Error getting share count:', error);
    return NextResponse.json(
      {
        error: 'Failed to get share count',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}