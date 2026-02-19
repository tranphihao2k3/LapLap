'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, FileText } from 'lucide-react';
import Toast from '@/components/admin/Toast';

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

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
        message: '',
        type: 'info',
        isVisible: false
    });

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        setToast({ message, type, isVisible: true });
    };

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
                showToast('Đã xóa bài viết thành công!', 'success');
                fetchBlogs();
            } else {
                showToast('Lỗi: ' + data.error, 'error');
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
            showToast('Có lỗi xảy ra khi xóa bài viết', 'error');
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
        <div className="min-h-screen bg-[#F8FAFC]">
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />
            <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 lg:px-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Quản lý Blog</h1>
                        <p className="text-sm text-slate-500 font-medium mt-1">Hệ thống biên tập và quản lý nội dung bài viết</p>
                    </div>
                    <Link
                        href="/admin/blog/new"
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-200 font-bold text-sm md:text-base active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        Tạo bài viết mới
                    </Link>
                </div>

                {/* Filter & Stats Bar */}
                <div className="bg-white rounded-2xl border border-slate-100 p-3 mb-6 shadow-sm overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-2 min-w-max">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3">Lọc trạng thái:</div>
                        <button
                            onClick={() => setFilterStatus('')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterStatus === ''
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            Tất cả ({blogs.length})
                        </button>
                        <button
                            onClick={() => setFilterStatus('published')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterStatus === 'published'
                                ? 'bg-emerald-600 text-white shadow-md'
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            Đã xuất bản
                        </button>
                        <button
                            onClick={() => setFilterStatus('draft')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterStatus === 'draft'
                                ? 'bg-amber-500 text-white shadow-md'
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            Bản nháp
                        </button>
                    </div>
                </div>

                {/* Blog Content */}
                {loading ? (
                    <div className="bg-white rounded-3xl border border-slate-100 p-20 text-center shadow-sm">
                        <div className="relative inline-flex mb-4">
                            <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
                            <FileText className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600" />
                        </div>
                        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Đang tải dữ liệu...</p>
                    </div>
                ) : blogs.length > 0 ? (
                    <div className="space-y-4">
                        {/* Desktop Header */}
                        <div className="hidden lg:grid grid-cols-[1fr_150px_120px_120px_150px] gap-4 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 items-center">
                            <div>Thông tin bài viết</div>
                            <div>Tác giả</div>
                            <div className="text-center">Trạng thái</div>
                            <div className="text-center">Số liệu</div>
                            <div className="text-right">Thao tác</div>
                        </div>

                        {/* Blog List Items */}
                        <div className="grid grid-cols-1 gap-3">
                            {blogs.map((blog) => (
                                <div key={blog._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden">
                                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_150px_120px_120px_150px] gap-4 p-4 lg:px-6 lg:py-4 items-center relative">
                                        {/* Content Preview */}
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-slate-800 text-sm md:text-base group-hover:text-blue-600 transition-colors line-clamp-2 uppercase tracking-tight leading-tight">
                                                    {blog.title}
                                                </h3>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                                        {formatDate(blog.createdAt)}
                                                    </span>
                                                    {blog.tags.slice(0, 3).map(tag => (
                                                        <span key={tag} className="text-[9px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg uppercase tracking-tighter">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Author (Desktop Only in column) */}
                                        <div className="hidden lg:block text-sm font-bold text-slate-600">
                                            {blog.author}
                                        </div>

                                        {/* Status */}
                                        <div className="flex lg:justify-center items-center justify-between mt-2 lg:mt-0 pt-2 lg:pt-0 border-t lg:border-none border-slate-50">
                                            <span className="lg:hidden text-[10px] font-bold text-slate-400 uppercase">Trạng thái:</span>
                                            <span
                                                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${blog.status === 'published'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-amber-100 text-amber-700'
                                                    }`}
                                            >
                                                {blog.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                                            </span>
                                        </div>

                                        {/* Views */}
                                        <div className="flex lg:justify-center items-center justify-between mt-1 lg:mt-0">
                                            <span className="lg:hidden text-[10px] font-bold text-slate-400 uppercase">Lượt xem:</span>
                                            <div className="flex items-center gap-1.5 text-slate-500 font-bold text-sm">
                                                <Eye className="w-4 h-4 text-slate-400" />
                                                {blog.viewCount}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-end gap-1.5 mt-4 lg:mt-0 pt-3 lg:pt-0 border-t lg:border-none border-slate-50 relative z-10">
                                            {blog.status === 'published' && (
                                                <a
                                                    href={`/blog/${blog.slug}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2.5 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all active:scale-90"
                                                    title="Xem bài viết"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </a>
                                            )}
                                            <Link
                                                href={`/admin/blog/edit/${blog._id}`}
                                                className="p-2.5 text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-all active:scale-90"
                                                title="Chỉnh sửa"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(blog._id, blog.title)}
                                                className="p-2.5 text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 transition-all active:scale-90"
                                                title="Xóa"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        {/* Mobile Author Info */}
                                        <div className="lg:hidden absolute top-4 right-4 animate-in fade-in duration-500 text-[10px] font-bold text-slate-300">
                                            {blog.author}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-16 text-center shadow-sm">
                        <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6 text-slate-200">
                            <FileText size={48} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Chưa có bài viết nào</h3>
                        <p className="text-slate-500 text-sm max-w-md mx-auto mb-8 font-medium">
                            {filterStatus
                                ? `Không tìm thấy bài viết nào với trạng thái "${filterStatus === 'published' ? 'Đã xuất bản' : 'Bản nháp'}"`
                                : 'Hãy bắt đầu xây dựng nội dung cho website của bạn bằng cách tạo bài viết mới ngay bây giờ!'}
                        </p>
                        <Link
                            href="/admin/blog/new"
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-2xl transition-all shadow-xl shadow-blue-100 font-bold hover:bg-blue-700 active:scale-95"
                        >
                            <Plus className="w-5 h-5" />
                            Viết bài ngay
                        </Link>
                    </div>
                )}

                {/* Navigation Footer */}
                <div className="mt-10 border-t border-slate-100 pt-6">
                    <Link
                        href="/admin"
                        className="inline-flex items-center gap-2 text-slate-400 font-bold text-sm uppercase tracking-widest hover:text-blue-600 transition-all group"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">←</span>
                        Quay lại trang chính
                    </Link>
                </div>
            </div>
        </div>
    );
}
