'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Search, Eye, EyeOff } from 'lucide-react';
import Toast from '@/components/admin/Toast';

interface Visitor {
    _id: string;
    label: string;
    ipAddress: string;
    userAgent: string;
    count: number;
    createdAt: string;
    updatedAt: string;
}

export default function VisitorsPage() {
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingVisitor, setEditingVisitor] = useState<Visitor | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
    const [formData, setFormData] = useState({
        label: '',
        ipAddress: '',
        userAgent: '',
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
        fetchVisitors();
    }, [pagination.page, searchQuery]);

    const fetchVisitors = async () => {
        try {
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
            });
            if (searchQuery) params.append('search', searchQuery);

            const res = await fetch(`/api/admin/visitors?${params}`);
            const data = await res.json();
            if (data.success) {
                setVisitors(data.data);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching visitors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingVisitor
                ? `/api/admin/visitors/${editingVisitor._id}`
                : '/api/admin/visitors';

            const method = editingVisitor ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                fetchVisitors();
                handleCloseModal();
                showToast(editingVisitor ? 'Cập nhật thành công!' : 'Tạo mới thành công!', 'success');
            } else {
                showToast('Lỗi: ' + data.error, 'error');
            }
        } catch (error) {
            console.error('Error saving visitor:', error);
            showToast('Lỗi lưu dữ liệu', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa visitor này?')) return;

        try {
            const res = await fetch(`/api/admin/visitors/${id}`, { method: 'DELETE' });
            const data = await res.json();

            if (data.success) {
                fetchVisitors();
                showToast('Xóa thành công!', 'success');
            } else {
                showToast('Lỗi: ' + data.error, 'error');
            }
        } catch (error) {
            console.error('Error deleting visitor:', error);
            showToast('Lỗi xóa dữ liệu', 'error');
        }
    };

    const handleEdit = (visitor: Visitor) => {
        setEditingVisitor(visitor);
        setFormData({
            label: visitor.label,
            ipAddress: visitor.ipAddress,
            userAgent: visitor.userAgent,
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingVisitor(null);
        setFormData({ label: '', ipAddress: '', userAgent: '' });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPagination({ ...pagination, page: 1 });
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
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Quản lý Visitors</h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">Theo dõi lượt truy cập và thống kê website</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-purple-200 font-bold text-sm md:text-base active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Thêm visitor
                </button>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-6">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo label hoặc IP..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all font-medium"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                    >
                        Tìm kiếm
                    </button>
                </div>
            </form>

            {/* Content Area */}
            {loading ? (
                <div className="bg-white rounded-3xl border border-slate-100 p-20 text-center shadow-sm">
                    <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-purple-600 animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Đang tải dữ liệu...</p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Label</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">IP Address</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Lượt truy cập</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Ngày tạo</th>
                                    <th className="px-6 py-4 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {visitors.map((visitor) => (
                                    <tr key={visitor._id} className="hover:bg-slate-50/50 transition-all">
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-slate-800">{visitor.label}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                                {visitor.ipAddress || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-bold">
                                                {visitor.count}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {new Date(visitor.createdAt).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(visitor)}
                                                    className="p-2.5 text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-all active:scale-90"
                                                    title="Sửa"
                                                >
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(visitor._id)}
                                                    className="p-2.5 text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 transition-all active:scale-90"
                                                    title="Xóa"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {visitors.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-16 text-center text-slate-400 font-bold text-sm uppercase tracking-widest italic">
                                            Chưa có dữ liệu visitor.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-sm text-slate-500">
                                Trang {pagination.page} / {pagination.pages} ({pagination.total} records)
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                                    disabled={pagination.page === 1}
                                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 transition-colors"
                                >
                                    Trước
                                </button>
                                <button
                                    onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                                    disabled={pagination.page === pagination.pages}
                                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 transition-colors"
                                >
                                    Sau
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                                {editingVisitor ? 'Chỉnh sửa visitor' : 'Thêm visitor mới'}
                            </h2>
                            <button onClick={handleCloseModal} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Label *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="VD: homepage, products, blog..."
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-400"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">IP Address</label>
                                <input
                                    type="text"
                                    placeholder="192.168.1.1"
                                    value={formData.ipAddress}
                                    onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all font-mono text-sm text-slate-600"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">User Agent</label>
                                <textarea
                                    value={formData.userAgent}
                                    onChange={(e) => setFormData({ ...formData, userAgent: e.target.value })}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all text-sm font-medium text-slate-700 h-24 resize-none"
                                    placeholder="Thông tin trình duyệt..."
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
                                    className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl transition-all shadow-lg shadow-purple-100 font-bold uppercase text-[10px] tracking-widest active:scale-95"
                                >
                                    {editingVisitor ? 'Cập nhật' : 'Tạo mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
