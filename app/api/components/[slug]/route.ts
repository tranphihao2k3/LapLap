import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Component from '@/models/Component';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    await connectDB();
    const { slug } = await params;

    try {
        const body = await request.json();
        const component = await Component.findByIdAndUpdate(slug, body, {
            new: true,
            runValidators: true,
        });

        if (!component) {
            return NextResponse.json({ success: false, message: 'Component not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: component });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    await connectDB();
    const { slug } = await params;

    try {
        const component = await Component.findByIdAndDelete(slug);

        if (!component) {
            return NextResponse.json({ success: false, message: 'Component not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    await connectDB();
    const { slug } = await params;

    try {
        const component = await Component.findById(slug);

        if (!component) {
            return NextResponse.json({ success: false, message: 'Component not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: component });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}
