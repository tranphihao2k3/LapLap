import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Settings } from "@/models/Settings";

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
        const key = searchParams.get("key");
        
        let settings;
        if (key) {
            settings = await Settings.findOne({ key });
        } else {
            settings = await Settings.find().lean();
        }
        
        return NextResponse.json({
            success: true,
            data: settings
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
        
        const settings = new Settings(body);
        await settings.save();
        
        return NextResponse.json({
            success: true,
            data: settings
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
