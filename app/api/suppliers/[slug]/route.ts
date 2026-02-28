import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Supplier } from "@/models/Supplier";

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
        
        let supplier;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            supplier = await Supplier.findById(slug);
        } else {
            supplier = await Supplier.findOne({ supplierCode: slug });
        }
        
        if (!supplier) {
            return NextResponse.json({
                success: false,
                error: "Supplier not found"
            }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true,
            data: supplier
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
        
        let supplier;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            supplier = await Supplier.findByIdAndUpdate(slug, body, { new: true });
        } else {
            supplier = await Supplier.findOneAndUpdate({ supplierCode: slug }, body, { new: true });
        }
        
        if (!supplier) {
            return NextResponse.json({
                success: false,
                error: "Supplier not found"
            }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true,
            data: supplier
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
        
        let supplier;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            supplier = await Supplier.findByIdAndDelete(slug);
        } else {
            supplier = await Supplier.findOneAndDelete({ supplierCode: slug });
        }
        
        if (!supplier) {
            return NextResponse.json({
                success: false,
                error: "Supplier not found"
            }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true,
            data: supplier
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
