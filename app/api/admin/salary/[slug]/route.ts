import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Salary } from "@/models/Salary";
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

        const salary = await Salary.findById(slug)
            .populate("employeeId", "name email position baseSalary")
            .lean();
            
        if (!salary) {
            return NextResponse.json({ success: false, error: "Không tìm thấy bản ghi" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: salary });
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
        const oldSalary = await Salary.findById(slug).lean();

        const updatedSalary = await Salary.findByIdAndUpdate(slug, { $set: body }, { new: true })
            .populate("employeeId", "name email position baseSalary");
            
        if (!updatedSalary) {
            return NextResponse.json({ success: false, error: "Không tìm thấy bản ghi" }, { status: 404 });
        }

        // Log audit
        await logAudit({
            collectionName: "salary",
            documentId: slug,
            action: "update",
            before: oldSalary,
            after: updatedSalary.toObject(),
            description: `Cập nhật lương: ${updatedSalary.employeeId?.name || slug}`,
            req: request as any,
        });

        return NextResponse.json({ success: true, data: updatedSalary });
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

        // Get salary for audit before delete
        const salary = await Salary.findById(slug)
            .populate("employeeId", "name email position baseSalary")
            .lean();
            
        if (!salary) {
            return NextResponse.json({ success: false, error: "Không tìm thấy bản ghi" }, { status: 404 });
        }

        await Salary.findByIdAndDelete(slug);

        // Log audit
        await logAudit({
            collectionName: "salary",
            documentId: slug,
            action: "delete",
            before: salary,
            description: `Xóa bản ghi lương: ${salary.employeeId?.name || slug}`,
            req: request as any,
        });

        return NextResponse.json({ success: true, message: "Đã xóa bản ghi" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
