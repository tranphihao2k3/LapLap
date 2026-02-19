'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import Toast from '@/components/admin/Toast';

interface Category {
    _id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    createdAt: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        icon: 'Laptop',
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
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories');
            const data = await res.json();
            if (data.success) {
                setCategories(data.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingCategory
                ? `/api/admin/categories/${editingCategory._id}`
                : '/api/admin/categories';

            const method = editingCategory ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                fetchCategories();
                handleCloseModal();
                showToast(editingCategory ? 'Update successful!' : 'Create successful!', 'success');
            } else {
                showToast('Error: ' + data.error, 'error');
            }
        } catch (error) {
            console.error('Error saving category:', error);
            showToast('Error saving category', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            const res = await fetch(`/api/admin/categories/${id}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (data.success) {
                fetchCategories();
                showToast('Delete successful!', 'success');
            } else {
                showToast('Error: ' + data.error, 'error');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            showToast('Error deleting category', 'error');
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            slug: category.slug,
            description: category.description,
            icon: category.icon,
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCategory(null);
        setFormData({ name: '', slug: '', description: '', icon: 'Laptop' });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 lg:px-8 bg-[#F8FAFC] min-h-screen">
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Danh mục sản phẩm</h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">Quản lý các nhóm phân loại Laptop trong hệ thống</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-200 font-bold text-sm md:text-base active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Thêm danh mục
                </button>
            </div>

            {/* Categories Content Area */}
            {loading ? (
                <div className="bg-white rounded-3xl border border-slate-100 p-20 text-center shadow-sm">
                    <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Đang tải dữ liệu...</p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        {/* Desktop Header */}
                        <div className="hidden lg:grid grid-cols-[200px_150px_1fr_100px_150px] gap-4 px-8 py-4 bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest items-center">
                            <div>Tên danh mục</div>
                            <div>Slug / Mã định danh</div>
                            <div>Mô tả chi tiết</div>
                            <div className="text-center">Biểu tượng</div>
                            <div className="text-right">Thao tác</div>
                        </div>

                        {/* List Items */}
                        <div className="divide-y divide-slate-50">
                            {categories.map((category) => (
                                <div key={category._id} className="group hover:bg-slate-50/50 transition-all">
                                    <div className="grid grid-cols-1 lg:grid-cols-[200px_150px_1fr_100px_150px] gap-4 p-5 lg:px-8 lg:py-5 items-center relative">
                                        {/* Name Info */}
                                        <div className="flex items-center gap-3">
                                            <div className="font-bold text-slate-800 text-sm md:text-base group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                                {category.name}
                                            </div>
                                        </div>

                                        {/* Slug */}
                                        <div className="flex lg:flex-col items-center lg:items-start gap-2 lg:gap-0 mt-2 lg:mt-0 pt-2 lg:pt-0 border-t lg:border-none border-slate-50">
                                            <span className="lg:hidden text-[10px] font-bold text-slate-400 uppercase">Slug:</span>
                                            <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                                {category.slug}
                                            </span>
                                        </div>

                                        {/* Description */}
                                        <div className="flex lg:flex-col items-start gap-2 lg:gap-0 mt-1 lg:mt-0">
                                            <span className="lg:hidden text-[10px] font-bold text-slate-400 uppercase">Mô tả:</span>
                                            <span className="text-xs text-slate-500 line-clamp-2 italic">
                                                {category.description || 'Chưa có mô tả chi tiết...'}
                                            </span>
                                        </div>

                                        {/* Icon */}
                                        <div className="flex lg:justify-center items-center justify-between mt-1 lg:mt-0">
                                            <span className="lg:hidden text-[10px] font-bold text-slate-400 uppercase">Icon:</span>
                                            <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100">
                                                {category.icon}
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-end gap-2 mt-4 lg:mt-0 pt-3 lg:pt-0 border-t lg:border-none border-slate-50 relative z-10">
                                            <button
                                                onClick={() => handleEdit(category)}
                                                className="p-2.5 text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-all active:scale-90"
                                                title="Sửa"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category._id)}
                                                className="p-2.5 text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 transition-all active:scale-90"
                                                title="Xóa"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {categories.length === 0 && (
                                <div className="p-16 text-center text-slate-400 font-bold text-sm uppercase tracking-widest italic">
                                    Chưa có danh mục nào được tạo.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Optimized Category Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                                {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
                            </h2>
                            <button onClick={handleCloseModal} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Tên danh mục *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="VD: Gaming, Văn phòng..."
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-400"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Slug (Mã định danh)</label>
                                <input
                                    type="text"
                                    placeholder="Tự động tạo nếu để trống"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-mono text-sm text-slate-600"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Mô tả ngắn</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-700 h-24 resize-none"
                                    placeholder="Thông tin giới hạn về danh mục..."
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Icon (Lucide name)</label>
                                <input
                                    type="text"
                                    placeholder="VD: Laptop, Gamepad2..."
                                    value={formData.icon}
                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-xs"
                                />
                            </div>

                            <div className="flex gap-3 pt-6">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-3 border border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-colors uppercase text-[10px] tracking-widest"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all shadow-lg shadow-blue-100 font-bold uppercase text-[10px] tracking-widest active:scale-95"
                                >
                                    {editingCategory ? 'Cập nhật' : 'Tạo mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
