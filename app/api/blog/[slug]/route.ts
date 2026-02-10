import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Blog } from "@/models/Blog";

// GET published blog post by slug (public API)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;

        // Find published blog and increment view count
        const blog = await Blog.findOneAndUpdate(
            { slug, status: "published" },
            { $inc: { viewCount: 1 } },
            { new: true }
        );

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
