import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('🔄 Testing basic MongoDB connectivity...');
    console.log('📝 MongoDB URI exists:', !!process.env.MONGODB_URI);
    console.log('📝 MongoDB URI first 20 chars:', process.env.MONGODB_URI?.substring(0, 20));
    
    // Test basic connection
    const connection = await dbConnect();
    console.log('✅ MongoDB connection successful');
    console.log('📊 Connection state:', connection.readyState);
    console.log('📊 Database name:', connection.name);
    
    // Test a simple operation - list collections
    const collections = connection.db ? await connection.db.listCollections().toArray() : [];
    console.log('📋 Collections found:', collections.map(c => c.name));
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      connectionState: connection.readyState,
      databaseName: connection.name,
      collections: collections.map(c => c.name),
      timestamp: new Date().toISOString()
    });
    
  } catch (error: unknown) {
    console.error('❌ MongoDB connection test failed:', error);
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorName = error instanceof Error ? error.name : 'Unknown';
    
    return NextResponse.json({
      success: false,
      error: 'MongoDB connection failed',
      message: errorMessage,
      errorName: errorName,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}