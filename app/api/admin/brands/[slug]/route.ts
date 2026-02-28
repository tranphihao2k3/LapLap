import { NextRequest, NextResponse } from "next/server";
import { Brand } from "@/models/Brand";
import { logAudit } from "@/lib/audit";
import mongoose from "mongoose";

async function connectDB() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI!);
    }
}

// GET single brand
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;
        const brand = await Brand.findById(slug);

        if (!brand) {
            return NextResponse.json(
                { success: false, error: "Brand not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: brand });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// PUT update brand
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const body = await request.json();
        const { slug } = await params;

        // Get old data for audit
        const oldBrand = await Brand.findById(slug).lean();

        const brand = await Brand.findByIdAndUpdate(
            slug,
            body,
            { new: true, runValidators: true }
        );

        if (!brand) {
            return NextResponse.json(
                { success: false, error: "Brand not found" },
                { status: 404 }
            );
        }

        // Log audit
        await logAudit({
            collectionName: "brands",
            documentId: slug,
            action: "update",
            before: oldBrand,
            after: brand.toObject(),
            description: `Cập nhật thương hiệu: ${brand.name}`,
            req: request as any,
        });

        return NextResponse.json({ success: true, data: brand });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}

// DELETE brand
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
    try {
        await connectDB();
        const { slug } = await params;
        
        // Get brand for audit before delete
        const brand = await Brand.findById(slug).lean();
        
        if (!brand) {
            return NextResponse.json(
                { success: false, error: "Brand not found" },
                { status: 404 }
            );
        }

        await Brand.findByIdAndDelete(slug);

        // Log audit
        await logAudit({
            collectionName: "brands",
            documentId: slug,
            action: "delete",
            before: brand,
            description: `Xóa thương hiệu: ${brand.name}`,
            req: request as any,
        });

        return NextResponse.json({
            success: true,
            message: "Brand deleted successfully"
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
