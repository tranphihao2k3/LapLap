import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { LoyaltyPoints } from "@/models/LoyaltyPoints";
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

        const record = await LoyaltyPoints.findById(slug)
            .populate("customerId", "name phone email")
            .populate("orderId", "orderNumber total")
            .lean();
            
        if (!record) {
            return NextResponse.json({ success: false, error: "Không tìm thấy bản ghi" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: record });
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
        const oldRecord = await LoyaltyPoints.findById(slug).lean();

        const updatedRecord = await LoyaltyPoints.findByIdAndUpdate(slug, { $set: body }, { new: true })
            .populate("customerId", "name phone email");
            
        if (!updatedRecord) {
            return NextResponse.json({ success: false, error: "Không tìm thấy bản ghi" }, { status: 404 });
        }

        // Log audit
        await logAudit({
            collectionName: "loyaltypoints",
            documentId: slug,
            action: "update",
            before: oldRecord,
            after: updatedRecord.toObject(),
            description: `Cập nhật điểm thưởng: ${updatedRecord.customerId?.name || slug}`,
            req: request as any,
        });

        return NextResponse.json({ success: true, data: updatedRecord });
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

        // Get record for audit before delete
        const record = await LoyaltyPoints.findById(slug)
            .populate("customerId", "name phone email")
            .lean();
            
        if (!record) {
            return NextResponse.json({ success: false, error: "Không tìm thấy bản ghi" }, { status: 404 });
        }

        await LoyaltyPoints.findByIdAndDelete(slug);

        // Log audit
        await logAudit({
            collectionName: "loyaltypoints",
            documentId: slug,
            action: "delete",
            before: record,
            description: `Xóa điểm thưởng: ${record.customerId?.name || slug}`,
            req: request as any,
        });

        return NextResponse.json({ success: true, message: "Đã xóa bản ghi" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
