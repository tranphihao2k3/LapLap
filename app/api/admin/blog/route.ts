import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Blog } from "@/models/Blog";

// GET all blog posts with filters
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const status = searchParams.get("status");
        const search = searchParams.get("search");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");

        const query: any = {};
        if (category) query.category = category;
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { slug: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;
        const total = await Blog.countDocuments(query);
        const posts = await Blog.find(query)
            .select("-content")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        return NextResponse.json({
            success: true,
            data: posts,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error: any) {
        console.error("Error fetching blog posts:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST - Create new blog post
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();

        if (!body.title || !body.slug) {
            return NextResponse.json({ success: false, error: "Thiếu thông tin bắt buộc" }, { status: 400 });
        }

        const post = await Blog.create(body);
        return NextResponse.json({ success: true, data: post }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating blog post:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
