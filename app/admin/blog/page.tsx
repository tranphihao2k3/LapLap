'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, FileText } from 'lucide-react';

interface Blog {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    author: string;
    tags: string[];
    status: string;
    publishedAt: string;
    viewCount: number;
    createdAt: string;
    updatedAt: string;
}

export default function AdminBlogPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('');

    useEffect(() => {
        fetchBlogs();
    }, [filterStatus]);

    const fetchBlogs = async () => {
        try {
            const url = filterStatus
                ? `/api/admin/blog?status=${filterStatus}`
                : '/api/admin/blog';
            const res = await fetch(url);
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

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Bạn có chắc muốn xóa bài viết "${title}"?`)) {
            return;
        }

        try {
            const res = await fetch(`/api/admin/blog/${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();

            if (data.success) {
                alert('Đã xóa bài viết thành công!');
                fetchBlogs();
            } else {
                alert('Lỗi: ' + data.error);
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
            alert('Có lỗi xảy ra khi xóa bài viết');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto p-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Quản lý Blog</h1>
                            <p className="text-gray-600 mt-1">Tạo và quản lý bài viết blog</p>
                        </div>
                        <Link
                            href="/admin/blog/new"
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
                        >
                            <Plus className="w-5 h-5" />
                            Tạo bài viết mới
                        </Link>
                    </div>

                    {/* Filter */}
                    <div className="mt-6 flex gap-3">
                        <button
                            onClick={() => setFilterStatus('')}
                            className={`px-4 py-2 rounded-lg transition-colors ${filterStatus === ''
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            Tất cả ({blogs.length})
                        </button>
                        <button
                            onClick={() => setFilterStatus('published')}
                            className={`px-4 py-2 rounded-lg transition-colors ${filterStatus === 'published'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            Đã xuất bản
                        </button>
                        <button
                            onClick={() => setFilterStatus('draft')}
                            className={`px-4 py-2 rounded-lg transition-colors ${filterStatus === 'draft'
                                    ? 'bg-yellow-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            Bản nháp
                        </button>
                    </div>
                </div>

                {/* Blog List */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Đang tải...</p>
                    </div>
                ) : blogs.length > 0 ? (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="text-left p-4 font-semibold text-gray-700">Tiêu đề</th>
                                    <th className="text-left p-4 font-semibold text-gray-700">Tác giả</th>
                                    <th className="text-left p-4 font-semibold text-gray-700">Trạng thái</th>
                                    <th className="text-left p-4 font-semibold text-gray-700">Lượt xem</th>
                                    <th className="text-left p-4 font-semibold text-gray-700">Ngày tạo</th>
                                    <th className="text-right p-4 font-semibold text-gray-700">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {blogs.map((blog) => (
                                    <tr key={blog._id} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-start gap-3">
                                                <FileText className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">{blog.title}</h3>
                                                    <p className="text-sm text-gray-500 line-clamp-1">{blog.excerpt}</p>
                                                    {blog.tags.length > 0 && (
                                                        <div className="flex gap-1 mt-1">
                                                            {blog.tags.map(tag => (
                                                                <span
                                                                    key={tag}
                                                                    className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-600">{blog.author}</td>
                                        <td className="p-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${blog.status === 'published'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                    }`}
                                            >
                                                {blog.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Eye className="w-4 h-4" />
                                                {blog.viewCount}
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-600">{formatDate(blog.createdAt)}</td>
                                        <td className="p-4">
                                            <div className="flex justify-end gap-2">
                                                {blog.status === 'published' && (
                                                    <a
                                                        href={`/blog/${blog.slug}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Xem bài viết"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </a>
                                                )}
                                                <Link
                                                    href={`/admin/blog/edit/${blog._id}`}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(blog._id, blog.title)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Xóa"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg mb-4">
                            {filterStatus
                                ? `Không có bài viết nào với trạng thái "${filterStatus === 'published' ? 'Đã xuất bản' : 'Bản nháp'}"`
                                : 'Chưa có bài viết nào'}
                        </p>
                        <Link
                            href="/admin/blog/new"
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Tạo bài viết đầu tiên
                        </Link>
                    </div>
                )}

                {/* Back to Admin */}
                <div className="mt-6">
                    <Link
                        href="/admin"
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        ← Quay lại trang Admin
                    </Link>
                </div>
            </div>
        </div>
    );
}
