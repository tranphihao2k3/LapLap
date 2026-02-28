import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Customer } from "@/models/Customer";

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
        
        let customer;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            customer = await Customer.findById(slug).populate("orders");
        } else {
            customer = await Customer.findOne({ phone: slug }).populate("orders");
        }
        
        if (!customer) {
            return NextResponse.json({
                success: false,
                error: "Customer not found"
            }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true,
            data: customer
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
        
        let customer;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            customer = await Customer.findByIdAndUpdate(slug, body, { new: true });
        } else {
            customer = await Customer.findOneAndUpdate({ phone: slug }, body, { new: true });
        }
        
        if (!customer) {
            return NextResponse.json({
                success: false,
                error: "Customer not found"
            }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true,
            data: customer
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
        
        let customer;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            customer = await Customer.findByIdAndDelete(slug);
        } else {
            customer = await Customer.findOneAndDelete({ phone: slug });
        }
        
        if (!customer) {
            return NextResponse.json({
                success: false,
                error: "Customer not found"
            }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true,
            data: customer
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
