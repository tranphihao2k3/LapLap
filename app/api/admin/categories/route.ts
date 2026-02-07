import { NextRequest, NextResponse } from "next/server";
import { Category } from "@/models/Category";
import mongoose from "mongoose";

// Connect to MongoDB
async function connectDB() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI!);
    }
}

// GET all categories
export async function GET() {
    try {
        await connectDB();
        const categories = await Category.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: categories });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST create new category
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

        const category = await Category.create(body);
        return NextResponse.json(
            { success: true, data: category },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}
