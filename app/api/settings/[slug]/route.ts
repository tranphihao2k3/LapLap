import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Settings } from "@/models/Settings";

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
        
        const settings = await Settings.findOne({ key: slug });
        
        if (!settings) {
            return NextResponse.json({ success: false, error: "Setting not found" }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, data: settings });
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
        
        const settings = await Settings.findOneAndUpdate(
            { key: slug },
            body,
            { new: true, upsert: true }
        );
        
        return NextResponse.json({ success: true, data: settings });
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
        
        const settings = await Settings.findOneAndDelete({ key: slug });
        
        if (!settings) {
            return NextResponse.json({ success: false, error: "Setting not found" }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, data: settings });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
