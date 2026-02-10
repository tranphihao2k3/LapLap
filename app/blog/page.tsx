'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Calendar, User, Eye, Tag } from 'lucide-react';

interface Blog {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage: string;
    author: string;
    tags: string[];
    status: string;
    publishedAt: string;
    viewCount: number;
    createdAt: string;
    updatedAt: string;
}

export default function BlogPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTag, setSelectedTag] = useState<string>('');

    useEffect(() => {
        fetchBlogs();

        // Add structured data for blog listing
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Blog LapLap - Tin tức và hướng dẫn laptop",
            "description": "Tin tức, hướng dẫn và đánh giá laptop tại Cần Thơ",
            "url": "https://laplap.vercel.app/blog",
            "publisher": {
                "@type": "Organization",
                "name": "LapLap - Laptop Cần Thơ",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://laplap.vercel.app/favicon.ico"
                }
            }
        });
        document.head.appendChild(script);
        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await fetch('/api/admin/blog?status=published');
            const data = await res.json();
            if (data.success) {
                setBlogs(data.data);
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
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

    // Get all unique tags
    const allTags = Array.from(new Set(blogs.flatMap(blog => blog.tags)));

    // Filter blogs by selected tag
    const filteredBlogs = selectedTag
        ? blogs.filter(blog => blog.tags.includes(selectedTag))
        : blogs;

    return (
        <>
            <Header />
            <main className="flex-1 container mx-auto p-4">
                {/* Hero Section */}
                <section className="relative bg-[#1e3a5f] rounded-3xl p-8 md:p-16 mb-12 overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>

                    {/* Content */}
                    <div className="relative z-10">
                        <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-4">
                            ✨ Tin tức & Hướng dẫn
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black mb-4 text-white leading-tight">
                            Blog LapLap
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed">
                            Tin tức, hướng dẫn và đánh giá laptop mới nhất tại Cần Thơ
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-6 mt-8">
                            <div className="flex items-center gap-2 text-white/90">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                    <Tag className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{blogs.length}</div>
                                    <div className="text-sm text-white/70">Bài viết</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-white/90">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                    <Eye className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{blogs.reduce((sum, blog) => sum + blog.viewCount, 0)}</div>
                                    <div className="text-sm text-white/70">Lượt xem</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
                        <p className="text-gray-600 mt-4 text-lg">Đang tải bài viết...</p>
                    </div>
                ) : (
                    <>
                        {/* Tags Filter */}
                        {allTags.length > 0 && (
                            <div className="mb-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                                    <h2 className="text-xl font-bold text-gray-800">Lọc theo chủ đề</h2>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={() => setSelectedTag('')}
                                        className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${selectedTag === ''
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300'
                                            }`}
                                    >
                                        Tất cả
                                    </button>
                                    {allTags.map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => setSelectedTag(tag)}
                                            className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${selectedTag === tag
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                                                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300'
                                                }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Blog Grid */}
                        {filteredBlogs.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredBlogs.map(blog => (
                                    <Link
                                        key={blog._id}
                                        href={`/blog/${blog.slug}`}
                                        className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden"
                                    >
                                        {/* Featured Image */}
                                        {blog.featuredImage && (
                                            <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
                                                <img
                                                    src={blog.featuredImage}
                                                    alt={blog.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        )}
                                        {!blog.featuredImage && (
                                            <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                                <Tag className="w-16 h-16 text-blue-300" />
                                            </div>
                                        )}

                                        {/* Content */}
                                        <div className="p-6">
                                            <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                {blog.title}
                                            </h2>

                                            <p className="text-gray-600 mb-4 line-clamp-3">
                                                {blog.excerpt}
                                            </p>

                                            {/* Meta Info */}
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                                                <div className="flex items-center gap-1">
                                                    <User className="w-4 h-4" />
                                                    <span>{blog.author}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Eye className="w-4 h-4" />
                                                    <span>{blog.viewCount} lượt xem</span>
                                                </div>
                                            </div>

                                            {/* Tags */}
                                            {blog.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {blog.tags.map(tag => (
                                                        <span
                                                            key={tag}
                                                            className="px-3 py-1 bg-blue-100 text-blue-600 text-xs rounded-full"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <p className="text-gray-600 text-lg">
                                    {selectedTag
                                        ? `Không có bài viết nào với chủ đề "${selectedTag}"`
                                        : 'Chưa có bài viết nào. Hãy quay lại sau!'}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </main>
            <Footer />
        </>
    );
}
