'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import Toast from '@/components/admin/Toast';

export default function EditBlogPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featuredImage: '',
        author: '',
        tags: '',
        metaTitle: '',
        metaDescription: '',
        status: 'draft',
    });

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
        message: '',
        type: 'info',
        isVisible: false
    });

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        setToast({ message, type, isVisible: true });
    };

    useEffect(() => {
        if (id) {
            fetchBlog();
        }
    }, [id]);

    const fetchBlog = async () => {
        try {
            const res = await fetch(`/api/admin/blog/${id}`);
            const data = await res.json();

            if (data.success) {
                const blog = data.data;
                setFormData({
                    title: blog.title,
                    slug: blog.slug,
                    excerpt: blog.excerpt || '',
                    content: blog.content,
                    featuredImage: blog.featuredImage || '',
                    author: blog.author,
                    tags: blog.tags.join(', '),
                    metaTitle: blog.metaTitle || '',
                    metaDescription: blog.metaDescription || '',
                    status: blog.status,
                });
            }
        } catch (error) {
            console.error('Error fetching blog:', error);
            showToast('Có lỗi khi tải bài viết', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent, status: string) => {
        e.preventDefault();

        if (!formData.title || !formData.content) {
            showToast('Vui lòng nhập tiêu đề và nội dung', 'error');
            return;
        }

        setSaving(true);

        try {
            const tagsArray = formData.tags
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0);

            const res = await fetch(`/api/admin/blog/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    tags: tagsArray,
                    status,
                }),
            });

            const data = await res.json();

            if (data.success) {
                showToast('Đã cập nhật bài viết!', 'success');
                setTimeout(() => {
                    router.push('/admin/blog');
                }, 1000);
            } else {
                showToast('Lỗi: ' + data.error, 'error');
            }
        } catch (error) {
            console.error('Error updating blog:', error);
            showToast('Có lỗi xảy ra khi cập nhật bài viết', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Đang tải bài viết...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />
            <div className="container mx-auto p-6 max-w-4xl">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href="/admin/blog"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Quay lại
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-800">Chỉnh sửa bài viết</h1>
                </div>

                {/* Form */}
                <form className="bg-white rounded-lg shadow-md p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tiêu đề <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập tiêu đề bài viết"
                            required
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Slug (URL)
                        </label>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="slug-bai-viet"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            URL: /blog/{formData.slug || 'slug-bai-viet'}
                        </p>
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Mô tả ngắn
                        </label>
                        <textarea
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                            placeholder="Mô tả ngắn về bài viết (hiển thị trong danh sách)"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Nội dung <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                            rows={15}
                            placeholder="Nhập nội dung bài viết..."
                            required
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Hỗ trợ văn bản thuần, xuống dòng tự động
                        </p>
                    </div>

                    {/* Featured Image */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Ảnh đại diện (URL)
                        </label>
                        <input
                            type="url"
                            value={formData.featuredImage}
                            onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    {/* Author */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tác giả
                        </label>
                        <input
                            type="text"
                            value={formData.author}
                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Tên tác giả"
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tags (phân cách bằng dấu phẩy)
                        </label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="laptop, hướng dẫn, đánh giá"
                        />
                    </div>

                    {/* SEO Section */}
                    <div className="border-t pt-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">SEO Settings</h2>

                        {/* Meta Title */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Meta Title
                            </label>
                            <input
                                type="text"
                                value={formData.metaTitle}
                                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Để trống để dùng tiêu đề bài viết"
                            />
                        </div>

                        {/* Meta Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Meta Description
                            </label>
                            <textarea
                                value={formData.metaDescription}
                                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={2}
                                placeholder="Để trống để dùng mô tả ngắn"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-6 border-t">
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, 'draft')}
                            disabled={saving}
                            className="flex-1 flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            {saving ? 'Đang lưu...' : 'Lưu bản nháp'}
                        </button>
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, 'published')}
                            disabled={saving}
                            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold disabled:opacity-50"
                        >
                            <Eye className="w-5 h-5" />
                            {saving ? 'Đang cập nhật...' : 'Cập nhật & Xuất bản'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
