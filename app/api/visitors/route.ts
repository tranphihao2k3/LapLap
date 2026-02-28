import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Visitor } from "@/models/Visitor";

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const label = searchParams.get("label");

        const query: Record<string, any> = {};
        if (label) query.label = label;

        const visitors = await Visitor.find(query).sort({ createdAt: -1 }).lean();

        return NextResponse.json({ success: true, data: visitors });
    } catch (error: any) {
        console.error("❌ [GET /api/visitors]", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const { label } = body;

        // Upsert: increment count for the given label
        const visitor = await Visitor.findOneAndUpdate(
            { label: label || "unique" },
            { $inc: { count: 1 } },
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, data: visitor }, { status: 201 });
    } catch (error: any) {
        console.error("❌ [POST /api/visitors]", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
