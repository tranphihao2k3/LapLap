import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Notification } from "@/models/Notification";

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
        
        let notification;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            notification = await Notification.findById(slug);
        } else {
            notification = await Notification.findOne({ slug });
        }
        
        if (!notification) {
            return NextResponse.json({ success: false, error: "Notification not found" }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, data: notification });
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
        
        let notification;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            notification = await Notification.findByIdAndUpdate(slug, body, { new: true });
        } else {
            notification = await Notification.findOneAndUpdate({ slug }, body, { new: true });
        }
        
        if (!notification) {
            return NextResponse.json({ success: false, error: "Notification not found" }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, data: notification });
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
        
        let notification;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            notification = await Notification.findByIdAndDelete(slug);
        } else {
            notification = await Notification.findOneAndDelete({ slug });
        }
        
        if (!notification) {
            return NextResponse.json({ success: false, error: "Notification not found" }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, data: notification });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
