'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, Clock, CheckCircle, Truck, XCircle, Search } from 'lucide-react';

interface Order {
    _id: string;
    customer: {
        name: string;
        phone: string;
    };
    totalAmount: number;
    status: string;
    createdAt: string;
    paymentMethod: string;
    items: any[];
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/admin/orders');
            const data = await res.json();
            if (data.success) {
                setOrders(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock size={12} /> Chờ xử lý</span>;
            case 'confirmed':
                return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><CheckCircle size={12} /> Đã xác nhận</span>;
            case 'shipped':
                return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"><Truck size={12} /> Đang giao</span>;
            case 'delivered':
                return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle size={12} /> Hoàn thành</span>;
            case 'cancelled':
                return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle size={12} /> Đã hủy</span>;
            default:
                return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    const filteredOrders = orders.filter(order =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.phone.includes(searchTerm)
    );

    return (
        <div className="flex-1 w-full bg-[#F8FAFC] min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 lg:px-8">
                {/* Header & Search */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Quản lý đơn hàng</h1>
                        <p className="text-sm text-slate-500 font-medium mt-1">Theo dõi và xử lý các đơn hàng từ khách hàng</p>
                    </div>

                    <div className="relative w-full lg:w-96">
                        <input
                            type="text"
                            placeholder="Tìm khách hàng, số điện thoại, mã đơn..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 md:py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm font-medium placeholder:text-slate-400 text-sm md:text-base"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                    </div>
                </div>

                {/* Orders Content */}
                {loading ? (
                    <div className="bg-white rounded-3xl border border-slate-100 p-20 text-center shadow-sm">
                        <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Đang tải dữ liệu...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-16 text-center shadow-sm">
                        <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6 text-slate-200">
                            <Truck size={40} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Không tìm thấy đơn hàng</h3>
                        <p className="text-slate-500 text-sm font-medium">Thử thay đổi từ khóa tìm kiếm hoặc kiểm tra lại thông tin.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Desktop Header */}
                        <div className="hidden xl:grid grid-cols-[120px_1fr_180px_150px_150px_120px] gap-4 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 items-center">
                            <div>Mã đơn</div>
                            <div>Khách hàng</div>
                            <div>Ngày đặt</div>
                            <div>Tổng tiền</div>
                            <div className="text-center">Trạng thái</div>
                            <div className="text-right">Thao tác</div>
                        </div>

                        {/* Order Items */}
                        <div className="grid grid-cols-1 gap-3">
                            {filteredOrders.map((order) => (
                                <div key={order._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden">
                                    <div className="grid grid-cols-1 xl:grid-cols-[120px_1fr_180px_150px_150px_120px] gap-4 p-4 lg:px-6 lg:py-4 items-center relative">
                                        {/* Order ID & Phone (Mobile top info) */}
                                        <div>
                                            <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100 uppercase tracking-tighter">
                                                #{order._id.slice(-6).toUpperCase()}
                                            </span>
                                            <div className="xl:hidden absolute top-4 right-4">
                                                {getStatusBadge(order.status)}
                                            </div>
                                        </div>

                                        {/* Customer Info */}
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-800 text-sm md:text-base">{order.customer.name}</span>
                                            <span className="text-xs font-medium text-slate-400 mt-0.5">{order.customer.phone}</span>
                                        </div>

                                        {/* Date */}
                                        <div className="flex xl:flex-col items-center xl:items-start gap-2 xl:gap-0 mt-2 xl:mt-0 pt-2 xl:pt-0 border-t xl:border-none border-slate-50">
                                            <span className="xl:hidden text-[10px] font-bold text-slate-400 uppercase">Ngày:</span>
                                            <span className="text-xs font-bold text-slate-600">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                                            <span className="hidden xl:block text-[10px] font-medium text-slate-400">{new Date(order.createdAt).toLocaleTimeString('vi-VN')}</span>
                                        </div>

                                        {/* Amount */}
                                        <div className="flex xl:flex-col items-center xl:items-start gap-2 xl:gap-0 mt-1 xl:mt-0">
                                            <span className="xl:hidden text-[10px] font-bold text-slate-400 uppercase">Tiền:</span>
                                            <span className="text-sm xl:text-base font-black text-rose-600">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                                            </span>
                                        </div>

                                        {/* Status Badge (Desktop Only) */}
                                        <div className="hidden xl:flex justify-center">
                                            {getStatusBadge(order.status)}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-end mt-4 xl:mt-0 pt-3 xl:pt-0 border-t xl:border-none border-slate-50 relative z-10">
                                            <Link
                                                href={`/admin/orders/${order._id}`}
                                                className="w-full xl:w-auto flex items-center justify-center gap-2 text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-xl transition-all font-bold text-xs active:scale-95"
                                            >
                                                <Eye size={16} /> Xem chi tiết
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
