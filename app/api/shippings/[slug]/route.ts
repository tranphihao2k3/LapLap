import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Shipping } from "@/models/Shipping";

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
        
        let shipping;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            shipping = await Shipping.findById(slug).populate("order", "orderCode");
        } else {
            shipping = await Shipping.findOne({ trackingNumber: slug }).populate("order", "orderCode");
        }
        
        if (!shipping) {
            return NextResponse.json({ success: false, error: "Shipping not found" }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, data: shipping });
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
        
        let shipping;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            shipping = await Shipping.findByIdAndUpdate(slug, body, { new: true });
        } else {
            shipping = await Shipping.findOneAndUpdate({ trackingNumber: slug }, body, { new: true });
        }
        
        if (!shipping) {
            return NextResponse.json({ success: false, error: "Shipping not found" }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, data: shipping });
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
        
        let shipping;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            shipping = await Shipping.findByIdAndDelete(slug);
        } else {
            shipping = await Shipping.findOneAndDelete({ trackingNumber: slug });
        }
        
        if (!shipping) {
            return NextResponse.json({ success: false, error: "Shipping not found" }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, data: shipping });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
