import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { WarrantyCard } from "@/models/WarrantyCard";
import { logAudit } from "@/lib/audit";

// GET single warranty card
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        
        const warrantyCard = await WarrantyCard.findById(id)
            .populate('productId', 'name model specs')
            .populate('customerId', 'name phone email')
            .populate('orderId', 'orderNumber totalAmount');
        
        if (!warrantyCard) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy thẻ bảo hành" },
                { status: 404 }
            );
        }
        
        return NextResponse.json({
            success: true,
            data: warrantyCard
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// PUT update warranty card
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();
        
        // Get old data for audit
        const oldCard = await WarrantyCard.findById(id).lean();
        
        const {
            serialNumber,
            warrantyType,
            coverageDetails,
            warrantyMonths,
            warrantyTerms,
            notes,
            status
        } = body;
        
        const updateData: any = {};
        if (serialNumber) updateData.serialNumber = serialNumber;
        if (warrantyType) updateData.warrantyType = warrantyType;
        if (coverageDetails) updateData.coverageDetails = coverageDetails;
        if (warrantyMonths) {
            updateData.warrantyMonths = warrantyMonths;
            // Recalculate end date
            const card = await WarrantyCard.findById(id);
            if (card) {
                const endDate = new Date(card.warrantyStartDate);
                endDate.setMonth(endDate.getMonth() + warrantyMonths);
                updateData.warrantyEndDate = endDate;
            }
        }
        if (warrantyTerms) updateData.warrantyTerms = warrantyTerms;
        if (notes) updateData.notes = notes;
        if (status) updateData.status = status;
        
        const updatedCard = await WarrantyCard.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );
        
        if (!updatedCard) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy thẻ bảo hành" },
                { status: 404 }
            );
        }
        
        // Log audit
        await logAudit({
            collectionName: "warrantycards",
            documentId: id,
            action: "update",
            before: oldCard,
            after: updatedCard.toObject(),
            description: `Cập nhật thẻ bảo hành: ${updatedCard.serialNumber || id}`,
            req: request as any,
        });
        
        return NextResponse.json({
            success: true,
            message: "Cập nhật thẻ bảo hành thành công",
            data: updatedCard
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// DELETE warranty card
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try {
        await connectDB();
        const { id } = await params;
        
        // Get card for audit before delete
        const card = await WarrantyCard.findById(id).lean();
        
        if (!card) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy thẻ bảo hành" },
                { status: 404 }
            );
        }
        
        await WarrantyCard.findByIdAndDelete(id);
        
        // Log audit
        await logAudit({
            collectionName: "warrantycards",
            documentId: id,
            action: "delete",
            before: card,
            description: `Xóa thẻ bảo hành: ${card.serialNumber || id}`,
            req: request as any,
        });
        
        return NextResponse.json({
            success: true,
            message: "Xóa thẻ bảo hành thành công"
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
