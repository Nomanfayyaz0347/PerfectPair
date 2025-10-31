import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Only allow this in development or with admin key
  const adminKey = request.headers.get('x-admin-key');
  
  if (process.env.NODE_ENV === 'production' && adminKey !== 'debug-env-2024') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const envStatus = {
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT_SET',
    ADMIN_EMAIL: !!process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
    MONGODB_URI: !!process.env.MONGODB_URI,
    secretLength: process.env.NEXTAUTH_SECRET?.length || 0,
    timestamp: new Date().toISOString()
  };

  return NextResponse.json(envStatus);
}