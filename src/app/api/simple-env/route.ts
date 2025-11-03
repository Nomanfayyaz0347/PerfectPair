import { NextResponse } from 'next/server';

export async function GET() {
  console.log('🔍 Simple environment check endpoint called');
  
  const envCheck = {
    MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'MISSING',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'MISSING', 
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'MISSING',
    ADMIN_EMAIL: process.env.ADMIN_EMAIL ? 'SET' : 'MISSING',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? 'SET' : 'MISSING',
    NODE_ENV: process.env.NODE_ENV,
    
    // MongoDB URI preview (first 50 chars)
    MONGODB_PREVIEW: process.env.MONGODB_URI ? 
      process.env.MONGODB_URI.substring(0, 50) + '...' : 'NOT SET'
  };

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    platform: process.env.NODE_ENV === 'production' ? 'Vercel' : 'Local',
    variables: envCheck,
    allSet: Object.values(envCheck).every(val => val !== 'MISSING' && val !== 'NOT SET'),
    timestamp: new Date().toISOString(),
    message: 'Environment variables check completed'
  });
}