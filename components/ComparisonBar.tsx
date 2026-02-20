"use client";

import { useComparison } from "@/context/ComparisonContext";
import { X, ChevronDown, ChevronUp, Check, Scale } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ComparisonBar() {
    const { selectedProducts, removeFromCompare, clearComparison, isOpen, toggleOpen } = useComparison();

    if (selectedProducts.length === 0) return null;

    return (
        <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-[110] mb-1 md:mb-0 pointer-events-none flex flex-col items-center">

            {/* Toggle Button (always visible if content exists) */}
            <div className="pointer-events-auto bg-blue-600 text-white px-6 py-2 rounded-t-xl shadow-lg cursor-pointer flex items-center gap-2 hover:bg-blue-700 transition-colors" onClick={toggleOpen}>
                <span className="font-bold flex items-center gap-2">
                    <Scale size={18} /> So sánh ({selectedProducts.length})
                </span>
                {isOpen ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </div>

            {/* Main Bar Content */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="w-full bg-white border-t-2 border-blue-500 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] pointer-events-auto"
                    >
                        <div className="container mx-auto px-4 py-4">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                                {/* Product List */}
                                <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {selectedProducts.map((product) => (
                                        <div key={product._id} className="relative group bg-gray-50 rounded-lg p-2 border border-gray-200 flex items-center gap-3">
                                            <div className="relative w-12 h-12 flex-shrink-0 bg-white rounded border border-gray-100 overflow-hidden">
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    fill
                                                    className="object-contain p-1"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-xs font-semibold text-gray-800 line-clamp-2 leading-tight" title={product.name}>
                                                    {product.name}
                                                </h4>
                                                <p className="text-xs text-blue-600 font-bold mt-0.5">
                                                    {product.price.toLocaleString('vi-VN')}đ
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCompare(product._id)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                title="Xóa khỏi so sánh"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Empty Slots (optional, for visual guide) */}
                                    {Array.from({ length: 4 - selectedProducts.length }).map((_, i) => (
                                        <div key={`empty-${i}`} className="hidden md:flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg h-[74px] bg-gray-50/50 text-gray-400 text-xs">
                                            Thêm sản phẩm
                                        </div>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                                    <button
                                        onClick={clearComparison}
                                        className="text-gray-500 text-sm hover:text-red-500 font-medium whitespace-nowrap px-4 py-2 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        Xóa tất cả
                                    </button>
                                    <Link
                                        href={selectedProducts.length > 1 ? "/so-sanh" : "#"}
                                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold shadow-lg transition-all whitespace-nowrap ${selectedProducts.length > 1
                                            ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/30 active:scale-95"
                                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            }`}
                                        onClick={(e) => {
                                            if (selectedProducts.length <= 1) {
                                                e.preventDefault();
                                                alert("Vui lòng chọn ít nhất 2 sản phẩm để so sánh!");
                                            }
                                        }}
                                    >
                                        so sánh ngay
                                    </Link>
                                </div>

                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
