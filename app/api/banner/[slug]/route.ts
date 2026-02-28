import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PopupBanner from "@/models/PopupBanner";
import mongoose from "mongoose";

// GET single banner by ID
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

        const banner = await PopupBanner.findById(slug).lean();

        if (!banner) {
            return NextResponse.json({ success: false, error: "Không tìm thấy banner" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: banner });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to fetch banner" }, { status: 500 });
    }
}

// PUT - Update banner
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

        const banner = await PopupBanner.findByIdAndUpdate(
            slug,
            { $set: { ...body, updatedAt: new Date() } },
            { new: true }
        );

        if (!banner) {
            return NextResponse.json({ success: false, error: "Không tìm thấy banner" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: banner });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// DELETE banner
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

        const banner = await PopupBanner.findByIdAndDelete(slug);
        if (!banner) {
            return NextResponse.json({ success: false, error: "Không tìm thấy banner" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Đã xóa banner" });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to delete banner" }, { status: 500 });
    }
}
