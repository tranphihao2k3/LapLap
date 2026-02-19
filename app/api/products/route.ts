import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import mongoose from 'mongoose'; // Added mongoose import

// GET - Lấy tất cả sản phẩm (Có hỗ trợ search & limit)
export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);

        const search = searchParams.get('search');
        const limit = parseInt(searchParams.get('limit') || '50');
        const status = searchParams.get('status') || 'active';

        let query: any = { status };

        if (search) {
            // High-performance search: prioritize name and model
            // 1. Find potential brands or categories that match the search
            const [matchedBrands, matchedCategories] = await Promise.all([
                mongoose.models.Brand.find({ name: { $regex: search, $options: 'i' } }).select('_id'),
                mongoose.models.Category.find({ name: { $regex: search, $options: 'i' } }).select('_id')
            ]);

            const brandIds = matchedBrands.map(b => b._id);
            const categoryIds = matchedCategories.map(c => c._id);

            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { model: { $regex: search, $options: 'i' } },
                { brandId: { $in: brandIds } },
                { categoryId: { $in: categoryIds } },
                { 'specs.cpu': { $regex: search, $options: 'i' } },
                { 'specs.ram': { $regex: search, $options: 'i' } },
            ];
        }

        const products = await Product.find(query)
            .populate('brandId categoryId')
            .sort({ createdAt: -1 })
            .limit(limit);

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
