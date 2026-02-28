import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Service } from "@/models/Service";

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
        
        let service;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            service = await Service.findById(slug)
                .populate("customerId", "name phone")
                .populate("technicianId", "firstName lastName");
        } else {
            service = await Service.findOne({ serviceNumber: slug })
                .populate("customerId", "name phone")
                .populate("technicianId", "firstName lastName");
        }
        
        if (!service) {
            return NextResponse.json({
                success: false,
                error: "Service not found"
            }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true,
            data: service
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
        
        let service;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            service = await Service.findByIdAndUpdate(slug, body, { new: true });
        } else {
            service = await Service.findOneAndUpdate({ serviceNumber: slug }, body, { new: true });
        }
        
        if (!service) {
            return NextResponse.json({
                success: false,
                error: "Service not found"
            }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true,
            data: service
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
        
        let service;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            service = await Service.findByIdAndDelete(slug);
        } else {
            service = await Service.findOneAndDelete({ serviceNumber: slug });
        }
        
        if (!service) {
            return NextResponse.json({
                success: false,
                error: "Service not found"
            }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true,
            data: service
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
