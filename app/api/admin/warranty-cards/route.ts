import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { WarrantyCard } from "@/models/WarrantyCard";

// Generate warranty number: WRYYMMXXXX
function generateWarrantyNumber(): string {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `WR${year}${month}${random}`;
}

// GET warranty cards list
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const warrantyType = searchParams.get("warrantyType");
        const search = searchParams.get("search");
        const customerId = searchParams.get("customerId");
        const productId = searchParams.get("productId");
        
        const query: any = {};
        if (status) query.status = status;
        if (warrantyType) query.warrantyType = warrantyType;
        if (customerId) query.customerId = customerId;
        if (productId) query.productId = productId;
        
        let warrantyCards = await WarrantyCard.find(query)
            .populate('productId', 'name model')
            .populate('customerId', 'name phone')
            .populate('orderId', 'orderNumber')
            .sort({ createdAt: -1 });
        
        // Filter by search term
        if (search) {
            warrantyCards = warrantyCards.filter((w: any) => 
                w.warrantyNumber?.toLowerCase().includes(search.toLowerCase()) ||
                w.serialNumber?.toLowerCase().includes(search.toLowerCase()) ||
                w.customerId?.name?.toLowerCase().includes(search.toLowerCase())
            );
        }
        
        return NextResponse.json({
            success: true,
            data: warrantyCards,
            count: warrantyCards.length
        });
    } catch (error: any) {
        console.error("Error fetching warranty cards:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST create warranty card
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        
        const {
            productId,
            orderId,
            customerId,
            serialNumber,
            warrantyType,
            coverageDetails,
            purchaseDate,
            warrantyStartDate,
            warrantyMonths,
            warrantyTerms,
            notes
        } = body;
        
        // Calculate end date
        const startDate = warrantyStartDate ? new Date(warrantyStartDate) : new Date();
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + (warrantyMonths || 12));
        
        const warrantyNumber = generateWarrantyNumber();
        
        const newWarrantyCard = await WarrantyCard.create({
            warrantyNumber,
            productId,
            orderId,
            customerId,
            serialNumber,
            warrantyType: warrantyType || 'store',
            coverageDetails: coverageDetails || {},
            purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
            warrantyStartDate: startDate,
            warrantyEndDate: endDate,
            warrantyMonths: warrantyMonths || 12,
            warrantyTerms: warrantyTerms || '',
            notes,
            status: 'active'
        });
        
        return NextResponse.json({
            success: true,
            message: "Tạo thẻ bảo hành thành công",
            data: newWarrantyCard
        }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating warranty card:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
