import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Blog } from "@/models/Blog";

// GET all blog posts (admin view - includes drafts)
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");

        let query = {};
        if (status && (status === "draft" || status === "published")) {
            query = { status };
        }

        const blogs = await Blog.find(query)
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            data: blogs,
        });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch blogs" },
            { status: 500 }
        );
    }
}

// Helper function to generate slug from title
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

// POST create new blog post
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const {
            title,
            slug,
            excerpt,
            content,
            featuredImage,
            author,
            tags,
            metaTitle,
            metaDescription,
            status,
        } = body;

        // Validate required fields
        if (!title || !content) {
            return NextResponse.json(
                { success: false, error: "Title and content are required" },
                { status: 400 }
            );
        }

        // Generate slug if not provided
        const finalSlug = slug || generateSlug(title);

        // Check if slug already exists
        const existingBlog = await Blog.findOne({ slug: finalSlug });
        if (existingBlog) {
            return NextResponse.json(
                { success: false, error: "Slug already exists" },
                { status: 400 }
            );
        }

        // Set publishedAt if status is published
        const publishedAt = status === "published" ? new Date() : null;

        const newBlog = await Blog.create({
            title,
            slug: finalSlug,
            excerpt: excerpt || "",
            content,
            featuredImage: featuredImage || "",
            author: author || "LapLap Team",
            tags: tags || [],
            metaTitle: metaTitle || title,
            metaDescription: metaDescription || excerpt || "",
            status: status || "draft",
            publishedAt,
        });

        return NextResponse.json({
            success: true,
            data: newBlog,
        });
    } catch (error) {
        console.error("Error creating blog:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create blog" },
            { status: 500 }
        );
    }
}
