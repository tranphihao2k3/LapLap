import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Transaction } from "@/models/Transaction";

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
        
        let transaction;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            transaction = await Transaction.findById(slug)
                .populate("customerId", "name phone")
                .populate("supplierId", "name phone")
                .populate("employeeId", "firstName lastName");
        } else {
            transaction = await Transaction.findOne({ transactionCode: slug })
                .populate("customerId", "name phone")
                .populate("supplierId", "name phone")
                .populate("employeeId", "firstName lastName");
        }
        
        if (!transaction) {
            return NextResponse.json({
                success: false,
                error: "Transaction not found"
            }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true,
            data: transaction
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
        
        let transaction;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            transaction = await Transaction.findByIdAndUpdate(slug, body, { new: true });
        } else {
            transaction = await Transaction.findOneAndUpdate({ transactionCode: slug }, body, { new: true });
        }
        
        if (!transaction) {
            return NextResponse.json({
                success: false,
                error: "Transaction not found"
            }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true,
            data: transaction
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
        
        let transaction;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            transaction = await Transaction.findByIdAndDelete(slug);
        } else {
            transaction = await Transaction.findOneAndDelete({ transactionCode: slug });
        }
        
        if (!transaction) {
            return NextResponse.json({
                success: false,
                error: "Transaction not found"
            }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true,
            data: transaction
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
