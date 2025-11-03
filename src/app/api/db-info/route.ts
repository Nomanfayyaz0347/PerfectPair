import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    const nodeEnv = process.env.NODE_ENV;
    const nextAuthUrl = process.env.NEXTAUTH_URL;
    
    // Extract database info from URI
    let dbInfo: {
      environment?: string;
      nextAuthUrl?: string;
      hasMongoUri: boolean;
      mongoUriLength: number;
      username?: string;
      password?: string;
      cluster?: string;
      database?: string;
      fullUri?: string;
    } = {
      environment: nodeEnv,
      nextAuthUrl: nextAuthUrl,
      hasMongoUri: !!mongoUri,
      mongoUriLength: mongoUri?.length || 0
    };

    if (mongoUri) {
      // Parse MongoDB URI to extract details
      const match = mongoUri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/]+)\/([^?]+)/);
      if (match) {
        dbInfo = {
          ...dbInfo,
          username: match[1],
          password: match[2].substring(0, 3) + '***', // Hide password
          cluster: match[3],
          database: match[4],
          fullUri: mongoUri.substring(0, 50) + '...'
        };
      }
    }

    // Test MongoDB connection
    let connectionTest = 'not-tested';
    let profileCount = 0;
    let sampleProfile = null;
    let mongoError = null;

    if (mongoUri) {
      try {
        console.log(`🔍 Testing MongoDB connection for ${nodeEnv}...`);
        
        const dbModule = await import('@/lib/mongodb');
        const profileModule = await import('@/models/Profile');
        
        const dbConnect = dbModule.default;
        const Profile = profileModule.default;
        
        await dbConnect();
        connectionTest = 'success';
        
        profileCount = await Profile.countDocuments();
        console.log(`📊 Found ${profileCount} profiles in ${dbInfo.database || 'unknown'} database`);
        
        if (profileCount > 0) {
          const profile = await Profile.findOne().lean() as {
            _id?: { toString(): string };
            name?: string;
            fatherName?: string;
            createdAt?: Date;
          };
          sampleProfile = {
            id: profile?._id?.toString(),
            name: profile?.name,
            fatherName: profile?.fatherName,
            createdAt: profile?.createdAt
          };
        }
        
      } catch (error: unknown) {
        connectionTest = 'failed';
        mongoError = error instanceof Error ? error.message : 'Unknown error';
        console.error(`❌ MongoDB connection failed for ${nodeEnv}:`, error);
      }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      server: {
        environment: nodeEnv,
        nextAuthUrl: nextAuthUrl,
        isProduction: nodeEnv === 'production',
        isLocal: nodeEnv === 'development'
      },
      database: {
        ...dbInfo,
        connectionStatus: connectionTest,
        profileCount,
        sampleProfile,
        error: mongoError
      },
      summary: {
        platform: nodeEnv === 'production' ? 'Vercel Production' : 'Local Development',
        database: dbInfo.database || 'Unknown',
        cluster: dbInfo.cluster || 'Unknown', 
        status: connectionTest,
        profiles: profileCount
      }
    });

  } catch (error: unknown) {
    console.error('Database info check failed:', error);
    return NextResponse.json({
      error: 'Database info check failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}