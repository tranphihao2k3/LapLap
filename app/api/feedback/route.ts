import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Feedback } from "@/models/Feedback";

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const type = searchParams.get("type");
        const search = searchParams.get("search");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");

        const query: Record<string, any> = {};
        if (status) query.status = status;
        if (type) query.type = type;
        if (search) {
            query["$or"] = [
                { customerName: { $regex: search, $options: "i" } },
                { customerEmail: { $regex: search, $options: "i" } },
                { customerPhone: { $regex: search, $options: "i" } },
                { subject: { $regex: search, $options: "i" } },
            ];
        }

        const skip = (page - 1) * limit;
        const total = await Feedback.countDocuments(query);
        const feedbacks = await Feedback.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        return NextResponse.json({
            success: true,
            data: feedbacks,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error: any) {
        console.error("❌ [GET /api/feedback]", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        const feedback = new Feedback(body);
        await feedback.save();

        console.log("✅ [POST /api/feedback] Created from:", body.customerName);
        return NextResponse.json({ success: true, data: feedback }, { status: 201 });
    } catch (error: any) {
        console.error("❌ [POST /api/feedback]", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
