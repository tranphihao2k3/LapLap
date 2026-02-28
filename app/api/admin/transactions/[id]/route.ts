import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Transaction } from "@/models/Transaction";
import { logAudit } from "@/lib/audit";

// GET single transaction
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        
        const transaction = await Transaction.findById(id)
            .populate('customerId', 'name phone')
            .populate('supplierId', 'name')
            .populate('employeeId', 'name');
        
        if (!transaction) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy giao dịch" },
                { status: 404 }
            );
        }
        
        return NextResponse.json({
            success: true,
            data: transaction
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// PUT update transaction
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();
        
        // Get old data for audit
        const oldTransaction = await Transaction.findById(id).lean();
        
        const transaction = await Transaction.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true }
        );
        
        if (!transaction) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy giao dịch" },
                { status: 404 }
            );
        }
        
        // Log audit
        await logAudit({
            collectionName: "transactions",
            documentId: id,
            action: "update",
            before: oldTransaction,
            after: transaction.toObject(),
            description: `Cập nhật giao dịch: ${transaction.transactionCode || id}`,
            req: request as any,
        });
        
        return NextResponse.json({
            success: true,
            message: "Cập nhật giao dịch thành công",
            data: transaction
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// DELETE transaction
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try {
        await connectDB();
        const { id } = await params;
        
        // Get transaction for audit before delete
        const transaction = await Transaction.findById(id).lean();
        
        if (!transaction) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy giao dịch" },
                { status: 404 }
            );
        }
        
        await Transaction.findByIdAndDelete(id);
        
        // Log audit
        await logAudit({
            collectionName: "transactions",
            documentId: id,
            action: "delete",
            before: transaction,
            description: `Xóa giao dịch: ${transaction.transactionCode || id}`,
            req: request as any,
        });
        
        return NextResponse.json({
            success: true,
            message: "Xóa giao dịch thành công"
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
