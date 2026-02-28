import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Debt } from "@/models/Debt";
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

        const debt = await Debt.findById(slug)
            .populate("customerId", "name phone email")
            .populate("supplierId", "name phone email")
            .lean();
            
        if (!debt) {
            return NextResponse.json({ success: false, error: "Không tìm thấy bản ghi" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: debt });
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
        const oldDebt = await Debt.findById(slug).lean();

        const debt = await Debt.findById(slug);
        if (!debt) {
            return NextResponse.json({ success: false, error: "Không tìm thấy bản ghi" }, { status: 404 });
        }

        // Update fields
        Object.assign(debt, body);
        await debt.save();
        
        await debt.populate("customerId", "name phone email");
        await debt.populate("supplierId", "name phone email");

        // Log audit
        await logAudit({
            collectionName: "debts",
            documentId: slug,
            action: "update",
            before: oldDebt,
            after: debt.toObject(),
            description: `Cập nhật công nợ: ${debt.customerId?.name || debt.supplierId?.name || slug}`,
            req: request as any,
        });

        return NextResponse.json({ success: true, data: debt });
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

        // Get debt for audit before delete
        const debt = await Debt.findById(slug)
            .populate("customerId", "name phone email")
            .populate("supplierId", "name phone email")
            .lean();
            
        if (!debt) {
            return NextResponse.json({ success: false, error: "Không tìm thấy bản ghi" }, { status: 404 });
        }

        await Debt.findByIdAndDelete(slug);

        // Log audit
        await logAudit({
            collectionName: "debts",
            documentId: slug,
            action: "delete",
            before: debt,
            description: `Xóa công nợ: ${debt.customerId?.name || debt.supplierId?.name || slug}`,
            req: request as any,
        });

        return NextResponse.json({ success: true, message: "Đã xóa bản ghi" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
