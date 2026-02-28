import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { FAQ } from "@/models/FAQ";

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
        
        const faq = await FAQ.findById(slug);
        
        if (!faq) {
            return NextResponse.json({ success: false, error: "FAQ not found" }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, data: faq });
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
        
        const faq = await FAQ.findByIdAndUpdate(slug, body, { new: true });
        
        if (!faq) {
            return NextResponse.json({ success: false, error: "FAQ not found" }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, data: faq });
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
        
        const faq = await FAQ.findByIdAndDelete(slug);
        
        if (!faq) {
            return NextResponse.json({ success: false, error: "FAQ not found" }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, data: faq });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
