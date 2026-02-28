import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Feedback } from "@/models/Feedback";
import mongoose from "mongoose";

export async function GET(
    request: Request,
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
            return NextResponse.json({ success: false, error: "Không tìm thấy phản hồi" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: feedback });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;
        const body = await request.json();

        if (!mongoose.Types.ObjectId.isValid(slug)) {
            return NextResponse.json({ success: false, error: "ID không hợp lệ" }, { status: 400 });
        }

        const feedback = await Feedback.findByIdAndUpdate(
            slug,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!feedback) {
            return NextResponse.json({ success: false, error: "Không tìm thấy phản hồi" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: feedback });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;

        if (!mongoose.Types.ObjectId.isValid(slug)) {
            return NextResponse.json({ success: false, error: "ID không hợp lệ" }, { status: 400 });
        }

        const feedback = await Feedback.findByIdAndDelete(slug);
        if (!feedback) {
            return NextResponse.json({ success: false, error: "Không tìm thấy phản hồi" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Đã xóa phản hồi" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
