import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Attendance } from "@/models/Attendance";
import mongoose from "mongoose";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;

        let record;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            record = await Attendance.findById(slug)
                .populate("employeeId", "fullName employeeCode")
                .lean();
        } else {
            return NextResponse.json({ success: false, error: "ID không hợp lệ" }, { status: 400 });
        }

        if (!record) {
            return NextResponse.json({ success: false, error: "Không tìm thấy bản ghi" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: record });
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

        const record = await Attendance.findByIdAndUpdate(
            slug,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!record) {
            return NextResponse.json({ success: false, error: "Không tìm thấy bản ghi" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: record });
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

        const record = await Attendance.findByIdAndDelete(slug);
        if (!record) {
            return NextResponse.json({ success: false, error: "Không tìm thấy bản ghi" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Đã xóa bản ghi chấm công" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
