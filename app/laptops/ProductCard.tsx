"use client";

import Link from "next/link";
import Image from "next/image";
import { Cpu, HardDrive, MemoryStick, Monitor, Battery, CreditCard, Scale, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { useComparison } from "@/context/ComparisonContext";

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
            battery: string;
        };
        gift?: string;
        categoryId?: {
            name: string;
        };
    };
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCompare, removeFromCompare, selectedProducts } = useComparison();
    const isSelected = selectedProducts.some((p) => p._id === product._id);

    const handleCompare = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to detail page if user clicks button
        e.stopPropagation();

        if (isSelected) {
            removeFromCompare(product._id);
        } else {
            // Ensure product object matches ProductSummary type
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

    return (
        <div className="h-full flex flex-col border-2 border-[var(--color-border)] rounded-2xl bg-white hover:shadow-2xl transition-all duration-300 overflow-hidden group relative">

            {/* COMPARING BADGE (Optional) */}
            {isSelected && (
                <div className="absolute top-2 left-2 z-20 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md flex items-center gap-1">
                    <Check size={12} /> Đã chọn
                </div>
            )}

            {/* IMAGE - Larger */}
            <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-gray-50 to-white p-6 group/image">
                <Image
                    src={product.image || (product.images && product.images[0]) || '/placeholder-laptop.png'}
                    alt={product.name}
                    fill
                    unoptimized
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* COMPARE ACTION */}


            {/* CONTENT */}
            <div className="p-3 md:p-4 flex flex-col gap-2 md:gap-3 flex-1">

                {/* NAME - Compact for better fit */}
                <Link href={`/laptops/${product.slug || product._id}`} className="group/title">
                    <h3 className="font-bold text-sm md:text-base text-[var(--color-text-brand)] text-center line-clamp-2 min-h-[40px] md:min-h-[48px] group-hover/title:text-blue-600 transition-colors">
                        {product.name}
                    </h3>
                </Link>

                {/* SPECS - Grid 2 columns like the image */}
                {/* SPECS - Tags on mobile, Grid on desktop */}
                <div className="flex-1">
                    <div className="flex flex-wrap gap-1.5 md:grid md:grid-cols-2 md:gap-2">
                        {[
                            { icon: Cpu, value: product.specs.cpu },
                            { icon: CreditCard, value: product.specs.gpu },
                            { icon: MemoryStick, value: product.specs.ram },
                            { icon: HardDrive, value: product.specs.ssd },
                            { icon: Monitor, value: product.specs.screen },
                            { icon: Battery, value: product.specs.battery },
                        ].map((spec, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-1 md:gap-1.5 bg-gray-100 md:bg-blue-50 px-2 py-1 md:p-2 rounded md:rounded-lg max-w-full"
                            >
                                <spec.icon className="w-3 h-3 md:w-4 md:h-4 text-gray-500 md:text-[#1e73be] flex-shrink-0" />
                                <span className="text-[10px] md:text-xs font-medium md:font-semibold text-gray-700 md:text-gray-800 truncate">
                                    {spec.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* PRICE - Compact */}
                {/* PRICE & ACTIONS */}
                <div className="mt-auto pt-3 border-t border-dashed border-gray-100 flex flex-col gap-3">
                    <div className="text-center text-lg md:text-xl font-black text-blue-600 tracking-tight">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div // Wrapper to handle click event properly
                            onClick={handleCompare}
                            className="w-full"
                        >
                            <Button
                                variant="outline"
                                size="sm"
                                fullWidth
                                className={`text-xs px-2 h-9 whitespace-nowrap gap-1.5 ${isSelected ? 'bg-blue-50 border-blue-500 text-blue-600 font-bold' : 'border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-600'}`}
                                leftIcon={isSelected ? <Check size={14} /> : <Scale size={14} />}
                            >
                                {isSelected ? "Đã chọn" : "So sánh"}
                            </Button>
                        </div>
                        <Button
                            href={`/laptops/${product.slug || product._id}`}
                            variant="primary"
                            size="sm"
                            fullWidth
                            className="text-xs px-2 h-9 shadow-blue-200"
                        >
                            Chi tiết
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}
