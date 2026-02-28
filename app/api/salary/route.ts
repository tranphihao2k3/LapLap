import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Salary } from "@/models/Salary";

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const employeeId = searchParams.get("employeeId");
        const status = searchParams.get("status");
        const month = searchParams.get("month");
        const year = searchParams.get("year");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");

        const query: Record<string, any> = {};
        if (employeeId) query.employeeId = employeeId;
        if (status) query.status = status;
        if (month) query.month = parseInt(month);
        if (year) query.year = parseInt(year);

        const skip = (page - 1) * limit;
        const total = await Salary.countDocuments(query);
        const records = await Salary.find(query)
            .populate("employeeId", "fullName employeeCode")
            .sort({ year: -1, month: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        return NextResponse.json({
            success: true,
            data: records,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error: any) {
        console.error("❌ [GET /api/salary]", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        const record = new Salary(body);
        await record.save();

        console.log("✅ [POST /api/salary] Created for employee:", body.employeeId);
        return NextResponse.json({ success: true, data: record }, { status: 201 });
    } catch (error: any) {
        console.error("❌ [POST /api/salary]", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
