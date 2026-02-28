import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Blog } from "@/models/Blog";

// GET all blogs (admin: all statuses, public: published only)
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const search = searchParams.get("search");
        const tag = searchParams.get("tag");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");

        const query: any = {};
        if (status) query.status = status;
        if (tag) query.tags = tag;
        if (search) {
            query["$or"] = [
                { title: { $regex: search, $options: "i" } },
                { excerpt: { $regex: search, $options: "i" } },
                { tags: { $regex: search, $options: "i" } },
            ];
        }

        const skip = (page - 1) * limit;
        const total = await Blog.countDocuments(query);
        const blogs = await Blog.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        return NextResponse.json({
            success: true,
            data: blogs,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch blogs" },
            { status: 500 }
        );
    }
}

// POST - Create new blog post (admin)
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();

        if (!body.title || !body.content) {
            return NextResponse.json(
                { success: false, error: "Thiếu tiêu đề hoặc nội dung" },
                { status: 400 }
            );
        }

        // Auto-set publishedAt when status is published
        if (body.status === "published" && !body.publishedAt) {
            body.publishedAt = new Date();
        }

        const blog = new Blog(body);
        await blog.save();

        console.log("✅ [POST /api/blog] Created:", blog.title);
        return NextResponse.json({ success: true, data: blog }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating blog:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to create blog" },
            { status: 500 }
        );
    }
}
