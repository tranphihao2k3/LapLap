import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Attendance } from "@/models/Attendance";

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const employeeId = searchParams.get("employeeId");
        const status = searchParams.get("status");
        const dateFrom = searchParams.get("dateFrom");
        const dateTo = searchParams.get("dateTo");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "50");

        const query: Record<string, any> = {};
        if (employeeId) query.employeeId = employeeId;
        if (status) query.status = status;
        if (dateFrom || dateTo) {
            query.date = {};
            if (dateFrom) query.date["$gte"] = new Date(dateFrom);
            if (dateTo) query.date["$lte"] = new Date(dateTo);
        }

        const skip = (page - 1) * limit;
        const total = await Attendance.countDocuments(query);
        const records = await Attendance.find(query)
            .populate("employeeId", "fullName employeeCode")
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        return NextResponse.json({
            success: true,
            data: records,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error: any) {
        console.error("❌ [GET /api/attendance]", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        const record = new Attendance(body);
        await record.save();

        console.log("✅ [POST /api/attendance] Created for employee:", body.employeeId);
        return NextResponse.json({ success: true, data: record }, { status: 201 });
    } catch (error: any) {
        console.error("❌ [POST /api/attendance]", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
