import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { rateLimit } from '@/lib/rate-limiter';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';

// POST - Create new admin user (protected - only for superadmin or first user)
export async function POST(request: Request) {
    try {
        // Rate limiting
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        const rateLimitResult = rateLimit(`register:${ip}`, 3, 60 * 60 * 1000); // 3 attempts per hour

        if (!rateLimitResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Too many registration attempts. Please try again later.',
                    resetTime: rateLimitResult.resetTime,
                },
                { status: 429 }
            );
        }

        await connectDB();

        // Check if this is the first user
        const userCount = await User.countDocuments();
        const isFirstUser = userCount === 0;

        // If not first user, require authentication
        if (!isFirstUser) {
            const session = await getServerSession(authOptions);

            if (!session || session.user.role !== 'superadmin') {
                return NextResponse.json(
                    { success: false, message: 'Unauthorized. Only superadmin can create users.' },
                    { status: 403 }
                );
            }
        }

        const { email, password, name, role } = await request.json();

        // Validation
        if (!email || !password || !name) {
            return NextResponse.json(
                { success: false, message: 'Email, password, and name are required' },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { success: false, message: 'Password must be at least 8 characters' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { success: false, message: 'User with this email already exists' },
                { status: 409 }
            );
        }

        // Create user
        const user = await User.create({
            email: email.toLowerCase(),
            password,
            name,
            role: isFirstUser ? 'superadmin' : (role || 'admin'),
            status: 'active',
        });

        return NextResponse.json({
            success: true,
            message: 'User created successfully',
            data: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Failed to create user' },
            { status: 500 }
        );
    }
}

// GET - Get all users (protected - admin only)
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: users,
        });
    } catch (error: any) {
        console.error('Get users error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}
