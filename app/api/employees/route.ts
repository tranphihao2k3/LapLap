import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Employee } from "@/models/Employee";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/laplap";

async function connectDB() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(MONGODB_URI);
    }
}

export async function GET(request: Request) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const position = searchParams.get("position");
        const department = searchParams.get("department");
        
        const query: any = {};
        if (status) query.status = status;
        if (position) query.position = position;
        if (department) query.department = department;
        
        const employees = await Employee.find(query)
            .sort({ createdAt: -1 })
            .lean();
        
        return NextResponse.json({
            success: true,
            data: employees
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        
        const body = await request.json();
        
        // Generate employee code
        const count = await Employee.countDocuments();
        const employeeCode = `EMP${String(count + 1).padStart(4, "0")}`;
        
        const employee = new Employee({
            ...body,
            employeeCode
        });
        
        await employee.save();
        
        return NextResponse.json({
            success: true,
            data: employee
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
