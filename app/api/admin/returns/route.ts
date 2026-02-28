import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Return } from "@/models/Return";

// Generate return number: RTYYMMXXXX
function generateReturnNumber(): string {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `RT${year}${month}${random}`;
}

// GET returns list
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const returnType = searchParams.get("returnType");
        const search = searchParams.get("search");
        
        const query: any = {};
        if (status) query.status = status;
        if (returnType) query.returnType = returnType;
        
        let returns = await Return.find(query)
            .populate('orderId', 'orderNumber totalAmount')
            .populate('customerId', 'name phone')
            .populate('processedBy', 'name')
            .sort({ createdAt: -1 });
        
        // Filter by search term
        if (search) {
            returns = returns.filter((r: any) => 
                r.returnNumber?.toLowerCase().includes(search.toLowerCase()) ||
                r.customerId?.name?.toLowerCase().includes(search.toLowerCase()) ||
                r.orderId?.orderNumber?.toLowerCase().includes(search.toLowerCase())
            );
        }
        
        return NextResponse.json({
            success: true,
            data: returns,
            count: returns.length
        });
    } catch (error: any) {
        console.error("Error fetching returns:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST create return
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        
        const {
            orderId,
            customerId,
            returnType,
            reason,
            refundAmount,
            refundMethod,
            notes
        } = body;
        
        const returnNumber = generateReturnNumber();
        
        const newReturn = await Return.create({
            returnNumber,
            orderId,
            customerId,
            returnType,
            reason,
            refundAmount: refundAmount || 0,
            refundMethod: refundMethod || '',
            notes,
            status: 'pending'
        });
        
        return NextResponse.json({
            success: true,
            message: "Tạo đơn đổi/trả thành công",
            data: newReturn
        }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating return:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
