
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Component from '@/models/Component';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await connectDB();
    const { id } = await params;

    try {
        const body = await request.json();
        const component = await Component.findByIdAndUpdate(id, body, {
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
    { params }: { params: Promise<{ id: string }> }
) {
    await connectDB();
    const { id } = await params;

    try {
        const component = await Component.findByIdAndDelete(id);

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
    { params }: { params: Promise<{ id: string }> }
) {
    await connectDB();
    const { id } = await params;

    try {
        const component = await Component.findById(id);

        if (!component) {
            return NextResponse.json({ success: false, message: 'Component not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: component });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}
