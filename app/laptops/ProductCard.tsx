"use client";

import Image from "next/image";
import { Cpu, HardDrive, MemoryStick, Monitor, Battery, Zap } from "lucide-react";

interface ProductCardProps {
    product: {
        name: string;
        image: string;
        price: number;
        specs: {
            cpu: string;
            gpu: string;
            ram: string;
            ssd: string;
            screen: string;
            battery: string;
        };
    };
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="border-2 border-[var(--color-border)] rounded-2xl bg-white hover:shadow-2xl transition-all duration-300 overflow-hidden group">

            {/* IMAGE - Larger */}
            <div className="relative w-full h-[280px] bg-gradient-to-br from-gray-50 to-white p-6">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* CONTENT */}
            <div className="p-5 flex flex-col gap-4">

                {/* NAME - Larger and bolder */}
                <h3 className="font-bold text-lg text-[var(--color-text-brand)] text-center line-clamp-2 min-h-[56px]">
                    {product.name}
                </h3>

                {/* SPECS - Grid 2 columns like the image */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 bg-blue-50 p-2.5 rounded-lg">
                        <Cpu className="w-5 h-5 text-[var(--color-border)] flex-shrink-0" />
                        <span className="text-sm font-semibold text-gray-800 truncate">
                            {product.specs.cpu}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-50 p-2.5 rounded-lg">
                        <Zap className="w-5 h-5 text-[var(--color-border)] flex-shrink-0" />
                        <span className="text-sm font-semibold text-gray-800 truncate">
                            {product.specs.gpu}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-50 p-2.5 rounded-lg">
                        <MemoryStick className="w-5 h-5 text-[var(--color-border)] flex-shrink-0" />
                        <span className="text-sm font-semibold text-gray-800 truncate">
                            {product.specs.ram}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-50 p-2.5 rounded-lg">
                        <HardDrive className="w-5 h-5 text-[#1e73be] flex-shrink-0" />
                        <span className="text-sm font-semibold text-gray-800 truncate">
                            {product.specs.ssd}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-50 p-2.5 rounded-lg">
                        <Monitor className="w-5 h-5 text-[#1e73be] flex-shrink-0" />
                        <span className="text-sm font-semibold text-gray-800 truncate">
                            {product.specs.screen}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-50 p-2.5 rounded-lg">
                        <Battery className="w-5 h-5 text-[#1e73be] flex-shrink-0" />
                        <span className="text-sm font-semibold text-gray-800 truncate">
                            {product.specs.battery}
                        </span>
                    </div>
                </div>

                {/* PRICE - Large and bold like the image */}
                <div className="text-center text-2xl font-bold text-[#1e73be] mt-2">
                    {product.price.toLocaleString('vi-VN')}
                </div>

                {/* ACTION */}
                <button
                    className="w-full bg-gradient-to-r from-[#1e73be] to-[#155a9c] hover:from-[#155a9c] hover:to-[#0d4373] text-white text-sm font-semibold py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                >
                    Xem chi tiết
                </button>

            </div>
        </div>
    );
}
