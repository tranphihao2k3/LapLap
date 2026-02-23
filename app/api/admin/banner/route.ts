import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import PopupBanner from '@/models/PopupBanner';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        await connectDB();
        let banner = await PopupBanner.findOne();

        // Create a default one if none exists
        if (!banner) {
            banner = await PopupBanner.create({
                title: 'Chào mừng Xuân Ất Tỵ 2025',
                imageUrl: 'https://res.cloudinary.com/defhezuhn/image/upload/v1705664165/placeholder-laptop.png',
                link: '/laptops',
                isActive: false
            });
        }

        return NextResponse.json({ success: true, data: banner });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to fetch' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        await connectDB();

        const banner = await PopupBanner.findOneAndUpdate(
            {},
            { ...body, updatedAt: Date.now() },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true, data: banner });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Update failed' }, { status: 500 });
    }
}
