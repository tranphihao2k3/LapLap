import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PopupBanner from "@/models/PopupBanner";
import mongoose from "mongoose";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;

        let banner;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            banner = await PopupBanner.findById(slug).lean();
        } else {
            banner = await PopupBanner.findOne({ title: slug }).lean();
        }

        if (!banner) {
            return NextResponse.json({ success: false, error: "Không tìm thấy banner" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: banner });
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

        let banner;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            banner = await PopupBanner.findByIdAndUpdate(slug, { $set: body }, { new: true });
        } else {
            banner = await PopupBanner.findOneAndUpdate({ title: slug }, { $set: body }, { new: true });
        }

        if (!banner) {
            return NextResponse.json({ success: false, error: "Không tìm thấy banner" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: banner });
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

        let banner;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            banner = await PopupBanner.findByIdAndDelete(slug);
        } else {
            banner = await PopupBanner.findOneAndDelete({ title: slug });
        }

        if (!banner) {
            return NextResponse.json({ success: false, error: "Không tìm thấy banner" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Đã xóa banner" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
