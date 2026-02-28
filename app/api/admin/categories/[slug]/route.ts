import { NextRequest, NextResponse } from "next/server";
import { Category } from "@/models/Category";
import { logAudit } from "@/lib/audit";
import mongoose from "mongoose";

async function connectDB() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI!);
    }
}

// GET single category
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;
        const category = await Category.findById(slug);

        if (!category) {
            return NextResponse.json(
                { success: false, error: "Category not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: category });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// PUT update category
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const body = await request.json();
        const { slug } = await params;

        // Get old data for audit
        const oldCategory = await Category.findById(slug).lean();

        const category = await Category.findByIdAndUpdate(
            slug,
            body,
            { new: true, runValidators: true }
        );

        if (!category) {
            return NextResponse.json(
                { success: false, error: "Category not found" },
                { status: 404 }
            );
        }

        // Log audit
        await logAudit({
            collectionName: "categories",
            documentId: slug,
            action: "update",
            before: oldCategory,
            after: category.toObject(),
            description: `Cập nhật danh mục: ${category.name}`,
            req: request as any,
        });

        return NextResponse.json({ success: true, data: category });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}

// DELETE category
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
    try {
        await connectDB();
        const { slug } = await params;
        
        // Get category for audit before delete
        const category = await Category.findById(slug).lean();
        
        if (!category) {
            return NextResponse.json(
                { success: false, error: "Category not found" },
                { status: 404 }
            );
        }

        await Category.findByIdAndDelete(slug);

        // Log audit
        await logAudit({
            collectionName: "categories",
            documentId: slug,
            action: "delete",
            before: category,
            description: `Xóa danh mục: ${category.name}`,
            req: request as any,
        });

        return NextResponse.json({
            success: true,
            message: "Category deleted successfully"
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
