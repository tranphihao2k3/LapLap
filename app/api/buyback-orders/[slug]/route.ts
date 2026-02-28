import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { BuybackOrder } from "@/models/BuybackOrder";

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
        
        let order;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            order = await BuybackOrder.findById(slug).populate("customer", "name phone");
        } else {
            order = await BuybackOrder.findOne({ orderCode: slug }).populate("customer", "name phone");
        }
        
        if (!order) {
            return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, data: order });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
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
        
        let order;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            order = await BuybackOrder.findByIdAndUpdate(slug, body, { new: true });
        } else {
            order = await BuybackOrder.findOneAndUpdate({ orderCode: slug }, body, { new: true });
        }
        
        if (!order) {
            return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, data: order });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;
        
        let order;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            order = await BuybackOrder.findByIdAndDelete(slug);
        } else {
            order = await BuybackOrder.findOneAndDelete({ orderCode: slug });
        }
        
        if (!order) {
            return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, data: order });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
