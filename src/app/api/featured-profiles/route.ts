import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Profile from '@/models/Profile';

// GET - Fetch featured profiles (public, no auth required)
export async function GET() {
  try {
    await dbConnect();
    
    // Fetch random 10 profiles with limited info for privacy
    const profiles = await Profile.aggregate([
      { $sample: { size: 10 } },
      {
        $project: {
          name: 1,
          age: 1,
          gender: 1,
          education: 1,
          occupation: 1,
          city: 1,
          photoUrl: 1,
          'requirements.ageRange': 1,
          'requirements.education': 1,
          'requirements.occupation': 1,
        }
      }
    ]);
    
    return NextResponse.json({
      success: true,
      profiles,
      count: profiles.length
    });
  } catch (error) {
    console.error('Error fetching featured profiles:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profiles' },
      { status: 500 }
    );
  }
}
