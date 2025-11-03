import { NextResponse } from 'next/server';

interface Profile {
  _id: string;
  name: string;
  fatherName: string;
  age: number;
  height: string;
  weight?: string;
  color?: string;
  education: string;
  occupation: string;
  income?: string;
  address: string;
  contactNumber: string;
  photoUrl?: string;
  familyDetails?: string;
  status?: string;
  matchedWith?: string;
  matchedDate?: string;
  requirements: object;
  createdAt: Date | string;
}

export async function POST() {
  try {
    console.log('🔄 Starting data sync between storage systems...');
    // @ts-ignore - Temporarily disable for deployment

    let mongoProfiles: Profile[] = [];
    let memoryProfiles: Profile[] = [];
    const syncResults = {
      mongoToMemory: 0,
      memoryToMongo: 0,
      errors: [] as string[]
    };

    // Try to get MongoDB profiles
    try {
      const dbModule = await import('@/lib/mongodb');
      const profileModule = await import('@/models/Profile');
      
      const dbConnect = dbModule.default;
      const Profile = profileModule.default;
      
      await dbConnect();
      mongoProfiles = await Profile.find({});
      console.log(`✅ Found ${mongoProfiles.length} profiles in MongoDB`);
      
    } catch (dbError) {
      console.log('❌ Could not access MongoDB:', dbError);
      syncResults.errors.push('MongoDB access failed');
    }

    // Try to get in-memory profiles
    try {
      const storageModule = await import('@/lib/storage');
      const { getProfiles } = storageModule;
      memoryProfiles = getProfiles();
      console.log(`✅ Found ${memoryProfiles.length} profiles in memory`);
      
    } catch (storageError) {
      console.log('❌ Could not access in-memory storage:', storageError);
      syncResults.errors.push('In-memory storage access failed');
    }

    // Sync MongoDB to in-memory (if MongoDB has more data)
    if (mongoProfiles.length > 0 && mongoProfiles.length > memoryProfiles.length) {
      try {
        const storageModule = await import('@/lib/storage');
        const { updateProfile } = storageModule;
        
        for (const mongoProfile of mongoProfiles) {
          try {
            const profileData = {
              _id: mongoProfile._id.toString(),
              name: mongoProfile.name,
              fatherName: mongoProfile.fatherName,
              age: mongoProfile.age,
              height: mongoProfile.height,
              weight: mongoProfile.weight,
              color: mongoProfile.color,
              education: mongoProfile.education,
              occupation: mongoProfile.occupation,
              income: mongoProfile.income,
              address: mongoProfile.address,
              contactNumber: mongoProfile.contactNumber,
              photoUrl: mongoProfile.photoUrl,
              familyDetails: mongoProfile.familyDetails,
              status: mongoProfile.status as 'Active' | 'Matched' | 'Engaged' | 'Married' | 'Inactive' | undefined,
              matchedWith: mongoProfile.matchedWith,
              matchedDate: mongoProfile.matchedDate,
              requirements: mongoProfile.requirements as any,
              createdAt: mongoProfile.createdAt
            };
            
            updateProfile(mongoProfile._id.toString(), profileData as any);
            syncResults.mongoToMemory++;
          } catch (error) {
            console.error(`Error syncing profile ${mongoProfile.name}:`, error);
            syncResults.errors.push(`Failed to sync ${mongoProfile.name} to memory`);
          }
        }
        
        console.log(`✅ Synced ${syncResults.mongoToMemory} profiles from MongoDB to memory`);
        
      } catch (syncError) {
        console.error('MongoDB to memory sync failed:', syncError);
        syncResults.errors.push('MongoDB to memory sync failed');
      }
    }

    // Sync in-memory to MongoDB (if memory has more data)
    if (memoryProfiles.length > 0 && memoryProfiles.length > mongoProfiles.length && mongoProfiles.length === 0) {
      try {
        const dbModule = await import('@/lib/mongodb');
        const profileModule = await import('@/models/Profile');
        
        const dbConnect = dbModule.default;
        const Profile = profileModule.default;
        
        await dbConnect();
        
        for (const memoryProfile of memoryProfiles) {
          try {
            const profile = new Profile(memoryProfile);
            await profile.save();
            syncResults.memoryToMongo++;
          } catch (error) {
            console.error(`Error syncing profile ${memoryProfile.name}:`, error);
            syncResults.errors.push(`Failed to sync ${memoryProfile.name} to MongoDB`);
          }
        }
        
        console.log(`✅ Synced ${syncResults.memoryToMongo} profiles from memory to MongoDB`);
        
      } catch (syncError) {
        console.error('Memory to MongoDB sync failed:', syncError);
        syncResults.errors.push('Memory to MongoDB sync failed');
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Data sync completed',
      results: {
        mongoProfiles: mongoProfiles.length,
        memoryProfiles: memoryProfiles.length,
        synced: syncResults,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Sync operation failed:', error);
    return NextResponse.json(
      { 
        error: 'Sync failed', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}

// GET method to check sync status
export async function GET() {
  try {
    let mongoCount = 0;
    let memoryCount = 0;
    let mongoStatus = 'not-available';
    let memoryStatus = 'not-available';

    // Check MongoDB
    try {
      const dbModule = await import('@/lib/mongodb');
      const profileModule = await import('@/models/Profile');
      
      const dbConnect = dbModule.default;
      const Profile = profileModule.default;
      
      await dbConnect();
      mongoCount = await Profile.countDocuments();
      mongoStatus = 'connected';
      
    } catch (dbError) {
      mongoStatus = 'failed';
    }

    // Check in-memory
    try {
      const storageModule = await import('@/lib/storage');
      const { getProfiles } = storageModule;
      const profiles = getProfiles();
      memoryCount = profiles.length;
      memoryStatus = 'available';
      
    } catch (storageError) {
      memoryStatus = 'failed';
    }

    return NextResponse.json({
      mongodb: {
        status: mongoStatus,
        profileCount: mongoCount
      },
      memory: {
        status: memoryStatus,
        profileCount: memoryCount
      },
      needsSync: mongoCount !== memoryCount,
      recommendation: mongoCount > memoryCount ? 'Sync MongoDB to memory' :
                     memoryCount > mongoCount ? 'Sync memory to MongoDB' :
                     'Data is synchronized'
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Status check failed' },
      { status: 500 }
    );
  }
}