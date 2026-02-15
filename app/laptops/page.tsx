'use client';

import { useEffect, useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

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

            <main className="bg-gray-50 min-h-screen py-10">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Danh sách Laptop</h1>
                        <p className="text-gray-600">
                            {filteredProducts.length} sản phẩm
                            {activeFiltersCount > 0 && ` (${activeFiltersCount} bộ lọc đang áp dụng)`}
                        </p>
                    </div>

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
                                <button
                                    onClick={() => toggleDropdown('statuses')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${filters.statuses.length > 0
                                        ? 'bg-[#004e9a] text-white'
                                        : 'bg-[#004e9a] text-white hover:bg-[#003b78]'
                                        }`}
                                >
                                    Tình trạng
                                    {filters.statuses.length > 0 && ` (${filters.statuses.length})`}
                                    <ChevronDown size={16} />
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
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
                            <p className="text-gray-600 mt-4 text-lg">Đang tải sản phẩm...</p>
                        </div>
                    ) : (
                        <>
                            {/* Products Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 mb-8">
                                {paginatedProducts.map(product => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>

                            {/* No Results */}
                            {filteredProducts.length === 0 && (
                                <div className="text-center py-20">
                                    <p className="text-gray-600 text-lg">Không tìm thấy sản phẩm nào phù hợp với bộ lọc.</p>
                                    <button
                                        onClick={clearAllFilters}
                                        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Xóa bộ lọc
                                    </button>
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
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            <ChevronLeft size={16} />
                                            Trước
                                        </button>

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
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    className={`px-4 py-2 rounded-lg ${currentPage === pageNum
                                                        ? 'bg-[#004e9a] text-white'
                                                        : 'border border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}

                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                            disabled={currentPage === totalPages}
                                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            Sau
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
