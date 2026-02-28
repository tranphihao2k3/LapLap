import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Attendance } from "@/models/Attendance";
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

        const attendance = await Attendance.findById(slug)
            .populate("employeeId", "name email position")
            .lean();
            
        if (!attendance) {
            return NextResponse.json({ success: false, error: "Không tìm thấy bản ghi" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: attendance });
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
        const oldAttendance = await Attendance.findById(slug).lean();

        const updatedAttendance = await Attendance.findByIdAndUpdate(slug, { $set: body }, { new: true })
            .populate("employeeId", "name email position");
            
        if (!updatedAttendance) {
            return NextResponse.json({ success: false, error: "Không tìm thấy bản ghi" }, { status: 404 });
        }

        // Log audit
        await logAudit({
            collectionName: "attendance",
            documentId: slug,
            action: "update",
            before: oldAttendance,
            after: updatedAttendance.toObject(),
            description: `Cập nhật chấm công: ${updatedAttendance.employeeId?.name || slug}`,
            req: request as any,
        });

        return NextResponse.json({ success: true, data: updatedAttendance });
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

        // Get attendance for audit before delete
        const attendance = await Attendance.findById(slug)
            .populate("employeeId", "name email position")
            .lean();
            
        if (!attendance) {
            return NextResponse.json({ success: false, error: "Không tìm thấy bản ghi" }, { status: 404 });
        }

        await Attendance.findByIdAndDelete(slug);

        // Log audit
        await logAudit({
            collectionName: "attendance",
            documentId: slug,
            action: "delete",
            before: attendance,
            description: `Xóa bản ghi chấm công: ${attendance.employeeId?.name || slug}`,
            req: request as any,
        });

        return NextResponse.json({ success: true, message: "Đã xóa bản ghi" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
