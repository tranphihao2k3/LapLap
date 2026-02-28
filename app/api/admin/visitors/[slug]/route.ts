import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Visitor } from "@/models/Visitor";
import { logAudit } from "@/lib/audit";
import mongoose from "mongoose";

// GET single visitor by ID
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

        const visitor = await Visitor.findById(slug).lean();
        if (!visitor) {
            return NextResponse.json({ success: false, error: "Không tìm thấy visitor" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: visitor });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// PUT update visitor
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
        const oldVisitor = await Visitor.findById(slug).lean();

        const updatedVisitor = await Visitor.findByIdAndUpdate(slug, { $set: body }, { new: true });
        if (!updatedVisitor) {
            return NextResponse.json({ success: false, error: "Không tìm thấy visitor" }, { status: 404 });
        }

        // Log audit
        await logAudit({
            collectionName: "visitors",
            documentId: slug,
            action: "update",
            before: oldVisitor,
            after: updatedVisitor.toObject(),
            description: `Cập nhật visitor: ${updatedVisitor.ip || slug}`,
            req: request as any,
        });

        return NextResponse.json({ success: true, data: updatedVisitor });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// DELETE visitor
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

        // Get visitor for audit before delete
        const visitor = await Visitor.findById(slug).lean();
        
        if (!visitor) {
            return NextResponse.json({ success: false, error: "Không tìm thấy visitor" }, { status: 404 });
        }

        await Visitor.findByIdAndDelete(slug);

        // Log audit
        await logAudit({
            collectionName: "visitors",
            documentId: slug,
            action: "delete",
            before: visitor,
            description: `Xóa visitor: ${visitor.ip || slug}`,
            req: request as any,
        });

        return NextResponse.json({ success: true, message: "Đã xóa visitor" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
