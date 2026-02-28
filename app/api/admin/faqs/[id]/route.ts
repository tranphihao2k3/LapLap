import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { FAQ } from "@/models/FAQ";
import { logAudit } from "@/lib/audit";

// GET single FAQ
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        
        const faq = await FAQ.findById(id);
        
        if (!faq) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy FAQ" },
                { status: 404 }
            );
        }
        
        return NextResponse.json({
            success: true,
            data: faq
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// PUT update FAQ
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();
        
        // Get old data for audit
        const oldFaq = await FAQ.findById(id).lean();
        
        const updateData: any = {};
        if (body.question) updateData.question = body.question;
        if (body.answer) updateData.answer = body.answer;
        if (body.category) updateData.category = body.category;
        if (body.order !== undefined) updateData.order = body.order;
        if (body.isActive !== undefined) updateData.isActive = body.isActive;
        
        const updated = await FAQ.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );
        
        if (!updated) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy FAQ" },
                { status: 404 }
            );
        }
        
        // Log audit
        await logAudit({
            collectionName: "faqs",
            documentId: id,
            action: "update",
            before: oldFaq,
            after: updated.toObject(),
            description: `Cập nhật FAQ: ${updated.question}`,
            req: request as any,
        });
        
        return NextResponse.json({
            success: true,
            message: "Cập nhật thành công",
            data: updated
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// DELETE FAQ
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try {
        await connectDB();
        const { id } = await params;
        
        // Get FAQ for audit before delete
        const faq = await FAQ.findById(id).lean();
        
        if (!faq) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy FAQ" },
                { status: 404 }
            );
        }
        
        await FAQ.findByIdAndDelete(id);
        
        // Log audit
        await logAudit({
            collectionName: "faqs",
            documentId: id,
            action: "delete",
            before: faq,
            description: `Xóa FAQ: ${faq.question}`,
            req: request as any,
        });
        
        return NextResponse.json({
            success: true,
            message: "Xóa thành công"
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
