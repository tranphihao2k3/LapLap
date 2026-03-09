'use client';

import { useState } from 'react';
import { ChevronRight, Cpu, Monitor, CheckCircle, Zap, Shield, TrendingUp, Gift, CreditCard, Facebook, MessageCircle, Star, ShoppingBag, Truck, Headphones, BadgeCheck, Search, Info, Home, Share2, Check, RefreshCw, Eye, ChevronDown } from 'lucide-react';
import Button from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import InstallmentModal from '@/components/InstallmentModal';
import ProductCard from '../ProductCard';
import { Product } from '@/types/api';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import ProductReviews from '@/components/ProductReviews';

interface ProductDetailClientProps {
    product: any;
    relatedProducts: any[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [imageLoading, setImageLoading] = useState(false);
    const [isInstallmentOpen, setInstallmentOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const { addToCart } = useCart();
    const router = useRouter();

    const handleImageChange = (index: number) => {
        setImageLoading(true);
        setSelectedImage(index);
        setTimeout(() => setImageLoading(false), 300);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const productSpecs = product.specs || {};

    const getSpec = (keys: string[]) => {
        for (const key of keys) {
            if (productSpecs[key]) return productSpecs[key];
        }
        return null;
    };

    const cpu = getSpec(['CPU', 'cpu', 'Vi xử lý']);
    const gpu = getSpec(['Card đồ họa', 'GPU', 'gpu', 'VGA']);
    const ram = getSpec(['RAM', 'ram', 'Bộ nhớ']);
    const ssd = getSpec(['Ổ cứng', 'SSD', 'ssd', 'SSD/HDD']);
    const screen = getSpec(['Màn hình', 'screen', 'Kích thước màn hình']);
    const resolution = getSpec(['Độ phân giải', 'resolution']);
    const hz = getSpec(['Tần số quét', 'hz']);

    const specItems = [
        { label: 'Vi xử lý (CPU)', value: cpu || 'N/A', icon: Cpu },
        { label: 'Card đồ họa (VGA)', value: gpu || 'N/A', icon: Monitor },
        { label: 'Bộ nhớ (RAM)', value: ram || 'N/A', icon: Zap },
        { label: 'Ổ cứng (SSD)', value: ssd || 'N/A', icon: CreditCard },
        { label: 'Màn hình', value: [screen, resolution, hz].filter(Boolean).join(' ') || 'N/A', icon: Monitor },
        { label: 'Bảo hành', value: `${product.warrantyMonths || 12} Tháng`, icon: Shield, highlight: true },
    ];

    const basePrice = product.basePrice || product.price || 0;
    const salePrice = product.salePrice || 0;
    const currentPrice = salePrice > 0 ? salePrice : basePrice;
    const hasDiscount = salePrice > 0 && salePrice < basePrice;

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* ========== BREADCRUMB ========== */}
            <div className="bg-white border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-4 py-3">
                    <nav className="flex items-center gap-1.5 text-sm overflow-x-auto no-scrollbar">
                        <Link href="/" className="flex items-center gap-1.5 text-slate-500 hover:text-[var(--color-primary)] transition-colors font-medium whitespace-nowrap px-2 py-1 hover:bg-slate-50 rounded-lg group">
                            <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span>Trang chủ</span>
                        </Link>
                        <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                        <Link href="/laptops" className="text-slate-500 hover:text-[var(--color-primary)] transition-colors font-medium whitespace-nowrap px-2 py-1 hover:bg-slate-50 rounded-lg">
                            Laptop
                        </Link>
                        <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                        <span className="text-[var(--color-primary)] font-bold truncate max-w-[200px] md:max-w-lg bg-blue-50 px-3 py-1 rounded-lg text-xs md:text-sm border border-blue-100/50 shadow-sm">
                            {product.name}
                        </span>
                    </nav>
                </div>
            </div>

            {/* ========== MAIN CONTENT ========== */}
            <main className="max-w-6xl mx-auto px-4 py-4 md:py-8">
                <div className="flex flex-col gap-4 lg:grid lg:grid-cols-12 lg:gap-6 xl:gap-8 lg:items-start">

                    {/* ====== LEFT COLUMN: Gallery ====== */}
                    <div className="contents lg:block lg:col-span-7 lg:space-y-4">
                        <div className="order-1 w-full flex flex-col gap-4 lg:block lg:space-y-4">
                            {/* Main Image */}
                            <div className="bg-white rounded-2xl p-2 shadow-lg shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
                                <PhotoProvider>
                                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-slate-50 to-white cursor-zoom-in">
                                        <AnimatePresence mode="wait">
                                            <PhotoView key={selectedImage} src={product.images?.[selectedImage] || product.image || 'https://placehold.co/600x450/e5e7eb/64748b?text=No+Image'}>
                                                <motion.img
                                                    initial={{ opacity: 0, scale: 1.02 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.98 }}
                                                    transition={{ duration: 0.4, ease: 'easeOut' }}
                                                    src={product.images?.[selectedImage] || product.image || 'https://placehold.co/600x450/e5e7eb/64748b?text=No+Image'}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain p-4 md:p-6"
                                                />
                                            </PhotoView>
                                        </AnimatePresence>

                                        {/* Zoom Hint Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6 pointer-events-none">
                                            <div className="bg-white/90 backdrop-blur-sm text-slate-700 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-xl">
                                                <Search size={14} />
                                                Click để phóng to
                                            </div>
                                        </div>
                                    </div>
                                </PhotoProvider>
                            </div>

                            {/* Thumbnails */}
                            {product.images && product.images.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                                    {product.images.map((img: string, index: number) => (
                                        <button
                                            key={index}
                                            onClick={() => handleImageChange(index)}
                                            className={`relative flex-shrink-0 w-20 h-16 md:w-24 md:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === index
                                                ? 'border-[var(--color-primary)] ring-2 ring-blue-100 shadow-lg scale-105'
                                                : 'border-slate-200 hover:border-blue-300 opacity-60 hover:opacity-100'
                                                }`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                            {selectedImage === index && (
                                                <div className="absolute inset-0 bg-[var(--color-primary)]/5" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ====== SPECS TABLE (Desktop: under images) ====== */}
                        <div className="order-3 w-full bg-white rounded-2xl p-5 md:p-6 shadow-lg shadow-slate-200/50 border border-slate-100">
                            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-3">
                                <span className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                                    <Cpu size={18} />
                                </span>
                                Cấu hình chi tiết
                            </h3>

                            <div className="space-y-1">
                                {specItems.map((spec, idx) => (
                                    <SpecRow key={idx} label={spec.label} value={spec.value} icon={spec.icon} isHighlight={spec.highlight} />
                                ))}
                            </div>
                        </div>

                        {/* Warranty & Policies */}
                        <div className="order-5 w-full bg-white rounded-2xl p-5 md:p-6 shadow-lg shadow-slate-200/50 border border-slate-100">
                            <h3 className="text-base font-black text-slate-900 mb-4 flex items-center gap-3">
                                <span className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                                    <Shield size={18} />
                                </span>
                                Bảo hành & Cam kết
                            </h3>

                            <div className="space-y-3">
                                <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-green-200/60 flex items-center justify-between">
                                    <span className="text-sm font-bold text-green-800">Thời hạn bảo hành</span>
                                    <span className="text-sm font-black text-green-600 bg-green-100 px-3 py-1 rounded-full">{product.warrantyMonths || 12} Tháng</span>
                                </div>

                                {product.warranty?.items && product.warranty.items.length > 0 && (
                                    <div className="pt-2 space-y-2">
                                        {product.warranty.items.map((item: string, idx: number) => {
                                            let displayItem = item;
                                            if (displayItem.includes('Bảo hành') && displayItem.includes('tháng')) {
                                                displayItem = displayItem.replace(/Bảo hành \d+ tháng/, `Bảo hành ${product.warrantyMonths || 12} tháng`);
                                            }
                                            return (
                                                <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-600 py-1">
                                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                                    <span className="font-medium">{displayItem}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Gifts Card */}
                        {product.gift && (
                            <div className="order-6 w-full bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-5 md:p-6 shadow-xl shadow-indigo-500/20 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-10">
                                    <Gift className="w-6 h-6 text-yellow-300 animate-bounce" />
                                    Quà tặng hấp dẫn
                                </h3>
                                <div className="text-indigo-50 leading-relaxed whitespace-pre-line text-sm font-medium relative z-10">
                                    {product.gift}
                                </div>
                                <div className="absolute bottom-4 right-4 opacity-10">
                                    <Zap size={56} className="text-white fill-current" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ====== RIGHT COLUMN: Info & CTAs ====== */}
                    <div className="contents lg:block lg:col-span-5 lg:space-y-4 lg:sticky lg:top-20">
                        {/* Title & Price Card */}
                        <div className="order-2 w-full bg-white rounded-2xl p-5 md:p-6 shadow-lg shadow-slate-200/50 border border-slate-100">
                            {/* Rating & Share */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                                    ))}
                                    <span className="text-xs font-bold ml-2 text-slate-400">5.0 (42)</span>
                                </div>
                                <button
                                    onClick={handleCopyLink}
                                    className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[var(--color-primary)] transition-colors bg-slate-50 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-slate-100"
                                >
                                    {isCopied ? <Check size={14} className="text-green-500" /> : <Share2 size={14} />}
                                    {isCopied ? <span className="text-green-600">Đã lưu link</span> : <span>Chia sẻ</span>}
                                </button>
                            </div>

                            {/* Product Title */}
                            <h1 className="text-xl md:text-2xl font-black text-slate-900 leading-tight mb-3">
                                {product.name}
                            </h1>

                            {product.description && (
                                <p className="text-sm text-slate-500 mb-4 line-clamp-2 italic leading-relaxed">
                                    {product.description}
                                </p>
                            )}

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-5">
                                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg uppercase">
                                    SKU: {product.sku || product.model}
                                </span>
                                <span className="px-3 py-1 bg-blue-50 text-[var(--color-primary)] text-xs font-bold rounded-lg uppercase">
                                    {product.category?.name || product.categoryId?.name || 'Laptop'}
                                </span>
                                {product.isUsed && (
                                    <span className="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-lg uppercase border border-amber-100">
                                        Máy cũ {product.usedGrade && `- Loại ${product.usedGrade}`}
                                    </span>
                                )}
                            </div>

                            {/* ===== PRICE BLOCK ===== */}
                            <div className="mb-5 p-4 md:p-5 bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-2xl border border-blue-100/50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/5 rounded-full -mr-10 -mt-10 blur-2xl" />
                                <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] mb-2 relative z-10">Giá ưu đãi đặc biệt</div>
                                <div className="flex items-baseline gap-1.5 relative z-10">
                                    <span className="text-3xl md:text-4xl font-black text-[var(--color-primary)] tracking-tight tabular-nums">
                                        {currentPrice.toLocaleString('vi-VN')}
                                    </span>
                                    <span className="text-lg md:text-xl font-black text-[var(--color-primary)]/60 underline decoration-2 underline-offset-4">đ</span>
                                </div>
                                {hasDiscount && (
                                    <div className="flex items-center gap-3 mt-2 relative z-10">
                                        <span className="text-sm text-slate-400 line-through font-bold">
                                            {basePrice.toLocaleString('vi-VN')}đ
                                        </span>
                                        <span className="text-xs font-black text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                                            -{Math.round((1 - salePrice / basePrice) * 100)}%
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Quick Summary / TL;DR */}
                            <div className="mb-5 bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Zap size={14} className="text-[var(--color-primary)]" />
                                    <span className="text-[10px] font-black text-slate-800 uppercase tracking-[0.15em]">Tóm tắt máy</span>
                                </div>
                                <ul className="space-y-1.5">
                                    <li className="text-[13px] text-slate-600 flex items-start gap-2">
                                        <span className="text-[var(--color-primary)] mt-0.5 font-bold">•</span>
                                        <span>Hiệu năng mạnh mẽ với chip <strong className="text-slate-800">{cpu || 'N/A'}</strong></span>
                                    </li>
                                    <li className="text-[13px] text-slate-600 flex items-start gap-2">
                                        <span className="text-[var(--color-primary)] mt-0.5 font-bold">•</span>
                                        <span>Đa nhiệm mượt mà nhờ <strong className="text-slate-800">{ram || 'N/A'}</strong> RAM</span>
                                    </li>
                                    <li className="text-[13px] text-slate-600 flex items-start gap-2">
                                        <span className="text-[var(--color-primary)] mt-0.5 font-bold">•</span>
                                        <span>Lưu trữ tốc độ cao với <strong className="text-slate-800">{ssd || 'N/A'}</strong> SSD</span>
                                    </li>
                                </ul>
                            </div>

                            {/* ===== CTA BUTTONS ===== */}
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    {/* MUA NGAY */}
                                    <Button
                                        onClick={() => {
                                            if (product) {
                                                addToCart({ ...product, price: currentPrice });
                                                router.push('/checkout');
                                            }
                                        }}
                                        variant="primary"
                                        size="lg"
                                        fullWidth
                                        className="py-4 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 shadow-lg shadow-red-500/20 border-none rounded-xl"
                                    >
                                        <div className="flex flex-col items-center">
                                            <span className="text-lg font-black uppercase text-white tracking-wide">MUA NGAY</span>
                                            <span className="text-[11px] font-medium text-white/80">Giao tận nơi hoặc nhận tại cửa hàng</span>
                                        </div>
                                    </Button>

                                    <div className="grid grid-cols-2 gap-2">
                                        {/* Thêm vào giỏ */}
                                        <Button
                                            onClick={() => product && addToCart({ ...product, price: currentPrice })}
                                            variant="outline"
                                            size="lg"
                                            fullWidth
                                            className="py-3 border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-blue-50 rounded-xl"
                                        >
                                            <div className="flex flex-col items-center">
                                                <div className="flex items-center gap-1.5">
                                                    <ShoppingBag size={16} className="stroke-[2.5px]" />
                                                    <span className="text-xs font-bold uppercase">Thêm vào giỏ</span>
                                                </div>
                                                <span className="text-[9px] font-medium text-slate-400">Mua thêm đồ khác</span>
                                            </div>
                                        </Button>

                                        {/* Trả góp */}
                                        <Button
                                            onClick={() => setInstallmentOpen(true)}
                                            variant="primary"
                                            size="lg"
                                            fullWidth
                                            className="py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] shadow-lg shadow-blue-500/20 border-none rounded-xl"
                                        >
                                            <div className="flex flex-col items-center">
                                                <div className="flex items-center gap-1.5">
                                                    <CreditCard size={16} className="stroke-[2.5px]" />
                                                    <span className="text-xs font-bold uppercase text-white">Mua trả góp</span>
                                                </div>
                                                <span className="text-[9px] font-medium text-blue-100/80">Duyệt hồ sơ 5 phút</span>
                                            </div>
                                        </Button>
                                    </div>
                                </div>

                                <p className="text-[11px] text-slate-400 text-center italic">
                                    * Cam kết giá tốt nhất - Bảo hành chính hãng
                                </p>

                                {/* Contact Socials */}
                                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                                    <Button
                                        href="https://www.facebook.com/profile.php?id=61582947329036"
                                        variant="ghost"
                                        size="md"
                                        fullWidth
                                        className="h-10 bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20 border-none rounded-lg gap-2"
                                    >
                                        <Facebook size={18} />
                                        <span className="font-bold text-sm">Chat Facebook</span>
                                    </Button>
                                    <Button
                                        href="https://zalo.me/0978648720"
                                        variant="ghost"
                                        size="md"
                                        fullWidth
                                        className="h-10 bg-[#0068FF]/10 text-[#0068FF] hover:bg-[#0068FF]/20 border-none rounded-lg gap-2"
                                    >
                                        <MessageCircle size={18} />
                                        <span className="font-bold text-sm">Chat Zalo</span>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Trust Highlights */}
                        <div className="order-4 w-full bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl p-3 border border-slate-200/60 shadow-lg shadow-slate-200/20 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-2.5 relative overflow-hidden">
                            <HighlightCard icon={BadgeCheck} title="Chính hãng" desc="Cam kết 100%" />
                            <HighlightCard icon={Truck} title="Giao hàng" desc="Toàn quốc" />
                            <HighlightCard icon={RefreshCw} title="Lỗi 1 Đổi 1" desc="Dễ dàng" isHighlight />
                            <HighlightCard icon={Headphones} title="Hỗ trợ" desc="24/7 Online" />
                        </div>
                    </div>
                </div>

                {/* ========== CONTENT / DESCRIPTION ========== */}
                <div className="mt-8 bg-white rounded-2xl p-6 md:p-8 shadow-lg shadow-slate-200/50 border border-slate-100">
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                        <span className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <Info size={22} />
                        </span>
                        Thông tin sản phẩm
                    </h2>
                    <div className="text-slate-700 leading-relaxed text-[15px] md:text-base">
                        {product.description ? (
                            <div className="whitespace-pre-line space-y-4">
                                {product.description}
                                <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col items-center justify-center opacity-60">
                                    <p className="italic text-sm text-slate-400">Nội dung chi tiết bằng hình ảnh đang được cập nhật...</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <p className="text-slate-400 font-medium">Đang cập nhật nội dung chi tiết cho sản phẩm này...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ========== RELATED PRODUCTS ========== */}
                {relatedProducts.length > 0 && (
                    <div className="mt-12 md:mt-16 border-t border-slate-200 pt-10">
                        <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                            <span className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                                <TrendingUp size={22} />
                            </span>
                            Có thể bạn sẽ thích
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {relatedProducts.map(p => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                    </div>
                )}

                {/* ========== FAQ ========== */}
                <div className="mt-8 bg-white rounded-2xl p-6 md:p-8 shadow-lg shadow-slate-200/50 border border-slate-100">
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                        <span className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                            <MessageCircle size={22} />
                        </span>
                        Câu hỏi thường gặp (FAQ)
                    </h2>
                    <div className="space-y-3">
                        <FaqItem question={`Laptop ${product.name} có điểm gì nổi bật?`}>
                            {product.name} nổi bật với cấu hình mạnh mẽ {cpu || 'N/A'}, thiết kế hiện đại và khả năng tản nhiệt tốt, phù hợp cho nhiều nhu cầu sử dụng.
                        </FaqItem>
                        <FaqItem question="Chính sách bảo hành và hậu mãi ra sao?">
                            Sản phẩm được bảo hành {product.warrantyMonths || 12} tháng tại LapLap. Chúng tôi cam kết hỗ trợ kỹ thuật trọn đời và vệ sinh máy miễn phí định kỳ.
                        </FaqItem>
                        <FaqItem question={`Tôi có thể mua trả góp ${product.name} không?`}>
                            Có, bạn có thể mua trả góp qua thẻ tín dụng (0%) hoặc qua các công ty tài chính với thủ tục đơn giản, chỉ cần CCCD.
                        </FaqItem>
                    </div>
                </div>

                {/* ========== REVIEWS ========== */}
                <ProductReviews productId={product._id} />
            </main>

            {/* ========== MOBILE STICKY CTA BAR ========== */}
            <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-lg border-t border-slate-200 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
                <div className="flex items-center gap-3 max-w-lg mx-auto">
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-slate-400 font-bold truncate">{product.name}</p>
                        <p className="text-lg font-black text-[var(--color-primary)] tabular-nums">{currentPrice.toLocaleString('vi-VN')}đ</p>
                    </div>
                    <button
                        onClick={() => product && addToCart({ ...product, price: currentPrice })}
                        className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                        <ShoppingBag size={20} className="text-slate-700" />
                    </button>
                    <button
                        onClick={() => {
                            addToCart({ ...product, price: currentPrice });
                            router.push('/checkout');
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-black text-sm rounded-xl shadow-lg shadow-red-500/20 active:scale-95 transition-all uppercase tracking-wide"
                    >
                        MUA NGAY
                    </button>
                </div>
            </div>

            {/* Spacer for mobile sticky bar */}
            <div className="h-20 md:hidden" />

            <InstallmentModal
                isOpen={isInstallmentOpen}
                onClose={() => setInstallmentOpen(false)}
                productPrice={currentPrice}
                productName={product.name}
            />
        </div>
    );
}

/* ========== SUB COMPONENTS ========== */

function HighlightCard({ icon: Icon, title, desc, isHighlight = false }: { icon: any, title: string, desc: string, isHighlight?: boolean }) {
    if (isHighlight) {
        return (
            <div className="bg-gradient-to-br from-[var(--color-primary)] to-indigo-700 p-3.5 rounded-xl border border-blue-400/30 flex flex-col items-center text-center group hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/15 rounded-full blur-xl" />
                <div className="w-10 h-10 bg-white/20 text-white rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform backdrop-blur-sm border border-white/20 relative z-10">
                    <Icon size={20} />
                </div>
                <div className="text-[9px] font-black text-blue-100 uppercase tracking-widest mb-0.5 relative z-10">{title}</div>
                <div className="text-[13px] font-black text-white leading-tight relative z-10">{desc}</div>
            </div>
        );
    }

    return (
        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center group hover:bg-blue-50/50 hover:border-blue-200 hover:-translate-y-0.5 transition-all duration-300">
            <div className="w-9 h-9 bg-slate-50 border border-slate-100 text-slate-500 group-hover:bg-[var(--color-primary)] group-hover:text-white group-hover:border-transparent rounded-lg flex items-center justify-center mb-2 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/20">
                <Icon size={18} />
            </div>
            <div className="text-[9px] font-black text-slate-400 group-hover:text-blue-500/80 uppercase tracking-widest mb-0.5 transition-colors">{title}</div>
            <div className="text-[12px] font-black text-slate-800 leading-tight">{desc}</div>
        </div>
    );
}

function SpecRow({ label, value, icon: Icon, isHighlight = false }: { label: string, value: string, icon: any, isHighlight?: boolean }) {
    if (isHighlight) {
        return (
            <div className="flex items-center justify-between gap-4 py-3 px-4 bg-gradient-to-r from-[var(--color-primary)] to-indigo-600 rounded-xl shadow-md border border-blue-400/30 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
                <span className="text-sm text-blue-50 font-bold whitespace-nowrap relative z-10 flex items-center gap-2.5">
                    <Icon size={16} className="text-yellow-400 fill-current opacity-90" />
                    {label}
                </span>
                <span className="text-sm text-white font-black text-right relative z-10">{value}</span>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between gap-4 py-2.5 px-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors group">
            <span className="text-sm text-slate-500 font-medium whitespace-nowrap flex items-center gap-2.5">
                <span className="w-7 h-7 bg-slate-100 group-hover:bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center transition-colors">
                    <Icon size={14} className="text-slate-400 group-hover:text-[var(--color-primary)] transition-colors" />
                </span>
                {label}
            </span>
            <span className="text-sm text-slate-900 font-bold text-right group-hover:text-[var(--color-primary)] transition-colors">{value}</span>
        </div>
    );
}

function FaqItem({ question, children }: { question: string, children: React.ReactNode }) {
    return (
        <details className="group border border-slate-100 rounded-xl overflow-hidden hover:border-blue-200 transition-colors">
            <summary className="font-bold text-slate-800 cursor-pointer list-none flex justify-between items-center p-4 hover:bg-slate-50 transition-colors text-sm md:text-base">
                <span className="pr-4">{question}</span>
                <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform duration-300 flex-shrink-0" />
            </summary>
            <div className="px-4 pb-4">
                <p className="text-sm text-slate-600 leading-relaxed">{children}</p>
            </div>
        </details>
    );
}
