import { NextRequest, NextResponse } from 'next/server';
import { InMemoryStorage } from '@/lib/storage';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const resolvedParams = await params;
    const profileId = resolvedParams.id;
    
    // Find matches using the in-memory storage
    const matches = await InMemoryStorage.findMatches(profileId);
    
    return NextResponse.json({
      matches,
      count: matches.length
    });
  } catch (error) {
    console.error('Error finding matches:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}