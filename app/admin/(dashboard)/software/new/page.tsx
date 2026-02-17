'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, ArrowLeft, Upload, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import Toast from '@/components/admin/Toast';
import ImageUploader from '@/components/admin/ImageUploader';

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

export default function NewSoftwarePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featuredImage: '',
        downloadUrl: '',
        version: '',
        developer: '',
        category: 'Tiện ích',
        fileSize: '',
        platform: 'Windows',
        type: 'Free',
        tags: '',
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

    const [tagInput, setTagInput] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleContentChange = (content: string) => {
        setFormData(prev => ({ ...prev, content }));
    };

    const handleImageUpload = (url: string) => {
        setFormData(prev => ({ ...prev, featuredImage: url }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Process tags
            const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);

            const res = await fetch('/api/admin/software', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    tags: tagsArray
                }),
            });

            const data = await res.json();

            if (data.success) {
                showToast('Tạo phần mềm mới thành công!', 'success');
                setTimeout(() => {
                    router.push('/admin/software');
                }, 1000);
            } else {
                showToast('Lỗi: ' + data.error, 'error');
            }
        } catch (error) {
            console.error('Error creating software:', error);
            showToast('Có lỗi xảy ra khi tạo phần mềm', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />
            <div className="container mx-auto max-w-5xl p-6">
                <div className="flex items-center gap-4 mb-6">
                    <Link
                        href="/admin/software"
                        className="p-2 bg-white rounded-lg shadow hover:bg-gray-50 text-gray-600 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">Thêm phần mềm mới</h1>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Thông tin cơ bản</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề phần mềm *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        placeholder="VD: IDM Full Crack 2024"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL) - Để trống sẽ tự tạo</label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50"
                                        placeholder="vd: idm-full-crack-2024"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
                                    <textarea
                                        name="excerpt"
                                        value={formData.excerpt}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        placeholder="Mô tả ngắn gọn về phần mềm..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Content Editor */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Nội dung chi tiết</h2>
                            <div className="prose max-w-none">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.content}
                                    onChange={handleContentChange}
                                    className="h-96 mb-12"
                                    modules={{
                                        toolbar: [
                                            [{ 'header': [1, 2, 3, false] }],
                                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                            ['link', 'image', 'video'],
                                            ['clean']
                                        ],
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Settings & Meta */}
                    <div className="space-y-6">
                        {/* Publish Action */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border-t-4 border-blue-500">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800">Đăng tải</h2>

                            <div className="flex flex-col gap-4">
                                <label className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <span className="font-medium text-gray-700">Trạng thái</span>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="bg-white border text-sm rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="draft">Bản nháp</option>
                                        <option value="published">Công khai</option>
                                    </select>
                                </label>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-blue-500/30 transition-all transform active:scale-95 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            Lưu phần mềm
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Software Details */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Thông tin kỹ thuật</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Link Tải (Google Drive/Fshare)</label>
                                    <input
                                        type="url"
                                        name="downloadUrl"
                                        value={formData.downloadUrl}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phiên bản</label>
                                        <input
                                            type="text"
                                            name="version"
                                            value={formData.version}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border rounded-md text-sm outline-none"
                                            placeholder="v1.0.0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Dung lượng</label>
                                        <input
                                            type="text"
                                            name="fileSize"
                                            value={formData.fileSize}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border rounded-md text-sm outline-none"
                                            placeholder="Example: 50MB"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Danh mục</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-md text-sm outline-none bg-white"
                                    >
                                        <option value="Drivers">Drivers Laptop</option>
                                        <option value="Văn phòng">Văn phòng</option>
                                        <option value="Đồ họa">Đồ họa</option>
                                        <option value="Hệ thống">Hệ thống</option>
                                        <option value="Tiện ích">Tiện ích</option>
                                        <option value="Diệt Virus">Diệt Virus</option>
                                        <option value="Multimedia">Multimedia</option>
                                        <option value="Lập trình">Lập trình</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Loại</label>
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border rounded-md text-sm outline-none bg-white"
                                        >
                                            <option value="Free">Miễn phí</option>
                                            <option value="Crack">Full Crack</option>
                                            <option value="Repack">Repack</option>
                                            <option value="Portable">Portable</option>
                                            <option value="License">Bản quyền</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hệ điều hành</label>
                                        <select
                                            name="platform"
                                            value={formData.platform}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border rounded-md text-sm outline-none bg-white"
                                        >
                                            <option value="Windows">Windows</option>
                                            <option value="macOS">macOS</option>
                                            <option value="Linux">Linux</option>
                                            <option value="Android">Android</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tags (phân cách dấu phẩy)</label>
                                    <input
                                        type="text"
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-md text-sm outline-none"
                                        placeholder="word, excel, adobe..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Hình ảnh đại diện</h2>
                            <ImageUploader
                                value={formData.featuredImage ? [formData.featuredImage] : []}
                                onChange={(urls) => handleImageUpload(urls[0] || '')}
                                maxImages={1}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
