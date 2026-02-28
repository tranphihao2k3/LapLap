import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Warehouse } from "@/models/Warehouse";

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
        
        let warehouse;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            warehouse = await Warehouse.findById(slug);
        } else {
            warehouse = await Warehouse.findOne({ warehouseCode: slug });
        }
        
        if (!warehouse) {
            return NextResponse.json({
                success: false,
                error: "Warehouse not found"
            }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true,
            data: warehouse
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
        
        let warehouse;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            warehouse = await Warehouse.findByIdAndUpdate(slug, body, { new: true });
        } else {
            warehouse = await Warehouse.findOneAndUpdate({ warehouseCode: slug }, body, { new: true });
        }
        
        if (!warehouse) {
            return NextResponse.json({
                success: false,
                error: "Warehouse not found"
            }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true,
            data: warehouse
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
        
        let warehouse;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            warehouse = await Warehouse.findByIdAndDelete(slug);
        } else {
            warehouse = await Warehouse.findOneAndDelete({ warehouseCode: slug });
        }
        
        if (!warehouse) {
            return NextResponse.json({
                success: false,
                error: "Warehouse not found"
            }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true,
            data: warehouse
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
