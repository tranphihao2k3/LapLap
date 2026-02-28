import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Brand } from "@/models/Brand";

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const isActive = searchParams.get("isActive");
        const search = searchParams.get("search");

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: Record<string, any> = {};
        if (isActive !== null) query.isActive = isActive === "true";
        if (search) {
            query["$or"] = [
                { name: { $regex: search, $options: "i" } },
                { country: { $regex: search, $options: "i" } },
            ];
        }

        const brands = await Brand.find(query).sort({ name: 1 }).lean();

        return NextResponse.json({ success: true, data: brands });
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Unknown error";
        console.error("❌ [GET /api/brands]", msg);
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        const existing = await Brand.findOne({ slug: body.slug });
        if (existing) {
            return NextResponse.json({ success: false, error: "Slug đã tồn tại" }, { status: 400 });
        }

        const brand = new Brand(body);
        await brand.save();

        console.log("✅ [POST /api/brands] Created:", brand.name);
        return NextResponse.json({ success: true, data: brand }, { status: 201 });
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Unknown error";
        console.error("❌ [POST /api/brands]", msg);
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}
