import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Supplier } from "@/models/Supplier";

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
        
        const suppliers = await Supplier.find(query)
            .sort({ createdAt: -1 })
            .lean();
        
        return NextResponse.json({
            success: true,
            data: suppliers
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
        
        const supplier = new Supplier(body);
        await supplier.save();
        
        return NextResponse.json({
            success: true,
            data: supplier
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
