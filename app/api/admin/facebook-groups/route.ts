import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { FacebookGroup } from "@/models/FacebookGroup";

// GET all facebook groups with filters
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
        const total = await FacebookGroup.countDocuments(query);
        const groups = await FacebookGroup.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        return NextResponse.json({
            success: true,
            data: groups,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error: any) {
        console.error("Error fetching facebook groups:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST - Create new facebook group
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();

        if (!body.name || !body.groupId) {
            return NextResponse.json({ success: false, error: "Thiếu thông tin bắt buộc" }, { status: 400 });
        }

        const group = await FacebookGroup.create(body);
        return NextResponse.json({ success: true, data: group }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating facebook group:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
