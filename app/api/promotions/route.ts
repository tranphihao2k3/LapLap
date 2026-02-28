import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Promotion } from "@/models/Promotion";

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
        const active = searchParams.get("active");
        
        const query: any = {};
        if (active === "true") {
            const now = new Date();
            query.startDate = { $lte: now };
            query.endDate = { $gte: now };
            query.isActive = true;
        }
        
        const promotions = await Promotion.find(query)
            .sort({ createdAt: -1 })
            .lean();
        
        return NextResponse.json({
            success: true,
            data: promotions
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
        
        const promotion = new Promotion(body);
        await promotion.save();
        
        return NextResponse.json({
            success: true,
            data: promotion
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
