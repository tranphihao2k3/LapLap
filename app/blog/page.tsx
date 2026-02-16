'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Calendar, User, Eye, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import TechLoader from '@/components/ui/TechLoader';

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

const dummyBlogs: Blog[] = [
    {
        _id: '1',
        title: 'Hướng dẫn vệ sinh laptop tại nhà đúng cách',
        slug: 'huong-dan-ve-sinh-laptop-tai-nha',
        excerpt: 'Bụi bẩn là kẻ thù số 1 của laptop. Bài viết này sẽ hướng dẫn bạn cách vệ sinh laptop đơn giản, hiệu quả ngay tại nhà.',
        content: '',
        featuredImage: 'https://bizweb.dktcdn.net/thumb/1024x1024/100/448/726/products/ve-sinh-laptop-can-tho-1.jpg',
        author: 'Admin',
        tags: ['Hướng dẫn', 'Vệ sinh'],
        status: 'published',
        publishedAt: new Date().toISOString(),
        viewCount: 1250,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        _id: '2',
        title: 'Top 5 dấu hiệu bạn cần thay pin laptop ngay lập tức',
        slug: 'dau-hieu-can-thay-pin-laptop',
        excerpt: 'Pin laptop bị chai, phồng không chỉ giảm thời gian sử dụng mà còn nguy hiểm. Hãy kiểm tra ngay xem máy bạn có gặp các dấu hiệu này không.',
        content: '',
        featuredImage: 'https://bizweb.dktcdn.net/thumb/1024x1024/100/448/726/articles/thay-pin-laptop-can-tho.jpg',
        author: 'Kỹ thuật viên',
        tags: ['Thủ thuật', 'Phần cứng'],
        status: 'published',
        publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        viewCount: 890,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        _id: '3',
        title: 'Nâng cấp SSD cho laptop cũ: Đáng tiền hay không?',
        slug: 'nang-cap-ssd-laptop-cu',
        excerpt: 'Máy chạy chậm, khởi động lâu? Nâng cấp SSD là giải pháp tiết kiệm và hiệu quả nhất để hồi sinh chiếc laptop cũ của bạn.',
        content: '',
        featuredImage: 'https://bizweb.dktcdn.net/thumb/1024x1024/100/448/726/articles/nang-cap-ssd-laptop-can-tho.jpg',
        author: 'Admin',
        tags: ['Nâng cấp', 'Tư vấn'],
        status: 'published',
        publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        viewCount: 2100,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

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
            "url": "https://laplapcantho.store/blog",
            "publisher": {
                "@type": "Organization",
                "name": "LapLap - Laptop Cần Thơ",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://laplapcantho.store/favicon.ico"
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
            if (data.success && data.data.length > 0) {
                setBlogs(data.data);
            } else {
                // Fallback to dummy data if API returns empty
                setBlogs(dummyBlogs);
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
            // Fallback to dummy data on error
            setBlogs(dummyBlogs);
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

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    const stagger = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    return (
        <>
            <Header />

            {/* Hero Section - Full Width & Modern */}
            <section className="relative w-full min-h-[320px] md:h-[450px] bg-gradient-to-r from-indigo-900 via-blue-800 to-blue-900 text-white overflow-hidden shadow-md mb-8 py-12 md:py-0">
                {/* Background Patterns */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="container mx-auto max-w-5xl px-4 h-full relative z-10 flex items-center justify-between">
                    {/* Left: Text Content */}
                    <div className="w-full md:w-1/2 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-block px-4 py-1.5 bg-blue-500/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-400/30 text-blue-100"
                        >
                            ✨ Tin tức & Công nghệ
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-black mb-4 leading-tight"
                        >
                            Blog LapLap <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
                                Kiến Thức & Đam Mê
                            </span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-blue-100 max-w-lg mx-auto md:mx-0 leading-relaxed"
                        >
                            Cập nhật xu hướng công nghệ, thủ thuật hay và đánh giá laptop chi tiết nhất tại Cần Thơ.
                        </motion.p>

                        {/* Stats - Horizontal */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center justify-center md:justify-start gap-8 mt-6 text-blue-100/80"
                        >
                            <div className="flex items-center gap-2">
                                <Tag className="w-5 h-5 text-yellow-400" />
                                <span className="font-semibold">{blogs.length} Bài viết</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Eye className="w-5 h-5 text-green-400" />
                                <span className="font-semibold">{blogs.reduce((sum, blog) => sum + blog.viewCount, 0).toLocaleString()} Lượt xem</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Abstract 3D Illustration */}
                    <div className="hidden md:flex w-1/2 items-center justify-center relative translate-y-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative z-10"
                        >
                            {/* Floating Cards Effect */}
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-16 -left-12 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-xl w-48 rotate-[-6deg]"
                            >
                                <div className="h-3 w-2/3 bg-white/30 rounded-full mb-2"></div>
                                <div className="h-2 w-full bg-white/20 rounded-full mb-1"></div>
                                <div className="h-2 w-4/5 bg-white/20 rounded-full"></div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="bg-gradient-to-br from-blue-600 to-indigo-600 p-6 rounded-2xl shadow-2xl border border-white/10 w-64 relative z-20 rotate-3"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="h-2 w-20 bg-white/40 rounded-full mb-1"></div>
                                        <div className="h-2 w-12 bg-white/20 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-3 w-full bg-white/30 rounded-full"></div>
                                    <div className="h-3 w-5/6 bg-white/30 rounded-full"></div>
                                    <div className="h-3 w-4/6 bg-white/30 rounded-full"></div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute -bottom-10 -right-8 bg-white p-4 rounded-xl shadow-lg w-52 rotate-6 text-gray-800"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                        <User className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="text-xs font-bold text-gray-700">Admin LapLap</div>
                                </div>
                                <div className="text-xs text-gray-500 italic">"Chia sẻ kiến thức là niềm vui!"</div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <main className="flex-1 container mx-auto max-w-5xl p-4">
                {loading ? (
                    <TechLoader />
                ) : (
                    <>
                        {/* Tags Filter - Condensed and Scrollable */}
                        {allTags.length > 0 && (
                            <motion.div
                                className="mb-8"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                                    <h2 className="text-lg font-extrabold text-gray-800 uppercase tracking-tight">Chủ đề bài viết</h2>
                                </div>
                                <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                                    <Button
                                        onClick={() => setSelectedTag('')}
                                        variant={selectedTag === '' ? 'primary' : 'outline'}
                                        size="sm"
                                        className={selectedTag === '' ? 'border-none' : 'bg-white border-gray-100 text-gray-600 hover:border-blue-200 hover:bg-gray-50'}
                                    >
                                        Tất cả
                                    </Button>
                                    {allTags.map(tag => (
                                        <Button
                                            key={tag}
                                            onClick={() => setSelectedTag(tag)}
                                            variant={selectedTag === tag ? 'primary' : 'outline'}
                                            size="sm"
                                            className={selectedTag === tag ? 'border-none' : 'bg-white border-gray-100 text-gray-600 hover:border-blue-200 hover:bg-gray-50'}
                                        >
                                            {tag}
                                        </Button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Blog Grid */}
                        {filteredBlogs.length > 0 ? (
                            <motion.div
                                className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8"
                                variants={stagger}
                                initial="hidden"
                                animate="visible"
                            >
                                {filteredBlogs.map(blog => (
                                    <motion.div
                                        key={blog._id}
                                        variants={fadeInUp}
                                        whileHover={{ y: -5 }}
                                    >
                                        <Link
                                            href={`/blog/${blog.slug}`}
                                            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden block h-full flex flex-col"
                                        >
                                            {/* Featured Image */}
                                            {blog.featuredImage && (
                                                <div className="relative h-32 md:h-48 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
                                                    <img
                                                        src={blog.featuredImage}
                                                        alt={blog.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                            )}
                                            {!blog.featuredImage && (
                                                <div className="h-32 md:h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                                    <Tag className="w-16 h-16 text-blue-300" />
                                                </div>
                                            )}

                                            {/* Content */}
                                            <div className="p-6 flex flex-col flex-1">
                                                <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                    {blog.title}
                                                </h2>

                                                <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                                                    {blog.excerpt}
                                                </p>

                                                {/* Meta Info */}
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4 mt-auto pt-4 border-t border-gray-100">
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
                                                        <span>{blog.viewCount}</span>
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
                                    </motion.div>
                                ))}
                            </motion.div>
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
