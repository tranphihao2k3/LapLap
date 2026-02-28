import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { LoyaltyPoints } from "@/models/LoyaltyPoints";

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const customerId = searchParams.get("customerId");
        const pointsType = searchParams.get("pointsType");
        const orderId = searchParams.get("orderId");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");

        const query: Record<string, any> = {};
        if (customerId) query.customerId = customerId;
        if (pointsType) query.pointsType = pointsType;
        if (orderId) query.orderId = orderId;

        const skip = (page - 1) * limit;
        const total = await LoyaltyPoints.countDocuments(query);
        const records = await LoyaltyPoints.find(query)
            .populate("customerId", "name phone email")
            .populate("orderId", "orderCode totalAmount")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        return NextResponse.json({
            success: true,
            data: records,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error: any) {
        console.error("❌ [GET /api/loyalty-points]", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        const record = new LoyaltyPoints(body);
        await record.save();

        console.log("✅ [POST /api/loyalty-points] Created for customer:", body.customerId);
        return NextResponse.json({ success: true, data: record }, { status: 201 });
    } catch (error: any) {
        console.error("❌ [POST /api/loyalty-points]", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
