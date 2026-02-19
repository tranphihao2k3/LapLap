'use client';

import { useEffect, useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import TechLoader from '@/components/ui/TechLoader';

interface LaptopSpec {
    cpu: string;
    gpu: string;
    ram: string;
    ssd: string;
    screen: string;
    battery: string;
}

interface Category {
    _id: string;
    name: string;
    slug: string;
}

interface Brand {
    _id: string;
    name: string;
    slug: string;
    logo?: string;
}

interface Product {
    _id: string;
    name: string;
    model: string;
    price: number;
    image: string;
    images: string[];
    slug?: string;
    specs: LaptopSpec;
    categoryId: Category;
    brandId: Brand;
    status: string;
}

export default function LaptopsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // Filters
    const [filters, setFilters] = useState({
        categories: [] as string[],
        brands: [] as string[],
        cpus: [] as string[],
        ssds: [] as string[],
        gpus: [] as string[],
        priceRanges: [] as string[],
        screens: [] as string[],
        weights: [] as string[],
        statuses: [] as string[],
    });

    // Dropdown states
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    // Fetch data
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [productsRes, brandsRes, categoriesRes] = await Promise.all([
                fetch('/api/admin/laptops'),
                fetch('/api/admin/brands'),
                fetch('/api/admin/categories'),
            ]);

            const productsData = await productsRes.json();
            const brandsData = await brandsRes.json();
            const categoriesData = await categoriesRes.json();

            if (productsData.success) setProducts(productsData.data);
            if (brandsData.success) setBrands(brandsData.data);
            if (categoriesData.success) setCategories(categoriesData.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Extract filter options
    const filterOptions = useMemo(() => {
        const cpus = [...new Set(products.map(p => p.specs.cpu).filter(Boolean))];
        const ssds = [...new Set(products.map(p => p.specs.ssd).filter(Boolean))];
        const gpus = [...new Set(products.map(p => p.specs.gpu).filter(Boolean))];
        const screens = [...new Set(products.map(p => p.specs.screen).filter(Boolean))];

        return { cpus, ssds, gpus, screens };
    }, [products]);

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

    // Filter products
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // Category filter
            if (filters.categories.length > 0 && !filters.categories.includes(product.categoryId._id)) {
                return false;
            }

            // Brand filter
            if (filters.brands.length > 0 && !filters.brands.includes(product.brandId._id)) {
                return false;
            }

            // CPU filter
            if (filters.cpus.length > 0 && !filters.cpus.includes(product.specs.cpu)) {
                return false;
            }

            // SSD filter
            if (filters.ssds.length > 0 && !filters.ssds.includes(product.specs.ssd)) {
                return false;
            }

            // GPU filter
            if (filters.gpus.length > 0 && !filters.gpus.includes(product.specs.gpu)) {
                return false;
            }

            // Price filter
            if (filters.priceRanges.length > 0) {
                const matchesPrice = filters.priceRanges.some(rangeLabel => {
                    const range = priceRanges.find(r => r.label === rangeLabel);
                    if (!range) return false;
                    return product.price >= range.min && product.price <= range.max;
                });
                if (!matchesPrice) return false;
            }

            // Screen filter
            if (filters.screens.length > 0 && !filters.screens.includes(product.specs.screen)) {
                return false;
            }

            // Status filter
            if (filters.statuses.length > 0 && !filters.statuses.includes(product.status)) {
                return false;
            }

            return true;
        });
    }, [products, filters, priceRanges]);

    // Paginate products
    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredProducts.slice(start, end);
    }, [filteredProducts, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

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
            gpus: [],
            priceRanges: [],
            screens: [],
            weights: [],
            statuses: [],
        });
    };

    // Toggle dropdown
    const toggleDropdown = (dropdown: string) => {
        setOpenDropdown(openDropdown === dropdown ? null : dropdown);
    };

    // Count active filters
    const activeFiltersCount = Object.values(filters).reduce((acc, arr) => acc + arr.length, 0);

    return (
        <>

            {/* Hero Section - Full Width */}
            <section className="relative w-full min-h-[350px] md:h-[400px] bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden shadow-lg border-b border-blue-400/30 py-12 md:py-0">
                {/* Background Patterns */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="container mx-auto max-w-5xl px-4 h-full relative z-10 flex items-center justify-between">
                    {/* Left: Text Content */}
                    <div className="w-full md:w-3/5 text-center md:text-left">
                        <div className="inline-block px-4 py-1.5 bg-blue-500/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-400/50 text-blue-200">
                            💻 Kho Laptop Chất Lượng
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
                            Danh Sách Laptop <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">
                                Giá Tốt Nhất Cần Thơ
                            </span>
                        </h1>
                        <p className="text-lg text-blue-100 max-w-lg mx-auto md:mx-0 leading-relaxed font-medium">
                            Đa dạng mẫu mã từ Dell, HP, ThinkPad đến MacBook. <br />
                            Bảo hành uy tín, hỗ trợ trả góp 0%.
                        </p>
                    </div>

                    {/* Right: Illustration */}
                    <div className="hidden md:flex w-2/5 items-center justify-center relative">
                        {/* Abstract Shape or Image placeholder since we don't have motion imported yet, wait, we do not have motion imported in this file? Let's check imports. */}
                        {/* Actually defaults might be better without complex motion if not imported. checking file... */}
                        {/* File has: import { useEffect, useState, useMemo } from 'react'; - NO framer-motion! */}
                        {/* I should stick to simple CSS animations or add framer-motion import. */}
                        {/* User asked for consistent look. I will add framer-motion import in a separate step or just use CSS for now to avoid errors if I miss the import. */}
                        {/* Actually, I can use simple CSS classes like 'animate-pulse' or just static for now to be safe, or add the import. */}
                        {/* Let's add the import in a separate tool call to be safe, or just use standard div with CSS animations. */}
                        <div className="relative z-10 p-8">
                            <div className="relative w-64 h-40 bg-gray-800 rounded-lg shadow-2xl transform rotate-[-5deg] border-4 border-gray-700 items-center justify-center flex">
                                <div className="text-blue-400 font-bold">LapLap Store</div>
                            </div>
                            <div className="absolute -bottom-4 -right-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-lg">
                                <div className="text-xs font-bold text-white">100+ Model</div>
                                <div className="text-xs text-blue-200">Có sẵn hàng</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <main className="bg-gray-50 min-h-screen py-10">
                <div className="container mx-auto max-w-5xl px-4">
                    {/* Header - Simplified since we have Hero */}
                    <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
                        <p className="text-gray-600">
                            Hiển thị <span className="font-bold text-gray-900">{filteredProducts.length}</span> sản phẩm
                            {activeFiltersCount > 0 && ` (${activeFiltersCount} bộ lọc đang áp dụng)`}
                        </p>
                    </div>

                    {/* Brand Logos Filter */}
                    {brands.length > 0 && (
                        <div className="mb-8">
                            <h2 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                                Thương hiệu nổi bật
                            </h2>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                                {brands.map(brand => (
                                    <button
                                        key={brand._id}
                                        onClick={() => toggleFilter('brands', brand._id)}
                                        className={`
                                            flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 group
                                            ${filters.brands.includes(brand._id)
                                                ? 'bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-500'
                                                : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1'
                                            }
                                        `}
                                    >
                                        <div className="w-12 h-12 relative mb-2 flex items-center justify-center bg-white rounded-full p-2">
                                            {brand.logo ? (
                                                <img
                                                    src={brand.logo}
                                                    alt={brand.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <span className="text-xl font-black text-gray-400 uppercase">
                                                    {brand.name.substring(0, 1)}
                                                </span>
                                            )}
                                        </div>
                                        <span className={`text-xs font-bold text-center ${filters.brands.includes(brand._id) ? 'text-blue-700' : 'text-gray-600 group-hover:text-blue-600'}`}>
                                            {brand.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Filters */}
                    <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
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

                        <div className="flex flex-wrap gap-3">
                            {/* Category Filter */}
                            <div className="relative">
                                <button
                                    onClick={() => toggleDropdown('categories')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${filters.categories.length > 0
                                        ? 'bg-[#004e9a] text-white'
                                        : 'bg-[#004e9a] text-white hover:bg-[#003b78]'
                                        }`}
                                >
                                    Theo phân loại
                                    {filters.categories.length > 0 && ` (${filters.categories.length})`}
                                    <ChevronDown size={16} />
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
                            <div className="relative">
                                <button
                                    onClick={() => toggleDropdown('brands')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${filters.brands.length > 0
                                        ? 'bg-[#004e9a] text-white'
                                        : 'bg-[#004e9a] text-white hover:bg-[#003b78]'
                                        }`}
                                >
                                    Theo hãng
                                    {filters.brands.length > 0 && ` (${filters.brands.length})`}
                                    <ChevronDown size={16} />
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
                            <div className="relative">
                                <button
                                    onClick={() => toggleDropdown('cpus')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${filters.cpus.length > 0
                                        ? 'bg-[#004e9a] text-white'
                                        : 'bg-[#004e9a] text-white hover:bg-[#003b78]'
                                        }`}
                                >
                                    CPU
                                    {filters.cpus.length > 0 && ` (${filters.cpus.length})`}
                                    <ChevronDown size={16} />
                                </button>
                                {openDropdown === 'cpus' && (
                                    <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px] max-h-[300px] overflow-y-auto">
                                        {filterOptions.cpus.map(cpu => (
                                            <label key={cpu} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.cpus.includes(cpu)}
                                                    onChange={() => toggleFilter('cpus', cpu)}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm">{cpu}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* SSD Filter */}
                            <div className="relative">
                                <button
                                    onClick={() => toggleDropdown('ssds')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${filters.ssds.length > 0
                                        ? 'bg-[#004e9a] text-white'
                                        : 'bg-[#004e9a] text-white hover:bg-[#003b78]'
                                        }`}
                                >
                                    SSD HDD
                                    {filters.ssds.length > 0 && ` (${filters.ssds.length})`}
                                    <ChevronDown size={16} />
                                </button>
                                {openDropdown === 'ssds' && (
                                    <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px] max-h-[300px] overflow-y-auto">
                                        {filterOptions.ssds.map(ssd => (
                                            <label key={ssd} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.ssds.includes(ssd)}
                                                    onChange={() => toggleFilter('ssds', ssd)}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm">{ssd}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* GPU Filter */}
                            <div className="relative">
                                <button
                                    onClick={() => toggleDropdown('gpus')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${filters.gpus.length > 0
                                        ? 'bg-[#004e9a] text-white'
                                        : 'bg-[#004e9a] text-white hover:bg-[#003b78]'
                                        }`}
                                >
                                    VGA
                                    {filters.gpus.length > 0 && ` (${filters.gpus.length})`}
                                    <ChevronDown size={16} />
                                </button>
                                {openDropdown === 'gpus' && (
                                    <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px] max-h-[300px] overflow-y-auto">
                                        {filterOptions.gpus.map(gpu => (
                                            <label key={gpu} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.gpus.includes(gpu)}
                                                    onChange={() => toggleFilter('gpus', gpu)}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm">{gpu}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Price Filter */}
                            <div className="relative">
                                <button
                                    onClick={() => toggleDropdown('prices')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${filters.priceRanges.length > 0
                                        ? 'bg-[#004e9a] text-white'
                                        : 'bg-[#004e9a] text-white hover:bg-[#003b78]'
                                        }`}
                                >
                                    Theo giá
                                    {filters.priceRanges.length > 0 && ` (${filters.priceRanges.length})`}
                                    <ChevronDown size={16} />
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
                            <div className="relative">
                                <button
                                    onClick={() => toggleDropdown('screens')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${filters.screens.length > 0
                                        ? 'bg-[#004e9a] text-white'
                                        : 'bg-[#004e9a] text-white hover:bg-[#003b78]'
                                        }`}
                                >
                                    Kích thước màn hình
                                    {filters.screens.length > 0 && ` (${filters.screens.length})`}
                                    <ChevronDown size={16} />
                                </button>
                                {openDropdown === 'screens' && (
                                    <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px] max-h-[300px] overflow-y-auto">
                                        {filterOptions.screens.map(screen => (
                                            <label key={screen} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.screens.includes(screen)}
                                                    onChange={() => toggleFilter('screens', screen)}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm">{screen}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Status Filter */}
                            <div className="relative">
                                <Button
                                    onClick={() => toggleDropdown('statuses')}
                                    variant={filters.statuses.length > 0 ? 'primary' : 'outline'}
                                    size="sm"
                                    rightIcon={<ChevronDown size={16} />}
                                    className={filters.statuses.length > 0 ? 'shadow-md shadow-blue-500/20' : 'bg-white border-gray-300 text-gray-700'}
                                >
                                    Tình trạng {filters.statuses.length > 0 && ` (${filters.statuses.length})`}
                                </Button>
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
                        </div>
                    </div>

                    {/* Loading State */}
                    {/* Loading State */}
                    {loading ? (
                        <TechLoader />
                    ) : (
                        <>
                            {/* Products Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5 mb-8">
                                {paginatedProducts.map(product => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>

                            {/* No Results */}
                            {filteredProducts.length === 0 && (
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
                            {filteredProducts.length > 0 && totalPages > 1 && (
                                <div className="flex flex-col items-center gap-4">
                                    <p className="text-gray-600">
                                        Hiển thị {(currentPage - 1) * itemsPerPage + 1}-
                                        {Math.min(currentPage * itemsPerPage, filteredProducts.length)} của {filteredProducts.length} sản phẩm
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
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
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    variant={currentPage === pageNum ? 'primary' : 'outline'}
                                                    size="sm"
                                                    className={currentPage === pageNum ? 'bg-[#004e9a]' : ''}
                                                >
                                                    {pageNum}
                                                </Button>
                                            );
                                        })}

                                        <Button
                                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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
            </main>

        </>
    );
}
