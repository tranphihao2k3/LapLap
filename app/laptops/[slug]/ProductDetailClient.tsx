'use client';

import { useState } from 'react';
import { ChevronRight, Cpu, Monitor, CheckCircle, Zap, Shield, TrendingUp, Gift, CreditCard, Facebook, MessageCircle, Star, ShoppingBag, Truck, Headphones, BadgeCheck, Search, Info, Home } from 'lucide-react';
import Button from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import InstallmentModal from '@/components/InstallmentModal';
import ProductCard from '../ProductCard';
import { Product } from '../types';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

interface ProductDetailClientProps {
    product: Product;
    relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [imageLoading, setImageLoading] = useState(false);
    const [isInstallmentOpen, setInstallmentOpen] = useState(false);
    const { addToCart } = useCart();
    const router = useRouter();

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

    // Ensure images array has at least one image
    const productImages = product.images && product.images.length > 0
        ? product.images
        : [product.image || 'https://placehold.co/600x450/e5e7eb/64748b?text=No+Image'];

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Breadcrumb - Redesigned */}
            <div className="sticky top-[80px] z-30 pointer-events-none">
                <div className="max-w-6xl mx-auto px-4 py-3 pointer-events-auto">
                    <div className="bg-white/90 backdrop-blur-md border border-slate-200/60 shadow-sm rounded-xl px-4 py-2">
                        <nav className="flex items-center gap-1.5 text-sm overflow-x-auto no-scrollbar">
                            <Link
                                href="/"
                                className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors font-medium whitespace-nowrap px-2 py-1 hover:bg-slate-50 rounded-lg group"
                            >
                                <Home className="w-4 h-4 group-hover:scale-110 transition-transform mb-0.5" />
                                <span>Trang chủ</span>
                            </Link>

                            <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />

                            <Link
                                href="/laptops"
                                className="text-slate-500 hover:text-blue-600 transition-colors font-medium whitespace-nowrap px-2 py-1 hover:bg-slate-50 rounded-lg"
                            >
                                Laptop
                            </Link>

                            <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />

                            <span className="text-blue-600 font-bold truncate max-w-[200px] md:max-w-lg bg-blue-50 px-3 py-1 rounded-lg text-xs md:text-sm border border-blue-100/50 shadow-sm">
                                {product.name}
                            </span>
                        </nav>
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

                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        onClick={() => {
                                            if (product) {
                                                addToCart(product);
                                                router.push('/checkout');
                                            }
                                        }}
                                        variant="primary"
                                        size="lg"
                                        fullWidth
                                        leftIcon={<CheckCircle size={22} />}
                                        className="h-auto py-3 md:py-4 text-sm md:text-base bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-700 hover:to-orange-600 shadow-xl shadow-rose-200 border-none col-span-2 group overflow-hidden relative"
                                    >
                                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                                        <div className="flex flex-col items-center relative z-10">
                                            <span className="font-extrabold uppercase tracking-wider text-white">Tiến hành thanh toán</span>
                                            <span className="text-[10px] font-medium text-rose-50 opacity-90">Giao tận nơi hoặc nhận tại cửa hàng</span>
                                        </div>
                                    </Button>

                                    <Button
                                        onClick={() => product && addToCart(product)}
                                        variant="white"
                                        size="lg"
                                        fullWidth
                                        leftIcon={<ShoppingBag size={20} className="text-blue-600" />}
                                        className="h-auto py-3 text-sm md:text-base border-2 border-blue-100 hover:border-blue-300"
                                    >
                                        <div className="flex flex-col items-center">
                                            <span className="font-bold uppercase text-slate-800">Thêm vào giỏ</span>
                                            <span className="text-[10px] font-medium text-slate-400">Mua thêm sản phẩm khác</span>
                                        </div>
                                    </Button>

                                    <Button
                                        onClick={() => setInstallmentOpen(true)}
                                        variant="primary"
                                        size="lg"
                                        fullWidth
                                        leftIcon={<CreditCard size={20} />}
                                        className="h-auto py-3 text-sm md:text-base bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-200 border-none"
                                    >
                                        <div className="flex flex-col items-center">
                                            <span className="font-bold uppercase tracking-wide">Mua trả góp</span>
                                            <span className="text-[10px] font-medium text-blue-50 opacity-90">Duyệt hồ sơ nhanh 5 phút</span>
                                        </div>
                                    </Button>
                                </div>
                                <p className="text-[11px] text-gray-500 text-center italic -mt-1">
                                    * Tính chất tham khảo, vui lòng liên hệ để được báo chính xác hơn
                                </p>

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

                        {/* DESCRIPTIVE HIGHLIGHTS (Trust Tray) - Moved here to follow Price Info on Mobile */}
                        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-2 border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-2 shadow-inner">
                            <HighlightCard icon={BadgeCheck} title="Chính hãng" desc="Cam kết 100%" />
                            <HighlightCard icon={Truck} title="Giao hàng" desc="Toàn quốc" />
                            <HighlightCard icon={Shield} title="Bảo hành" desc={`${product.warrantyMonths || 12} Tháng`} />
                            <HighlightCard icon={Headphones} title="Hỗ trợ" desc="24/7 Online" />
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

                {/* RELATED PRODUCTS */}
                {relatedProducts.length > 0 && (
                    <div className="mt-12 md:mt-16 border-t border-slate-200 pt-10">
                        <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-2">
                            <TrendingUp className="text-blue-600" />
                            Có thể bạn sẽ thích
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {relatedProducts.map(p => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <InstallmentModal
                isOpen={isInstallmentOpen}
                onClose={() => setInstallmentOpen(false)}
                productPrice={product.price}
                productName={product.name}
            />
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
