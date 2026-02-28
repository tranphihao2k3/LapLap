import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Attendance } from "@/models/Attendance";

// GET all attendance records with filters
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const employeeId = searchParams.get("employeeId");
        const status = searchParams.get("status");
        const dateFrom = searchParams.get("dateFrom");
        const dateTo = searchParams.get("dateTo");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");

        const query: any = {};
        if (employeeId) query.employeeId = employeeId;
        if (status) query.status = status;
        if (dateFrom || dateTo) {
            query.date = {};
            if (dateFrom) query.date.$gte = new Date(dateFrom);
            if (dateTo) query.date.$lte = new Date(dateTo);
        }

        const skip = (page - 1) * limit;
        const total = await Attendance.countDocuments(query);
        const attendances = await Attendance.find(query)
            .populate("employeeId", "name email position")
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        return NextResponse.json({
            success: true,
            data: attendances,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error: any) {
        console.error("Error fetching attendance:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST - Create new attendance record
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();

        if (!body.employeeId || !body.date) {
            return NextResponse.json({ success: false, error: "Thiếu thông tin bắt buộc" }, { status: 400 });
        }

        const attendance = await Attendance.create(body);
        await attendance.populate("employeeId", "name email position");
        
        return NextResponse.json({ success: true, data: attendance }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating attendance:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
