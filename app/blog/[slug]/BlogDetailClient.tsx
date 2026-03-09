'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Tag, Share2 } from 'lucide-react';
import { getBlogs } from '@/lib/api/admin';

interface Blog {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    tags: string[];
}

interface BlogDetailClientProps {
    blog: Blog;
}

export default function BlogDetailClient({ blog }: BlogDetailClientProps) {
    const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        const fetchRelated = async () => {
            try {
                const res = await getBlogs();
                if (res.success && res.data) {
                    const related = res.data
                        .filter((b: Blog) =>
                            b._id !== blog._id &&
                            b.tags.some((tag: string) => blog.tags.includes(tag))
                        )
                        .slice(0, 3);
                    setRelatedBlogs(related as Blog[]);
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchRelated();
    }, [blog._id, blog.tags]);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: blog.title,
                    text: blog.excerpt,
                    url: window.location.href,
                });
            } catch (_) { }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Đã copy link bài viết!');
        }
    };

    return (
        <>
            {/* Share button */}
            <button
                onClick={handleShare}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors ml-auto"
            >
                <Share2 className="w-5 h-5" />
                <span>Chia sẻ</span>
            </button>

            {/* Content */}
            <div className="prose prose-lg prose-blue max-w-none mb-12 mt-6">
                <div
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />
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
                                <div className="h-40 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                    <Tag className="w-12 h-12 text-blue-300" />
                                </div>
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
        </>
    );
}
