'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';
import { ArrowLeft, CheckCircle, Loader2, CreditCard, Truck } from 'lucide-react';
import Image from 'next/image';

interface CheckoutFormData {
    name: string;
    phone: string;
    email: string;
    address: string;
    note: string;
    paymentMethod: 'cod' | 'banking';
}

export default function CheckoutPage() {
    const { cart, totalAmount, clearCart } = useCart();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({
        defaultValues: {
            paymentMethod: 'cod'
        }
    });

    const onSubmit = async (data: CheckoutFormData) => {
        if (cart.length === 0) return;
        setIsSubmitting(true);

        try {
            const orderData = {
                customer: {
                    name: data.name,
                    phone: data.phone,
                    email: data.email,
                    address: data.address,
                },
                items: cart.map(item => ({
                    product: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image,
                    slug: item.slug
                })),
                totalAmount,
                paymentMethod: data.paymentMethod,
                note: data.note,
            };

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });

            const result = await res.json();

            if (result.success) {
                clearCart();
                setIsSuccess(true);
                setOrderId(result.orderId);
                // Scroll to top
                window.scrollTo(0, 0);
            } else {
                alert(result.message || 'Có lỗi xảy ra, vui lòng thử lại');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">Đặt hàng thành công!</h1>
                        <p className="text-gray-600">
                            Cảm ơn bạn đã mua hàng. Mã đơn hàng của bạn là: <br />
                            <span className="font-bold text-blue-600 text-lg">#{orderId?.toString().slice(-6).toUpperCase()}</span>
                        </p>
                        <p className="text-sm text-gray-500">
                            Chúng tôi sẽ liên hệ lại sớm nhất để xác nhận đơn hàng.
                        </p>
                        <div className="pt-4">
                            <Button href="/" fullWidth variant="primary">
                                Về trang chủ
                            </Button>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (cart.length === 0) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-gray-50 py-20 px-4 text-center">
                    <h1 className="text-2xl font-bold mb-4">Giỏ hàng trống</h1>
                    <p className="mb-8 text-gray-600">Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
                    <Button href="/laptops" variant="primary">
                        Xem sản phẩm
                    </Button>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50 py-8 md:py-12">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="flex items-center gap-2 mb-8">
                        <Button href="/laptops" variant="ghost" size="sm" leftIcon={<ArrowLeft size={16} />}>
                            Tiếp tục mua sắm
                        </Button>
                        <h1 className="text-2xl font-bold text-gray-800">Thanh toán</h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Form */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">1</span>
                                    Thông tin giao hàng
                                </h2>
                                <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
                                            <input
                                                {...register("name", { required: "Vui lòng nhập họ tên" })}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                                placeholder="Nguyễn Văn A"
                                            />
                                            {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                                            <input
                                                {...register("phone", {
                                                    required: "Vui lòng nhập số điện thoại",
                                                    pattern: { value: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ" }
                                                })}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                                placeholder="0912345678"
                                            />
                                            {errors.phone && <span className="text-red-500 text-xs mt-1">{errors.phone.message}</span>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email (Không bắt buộc)</label>
                                        <input
                                            {...register("email")}
                                            type="email"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                            placeholder="email@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ nhận hàng *</label>
                                        <input
                                            {...register("address", { required: "Vui lòng nhập địa chỉ" })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                            placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                                        />
                                        {errors.address && <span className="text-red-500 text-xs mt-1">{errors.address.message}</span>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú đơn hàng</label>
                                        <textarea
                                            {...register("note")}
                                            rows={3}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                            placeholder="Ví dụ: Giao hàng giờ hành chính, gọi trước khi giao..."
                                        ></textarea>
                                    </div>
                                </form>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">2</span>
                                    Phương thức thanh toán
                                </h2>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition border-blue-200 bg-blue-50/50">
                                        <input
                                            type="radio"
                                            value="cod"
                                            {...register("paymentMethod")}
                                            className="w-5 h-5 text-blue-600 accent-blue-600"
                                        />
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                                <Truck className="w-6 h-6 text-green-600" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800">Thanh toán khi nhận hàng (COD)</div>
                                                <div className="text-xs text-gray-500">Kiểm tra hàng trước khi thanh toán</div>
                                            </div>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition border-gray-200">
                                        <input
                                            type="radio"
                                            value="banking"
                                            {...register("paymentMethod")}
                                            className="w-5 h-5 text-blue-600 accent-blue-600"
                                        />
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                                <CreditCard className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800">Chuyển khoản ngân hàng</div>
                                                <div className="text-xs text-gray-500">Giảm thêm 100k - Liên hệ Zalo để lấy STK</div>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                                <h2 className="text-lg font-bold text-gray-800 mb-4">Đơn hàng của bạn</h2>

                                <div className="space-y-4 max-h-[300px] overflow-y-auto mb-4 pr-2 custom-scrollbar">
                                    {cart.map((item) => (
                                        <div key={item._id} className="flex gap-3">
                                            <div className="w-16 h-16 bg-gray-50 rounded-md relative flex-shrink-0 border border-gray-100">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-contain p-1"
                                                />
                                                <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium text-gray-800 line-clamp-2">{item.name}</h4>
                                                <p className="text-sm font-bold text-blue-600 mt-1">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-100 pt-4 space-y-2">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tạm tính</span>
                                        <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Phí vận chuyển</span>
                                        <span className="text-green-600 font-medium">Miễn phí</span>
                                    </div>
                                    <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-800">Tổng cộng</span>
                                        <span className="text-xl font-black text-blue-600">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    form="checkout-form"
                                    fullWidth
                                    size="lg"
                                    variant="primary"
                                    className="mt-6 shadow-blue-200 shadow-lg"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Đang xử lý...</>
                                    ) : 'Đặt hàng ngay'}
                                </Button>

                                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                                    <CheckCircle size={14} className="text-green-500" />
                                    Bảo mật thông tin khách hàng tuyệt đối
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
