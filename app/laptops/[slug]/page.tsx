'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ChevronRight, Cpu, Monitor, CheckCircle, Zap, Shield, TrendingUp, Gift, CreditCard } from 'lucide-react';

import { Product } from '../types';

export default function ProductDetailPage() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [imageLoading, setImageLoading] = useState(false);

    useEffect(() => {
        if (params.slug) {
            fetchProduct();
        }
    }, [params.slug]);

    const fetchProduct = async () => {
        try {
            // Fetch by slug
            const res = await fetch(`/api/products/${params.slug}`);
            const data = await res.json();

            if (data.success) {
                setProduct(data.data);
            } else {
                setError('Không tìm thấy sản phẩm');
            }
        } catch (err) {
            console.error('Error fetching product:', err);
            setError('Lỗi khi tải sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (index: number) => {
        setImageLoading(true);
        setSelectedImage(index);
        setTimeout(() => setImageLoading(false), 300);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#004e9a] mx-auto"></div>
                    <p className="text-gray-600 mt-4 text-lg">Đang tải sản phẩm...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">{error || 'Không tìm thấy sản phẩm'}</h1>
                    <a
                        href="/"
                        className="inline-block px-6 py-3 bg-[#004e9a] text-white rounded-lg hover:bg-[#003366] transition-colors"
                    >
                        Quay lại trang chủ
                    </a>
                </div>
            </div>
        );
    }

    // Ensure images array has at least one image
    const productImages = product.images && product.images.length > 0
        ? product.images
        : [product.image || 'https://placehold.co/600x450/e5e7eb/64748b?text=No+Image'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        body {
          font-family: 'Inter', sans-serif;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slide-in {
          animation: slideIn 0.6s ease-out;
        }

        .animate-scale-in {
          animation: scaleIn 0.4s ease-out;
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .gradient-border {
          position: relative;
          background: white;
        }

        .gradient-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 2px;
          background: linear-gradient(135deg, #004e9a, #0066cc, #004e9a);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
        }
      `}</style>

            {/* Breadcrumb */}
            <div className="container mx-auto px-4 py-6 animate-fade-in">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <span className="hover:text-[#004e9a] cursor-pointer transition-colors">Sản phẩm</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="hover:text-[#004e9a] cursor-pointer transition-colors">
                        {product.categoryId?.name || 'Laptop'}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-[#004e9a] font-semibold">{product.name}</span>
                </div>
            </div>

            {/* Main content */}
            <div className="container mx-auto px-4 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left column - Images */}
                    <div className="space-y-6 animate-slide-in">
                        {/* Main image */}
                        <div className="relative group">
                            <div className="glass-effect rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 group-hover:shadow-3xl">
                                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                                    <img
                                        src={productImages[selectedImage]}
                                        alt={product.name}
                                        className={`w-full h-full object-cover transition-all duration-500 ${imageLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
                                            } group-hover:scale-105`}
                                    />
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                            </div>
                            {/* Badge */}
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#004e9a] to-[#0066cc] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                {product.categoryId?.name || 'Laptop'}
                            </div>
                        </div>

                        {/* Thumbnail gallery */}
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                            {productImages.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleImageChange(index)}
                                    className={`relative rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 ${selectedImage === index
                                        ? 'ring-3 ring-[#004e9a] shadow-lg scale-105'
                                        : 'ring-2 ring-gray-200 hover:ring-[#0066cc] opacity-70 hover:opacity-100'
                                        }`}
                                >
                                    <img
                                        src={img}
                                        alt={`View ${index + 1}`}
                                        className="w-full aspect-[4/3] object-cover"
                                    />
                                    {selectedImage === index && (
                                        <div className="absolute inset-0 bg-[#004e9a]/20" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Thông số nổi bật */}
                        <div className="glass-effect rounded-2xl p-6 shadow-xl">
                            <div className="flex items-center gap-2 mb-5">
                                <Zap className="w-6 h-6 text-[#004e9a]" />
                                <h3 className="text-xl font-bold bg-gradient-to-r from-[#004e9a] to-[#0066cc] bg-clip-text text-transparent">
                                    Thông số nổi bật
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[
                                    { icon: Cpu, label: 'CPU', value: product.specs.cpu },
                                    {
                                        icon: CreditCard,
                                        label: 'VGA',
                                        value: product.specs.gpu
                                    },
                                    { icon: Monitor, label: 'Màn hình', value: product.specs.screen },
                                ].map((spec, idx) => (
                                    <div
                                        key={idx}
                                        className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                                        style={{ animationDelay: `${idx * 100}ms` }}
                                    >
                                        <div className="w-14 h-14 bg-gradient-to-br from-[#004e9a] to-[#0066cc] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <spec.icon className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="text-center">
                                            <div className="font-bold text-sm text-gray-700">{spec.label}</div>
                                            <div className="text-xs text-gray-600 font-medium mt-1">{spec.value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Chính sách sản phẩm */}
                        <div className="glass-effect rounded-2xl p-6 shadow-xl">
                            <div className="flex items-center gap-2 mb-5">
                                <Shield className="w-6 h-6 text-[#004e9a]" />
                                <h3 className="text-xl font-bold bg-gradient-to-r from-[#004e9a] to-[#0066cc] bg-clip-text text-transparent">
                                    Chính sách sản phẩm
                                </h3>
                            </div>
                            <div className="space-y-4">
                                {[
                                    'Kỹ thuật viên hỗ trợ trực tuyến',
                                    'Hỗ trợ cài đặt miễn phí',
                                    'Giao hàng miễn phí toàn quốc',
                                ].map((policy, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50/50 transition-colors duration-200 group"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#004e9a] to-[#0066cc] flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200">
                                            <CheckCircle className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">{policy}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right column - Product info */}
                    <div className="space-y-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
                        {/* Product title */}
                        <div className="glass-effect rounded-2xl p-6 shadow-xl">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-[#004e9a] to-[#0066cc] bg-clip-text text-transparent mb-2">
                                        {product.name}
                                    </h1>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-sm text-gray-600 font-medium">Model:</span>
                                        <span className="px-3 py-1 bg-gradient-to-r from-[#004e9a] to-[#0066cc] text-white text-sm font-bold rounded-full">
                                            {product.model}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>Hot</span>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="text-sm text-gray-600 mb-1">Giá bán:</div>
                                <div className="text-4xl font-extrabold bg-gradient-to-r from-[#004e9a] to-[#0066cc] bg-clip-text text-transparent">
                                    {formatPrice(product.price)}
                                </div>
                            </div>
                        </div>

                        {/* Cấu hình chi tiết */}
                        <div className="glass-effect rounded-2xl p-6 shadow-xl">
                            <h3 className="text-xl font-bold bg-gradient-to-r from-[#004e9a] to-[#0066cc] bg-clip-text text-transparent mb-4">
                                Cấu hình chi tiết
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { label: 'CPU', value: product.specs.cpu },
                                    { label: 'VGA', value: product.specs.gpu },
                                    { label: 'Ram', value: product.specs.ram },
                                    { label: 'Dung lượng', value: product.specs.ssd },
                                    { label: 'Màn hình', value: product.specs.screen },
                                ].map((spec, idx) => (
                                    <div
                                        key={idx}
                                        className="group relative overflow-hidden rounded-xl"
                                        style={{ animationDelay: `${idx * 50}ms` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#004e9a] to-[#0066cc] opacity-100 group-hover:opacity-90 transition-opacity duration-300" />
                                        <div className="relative px-5 py-3.5 flex items-center justify-between">
                                            <span className="text-white font-semibold">{spec.label}:</span>
                                            <span className="text-white font-bold">{spec.value}</span>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Chính sách bảo hành */}
                        <div className="gradient-border rounded-2xl p-6 shadow-xl">
                            <div className="text-center mb-5">
                                <h3 className="text-xl font-bold bg-gradient-to-r from-[#004e9a] to-[#0066cc] bg-clip-text text-transparent">
                                    Chính sách bảo hành và quà tặng
                                </h3>
                            </div>
                            <div className="space-y-3">
                                {/* <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-transparent">
                                    <CheckCircle className="w-5 h-5 text-[#004e9a] flex-shrink-0 mt-0.5" />
                                    <span className="text-sm font-semibold text-gray-800">
                                        Bảo hành {product.warranty?.duration || '12 tháng'}
                                    </span>
                                </div> */}
                                {product.warrantyMonths && (
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-green-50 to-transparent">
                                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <span className="text-sm font-semibold text-gray-800">
                                                Thời hạn: {product.warrantyMonths} tháng
                                            </span>
                                        </div>
                                    </div>
                                )}
                                {product.warranty?.items && product.warranty.items.length > 0 ? (
                                    product.warranty.items.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50/50 transition-colors duration-200"
                                        >
                                            <CheckCircle className="w-5 h-5 text-[#004e9a] flex-shrink-0 mt-0.5" />
                                            <span className="text-sm font-medium text-gray-700">{item}</span>
                                        </div>
                                    ))
                                ) : null}
                            </div>
                        </div>

                        {/* Quà tặng */}
                        {product.gift && (
                            <div className="gradient-border rounded-2xl p-6 shadow-xl mt-6">
                                <div className="text-center mb-5">
                                    <h3 className="text-xl font-bold bg-gradient-to-r from-[#004e9a] to-[#0066cc] bg-clip-text text-transparent">
                                        Quà tặng & Khuyến mãi
                                    </h3>
                                </div>
                                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#004e9a] to-[#0066cc] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                                            <Gift className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                                            {product.gift}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Contact buttons */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Facebook Button */}
                            <a
                                href="https://www.facebook.com/profile.php?id=61582947329036"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative group overflow-hidden rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02] block"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#1877f2] via-[#4267B2] to-[#1877f2] bg-[length:200%_100%] group-hover:bg-[position:100%_0] transition-all duration-500" />
                                <div className="relative px-6 py-5 flex items-center justify-center gap-3">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    <span className="text-white font-bold text-lg">Facebook</span>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            </a>

                            {/* Zalo Button */}
                            <a
                                href="https://zalo.me/0978648720"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative group overflow-hidden rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02] block"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#0068FF] via-[#0084FF] to-[#0068FF] bg-[length:200%_100%] group-hover:bg-[position:100%_0] transition-all duration-500" />
                                <div className="relative px-6 py-5 flex items-center justify-center gap-3">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111C24 4.975 18.627 0 12 0zm.699 14.97l-3.11-3.315-6.068 3.315 6.676-7.087 3.187 3.315 6.008-3.315-6.693 7.087z" />
                                    </svg>
                                    <span className="text-white font-bold text-lg">Zalo</span>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            </a>
                        </div>

                        {/* Trust badges */}
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { icon: Shield, text: 'Bảo hành chính hãng' },
                                { icon: CheckCircle, text: 'Hàng chính hãng' },
                                { icon: Zap, text: 'Giao hàng nhanh' },
                            ].map((badge, idx) => (
                                <div
                                    key={idx}
                                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-md hover:shadow-lg transition-all duration-300"
                                >
                                    <badge.icon className="w-6 h-6 text-[#004e9a]" />
                                    <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                                        {badge.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
