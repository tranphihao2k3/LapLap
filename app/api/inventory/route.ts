import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Inventory } from "@/models/Inventory";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/laplap";

async function connectDB() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(MONGODB_URI);
    }
}

export async function GET(request: Request) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(request.url);
        const warehouseId = searchParams.get("warehouseId");
        const productId = searchParams.get("productId");
        const lowStock = searchParams.get("lowStock");
        
        const query: any = {};
        if (warehouseId) query.warehouseId = warehouseId;
        if (productId) query.productId = productId;
        if (lowStock === "true") {
            query.$expr = { $lte: ["$quantity", "$minStock"] };
        }
        
        const inventory = await Inventory.find(query)
            .populate({ path: "productId", model: "Product", select: "name slug images" })
            .populate({ path: "warehouseId", model: "Warehouse", select: "name warehouseCode" })
            .sort({ createdAt: -1 })
            .lean();
        
        return NextResponse.json({
            success: true,
            data: inventory
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        
        const body = await request.json();
        
        // Check if inventory already exists for this product + warehouse
        const existing = await Inventory.findOne({
            productId: body.productId,
            warehouseId: body.warehouseId
        });
        
        if (existing) {
            return NextResponse.json({
                success: false,
                error: "Inventory already exists for this product in this warehouse"
            }, { status: 400 });
        }
        
        // Use insertOne to bypass broken pre-save middleware (next is not a function bug)
        const quantity = body.quantity || 0;
        const reservedQuantity = body.reservedQuantity || 0;
        const now = new Date();
        const doc = {
            productId: new mongoose.Types.ObjectId(body.productId),
            warehouseId: new mongoose.Types.ObjectId(body.warehouseId),
            quantity,
            reservedQuantity,
            availableQuantity: quantity - reservedQuantity,
            minStock: body.minStock || 0,
            maxStock: body.maxStock || 0,
            reorderPoint: body.reorderPoint || 0,
            createdAt: now,
            updatedAt: now,
        };
        const result = await Inventory.collection.insertOne(doc);
        
        return NextResponse.json({
            success: true,
            data: { _id: result.insertedId, ...doc }
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
