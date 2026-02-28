import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { FacebookGroup } from "@/models/FacebookGroup";
import mongoose from "mongoose";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;

        let group;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            group = await FacebookGroup.findById(slug).lean();
        } else {
            group = await FacebookGroup.findOne({ name: slug }).lean();
        }

        if (!group) {
            return NextResponse.json({ success: false, error: "Không tìm thấy nhóm" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: group });
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

        let group;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            group = await FacebookGroup.findByIdAndUpdate(slug, { $set: body }, { new: true });
        } else {
            group = await FacebookGroup.findOneAndUpdate({ name: slug }, { $set: body }, { new: true });
        }

        if (!group) {
            return NextResponse.json({ success: false, error: "Không tìm thấy nhóm" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: group });
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

        let group;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            group = await FacebookGroup.findByIdAndDelete(slug);
        } else {
            group = await FacebookGroup.findOneAndDelete({ name: slug });
        }

        if (!group) {
            return NextResponse.json({ success: false, error: "Không tìm thấy nhóm" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Đã xóa nhóm Facebook" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
