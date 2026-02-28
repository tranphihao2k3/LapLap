import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Supplier } from "@/models/Supplier";
import { logAudit } from "@/lib/audit";

// GET single supplier
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        
        const supplier = await Supplier.findById(id);
        
        if (!supplier) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy nhà cung cấp" },
                { status: 404 }
            );
        }
        
        return NextResponse.json({
            success: true,
            data: supplier
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// PUT update supplier
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();
        
        // Get old data for audit
        const oldSupplier = await Supplier.findById(id).lean();
        
        const {
            name,
            email,
            phone,
            address,
            contactPerson,
            taxCode,
            bankAccount,
            bankName,
            paymentTerm,
            rating,
            status,
            notes
        } = body;
        
        const updateData: any = {};
        if (name) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (phone !== undefined) updateData.phone = phone;
        if (address !== undefined) updateData.address = address;
        if (contactPerson !== undefined) updateData.contactPerson = contactPerson;
        if (taxCode !== undefined) updateData.taxCode = taxCode;
        if (bankAccount !== undefined) updateData.bankAccount = bankAccount;
        if (bankName !== undefined) updateData.bankName = bankName;
        if (paymentTerm !== undefined) updateData.paymentTerm = paymentTerm;
        if (rating !== undefined) updateData.rating = rating;
        if (status) updateData.status = status;
        if (notes !== undefined) updateData.notes = notes;
        
        const updatedSupplier = await Supplier.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );
        
        if (!updatedSupplier) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy nhà cung cấp" },
                { status: 404 }
            );
        }
        
        // Log audit
        await logAudit({
            collectionName: "suppliers",
            documentId: id,
            action: "update",
            before: oldSupplier,
            after: updatedSupplier.toObject(),
            description: `Cập nhật nhà cung cấp: ${name || oldSupplier?.name}`,
            req: request as any,
        });
        
        return NextResponse.json({
            success: true,
            message: "Cập nhật nhà cung cấp thành công",
            data: updatedSupplier
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// DELETE supplier
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        
        // Get supplier for audit before delete
        const supplier = await Supplier.findById(id).lean();
        
        const deletedSupplier = await Supplier.findByIdAndDelete(id);
        
        if (!deletedSupplier) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy nhà cung cấp" },
                { status: 404 }
            );
        }
        
        // Log audit
        await logAudit({
            collectionName: "suppliers",
            documentId: id,
            action: "delete",
            before: supplier,
            description: `Xóa nhà cung cấp: ${supplier?.name}`,
            req: request as any,
        });
        
        return NextResponse.json({
            success: true,
            message: "Xóa nhà cung cấp thành công"
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
