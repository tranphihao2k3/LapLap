'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ChevronRight, Cpu, Monitor, CheckCircle, Zap, Shield, TrendingUp, Gift, CreditCard, Facebook, MessageCircle, Star, ShoppingBag, Truck, Headphones, BadgeCheck, Search } from 'lucide-react';
import Button from '@/components/ui/Button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import TechLoader from '@/components/ui/TechLoader';

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
                <TechLoader />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">{error || 'Không tìm thấy sản phẩm'}</h1>
                    <Button
                        href="/"
                        variant="primary"
                        size="lg"
                    >
                        Quay lại trang chủ
                    </Button>
                </div>
            </div>
        );
    }

    // Ensure images array has at least one image
    const productImages = product.images && product.images.length > 0
        ? product.images
        : [product.image || 'https://placehold.co/600x450/e5e7eb/64748b?text=No+Image'];

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Header />

            {/* Breadcrumb - Clean & Simple */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Link href="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
                        <ChevronRight className="w-4 h-4" />
                        <Link href="/laptops" className="hover:text-blue-600 transition-colors">Laptop</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-slate-900 font-medium line-clamp-1">{product.name}</span>
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 py-4 md:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-8">
                    {/* LEFT COLUMN: Images (Span 6 - 50%) */}
                    <div className="lg:col-span-6 space-y-4">
                        <div className="bg-white rounded-3xl p-3 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group cursor-zoom-in">
                            {/* Main Display */}
                            <PhotoProvider>
                                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-50">
                                    <AnimatePresence mode="wait">
                                        <PhotoView key={selectedImage} src={productImages[selectedImage]}>
                                            <motion.img
                                                initial={{ opacity: 0, scale: 1.05 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.4 }}
                                                src={productImages[selectedImage]}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </PhotoView>
                                    </AnimatePresence>

                                    {/* Zoom Hint */}
                                    <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        <Search size={18} />
                                    </div>
                                </div>
                            </PhotoProvider>
                        </div>

                        {/* Thumbnails */}
                        {productImages.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                                {productImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleImageChange(index)}
                                        className={`relative flex-shrink-0 w-24 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === index
                                            ? 'border-blue-600 ring-2 ring-blue-100 scale-102'
                                            : 'border-slate-200 hover:border-blue-300 opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* DESCRIPTIVE HIGHLIGHTS (Trust Tray) */}
                        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-2 border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-2 shadow-inner">
                            <HighlightCard icon={BadgeCheck} title="Chính hãng" desc="Cam kết 100%" />
                            <HighlightCard icon={Truck} title="Giao hàng" desc="Toàn quốc" />
                            <HighlightCard icon={Shield} title="Bảo hành" desc={`${product.warrantyMonths || 12} Tháng`} />
                            <HighlightCard icon={Headphones} title="Hỗ trợ" desc="24/7 Online" />
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Info & CTAs (Span 6 - 50%) */}
                    <div className="lg:col-span-6 space-y-4">
                        {/* Title & Price Card */}
                        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                            <div className="flex items-center gap-1 text-blue-600 mb-2">
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <span className="text-xs font-bold ml-2 text-slate-400">5.0 (42 đánh giá)</span>
                            </div>

                            <h1 className="text-xl md:text-2xl font-black text-slate-900 leading-tight mb-4">
                                {product.name}
                            </h1>

                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg uppercase">
                                    Model: {product.model}
                                </span>
                                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg uppercase">
                                    {product.categoryId?.name || 'Laptop'}
                                </span>
                            </div>

                            <div className="mb-6">
                                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Giá ưu đãi</div>
                                <div className="text-2xl md:text-3xl font-black text-blue-600 tracking-tight">
                                    {formatPrice(product.price)}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Button
                                    href="https://zalo.me/0978648720"
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    leftIcon={<ShoppingBag size={24} />}
                                    className="h-14 text-lg"
                                >
                                    Đặt mua ngay
                                </Button>

                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Button
                                        href="https://www.facebook.com/profile.php?id=61582947329036"
                                        variant="facebook"
                                        size="md"
                                        fullWidth
                                        leftIcon={<Facebook size={18} />}
                                        className="sm:flex-1 h-12"
                                    >
                                        Fanpage
                                    </Button>
                                    <Button
                                        href="https://zalo.me/0978648720"
                                        variant="outline"
                                        size="md"
                                        fullWidth
                                        leftIcon={<MessageCircle size={18} />}
                                        className="sm:flex-1 h-12 border-blue-200 text-blue-600 hover:bg-blue-50"
                                    >
                                        Zalo tư vấn
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Specs Summary Card */}
                        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                            <h3 className="text-base font-black text-slate-900 mb-3 flex items-center gap-2">
                                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                    <Cpu size={18} />
                                </span>
                                Cấu hình chi tiết
                            </h3>

                            <div className="space-y-4">
                                <SpecRow label="Vi xử lý (CPU)" value={product.specs.cpu} />
                                <SpecRow label="Card đồ họa (VGA)" value={product.specs.gpu} />
                                <SpecRow label="Bộ nhớ (RAM)" value={product.specs.ram} />
                                <SpecRow label="Ổ cứng (SSD)" value={product.specs.ssd} />
                                <SpecRow label="Màn hình" value={product.specs.screen} />
                            </div>
                        </div>

                        {/* Warranty & Policies Section */}
                        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                            <h3 className="text-base font-black text-slate-900 mb-3 flex items-center gap-2">
                                <span className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                                    <Shield size={18} />
                                </span>
                                Bảo hành & Cam kết
                            </h3>

                            <div className="space-y-3">
                                <div className="p-3 bg-green-50/50 rounded-xl border border-green-100 flex items-center justify-between">
                                    <span className="text-sm font-bold text-green-800 uppercase tracking-wider">Thời hạn bảo hành</span>
                                    <span className="text-sm font-black text-green-600">{product.warrantyMonths || 12} Tháng</span>
                                </div>

                                {product.warranty?.items && product.warranty.items.length > 0 && (
                                    <div className="pt-2 space-y-2">
                                        {product.warranty.items.map((item, idx) => (
                                            <div key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                                <span className="font-medium">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Gifts Card */}
                        {product.gift && (
                            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-4 md:p-6 shadow-xl shadow-indigo-500/30 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Gift className="w-6 h-6 text-yellow-300 animate-bounce" />
                                    Quà tặng hấp dẫn
                                </h3>
                                <div className="text-indigo-50 leading-relaxed whitespace-pre-line text-sm font-medium">
                                    {product.gift}
                                </div>
                                <div className="absolute bottom-4 right-4 opacity-20">
                                    <Zap size={48} className="text-white fill-current" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />


        </div>
    );
}

function HighlightCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="bg-white p-3 rounded-2xl border border-slate-100 flex flex-col items-center text-center group hover:bg-blue-50 transition-all duration-300">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 group-hover:bg-white transition-all shadow-sm">
                <Icon size={20} />
            </div>
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{title}</div>
            <div className="text-[13px] font-black text-slate-800 leading-tight">{desc}</div>
        </div>
    );
}

function SpecRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between items-start gap-4 py-2 border-b border-slate-50 last:border-0 group">
            <span className="text-sm text-slate-400 font-medium whitespace-nowrap">{label}</span>
            <span className="text-sm text-slate-900 font-bold text-right group-hover:text-blue-600 transition-colors">{value}</span>
        </div>
    );
}
