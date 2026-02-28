import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Visitor } from "@/models/Visitor";
import mongoose from "mongoose";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;

        let visitor;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            visitor = await Visitor.findById(slug).lean();
        } else {
            visitor = await Visitor.findOne({ label: slug }).lean();
        }

        if (!visitor) {
            return NextResponse.json({ success: false, error: "Không tìm thấy" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: visitor });
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

        let visitor;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            visitor = await Visitor.findByIdAndUpdate(slug, { $set: body }, { new: true });
        } else {
            visitor = await Visitor.findOneAndUpdate({ label: slug }, { $set: body }, { new: true });
        }

        if (!visitor) {
            return NextResponse.json({ success: false, error: "Không tìm thấy" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: visitor });
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

        let visitor;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            visitor = await Visitor.findByIdAndDelete(slug);
        } else {
            visitor = await Visitor.findOneAndDelete({ label: slug });
        }

        if (!visitor) {
            return NextResponse.json({ success: false, error: "Không tìm thấy" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Đã xóa" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
