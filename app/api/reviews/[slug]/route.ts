import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Review } from "@/models/Review";
import mongoose from "mongoose";

// GET single review by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;

        if (!mongoose.Types.ObjectId.isValid(slug)) {
            return NextResponse.json({ success: false, error: "ID không hợp lệ" }, { status: 400 });
        }

        const review = await Review.findById(slug).lean();

        if (!review) {
            return NextResponse.json({ success: false, error: "Không tìm thấy đánh giá" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: review });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to fetch review" }, { status: 500 });
    }
}

// PUT - Update review (admin: approve/reject, add reply)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;
        const body = await request.json();

        if (!mongoose.Types.ObjectId.isValid(slug)) {
            return NextResponse.json({ success: false, error: "ID không hợp lệ" }, { status: 400 });
        }

        const review = await Review.findByIdAndUpdate(
            slug,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!review) {
            return NextResponse.json({ success: false, error: "Không tìm thấy đánh giá" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: review });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// DELETE review
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;

        if (!mongoose.Types.ObjectId.isValid(slug)) {
            return NextResponse.json({ success: false, error: "ID không hợp lệ" }, { status: 400 });
        }

        const review = await Review.findByIdAndDelete(slug);
        if (!review) {
            return NextResponse.json({ success: false, error: "Không tìm thấy đánh giá" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Đã xóa đánh giá" });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to delete review" }, { status: 500 });
    }
}
