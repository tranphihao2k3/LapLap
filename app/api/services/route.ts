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

        // Generate service number - more robust
        const timestamp = Date.now().toString().slice(-6);
        const count = await Service.countDocuments();
        const serviceNumber = `SRV${timestamp}${String(count + 1).padStart(4, "0")}`;

        const service = new Service({
            ...body,
            serviceNumber
        });

        await service.save();

        // --- Side Effects (Server-side) ---
        // We trigger these but don't strictly wait for them to blocking the response
        // though in a serverless environment, we should try to ensure they finish.
        const origin = new URL(request.url).origin;

        // 1. Send Email
        fetch(`${origin}/api/send-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: body.serviceType || "repair",
                name: body.customerName,
                contact: body.customerPhone,
                model: `${body.productInfo?.brand || ""} ${body.productInfo?.model || ""}`.trim(),
                issue: body.issueDescription,
                notes: body.notes,
                images: body.images || []
            }),
        }).catch(err => console.error("Server-side email error:", err));

        // 2. Create Notification
        fetch(`${origin}/api/admin/notifications`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: "service",
                title: `Sửa chữa mới: ${body.productInfo?.model || "Máy khách"}`,
                message: `${body.customerName} (${body.customerPhone}) yêu cầu ${body.serviceType === 'repair' ? 'sửa' : 'dịch vụ'}: ${body.issueDescription?.substring(0, 100)}`,
                priority: body.priority === 'urgent' ? 'high' : 'normal',
                referenceType: "Service",
                referenceId: service._id,
            }),
        }).catch(err => console.error("Server-side notification error:", err));

        return NextResponse.json({
            success: true,
            data: service
        }, { status: 201 });
    } catch (error: any) {
        console.error("API Services POST Error:", error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
