"use client";

import Link from "next/link";
import Image from "next/image";
import { Cpu, HardDrive, MemoryStick, Monitor, Battery, CreditCard, Scale, Check, ShoppingBag, Edit, Eye } from "lucide-react";
import Button from "@/components/ui/Button";
import { useSession } from "next-auth/react";
import { useComparison } from "@/context/ComparisonContext";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
    product: {
        _id: string;
        name: string;
        image: string;
        images?: string[];
        slug?: string;
        price: number;
        specs: {
            cpu: string;
            gpu: string;
            ram: string;
            ssd: string;
            screen: string;
            hz?: string;
            resolution?: string;
            battery: string;
        };
        description?: string;
        gift?: string;
        categoryId?: {
            name: string;
        };
        createdAt?: string;
    };
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCompare, removeFromCompare, selectedProducts } = useComparison();
    const { addToCart } = useCart();
    const { data: session } = useSession();
    const isSelected = selectedProducts.some((p) => p._id === product._id);

    // Check if product is new (created within 24 hours)
    const isNew = product.createdAt ? (new Date(product.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000) : false;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
    };

    const handleCompare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isSelected) {
            removeFromCompare(product._id);
        } else {
            addToCompare({
                _id: product._id,
                name: product.name,
                image: product.image || (product.images && product.images[0]) || '/placeholder-laptop.png',
                price: product.price,
                slug: product.slug,
                specs: product.specs
            });
        }
    };

    const specItems = [
        { icon: Cpu, value: product.specs.cpu, label: "CPU" },
        { icon: CreditCard, value: product.specs.gpu, label: "GPU" },
        { icon: MemoryStick, value: product.specs.ram, label: "RAM" },
        { icon: HardDrive, value: product.specs.ssd, label: "SSD" },
        { icon: Monitor, value: [product.specs.screen, product.specs.resolution, product.specs.hz].filter(Boolean).join(' ') || 'N/A', label: "Màn hình" },
        { icon: Battery, value: product.specs.battery, label: "Pin" },
    ];

    return (
        <div className="block h-full group">
            <div className="glass-card h-full flex flex-col rounded-2xl overflow-hidden relative cursor-pointer">
                {/* Main Link Overlay */}
                <Link
                    href={`/laptops/${product.slug || product._id}`}
                    className="absolute inset-0 z-10"
                    aria-label={product.name}
                />

                {/* ====== TOP BADGES ====== */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-20">
                    <div className="flex flex-col gap-1.5">
                        {isNew && (
                            <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow-lg shadow-rose-500/30 uppercase tracking-wider">
                                Mới
                            </span>
                        )}
                        {isSelected && (
                            <span className="bg-[var(--color-primary)] text-white text-[9px] font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                                <Check size={10} /> Đã chọn
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1.5">
                        {/* Compare Icon Button */}
                        <button
                            onClick={handleCompare}
                            className={`p-2 rounded-full backdrop-blur-lg shadow-lg transition-all duration-300 border ${isSelected
                                ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white scale-110'
                                : 'bg-white/80 border-white/50 text-gray-600 hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)]'
                                }`}
                            title="So sánh"
                        >
                            <Scale size={14} />
                        </button>

                        {/* Admin Edit */}
                        {session && (
                            <Link
                                href={`/admin/laptops/${product._id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-lg transition-colors shadow-lg border border-white/10"
                                title="Chỉnh sửa (Admin)"
                            >
                                <Edit size={14} />
                            </Link>
                        )}
                    </div>
                </div>

                {/* ====== IMAGE ZONE ====== */}
                <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden">
                    <Image
                        src={product.image || (product.images && product.images[0]) || '/placeholder-laptop.png'}
                        alt={`${product.name} - Laptop Cần Thơ - LapLap`}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-contain p-4 transition-all duration-700 ease-out group-hover:scale-110 group-hover:drop-shadow-2xl"
                    />

                    {/* Hover Overlay — Desktop Only (hidden on mobile via md:) */}
                    <div className="hidden md:flex absolute inset-0 bg-gradient-to-t from-[#0d1b2a]/95 via-[#0d1b2a]/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex-col justify-end p-4 z-20">
                        {/* Specs Grid on Hover */}
                        <div className="translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                            <div className="grid grid-cols-2 gap-1.5 mb-3">
                                {specItems.map((spec, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2 py-1.5 rounded-lg border border-white/10"
                                        style={{ transitionDelay: `${idx * 50}ms` }}
                                    >
                                        <spec.icon className="w-3 h-3 text-blue-300 flex-shrink-0" />
                                        <span className="text-[10px] font-semibold text-white/90 truncate" title={spec.value}>
                                            {spec.value}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Button on Hover */}
                            <button
                                onClick={handleAddToCart}
                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-white text-[var(--color-primary)] font-bold text-sm rounded-xl hover:bg-blue-50 transition-colors active:scale-95 shadow-xl"
                            >
                                <ShoppingBag size={16} />
                                Thêm vào giỏ
                            </button>
                        </div>
                    </div>

                    {/* Subtle bottom gradient (always visible) */}
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none md:hidden" />
                </div>

                {/* ====== CONTENT ZONE ====== */}
                <div className="flex-1 flex flex-col p-3 md:p-4 bg-white">

                    {/* Product Name */}
                    <h3 className="font-bold text-sm md:text-[15px] text-gray-800 text-center line-clamp-2 min-h-[40px] md:min-h-[44px] leading-snug group-hover:text-[var(--color-primary)] transition-colors duration-300">
                        {product.name}
                    </h3>

                    {/* Mobile Specs — Pro Grid (visible only on mobile) */}
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-3 md:hidden">
                        {specItems.map((spec, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 overflow-hidden">
                                <spec.icon className="w-3 h-3 text-[var(--color-primary)]/60 flex-shrink-0" />
                                <span className="text-[10px] font-bold text-gray-600 truncate">
                                    {spec.value}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Mini Specs — Subtle hint (hidden on mobile) */}
                    <div className="hidden md:flex items-center justify-center gap-2 mt-2 text-[10px] text-gray-500 font-bold tracking-wide">
                        <span>{product.specs.cpu?.split(' ').slice(0, 2).join(' ')}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        <span>{product.specs.ram}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        <span>{product.specs.ssd}</span>
                    </div>

                    {/* Price + Actions */}
                    <div className="mt-auto pt-3">
                        {/* Price */}
                        <div className="flex items-baseline justify-center gap-1 mb-3">
                            <span className="text-lg sm:text-xl md:text-2xl font-extrabold text-[var(--color-primary)] tracking-tight tabular-nums">
                                {product.price.toLocaleString('vi-VN')}
                            </span>
                            <span className="text-xs md:text-sm font-bold text-[var(--color-primary)]/70 underline underline-offset-2">đ</span>
                        </div>

                        {/* Mobile CTA (hidden on desktop where hover takes over) */}
                        <div className="md:hidden relative z-20">
                            <button
                                onClick={handleAddToCart}
                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[var(--color-primary)] text-white font-bold text-sm rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors active:scale-95 shadow-lg shadow-blue-500/20"
                            >
                                <ShoppingBag size={16} />
                                Thêm vào giỏ
                            </button>
                        </div>

                        {/* Desktop: Hint to hover */}
                        <div className="hidden md:flex items-center justify-center gap-1.5 text-[10px] text-gray-400 font-medium opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                            <Eye size={12} />
                            <span>Chạm để xem chi tiết</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
