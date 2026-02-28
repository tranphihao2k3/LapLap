import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PopupBanner from "@/models/PopupBanner";
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

        const banner = await PopupBanner.findById(slug).lean();
            
        if (!banner) {
            return NextResponse.json({ success: false, error: "Không tìm thấy banner" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: banner });
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
        const oldBanner = await PopupBanner.findById(slug).lean();

        const banner = await PopupBanner.findByIdAndUpdate(slug, { $set: body }, { new: true });
            
        if (!banner) {
            return NextResponse.json({ success: false, error: "Không tìm thấy banner" }, { status: 404 });
        }

        // Log audit
        await logAudit({
            collectionName: "popupbanners",
            documentId: slug,
            action: "update",
            before: oldBanner,
            after: banner.toObject(),
            description: `Cập nhật popup banner: ${banner.title || slug}`,
            req: request as any,
        });

        return NextResponse.json({ success: true, data: banner });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

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

        // Get banner for audit before delete
        const banner = await PopupBanner.findById(slug).lean();
        
        if (!banner) {
            return NextResponse.json({ success: false, error: "Không tìm thấy banner" }, { status: 404 });
        }

        await PopupBanner.findByIdAndDelete(slug);

        // Log audit
        await logAudit({
            collectionName: "popupbanners",
            documentId: slug,
            action: "delete",
            before: banner,
            description: `Xóa popup banner: ${banner.title || slug}`,
            req: request as any,
        });

        return NextResponse.json({ success: true, message: "Đã xóa banner" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
