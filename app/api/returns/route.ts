import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Return } from "@/models/Return";

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
        const status = searchParams.get("status");
        
        const query: any = {};
        if (status) query.status = status;
        
        const returns = await Return.find(query)
            .populate("orderId", "orderCode total")
            .populate("customerId", "name phone")
            .sort({ createdAt: -1 })
            .lean();
        
        return NextResponse.json({
            success: true,
            data: returns
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
        
        // Generate return number (field name matches model: returnNumber)
        const count = await Return.countDocuments();
        const returnNumber = `RET${Date.now()}${String(count + 1).padStart(4, "0")}`;
        
        const returnRecord = new Return({
            ...body,
            returnNumber
        });
        
        await returnRecord.save();
        
        return NextResponse.json({
            success: true,
            data: returnRecord
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
