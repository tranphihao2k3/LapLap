import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Transaction } from "@/models/Transaction";

// GET transactions with filters
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type");
        const category = searchParams.get("category");
        const fromDate = searchParams.get("fromDate");
        const toDate = searchParams.get("toDate");
        const limit = parseInt(searchParams.get("limit") || "50");
        
        const query: any = {};
        if (type) query.transactionType = type;
        if (category) query.category = category;
        if (fromDate || toDate) {
            query.createdAt = {};
            if (fromDate) query.createdAt.$gte = new Date(fromDate);
            if (toDate) query.createdAt.$lte = new Date(toDate);
        }
        
        const transactions = await Transaction.find(query)
            .populate('customerId', 'name phone')
            .populate('supplierId', 'name')
            .populate('employeeId', 'name')
            .sort({ createdAt: -1 })
            .limit(limit);
        
        // Calculate totals
        const incomeTotal = await Transaction.aggregate([
            { $match: { transactionType: 'income', ...query } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        
        const expenseTotal = await Transaction.aggregate([
            { $match: { transactionType: 'expense', ...query } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        
        return NextResponse.json({
            success: true,
            data: transactions,
            stats: {
                income: incomeTotal[0]?.total || 0,
                expense: expenseTotal[0]?.total || 0,
                balance: (incomeTotal[0]?.total || 0) - (expenseTotal[0]?.total || 0)
            }
        });
    } catch (error: any) {
        console.error("Error fetching transactions:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST create transaction
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        
        const {
            transactionType,
            category,
            amount,
            paymentMethod,
            description,
            notes,
            customerId,
            supplierId,
            employeeId,
            referenceType,
            referenceId
        } = body;
        
        const transaction = await Transaction.create({
            transactionType,
            category,
            amount,
            paymentMethod: paymentMethod || 'cash',
            description,
            notes,
            customerId,
            supplierId,
            employeeId,
            referenceType,
            referenceId
        });
        
        return NextResponse.json({
            success: true,
            message: transactionType === 'income' ? "Ghi thu thành công" : "Ghi chi thành công",
            data: transaction
        }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating transaction:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
