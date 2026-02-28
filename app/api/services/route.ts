import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Service } from "@/models/Service";
import "@/models/Customer";   // register for populate
import "@/models/Employee";   // register for populate

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
        const serviceType = searchParams.get("type");
        
        const query: any = {};
        if (status) query.status = status;
        if (serviceType) query.serviceType = serviceType;
        
        const services = await Service.find(query)
            .populate("customerId", "name phone")
            .populate("technicianId", "firstName lastName")
            .sort({ createdAt: -1 })
            .lean();
        
        return NextResponse.json({
            success: true,
            data: services
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
        
        // Generate service number
        const count = await Service.countDocuments();
        const serviceNumber = `SRV${Date.now()}${String(count + 1).padStart(4, "0")}`;
        
        const service = new Service({
            ...body,
            serviceNumber
        });
        
        await service.save();
        
        return NextResponse.json({
            success: true,
            data: service
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
