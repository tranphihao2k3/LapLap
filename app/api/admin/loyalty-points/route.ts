import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { LoyaltyPoints } from "@/models/LoyaltyPoints";

// GET all loyalty points records with filters
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const customerId = searchParams.get("customerId");
        const pointsType = searchParams.get("pointsType");
        const orderId = searchParams.get("orderId");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");

        const query: any = {};
        if (customerId) query.customerId = customerId;
        if (pointsType) query.pointsType = pointsType;
        if (orderId) query.orderId = orderId;

        const skip = (page - 1) * limit;
        const total = await LoyaltyPoints.countDocuments(query);
        const records = await LoyaltyPoints.find(query)
            .populate("customerId", "name phone email")
            .populate("orderId", "orderNumber total")
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
        console.error("Error fetching loyalty points:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST - Create new loyalty points record
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();

        if (!body.customerId || !body.points) {
            return NextResponse.json({ success: false, error: "Thiếu thông tin bắt buộc" }, { status: 400 });
        }

        const record = await LoyaltyPoints.create(body);
        await record.populate("customerId", "name phone email");
        
        return NextResponse.json({ success: true, data: record }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating loyalty points:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
