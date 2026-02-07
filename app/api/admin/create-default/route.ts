import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

// POST - Create default admin (only works once)
export async function POST(request: Request) {
    try {
        await connectDB();

        // Check if any admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@laplap.com' });

        if (existingAdmin) {
            return NextResponse.json({
                success: false,
                message: 'Admin user already exists!',
            }, { status: 409 });
        }

        // Create admin user
        const admin = await User.create({
            email: 'admin@laplap.com',
            password: 'Admin123456',
            name: 'Admin User',
            role: 'superadmin',
            status: 'active',
        });

        return NextResponse.json({
            success: true,
            message: 'Admin user created successfully!',
            data: {
                email: 'admin@laplap.com',
                password: 'Admin123456',
                role: 'superadmin',
                note: 'Please change the password after first login',
            },
        });
    } catch (error: any) {
        console.error('Error creating admin:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Failed to create admin user',
        }, { status: 500 });
    }
}
