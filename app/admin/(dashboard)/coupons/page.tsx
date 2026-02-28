'use client';

import { useState, useEffect } from 'react';
import {
    Plus, Search, Edit2, Trash2, Copy, CheckCircle, XCircle,
    Percent, DollarSign, Calendar, Hash, Tag
} from 'lucide-react';
import Toast from '@/components/admin/Toast';

interface Coupon {
    _id: string;
    code: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minOrderAmount: number;
    maxDiscountAmount: number;
    validFrom: string;
    validTo: string;
    maxUses: number;
    usedCount: number;
    isActive: boolean;
    createdAt: string;
}

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: 0,
        maxDiscountAmount: 0,
        validFrom: '',
        validTo: '',
        maxUses: 1,
        isActive: true,
    });

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
        message: '',
        type: 'info',
        isVisible: false
    });

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        setToast({ message, type, isVisible: true });
    };

    const fetchCoupons = async () => {
        try {
            const res = await fetch('/api/admin/coupons');
            const data = await res.json();
            if (data.success) {
                setCoupons(data.data);
            }
        } catch (error) {
            showToast('Lỗi tải dữ liệu', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleOpenModal = (coupon?: Coupon) => {
        if (coupon) {
            setEditingCoupon(coupon);
            setFormData({
                code: coupon.code,
                description: coupon.description,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                minOrderAmount: coupon.minOrderAmount,
                maxDiscountAmount: coupon.maxDiscountAmount,
                validFrom: coupon.validFrom.split('T')[0],
                validTo: coupon.validTo.split('T')[0],
                maxUses: coupon.maxUses,
                isActive: coupon.isActive,
            });
        } else {
            setEditingCoupon(null);
            setFormData({
                code: '',
                description: '',
                discountType: 'percentage',
                discountValue: 10,
                minOrderAmount: 0,
                maxDiscountAmount: 0,
                validFrom: new Date().toISOString().split('T')[0],
                validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                maxUses: 100,
                isActive: true,
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCoupon(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const url = editingCoupon 
                ? `/api/admin/coupons/${editingCoupon._id}`
                : '/api/admin/coupons';
            const method = editingCoupon ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                showToast(editingCoupon ? 'Cập nhật thành công!' : 'Tạo mã giảm giá thành công!');
                handleCloseModal();
                fetchCoupons();
            } else {
                showToast(data.error || 'Có lỗi xảy ra', 'error');
            }
        } catch (error) {
            showToast('Lỗi kết nối', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa mã giảm giá này?')) return;

        try {
            const res = await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
            const data = await res.json();

            if (data.success) {
                showToast('Đã xóa thành công!');
                fetchCoupons();
            } else {
                showToast(data.error || 'Lỗi khi xóa', 'error');
            }
        } catch (error) {
            showToast('Lỗi kết nối', 'error');
        }
    };

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        showToast('Đã sao chép mã!', 'success');
    };

    const isExpired = (validTo: string) => {
        return new Date(validTo) < new Date();
    };

    const isExhausted = (usedCount: number, maxUses: number) => {
        return usedCount >= maxUses;
    };

    const filteredCoupons = coupons.filter(c => {
        const matchesSearch = c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            c.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' ? true :
                            filterStatus === 'active' ? c.isActive && !isExpired(c.validTo) && !isExhausted(c.usedCount, c.maxUses) :
                            filterStatus === 'expired' ? isExpired(c.validTo) :
                            filterStatus === 'exhausted' ? isExhausted(c.usedCount, c.maxUses) :
                            !c.isActive;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 lg:px-8 bg-[#F8FAFC] min-h-screen">
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Tag className="w-7 h-7 md:w-8 md:h-8 text-blue-600" />
                        Mã giảm giá
                    </h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">Quản lý coupon và khuyến mãi</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-200 font-bold text-sm md:text-base active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Thêm mã giảm giá
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
                <div className="relative w-full lg:w-96">
                    <input
                        type="text"
                        placeholder="Tìm theo mã hoặc mô tả..."
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0 w-full lg:w-auto scrollbar-hide">
                    {[
                        { key: 'all', label: 'Tất cả' },
                        { key: 'active', label: 'Đang hoạt động' },
                        { key: 'expired', label: 'Hết hạn' },
                        { key: 'exhausted', label: 'Hết lượt' },
                        { key: 'inactive', label: 'Đã tắt' },
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setFilterStatus(key)}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 ${
                                filterStatus === key
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Coupons Grid */}
            {loading ? (
                <div className="bg-white rounded-3xl border border-slate-100 p-20 text-center shadow-sm">
                    <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Đang tải...</p>
                </div>
            ) : filteredCoupons.length === 0 ? (
                <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-16 text-center shadow-sm">
                    <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6 text-slate-200">
                        <Tag size={40} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Không tìm thấy mã giảm giá</h3>
                    <p className="text-slate-500 text-sm font-medium">Thử thay đổi bộ lọc hoặc tạo mã mới.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCoupons.map((coupon) => {
                        const expired = isExpired(coupon.validTo);
                        const exhausted = isExhausted(coupon.usedCount, coupon.maxUses);
                        const active = coupon.isActive && !expired && !exhausted;

                        return (
                            <div key={coupon._id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${
                                active ? 'border-slate-200' : 'border-slate-100 opacity-75'
                            }`}>
                                <div className={`h-2 ${active ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-slate-200'}`} />
                                
                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-2xl font-black text-slate-800 tracking-wider">
                                                    {coupon.code}
                                                </span>
                                                <button
                                                    onClick={() => copyToClipboard(coupon.code)}
                                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Copy size={16} />
                                                </button>
                                            </div>
                                            <p className="text-sm text-slate-500 line-clamp-2">{coupon.description}</p>
                                        </div>
                                        <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                            active 
                                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                                : expired
                                                    ? 'bg-rose-50 text-rose-600 border border-rose-100'
                                                    : exhausted
                                                        ? 'bg-amber-50 text-amber-600 border border-amber-100'
                                                        : 'bg-slate-50 text-slate-400 border border-slate-100'
                                        }`}>
                                            {active ? 'Hoạt động' : expired ? 'Hết hạn' : exhausted ? 'Hết lượt' : 'Tắt'}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex items-center gap-2">
                                            {coupon.discountType === 'percentage' ? (
                                                <Percent size={18} className="text-blue-600" />
                                            ) : (
                                                <DollarSign size={18} className="text-blue-600" />
                                            )}
                                            <span className="text-xl font-black text-slate-800">
                                                {coupon.discountType === 'percentage' 
                                                    ? `${coupon.discountValue}%` 
                                                    : `${coupon.discountValue.toLocaleString()}đ`}
                                            </span>
                                        </div>
                                        {coupon.maxDiscountAmount > 0 && coupon.discountType === 'percentage' && (
                                            <span className="text-xs text-slate-400">
                                                Tối đa {coupon.maxDiscountAmount.toLocaleString()}đ
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-2 text-xs text-slate-500 mb-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} />
                                            <span>
                                                {new Date(coupon.validFrom).toLocaleDateString('vi-VN')} - {new Date(coupon.validTo).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Hash size={14} />
                                            <span>Đã dùng: {coupon.usedCount}/{coupon.maxUses}</span>
                                        </div>
                                        {coupon.minOrderAmount > 0 && (
                                            <div className="text-slate-400">
                                                Đơn tối thiểu: {coupon.minOrderAmount.toLocaleString()}đ
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2 pt-4 border-t border-slate-100">
                                        <button
                                            onClick={() => handleOpenModal(coupon)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all text-xs font-bold uppercase tracking-wider"
                                        >
                                            <Edit2 size={14} />
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(coupon._id)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all text-xs font-bold uppercase tracking-wider"
                                        >
                                            <Trash2 size={14} />
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-20">
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">
                                {editingCoupon ? 'Cập nhật mã' : 'Thêm mã giảm giá'}
                            </h2>
                            <button onClick={handleCloseModal} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <XCircle className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Mã code *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.code}
                                    onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-800 uppercase tracking-wider"
                                    placeholder="VD: SALE50"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Mô tả</label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-slate-700"
                                    placeholder="Mô tả ngắn về mã giảm giá"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Loại giảm giá</label>
                                    <select
                                        value={formData.discountType}
                                        onChange={e => setFormData({ ...formData, discountType: e.target.value as 'percentage' | 'fixed' })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-700"
                                    >
                                        <option value="percentage">Phần trăm (%)</option>
                                        <option value="fixed">Số tiền cố định</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                        {formData.discountType === 'percentage' ? 'Phần trăm (%)' : 'Số tiền (VNĐ)'}
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.discountValue}
                                        onChange={e => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
                                    />
                                </div>
                            </div>

                            {formData.discountType === 'percentage' && (
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Giảm tối đa (VNĐ)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.maxDiscountAmount}
                                        onChange={e => setFormData({ ...formData, maxDiscountAmount: Number(e.target.value) })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
                                        placeholder="0 = Không giới hạn"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Đơn hàng tối thiểu (VNĐ)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.minOrderAmount}
                                    onChange={e => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
                                    placeholder="0 = Không yêu cầu"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Hiệu lực từ *</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.validFrom}
                                        onChange={e => setFormData({ ...formData, validFrom: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Hiệu lực đến *</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.validTo}
                                        onChange={e => setFormData({ ...formData, validTo: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-700"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Số lần sử dụng tối đa</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.maxUses}
                                    onChange={e => setFormData({ ...formData, maxUses: Number(e.target.value) })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
                                />
                            </div>

                            <div className="flex items-center gap-3 py-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="isActive" className="text-sm font-bold text-slate-700 cursor-pointer">
                                    Kích hoạt mã giảm giá
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-50">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-6 py-3.5 rounded-xl text-slate-500 font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors text-sm"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3.5 rounded-xl bg-blue-600 text-white font-bold uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 text-sm"
                                >
                                    {editingCoupon ? 'Cập nhật' : 'Tạo mã'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
