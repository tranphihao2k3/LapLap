import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { BuybackOrder } from "@/models/BuybackOrder";

// GET all buyback orders
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const search = searchParams.get("search");
        
        const query: any = {};
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { buybackNumber: { $regex: search, $options: 'i' } },
                { sellerName: { $regex: search, $options: 'i' } },
                { sellerPhone: { $regex: search, $options: 'i' } },
                { "productInfo.model": { $regex: search, $options: 'i' } }
            ];
        }
        
        const orders = await BuybackOrder.find(query)
            .populate('inspectedBy', 'name')
            .populate('approvedBy', 'name')
            .sort({ createdAt: -1 });
        
        return NextResponse.json({
            success: true,
            data: orders
        });
    } catch (error: any) {
        console.error("Error fetching buyback orders:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST create new buyback order
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        
        // Generate buyback number
        const date = new Date();
        const prefix = "BB" + date.getFullYear().toString().slice(-2) + 
                      String(date.getMonth() + 1).padStart(2, '0');
        
        const lastOrder = await BuybackOrder.findOne({
            buybackNumber: { $regex: `^${prefix}` }
        }).sort({ buybackNumber: -1 });
        
        let sequence = 1;
        if (lastOrder) {
            const lastSeq = parseInt(lastOrder.buybackNumber.slice(-4));
            sequence = lastSeq + 1;
        }
        
        const buybackNumber = `${prefix}${String(sequence).padStart(4, '0')}`;
        
        const order = await BuybackOrder.create({
            ...body,
            buybackNumber
        });
        
        return NextResponse.json({
            success: true,
            message: "Tạo đơn thu cũ thành công",
            data: order
        }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating buyback order:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
