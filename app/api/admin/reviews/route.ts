import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Review } from "@/models/Review";

// GET all reviews with filters
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get("productId");
        const rating = searchParams.get("rating");
        const status = searchParams.get("status");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");

        const query: any = {};
        if (productId) query.productId = productId;
        if (rating) query.rating = parseInt(rating);
        if (status) query.status = status;

        const skip = (page - 1) * limit;
        const total = await Review.countDocuments(query);
        const reviews = await Review.find(query)
            .populate("productId", "name slug images")
            .populate("customerId", "name email phone")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        return NextResponse.json({
            success: true,
            data: reviews,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error: any) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
