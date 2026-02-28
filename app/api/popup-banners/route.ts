import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PopupBanner from "@/models/PopupBanner";

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const isActive = searchParams.get("isActive");

        const query: Record<string, any> = {};
        if (isActive !== null) query.isActive = isActive === "true";

        const banners = await PopupBanner.find(query).sort({ createdAt: -1 }).lean();

        return NextResponse.json({ success: true, data: banners });
    } catch (error: any) {
        console.error("❌ [GET /api/popup-banners]", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        const banner = new PopupBanner(body);
        await banner.save();

        console.log("✅ [POST /api/popup-banners] Created:", banner.title);
        return NextResponse.json({ success: true, data: banner }, { status: 201 });
    } catch (error: any) {
        console.error("❌ [POST /api/popup-banners]", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
