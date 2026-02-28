import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Customer } from "@/models/Customer";

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
        const customerType = searchParams.get("customerType");
        const search = searchParams.get("search");
        
        const query: any = {};
        if (status) query.status = status;
        if (customerType) query.customerType = customerType;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }
        
        const customers = await Customer.find(query)
            .sort({ createdAt: -1 })
            .lean();
        
        return NextResponse.json({
            success: true,
            data: customers
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
        
        // Check if phone already exists
        const existing = await Customer.findOne({ phone: body.phone });
        if (existing) {
            return NextResponse.json({
                success: false,
                error: "Số điện thoại đã tồn tại"
            }, { status: 400 });
        }
        
        const customer = new Customer(body);
        await customer.save();
        
        return NextResponse.json({
            success: true,
            data: customer
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
