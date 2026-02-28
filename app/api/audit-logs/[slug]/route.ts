import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { AuditLog } from "@/models/AuditLog";

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
        
        const log = await AuditLog.findById(slug);
        
        if (!log) {
            return NextResponse.json({ success: false, error: "Audit log not found" }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, data: log });
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
        
        const log = await AuditLog.findByIdAndDelete(slug);
        
        if (!log) {
            return NextResponse.json({ success: false, error: "Audit log not found" }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, data: log });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
