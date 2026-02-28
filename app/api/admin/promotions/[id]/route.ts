import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Promotion } from "@/models/Promotion";
import { logAudit } from "@/lib/audit";

// GET single promotion
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        
        const promotion = await Promotion.findById(id)
            .populate('applicableProducts', 'name model')
            .populate('applicableCategories', 'name');
        
        if (!promotion) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy chương trình khuyến mãi" },
                { status: 404 }
            );
        }
        
        return NextResponse.json({
            success: true,
            data: promotion
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// PUT update promotion
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();
        
        // Get old data for audit
        const oldPromotion = await Promotion.findById(id).lean();
        
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
            isActive,
            status,
            notes
        } = body;
        
        const updateData: any = {};
        if (name) updateData.name = name;
        if (code !== undefined) updateData.code = code ? code.toUpperCase() : '';
        if (description !== undefined) updateData.description = description;
        if (discountType) updateData.discountType = discountType;
        if (discountValue !== undefined) updateData.discountValue = discountValue;
        if (maxDiscountAmount !== undefined) updateData.maxDiscountAmount = maxDiscountAmount;
        if (applicableProducts) updateData.applicableProducts = applicableProducts;
        if (applicableCategories) updateData.applicableCategories = applicableCategories;
        if (minOrderAmount !== undefined) updateData.minOrderAmount = minOrderAmount;
        if (startDate) updateData.startDate = new Date(startDate);
        if (endDate) updateData.endDate = new Date(endDate);
        if (maxUses !== undefined) updateData.maxUses = maxUses;
        if (isActive !== undefined) updateData.isActive = isActive;
        if (status) updateData.status = status;
        if (notes !== undefined) updateData.notes = notes;
        
        const updatedPromotion = await Promotion.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );
        
        if (!updatedPromotion) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy chương trình khuyến mãi" },
                { status: 404 }
            );
        }
        
        // Log audit
        await logAudit({
            collectionName: "promotions",
            documentId: id,
            action: "update",
            before: oldPromotion,
            after: updatedPromotion.toObject(),
            description: `Cập nhật khuyến mãi: ${updatedPromotion.name}`,
            req: request as any,
        });
        
        return NextResponse.json({
            success: true,
            message: "Cập nhật thành công",
            data: updatedPromotion
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// DELETE promotion
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try {
        await connectDB();
        const { id } = await params;
        
        // Get promotion for audit before delete
        const promotion = await Promotion.findById(id).lean();
        
        if (!promotion) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy chương trình khuyến mãi" },
                { status: 404 }
            );
        }
        
        await Promotion.findByIdAndDelete(id);
        
        // Log audit
        await logAudit({
            collectionName: "promotions",
            documentId: id,
            action: "delete",
            before: promotion,
            description: `Xóa khuyến mãi: ${promotion.name}`,
            req: request as any,
        });
        
        return NextResponse.json({
            success: true,
            message: "Xóa thành công"
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
