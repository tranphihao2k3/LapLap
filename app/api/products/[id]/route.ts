import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";

// GET - Lấy một sản phẩm theo ID
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const product = await Product.findById(params.id);

        if (!product) {
            return NextResponse.json(
                { success: false, message: "Không tìm thấy sản phẩm" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error("❌ API ERROR:", error);
        return NextResponse.json(
            { success: false, message: "Lỗi server" },
            { status: 500 }
        );
    }
}

// PUT - Cập nhật sản phẩm
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const body = await request.json();

        const updatedProduct = await Product.findByIdAndUpdate(
            params.id,
            body,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return NextResponse.json(
                { success: false, message: "Không tìm thấy sản phẩm" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Cập nhật sản phẩm thành công",
            data: updatedProduct
        });
    } catch (error) {
        console.error("❌ API ERROR:", error);
        return NextResponse.json(
            { success: false, message: "Lỗi server" },
            { status: 500 }
        );
    }
}

// DELETE - Xóa sản phẩm
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const deletedProduct = await Product.findByIdAndDelete(params.id);

        if (!deletedProduct) {
            return NextResponse.json(
                { success: false, message: "Không tìm thấy sản phẩm" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Xóa sản phẩm thành công",
            data: deletedProduct
        });
    } catch (error) {
        console.error("❌ API ERROR:", error);
        return NextResponse.json(
            { success: false, message: "Lỗi server" },
            { status: 500 }
        );
    }
}
