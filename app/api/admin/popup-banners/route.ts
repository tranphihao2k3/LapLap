import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PopupBanner from "@/models/PopupBanner";

// GET all popup banners with filters

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");

        const query: any = {};
        if (status) query.status = status;

        const skip = (page - 1) * limit;
        const total = await PopupBanner.countDocuments(query);
        const banners = await PopupBanner.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        return NextResponse.json({
            success: true,
            data: banners,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error: any) {
        console.error("Error fetching popup banners:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST - Create new popup banner
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();

        if (!body.title) {
            return NextResponse.json({ success: false, error: "Thiếu tiêu đề" }, { status: 400 });
        }

        const banner = await PopupBanner.create(body);
        return NextResponse.json({ success: true, data: banner }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating popup banner:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
