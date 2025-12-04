import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from './auth';

export async function checkAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { success: false, error: 'Unauthorized - Please login first' },
        { status: 401 }
      )
    };
  }
  
  return {
    authenticated: true,
    session,
    user: session.user
  };
}

export async function checkAdminAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { success: false, error: 'Unauthorized - Please login first' },
        { status: 401 }
      )
    };
  }
  
  if ((session.user as any)?.role !== 'admin') {
    return {
      authenticated: false,
      response: NextResponse.json(
        { success: false, error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    };
  }
  
  return {
    authenticated: true,
    session,
    user: session.user
  };
}
