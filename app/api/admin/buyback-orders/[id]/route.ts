import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { BuybackOrder } from "@/models/BuybackOrder";
import { logAudit } from "@/lib/audit";
import { onBuybackApproved } from "@/lib/automations";

// GET single buyback order
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        
        const order = await BuybackOrder.findById(id)
            .populate('inspectedBy', 'name')
            .populate('approvedBy', 'name');
        
        if (!order) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy đơn thu cũ" },
                { status: 404 }
            );
        }
        
        return NextResponse.json({
            success: true,
            data: order
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// PUT update buyback order
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();
        
        // Get old data for audit
        const oldOrder = await BuybackOrder.findById(id).lean();
        
        const order = await BuybackOrder.findByIdAndUpdate(
            id,
            body,
            { new: true }
        );
        
        if (!order) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy đơn thu cũ" },
                { status: 404 }
            );
        }
        
        // Log audit
        const orderData = order.toObject();
        await logAudit({
            collectionName: "buybackorders",
            documentId: id,
            action: "update",
            before: oldOrder,
            after: orderData,
            description: `Cập nhật đơn thu cũ: ${order.customerName || id}`,
            req: request as any,
        });
        
        // TỰ ĐỘNG TẠO VOUCHER KHI DUYỆT
        if (body.status === 'approved' && oldOrder?.status !== 'approved') {
            try {
                console.log(`🚀 [BUYBACK] Creating voucher for approved: ${id}`);
                const automationResults = await onBuybackApproved(id);
                console.log(`✅ [BUYBACK] Voucher created:`, automationResults);
                
                return NextResponse.json({
                    success: true,
                    message: "Đơn thu cũ đã duyệt và tự động tạo voucher",
                    data: orderData,
                    automation: automationResults
                });
            } catch (autoError: any) {
                console.error(`❌ [BUYBACK] Automation error:`, autoError.message);
                return NextResponse.json({
                    success: true,
                    message: "Cập nhật thành công nhưng lỗi tạo voucher",
                    data: orderData,
                    automationError: autoError.message
                });
            }
        }
        
        return NextResponse.json({
            success: true,
            message: "Cập nhật thành công",
            data: orderData
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// DELETE buyback order
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try {
        await connectDB();
        const { id } = await params;
        
        // Get order for audit before delete
        const order = await BuybackOrder.findById(id).lean();
        
        if (!order) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy đơn thu cũ" },
                { status: 404 }
            );
        }
        
        await BuybackOrder.findByIdAndDelete(id);
        
        // Log audit
        await logAudit({
            collectionName: "buybackorders",
            documentId: id,
            action: "delete",
            before: order,
            description: `Xóa đơn thu cũ: ${order.customerName || id}`,
            req: request as any,
        });
        
        return NextResponse.json({
            success: true,
            message: "Xóa đơn thu cũ thành công"
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
