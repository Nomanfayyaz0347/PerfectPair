import { NextResponse } from 'next/server';
import { InMemoryAdminStorage } from '@/lib/adminStorage';

export async function POST() {
  try {
    // Initialize default admin
    await InMemoryAdminStorage.initializeDefaultAdmin();

    return NextResponse.json(
      { message: 'Admin user created successfully' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to setup admin user' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Initialize default admin if not exists
    await InMemoryAdminStorage.initializeDefaultAdmin();
    
    const defaultAdmin = await InMemoryAdminStorage.findByEmail(
      process.env.ADMIN_EMAIL || 'admin@matchmaker.com'
    );
    
    return NextResponse.json({
      message: 'Setup status',
      adminExists: !!defaultAdmin,
      adminCount: defaultAdmin ? 1 : 0
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check setup status' },
      { status: 500 }
    );
  }
}