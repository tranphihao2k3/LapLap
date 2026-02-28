import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Inventory } from "@/models/Inventory";
import { logAudit } from "@/lib/audit";

// GET single inventory
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        
        const inventory = await Inventory.findById(id)
            .populate('productId', 'name sku category')
            .populate('warehouseId', 'name warehouseCode');
        
        if (!inventory) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy tồn kho" },
                { status: 404 }
            );
        }
        
        return NextResponse.json({
            success: true,
            data: inventory
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// PUT - Cập nhật tồn kho / Xuất kho
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();
        
        // Get old data for audit
        const oldInventory = await Inventory.findById(id).lean();
        
        const { quantity, reservedQuantity, minStock, maxStock, reorderPoint, type, exportQuantity } = body;
        
        const inventory = await Inventory.findById(id);
        
        if (!inventory) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy tồn kho" },
                { status: 404 }
            );
        }
        
        // Handle export (xuất kho)
        if (type === 'export' && exportQuantity) {
            if (inventory.availableQuantity < exportQuantity) {
                return NextResponse.json(
                    { success: false, error: "Số lượng tồn kho không đủ để xuất" },
                    { status: 400 }
                );
            }
            inventory.quantity -= exportQuantity;
        }
        
        // Handle import (nhập thêm)
        if (type === 'import' && quantity) {
            inventory.quantity += quantity;
        }
        
        // Update other fields
        if (minStock !== undefined) inventory.minStock = minStock;
        if (maxStock !== undefined) inventory.maxStock = maxStock;
        if (reorderPoint !== undefined) inventory.reorderPoint = reorderPoint;
        if (reservedQuantity !== undefined) inventory.reservedQuantity = reservedQuantity;
        
        await inventory.save();
        
        // Log audit
        const actionType = type === 'export' ? 'xuất kho' : (type === 'import' ? 'nhập kho' : 'cập nhật');
        await logAudit({
            collectionName: "inventory",
            documentId: id,
            action: "update",
            before: oldInventory,
            after: inventory.toObject(),
            description: `${actionType}: ${inventory.productId || id}`,
            req: request as any,
        });
        
        return NextResponse.json({
            success: true,
            message: type === 'export' ? "Xuất kho thành công" : "Cập nhật tồn kho thành công",
            data: inventory
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// DELETE inventory record
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try {
        await connectDB();
        const { id } = await params;
        
        // Get inventory for audit before delete
        const inventory = await Inventory.findById(id).lean();
        
        if (!inventory) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy tồn kho" },
                { status: 404 }
            );
        }
        
        await Inventory.findByIdAndDelete(id);
        
        // Log audit
        await logAudit({
            collectionName: "inventory",
            documentId: id,
            action: "delete",
            before: inventory,
            description: `Xóa tồn kho: ${inventory.productId || id}`,
            req: request as any,
        });
        
        return NextResponse.json({
            success: true,
            message: "Xóa tồn kho thành công"
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
