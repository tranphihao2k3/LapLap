'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from './ProductCard';
import { Product, Category, Brand } from '@/types/api';
import { ChevronDown, ChevronLeft, ChevronRight, X, Search as SearchIcon } from 'lucide-react';
import Button from '@/components/ui/Button';
import TechLoader from '@/components/ui/TechLoader';
import FilterDrawer from './FilterDrawer';
import { SlidersHorizontal } from 'lucide-react';
import { useFilterOptions, useBrands, useProductSpecs, useProducts } from '@/hooks/use-products';



export default function LaptopsClient() {
    return (
        <Suspense fallback={<TechLoader />}>
            <LaptopsContent />
        </Suspense>
    );
}


function LaptopsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialSearch = searchParams.get('search') || '';

    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [sortBy, setSortBy] = useState<string>('');

    // Sync search query from URL
    useEffect(() => {
        setSearchQuery(searchParams.get('search') || '');
    }, [searchParams]);

    // Pagination
    const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
    const [currentPage, setCurrentPage] = useState(pageFromUrl);
    const itemsPerPage = 12;

    // Sync page query from URL
    useEffect(() => {
        const urlPage = parseInt(searchParams.get('page') || '1', 10);
        if (urlPage !== currentPage) {
            setCurrentPage(urlPage);
        }
    }, [searchParams]);

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        if (newPage > 1) {
            params.set('page', newPage.toString());
        } else {
            params.delete('page');
        }
        router.push(`/laptops?${params.toString()}`, { scroll: true });
    };

    // Filters
    const [filters, setFilters] = useState({
        categories: [] as string[],
        brands: [] as string[],
        cpus: [] as string[],
        ssds: [] as string[],
        rams: [] as string[],
        gpus: [] as string[],
        priceRanges: [] as string[],
        screens: [] as string[],
        hzs: [] as string[],
        resolutions: [] as string[],
        weights: [] as string[],
        statuses: [] as string[],
    });

    // Dropdown states
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

    // ── React Query: filter options, brands, specs ─────────────
    const LAPTOP_BRANDS = [
        'Dell', 'HP', 'ASUS', 'MSI', 'Acer', 'Lenovo', 'ThinkPad',
        'Apple', 'MacBook', 'Gigabyte', 'Razer', 'Microsoft', 'Surface',
        'LG', 'Samsung'
    ];

    const { data: filterData } = useFilterOptions();
    const categories = filterData?.categories ?? [];

    const { data: allBrands } = useBrands({ categorySlug: 'laptop', hasProducts: true, limit: 100 });
    const brands = useMemo(() =>
        (allBrands ?? []).filter(b =>
            LAPTOP_BRANDS.some(lb => b.name.toLowerCase().includes(lb.toLowerCase()))
        ),
        [allBrands]
    );

    const { data: specsData } = useProductSpecs('laptop');
    const filterOptions = useMemo(() => ({
        cpus: specsData?.['CPU'] ?? [],
        ssds: specsData?.['Ổ cứng'] ?? [],
        gpus: specsData?.['GPU'] ?? [],
        rams: specsData?.['RAM'] ?? [],
        screens: specsData?.['Kích thước màn hình'] ?? [],
        hzs: specsData?.['Tần số quét'] ?? [],
        resolutions: specsData?.['Độ phân giải'] ?? [],
    }), [specsData]);

    // Sync filters from URL params (Landing Page support)
    useEffect(() => {
        if (categories.length > 0 || brands.length > 0) {
            const categorySlug = searchParams.get('category');
            const brandSlug = searchParams.get('brand');

            setFilters(prev => {
                const newFilters = { ...prev };
                let changed = false;

                if (categorySlug) {
                    const cat = categories.find(c => c.slug === categorySlug || c._id === categorySlug);
                    if (cat && !prev.categories.includes(cat._id)) {
                        newFilters.categories = [cat._id];
                        changed = true;
                    }
                }

                if (brandSlug) {
                    const brand = brands.find(b => b.slug === brandSlug || b._id === brandSlug);
                    if (brand && !prev.brands.includes(brand._id)) {
                        newFilters.brands = [brand._id];
                        changed = true;
                    }
                }

                return changed ? newFilters : prev;
            });
        }
    }, [searchParams, categories, brands]);


    // Price ranges
    const priceRanges = [
        { label: 'Dưới 10 triệu', min: 0, max: 10000000 },
        { label: '10-15 triệu', min: 10000000, max: 15000000 },
        { label: '15-20 triệu', min: 15000000, max: 20000000 },
        { label: '20-25 triệu', min: 20000000, max: 25000000 },
        { label: '25-30 triệu', min: 25000000, max: 30000000 },
        { label: 'Trên 30 triệu', min: 30000000, max: Infinity },
    ];

    // Weight ranges
    const weightRanges = [
        { label: 'Dưới 1.5kg (Mỏng nhẹ)', value: 'light' },
        { label: '1.5-2kg (Trung bình)', value: 'medium' },
        { label: 'Trên 2kg (Gaming)', value: 'heavy' },
    ];

    // ── React Query: products with filters ─────────────────────
    const buildSpecsParam = useMemo(() => {
        const specParts: string[] = [];
        const mapSpec = (key: string, selected: string[], options: any[]) => {
            if (selected.length === 0) return;
            const allRaw: string[] = [];
            selected.forEach(norm => {
                const opt = options.find((o: any) => o.normalized === norm);
                if (opt) allRaw.push(...opt.rawValues);
            });
            if (allRaw.length > 0) specParts.push(`${key}:${allRaw.join('|')}`);
        };
        mapSpec('CPU', filters.cpus, filterOptions.cpus);
        mapSpec('RAM', filters.rams, filterOptions.rams);
        mapSpec('Ổ cứng', filters.ssds, filterOptions.ssds);
        mapSpec('GPU', filters.gpus, filterOptions.gpus);
        mapSpec('Tần số quét', filters.hzs, filterOptions.hzs);
        mapSpec('Màn hình', filters.screens, filterOptions.screens);
        if (filters.resolutions.length > 0) mapSpec('Màn hình', filters.resolutions, filterOptions.resolutions);
        return specParts.length > 0 ? specParts.join(',') : undefined;
    }, [filters, filterOptions]);

    // Debounce search query for API
    const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchQuery), 300);
        return () => clearTimeout(t);
    }, [searchQuery]);

    const { data: productsData, isLoading: loading } = useProducts({
        active: true,
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch || undefined,
        categorySlug: 'laptop',
        brand: filters.brands.join(',') || undefined,
        sort: sortBy || undefined,
        specs: buildSpecsParam,
    });

    const products = productsData?.data ?? [];
    const totalProducts = productsData?.pagination?.total ?? 0;
    const totalPages = Math.ceil(totalProducts / itemsPerPage) || 1;

    // Reset to page 1 when filters change
    useEffect(() => {
        if (currentPage !== 1) {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('page');
            router.replace(`/laptops?${params.toString()}`, { scroll: false });
            setCurrentPage(1);
        }
    }, [filters, searchQuery]);

    // Toggle filter
    const toggleFilter = (filterKey: keyof typeof filters, value: string) => {
        setFilters(prev => ({
            ...prev,
            [filterKey]: prev[filterKey].includes(value)
                ? prev[filterKey].filter(v => v !== value)
                : [...prev[filterKey], value],
        }));
    };

    // Clear all filters
    const clearAllFilters = () => {
        setFilters({
            categories: [],
            brands: [],
            cpus: [],
            ssds: [],
            rams: [],
            gpus: [],
            priceRanges: [],
            screens: [],
            hzs: [],
            resolutions: [],
            weights: [],
            statuses: [],
        });
        setSearchQuery("");
        router.push("/laptops");
    };

    // Toggle dropdown
    const toggleDropdown = (dropdown: string) => {
        setOpenDropdown(openDropdown === dropdown ? null : dropdown);
    };

    // Count active filters
    const activeFiltersCount = Object.values(filters).reduce((acc, arr) => acc + arr.length, 0) + (searchQuery ? 1 : 0);

    const categoryParam = searchParams.get('category');
    const brandParam = searchParams.get('brand');

    const displayTitle = useMemo(() => {
        if (searchQuery) return `Kết quả: "${searchQuery}"`;
        if (categoryParam) {
            const cat = categories.find(c => c.slug === categoryParam || c._id === categoryParam);
            if (cat) return `Laptop ${cat.name} Cần Thơ`;
        }
        if (brandParam) {
            const brand = brands.find(b => b.slug === brandParam || b._id === brandParam);
            if (brand) return `Laptop ${brand.name} Cần Thơ`;
        }
        return "Danh Sách Laptop Giá Tốt Nhất Cần Thơ";
    }, [searchQuery, categoryParam, brandParam, categories, brands]);

    const displaySubtitle = useMemo(() => {
        if (categoryParam) {
            const cat = categories.find(c => c.slug === categoryParam || c._id === categoryParam);
            if (cat) return `Sản phẩm ${cat.name.toLowerCase()} tuyển chọn, bảo hành uy tín.`;
        }
        if (brandParam) {
            const brand = brands.find(b => b.slug === brandParam || b._id === brandParam);
            if (brand) return `Chuyên các dòng máy ${brand.name} chính hãng tại Cần Thơ.`;
        }
        return "💻 Kho Laptop Chất Lượng";
    }, [categoryParam, brandParam, categories, brands]);

    const displayDescription = useMemo(() => {
        if (searchQuery) return "Tìm thấy các mẫu laptop phù hợp với yêu cầu của bạn.";
        if (categoryParam) {
            const cat = categories.find(c => c.slug === categoryParam || c._id === categoryParam);
            if (cat) return `Khám phá các dòng ${cat.name.toLowerCase()} chất lượng cao tại LapLap Cần Thơ. Hỗ trợ trả góp 0%, test máy miễn phí.`;
        }
        if (brandParam) {
            const brand = brands.find(b => b.slug === brandParam || b._id === brandParam);
            if (brand) return `Tổng hợp các mẫu laptop ${brand.name} bền bỉ, cấu hình mạnh mẽ. Cam kết nguyên bản, giá tốt nhất thị trường.`;
        }
        return "Đa dạng mẫu mã từ Dell, HP, ThinkPad đến MacBook. Bảo hành uy tín, hỗ trợ trả góp 0%.";
    }, [searchQuery, categoryParam, brandParam, categories, brands]);

    return (

        <>

            {/* Hero Section - Standardized Height & Style */}
            <section className="relative w-full h-auto bg-gradient-to-r from-[#124A84] via-[#0d3560] to-[#0a2d54] text-white overflow-hidden shadow-lg border-b border-white/10 py-12 md:py-16">
                {/* Background Patterns */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="container mx-auto max-w-5xl px-4 h-full relative z-10 flex items-center justify-between">
                    {/* Left: Text Content */}
                    <div className="w-full md:w-3/5 text-center md:text-left">
                        <div className="inline-block px-4 py-1.5 bg-blue-500/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-400/50 text-blue-200">
                            {displaySubtitle}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
                            {displayTitle.split(":").length > 1 ? (
                                <>
                                    {displayTitle.split(":")[0]}: <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 px-2 italic">
                                        {displayTitle.split(":")[1]}
                                    </span>
                                </>
                            ) : (
                                <>
                                    {displayTitle.includes("Cần Thơ") ? (
                                        <>
                                            {displayTitle.replace(" Cần Thơ", "")} <br />
                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">
                                                Cần Thơ
                                            </span>
                                        </>
                                    ) : (
                                        displayTitle
                                    )}
                                </>
                            )}
                        </h1>
                        <p className="text-lg text-blue-100 max-w-lg mx-auto md:mx-0 leading-relaxed font-medium">
                            {displayDescription}
                        </p>
                    </div>


                    {/* Right: Illustration */}
                    <div className="hidden md:flex w-2/5 items-center justify-center relative">
                        <div className="relative z-10 p-8">
                            <div className="relative w-64 h-40 bg-gray-800 rounded-lg shadow-2xl transform rotate-[-5deg] border-4 border-gray-700 items-center justify-center flex overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent"></div>
                                <SearchIcon className="w-12 h-12 text-blue-500/30 absolute" />
                                <div className="text-blue-400 font-black text-xl italic z-10">LapLap Store</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <main className="bg-gray-50 min-h-screen py-10">
                <div className="container mx-auto max-w-5xl px-4">
                    {/* Header - Simplified since we have Hero */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 border-b border-gray-200 pb-4 gap-4">
                        <div className="flex flex-col gap-1">
                            <p className="text-gray-600">
                                Hiển thị <span className="font-bold text-gray-900">{totalProducts}</span> sản phẩm
                                {activeFiltersCount > 0 && ` (${activeFiltersCount} bộ lọc đang áp dụng)`}
                            </p>
                            {searchQuery && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-gray-400 italic">Đang lọc theo từ khóa:</span>
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase">
                                        {searchQuery}
                                        <button onClick={() => {
                                            setSearchQuery("");
                                            router.push("/laptops");
                                        }} className="hover:text-blue-900">
                                            <X size={10} />
                                        </button>
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Sort Dropdown for Desktop */}
                        <div className="hidden md:flex relative filter-dd z-50">
                            <button
                                onClick={() => toggleDropdown('sort')}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:border-blue-400 hover:text-blue-600 transition shadow-sm"
                            >
                                <span className="text-gray-500 font-medium">Sắp xếp:</span>
                                {sortBy === 'price_asc' ? 'Giá tăng dần' : sortBy === 'price_desc' ? 'Giá giảm dần' : 'Mới nhất'}
                                <ChevronDown size={16} />
                            </button>
                            {openDropdown === 'sort' && (
                                <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-[200px] overflow-hidden">
                                    {[
                                        { value: '', label: 'Mới nhất' },
                                        { value: 'price-asc', label: 'Giá tăng dần' },
                                        { value: 'price-desc', label: 'Giá giảm dần' }
                                    ].map(opt => (
                                        <button
                                            key={opt.value}
                                            onClick={() => { setSortBy(opt.value); setOpenDropdown(null); }}
                                            className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition hover:bg-blue-50 hover:text-blue-600 ${sortBy === opt.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Filter Button */}
                    <div className="flex md:hidden mb-6">
                        <button
                            onClick={() => setIsFilterDrawerOpen(true)}
                            className="flex-1 flex items-center justify-center gap-2 bg-[#004e9a] text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-100 active:scale-95 transition-all text-sm"
                        >
                            <SlidersHorizontal size={18} />
                            Bộ lọc tìm kiếm
                            {activeFiltersCount > 0 && (
                                <span className="bg-white text-[#004e9a] w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black ml-1">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Brand Filter Tags */}
                    {brands.length > 0 && (
                        <div className="mb-8">
                            <h2 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                                Thương hiệu Laptop
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {brands.map(brand => (
                                    <button
                                        key={brand._id}
                                        onClick={() => toggleFilter('brands', brand._id)}
                                        className={`
                                            px-4 py-2 rounded-lg border text-sm font-bold transition-all duration-200
                                            ${filters.brands.includes(brand._id)
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                                : 'bg-white border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:shadow-sm'
                                            }
                                        `}
                                    >
                                        {brand.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Filters - Desktop Only */}
                    <div className="hidden md:block mb-6 bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-bold text-[#004e9a] text-lg">Danh mục phân loại</h2>
                            {activeFiltersCount > 0 && (
                                <button
                                    onClick={clearAllFilters}
                                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                                >
                                    Xóa tất cả bộ lọc
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 auto-rows-fr [&>div]:h-full [&>div>button]:h-full [&>div>button]:w-full [&>div>button]:justify-between">
                            {/* Category Filter */}
                            <div className={`relative ${openDropdown === 'categories' ? 'z-[60]' : ''}`}>
                                <button
                                    onClick={() => toggleDropdown('categories')}
                                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg text-[13px] sm:text-sm font-semibold transition ${filters.categories.length > 0
                                        ? 'bg-[#004e9a] text-white'
                                        : 'bg-[#004e9a] text-white hover:bg-[#003b78]'
                                        }`}
                                >
                                    Phân loại
                                    {filters.categories.length > 0 && ` (${filters.categories.length})`}
                                    <ChevronDown size={14} className="flex-shrink-0" />
                                </button>
                                {openDropdown === 'categories' && (
                                    <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px] max-h-[300px] overflow-y-auto">
                                        {categories.map(category => (
                                            <label key={category._id} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.categories.includes(category._id)}
                                                    onChange={() => toggleFilter('categories', category._id)}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm">{category.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Brand Filter */}
                            <div className={`relative ${openDropdown === 'brands' ? 'z-[60]' : ''}`}>
                                <button
                                    onClick={() => toggleDropdown('brands')}
                                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg text-[13px] sm:text-sm font-semibold transition ${filters.brands.length > 0
                                        ? 'bg-[#004e9a] text-white'
                                        : 'bg-[#004e9a] text-white hover:bg-[#003b78]'
                                        }`}
                                >
                                    Hãng
                                    {filters.brands.length > 0 && ` (${filters.brands.length})`}
                                    <ChevronDown size={14} className="flex-shrink-0" />
                                </button>
                                {openDropdown === 'brands' && (
                                    <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px] max-h-[300px] overflow-y-auto">
                                        {brands.map(brand => (
                                            <label key={brand._id} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.brands.includes(brand._id)}
                                                    onChange={() => toggleFilter('brands', brand._id)}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm">{brand.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* CPU Filter */}
                            <div className={`relative ${openDropdown === 'cpus' ? 'z-[60]' : ''}`}>
                                <button
                                    onClick={() => toggleDropdown('cpus')}
                                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg text-[13px] sm:text-sm font-semibold transition ${filters.cpus.length > 0
                                        ? 'bg-[#004e9a] text-white'
                                        : 'bg-[#004e9a] text-white hover:bg-[#003b78]'
                                        }`}
                                >
                                    CPU
                                    {filters.cpus.length > 0 && ` (${filters.cpus.length})`}
                                    <ChevronDown size={14} className="flex-shrink-0" />
                                </button>
                                {openDropdown === 'cpus' && (
                                    <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px] max-h-[300px] overflow-y-auto">
                                        {filterOptions.cpus.map((cpu: any) => (
                                            <label key={cpu.normalized} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.cpus.includes(cpu.normalized)}
                                                    onChange={() => toggleFilter('cpus', cpu.normalized)}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm">{cpu.normalized}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* RAM Filter */}
                            <div className={`relative ${openDropdown === 'rams' ? 'z-[60]' : ''}`}>
                                <button
                                    onClick={() => toggleDropdown('rams')}
                                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg text-[13px] sm:text-sm font-semibold transition ${filters.rams.length > 0
                                        ? 'bg-[#004e9a] text-white'
                                        : 'bg-[#004e9a] text-white hover:bg-[#003b78]'
                                        }`}
                                >
                                    RAM
                                    {filters.rams.length > 0 && ` (${filters.rams.length})`}
                                    <ChevronDown size={14} className="flex-shrink-0" />
                                </button>
                                {openDropdown === 'rams' && (
                                    <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px] max-h-[300px] overflow-y-auto">
                                        {filterOptions.rams.map((ram: any) => (
                                            <label key={ram.normalized} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.rams.includes(ram.normalized)}
                                                    onChange={() => toggleFilter('rams', ram.normalized)}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm">{ram.normalized}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* SSD Filter */}
                            <div className={`relative ${openDropdown === 'ssds' ? 'z-[60]' : ''}`}>
                                <button
                                    onClick={() => toggleDropdown('ssds')}
                                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg text-[13px] sm:text-sm font-semibold transition ${filters.ssds.length > 0
                                        ? 'bg-[#004e9a] text-white'
                                        : 'bg-[#004e9a] text-white hover:bg-[#003b78]'
                                        }`}
                                >
                                    Ổ cứng
                                    {filters.ssds.length > 0 && ` (${filters.ssds.length})`}
                                    <ChevronDown size={14} className="flex-shrink-0" />
                                </button>
                                {openDropdown === 'ssds' && (
                                    <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px] max-h-[300px] overflow-y-auto">
                                        {filterOptions.ssds.map((ssd: any) => (
                                            <label key={ssd.normalized} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.ssds.includes(ssd.normalized)}
                                                    onChange={() => toggleFilter('ssds', ssd.normalized)}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm">{ssd.normalized}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* GPU Filter */}
                            <div className={`relative ${openDropdown === 'gpus' ? 'z-[60]' : ''}`}>
                                <button
                                    onClick={() => toggleDropdown('gpus')}
                                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg text-[13px] sm:text-sm font-semibold transition ${filters.gpus.length > 0
                                        ? 'bg-[#004e9a] text-white'
                                        : 'bg-[#004e9a] text-white hover:bg-[#003b78]'
                                        }`}
                                >
                                    VGA
                                    {filters.gpus.length > 0 && ` (${filters.gpus.length})`}
                                    <ChevronDown size={14} className="flex-shrink-0" />
                                </button>
                                {openDropdown === 'gpus' && (
                                    <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px] max-h-[300px] overflow-y-auto">
                                        {filterOptions.gpus.map((gpu: any) => (
                                            <label key={gpu.normalized} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.gpus.includes(gpu.normalized)}
                                                    onChange={() => toggleFilter('gpus', gpu.normalized)}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm">{gpu.normalized}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Price Filter */}
                            <div className={`relative ${openDropdown === 'prices' ? 'z-[60]' : ''}`}>
                                <button
                                    onClick={() => toggleDropdown('prices')}
                                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg text-[13px] sm:text-sm font-semibold transition ${filters.priceRanges.length > 0
                                        ? 'bg-[#004e9a] text-white'
                                        : 'bg-[#004e9a] text-white hover:bg-[#003b78]'
                                        }`}
                                >
                                    Theo giá
                                    {filters.priceRanges.length > 0 && ` (${filters.priceRanges.length})`}
                                    <ChevronDown size={14} className="flex-shrink-0" />
                                </button>
                                {openDropdown === 'prices' && (
                                    <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px]">
                                        {priceRanges.map(range => (
                                            <label key={range.label} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.priceRanges.includes(range.label)}
                                                    onChange={() => toggleFilter('priceRanges', range.label)}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm">{range.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Screen Filter */}
                            <div className={`relative ${openDropdown === 'screens' ? 'z-[60]' : ''}`}>
                                <button
                                    onClick={() => toggleDropdown('screens')}
                                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg text-[13px] sm:text-sm font-semibold transition ${filters.screens.length > 0
                                        ? 'bg-[#004e9a] text-white'
                                        : 'bg-[#004e9a] text-white hover:bg-[#003b78]'
                                        }`}
                                >
                                    Màn hình
                                    {filters.screens.length > 0 && ` (${filters.screens.length})`}
                                    <ChevronDown size={14} className="flex-shrink-0" />
                                </button>
                                {openDropdown === 'screens' && (
                                    <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px] max-h-[300px] overflow-y-auto">
                                        {filterOptions.screens.map((screen: any) => (
                                            <label key={screen.normalized} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.screens.includes(screen.normalized)}
                                                    onChange={() => toggleFilter('screens', screen.normalized)}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm">{screen.normalized}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Hz Filter */}
                            <div className={`relative ${openDropdown === 'hzs' ? 'z-[60]' : ''}`}>
                                <button
                                    onClick={() => toggleDropdown('hzs')}
                                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg text-[13px] sm:text-sm font-semibold transition ${filters.hzs.length > 0
                                        ? 'bg-[#004e9a] text-white'
                                        : 'bg-[#004e9a] text-white hover:bg-[#003b78]'
                                        }`}
                                >
                                    Tần số quét
                                    {filters.hzs.length > 0 && ` (${filters.hzs.length})`}
                                    <ChevronDown size={14} className="flex-shrink-0" />
                                </button>
                                {openDropdown === 'hzs' && (
                                    <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[160px] max-h-[300px] overflow-y-auto">
                                        {filterOptions.hzs.map((hz: any) => (
                                            <label key={hz.normalized} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.hzs.includes(hz.normalized)}
                                                    onChange={() => toggleFilter('hzs', hz.normalized)}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm">{hz.normalized}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Resolution Filter */}
                            <div className={`relative ${openDropdown === 'resolutions' ? 'z-[60]' : ''}`}>
                                <button
                                    onClick={() => toggleDropdown('resolutions')}
                                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg text-[13px] sm:text-sm font-semibold transition ${filters.resolutions.length > 0
                                        ? 'bg-[#004e9a] text-white'
                                        : 'bg-[#004e9a] text-white hover:bg-[#003b78]'
                                        }`}
                                >
                                    Độ phân giải
                                    {filters.resolutions.length > 0 && ` (${filters.resolutions.length})`}
                                    <ChevronDown size={14} className="flex-shrink-0" />
                                </button>
                                {openDropdown === 'resolutions' && (
                                    <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[180px] max-h-[300px] overflow-y-auto">
                                        {filterOptions.resolutions.map((res: any) => (
                                            <label key={res.normalized} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.resolutions.includes(res.normalized)}
                                                    onChange={() => toggleFilter('resolutions', res.normalized)}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm">{res.normalized}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Status Filter */}
                            <div className={`relative ${openDropdown === 'statuses' ? 'z-[60]' : ''}`}>
                                <button
                                    onClick={() => toggleDropdown('statuses')}
                                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg text-[13px] sm:text-sm font-semibold transition ${filters.statuses.length > 0 ? 'bg-[#004e9a] text-white' : 'bg-white border text-gray-700 border-gray-200 hover:border-blue-300'}`}
                                >
                                    Tình trạng {filters.statuses.length > 0 && ` (${filters.statuses.length})`}
                                    <ChevronDown size={14} className="flex-shrink-0" />
                                </button>
                                {openDropdown === 'statuses' && (
                                    <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px]">
                                        <label className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={filters.statuses.includes('active')}
                                                onChange={() => toggleFilter('statuses', 'active')}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-sm">Còn hàng</span>
                                        </label>
                                        <label className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={filters.statuses.includes('inactive')}
                                                onChange={() => toggleFilter('statuses', 'inactive')}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-sm">Hết hàng</span>
                                        </label>
                                    </div>
                                )}
                            </div>

                            {/* Sort Dropdown for Mobile */}
                            <div className={`relative filter-dd md:hidden w-full col-span-2 ${openDropdown === 'sort_mobile' ? 'z-[90]' : 'z-50'}`}>
                                <button
                                    onClick={() => toggleDropdown('sort_mobile')}
                                    className="flex w-full min-h-[40px] items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-white border border-gray-200 rounded-lg text-[13px] sm:text-sm font-semibold text-gray-700 hover:border-blue-400 hover:text-blue-600 transition shadow-sm"
                                >
                                    <span className="truncate">
                                        <span className="text-gray-500 font-medium font-normal mr-1">Sắp xếp:</span>
                                        {sortBy === 'price-asc' ? 'Giá tăng' : sortBy === 'price-desc' ? 'Giá giảm' : 'Mới nhất'}
                                    </span>
                                    <ChevronDown size={14} className="flex-shrink-0" />
                                </button>
                                {openDropdown === 'sort_mobile' && (
                                    <div className="absolute top-full left-0 right-0 sm:right-auto mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                                        {[
                                            { value: '', label: 'Mới nhất' },
                                            { value: 'price-asc', label: 'Giá tăng dần' },
                                            { value: 'price-desc', label: 'Giá giảm dần' }
                                        ].map(opt => (
                                            <button
                                                key={opt.value}
                                                onClick={() => { setSortBy(opt.value); setOpenDropdown(null); }}
                                                className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition hover:bg-blue-50 hover:text-blue-600 ${sortBy === opt.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Loading State */}
                    {/* Loading State */}
                    {loading ? (
                        <TechLoader />
                    ) : (
                        <>
                            {/* Products Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-8">
                                {products.map(product => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>

                            {/* No Results */}
                            {products.length === 0 && (
                                <div className="text-center py-20">
                                    <p className="text-gray-600 text-lg">Không tìm thấy sản phẩm nào phù hợp với bộ lọc.</p>
                                    <Button
                                        onClick={clearAllFilters}
                                        variant="primary"
                                        size="lg"
                                        leftIcon={<X size={18} />}
                                    >
                                        Xóa bộ lọc
                                    </Button>
                                </div>
                            )}

                            {/* Pagination */}
                            {products.length > 0 && totalPages > 1 && (
                                <div className="flex flex-col items-center gap-4">
                                    <p className="text-gray-600">
                                        Hiển thị {(currentPage - 1) * itemsPerPage + 1}-
                                        {Math.min(currentPage * itemsPerPage, totalProducts)} của {totalProducts} sản phẩm
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                            variant="outline"
                                            size="sm"
                                            leftIcon={<ChevronLeft size={16} />}
                                        >
                                            Trước
                                        </Button>

                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }

                                            return (
                                                <Button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    variant={currentPage === pageNum ? 'primary' : 'outline'}
                                                    size="sm"
                                                    className={currentPage === pageNum ? 'bg-[#004e9a]' : ''}
                                                >
                                                    {pageNum}
                                                </Button>
                                            );
                                        })}

                                        <Button
                                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                            disabled={currentPage === totalPages}
                                            variant="outline"
                                            size="sm"
                                            rightIcon={<ChevronRight size={16} />}
                                        >
                                            Sau
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Filter Drawer for Mobile */}
                <FilterDrawer
                    isOpen={isFilterDrawerOpen}
                    onClose={() => setIsFilterDrawerOpen(false)}
                    filters={filters}
                    toggleFilter={toggleFilter}
                    clearAllFilters={clearAllFilters}
                    filterOptions={filterOptions}
                    categories={categories}
                    brands={brands}
                    priceRanges={priceRanges}
                    totalProducts={totalProducts}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                />
            </main>

        </>
    );
}