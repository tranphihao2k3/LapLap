import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/models/Product";
import mongoose from "mongoose";
import cloudinary from "@/lib/cloudinary";

async function connectDB() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI!);
    }
}

// GET single laptop
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const laptop = await Product.findById(id)
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
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const body = await request.json();

        // Ensure image is set for backward compatibility
        if (!body.image && body.images && body.images.length > 0) {
            body.image = body.images[0];
        }
        const { id } = await params;

        const laptop = await Product.findByIdAndUpdate(
            id,
            body,
            { new: true, runValidators: true }
        )
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
            { status: 400 }
        );
    }
}

// DELETE laptop
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        // Find product first to get images
        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json(
                { success: false, error: "Laptop not found" },
                { status: 404 }
            );
        }

        // Delete images from Cloudinary
        if (product.images && product.images.length > 0) {
            const deletePromises = product.images.map((url: string) => {
                // Extract publicId from URL
                // Example: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/image.jpg
                // Public ID: folder/image
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

        await Product.findByIdAndDelete(id);

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
