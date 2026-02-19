"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, X, Check, Filter } from "lucide-react";
import Button from "./ui/Button";

interface FilterSidebarProps {
    filters: any;
    toggleFilter: (key: string, value: string) => void;
    clearAllFilters: () => void;
    filterOptions: {
        cpus: string[];
        ssds: string[];
        gpus: string[];
        screens: string[];
    };
    brands: any[];
    categories: any[];
    className?: string;
    isOpen?: boolean;
    onClose?: () => void;
}

export default function LaptopFilterSidebar({
    filters,
    toggleFilter,
    clearAllFilters,
    filterOptions,
    brands,
    categories,
    className = "",
    isOpen = false,
    onClose
}: FilterSidebarProps) {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        price: true,
        purpose: true,
        brand: true,
        cpu: false,
        ssd: false,
        screen: false,
        gpu: false,
        ram: false,
    });

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const priceRanges = [
        { label: 'Dưới 10 triệu', value: 'Dưới 10 triệu' },
        { label: '10 - 15 triệu', value: '10-15 triệu' },
        { label: '15 - 20 triệu', value: '15-20 triệu' },
        { label: '20 - 25 triệu', value: '20-25 triệu' },
        { label: 'Trên 30 triệu', value: 'Trên 30 triệu' },
    ];

    const purposes = [
        { label: 'Văn phòng / Học tập', value: 'office' },
        { label: 'Gaming / Đồ họa', value: 'gaming' },
        { label: 'Mỏng nhẹ / Sang trọng', value: 'thin-light' },
        { label: 'Lập trình / Kỹ thuật', value: 'developer' },
    ];

    return (
        <aside className={`bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-full ${className}`}>
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                    <Filter size={20} className="text-blue-600" />
                    Bộ lọc tìm kiếm
                </div>
                {onClose && (
                    <button onClick={onClose} className="md:hidden p-1 rounded-full hover:bg-slate-200">
                        <X size={20} />
                    </button>
                )}
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-6 custom-scrollbar">

                {/* Purpose Filter (Smart) */}
                <div>
                    <button
                        onClick={() => toggleSection('purpose')}
                        className="flex items-center justify-between w-full font-bold text-slate-700 mb-3 hover:text-blue-600 transition"
                    >
                        Nhu cầu sử dụng
                        {expandedSections.purpose ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {expandedSections.purpose && (
                        <div className="space-y-2">
                            {purposes.map((item) => (
                                <label key={item.value} className="flex items-center gap-3 cursor-pointer group hover:bg-slate-50 p-2 rounded-lg transition">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${filters.purposes?.includes(item.value) ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white group-hover:border-blue-400'}`}>
                                        {filters.purposes?.includes(item.value) && <Check size={12} className="text-white" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={filters.purposes?.includes(item.value) || false}
                                        onChange={() => toggleFilter('purposes', item.value)}
                                    />
                                    <span className={`text-sm ${filters.purposes?.includes(item.value) ? 'font-bold text-blue-700' : 'text-slate-600'}`}>
                                        {item.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div className="h-px bg-slate-100"></div>

                {/* Price Filter */}
                <div>
                    <button
                        onClick={() => toggleSection('price')}
                        className="flex items-center justify-between w-full font-bold text-slate-700 mb-3 hover:text-blue-600 transition"
                    >
                        Mức giá
                        {expandedSections.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {expandedSections.price && (
                        <div className="space-y-2">
                            {priceRanges.map((range) => (
                                <label key={range.value} className="flex items-center gap-3 cursor-pointer group hover:bg-slate-50 p-2 rounded-lg transition">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${filters.priceRanges?.includes(range.label) ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white group-hover:border-blue-400'}`}>
                                        {filters.priceRanges?.includes(range.label) && <Check size={12} className="text-white" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={filters.priceRanges?.includes(range.label) || false}
                                        onChange={() => toggleFilter('priceRanges', range.label)}
                                    />
                                    <span className={`text-sm ${filters.priceRanges?.includes(range.label) ? 'font-bold text-blue-700' : 'text-slate-600'}`}>
                                        {range.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div className="h-px bg-slate-100"></div>

                {/* Brand Filter */}
                <div>
                    <button
                        onClick={() => toggleSection('brand')}
                        className="flex items-center justify-between w-full font-bold text-slate-700 mb-3 hover:text-blue-600 transition"
                    >
                        Thương hiệu
                        {expandedSections.brand ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {expandedSections.brand && (
                        <div className="space-y-2">
                            {brands.map((brand) => (
                                <label key={brand._id} className="flex items-center gap-3 cursor-pointer group hover:bg-slate-50 p-2 rounded-lg transition">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${filters.brands?.includes(brand._id) ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white group-hover:border-blue-400'}`}>
                                        {filters.brands?.includes(brand._id) && <Check size={12} className="text-white" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={filters.brands?.includes(brand._id) || false}
                                        onChange={() => toggleFilter('brands', brand._id)}
                                    />
                                    <span className={`text-sm ${filters.brands?.includes(brand._id) ? 'font-bold text-blue-700' : 'text-slate-600'}`}>
                                        {brand.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div className="h-px bg-slate-100"></div>

                {/* CPU Filter */}
                <div>
                    <button
                        onClick={() => toggleSection('cpu')}
                        className="flex items-center justify-between w-full font-bold text-slate-700 mb-3 hover:text-blue-600 transition"
                    >
                        Vi xử lý (CPU)
                        {expandedSections.cpu ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {expandedSections.cpu && (
                        <div className="space-y-2">
                            {filterOptions.cpus.slice(0, 10).map((cpu) => (
                                <label key={cpu} className="flex items-center gap-3 cursor-pointer group hover:bg-slate-50 p-2 rounded-lg transition">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${filters.cpus?.includes(cpu) ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white group-hover:border-blue-400'}`}>
                                        {filters.cpus?.includes(cpu) && <Check size={12} className="text-white" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={filters.cpus?.includes(cpu) || false}
                                        onChange={() => toggleFilter('cpus', cpu)}
                                    />
                                    <span className="text-sm text-slate-600 truncate" title={cpu}>
                                        {cpu}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div className="h-px bg-slate-100"></div>

                {/* RAM Filter (Placeholder if needed, otherwise skip) */}

                {/* SSD Filter */}
                <div>
                    <button
                        onClick={() => toggleSection('ssd')}
                        className="flex items-center justify-between w-full font-bold text-slate-700 mb-3 hover:text-blue-600 transition"
                    >
                        Ổ cứng (SSD)
                        {expandedSections.ssd ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {expandedSections.ssd && (
                        <div className="space-y-2">
                            {filterOptions.ssds.map((ssd) => (
                                <label key={ssd} className="flex items-center gap-3 cursor-pointer group hover:bg-slate-50 p-2 rounded-lg transition">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${filters.ssds?.includes(ssd) ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white group-hover:border-blue-400'}`}>
                                        {filters.ssds?.includes(ssd) && <Check size={12} className="text-white" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={filters.ssds?.includes(ssd) || false}
                                        onChange={() => toggleFilter('ssds', ssd)}
                                    />
                                    <span className="text-sm text-slate-600 truncate" title={ssd}>
                                        {ssd}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div className="h-px bg-slate-100"></div>

                {/* Screen Filter */}
                <div>
                    <button
                        onClick={() => toggleSection('screen')}
                        className="flex items-center justify-between w-full font-bold text-slate-700 mb-3 hover:text-blue-600 transition"
                    >
                        Màn hình
                        {expandedSections.screen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {expandedSections.screen && (
                        <div className="space-y-2">
                            {filterOptions.screens.map((screen) => (
                                <label key={screen} className="flex items-center gap-3 cursor-pointer group hover:bg-slate-50 p-2 rounded-lg transition">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${filters.screens?.includes(screen) ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white group-hover:border-blue-400'}`}>
                                        {filters.screens?.includes(screen) && <Check size={12} className="text-white" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={filters.screens?.includes(screen) || false}
                                        onChange={() => toggleFilter('screens', screen)}
                                    />
                                    <span className="text-sm text-slate-600 truncate" title={screen}>
                                        {screen}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div className="h-px bg-slate-100"></div>

                {/* GPU Filter */}
                <div>
                    <button
                        onClick={() => toggleSection('gpu')}
                        className="flex items-center justify-between w-full font-bold text-slate-700 mb-3 hover:text-blue-600 transition"
                    >
                        Card đồ họa (VGA)
                        {expandedSections.gpu ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {expandedSections.gpu && (
                        <div className="space-y-2">
                            {filterOptions.gpus.map((gpu) => (
                                <label key={gpu} className="flex items-center gap-3 cursor-pointer group hover:bg-slate-50 p-2 rounded-lg transition">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${filters.gpus?.includes(gpu) ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white group-hover:border-blue-400'}`}>
                                        {filters.gpus?.includes(gpu) && <Check size={12} className="text-white" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={filters.gpus?.includes(gpu) || false}
                                        onChange={() => toggleFilter('gpus', gpu)}
                                    />
                                    <span className="text-sm text-slate-600 truncate" title={gpu}>
                                        {gpu}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div className="h-px bg-slate-100"></div>

                {/* Status Filter */}
                <div>
                    <div className="space-y-2 mt-3">
                        <label className="flex items-center gap-3 cursor-pointer group hover:bg-slate-50 p-2 rounded-lg transition">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${filters.statuses?.includes('active') ? 'bg-green-600 border-green-600' : 'border-slate-300 bg-white group-hover:border-green-400'}`}>
                                {filters.statuses?.includes('active') && <Check size={12} className="text-white" />}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={filters.statuses?.includes('active') || false}
                                onChange={() => toggleFilter('statuses', 'active')}
                            />
                            <span className="text-sm font-bold text-green-700">
                                Chỉ hiện máy còn hàng
                            </span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                <Button
                    onClick={clearAllFilters}
                    variant="outline"
                    fullWidth
                    size="sm"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                >
                    Xóa bộ lọc
                </Button>
            </div>
        </aside>
    );
}
