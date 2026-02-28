import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Salary } from "@/models/Salary";

// GET all salary records with filters
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const employeeId = searchParams.get("employeeId");
        const status = searchParams.get("status");
        const month = searchParams.get("month");
        const year = searchParams.get("year");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");

        const query: any = {};
        if (employeeId) query.employeeId = employeeId;
        if (status) query.status = status;
        if (month) query.month = parseInt(month);
        if (year) query.year = parseInt(year);

        const skip = (page - 1) * limit;
        const total = await Salary.countDocuments(query);
        const salaries = await Salary.find(query)
            .populate("employeeId", "name email position baseSalary")
            .sort({ year: -1, month: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        return NextResponse.json({
            success: true,
            data: salaries,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error: any) {
        console.error("Error fetching salaries:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST - Create new salary record
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();

        if (!body.employeeId || !body.month || !body.year) {
            return NextResponse.json({ success: false, error: "Thiếu thông tin bắt buộc" }, { status: 400 });
        }

        const salary = await Salary.create(body);
        await salary.populate("employeeId", "name email position baseSalary");
        
        return NextResponse.json({ success: true, data: salary }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating salary:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
