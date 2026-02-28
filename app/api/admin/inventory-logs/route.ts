import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { InventoryLog } from "@/models/InventoryLog";

// GET - List inventory logs
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type");
        const productId = searchParams.get("productId");
        const warehouseId = searchParams.get("warehouseId");
        const referenceType = searchParams.get("referenceType");
        
        const query: any = {};
        if (type) query.type = type;
        if (productId) query.productId = productId;
        if (warehouseId) query.warehouseId = warehouseId;
        if (referenceType) query.referenceType = referenceType;
        
        const logs = await InventoryLog.find(query)
            .populate('productId', 'name model')
            .populate('warehouseId', 'name')
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 })
            .limit(500)
            .lean();
        
        return NextResponse.json({
            success: true,
            data: logs,
            count: logs.length
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST - Manual inventory adjustment
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        
        const { productId, warehouseId, quantity, type, notes } = body;
        
        // Get current inventory
        const { Inventory } = await import("@/models/Inventory");
        const inventory = await Inventory.findOne({ productId, warehouseId });
        
        const quantityBefore = inventory?.quantity || 0;
        let quantityAfter = quantityBefore;
        
        // Calculate new quantity based on type
        if (type === 'IN' || type === 'RETURN') {
            quantityAfter = quantityBefore + quantity;
        } else if (type === 'OUT') {
            quantityAfter = quantityBefore - quantity;
        } else if (type === 'ADJUST') {
            quantityAfter = quantity;
        }
        
        // Update or create inventory
        if (inventory) {
            await Inventory.findByIdAndUpdate(inventory._id, {
                quantity: quantityAfter,
                availableQuantity: quantityAfter,
            });
        } else {
            await Inventory.create({
                productId,
                warehouseId,
                quantity: quantityAfter,
                availableQuantity: quantityAfter,
            });
        }
        
        // Create log
        const log = await InventoryLog.create({
            type,
            productId,
            warehouseId,
            quantity,
            quantityBefore,
            quantityAfter,
            referenceType: 'adjustment',
            notes: notes || 'Điều chỉnh thủ công',
        });
        
        return NextResponse.json({
            success: true,
            message: "Điều chỉnh kho thành công",
            data: log
        }, { status: 201 });
        
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
