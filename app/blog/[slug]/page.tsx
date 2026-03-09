// ✅ Server Component — không có 'use client'
// generateMetadata chạy trên server, Googlebot đọc được đúng title/description mỗi bài

import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Calendar, User, Eye, ArrowLeft } from 'lucide-react';
// import { connectDB } from '@/lib/mongodb';
// import { Blog } from '@/models/Blog';
import BlogDetailClient from './BlogDetailClient';
import JsonLd from '@/components/JsonLd';
import { buildBlogPostingJsonLd, buildBreadcrumbJsonLd } from '@/lib/seo';
import { getBlog } from '@/lib/api/admin';


interface PageProps {
    params: Promise<{ slug: string }>;
}

// ────────────────────────────────────────────────────────────────────────────
// generateMetadata: chạy trên server, Google đọc được title & description riêng
// ────────────────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;

    try {
        const res = await getBlog(slug);
        const blog = res.success && res.data ? res.data : null;

        if (!blog) {
            return {
                title: 'Bài viết không tồn tại | LapLap Cần Thơ',
                description: 'Bài viết bạn tìm kiếm không tồn tại hoặc đã bị xóa.',
            };
        }

        return {
            title: blog.metaTitle || `${blog.title} | LapLap Cần Thơ`,
            description: blog.metaDescription || blog.excerpt,
            keywords: blog.tags?.join(', '),
            openGraph: {
                title: blog.metaTitle || blog.title,
                description: blog.metaDescription || blog.excerpt,
                type: 'article',
                url: `https://laplapcantho.store/blog/${slug}`,
                images: blog.featuredImage ? [{ url: blog.featuredImage }] : [],
                publishedTime: blog.publishedAt || blog.createdAt,
                modifiedTime: blog.updatedAt,
                authors: [blog.author || 'LapLap Team'],
            },
            twitter: {
                card: 'summary_large_image',
                title: blog.metaTitle || blog.title,
                description: blog.metaDescription || blog.excerpt,
            },
            alternates: {
                canonical: `https://laplapcantho.store/blog/${slug}`,
            },
        };
    } catch {
        return {
            title: 'Blog | LapLap Cần Thơ',
            description: 'Blog chia sẻ kiến thức về laptop tại LapLap Cần Thơ.',
        };
    }
}

// ────────────────────────────────────────────────────────────────────────────
// Server page component
// ────────────────────────────────────────────────────────────────────────────
export default async function BlogDetailPage({ params }: PageProps) {
    const { slug } = await params;

    // fetch via API client
    const res = await getBlog(slug);
    const blog = res.success && res.data ? res.data : null;

    if (!blog) {
        return (
            <>
                <Header />
                <main className="flex-1 container mx-auto p-4">
                    <div className="text-center py-20">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">Không tìm thấy bài viết</h1>
                        <Link href="/blog" className="text-blue-600 hover:underline">
                            ← Quay lại trang blog
                        </Link>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric', month: 'long', day: 'numeric',
        });

    // JSON-LD structured data từ lib/seo (chuẩn schema.org)
    const blogJsonLd = buildBlogPostingJsonLd({
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        featuredImage: blog.featuredImage,
        author: blog.author,
        publishedAt: blog.publishedAt,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
        tags: blog.tags,
        slug: blog.slug,
    });

    const breadcrumbJsonLd = buildBreadcrumbJsonLd([
        { name: 'Trang chủ', url: '/' },
        { name: 'Blog', url: '/blog' },
        { name: blog.title, url: `/blog/${blog.slug}` },
    ]);

    return (
        <>
            {/* JSON-LD structured data */}
            <JsonLd id="blog-jsonld" data={blogJsonLd} />
            <JsonLd id="breadcrumb-blog-jsonld" data={breadcrumbJsonLd} />

            <Header />
            <main className="flex-1 container mx-auto p-4">
                {/* Back Button */}
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Quay lại Blog</span>
                </Link>

                <article className="max-w-4xl mx-auto">
                    {/* Featured Image */}
                    {blog.featuredImage && (
                        <div className="relative h-96 rounded-2xl overflow-hidden mb-8 shadow-lg">
                            <img
                                src={blog.featuredImage}
                                alt={blog.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Title — h1 duy nhất, Google đọc từ server */}
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                        {blog.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-6 text-gray-600 mb-6 pb-6 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            <span>{blog.author || 'LapLap Team'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Eye className="w-5 h-5" />
                            <span>{blog.viewCount} lượt xem</span>
                        </div>

                    </div>

                    {/* Tags */}
                    {blog.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8 mt-2">
                            {blog.tags.map((tag: string) => (
                                <span
                                    key={tag}
                                    className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Share button, Content, and Related Posts — client component */}
                    <BlogDetailClient blog={{
                        _id: blog._id.toString(),
                        title: blog.title,
                        slug: blog.slug,
                        excerpt: blog.excerpt,
                        content: blog.content,
                        tags: blog.tags || [],
                    }} />
                </article>
            </main>
            <Footer />
        </>
    );
}
