import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Employee } from "@/models/Employee";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/laplap";

async function connectDB() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(MONGODB_URI);
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;
        
        // Find by ID or employeeCode
        let employee;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            employee = await Employee.findById(slug);
        } else {
            employee = await Employee.findOne({ employeeCode: slug });
        }
        
        if (!employee) {
            return NextResponse.json({
                success: false,
                error: "Employee not found"
            }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true,
            data: employee
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;
        const body = await request.json();
        
        let employee;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            employee = await Employee.findByIdAndUpdate(slug, body, { new: true });
        } else {
            employee = await Employee.findOneAndUpdate({ employeeCode: slug }, body, { new: true });
        }
        
        if (!employee) {
            return NextResponse.json({
                success: false,
                error: "Employee not found"
            }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true,
            data: employee
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;
        
        let employee;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            employee = await Employee.findByIdAndDelete(slug);
        } else {
            employee = await Employee.findOneAndDelete({ employeeCode: slug });
        }
        
        if (!employee) {
            return NextResponse.json({
                success: false,
                error: "Employee not found"
            }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true,
            data: employee
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
