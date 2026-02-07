import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

// GET - Check if setup is needed (no users exist)
export async function GET() {
    try {
        await connectDB();
        const userCount = await User.countDocuments();

        return NextResponse.json({
            success: true,
            needsSetup: userCount === 0,
            userCount,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: 'Failed to check setup status' },
            { status: 500 }
        );
    }
}
