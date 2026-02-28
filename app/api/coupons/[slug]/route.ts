import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Coupon } from "@/models/Coupon";

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
        
        const coupon = await Coupon.findOne({ code: slug.toUpperCase() });
        
        if (!coupon) {
            return NextResponse.json({
                success: false,
                error: "Coupon not found"
            }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true,
            data: coupon
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
        
        const coupon = await Coupon.findOneAndUpdate(
            { code: slug.toUpperCase() },
            body,
            { new: true }
        );
        
        if (!coupon) {
            return NextResponse.json({
                success: false,
                error: "Coupon not found"
            }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true,
            data: coupon
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
        
        const coupon = await Coupon.findOneAndDelete({ code: slug.toUpperCase() });
        
        if (!coupon) {
            return NextResponse.json({
                success: false,
                error: "Coupon not found"
            }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true,
            data: coupon
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
