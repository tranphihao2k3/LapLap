import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Blog } from "@/models/Blog";
import { logAudit } from "@/lib/audit";
import mongoose from "mongoose";

function isObjectId(value: string): boolean {
    return /^[a-f\d]{24}$/i.test(value);
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;

        const post = isObjectId(slug)
            ? await Blog.findById(slug).lean()
            : await Blog.findOne({ slug }).lean();

        if (!post) {
            return NextResponse.json({ success: false, error: "Không tìm thấy bài viết" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: post });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;
        const body = await request.json();

        if (isObjectId(slug)) {
            // Called with MongoDB ObjectId (from admin edit page)
            const {
                title,
                slug: bodySlug,
                excerpt,
                content,
                featuredImage,
                author,
                tags,
                metaTitle,
                metaDescription,
                status,
            } = body;

            // Get old data for audit
            const oldBlog = await Blog.findById(slug).lean();
            
            const existingBlog = await Blog.findById(slug);
            if (!existingBlog) {
                return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
            }

            if (bodySlug && bodySlug !== existingBlog.slug) {
                const slugConflict = await Blog.findOne({ slug: bodySlug, _id: { $ne: slug } });
                if (slugConflict) {
                    return NextResponse.json({ success: false, error: "Slug already exists" }, { status: 400 });
                }
            }

            let publishedAt = existingBlog.publishedAt;
            if (status === "published" && existingBlog.status !== "published") {
                publishedAt = new Date();
            }

            const updatedBlog = await Blog.findByIdAndUpdate(
                slug,
                {
                    title,
                    slug: bodySlug,
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

            // Log audit
            if (updatedBlog) {
                await logAudit({
                    collectionName: "blogs",
                    documentId: slug,
                    action: "update",
                    before: oldBlog,
                    after: updatedBlog.toObject(),
                    description: `Cập nhật bài viết: ${updatedBlog.title}`,
                    req: request as any,
                });
            }

            return NextResponse.json({ success: true, data: updatedBlog });
        } else {
            // Called with slug string
            const oldBlog = await Blog.findOne({ slug }).lean();
            const post = await Blog.findOneAndUpdate({ slug }, { $set: body }, { new: true });
            if (!post) {
                return NextResponse.json({ success: false, error: "Không tìm thấy bài viết" }, { status: 404 });
            }
            
            // Log audit
            await logAudit({
                collectionName: "blogs",
                documentId: post._id.toString(),
                action: "update",
                before: oldBlog,
                after: post.toObject(),
                description: `Cập nhật bài viết: ${post.title}`,
                req: request as any,
            });
            
            return NextResponse.json({ success: true, data: post });
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
    try {
        await connectDB();
        const { slug } = await params;

        // Get post for audit before delete
        const oldPost = isObjectId(slug)
            ? await Blog.findById(slug).lean()
            : await Blog.findOne({ slug }).lean();

        const post = isObjectId(slug)
            ? await Blog.findByIdAndDelete(slug)
            : await Blog.findOneAndDelete({ slug });

        if (!post) {
            return NextResponse.json({ success: false, error: "Không tìm thấy bài viết" }, { status: 404 });
        }

        // Log audit
        await logAudit({
            collectionName: "blogs",
            documentId: isObjectId(slug) ? slug : post._id.toString(),
            action: "delete",
            before: oldPost,
            description: `Xóa bài viết: ${post.title || slug}`,
            req: request as any,
        });

        return NextResponse.json({ success: true, message: "Đã xóa bài viết" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
