import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables
    const envStatus = {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT_SET',
      ADMIN_EMAIL: !!process.env.ADMIN_EMAIL,
      ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
      MONGODB_URI: !!process.env.MONGODB_URI,
      MONGODB_URI_LENGTH: process.env.MONGODB_URI?.length || 0,
      timestamp: new Date().toISOString()
    };

    // Check database connection and profile count
    let dbStatus = 'not-tested';
    let profileCount = 0;
    let storageType = 'unknown';

    try {
      // Try MongoDB first
      const dbModule = await import('@/lib/mongodb');
      const profileModule = await import('@/models/Profile');
      
      const dbConnect = dbModule.default;
      const Profile = profileModule.default;
      
      await dbConnect();
      profileCount = await Profile.countDocuments();
      dbStatus = 'mongodb-connected';
      storageType = 'mongodb';
      
    } catch (dbError) {
      console.log('MongoDB check failed:', dbError);
      dbStatus = 'mongodb-failed';
      
      // Try in-memory storage
      try {
        const storageModule = await import('@/lib/storage');
        const { getProfiles } = storageModule;
        const profiles = getProfiles();
        profileCount = profiles.length;
        storageType = 'in-memory';
        dbStatus = 'in-memory-active';
      } catch (storageError) {
        console.error('Storage check failed:', storageError);
        dbStatus = 'all-storage-failed';
      }
    }

    return NextResponse.json({
      environment: envStatus,
      database: {
        status: dbStatus,
        profileCount,
        storageType,
        message: storageType === 'in-memory' ? 
          'Using in-memory storage - data will be lost on restart' : 
          'Using persistent MongoDB storage'
      },
      recommendations: {
        needsMongoUri: !process.env.MONGODB_URI,
        needsRedeploy: envStatus.MONGODB_URI_LENGTH === 0,
        message: !process.env.MONGODB_URI ? 
          'Add MONGODB_URI environment variable and redeploy' : 
          'Database connection available'
      }
    });

  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { 
        error: 'Health check failed', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}