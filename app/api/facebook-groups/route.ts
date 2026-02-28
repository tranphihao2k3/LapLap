import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { FacebookGroup } from "@/models/FacebookGroup";

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const isActive = searchParams.get("isActive");

        const query: Record<string, any> = {};
        if (isActive !== null) query.isActive = isActive === "true";

        const groups = await FacebookGroup.find(query).sort({ order: 1 }).lean();

        return NextResponse.json({ success: true, data: groups });
    } catch (error: any) {
        console.error("❌ [GET /api/facebook-groups]", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        const group = new FacebookGroup(body);
        await group.save();

        console.log("✅ [POST /api/facebook-groups] Created:", group.name);
        return NextResponse.json({ success: true, data: group }, { status: 201 });
    } catch (error: any) {
        console.error("❌ [POST /api/facebook-groups]", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
