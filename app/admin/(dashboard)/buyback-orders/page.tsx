'use client';

import { useState, useEffect } from 'react';
import {
    Plus, Search, Edit2, Trash2, Eye, CheckCircle, XCircle,
    Clock, Package, DollarSign, User, X
} from 'lucide-react';
import Toast from '@/components/admin/Toast';
import ImageUploader from '@/components/admin/ImageUploader';

interface BuybackOrder {
    _id: string;
    buybackNumber: string;
    sellerName: string;
    sellerPhone: string;
    sellerIdNumber: string;
    sellerAddress: string;
    productInfo: {
        brand: string;
        model: string;
        serialNumber: string;
        condition: string;
        specs: Record<string, any>;
    };
    images: string[];
    buyPrice: number;
    inspectionNotes: string;
    inspectedBy?: { name: string };
    inspectedAt?: string;
    status: 'pending' | 'inspecting' | 'approved' | 'rejected' | 'cancelled';
    approvedBy?: { name: string };
    approvedAt?: string;
    rejectionReason: string;
    paymentMethod: 'cash' | 'bank' | 'qr';
    paidAt?: string;
    notes: string;
    createdAt: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string; icon: any }> = {
    pending: { label: 'Chờ duyệt', color: 'bg-amber-100 text-amber-600', icon: Clock },
    inspecting: { label: 'Đang kiểm tra', color: 'bg-blue-100 text-blue-600', icon: Eye },
    approved: { label: 'Đã duyệt', color: 'bg-emerald-100 text-emerald-600', icon: CheckCircle },
    rejected: { label: 'Từ chối', color: 'bg-rose-100 text-rose-600', icon: XCircle },
    cancelled: { label: 'Đã hủy', color: 'bg-slate-100 text-slate-500', icon: X },
};

export default function BuybackOrdersPage() {
    const [orders, setOrders] = useState<BuybackOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<BuybackOrder | null>(null);
    const [editingOrder, setEditingOrder] = useState<BuybackOrder | null>(null);

    const [formData, setFormData] = useState({
        sellerName: '',
        sellerPhone: '',
        sellerIdNumber: '',
        sellerAddress: '',
        productInfo: {
            brand: '',
            model: '',
            serialNumber: '',
            condition: '',
            specs: {},
        },
        images: [] as string[],
        buyPrice: 0,
        inspectionNotes: '',
        status: 'pending',
        paymentMethod: 'cash',
        notes: '',
    });

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
        message: '',
        type: 'info',
        isVisible: false
    });

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        setToast({ message, type, isVisible: true });
    };

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/admin/buyback-orders');
            const data = await res.json();
            if (data.success) {
                setOrders(data.data);
            }
        } catch (error) {
            showToast('Lỗi tải dữ liệu', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleOpenModal = (order?: BuybackOrder) => {
        if (order) {
            setEditingOrder(order);
            setFormData({
                sellerName: order.sellerName,
                sellerPhone: order.sellerPhone,
                sellerIdNumber: order.sellerIdNumber,
                sellerAddress: order.sellerAddress,
                productInfo: order.productInfo,
                images: order.images,
                buyPrice: order.buyPrice,
                inspectionNotes: order.inspectionNotes,
                status: order.status,
                paymentMethod: order.paymentMethod,
                notes: order.notes,
            });
        } else {
            setEditingOrder(null);
            setFormData({
                sellerName: '',
                sellerPhone: '',
                sellerIdNumber: '',
                sellerAddress: '',
                productInfo: {
                    brand: '',
                    model: '',
                    serialNumber: '',
                    condition: '',
                    specs: {},
                },
                images: [],
                buyPrice: 0,
                inspectionNotes: '',
                status: 'pending',
                paymentMethod: 'cash',
                notes: '',
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingOrder(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const url = editingOrder 
                ? `/api/admin/buyback-orders/${editingOrder._id}`
                : '/api/admin/buyback-orders';
            const method = editingOrder ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                showToast(editingOrder ? 'Cập nhật thành công!' : 'Tạo đơn thu cũ thành công!');
                handleCloseModal();
                fetchOrders();
            } else {
                showToast(data.error || 'Có lỗi xảy ra', 'error');
            }
        } catch (error) {
            showToast('Lỗi kết nối', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa đơn này?')) return;

        try {
            const res = await fetch(`/api/admin/buyback-orders/${id}`, { method: 'DELETE' });
            const data = await res.json();

            if (data.success) {
                showToast('Đã xóa thành công!');
                fetchOrders();
            } else {
                showToast(data.error || 'Lỗi khi xóa', 'error');
            }
        } catch (error) {
            showToast('Lỗi kết nối', 'error');
        }
    };

    const handleUpdateStatus = async (id: string, status: string, additionalData?: any) => {
        try {
            const res = await fetch(`/api/admin/buyback-orders/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, ...additionalData }),
            });

            const data = await res.json();

            if (data.success) {
                showToast('Cập nhật trạng thái thành công!');
                fetchOrders();
                if (isDetailModalOpen) {
                    setSelectedOrder(data.data);
                }
            }
        } catch (error) {
            showToast('Lỗi kết nối', 'error');
        }
    };

    const filteredOrders = orders.filter(o => {
        const matchesSearch = o.buybackNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            o.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            o.sellerPhone.includes(searchTerm) ||
                            o.productInfo.model.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' ? true : o.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

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
                        <Package className="w-7 h-7 md:w-8 md:h-8 text-blue-600" />
                        Thu cũ đổi mới
                    </h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">Quản lý đơn thu mua laptop cũ</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-200 font-bold text-sm md:text-base active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Tạo đơn thu cũ
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
                <div className="relative w-full lg:w-96">
                    <input
                        type="text"
                        placeholder="Tìm theo mã đơn, tên, SĐT, model..."
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0 w-full lg:w-auto scrollbar-hide">
                    {[
                        { key: 'all', label: 'Tất cả' },
                        { key: 'pending', label: 'Chờ duyệt' },
                        { key: 'inspecting', label: 'Đang kiểm' },
                        { key: 'approved', label: 'Đã duyệt' },
                        { key: 'rejected', label: 'Từ chối' },
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

            {/* Orders Table */}
            {loading ? (
                <div className="bg-white rounded-3xl border border-slate-100 p-20 text-center shadow-sm">
                    <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Đang tải...</p>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-16 text-center shadow-sm">
                    <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6 text-slate-200">
                        <Package size={40} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Không tìm thấy đơn thu cũ</h3>
                    <p className="text-slate-500 text-sm font-medium">Tạo đơn mới để bắt đầu.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Mã đơn</th>
                                    <th className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Người bán</th>
                                    <th className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Sản phẩm</th>
                                    <th className="px-4 py-3 text-right text-xs font-black text-slate-500 uppercase tracking-wider">Giá mua</th>
                                    <th className="px-4 py-3 text-center text-xs font-black text-slate-500 uppercase tracking-wider">Trạng thái</th>
                                    <th className="px-4 py-3 text-center text-xs font-black text-slate-500 uppercase tracking-wider">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredOrders.map((order) => {
                                    const StatusIcon = STATUS_LABELS[order.status].icon;
                                    return (
                                        <tr key={order._id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3">
                                                <span className="font-bold text-slate-800">{order.buybackNumber}</span>
                                                <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-slate-800">{order.sellerName}</div>
                                                <div className="text-xs text-slate-500">{order.sellerPhone}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm text-slate-800">{order.productInfo.brand} {order.productInfo.model}</div>
                                                <div className="text-xs text-slate-500">{order.productInfo.condition}</div>
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold text-slate-800">
                                                {formatPrice(order.buyPrice)}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${STATUS_LABELS[order.status].color}`}>
                                                    <StatusIcon size={12} />
                                                    {STATUS_LABELS[order.status].label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        onClick={() => { setSelectedOrder(order); setIsDetailModalOpen(true); }}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                        title="Xem chi tiết"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenModal(order)}
                                                        className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                                                        title="Sửa"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(order._id)}
                                                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-20">
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">
                                {editingOrder ? 'Cập nhật đơn' : 'Tạo đơn thu cũ mới'}
                            </h2>
                            <button onClick={handleCloseModal} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Thông tin người bán */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                    <User size={16} className="text-blue-600" />
                                    Thông tin người bán
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Họ tên *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.sellerName}
                                            onChange={e => setFormData({ ...formData, sellerName: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">SĐT *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.sellerPhone}
                                            onChange={e => setFormData({ ...formData, sellerPhone: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">CMND/CCCD</label>
                                        <input
                                            type="text"
                                            value={formData.sellerIdNumber}
                                            onChange={e => setFormData({ ...formData, sellerIdNumber: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Địa chỉ</label>
                                        <input
                                            type="text"
                                            value={formData.sellerAddress}
                                            onChange={e => setFormData({ ...formData, sellerAddress: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Thông tin sản phẩm */}
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                    <Package size={16} className="text-blue-600" />
                                    Thông tin sản phẩm
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Thương hiệu</label>
                                        <input
                                            type="text"
                                            value={formData.productInfo.brand}
                                            onChange={e => setFormData({ ...formData, productInfo: { ...formData.productInfo, brand: e.target.value } })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Model</label>
                                        <input
                                            type="text"
                                            value={formData.productInfo.model}
                                            onChange={e => setFormData({ ...formData, productInfo: { ...formData.productInfo, model: e.target.value } })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Số serial</label>
                                        <input
                                            type="text"
                                            value={formData.productInfo.serialNumber}
                                            onChange={e => setFormData({ ...formData, productInfo: { ...formData.productInfo, serialNumber: e.target.value } })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tình trạng</label>
                                        <input
                                            type="text"
                                            value={formData.productInfo.condition}
                                            onChange={e => setFormData({ ...formData, productInfo: { ...formData.productInfo, condition: e.target.value } })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
                                            placeholder="VD: 95%, có trầy nhẹ..."
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Hình ảnh sản phẩm</label>
                                    <ImageUploader
                                        value={formData.images}
                                        onChange={(urls) => setFormData({ ...formData, images: urls })}
                                        maxImages={5}
                                    />
                                </div>
                            </div>

                            {/* Giá và thanh toán */}
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                    <DollarSign size={16} className="text-blue-600" />
                                    Giá và thanh toán
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Giá mua (VNĐ) *</label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            value={formData.buyPrice}
                                            onChange={e => setFormData({ ...formData, buyPrice: Number(e.target.value) })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Phương thức TT</label>
                                        <select
                                            value={formData.paymentMethod}
                                            onChange={e => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-700"
                                        >
                                            <option value="cash">Tiền mặt</option>
                                            <option value="bank">Chuyển khoản</option>
                                            <option value="qr">QR Code</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Ghi chú */}
                            <div className="pt-4 border-t border-slate-100">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ghi chú</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-slate-700 resize-none"
                                />
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
                                    {editingOrder ? 'Cập nhật' : 'Tạo đơn'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {isDetailModalOpen && selectedOrder && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-20">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                                    Chi tiết đơn {selectedOrder.buybackNumber}
                                </h2>
                                <p className="text-sm text-slate-500">Ngày tạo: {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</p>
                            </div>
                            <button onClick={() => setIsDetailModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Status */}
                            <div className={`p-4 rounded-xl ${STATUS_LABELS[selectedOrder.status].color} bg-opacity-20`}>
                                <div className="flex items-center justify-between">
                                    <span className="font-bold">Trạng thái: {STATUS_LABELS[selectedOrder.status].label}</span>
                                    <div className="flex gap-2">
                                        {selectedOrder.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateStatus(selectedOrder._id, 'inspecting')}
                                                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold"
                                                >
                                                    Bắt đầu kiểm tra
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(selectedOrder._id, 'cancelled')}
                                                    className="px-3 py-1.5 bg-slate-500 text-white rounded-lg text-xs font-bold"
                                                >
                                                    Hủy
                                                </button>
                                            </>
                                        )}
                                        {selectedOrder.status === 'inspecting' && (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateStatus(selectedOrder._id, 'approved', { approvedAt: new Date() })}
                                                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                                                >
                                                    Duyệt
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const reason = prompt('Lý do từ chối:');
                                                        if (reason) handleUpdateStatus(selectedOrder._id, 'rejected', { rejectionReason: reason });
                                                    }}
                                                    className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold"
                                                >
                                                    Từ chối
                                                </button>
                                            </>
                                        )}
                                        {selectedOrder.status === 'approved' && !selectedOrder.paidAt && (
                                            <button
                                                onClick={() => handleUpdateStatus(selectedOrder._id, selectedOrder.status, { paidAt: new Date() })}
                                                className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                                            >
                                                Xác nhận thanh toán
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Thông tin người bán */}
                            <div className="space-y-2">
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Thông tin người bán</h3>
                                <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                                    <p><span className="text-slate-500">Họ tên:</span> <span className="font-bold">{selectedOrder.sellerName}</span></p>
                                    <p><span className="text-slate-500">SĐT:</span> <span className="font-bold">{selectedOrder.sellerPhone}</span></p>
                                    {selectedOrder.sellerIdNumber && <p><span className="text-slate-500">CMND/CCCD:</span> {selectedOrder.sellerIdNumber}</p>}
                                    {selectedOrder.sellerAddress && <p><span className="text-slate-500">Địa chỉ:</span> {selectedOrder.sellerAddress}</p>}
                                </div>
                            </div>

                            {/* Thông tin sản phẩm */}
                            <div className="space-y-2">
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Thông tin sản phẩm</h3>
                                <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                                    <p><span className="text-slate-500">Thương hiệu:</span> {selectedOrder.productInfo.brand}</p>
                                    <p><span className="text-slate-500">Model:</span> <span className="font-bold">{selectedOrder.productInfo.model}</span></p>
                                    {selectedOrder.productInfo.serialNumber && <p><span className="text-slate-500">Serial:</span> {selectedOrder.productInfo.serialNumber}</p>}
                                    <p><span className="text-slate-500">Tình trạng:</span> {selectedOrder.productInfo.condition}</p>
                                </div>
                                {selectedOrder.images.length > 0 && (
                                    <div className="grid grid-cols-4 gap-2 mt-3">
                                        {selectedOrder.images.map((img, i) => (
                                            <img key={i} src={img} alt="" className="aspect-square object-cover rounded-lg" />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Giá và thanh toán */}
                            <div className="space-y-2">
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Giá và thanh toán</h3>
                                <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                                    <p><span className="text-slate-500">Giá mua:</span> <span className="text-xl font-black text-emerald-600">{formatPrice(selectedOrder.buyPrice)}</span></p>
                                    <p><span className="text-slate-500">Phương thức:</span> {selectedOrder.paymentMethod === 'cash' ? 'Tiền mặt' : selectedOrder.paymentMethod === 'bank' ? 'Chuyển khoản' : 'QR Code'}</p>
                                    {selectedOrder.paidAt && <p><span className="text-slate-500">Đã thanh toán:</span> <span className="text-emerald-600 font-bold">{new Date(selectedOrder.paidAt).toLocaleString('vi-VN')}</span></p>}
                                </div>
                            </div>

                            {selectedOrder.inspectionNotes && (
                                <div className="space-y-2">
                                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Ghi chú kiểm tra</h3>
                                    <div className="bg-slate-50 p-4 rounded-xl">
                                        <p className="text-slate-700">{selectedOrder.inspectionNotes}</p>
                                    </div>
                                </div>
                            )}

                            {selectedOrder.rejectionReason && (
                                <div className="space-y-2">
                                    <h3 className="text-sm font-black text-rose-600 uppercase tracking-wider">Lý do từ chối</h3>
                                    <div className="bg-rose-50 p-4 rounded-xl">
                                        <p className="text-rose-700">{selectedOrder.rejectionReason}</p>
                                    </div>
                                </div>
                            )}

                            {selectedOrder.notes && (
                                <div className="space-y-2">
                                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Ghi chú</h3>
                                    <div className="bg-slate-50 p-4 rounded-xl">
                                        <p className="text-slate-700">{selectedOrder.notes}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
