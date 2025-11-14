import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Client from '@/models/Client';
import Profile from '@/models/Profile';
import Admin from '@/models/Admin';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET - Get all clients (admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    // Get all admin emails to exclude them
    const admins = await Admin.find().select('email');
    const adminEmails = admins.map(admin => admin.email.toLowerCase());
    
    // Get clients excluding admin emails
    const clients = await Client.find({
      email: { $nin: adminEmails }
    })
      .populate('profileId', 'name gender age')
      .select('-password')
      .sort({ createdAt: -1 });

    return NextResponse.json({ clients });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

// POST - Create a new client (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const { email, password, name, profileId } = await req.json();

    // Validate required fields
    if (!email || !password || !name || !profileId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if client already exists
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return NextResponse.json(
        { error: 'Client with this email already exists' },
        { status: 400 }
      );
    }

    // Check if profile exists
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Check if profile already has a client
    const existingClientWithProfile = await Client.findOne({ profileId });
    if (existingClientWithProfile) {
      return NextResponse.json(
        { error: 'This profile already has a client account' },
        { status: 400 }
      );
    }

    // Create new client
    const client = await Client.create({
      email,
      password,
      name,
      profileId,
      isActive: true,
    });

    const clientData = {
      _id: client._id,
      email: client.email,
      name: client.name,
      profileId: client.profileId,
      isActive: client.isActive,
      createdAt: client.createdAt,
    };

    return NextResponse.json({ 
      message: 'Client created successfully',
      client: clientData
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a client (admin only)
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('id');

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    const client = await Client.findByIdAndDelete(clientId);

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Client deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      { error: 'Failed to delete client' },
      { status: 500 }
    );
  }
}

// PATCH - Toggle client active status (admin only)
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const { clientId, isActive } = await req.json();

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    const client = await Client.findByIdAndUpdate(
      clientId,
      { isActive },
      { new: true }
    ).select('-password');

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Client status updated successfully',
      client
    });
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { error: 'Failed to update client' },
      { status: 500 }
    );
  }
}
