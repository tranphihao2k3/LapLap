import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Inventory } from "@/models/Inventory";
import { Product } from "@/models/Product";
import { Warehouse } from "@/models/Warehouse";

// GET inventory list
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(request.url);
        const warehouseId = searchParams.get("warehouseId");
        const lowStock = searchParams.get("lowStock");
        const search = searchParams.get("search");
        
        const query: any = {};
        if (warehouseId) query.warehouseId = warehouseId;
        if (lowStock === 'true') {
            query.$expr = { $lte: ["$availableQuantity", "$reorderPoint"] };
        }
        
        let inventoryQuery = Inventory.find(query)
            .populate('productId', 'name sku category')
            .populate('warehouseId', 'name warehouseCode')
            .sort({ createdAt: -1 });
        
        const inventory = await inventoryQuery;
        
        // Filter by search term if provided
        let filteredInventory = inventory;
        if (search) {
            filteredInventory = inventory.filter((item: any) => 
                item.productId?.name?.toLowerCase().includes(search.toLowerCase()) ||
                item.productId?.sku?.toLowerCase().includes(search.toLowerCase())
            );
        }
        
        return NextResponse.json({
            success: true,
            data: filteredInventory,
            count: filteredInventory.length
        });
    } catch (error: any) {
        console.error("Error fetching inventory:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST - Nhập kho / Tạo mới
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        
        const { productId, warehouseId, quantity, minStock, maxStock, reorderPoint } = body;
        
        // Check if inventory already exists for this product-warehouse combination
        const existingInventory = await Inventory.findOne({ productId, warehouseId });
        
        if (existingInventory) {
            // Update existing inventory (nhập thêm)
            existingInventory.quantity += quantity;
            if (minStock !== undefined) existingInventory.minStock = minStock;
            if (maxStock !== undefined) existingInventory.maxStock = maxStock;
            if (reorderPoint !== undefined) existingInventory.reorderPoint = reorderPoint;
            
            await existingInventory.save();
            
            return NextResponse.json({
                success: true,
                message: "Nhập kho thành công",
                data: existingInventory
            });
        }
        
        // Create new inventory record
        const newInventory = await Inventory.create({
            productId,
            warehouseId,
            quantity,
            reservedQuantity: 0,
            minStock: minStock || 0,
            maxStock: maxStock || 0,
            reorderPoint: reorderPoint || 0
        });
        
        return NextResponse.json({
            success: true,
            message: "Tạo tồn kho thành công",
            data: newInventory
        }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating inventory:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
