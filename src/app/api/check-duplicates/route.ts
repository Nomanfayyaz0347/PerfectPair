import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Profile from '@/models/Profile';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get('name');

    await dbConnect();

    if (name) {
      // Search for specific name
      const profiles = await Profile.find({ name: { $regex: name, $options: 'i' } }).lean();
      
      return NextResponse.json({
        success: true,
        count: profiles.length,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        profiles: profiles.map((p: any) => ({
          _id: p._id.toString(),
          name: p.name,
          fatherName: p.fatherName,
          age: p.age,
          gender: p.gender,
          contactNumber: p.contactNumber,
          createdAt: p.createdAt
        }))
      });
    }

    // Find all duplicate names
    const duplicates = await Profile.aggregate([
      {
        $group: {
          _id: '$name',
          count: { $sum: 1 },
          ids: { $push: '$_id' },
          profiles: { $push: '$$ROOT' }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    return NextResponse.json({
      success: true,
      duplicateCount: duplicates.length,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      duplicates: duplicates.map((d: any) => ({
        name: d._id,
        count: d.count,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        profiles: d.profiles.map((p: any) => ({
          _id: p._id.toString(),
          age: p.age,
          gender: p.gender,
          contactNumber: p.contactNumber,
          createdAt: p.createdAt
        }))
      }))
    });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check duplicates',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove specific duplicate
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const profileId = searchParams.get('id');

    if (!profileId) {
      return NextResponse.json({ error: 'Profile ID required' }, { status: 400 });
    }

    await dbConnect();

    const profile = await Profile.findByIdAndDelete(profileId);
    
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Profile ${profile.name} deleted successfully`,
      deletedProfile: {
        _id: profile._id.toString(),
        name: profile.name
      }
    });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
