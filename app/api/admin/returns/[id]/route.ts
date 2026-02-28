import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Return } from "@/models/Return";
import { logAudit } from "@/lib/audit";

// GET single return
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        
        const returnData = await Return.findById(id)
            .populate('orderId', 'orderNumber totalAmount items')
            .populate('customerId', 'name phone email')
            .populate('processedBy', 'name');
        
        if (!returnData) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy đơn đổi/trả" },
                { status: 404 }
            );
        }
        
        return NextResponse.json({
            success: true,
            data: returnData
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// PUT update return
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();
        
        // Get old data for audit
        const oldReturn = await Return.findById(id).lean();
        
        const { status, refundAmount, refundMethod, notes, processedBy } = body;
        
        const updateData: any = {};
        if (status) updateData.status = status;
        if (refundAmount !== undefined) updateData.refundAmount = refundAmount;
        if (refundMethod) updateData.refundMethod = refundMethod;
        if (notes) updateData.notes = notes;
        
        // If processing the return
        if (status === 'processed' || status === 'approved') {
            updateData.processedBy = processedBy;
            updateData.processedAt = new Date();
        }
        
        const updatedReturn = await Return.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );
        
        if (!updatedReturn) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy đơn đổi/trả" },
                { status: 404 }
            );
        }
        
        // Log audit
        await logAudit({
            collectionName: "returns",
            documentId: id,
            action: "update",
            before: oldReturn,
            after: updatedReturn.toObject(),
            description: `Cập nhật đơn đổi/trả: ${updatedReturn.returnCode || id}`,
            req: request as any,
        });
        
        // ========================================
        // TỰ ĐỘNG HÓA KHI DUYỆT ĐỔI TRẢ
        // ========================================
        if ((status === 'processed' || status === 'approved') && 
            oldReturn?.status !== 'processed' && oldReturn?.status !== 'approved') {
            try {
                console.log(`🚀 [RETURN] Processing return approval: ${id}`);
                
                // Import automation
                const { onReturnApproved } = await import("@/lib/automations");
                const automationResults = await onReturnApproved(id);
                
                console.log(`✅ [RETURN] Automation completed:`, automationResults);
                
                return NextResponse.json({
                    success: true,
                    message: "Đơn đổi/trả đã duyệt và đã xử lý tự động hoàn kho",
                    data: updatedReturn,
                    automation: automationResults
                });
            } catch (autoError: any) {
                console.error(`❌ [RETURN] Automation error:`, autoError.message);
                return NextResponse.json({
                    success: true,
                    message: "Cập nhật thành công nhưng lỗi tự động hoàn kho",
                    data: updatedReturn,
                    automationError: autoError.message
                });
            }
        }
        
        return NextResponse.json({
            success: true,
            message: "Cập nhật đơn đổi/trả thành công",
            data: updatedReturn
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// DELETE return
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try {
        await connectDB();
        const { id } = await params;
        
        // Get return for audit before delete
        const returnData = await Return.findById(id).lean();
        
        if (!returnData) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy đơn đổi/trả" },
                { status: 404 }
            );
        }
        
        await Return.findByIdAndDelete(id);
        
        // Log audit
        await logAudit({
            collectionName: "returns",
            documentId: id,
            action: "delete",
            before: returnData,
            description: `Xóa đơn đổi/trả: ${returnData.returnCode || id}`,
            req: request as any,
        });
        
        return NextResponse.json({
            success: true,
            message: "Xóa đơn đổi/trả thành công"
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
