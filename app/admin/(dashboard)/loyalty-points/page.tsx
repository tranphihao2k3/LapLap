'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Search, Gift, TrendingUp, TrendingDown } from 'lucide-react';
import Toast from '@/components/admin/Toast';

interface Customer {
    _id: string;
    name: string;
    phone: string;
    email: string;
}

interface LoyaltyPoints {
    _id: string;
    customerId: Customer;
    points: number;
    pointsType: string;
    description: string;
    orderId: string;
    createdAt: string;
}

export default function LoyaltyPointsPage() {
    const [records, setRecords] = useState<LoyaltyPoints[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState<LoyaltyPoints | null>(null);
    const [filterType, setFilterType] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [formData, setFormData] = useState({
        customerId: '',
        points: 0,
        pointsType: 'earn',
        description: '',
        orderId: '',
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
        fetchRecords();
        fetchCustomers();
    }, [pagination.page, filterType, searchQuery]);

    const fetchCustomers = async () => {
        try {
            const res = await fetch('/api/customers?limit=100');
            const data = await res.json();
            if (data.success) setCustomers(data.data || []);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const fetchRecords = async () => {
        try {
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
            });
            if (filterType) params.append('pointsType', filterType);

            const res = await fetch(`/api/admin/loyalty-points?${params}`);
            const data = await res.json();
            if (data.success) {
                setRecords(data.data);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching loyalty points:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingRecord
                ? `/api/admin/loyalty-points/${editingRecord._id}`
                : '/api/admin/loyalty-points';

            const method = editingRecord ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                fetchRecords();
                handleCloseModal();
                showToast(editingRecord ? 'Cập nhật thành công!' : 'Tạo mới thành công!', 'success');
            } else {
                showToast('Lỗi: ' + data.error, 'error');
            }
        } catch (error) {
            console.error('Error saving loyalty points:', error);
            showToast('Lỗi lưu dữ liệu', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa bản ghi này?')) return;

        try {
            const res = await fetch(`/api/admin/loyalty-points/${id}`, { method: 'DELETE' });
            const data = await res.json();

            if (data.success) {
                fetchRecords();
                showToast('Xóa thành công!', 'success');
            } else {
                showToast('Lỗi: ' + data.error, 'error');
            }
        } catch (error) {
            console.error('Error deleting record:', error);
            showToast('Lỗi xóa dữ liệu', 'error');
        }
    };

    const handleEdit = (record: LoyaltyPoints) => {
        setEditingRecord(record);
        setFormData({
            customerId: typeof record.customerId === 'object' ? record.customerId._id : record.customerId,
            points: record.points,
            pointsType: record.pointsType || 'earn',
            description: record.description || '',
            orderId: record.orderId || '',
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingRecord(null);
        setFormData({ customerId: '', points: 0, pointsType: 'earn', description: '', orderId: '' });
    };

    const getTypeBadge = (type: string) => {
        const styles: Record<string, string> = {
            earn: 'bg-green-100 text-green-700',
            redeem: 'bg-red-100 text-red-700',
            bonus: 'bg-purple-100 text-purple-700',
            expired: 'bg-slate-100 text-slate-700',
        };
        return styles[type] || 'bg-slate-100 text-slate-700';
    };

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            earn: 'Tích điểm',
            redeem: 'Đổi điểm',
            bonus: 'Thưởng',
            expired: 'Hết hạn',
        };
        return labels[type] || type;
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
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Điểm thưởng</h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">Quản lý điểm thưởng tích lũy của khách hàng</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-purple-200 font-bold text-sm md:text-base active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Thêm điểm
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <select
                    value={filterType}
                    onChange={(e) => { setFilterType(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
                    className="px-4 py-3 bg-white border border-slate-200 rounded-xl font-medium focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none"
                >
                    <option value="">Tất cả loại</option>
                    <option value="earn">Tích điểm</option>
                    <option value="redeem">Đổi điểm</option>
                    <option value="bonus">Thưởng</option>
                    <option value="expired">Hết hạn</option>
                </select>
            </div>

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
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Khách hàng</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Điểm</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Loại</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Mô tả</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Ngày</th>
                                    <th className="px-6 py-4 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {records.map((record) => (
                                    <tr key={record._id} className="hover:bg-slate-50/50 transition-all">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-800">
                                                {typeof record.customerId === 'object' ? record.customerId.name : 'N/A'}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {typeof record.customerId === 'object' ? record.customerId.phone : ''}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {record.pointsType === 'earn' || record.pointsType === 'bonus' ? (
                                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <TrendingDown className="w-4 h-4 text-red-600" />
                                                )}
                                                <span className={`font-bold ${record.pointsType === 'earn' || record.pointsType === 'bonus' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {record.pointsType === 'earn' || record.pointsType === 'bonus' ? '+' : '-'}{record.points}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeBadge(record.pointsType)}`}>
                                                {getTypeLabel(record.pointsType)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {record.description || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {new Date(record.createdAt).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(record)}
                                                    className="p-2.5 text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-all active:scale-90"
                                                    title="Sửa"
                                                >
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(record._id)}
                                                    className="p-2.5 text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 transition-all active:scale-90"
                                                    title="Xóa"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {records.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-16 text-center text-slate-400 font-bold text-sm uppercase tracking-widest italic">
                                            Chưa có bản ghi điểm thưởng nào.
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
                                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium disabled:opacity-50"
                                >
                                    Trước
                                </button>
                                <button
                                    onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                                    disabled={pagination.page === pagination.pages}
                                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium disabled:opacity-50"
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
                                {editingRecord ? 'Chỉnh sửa điểm thưởng' : 'Thêm điểm thưởng'}
                            </h2>
                            <button onClick={handleCloseModal} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Khách hàng *</label>
                                <select
                                    required
                                    value={formData.customerId}
                                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all font-bold text-slate-800"
                                >
                                    <option value="">Chọn khách hàng</option>
                                    {customers.map(cust => (
                                        <option key={cust._id} value={cust._id}>{cust.name} - {cust.phone}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Số điểm *</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.points}
                                    onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all font-bold text-slate-800"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Loại điểm</label>
                                <select
                                    value={formData.pointsType}
                                    onChange={(e) => setFormData({ ...formData, pointsType: e.target.value })}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all font-bold text-slate-800"
                                >
                                    <option value="earn">Tích điểm</option>
                                    <option value="redeem">Đổi điểm</option>
                                    <option value="bonus">Thưởng</option>
                                    <option value="expired">Hết hạn</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Mô tả</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all text-sm font-medium h-20 resize-none"
                                    placeholder="Mô tả điểm thưởng..."
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
                                    {editingRecord ? 'Cập nhật' : 'Tạo mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
