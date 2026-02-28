import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Coupon } from "@/models/Coupon";

// GET all coupons
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const search = searchParams.get("search");
        
        const query: any = {};
        if (status === "active") query.isActive = true;
        if (status === "inactive") query.isActive = false;
        if (search) {
            query.$or = [
                { code: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        
        const coupons = await Coupon.find(query).sort({ createdAt: -1 });
        
        return NextResponse.json({
            success: true,
            data: coupons
        });
    } catch (error: any) {
        console.error("Error fetching coupons:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST create new coupon
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        
        // Validation
        if (!body.code || !body.discountType || !body.discountValue || !body.validFrom || !body.validTo) {
            return NextResponse.json(
                { success: false, error: "Thiếu thông tin bắt buộc" },
                { status: 400 }
            );
        }
        
        // Check if code already exists
        const existingCoupon = await Coupon.findOne({ code: body.code.toUpperCase() });
        if (existingCoupon) {
            return NextResponse.json(
                { success: false, error: "Mã giảm giá đã tồn tại" },
                { status: 400 }
            );
        }
        
        const coupon = await Coupon.create({
            ...body,
            code: body.code.toUpperCase().trim()
        });
        
        return NextResponse.json({
            success: true,
            message: "Tạo mã giảm giá thành công",
            data: coupon
        }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating coupon:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
