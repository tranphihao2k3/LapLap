'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, Cpu, Monitor, CheckCircle, Zap, Shield, TrendingUp, Gift, CreditCard, Facebook, MessageCircle, Star, ShoppingBag, Truck, Headphones, BadgeCheck, Search, Info, Home, Share2, Check, RefreshCw } from 'lucide-react';
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
import ProductReviews from '@/components/ProductReviews';

interface ProductDetailClientProps {
    product: Product;
    relatedProducts: Product[];
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

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    // Ensure images array has at least one image
    const productImages = product.images && product.images.length > 0
        ? product.images
        : [product.image || 'https://placehold.co/600x450/e5e7eb/64748b?text=No+Image'];

    // Structured Data for SEO
    useEffect(() => {
        const baseUrl = 'https://laplapcantho.store';
        const productUrl = `${baseUrl}/laptops/${product.slug || product._id}`;
        const productImage = productImages[0]?.startsWith('http')
            ? productImages[0]
            : `${baseUrl}${productImages[0]}`;

        // Product Schema
        const productSchema = {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description || `Laptop ${product.name} tại Cần Thơ`,
            image: productImages.map(img => img.startsWith('http') ? img : `${baseUrl}${img}`),
            brand: {
                '@type': 'Brand',
                name: (product.brandId as any)?.name || 'Unknown'
            },
            category: (product.categoryId as any)?.name || 'Laptop',
            offers: {
                '@type': 'Offer',
                url: productUrl,
                priceCurrency: 'VND',
                price: product.price,
                availability: product.status === 'active'
                    ? 'https://schema.org/InStock'
                    : 'https://schema.org/OutOfStock',
                seller: {
                    '@type': 'Organization',
                    name: 'LapLap - Laptop Cần Thơ'
                }
            },
            aggregateRating: product.averageRating > 0 ? {
                '@type': 'AggregateRating',
                ratingValue: product.averageRating,
                reviewCount: product.reviewCount || 0
            } : undefined
        };

        // Breadcrumb Schema
        const breadcrumbSchema = {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Trang chủ',
                    item: baseUrl
                },
                {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Laptop',
                    item: `${baseUrl}/laptops`
                },
                {
                    '@type': 'ListItem',
                    position: 3,
                    name: product.name,
                    item: productUrl
                }
            ]
        };

        // Inject Product Schema
        const productScript = document.createElement('script');
        productScript.type = 'application/ld+json';
        productScript.id = 'product-schema';
        productScript.text = JSON.stringify(productSchema);

        // Inject Breadcrumb Schema
        const breadcrumbScript = document.createElement('script');
        breadcrumbScript.type = 'application/ld+json';
        breadcrumbScript.id = 'breadcrumb-schema';
        breadcrumbScript.text = JSON.stringify(breadcrumbSchema);

        // Remove existing schemas if any
        const existingProduct = document.getElementById('product-schema');
        const existingBreadcrumb = document.getElementById('breadcrumb-schema');
        if (existingProduct) existingProduct.remove();
        if (existingBreadcrumb) existingBreadcrumb.remove();

        // Add new schemas
        document.head.appendChild(productScript);
        document.head.appendChild(breadcrumbScript);

        return () => {
            const productEl = document.getElementById('product-schema');
            const breadcrumbEl = document.getElementById('breadcrumb-schema');
            if (productEl) document.head.removeChild(productEl);
            if (breadcrumbEl) document.head.removeChild(breadcrumbEl);
        };
    }, [product, productImages]);

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Breadcrumb - Redesigned */}
            {/* Breadcrumb - Simple Static */}
            <div className="bg-white border-b border-slate-100 mb-2">
                <div className="max-w-6xl mx-auto px-4 py-3">
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

            <main className="max-w-6xl mx-auto px-4 py-4 md:py-8">
                <div className="flex flex-col gap-4 lg:grid lg:grid-cols-12 lg:gap-5 xl:gap-8 lg:items-start">
                    {/* LEFT COLUMN: Images (Span 6 - 50%) */}
                    <div className="contents lg:block lg:col-span-6 lg:space-y-4">
                        <div className="order-1 w-full flex flex-col gap-4 lg:block lg:space-y-4">
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
                        {/* Warranty & Policies Section */}
                        <div className="order-5 w-full bg-white rounded-2xl p-4 md:p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
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
                                        {product.warranty.items.map((item, idx) => {
                                            let displayItem = item;
                                            if (displayItem.includes('Bảo hành') && displayItem.includes('tháng')) {
                                                displayItem = displayItem.replace(/Bảo hành \d+ tháng/, `Bảo hành ${product.warrantyMonths || 12} tháng`);
                                            }
                                            return (
                                                <div key={idx} className="flex items-start gap-2 text-sm text-slate-600">
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
                            <div className="order-6 w-full bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-4 md:p-6 shadow-xl shadow-indigo-500/30 text-white relative overflow-hidden">
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

                    {/* RIGHT COLUMN: Info & CTAs (Span 6 - 50%) */}
                    <div className="contents lg:block lg:col-span-6 lg:space-y-4">
                        {/* Title & Price Card */}
                        <div className="order-2 w-full bg-white rounded-2xl p-4 md:p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-1 text-blue-600">
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="text-xs font-bold ml-2 text-slate-400">5.0 (42)</span>
                                </div>
                                <button
                                    onClick={handleCopyLink}
                                    className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors bg-slate-50 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-slate-100"
                                >
                                    {isCopied ? <Check size={14} className="text-green-500" /> : <Share2 size={14} />}
                                    {isCopied ? <span className="text-green-600 text-[10px] md:text-xs">Đã lưu link</span> : <span className="text-[10px] md:text-xs">Chia sẻ</span>}
                                </button>
                            </div>

                            <h1 className="text-xl md:text-2xl font-black text-slate-900 leading-tight mb-2">
                                {product.name}
                            </h1>
                            {product.description && (
                                <p className="text-sm text-slate-600 mb-4 whitespace-pre-line italic">
                                    {product.description}
                                </p>
                            )}

                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg uppercase">
                                    Model: {product.model}
                                </span>
                                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg uppercase">
                                    {product.categoryId?.name || 'Laptop'}
                                </span>
                            </div>

                            <div className="mb-6 p-4 md:p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50 shadow-inner">
                                <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Giá ưu đãi đặc biệt</div>
                                <div className="flex items-baseline gap-1 text-blue-600">
                                    <span className="text-2xl md:text-4xl font-bold tracking-tight">
                                        {product.price.toLocaleString('vi-VN')}
                                    </span>
                                    <span className="text-lg md:text-xl font-bold underline decoration-[2px] underline-offset-8">đ</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {/* Main Actions */}
                                <div className="space-y-2">
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
                                        className="py-4 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 shadow-lg shadow-red-200 border-none rounded-xl"
                                    >
                                        <div className="flex flex-col items-center">
                                            <span className="text-lg font-black uppercase text-white tracking-wide">MUA NGAY</span>
                                            <span className="text-[11px] font-medium text-white/90">Giao tận nơi hoặc nhận tại cửa hàng</span>
                                        </div>
                                    </Button>

                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            onClick={() => product && addToCart(product)}
                                            variant="outline"
                                            size="lg"
                                            fullWidth
                                            className="py-3 border-2 border-blue-600 text-blue-700 hover:bg-blue-50 rounded-xl"
                                        >
                                            <div className="flex flex-col items-center">
                                                <div className="flex items-center gap-1.5 ">
                                                    <ShoppingBag size={18} className="stroke-[2.5px]" />
                                                    <span className="text-sm font-bold uppercase">Thêm vào giỏ</span>
                                                </div>
                                                <span className="text-[10px] font-medium text-slate-500">Mua thêm đồ khác</span>
                                            </div>
                                        </Button>

                                        <Button
                                            onClick={() => setInstallmentOpen(true)}
                                            variant="primary"
                                            size="lg"
                                            fullWidth
                                            className="py-3 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 border-none rounded-xl"
                                        >
                                            <div className="flex flex-col items-center">
                                                <div className="flex items-center gap-1.5">
                                                    <CreditCard size={18} className="stroke-[2.5px]" />
                                                    <span className="text-sm font-bold uppercase text-white">Mua trả góp</span>
                                                </div>
                                                <span className="text-[10px] font-medium text-blue-100">Duyệt hồ sơ 5 phút</span>
                                            </div>
                                        </Button>
                                    </div>
                                </div>

                                {/* Disclaimer */}
                                <p className="text-[11px] text-slate-400 text-center italic">
                                    * Cam kết giá tốt nhất - Bảo hành chính hãng
                                </p>

                                {/* Contact/Socials */}
                                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                                    <Button
                                        href="https://www.facebook.com/profile.php?id=61582947329036"
                                        variant="ghost"
                                        size="md"
                                        fullWidth
                                        className="h-10 bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20 border-none rounded-lg gap-2"
                                    >
                                        <Facebook size={18} />
                                        <span className="font-bold">Chat Facebook</span>
                                    </Button>
                                    <Button
                                        href="https://zalo.me/0978648720"
                                        variant="ghost"
                                        size="md"
                                        fullWidth
                                        className="h-10 bg-[#0068FF]/10 text-[#0068FF] hover:bg-[#0068FF]/20 border-none rounded-lg gap-2"
                                    >
                                        <MessageCircle size={18} />
                                        <span className="font-bold">Chat Zalo</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        {/* Specs Summary Card */}
                        <div className="order-3 w-full bg-white rounded-2xl p-4 md:p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                            <h3 className="text-base font-black text-slate-900 mb-3 flex items-center gap-2">
                                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                    <Cpu size={18} />
                                </span>
                                Cấu hình chi tiết
                            </h3>

                            <div className="space-y-2">
                                <SpecRow label="Vi xử lý (CPU)" value={product.specs.cpu || 'N/A'} />
                                <SpecRow label="Card đồ họa (VGA)" value={product.specs.gpu || 'N/A'} />
                                <SpecRow label="Bộ nhớ (RAM)" value={product.specs.ram || 'N/A'} />
                                <SpecRow label="Ổ cứng (SSD)" value={product.specs.ssd || 'N/A'} />
                                <SpecRow label="Màn hình" value={[product.specs.screen, product.specs.resolution, product.specs.hz].filter(Boolean).join(' ') || 'N/A'} />
                                <SpecRow label="Bảo hành" value={`${product.warrantyMonths || 12} Tháng`} isHighlight />
                            </div>
                        </div>

                        {/* DESCRIPTIVE HIGHLIGHTS (Trust Tray) - Moved here to follow Price Info on Mobile */}
                        <div className="order-4 w-full bg-gradient-to-br from-slate-50 to-blue-50/50 backdrop-blur-md rounded-[2rem] p-3 border border-slate-200/60 shadow-lg shadow-slate-200/20 grid grid-cols-2 md:grid-cols-4 gap-3 lg:mt-0 relative overflow-hidden">
                            {/* Decorative background glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent opacity-50 pointer-events-none"></div>

                            <HighlightCard icon={BadgeCheck} title="Chính hãng" desc="Cam kết 100%" />
                            <HighlightCard icon={Truck} title="Giao hàng" desc="Toàn quốc" />
                            <HighlightCard icon={RefreshCw} title="Lỗi 1 Đổi 1" desc="Dễ dàng" isHighlight />
                            <HighlightCard icon={Headphones} title="Hỗ trợ" desc="24/7 Online" />
                        </div>

                    </div>
                </div>

                {/* PRODUCT CONTENT / DESCRIPTION BLOCK */}
                <div className="mt-8 bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                        <span className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shadow-inner">
                            <Info size={24} />
                        </span>
                        Thông tin Nội dung sản phẩm
                    </h2>
                    <div className="text-slate-700 leading-relaxed text-[15px] md:text-base">
                        {product.description ? (
                            <div className="whitespace-pre-line space-y-4">
                                {product.description}
                                {/* Temporary placeholder for rich text - normally we'd render HTML here */}
                                <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col items-center justify-center opacity-70">
                                    <p className="italic text-sm text-slate-400">Các thông tin chi tiết bằng hình ảnh và đánh giá sâu hơn đang được cập nhật...</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <p className="text-slate-400 font-medium tracking-wide">Đang cập nhật nội dung chi tiết cho sản phẩm này...</p>
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
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {relatedProducts.map(p => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                    </div>
                )}

                {/* REVIEWS SECTION */}
                <ProductReviews productId={product._id} />

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

function HighlightCard({ icon: Icon, title, desc, isHighlight = false }: { icon: any, title: string, desc: string, isHighlight?: boolean }) {
    if (isHighlight) {
        return (
            <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 p-3.5 rounded-2xl border border-blue-400/50 flex flex-col items-center text-center group hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden z-10">
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-all duration-500"></div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-indigo-400/30 rounded-full blur-md"></div>

                <div className="w-11 h-11 bg-white/20 text-white rounded-xl flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-500 shadow-[0_0_15px_rgba(255,255,255,0.2)] backdrop-blur-md border border-white/20 relative z-10">
                    <Icon size={22} className="drop-shadow-sm" />
                </div>
                <div className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-1 relative z-10 drop-shadow-sm">{title}</div>
                <div className="text-[14px] font-black text-white leading-tight relative z-10 drop-shadow-md">{desc}</div>
            </div>
        );
    }

    return (
        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm shadow-slate-200/50 flex flex-col items-center text-center group hover:bg-gradient-to-br hover:from-white hover:to-blue-50/80 hover:border-blue-200 hover:shadow-md hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 relative z-10">
            <div className="w-10 h-10 bg-slate-50 border border-slate-100 group-hover:border-transparent text-slate-500 group-hover:bg-blue-600 group-hover:text-white rounded-xl flex items-center justify-center mb-2.5 transition-all duration-500 group-hover:shadow-[0_8px_16px_-6px_rgba(37,99,235,0.4)]">
                <Icon size={20} />
            </div>
            <div className="text-[9px] font-black text-slate-400 group-hover:text-blue-500/80 uppercase tracking-widest mb-1 transition-colors duration-300">{title}</div>
            <div className="text-[13px] font-black text-slate-800 leading-tight">{desc}</div>
        </div>
    );
}

function SpecRow({ label, value, isHighlight = false }: { label: string, value: string, isHighlight?: boolean }) {
    if (isHighlight) {
        return (
            <div className="flex justify-between items-center gap-4 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md border border-blue-400 group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
                <span className="text-[15px] text-blue-50 font-bold whitespace-nowrap relative z-10 flex items-center gap-2">
                    <Shield size={18} className="text-yellow-400 fill-current opacity-90" />
                    {label}
                </span>
                <span className="text-[15px] text-white font-black text-right relative z-10">{value}</span>
            </div>
        );
    }

    return (
        <div className="flex justify-between items-start gap-4 py-2.5 px-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors group">
            <span className="text-sm text-slate-500 font-medium whitespace-nowrap flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-blue-400 transition-colors ring-4 ring-slate-100 group-hover:ring-blue-100"></span>
                {label}
            </span>
            <span className="text-sm text-slate-900 font-bold text-right group-hover:text-blue-600 transition-colors">{value}</span>
        </div>
    );
}
