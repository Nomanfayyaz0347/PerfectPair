import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Profile from '@/models/Profile';

// GET - Fetch all profiles with full details (except contact numbers)
export async function GET() {
  try {
    await dbConnect();
    
    // Fetch all profiles with detailed info, excluding contact number
    const profiles = await Profile.find({})
      .select('-contactNumber -address -__v')
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json({
      success: true,
      profiles,
      count: profiles.length
    });
  } catch (error) {
    console.error('Error fetching all profiles:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profiles' },
      { status: 500 }
    );
  }
}
