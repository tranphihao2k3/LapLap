import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { Inventory } from "@/models/Inventory";
import { InventoryLog } from "@/models/InventoryLog";
import { logAudit } from "@/lib/audit";
import { onOrderDelivered } from "@/lib/automations";

// GET single order
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;
        const order = await Order.findById(slug);

        if (!order) {
            return NextResponse.json(
                { success: false, message: "Order not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: order });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to fetch order" },
            { status: 500 }
        );
    }
}

// UPDATE order status - PUT method
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;
        const body = await request.json();

        // Get old order for audit
        const oldOrder = await Order.findById(slug).lean();

        const updateData: any = { status: body.status };
        if (body.status === 'delivered') {
            updateData.deliveryDate = new Date();
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            slug,
            updateData,
            { new: true }
        );

        if (!updatedOrder) {
            return NextResponse.json(
                { success: false, error: "Order not found" },
                { status: 404 }
            );
        }

        // Log audit
        await logAudit({
            collectionName: "orders",
            documentId: slug,
            action: "update",
            before: oldOrder,
            after: updatedOrder.toObject(),
            description: `Cập nhật trạng thái đơn hàng: ${body.status}`,
            req: request as any,
        });

        // ========================================
        // TỰ ĐỘNG HÓA KHI GIAO HÀNG THÀNH CÔNG
        // ========================================
        if (body.status === 'delivered' && oldOrder?.status !== 'delivered') {
            try {
                console.log(`🚀 [ORDER] Triggering automation for delivered order: ${slug}`);
                const automationResults = await onOrderDelivered(slug);
                console.log(`✅ [ORDER] Automation completed:`, automationResults);
                
                return NextResponse.json({ 
                    success: true, 
                    data: updatedOrder,
                    automation: automationResults,
                    message: "Đơn hàng đã giao và đã xử lý tự động"
                });
            } catch (autoError: any) {
                console.error(`❌ [ORDER] Automation error:`, autoError.message);
                return NextResponse.json({ 
                    success: true, 
                    data: updatedOrder,
                    automationError: autoError.message
                });
            }
        }

        // ========================================
        // TỰ ĐỘNG HOÀN KHO KHI HỦY ĐƠN
        // ========================================
        if (body.status === 'cancelled' && oldOrder?.status !== 'cancelled') {
            try {
                console.log(`🚀 [ORDER] Processing order cancellation: ${slug}`);
                
                // Hoàn kho cho từng sản phẩm
                for (const item of updatedOrder.items) {
                    const inventory = await Inventory.findOne({ productId: item.product });
                    
                    if (inventory) {
                        await Inventory.findByIdAndUpdate(inventory._id, {
                            $inc: {
                                quantity: item.quantity,
                                availableQuantity: item.quantity,
                            }
                        });
                        
                        // Tạo log hoàn kho
                        await InventoryLog.create({
                            type: "RETURN",
                            productId: item.product,
                            warehouseId: inventory.warehouseId,
                            quantity: item.quantity,
                            quantityBefore: inventory.quantity,
                            quantityAfter: inventory.quantity + item.quantity,
                            referenceType: "order",
                            referenceId: updatedOrder._id,
                            notes: `Hoàn kho do hủy đơn ${updatedOrder.orderNumber}`,
                        });
                        
                        console.log(`   ✅ [INVENTORY] Returned ${item.quantity} for product ${item.product}`);
                    }
                }
                
                console.log(`✅ [ORDER] Inventory returned for cancelled order`);
                
                return NextResponse.json({ 
                    success: true, 
                    data: updatedOrder,
                    message: "Đơn hàng đã hủy và hoàn kho thành công"
                });
            } catch (autoError: any) {
                console.error(`❌ [ORDER] Cancel automation error:`, autoError.message);
                return NextResponse.json({ 
                    success: true, 
                    data: updatedOrder,
                    cancelError: autoError.message
                });
            }
        }

        return NextResponse.json({ success: true, data: updatedOrder });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to update order" },
            { status: 500 }
        );
    }
}

// UPDATE order status - PATCH method
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;
        const body = await request.json();

        const oldOrder = await Order.findById(slug).lean();

        const updateData: any = { status: body.status };
        if (body.status === 'delivered') {
            updateData.deliveryDate = new Date();
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            slug,
            updateData,
            { new: true }
        );

        if (!updatedOrder) {
            return NextResponse.json(
                { success: false, error: "Order not found" },
                { status: 404 }
            );
        }

        await logAudit({
            collectionName: "orders",
            documentId: slug,
            action: "update",
            before: oldOrder,
            after: updatedOrder.toObject(),
            description: `Cập nhật trạng thái đơn hàng: ${body.status}`,
            req: request as any,
        });

        // Automation for delivered
        if (body.status === 'delivered' && oldOrder?.status !== 'delivered') {
            try {
                const automationResults = await onOrderDelivered(slug);
                return NextResponse.json({ 
                    success: true, 
                    data: updatedOrder,
                    automation: automationResults
                });
            } catch (autoError: any) {
                return NextResponse.json({ 
                    success: true, 
                    data: updatedOrder,
                    automationError: autoError.message
                });
            }
        }

        // Automation for cancelled - return inventory
        if (body.status === 'cancelled' && oldOrder?.status !== 'cancelled') {
            try {
                for (const item of updatedOrder.items) {
                    const inventory = await Inventory.findOne({ productId: item.product });
                    if (inventory) {
                        await Inventory.findByIdAndUpdate(inventory._id, {
                            $inc: { quantity: item.quantity, availableQuantity: item.quantity }
                        });
                        await InventoryLog.create({
                            type: "RETURN",
                            productId: item.product,
                            warehouseId: inventory.warehouseId,
                            quantity: item.quantity,
                            referenceType: "order",
                            referenceId: updatedOrder._id,
                            notes: `Hoàn kho do hủy đơn ${updatedOrder.orderNumber}`,
                        });
                    }
                }
                return NextResponse.json({ 
                    success: true, 
                    data: updatedOrder,
                    message: "Đơn hàng đã hủy và hoàn kho"
                });
            } catch (autoError: any) {
                return NextResponse.json({ 
                    success: true, 
                    data: updatedOrder,
                    cancelError: autoError.message
                });
            }
        }

        return NextResponse.json({ success: true, data: updatedOrder });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to update order" },
            { status: 500 }
        );
    }
}
