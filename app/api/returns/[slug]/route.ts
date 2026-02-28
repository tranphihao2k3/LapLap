import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Return } from "@/models/Return";

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
        
        let returnRecord;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            returnRecord = await Return.findById(slug)
                .populate("order", "orderCode total")
                .populate("customer", "name phone")
                .populate("items.product", "name images");
        } else {
            returnRecord = await Return.findOne({ returnCode: slug })
                .populate("order", "orderCode total")
                .populate("customer", "name phone")
                .populate("items.product", "name images");
        }
        
        if (!returnRecord) {
            return NextResponse.json({
                success: false,
                error: "Return not found"
            }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true,
            data: returnRecord
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
        
        let returnRecord;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            returnRecord = await Return.findByIdAndUpdate(slug, body, { new: true });
        } else {
            returnRecord = await Return.findOneAndUpdate({ returnCode: slug }, body, { new: true });
        }
        
        if (!returnRecord) {
            return NextResponse.json({
                success: false,
                error: "Return not found"
            }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true,
            data: returnRecord
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
        
        let returnRecord;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            returnRecord = await Return.findByIdAndDelete(slug);
        } else {
            returnRecord = await Return.findOneAndDelete({ returnCode: slug });
        }
        
        if (!returnRecord) {
            return NextResponse.json({
                success: false,
                error: "Return not found"
            }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true,
            data: returnRecord
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
