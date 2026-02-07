import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/models/Product";
import mongoose from "mongoose";

async function connectDB() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI!);
    }
}

// GET all laptops with category and brand info
export async function GET() {
    try {
        await connectDB();
        const laptops = await Product.find()
            .populate("categoryId", "name slug")
            .populate("brandId", "name slug logo")
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: laptops });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST create new laptop
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();

        // Ensure image is set for backward compatibility
        if (!body.image && body.images && body.images.length > 0) {
            body.image = body.images[0];
        }

        const laptop = await Product.create(body);

        // Populate before returning
        await laptop.populate("categoryId", "name slug");
        await laptop.populate("brandId", "name slug logo");

        return NextResponse.json(
            { success: true, data: laptop },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}
