import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Inventory } from "@/models/Inventory";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/laplap";

async function connectDB() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(MONGODB_URI);
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;
        
        let inventory;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            inventory = await Inventory.findById(slug)
                .populate("product", "name slug images")
                .populate("warehouse", "name warehouseCode");
        } else {
            inventory = await Inventory.findOne({ sku: slug })
                .populate("product", "name slug images")
                .populate("warehouse", "name warehouseCode");
        }
        
        if (!inventory) {
            return NextResponse.json({
                success: false,
                error: "Inventory not found"
            }, { status: 404 });
        }
        
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

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;
        const body = await request.json();
        
        let inventory;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            inventory = await Inventory.findByIdAndUpdate(slug, body, { new: true });
        } else {
            inventory = await Inventory.findOneAndUpdate({ sku: slug }, body, { new: true });
        }
        
        if (!inventory) {
            return NextResponse.json({
                success: false,
                error: "Inventory not found"
            }, { status: 404 });
        }
        
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

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;
        
        let inventory;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            inventory = await Inventory.findByIdAndDelete(slug);
        } else {
            inventory = await Inventory.findOneAndDelete({ sku: slug });
        }
        
        if (!inventory) {
            return NextResponse.json({
                success: false,
                error: "Inventory not found"
            }, { status: 404 });
        }
        
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
