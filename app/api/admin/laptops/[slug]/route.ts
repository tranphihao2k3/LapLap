import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/models/Product";
import mongoose from "mongoose";
import cloudinary from "@/lib/cloudinary";
import { logAudit } from "@/lib/audit";

async function connectDB() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI!);
    }
}


// GET single laptop
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;
        const laptop = await Product.findById(slug)
            .populate("categoryId", "name slug")
            .populate("brandId", "name slug logo");

        if (!laptop) {
            return NextResponse.json(
                { success: false, error: "Laptop not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: laptop });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// PUT update laptop
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const body = await request.json();

        // Ensure image is set for backward compatibility
        if (!body.image && body.images && body.images.length > 0) {
            body.image = body.images[0];
        }
        const { slug } = await params;

        // Get old data for audit
        const oldLaptop = await Product.findById(slug).lean();

        // Remove _id if present to avoid immutable field error
        const updateData = { ...body };
        delete updateData._id;
        delete updateData.__v;
        delete updateData.createdAt;
        delete updateData.updatedAt;

        const laptop = await Product.findByIdAndUpdate(
            slug,
            updateData,
            { new: true, runValidators: false }
        )
            .populate("categoryId", "name slug")
            .populate("brandId", "name slug logo");

        if (!laptop) {
            return NextResponse.json(
                { success: false, error: "Laptop not found" },
                { status: 404 }
            );
        }

        // Log audit
        await logAudit({
            collectionName: "products",
            documentId: slug,
            action: "update",
            before: oldLaptop,
            after: laptop.toObject(),
            description: `Cập nhật sản phẩm: ${laptop.name}`,
            req: request as any,
        });

        return NextResponse.json({ success: true, data: laptop });
    } catch (error: any) {
        console.error("PUT laptop error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}



// DELETE laptop
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;

        // Find product first to get images
        const product = await Product.findById(slug);

        if (!product) {
            return NextResponse.json(
                { success: false, error: "Laptop not found" },
                { status: 404 }
            );
        }

        // Log audit before delete
        await logAudit({
            collectionName: "products",
            documentId: slug,
            action: "delete",
            before: product.toObject(),
            description: `Xóa sản phẩm: ${product.name}`,
            req: request as any,
        });

        // Delete images from Cloudinary
        if (product.images && product.images.length > 0) {
            const deletePromises = product.images.map((url: string) => {
                try {
                    const regex = /\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/;
                    const match = url.match(regex);
                    if (match && match[1]) {
                        const publicId = match[1];
                        return cloudinary.uploader.destroy(publicId);
                    }
                } catch (e) {
                    console.error("Error extracting publicId from URL:", url, e);
                }
                return Promise.resolve();
            });

            await Promise.allSettled(deletePromises);
        }

        await Product.findByIdAndDelete(slug);

        return NextResponse.json({
            success: true,
            message: "Laptop deleted successfully"
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
