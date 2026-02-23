import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import PopupBanner from '@/models/PopupBanner';

export async function GET() {
    try {
        await connectDB();
        const banner = await PopupBanner.findOne({ isActive: true });
        return NextResponse.json({ success: true, data: banner });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to fetch banner' }, { status: 500 });
    }
}
