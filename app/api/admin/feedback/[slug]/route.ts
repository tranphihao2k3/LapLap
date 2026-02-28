import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Feedback } from "@/models/Feedback";
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

        const feedback = await Feedback.findById(slug).lean();
        if (!feedback) {
            return NextResponse.json({ success: false, error: "Không tìm thấy feedback" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: feedback });
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
        const oldFeedback = await Feedback.findById(slug).lean();

        const feedback = await Feedback.findByIdAndUpdate(slug, { $set: body }, { new: true });
        if (!feedback) {
            return NextResponse.json({ success: false, error: "Không tìm thấy feedback" }, { status: 404 });
        }

        // Log audit
        await logAudit({
            collectionName: "feedback",
            documentId: slug,
            action: "update",
            before: oldFeedback,
            after: feedback.toObject(),
            description: `Cập nhật feedback: ${feedback.name || slug}`,
            req: request as any,
        });

        return NextResponse.json({ success: true, data: feedback });
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

        // Get feedback for audit before delete
        const feedback = await Feedback.findById(slug).lean();
        
        if (!feedback) {
            return NextResponse.json({ success: false, error: "Không tìm thấy feedback" }, { status: 404 });
        }

        await Feedback.findByIdAndDelete(slug);

        // Log audit
        await logAudit({
            collectionName: "feedback",
            documentId: slug,
            action: "delete",
            before: feedback,
            description: `Xóa feedback: ${feedback.name || slug}`,
            req: request as any,
        });

        return NextResponse.json({ success: true, message: "Đã xóa feedback" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
