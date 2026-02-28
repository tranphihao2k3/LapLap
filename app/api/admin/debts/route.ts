import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Debt } from "@/models/Debt";

// GET all debts with filters
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const debtType = searchParams.get("debtType");
        const status = searchParams.get("status");
        const customerId = searchParams.get("customerId");
        const supplierId = searchParams.get("supplierId");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");

        const query: any = {};
        if (debtType) query.debtType = debtType;
        if (status) query.status = status;
        if (customerId) query.customerId = customerId;
        if (supplierId) query.supplierId = supplierId;

        const skip = (page - 1) * limit;
        const total = await Debt.countDocuments(query);
        const debts = await Debt.find(query)
            .populate("customerId", "name phone email")
            .populate("supplierId", "name phone email")
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
        console.error("Error fetching debts:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST - Create new debt
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();

        if (!body.debtType || !body.amount) {
            return NextResponse.json({ success: false, error: "Thiếu thông tin bắt buộc" }, { status: 400 });
        }

        const debt = new Debt(body);
        await debt.save();
        await debt.populate("customerId", "name phone email");
        await debt.populate("supplierId", "name phone email");

        return NextResponse.json({ success: true, data: debt }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating debt:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
