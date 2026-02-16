
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { seedSoftware } from '@/lib/seed';

export async function GET() {
    try {
        await connectDB();
        const results = await seedSoftware();
        return NextResponse.json({ success: true, message: "Software seeded successfully", count: results.length });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
