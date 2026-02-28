import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;

        let user;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            user = await User.findById(slug).select("-password").lean();
        } else {
            user = await User.findOne({ email: slug }).select("-password").lean();
        }

        if (!user) {
            return NextResponse.json({ success: false, error: "Không tìm thấy người dùng" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: user });
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

        // Never allow password update through this route directly
        delete body.password;

        let user;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            user = await User.findByIdAndUpdate(slug, { $set: body }, { new: true }).select("-password");
        } else {
            user = await User.findOneAndUpdate({ email: slug }, { $set: body }, { new: true }).select("-password");
        }

        if (!user) {
            return NextResponse.json({ success: false, error: "Không tìm thấy người dùng" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: user });
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

        let user;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            user = await User.findByIdAndDelete(slug);
        } else {
            user = await User.findOneAndDelete({ email: slug });
        }

        if (!user) {
            return NextResponse.json({ success: false, error: "Không tìm thấy người dùng" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Đã xóa người dùng" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
