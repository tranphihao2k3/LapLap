import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { PurchaseOrder } from "@/models/PurchaseOrder";
import { Inventory } from "@/models/Inventory";
import { InventoryLog } from "@/models/InventoryLog";
import { Product } from "@/models/Product";
import { logAudit } from "@/lib/audit";

// GET single purchase order
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const order = await PurchaseOrder.findById(id)
            .populate('supplierId', 'name phone email')
            .populate('warehouseId', 'name');

        if (!order) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy đơn nhập hàng" },
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

// PUT - Update purchase order (status, receive items)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();

        const order = await PurchaseOrder.findById(id);
        if (!order) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy đơn nhập hàng" },
                { status: 404 }
            );
        }

        const oldOrder = order.toObject();

        // XỬ LÝ NHẬN HÀNG
        if (body.action === 'receive') {
            const { items, notes } = body;

            // Cập nhật số lượng đã nhận
            for (const receivedItem of items) {
                const itemIndex = order.items.findIndex(
                    (i: any) => i.productId.toString() === receivedItem.productId
                );

                if (itemIndex >= 0) {
                    order.items[itemIndex].receivedQuantity =
                        (order.items[itemIndex].receivedQuantity || 0) + receivedItem.quantity;
                }
            }

            // Cập nhật trạng thái
            const allReceived = order.items.every(
                (i: any) => (i.receivedQuantity || 0) >= i.quantity
            );

            if (allReceived) {
                order.status = "received";
                order.receivedDate = new Date();
            } else {
                order.status = "partial";
            }

            // CẬP NHẬT KHO - Thêm inventory
            for (const receivedItem of items) {
                const quantity = receivedItem.quantity;

                // Tìm hoặc tạo inventory
                let inventory = await Inventory.findOne({
                    productId: receivedItem.productId,
                    warehouseId: order.warehouseId,
                });

                if (inventory) {
                    // Cộng dồn
                    await Inventory.findByIdAndUpdate(inventory._id, {
                        $inc: {
                            quantity: quantity,
                            availableQuantity: quantity,
                        }
                    });
                } else {
                    // Tạo mới
                    await Inventory.create({
                        productId: receivedItem.productId,
                        warehouseId: order.warehouseId,
                        quantity: quantity,
                        availableQuantity: quantity,
                    });
                }

                // TẠO INVENTORY LOG
                await InventoryLog.create({
                    type: "IN",
                    productId: receivedItem.productId,
                    warehouseId: order.warehouseId,
                    quantity: quantity,
                    referenceType: "purchase",
                    referenceId: order._id,
                    notes: `Nhập hàng từ PO ${order.orderNumber}`,
                });

                // Cập nhật costPrice trong Product
                const itemInfo = order.items.find(
                    (i: any) => i.productId.toString() === receivedItem.productId
                );
                if (itemInfo && itemInfo.unitPrice) {
                    await Product.findByIdAndUpdate(receivedItem.productId, {
                        costPrice: itemInfo.unitPrice,
                    });
                }
            }

            // Cập nhật công nợ supplier
            if (order.supplierId) {
                const { Supplier } = await import("@/models/Supplier");
                await Supplier.findByIdAndUpdate(order.supplierId, {
                    $inc: { totalDebt: order.totalAmount }
                });
            }

            order.notes = notes || order.notes;
            await order.save();

            // Log audit
            await logAudit({
                collectionName: "purchaseorders",
                documentId: id,
                action: "update",
                before: oldOrder,
                after: order.toObject(),
                description: `Nhận hàng PO ${order.orderNumber}`,
                req: request as any,
            });

            return NextResponse.json({
                success: true,
                message: "Nhận hàng thành công",
                data: order
            });
        }

        // CẬP NHẬT THÔNG TIN KHÁC
        if (body.status === 'ordered') {
            order.status = 'ordered';
            order.orderDate = new Date();
        }

        if (body.status === 'cancelled') {
            order.status = 'cancelled';
        }

        await order.save();

        // Log audit
        await logAudit({
            collectionName: "purchaseorders",
            documentId: id,
            action: "update",
            before: oldOrder,
            after: order.toObject(),
            description: `Cập nhật đơn nhập hàng ${order.orderNumber}`,
            req: request as any,
        });

        return NextResponse.json({
            success: true,
            message: "Cập nhật thành công",
            data: order
        });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// DELETE - Delete purchase order
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const order = await PurchaseOrder.findById(id);

        if (!order) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy đơn nhập hàng" },
                { status: 404 }
            );
        }

        // Chỉ cho phép xóa khi status là draft
        if (order.status !== 'draft') {
            return NextResponse.json(
                { success: false, error: "Không thể xóa đơn đã xác nhận" },
                { status: 400 }
            );
        }

        await PurchaseOrder.findByIdAndDelete(id);

        // Log audit
        await logAudit({
            collectionName: "purchaseorders",
            documentId: id,
            action: "delete",
            description: `Xóa đơn nhập hàng ${order.orderNumber}`,
            req: request as any,
        });

        return NextResponse.json({
            success: true,
            message: "Xóa đơn nhập hàng thành công"
        });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
