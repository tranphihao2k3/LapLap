"use client";

import { useComparison } from "@/context/ComparisonContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { Check, X, Shield, Gift, Cpu, CreditCard, MemoryStick, HardDrive, Monitor, Battery } from "lucide-react";

export default function ComparisonPage() {
    const { selectedProducts, removeFromCompare } = useComparison();

    if (selectedProducts.length === 0) {
        return (
            <>
                <Header />
                <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-20 px-4 text-center">
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-md w-full">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ScaleIcon size={40} className="text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Chưa có sản phẩm nào</h2>
                        <p className="text-gray-500 mb-8">Vui lòng chọn ít nhất 2 sản phẩm để tiến hành so sánh.</p>
                        <Link href="/laptops" className="inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/30">
                            Xem danh sách Laptop
                        </Link>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    // Define rows for specs
    const specRows = [
        { label: "CPU", icon: Cpu, key: "cpu" },
        { label: "RAM", icon: MemoryStick, key: "ram" },
        { label: "Ổ cứng", icon: HardDrive, key: "ssd" },
        { label: "VGA / GPU", icon: CreditCard, key: "gpu" },
        { label: "Màn hình", icon: Monitor, key: "screen" },
        { label: "Pin", icon: Battery, key: "battery" },
    ];

    return (
        <>
            <Header />
            {/* Hero Section - Standardized Height & Style */}
            <section className="relative w-full h-auto bg-gradient-to-r from-[#124A84] via-[#0d3560] to-[#0a2d54] text-white overflow-hidden shadow-lg border-b border-white/10 py-12 md:py-16">
                {/* Background Patterns */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="container mx-auto max-w-5xl px-4 h-full relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight uppercase tracking-tight">
                        So Sánh <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">Sản Phẩm</span>
                    </h1>
                    <p className="text-blue-100 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
                        So sánh chi tiết thông số kỹ thuật, giá bán và khuyến mãi để chọn chiếc Laptop ưng ý nhất.
                    </p>
                </div>
            </section>

            <main className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4 max-w-7xl">

                    {/* Comparison Table Container */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full min-w-[800px] border-collapse">
                                <thead>
                                    <tr>
                                        <th className="p-6 text-left w-[200px] bg-gray-50 border-b border-gray-200 sticky left-0 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.05)] align-top">
                                            <span className="text-lg font-bold block text-gray-400 uppercase tracking-wider text-sm mt-10">Sản phẩm</span>
                                        </th>
                                        {selectedProducts.map((product) => (
                                            <th key={product._id} className="p-6 w-[300px] border-b border-gray-200 align-top relative group hover:bg-gray-50 transition-colors">
                                                <button
                                                    onClick={() => removeFromCompare(product._id)}
                                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                                    title="Xóa"
                                                >
                                                    <X size={20} />
                                                </button>

                                                <div className="relative w-full aspect-[4/3] mb-4 bg-gray-50 rounded-lg border border-gray-100 p-4">
                                                    <Image
                                                        src={product.image || '/placeholder-laptop.png'}
                                                        alt={product.name}
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>

                                                <Link href={`/laptops/${product.slug || product._id}`} className="block">
                                                    <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2 hover:text-blue-600 transition-colors min-h-[56px]">
                                                        {product.name}
                                                    </h3>
                                                </Link>

                                                <div className="text-2xl font-black text-blue-600 mb-4">
                                                    {product.price.toLocaleString('vi-VN')}đ
                                                </div>

                                                <Link
                                                    href={`/laptops/${product.slug || product._id}`}
                                                    className="block w-full py-2.5 bg-blue-600 text-white font-bold rounded-lg text-center shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
                                                >
                                                    MUA NGAY
                                                </Link>
                                            </th>
                                        ))}
                                        {/* Fill empty columns if less than 2? No, simple map is fine. But for layout stability we might want placeholders. Let's stick to dynamic columns. */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Technical Specs Header */}
                                    <tr>
                                        <td colSpan={selectedProducts.length + 1} className="bg-gray-100 p-3 font-bold text-gray-700 border-y border-gray-200">
                                            THÔNG SỐ KỸ THUẬT
                                        </td>
                                    </tr>

                                    {specRows.map((row) => (
                                        <tr key={row.key} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4 md:p-6 font-semibold text-gray-600 border-b border-gray-100 bg-gray-50/30 sticky left-0 z-10 backdrop-blur-sm border-r border-gray-200 align-middle">
                                                <div className="flex items-center gap-2">
                                                    <row.icon size={18} className="text-blue-500" />
                                                    {row.label}
                                                </div>
                                            </td>
                                            {selectedProducts.map((product) => (
                                                <td key={`${product._id}-${row.key}`} className="p-4 md:p-6 text-gray-800 font-medium border-b border-gray-100 border-r border-gray-100 align-middle leading-relaxed">
                                                    {(product.specs as any)[row.key] || "Đang cập nhật"}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}

                                    {/* Additional info usually exists but not in ProductSummary props yet. Can add later. */}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

function ScaleIcon({ size, className }: { size?: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size || 24}
            height={size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
            <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
            <path d="M7 21h10" />
            <path d="M12 3v18" />
            <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
        </svg>
    )
}
