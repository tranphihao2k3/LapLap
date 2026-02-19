import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Visitor } from '@/models/Visitor';

export async function GET() {
    try {
        await connectDB();
        let visitor = await Visitor.findOne({ label: 'total_visitors' });

        if (!visitor) {
            visitor = await Visitor.create({ count: 0, label: 'total_visitors' });
        }

        return NextResponse.json({ success: true, count: visitor.count });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch visitors' }, { status: 500 });
    }
}

export async function POST() {
    try {
        await connectDB();

        // Use findOneAndUpdate with upsert to increment atomically
        const visitor = await Visitor.findOneAndUpdate(
            { label: 'total_visitors' },
            { $inc: { count: 1 } },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true, count: visitor.count });
    } catch (error) {
        console.error('Visitor increment error:', error);
        return NextResponse.json({ success: false, error: 'Failed to increment visitors' }, { status: 500 });
    }
}
