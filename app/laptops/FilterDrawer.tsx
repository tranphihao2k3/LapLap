'use client';

import { X, RotateCcw, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Button from "@/components/ui/Button";

interface FilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    filters: any;
    toggleFilter: (key: any, value: string) => void;
    clearAllFilters: () => void;
    filterOptions: any;
    categories: any[];
    brands: any[];
    priceRanges: any[];
    totalProducts: number;
    sortBy: string;
    setSortBy: (val: string) => void;
}

export default function FilterDrawer({
    isOpen,
    onClose,
    filters,
    toggleFilter,
    clearAllFilters,
    filterOptions,
    categories,
    brands,
    priceRanges,
    totalProducts,
    sortBy,
    setSortBy
}: FilterDrawerProps) {
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        categories: true,
        brands: true
    });

    const toggleSection = (key: string) => {
        setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const filterSections = [
        { key: 'categories', label: 'Phân loại', data: categories, type: 'object' },
        { key: 'brands', label: 'Hãng', data: brands, type: 'object' },
        { key: 'cpus', label: 'CPU', data: filterOptions.cpus, type: 'string' },
        { key: 'rams', label: 'RAM', data: filterOptions.rams, type: 'string' },
        { key: 'ssds', label: 'Ổ cứng', data: filterOptions.ssds, type: 'string' },
        { key: 'gpus', label: 'VGA', data: filterOptions.gpus, type: 'string' },
        { key: 'priceRanges', label: 'Khoảng giá', data: priceRanges.map(r => r.label), type: 'string' },
        { key: 'screens', label: 'Màn hình', data: filterOptions.screens, type: 'string' },
        { key: 'hzs', label: 'Tần số quét', data: filterOptions.hzs, type: 'string' },
        { key: 'resolutions', label: 'Độ phân giải', data: filterOptions.resolutions, type: 'string' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-[2px] md:hidden"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 bg-white z-[101] rounded-t-[32px] flex flex-col max-h-[92vh] md:hidden shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)]"
                    >
                        {/* Handle */}
                        <div className="flex justify-center pt-3 pb-1">
                            <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
                        </div>

                        {/* Header */}
                        <div className="px-6 py-4 border-b flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-black text-gray-900">Bộ lọc</h2>
                                <p className="text-[11px] text-blue-600 font-black uppercase tracking-widest mt-0.5">Tìm thấy {totalProducts} máy</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full text-gray-400 hover:text-gray-900 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
                            {/* Sort Section - UI Select Style */}
                            <div className="p-2">
                                <h3 className="text-[11px] font-black uppercase tracking-wider text-gray-400 mb-3 px-2">Ưu tiên hiển thị</h3>
                                <div className="grid grid-cols-1 gap-1">
                                    {[
                                        { value: '', label: 'Mới nhất' },
                                        { value: 'price_asc', label: 'Giá thấp đến cao' },
                                        { value: 'price_desc', label: 'Giá cao đến thấp' }
                                    ].map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => setSortBy(opt.value)}
                                            className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${sortBy === opt.value
                                                    ? 'bg-blue-50 text-blue-700'
                                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            {opt.label}
                                            {sortBy === opt.value && <Check size={16} className="text-blue-600" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="h-px bg-gray-100 mx-4 my-2" />

                            {filterSections.map((section) => {
                                const activeCount = filters[section.key].length;
                                const isExpanded = !!openSections[section.key];

                                return (
                                    <div key={section.key} className="overflow-hidden">
                                        <button
                                            onClick={() => toggleSection(section.key)}
                                            className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all ${activeCount > 0 ? 'bg-blue-50/50' : 'hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`text-sm font-black ${activeCount > 0 ? 'text-blue-700' : 'text-gray-800'}`}>
                                                    {section.label}
                                                </span>
                                                {activeCount > 0 && (
                                                    <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shadow-lg shadow-blue-200">
                                                        {activeCount}
                                                    </span>
                                                )}
                                            </div>
                                            <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                        </button>

                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-2 pt-2 pb-4 flex flex-wrap gap-2">
                                                        {section.data.map((item: any) => {
                                                            const id = section.type === 'object' ? item._id : item;
                                                            const label = section.type === 'object' ? item.name : item;
                                                            const isActive = filters[section.key].includes(id);

                                                            return (
                                                                <button
                                                                    key={id}
                                                                    onClick={() => toggleFilter(section.key as any, id)}
                                                                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 border ${isActive
                                                                            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100'
                                                                            : 'bg-white text-gray-600 border-gray-100 hover:border-gray-200'
                                                                        }`}
                                                                >
                                                                    {label}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t bg-gray-50/80 backdrop-blur-md grid grid-cols-2 gap-4">
                            <button
                                onClick={clearAllFilters}
                                className="flex items-center justify-center gap-2 py-3.5 border-2 border-gray-200 rounded-2xl text-sm font-black text-gray-600 hover:bg-white transition-all active:scale-95"
                            >
                                <RotateCcw size={16} />
                                Làm mới
                            </button>
                            <Button
                                onClick={onClose}
                                variant="primary"
                                className="py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-blue-100"
                            >
                                Xem kết quả
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
