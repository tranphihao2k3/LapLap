
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Component from '@/models/Component';

export async function GET(request: Request) {
    await connectDB();

    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const query: any = { active: true }; // Only fetch active components by default? Or all? Usually admin needs all.
        // Let's filter by active status if requested, otherwise return all
        const fetchAll = searchParams.get('all') === 'true';
        if (!fetchAll) {
            query.active = true;
        }

        if (type) {
            query.type = type.toUpperCase();
        }

        const components = await Component.find(query).sort({ updatedAt: -1 });

        return NextResponse.json({ success: true, data: components });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}

export async function POST(request: Request) {
    await connectDB();

    try {
        const body = await request.json();
        const component = await Component.create(body);

        return NextResponse.json({ success: true, data: component }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}
