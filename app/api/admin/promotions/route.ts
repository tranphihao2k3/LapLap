import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Promotion } from "@/models/Promotion";

// GET promotions list
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const search = searchParams.get("search");
        
        const query: any = {};
        if (status) query.status = status;
        
        let promotions = await Promotion.find(query)
            .populate('applicableProducts', 'name model')
            .populate('applicableCategories', 'name')
            .sort({ createdAt: -1 });
        
        // Filter by search term
        if (search) {
            promotions = promotions.filter((p: any) => 
                p.name?.toLowerCase().includes(search.toLowerCase()) ||
                p.code?.toLowerCase().includes(search.toLowerCase())
            );
        }
        
        return NextResponse.json({
            success: true,
            data: promotions,
            count: promotions.length
        });
    } catch (error: any) {
        console.error("Error fetching promotions:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST create promotion
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        
        const {
            name,
            code,
            description,
            discountType,
            discountValue,
            maxDiscountAmount,
            applicableProducts,
            applicableCategories,
            minOrderAmount,
            startDate,
            endDate,
            maxUses,
            notes
        } = body;
        
        // Check if code already exists
        if (code) {
            const existing = await Promotion.findOne({ code: code.toUpperCase() });
            if (existing) {
                return NextResponse.json(
                    { success: false, error: "Mã khuyến mãi đã tồn tại" },
                    { status: 400 }
                );
            }
        }
        
        const newPromotion = await Promotion.create({
            name,
            code: code ? code.toUpperCase() : undefined,
            description,
            discountType,
            discountValue,
            maxDiscountAmount: maxDiscountAmount || 0,
            applicableProducts: applicableProducts || [],
            applicableCategories: applicableCategories || [],
            minOrderAmount: minOrderAmount || 0,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            maxUses: maxUses || 0,
            usedCount: 0,
            isActive: true,
            status: 'draft',
            notes
        });
        
        return NextResponse.json({
            success: true,
            message: "Tạo chương trình khuyến mãi thành công",
            data: newPromotion
        }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating promotion:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
