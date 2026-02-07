import { NextRequest, NextResponse } from "next/server";
import { Brand } from "@/models/Brand";
import mongoose from "mongoose";

async function connectDB() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI!);
    }
}

// GET all brands
export async function GET() {
    try {
        await connectDB();
        const brands = await Brand.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: brands });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST create new brand
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();

        // Auto-generate slug from name if not provided
        if (!body.slug) {
            body.slug = body.name
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/đ/g, "d")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");
        }

        const brand = await Brand.create(body);
        return NextResponse.json(
            { success: true, data: brand },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}
