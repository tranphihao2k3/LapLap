import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Transaction } from "@/models/Transaction";

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
        const type = searchParams.get("type");
        const paymentMethod = searchParams.get("paymentMethod");
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");
        
        const query: any = {};
        if (type) query.type = type;
        if (paymentMethod) query.paymentMethod = paymentMethod;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }
        
        const transactions = await Transaction.find(query)
            .populate("order", "orderCode total")
            .populate("customer", "name phone")
            .sort({ createdAt: -1 })
            .lean();
        
        return NextResponse.json({
            success: true,
            data: transactions
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
        
        // Generate transaction code
        const count = await Transaction.countDocuments();
        const transactionCode = `TXN${Date.now()}${String(count + 1).padStart(4, "0")}`;
        
        const transaction = new Transaction({
            ...body,
            transactionCode
        });
        
        await transaction.save();
        
        return NextResponse.json({
            success: true,
            data: transaction
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
