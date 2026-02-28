import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Notification } from "@/models/Notification";

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
        const isRead = searchParams.get("isRead");
        const type = searchParams.get("type");
        
        const query: any = {};
        if (isRead !== null) query.isRead = isRead === "true";
        if (type) query.type = type;
        
        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .lean();
        
        return NextResponse.json({
            success: true,
            data: notifications
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
        
        const notification = new Notification(body);
        await notification.save();
        
        return NextResponse.json({
            success: true,
            data: notification
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
