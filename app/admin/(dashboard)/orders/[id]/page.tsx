'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Printer, Truck, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

interface OrderDetail {
    _id: string;
    customer: {
        name: string;
        phone: string;
        email: string;
        address: string;
    };
    items: {
        product: string;
        name: string;
        price: number;
        quantity: number;
        image: string;
        slug: string;
    }[];
    totalAmount: number;
    status: string;
    paymentMethod: string;
    note: string;
    createdAt: string;
}

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (params.id) {
            fetchOrder(params.id as string);
        }
    }, [params.id]);

    const fetchOrder = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/orders/${id}`);
            const data = await res.json();
            if (data.success) {
                setOrder(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch order:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus: string) => {
        if (!order) return;
        setUpdating(true);
        try {
            const res = await fetch(`/api/admin/orders/${order._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();
            if (data.success) {
                setOrder(prev => prev ? { ...prev, status: newStatus } : null);
            } else {
                alert('Cập nhật thất bại');
            }
        } catch (error) {
            console.error('Update error:', error);
            alert('Có lỗi xảy ra');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Đang tải...</div>;
    if (!order) return <div className="p-10 text-center">Không tìm thấy đơn hàng</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            {/* Header */}
            <header className="bg-white border-b px-6 py-4 flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders" className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="font-bold text-xl text-gray-800">
                        Đơn hàng #{order._id.slice(-6).toUpperCase()}
                    </h1>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                        ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'}`}
                    >
                        {order.status === 'pending' ? 'Chờ xử lý' :
                            order.status === 'confirmed' ? 'Đã xác nhận' :
                                order.status === 'shipped' ? 'Đang giao' :
                                    order.status === 'delivered' ? 'Hoàn thành' : 'Đã hủy'}
                    </span>
                </div>
                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                    <Printer size={18} /> In đơn
                </button>
            </header>

            <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Items */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="font-bold text-lg mb-4">Sản phẩm</h2>
                        <div className="space-y-4">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 object-contain bg-gray-50 rounded-md border" />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-medium text-gray-800">{item.name}</h3>
                                            <p className="font-bold text-gray-900">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                            </p>
                                        </div>
                                        <p className="text-gray-500 text-sm mt-1">Số lượng: x{item.quantity}</p>
                                        <p className="text-gray-500 text-sm mt-1 font-bold">
                                            Thành tiền: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 border-t border-gray-100 pt-4 flex justify-between items-center">
                            <span className="font-bold text-gray-600">Tổng cộng</span>
                            <span className="text-2xl font-black text-blue-600">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                            </span>
                        </div>
                    </div>

                    {/* Timeline / Actions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="font-bold text-lg mb-4">Cập nhật trạng thái</h2>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                onClick={() => updateStatus('confirmed')}
                                disabled={updating || order.status === 'confirmed'}
                                variant={order.status === 'confirmed' ? 'primary' : 'outline'}
                                size="sm"
                                leftIcon={<CheckCircle size={16} />}
                            >
                                Xác nhận
                            </Button>
                            <Button
                                onClick={() => updateStatus('shipped')}
                                disabled={updating || order.status === 'shipped'}
                                variant={order.status === 'shipped' ? 'primary' : 'outline'}
                                size="sm"
                                leftIcon={<Truck size={16} />}
                            >
                                Gửi hàng
                            </Button>
                            <Button
                                onClick={() => updateStatus('delivered')}
                                disabled={updating || order.status === 'delivered'}
                                variant={order.status === 'delivered' ? 'primary' : 'outline'}
                                className={order.status === 'delivered' ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' : ''}
                                size="sm"
                                leftIcon={<CheckCircle size={16} />}
                            >
                                Hoàn thành
                            </Button>
                            <Button
                                onClick={() => updateStatus('cancelled')}
                                disabled={updating || order.status === 'cancelled'}
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                                size="sm"
                                leftIcon={<XCircle size={16} />}
                            >
                                Hủy đơn
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="font-bold text-lg mb-4">Thông tin khách hàng</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-gray-500 font-bold uppercase">Họ v tên</label>
                                <p className="text-gray-800 font-medium">{order.customer.name}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 font-bold uppercase">Số điện thoại</label>
                                <p className="text-gray-800 font-medium">{order.customer.phone}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 font-bold uppercase">Email</label>
                                <p className="text-gray-800 font-medium">{order.customer.email || 'Không có'}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 font-bold uppercase">Địa chỉ</label>
                                <p className="text-gray-800 font-medium">{order.customer.address}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="font-bold text-lg mb-4">Thanh toán & Ghi chú</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-gray-500 font-bold uppercase">Phương thức</label>
                                <p className="text-gray-800 font-medium">
                                    {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng'}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 font-bold uppercase">Ghi chú</label>
                                <p className="text-gray-600 italic bg-gray-50 p-2 rounded border border-gray-100 text-sm">
                                    {order.note || 'Không có ghi chú'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
