import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Category } from "@/models/Category";

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const isActive = searchParams.get("isActive");
        const parentId = searchParams.get("parentId");
        const search = searchParams.get("search");

        const query: Record<string, any> = {};
        if (isActive !== null) query.isActive = isActive === "true";
        if (parentId === "null") query.parentId = null;
        else if (parentId) query.parentId = parentId;
        if (search) {
            query["$or"] = [
                { name: { $regex: search, $options: "i" } },
            ];
        }

        const categories = await Category.find(query).sort({ sortOrder: 1, name: 1 }).lean();

        return NextResponse.json({ success: true, data: categories });
    } catch (error: any) {
        console.error("❌ [GET /api/categories]", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        const existing = await Category.findOne({ slug: body.slug });
        if (existing) {
            return NextResponse.json({ success: false, error: "Slug đã tồn tại" }, { status: 400 });
        }

        const category = new Category(body);
        await category.save();

        console.log("✅ [POST /api/categories] Created:", category.name);
        return NextResponse.json({ success: true, data: category }, { status: 201 });
    } catch (error: any) {
        console.error("❌ [POST /api/categories]", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
