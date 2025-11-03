import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('photo') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Please upload a valid image file' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size should be less than 5MB' },
        { status: 400 }
      );
    }

    // Check if we're in production/live environment
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;

    if (isProduction) {
      // For production, convert to base64 and return
      // This is a temporary solution - ideally use cloud storage
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      const photoUrl = `data:${file.type};base64,${base64}`;
      
      return NextResponse.json(
        { 
          message: 'Photo uploaded successfully',
          photoUrl: photoUrl
        },
        { status: 200 }
      );
    } else {
      // Local development - save to file system
      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'public', 'uploads');
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const filename = `profile-${timestamp}.${fileExtension}`;
      const filepath = join(uploadsDir, filename);

      // Convert file to buffer and save
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);

      // Return the public URL
      const photoUrl = `/uploads/${filename}`;
      
      return NextResponse.json(
        { 
          message: 'Photo uploaded successfully',
          photoUrl: photoUrl
        },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error('Photo upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload photo. Please try again.' },
      { status: 500 }
    );
  }
}