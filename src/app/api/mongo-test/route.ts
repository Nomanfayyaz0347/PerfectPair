import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    console.log('🔍 MongoDB URI check:', !!mongoUri);
    console.log('🔍 MongoDB URI preview:', mongoUri?.substring(0, 50) + '...');
    
    if (!mongoUri) {
      return NextResponse.json({
        error: 'MONGODB_URI not found',
        env: process.env.NODE_ENV,
        availableEnvVars: Object.keys(process.env).filter(key => key.includes('MONGO'))
      }, { status: 500 });
    }

    // Test MongoDB connection
    console.log('🔄 Testing MongoDB connection...');
    const dbModule = await import('@/lib/mongodb');
    const profileModule = await import('@/models/Profile');
    
    const dbConnect = dbModule.default;
    const Profile = profileModule.default;
    
    await dbConnect();
    console.log('✅ MongoDB connected successfully!');
    
    const profileCount = await Profile.countDocuments();
    console.log(`📊 Found ${profileCount} profiles in database`);
    
    // Get sample profile
    const sampleProfile = await Profile.findOne().lean();
    
    // Test creating a profile to verify write access
    const testProfile = new Profile({
      name: 'Test Profile',
      fatherName: 'Test Father',
      age: 25,
      height: "5'8\"",
      weight: '70kg',
      color: 'Fair',
      education: 'Test Education',
      occupation: 'Test Job',
      income: '50000',
      address: 'Test Address',
      contactNumber: '0300-0000000',
      familyDetails: 'Test family',
      photoUrl: 'https://via.placeholder.com/400',
      requirements: {
        ageRange: { min: 20, max: 30 },
        heightRange: { min: "5'0\"", max: "5'10\"" },
        education: 'Any',
        occupation: 'Any',
        familyType: 'Any',
        location: 'Any'
      },
      createdAt: new Date()
    });
    
    const savedTestProfile = await testProfile.save();
    console.log('✅ Test profile saved with ID:', savedTestProfile._id);
    
    // Delete test profile
    await Profile.findByIdAndDelete(savedTestProfile._id);
    console.log('✅ Test profile cleaned up');
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection and write test successful!',
      database: 'matchmaker',
      profileCount,
      writeTest: 'PASSED',
      sampleProfile: sampleProfile ? {
        id: (sampleProfile as any)._id,
        name: (sampleProfile as any).name,
        createdAt: (sampleProfile as any).createdAt
      } : null,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ MongoDB test failed:', error);
    return NextResponse.json({
      error: 'MongoDB connection failed',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack?.split('\n').slice(0, 3) : undefined,
      mongoUri: process.env.MONGODB_URI ? 'Present' : 'Missing',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}