import { NextRequest, NextResponse } from "next/server";
import { Brand } from "@/models/Brand";
import mongoose from "mongoose";

async function connectDB() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI!);
    }
}

// GET single brand
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const brand = await Brand.findById(id);

        if (!brand) {
            return NextResponse.json(
                { success: false, error: "Brand not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: brand });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// PUT update brand
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const body = await request.json();
        const { id } = await params;

        const brand = await Brand.findByIdAndUpdate(
            id,
            body,
            { new: true, runValidators: true }
        );

        if (!brand) {
            return NextResponse.json(
                { success: false, error: "Brand not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: brand });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}

// DELETE brand
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const brand = await Brand.findByIdAndDelete(id);

        if (!brand) {
            return NextResponse.json(
                { success: false, error: "Brand not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Brand deleted successfully"
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
