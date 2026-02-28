import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Promotion } from "@/models/Promotion";

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
        
        let promotion;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            promotion = await Promotion.findById(slug);
        } else {
            promotion = await Promotion.findOne({ slug });
        }
        
        if (!promotion) {
            return NextResponse.json({ success: false, error: "Promotion not found" }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, data: promotion });
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
        
        let promotion;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            promotion = await Promotion.findByIdAndUpdate(slug, body, { new: true });
        } else {
            promotion = await Promotion.findOneAndUpdate({ slug }, body, { new: true });
        }
        
        if (!promotion) {
            return NextResponse.json({ success: false, error: "Promotion not found" }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, data: promotion });
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
        
        let promotion;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            promotion = await Promotion.findByIdAndDelete(slug);
        } else {
            promotion = await Promotion.findOneAndDelete({ slug });
        }
        
        if (!promotion) {
            return NextResponse.json({ success: false, error: "Promotion not found" }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, data: promotion });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
