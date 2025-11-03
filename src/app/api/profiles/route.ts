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
    console.log('📝 Creating profile:', body.name);
    console.log('📄 Form data received:', JSON.stringify(body, null, 2));

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

    // FORCE MongoDB connection - no fallback for saving
    console.log('🔄 Attempting MongoDB connection...');
    
    try {
      const dbModule = await import('@/lib/mongodb');
      const profileModule = await import('@/models/Profile');
      
      const dbConnect = dbModule.default;
      const Profile = profileModule.default;
      
      await dbConnect();
      console.log('✅ MongoDB connected successfully for profile save');
      
      // Create profile with comprehensive data
      const profileData = {
        name: body.name,
        fatherName: body.fatherName,
        age: parseInt(body.age) || 25,
        height: body.height || "5'5\"",
        weight: body.weight || "65kg",
        color: body.color || "Fair",
        education: body.education,
        occupation: body.occupation,
        income: body.income || "Not specified",
        address: body.address,
        contactNumber: body.contactNumber,
        photoUrl: body.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        familyDetails: body.familyDetails || "Family details not provided",
        status: 'Active',
        requirements: body.requirements || {
          ageRange: { min: 20, max: 35 },
          heightRange: { min: "5'0\"", max: "6'0\"" },
          education: 'Any',
          occupation: 'Any',
          familyType: 'Any',
          location: 'Any'
        },
        createdAt: new Date()
      };
      
      console.log('💾 Saving profile to MongoDB...');
      const profile = new Profile(profileData);
      const savedProfile = await profile.save();
      
      console.log('✅ Profile saved to MongoDB with ID:', savedProfile._id);
      
      // Also sync to memory for immediate access
      try {
        const storageModule = await import('@/lib/storage');
        const { addProfile } = storageModule;
        await addProfile({
          ...savedProfile.toObject(),
          _id: savedProfile._id.toString()
        });
        console.log('✅ Profile synced to memory storage');
      } catch (syncError) {
        console.log('⚠️ Memory sync failed (non-critical):', syncError);
      }
      
      return NextResponse.json(
        { 
          message: 'Profile saved successfully to MongoDB',
          profileId: savedProfile._id,
          storage: 'mongodb',
          success: true
        },
        { status: 201 }
      );
      
    } catch (mongoError) {
      console.error('❌ MongoDB save failed:', mongoError);
      console.error('MongoDB Error Details:', {
        name: mongoError instanceof Error ? mongoError.name : 'Unknown',
        message: mongoError instanceof Error ? mongoError.message : String(mongoError),
        code: (mongoError as { code?: string | number })?.code || 'No code'
      });
      
      // Fallback to memory storage
      console.log('🔄 Falling back to memory storage...');
      try {
        const storageModule = await import('@/lib/storage');
        const { InMemoryStorage } = storageModule;
        
        const profile = await InMemoryStorage.saveProfile(body);
        console.log('✅ Profile saved to memory storage with ID:', profile._id);
        
        return NextResponse.json(
          { 
            message: 'Profile saved to memory storage (MongoDB failed)',
            profileId: profile._id,
            storage: 'memory',
            mongoError: mongoError instanceof Error ? mongoError.message : String(mongoError),
            success: true
          },
          { status: 201 }
        );
      } catch (memoryError) {
        console.error('❌ Memory storage also failed:', memoryError);
        return NextResponse.json(
          { error: 'All storage systems failed', details: memoryError instanceof Error ? memoryError.message : String(memoryError) },
          { status: 500 }
        );
      }
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