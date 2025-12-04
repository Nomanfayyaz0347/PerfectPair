import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Profile from '@/models/Profile';
import { checkAuth } from '@/lib/authCheck';
import { profileSchema, profileUpdateSchema } from '@/lib/validations';
import { ZodError } from 'zod';

// GET - Fetch profiles (requires login)
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const auth = await checkAuth();
    if (!auth.authenticated) return auth.response;
    
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const gender = searchParams.get('gender');
    const limit = searchParams.get('limit');
    
    const query: Record<string, unknown> = {};
    
    if (id) {
      query._id = id;
    }
    
    if (gender) {
      query.gender = gender;
    }
    
    const profiles = await Profile.find(query)
      .sort({ createdAt: -1 })
      .limit(limit ? parseInt(limit) : 1000)
      .lean();
    
    return NextResponse.json({
      success: true,
      profiles,
      count: profiles.length
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profiles' },
      { status: 500 }
    );
  }
}

// POST - Create new profile (public - no auth required for form submissions)
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Validate input with Zod
    const validatedData = profileSchema.parse(body);
    
    const profile = await Profile.create(validatedData);
    
    return NextResponse.json({
      success: true,
      profile
    }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create profile' },
      { status: 500 }
    );
  }
}

// PUT - Update profile (requires login)
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const auth = await checkAuth();
    if (!auth.authenticated) return auth.response;
    
    await dbConnect();
    
    const body = await request.json();
    const { profileId, _id, ...updateData } = body;
    
    // Validate update data with Zod
    const validatedData = profileUpdateSchema.parse(updateData);
    
    const id = profileId || _id;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Profile ID is required' },
        { status: 400 }
      );
    }
    
    const profile = await Profile.findByIdAndUpdate(
      id,
      validatedData,
      { new: true, runValidators: true }
    );
    
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      profile
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
