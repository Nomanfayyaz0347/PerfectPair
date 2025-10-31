import { NextRequest, NextResponse } from 'next/server';
import { InMemoryStorage } from '@/lib/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: profileId } = await params;
    
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