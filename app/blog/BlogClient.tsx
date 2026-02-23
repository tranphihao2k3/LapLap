'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, User, Eye, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import TechLoader from '@/components/ui/TechLoader';

interface Blog {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    featuredImage: string;
    author: string;
    tags: string[];
    viewCount: number;
    publishedAt: string;
    createdAt: string;
}

export default function BlogClient() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTag, setSelectedTag] = useState<string>('');

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await fetch('/api/admin/blog?status=published');
                const data = await res.json();
                if (data.success) setBlogs(data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    const allTags = Array.from(new Set(blogs.flatMap(blog => blog.tags)));
    const filteredBlogs = selectedTag ? blogs.filter(b => b.tags.includes(selectedTag)) : blogs;

    if (loading) return <TechLoader />;

    return (
        <main className="flex-1 container mx-auto max-w-5xl p-4">
            <section className="relative w-full h-auto bg-gradient-to-r from-[#124A84] via-[#0d3560] to-[#0a2d54] text-white overflow-hidden shadow-lg border-b border-white/10 py-12 md:py-16 mb-8 -mx-4">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="container mx-auto max-w-5xl px-4 text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl font-black mb-4">Blog LapLap</h1>
                    <p className="text-lg text-blue-100 max-w-lg">Cập nhật xu hướng công nghệ & thủ thuật laptop mới nhất Cần Thơ.</p>
                </div>
            </section>

            {allTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                    <Button onClick={() => setSelectedTag('')} variant={selectedTag === '' ? 'primary' : 'outline'}>Tất cả</Button>
                    {allTags.map(tag => (
                        <Button key={tag} onClick={() => setSelectedTag(tag)} variant={selectedTag === tag ? 'primary' : 'outline'}>{tag}</Button>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBlogs.map(blog => (
                    <Link href={`/blog/${blog.slug}`} key={blog._id} className="group bg-white rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-xl transition-all">
                        <div className="h-48 overflow-hidden"><img src={blog.featuredImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-all" /></div>
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-3 group-hover:text-blue-600">{blog.title}</h2>
                            <p className="text-gray-600 line-clamp-3 mb-4">{blog.excerpt}</p>
                            <div className="text-xs text-gray-400 flex items-center gap-4 border-t pt-4">
                                <span className="flex items-center gap-1"><User size={14} /> {blog.author}</span>
                                <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(blog.publishedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    );
}
