import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Banner } from "@/models/Banner";

// GET all banners
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(request.url);
        const position = searchParams.get("position");
        const status = searchParams.get("status");
        
        const query: any = {};
        if (position) query.position = position;
        if (status) query.status = status;
        
        const banners = await Banner.find(query).sort({ order: 1, createdAt: -1 });
        
        return NextResponse.json({
            success: true,
            data: banners
        });
    } catch (error: any) {
        console.error("Error fetching banners:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST create new banner
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        
        // Validation
        if (!body.title || !body.image) {
            return NextResponse.json(
                { success: false, error: "Thiếu thông tin bắt buộc" },
                { status: 400 }
            );
        }
        
        const banner = await Banner.create(body);
        
        return NextResponse.json({
            success: true,
            message: "Tạo banner thành công",
            data: banner
        }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating banner:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
