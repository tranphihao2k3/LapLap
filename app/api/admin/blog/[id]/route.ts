import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Blog } from "@/models/Blog";

// GET single blog post by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const blog = await Blog.findById(id);

        if (!blog) {
            return NextResponse.json(
                { success: false, error: "Blog not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: blog,
        });
    } catch (error) {
        console.error("Error fetching blog:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch blog" },
            { status: 500 }
        );
    }
}

// PUT update blog post
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
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

        // Find existing blog
        const existingBlog = await Blog.findById(id);
        if (!existingBlog) {
            return NextResponse.json(
                { success: false, error: "Blog not found" },
                { status: 404 }
            );
        }

        // Check if slug is being changed and if it conflicts
        if (slug && slug !== existingBlog.slug) {
            const slugConflict = await Blog.findOne({ slug, _id: { $ne: id } });
            if (slugConflict) {
                return NextResponse.json(
                    { success: false, error: "Slug already exists" },
                    { status: 400 }
                );
            }
        }

        // Update publishedAt if status changes to published
        let publishedAt = existingBlog.publishedAt;
        if (status === "published" && existingBlog.status !== "published") {
            publishedAt = new Date();
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            {
                title,
                slug,
                excerpt,
                content,
                featuredImage,
                author,
                tags,
                metaTitle: metaTitle || title,
                metaDescription: metaDescription || excerpt,
                status,
                publishedAt,
            },
            { new: true }
        );

        return NextResponse.json({
            success: true,
            data: updatedBlog,
        });
    } catch (error) {
        console.error("Error updating blog:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update blog" },
            { status: 500 }
        );
    }
}

// DELETE blog post
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const deletedBlog = await Blog.findByIdAndDelete(id);

        if (!deletedBlog) {
            return NextResponse.json(
                { success: false, error: "Blog not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Blog deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting blog:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete blog" },
            { status: 500 }
        );
    }
}
