import { NextRequest, NextResponse } from 'next/server';

// Helper function to get single profile
async function getSingleProfile(profileId: string) {
  try {
    let useInMemory = false;
    let dbConnect, Profile, InMemoryStorage;
    
    try {
      // Try MongoDB first
      const dbModule = await import('@/lib/mongodb');
      const profileModule = await import('@/models/Profile');
      const storageModule = await import('@/lib/storage');
      
      dbConnect = dbModule.default;
      Profile = profileModule.default;
      InMemoryStorage = storageModule.InMemoryStorage;
      
      await dbConnect();
      
      const profile = await Profile.findById(profileId);
      if (profile) {
        return NextResponse.json({
          profiles: [profile],
          count: 1
        });
      } else {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
      }
      
    } catch (dbError) {
      console.log('MongoDB fetch failed, using in-memory storage:', dbError);
      useInMemory = true;
      
      try {
        const storageModule = await import('@/lib/storage');
        InMemoryStorage = storageModule.InMemoryStorage;
        
        const profile = await InMemoryStorage.getProfileById(profileId);
        if (profile) {
          return NextResponse.json({
            profiles: [profile],
            count: 1
          });
        } else {
          return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }
        
      } catch (storageError) {
        console.error('In-memory storage failed:', storageError);
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
      }
    }
  } catch (error) {
    console.error('Error fetching single profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received form data:', JSON.stringify(body, null, 2));
    console.log('Photo URL in request:', body.photoUrl);

    // Try MongoDB first, fallback to in-memory
    let useInMemory = false;
    let dbConnect, Profile, InMemoryStorage;
    
    try {
      // Dynamic imports to avoid build-time evaluation
      const dbModule = await import('@/lib/mongodb');
      const profileModule = await import('@/models/Profile');
      const storageModule = await import('@/lib/storage');
      
      dbConnect = dbModule.default;
      Profile = profileModule.default;
      InMemoryStorage = storageModule.InMemoryStorage;
      
      await dbConnect();
      console.log('Connected to MongoDB successfully');
    } catch (dbError) {
      console.log('MongoDB connection failed, using in-memory storage:', dbError);
      useInMemory = true;
      
      // Still need storage for fallback
      try {
        const storageModule = await import('@/lib/storage');
        InMemoryStorage = storageModule.InMemoryStorage;
      } catch {
        return NextResponse.json(
          { error: 'Storage initialization failed' },
          { status: 500 }
        );
      }
    }
    
    // Validate required fields
    const requiredFields = ['name', 'fatherName', 'age', 'address', 'occupation', 'education', 'contactNumber'];
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Validate age is a number
    if (typeof body.age !== 'number' || body.age < 18 || body.age > 80) {
      return NextResponse.json(
        { error: 'Age must be a number between 18 and 80' },
        { status: 400 }
      );
    }
    
    // Create new profile - try MongoDB first, fallback to in-memory
    console.log('Creating profile with data:', body);
    
    if (useInMemory) {
      // Use in-memory storage as fallback
      if (!InMemoryStorage) {
        return NextResponse.json(
          { error: 'Storage not available' },
          { status: 500 }
        );
      }
      
      const profile = await InMemoryStorage.saveProfile(body);
      console.log('Profile saved in memory with ID:', profile._id);
      
      return NextResponse.json(
        { message: 'Profile created successfully (in-memory)', profileId: profile._id },
        { status: 201 }
      );
    } else {
      // Use MongoDB
      if (!Profile) {
        return NextResponse.json(
          { error: 'Database model not available' },
          { status: 500 }
        );
      }
      
      const profile = new Profile(body);
      await profile.save();
      console.log('Profile saved in MongoDB with ID:', profile._id);
      
      return NextResponse.json(
        { message: 'Profile created successfully', profileId: profile._id },
        { status: 201 }
      );
    }
  } catch (error: unknown) {
    console.error('Detailed error creating profile:', error);
    
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Check if requesting specific profile by ID
    const profileId = searchParams.get('id');
    if (profileId) {
      return await getSingleProfile(profileId);
    }
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Try MongoDB first, fallback to in-memory
    let useInMemory = false;
    let dbConnect, Profile, InMemoryStorage;
    
    try {
      // Dynamic imports to avoid build-time evaluation
      const dbModule = await import('@/lib/mongodb');
      const profileModule = await import('@/models/Profile');
      const storageModule = await import('@/lib/storage');
      
      dbConnect = dbModule.default;
      Profile = profileModule.default;
      InMemoryStorage = storageModule.InMemoryStorage;
      
      await dbConnect();
    } catch {
      console.log('MongoDB connection failed for GET, using in-memory storage');
      useInMemory = true;
      
      // Still need storage for fallback
      try {
        const storageModule = await import('@/lib/storage');
        InMemoryStorage = storageModule.InMemoryStorage;
      } catch {
        return NextResponse.json(
          { error: 'Storage initialization failed' },
          { status: 500 }
        );
      }
    }

    if (useInMemory) {
      // Use in-memory storage
      if (!InMemoryStorage) {
        return NextResponse.json(
          { error: 'Storage not available' },
          { status: 500 }
        );
      }
      
      const filters = {
        search: searchParams.get('search') || undefined,
        ageMin: searchParams.get('ageMin') ? parseInt(searchParams.get('ageMin')!) : undefined,
        ageMax: searchParams.get('ageMax') ? parseInt(searchParams.get('ageMax')!) : undefined,
        education: searchParams.get('education') || undefined,
        occupation: searchParams.get('occupation') || undefined,
      };
      
      const allProfiles = await InMemoryStorage.searchProfiles(filters);
      const total = allProfiles.length;
      const profiles = allProfiles.slice(skip, skip + limit);
      
      return NextResponse.json({
        profiles,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: total,
        },
      });
    } else {
      // Use MongoDB
      const filter: Record<string, unknown> = {};
      
      if (searchParams.get('search')) {
        const searchTerm = searchParams.get('search');
        filter.$or = [
          { name: { $regex: searchTerm, $options: 'i' } },
          { occupation: { $regex: searchTerm, $options: 'i' } },
          { education: { $regex: searchTerm, $options: 'i' } },
        ];
      }
      
      if (searchParams.get('ageMin') || searchParams.get('ageMax')) {
        const ageFilter: Record<string, number> = {};
        if (searchParams.get('ageMin')) {
          ageFilter.$gte = parseInt(searchParams.get('ageMin')!);
        }
        if (searchParams.get('ageMax')) {
          ageFilter.$lte = parseInt(searchParams.get('ageMax')!);
        }
        filter.age = ageFilter;
      }
      
      if (searchParams.get('education')) {
        filter.education = { $regex: searchParams.get('education'), $options: 'i' };
      }
      
      if (searchParams.get('occupation')) {
        filter.occupation = { $regex: searchParams.get('occupation'), $options: 'i' };
      }
      
      if (!Profile) {
        return NextResponse.json(
          { error: 'Database model not available' },
          { status: 500 }
        );
      }
      
      const profiles = await Profile.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      
      const total = await Profile.countDocuments(filter);
      
      return NextResponse.json({
        profiles,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: total,
        },
      });
    }
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}