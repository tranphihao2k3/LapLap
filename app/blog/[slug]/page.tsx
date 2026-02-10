'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Calendar, User, Eye, Tag, ArrowLeft, Share2 } from 'lucide-react';

interface Blog {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage: string;
    author: string;
    tags: string[];
    metaTitle: string;
    metaDescription: string;
    status: string;
    publishedAt: string;
    viewCount: number;
    createdAt: string;
    updatedAt: string;
}

export default function BlogDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [blog, setBlog] = useState<Blog | null>(null);
    const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            fetchBlog();
        }
    }, [slug]);

    const fetchBlog = async () => {
        try {
            // Fetch current blog
            const res = await fetch(`/api/blog/${slug}`);
            const data = await res.json();

            if (data.success) {
                setBlog(data.data);

                // Fetch related blogs
                const allBlogsRes = await fetch('/api/admin/blog?status=published');
                const allBlogsData = await allBlogsRes.json();

                if (allBlogsData.success) {
                    // Find blogs with similar tags
                    const related = allBlogsData.data
                        .filter((b: Blog) =>
                            b._id !== data.data._id &&
                            b.tags.some((tag: string) => data.data.tags.includes(tag))
                        )
                        .slice(0, 3);
                    setRelatedBlogs(related);
                }

                // Add structured data for article
                const script = document.createElement('script');
                script.type = 'application/ld+json';
                script.text = JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "BlogPosting",
                    "headline": data.data.title,
                    "description": data.data.excerpt,
                    "image": data.data.featuredImage || "https://laplap.vercel.app/favicon.ico",
                    "author": {
                        "@type": "Person",
                        "name": data.data.author
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "LapLap - Laptop Cần Thơ",
                        "logo": {
                            "@type": "ImageObject",
                            "url": "https://laplap.vercel.app/favicon.ico"
                        }
                    },
                    "datePublished": data.data.publishedAt || data.data.createdAt,
                    "dateModified": data.data.updatedAt,
                    "mainEntityOfPage": {
                        "@type": "WebPage",
                        "@id": `https://laplap.vercel.app/blog/${data.data.slug}`
                    }
                });
                document.head.appendChild(script);

                // Update page title and meta description
                document.title = data.data.metaTitle || data.data.title;

                let metaDesc = document.querySelector('meta[name="description"]');
                if (!metaDesc) {
                    metaDesc = document.createElement('meta');
                    metaDesc.setAttribute('name', 'description');
                    document.head.appendChild(metaDesc);
                }
                metaDesc.setAttribute('content', data.data.metaDescription || data.data.excerpt);
            }
        } catch (error) {
            console.error('Error fetching blog:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleShare = async () => {
        if (navigator.share && blog) {
            try {
                await navigator.share({
                    title: blog.title,
                    text: blog.excerpt,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Đã copy link bài viết!');
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <main className="flex-1 container mx-auto p-4">
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
                        <p className="text-gray-600 mt-4 text-lg">Đang tải bài viết...</p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

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

    return (
        <>
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

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                        {blog.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-6 text-gray-600 mb-6 pb-6 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            <span>{blog.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Eye className="w-5 h-5" />
                            <span>{blog.viewCount} lượt xem</span>
                        </div>
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors ml-auto"
                        >
                            <Share2 className="w-5 h-5" />
                            <span>Chia sẻ</span>
                        </button>
                    </div>

                    {/* Tags */}
                    {blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                            {blog.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Content */}
                    <div className="prose prose-lg max-w-none mb-12">
                        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {blog.content}
                        </div>
                    </div>

                    {/* Related Posts */}
                    {relatedBlogs.length > 0 && (
                        <section className="mt-16 pt-8 border-t border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Bài viết liên quan</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {relatedBlogs.map(relatedBlog => (
                                    <Link
                                        key={relatedBlog._id}
                                        href={`/blog/${relatedBlog.slug}`}
                                        className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden"
                                    >
                                        {relatedBlog.featuredImage ? (
                                            <div className="relative h-40 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
                                                <img
                                                    src={relatedBlog.featuredImage}
                                                    alt={relatedBlog.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-40 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                                <Tag className="w-12 h-12 text-blue-300" />
                                            </div>
                                        )}
                                        <div className="p-4">
                                            <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                {relatedBlog.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                                {relatedBlog.excerpt}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </article>
            </main>
            <Footer />
        </>
    );
}
