import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";

// GET - Lấy tất cả sản phẩm
export async function GET() {
    try {
        await connectDB();

        const products = await Product.find().sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: products,
            count: products.length
        });
    } catch (error) {
        console.error("❌ API ERROR:", error);
        return NextResponse.json(
            { success: false, message: "Lỗi server" },
            { status: 500 }
        );
    }
}

// POST - Tạo sản phẩm mới
export async function POST(request: Request) {
    try {
        await connectDB();

        const body = await request.json();

        // Validate dữ liệu
        if (!body.name || !body.price) {
            return NextResponse.json(
                { success: false, message: "Thiếu thông tin bắt buộc (name, price)" },
                { status: 400 }
            );
        }

        const newProduct = await Product.create(body);

        return NextResponse.json(
            {
                success: true,
                message: "Tạo sản phẩm thành công",
                data: newProduct
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("❌ API ERROR:", error);
        return NextResponse.json(
            { success: false, message: "Lỗi server" },
            { status: 500 }
        );
    }
}
