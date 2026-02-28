import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Review } from "@/models/Review";
import { logAudit } from "@/lib/audit";
import mongoose from "mongoose";

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

        const review = await Review.findById(slug)
            .populate("productId", "name slug images")
            .populate("customerId", "name email phone")
            .lean();
            
        if (!review) {
            return NextResponse.json({ success: false, error: "Không tìm thấy đánh giá" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: review });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

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

        // Get old data for audit
        const oldReview = await Review.findById(slug).lean();

        const review = await Review.findByIdAndUpdate(slug, { $set: body }, { new: true })
            .populate("productId", "name slug images")
            .populate("customerId", "name email phone");
            
        if (!review) {
            return NextResponse.json({ success: false, error: "Không tìm thấy đánh giá" }, { status: 404 });
        }

        // Log audit
        await logAudit({
            collectionName: "reviews",
            documentId: slug,
            action: "update",
            before: oldReview,
            after: review.toObject(),
            description: `Cập nhật đánh giá: ${review.userName || slug}`,
            req: request as any,
        });

        return NextResponse.json({ success: true, data: review });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
    try {
        await connectDB();
        const { slug } = await params;

        if (!mongoose.Types.ObjectId.isValid(slug)) {
            return NextResponse.json({ success: false, error: "ID không hợp lệ" }, { status: 400 });
        }

        // Get review for audit before delete
        const review = await Review.findById(slug).lean();
        
        if (!review) {
            return NextResponse.json({ success: false, error: "Không tìm thấy đánh giá" }, { status: 404 });
        }

        await Review.findByIdAndDelete(slug);

        // Log audit
        await logAudit({
            collectionName: "reviews",
            documentId: slug,
            action: "delete",
            before: review,
            description: `Xóa đánh giá: ${review.userName || slug}`,
            req: request as any,
        });

        return NextResponse.json({ success: true, message: "Đã xóa đánh giá" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
