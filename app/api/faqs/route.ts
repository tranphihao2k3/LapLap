import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { FAQ } from "@/models/FAQ";

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
        const category = searchParams.get("category");
        
        const query: any = {};
        if (category) query.category = category;
        
        const faqs = await FAQ.find(query).sort({ order: 1 }).lean();
        
        return NextResponse.json({ success: true, data: faqs });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        
        const body = await request.json();
        
        const faq = new FAQ(body);
        await faq.save();
        
        return NextResponse.json({ success: true, data: faq }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
