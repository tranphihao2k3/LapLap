import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { AuditLog } from "@/models/AuditLog";

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
        const action = searchParams.get("action");
        const userId = searchParams.get("userId");
        
        const query: any = {};
        if (action) query.action = action;
        if (userId) query.userId = userId;
        
        const logs = await AuditLog.find(query)
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();
        
        return NextResponse.json({
            success: true,
            data: logs
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
        
        const log = new AuditLog(body);
        await log.save();
        
        return NextResponse.json({
            success: true,
            data: log
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
