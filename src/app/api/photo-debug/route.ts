import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Photo upload debug endpoint called');
    
    const formData = await request.formData();
    console.log('📋 FormData entries:');
    
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File - ${value.name}, Size: ${value.size}, Type: ${value.type}`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }
    
    const file = formData.get('photo') as File;
    
    if (!file) {
      return NextResponse.json({
        error: 'No file received',
        debug: {
          formDataKeys: Array.from(formData.keys()),
          timestamp: new Date().toISOString()
        }
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      fileInfo: {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      },
      debug: {
        formDataKeys: Array.from(formData.keys()),
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Photo debug error:', error);
    return NextResponse.json({
      error: 'Debug endpoint failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}