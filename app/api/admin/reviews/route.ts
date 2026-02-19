import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Review } from "@/models/Review";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || "all";
    const skip = (page - 1) * limit;

    try {
        await connectDB();

        let query: any = {};
        if (status !== 'all') {
            query.status = status;
        }

        const reviews = await Review.find(query)
            .populate("productId", "name image")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Review.countDocuments(query);

        return NextResponse.json({
            success: true,
            data: reviews,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Error fetching reviews" }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const { reviewId, status, reply } = body;

        const updateData: any = {};
        if (status) updateData.status = status;
        if (reply) updateData.reply = { content: reply, repliedAt: new Date() };

        const updatedReview = await Review.findByIdAndUpdate(reviewId, updateData, { new: true });

        // TODO: Update Product averageRating if status changes to/from 'approved'

        return NextResponse.json({ success: true, data: updatedReview });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Error updating review" }, { status: 500 });
    }
}
