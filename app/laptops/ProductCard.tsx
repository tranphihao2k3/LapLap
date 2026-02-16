"use client";

import Link from "next/link";
import Image from "next/image";
import { Cpu, HardDrive, MemoryStick, Monitor, Battery, CreditCard } from "lucide-react";

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
    return (
        <div className="h-full flex flex-col border-2 border-[var(--color-border)] rounded-2xl bg-white hover:shadow-2xl transition-all duration-300 overflow-hidden group">

            {/* IMAGE - Larger */}
            <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-gray-50 to-white p-6">
                <Image
                    src={product.image || (product.images && product.images[0]) || '/placeholder-laptop.png'}
                    alt={product.name}
                    fill
                    unoptimized
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                />
            </div>

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
                <div className="mt-auto pt-2">
                    <div className="text-center text-lg md:text-xl font-bold text-[#1e73be] mb-2">
                        {product.price.toLocaleString('vi-VN')}
                    </div>

                    <Link
                        href={`/laptops/${product.slug || product._id}`}
                        className="w-full bg-gradient-to-r from-[#1e73be] to-[#155a9c] hover:from-[#155a9c] hover:to-[#0d4373] text-white text-xs md:text-sm font-semibold py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-center block"
                    >
                        Xem chi tiết
                    </Link>
                </div>

            </div>
        </div>
    );
}
