import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/models/Product";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;

        // Find product by slug
        let product = await Product.findOne({ slug })
            .populate("categoryId", "name slug")
            .populate("brandId", "name slug logo");

        // Fallback: Try to find by ID if slug looks like ObjectId and not found by slug
        if (!product && mongoose.Types.ObjectId.isValid(slug)) {
            product = await Product.findById(slug)
                .populate("categoryId", "name slug")
                .populate("brandId", "name slug logo");
        }

        if (!product) {
            return NextResponse.json(
                { success: false, error: "Laptop not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: product });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
