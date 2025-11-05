import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Profile from '@/models/Profile';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const profile1Name = searchParams.get('profile1');
    const profile2Name = searchParams.get('profile2');

    if (!profile1Name || !profile2Name) {
      return NextResponse.json({
        error: 'Both profile names are required'
      }, { status: 400 });
    }

    await dbConnect();

    // Find both profiles
    const profile1 = await Profile.findOne({
      name: { $regex: profile1Name, $options: 'i' }
    }).lean();
    
    const profile2 = await Profile.findOne({
      name: { $regex: profile2Name, $options: 'i' }
    }).lean();

    if (!profile1 || !profile2) {
      return NextResponse.json({
        error: 'One or both profiles not found'
      }, { status: 404 });
    }

    // Check basic compatibility (opposite genders)
    if ((profile1 as any).gender === (profile2 as any).gender) {
      return NextResponse.json({
        match: false,
        reason: 'Profiles are of the same gender'
      });
    }

    // Find matching fields
    const matchingFields: string[] = [];
    const fieldsToCompare = [
      'cast',
      'maslak',
      'motherTongue',
      'education'
    ];

    for (const field of fieldsToCompare) {
      const field1 = (profile1 as any)[field];
      const field2 = (profile2 as any)[field];
      if (field1 && field2 && 
          field1.toLowerCase() === field2.toLowerCase()) {
        matchingFields.push(field);
      }
    }

    // Age compatibility check
    const ageDiff = Math.abs((profile1 as any).age - (profile2 as any).age);
    const isAgeCompatible = ageDiff <= 5; // Consider 5 years age difference as compatible

    // Calculate match percentage
    const totalFields = fieldsToCompare.length + 1; // +1 for age
    const matchingCount = matchingFields.length + (isAgeCompatible ? 1 : 0);
    const matchPercentage = Math.round((matchingCount / totalFields) * 100);

    return NextResponse.json({
      match: true,
      matchPercentage,
      matchingFields,
      profiles: {
        profile1: {
          name: (profile1 as any).name,
          age: (profile1 as any).age,
          gender: (profile1 as any).gender,
          education: (profile1 as any).education,
          cast: (profile1 as any).cast
        },
        profile2: {
          name: (profile2 as any).name,
          age: (profile2 as any).age,
          gender: (profile2 as any).gender,
          education: (profile2 as any).education,
          cast: (profile2 as any).cast
        }
      },
      ageCompatible: isAgeCompatible,
      ageDifference: ageDiff
    });

  } catch (error) {
    console.error('Error in compare-profiles:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 });
  }
}