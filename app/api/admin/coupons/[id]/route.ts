import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Coupon } from "@/models/Coupon";
import { logAudit } from "@/lib/audit";

// GET single coupon
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        
        const coupon = await Coupon.findById(id);
        
        if (!coupon) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy mã giảm giá" },
                { status: 404 }
            );
        }
        
        return NextResponse.json({
            success: true,
            data: coupon
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// PUT update coupon
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();
        
        // Get old data for audit
        const oldCoupon = await Coupon.findById(id).lean();
        
        // Check if code already exists (exclude current coupon)
        if (body.code) {
            const existingCoupon = await Coupon.findOne({
                code: body.code.toUpperCase(),
                _id: { $ne: id }
            });
            if (existingCoupon) {
                return NextResponse.json(
                    { success: false, error: "Mã giảm giá đã tồn tại" },
                    { status: 400 }
                );
            }
        }
        
        const coupon = await Coupon.findByIdAndUpdate(
            id,
            {
                ...body,
                code: body.code?.toUpperCase().trim()
            },
            { new: true }
        );
        
        if (!coupon) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy mã giảm giá" },
                { status: 404 }
            );
        }
        
        // Log audit
        await logAudit({
            collectionName: "coupons",
            documentId: id,
            action: "update",
            before: oldCoupon,
            after: coupon.toObject(),
            description: `Cập nhật mã giảm giá: ${coupon.code}`,
            req: request as any,
        });
        
        return NextResponse.json({
            success: true,
            message: "Cập nhật mã giảm giá thành công",
            data: coupon
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// DELETE coupon
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        
        // Get coupon for audit before delete
        const coupon = await Coupon.findById(id).lean();
        
        if (!coupon) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy mã giảm giá" },
                { status: 404 }
            );
        }
        
        await Coupon.findByIdAndDelete(id);
        
        // Log audit
        await logAudit({
            collectionName: "coupons",
            documentId: id,
            action: "delete",
            before: coupon,
            description: `Xóa mã giảm giá: ${coupon.code}`,
            req: request as any,
        });
        
        return NextResponse.json({
            success: true,
            message: "Xóa mã giảm giá thành công"
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
