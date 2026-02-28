'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Search, DollarSign, CreditCard } from 'lucide-react';
import Toast from '@/components/admin/Toast';

interface Customer {
    _id: string;
    name: string;
    phone: string;
    email: string;
}

interface Supplier {
    _id: string;
    name: string;
    phone: string;
    email: string;
}

interface Debt {
    _id: string;
    debtType: string;
    customerId: Customer | string;
    supplierId: Supplier | string;
    amount: number;
    paidAmount: number;
    remainingAmount: number;
    description: string;
    dueDate: string;
    status: string;
    createdAt: string;
}

export default function DebtsPage() {
    const [debts, setDebts] = useState<Debt[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
    const [payingDebt, setPayingDebt] = useState<Debt | null>(null);
    const [filterType, setFilterType] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [formData, setFormData] = useState({
        debtType: 'customer',
        customerId: '',
        supplierId: '',
        amount: 0,
        description: '',
        dueDate: '',
        status: 'pending',
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
        fetchDebts();
        fetchCustomers();
        fetchSuppliers();
    }, [pagination.page, filterType, filterStatus]);

    const fetchCustomers = async () => {
        try {
            const res = await fetch('/api/customers?limit=100');
            const data = await res.json();
            if (data.success) setCustomers(data.data || []);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const res = await fetch('/api/suppliers?limit=100');
            const data = await res.json();
            if (data.success) setSuppliers(data.data || []);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    const fetchDebts = async () => {
        try {
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
            });
            if (filterType) params.append('debtType', filterType);
            if (filterStatus) params.append('status', filterStatus);

            const res = await fetch(`/api/admin/debts?${params}`);
            const data = await res.json();
            if (data.success) {
                setDebts(data.data);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching debts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingDebt
                ? `/api/admin/debts/${editingDebt._id}`
                : '/api/admin/debts';

            const method = editingDebt ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                fetchDebts();
                handleCloseModal();
                showToast(editingDebt ? 'Cập nhật thành công!' : 'Tạo mới thành công!', 'success');
            } else {
                showToast('Lỗi: ' + data.error, 'error');
            }
        } catch (error) {
            console.error('Error saving debt:', error);
            showToast('Lỗi lưu dữ liệu', 'error');
        }
    };

    const handlePayment = async () => {
        if (!payingDebt || paymentAmount <= 0) return;

        try {
            const newPaidAmount = payingDebt.paidAmount + paymentAmount;
            const newStatus = newPaidAmount >= payingDebt.amount ? 'paid' : 'partial';

            const res = await fetch(`/api/admin/debts/${payingDebt._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paidAmount: newPaidAmount,
                    status: newStatus
                }),
            });

            const data = await res.json();

            if (data.success) {
                setShowPaymentModal(false);
                setPaymentAmount(0);
                setPayingDebt(null);
                fetchDebts();
                showToast('Thanh toán thành công!', 'success');
            } else {
                showToast('Lỗi: ' + data.error, 'error');
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            showToast('Lỗi thanh toán', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa bản ghi này?')) return;

        try {
            const res = await fetch(`/api/admin/debts/${id}`, { method: 'DELETE' });
            const data = await res.json();

            if (data.success) {
                fetchDebts();
                showToast('Xóa thành công!', 'success');
            } else {
                showToast('Lỗi: ' + data.error, 'error');
            }
        } catch (error) {
            console.error('Error deleting debt:', error);
            showToast('Lỗi xóa dữ liệu', 'error');
        }
    };

    const handleEdit = (debt: Debt) => {
        setEditingDebt(debt);
        const custId = typeof debt.customerId === 'object' ? debt.customerId._id : debt.customerId;
        const suppId = typeof debt.supplierId === 'object' ? debt.supplierId._id : debt.supplierId;
        setFormData({
            debtType: debt.debtType || 'customer',
            customerId: custId || '',
            supplierId: suppId || '',
            amount: debt.amount,
            description: debt.description || '',
            dueDate: debt.dueDate ? debt.dueDate.split('T')[0] : '',
            status: debt.status || 'pending',
        });
        setShowModal(true);
    };

    const openPaymentModal = (debt: Debt) => {
        setPayingDebt(debt);
        setPaymentAmount(debt.remainingAmount);
        setShowPaymentModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingDebt(null);
        setFormData({
            debtType: 'customer',
            customerId: '',
            supplierId: '',
            amount: 0,
            description: '',
            dueDate: '',
            status: 'pending',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-700',
            partial: 'bg-blue-100 text-blue-700',
            paid: 'bg-green-100 text-green-700',
            overdue: 'bg-red-100 text-red-700',
        };
        return styles[status] || 'bg-slate-100 text-slate-700';
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            pending: 'Chờ thanh toán',
            partial: 'Thanh toán một phần',
            paid: 'Đã thanh toán',
            overdue: 'Quá hạn',
        };
        return labels[status] || status;
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
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Quản lý công nợ</h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">Quản lý công nợ khách hàng và nhà cung cấp</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-purple-200 font-bold text-sm md:text-base active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Thêm công nợ
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
                    <option value="customer">Công nợ khách hàng</option>
                    <option value="supplier">Công nợ nhà cung cấp</option>
                </select>
                <select
                    value={filterStatus}
                    onChange={(e) => { setFilterStatus(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
                    className="px-4 py-3 bg-white border border-slate-200 rounded-xl font-medium focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="pending">Chờ thanh toán</option>
                    <option value="partial">Thanh toán một phần</option>
                    <option value="paid">Đã thanh toán</option>
                    <option value="overdue">Quá hạn</option>
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
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Loại</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Khách/NCC</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Tổng tiền</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Đã trả</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Còn lại</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Ngày đến hạn</th>
                                    <th className="px-6 py-4 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {debts.map((debt) => (
                                    <tr key={debt._id} className="hover:bg-slate-50/50 transition-all">
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${debt.debtType === 'customer' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                                {debt.debtType === 'customer' ? 'Khách hàng' : 'Nhà cung cấp'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-800">
                                                {debt.debtType === 'customer' 
                                                    ? (typeof debt.customerId === 'object' ? debt.customerId.name : 'N/A')
                                                    : (typeof debt.supplierId === 'object' ? debt.supplierId.name : 'N/A')
                                                }
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-800">
                                            {formatCurrency(debt.amount)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-green-600">
                                            {formatCurrency(debt.paidAmount)}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-red-600">
                                            {formatCurrency(debt.remainingAmount)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(debt.status)}`}>
                                                {getStatusLabel(debt.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {debt.dueDate ? new Date(debt.dueDate).toLocaleDateString('vi-VN') : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {debt.remainingAmount > 0 && (
                                                    <button
                                                        onClick={() => openPaymentModal(debt)}
                                                        className="p-2.5 text-green-600 bg-green-50 rounded-xl hover:bg-green-100 transition-all active:scale-90"
                                                        title="Thanh toán"
                                                    >
                                                        <CreditCard className="w-5 h-5" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleEdit(debt)}
                                                    className="p-2.5 text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-all active:scale-90"
                                                    title="Sửa"
                                                >
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(debt._id)}
                                                    className="p-2.5 text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 transition-all active:scale-90"
                                                    title="Xóa"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {debts.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-16 text-center text-slate-400 font-bold text-sm uppercase tracking-widest italic">
                                            Chưa có công nợ nào.
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

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300 overflow-y-auto">
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-8 my-8 animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                                {editingDebt ? 'Chỉnh sửa công nợ' : 'Thêm công nợ mới'}
                            </h2>
                            <button onClick={handleCloseModal} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Loại công nợ *</label>
                                <select
                                    required
                                    value={formData.debtType}
                                    onChange={(e) => setFormData({ ...formData, debtType: e.target.value, customerId: '', supplierId: '' })}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all font-bold text-slate-800"
                                >
                                    <option value="customer">Công nợ khách hàng</option>
                                    <option value="supplier">Công nợ nhà cung cấp</option>
                                </select>
                            </div>

                            {formData.debtType === 'customer' ? (
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Khách hàng *</label>
                                    <select
                                        required
                                        value={formData.customerId}
                                        onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all font-bold text-slate-800"
                                    >
                                        <option value="">Chọn khách hàng</option>
                                        {customers.map(c => (
                                            <option key={c._id} value={c._id}>{c.name} - {c.phone}</option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Nhà cung cấp *</label>
                                    <select
                                        required
                                        value={formData.supplierId}
                                        onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all font-bold text-slate-800"
                                    >
                                        <option value="">Chọn nhà cung cấp</option>
                                        {suppliers.map(s => (
                                            <option key={s._id} value={s._id}>{s.name} - {s.phone}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Số tiền *</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all font-bold text-slate-800"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Ngày đến hạn</label>
                                <input
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all font-bold text-slate-800"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Mô tả</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all text-sm font-medium h-20 resize-none"
                                    placeholder="Mô tả công nợ..."
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
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
                                    {editingDebt ? 'Cập nhật' : 'Tạo mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && payingDebt && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                                Thanh toán công nợ
                            </h2>
                            <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-slate-50 p-4 rounded-xl">
                                <p className="text-sm text-slate-500">Tổng tiền</p>
                                <p className="text-xl font-bold text-slate-800">{formatCurrency(payingDebt.amount)}</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-xl">
                                <p className="text-sm text-green-600">Đã thanh toán</p>
                                <p className="text-xl font-bold text-green-600">{formatCurrency(payingDebt.paidAmount)}</p>
                            </div>
                            <div className="bg-red-50 p-4 rounded-xl">
                                <p className="text-sm text-red-600">Còn lại</p>
                                <p className="text-xl font-bold text-red-600">{formatCurrency(payingDebt.remainingAmount)}</p>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Số tiền thanh toán</label>
                                <input
                                    type="number"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(parseInt(e.target.value) || 0)}
                                    max={payingDebt.remainingAmount}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all font-bold text-slate-800"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="flex-1 px-4 py-3 border border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-colors uppercase text-[10px] tracking-widest"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handlePayment}
                                    className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl transition-all shadow-lg shadow-green-100 font-bold uppercase text-[10px] tracking-widest active:scale-95"
                                >
                                    Thanh toán
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
