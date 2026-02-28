import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Debt } from "@/models/Debt";

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const debtType = searchParams.get("debtType");
        const status = searchParams.get("status");
        const customerId = searchParams.get("customerId");
        const supplierId = searchParams.get("supplierId");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");

        const query: Record<string, any> = {};
        if (debtType) query.debtType = debtType;
        if (status) query.status = status;
        if (customerId) query.customerId = customerId;
        if (supplierId) query.supplierId = supplierId;

        const skip = (page - 1) * limit;
        const total = await Debt.countDocuments(query);
        const debts = await Debt.find(query)
            .populate("customerId", "name phone")
            .populate("supplierId", "name contactPerson")
            .populate("orderId", "orderCode totalAmount")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        return NextResponse.json({
            success: true,
            data: debts,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error: any) {
        console.error("❌ [GET /api/debts]", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        const debt = new Debt(body);
        await debt.save();

        console.log("✅ [POST /api/debts] Created:", debt._id);
        return NextResponse.json({ success: true, data: debt }, { status: 201 });
    } catch (error: any) {
        console.error("❌ [POST /api/debts]", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
