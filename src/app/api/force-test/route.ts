import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔄 Force testing MongoDB connection...');
    
    // Direct MongoDB test
    const mongoose = await import('mongoose');
    
    if (mongoose.default.connection.readyState !== 1) {
      const uri = process.env.MONGODB_URI;
      console.log('🔗 Connecting to MongoDB...');
      await mongoose.default.connect(uri!);
      console.log('✅ MongoDB connected!');
    }

    // Import Profile model
    const profileModule = await import('@/models/Profile');
    const Profile = profileModule.default;
    
    // Get profile count
    const count = await Profile.countDocuments();
    console.log(`📊 Total profiles in database: ${count}`);
    
    // Get all profiles
    const allProfiles = await Profile.find().lean();
    
    return NextResponse.json({
      success: true,
      environment: process.env.NODE_ENV,
      platform: process.env.NODE_ENV === 'production' ? 'Vercel' : 'Local',
      database: 'matchmaker',
      profileCount: count,
      profiles: allProfiles.map(p => ({
        id: p._id?.toString(),
        name: p.name,
        fatherName: p.fatherName,
        createdAt: p.createdAt
      })),
      timestamp: new Date().toISOString()
    });

  } catch (error: unknown) {
    console.error('❌ Force test failed:', error);
    return NextResponse.json({
      error: 'MongoDB force test failed',
      details: error instanceof Error ? error.message : String(error),
      environment: process.env.NODE_ENV,
      mongoUri: process.env.MONGODB_URI ? 'Present' : 'Missing'
    }, { status: 500 });
  }
}