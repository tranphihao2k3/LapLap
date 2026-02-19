'use client';

import { useEffect, useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, MinusCircle, PlusCircle, Search, Filter, ChevronDown, ChevronUp, Sparkles, Loader2, Cpu } from 'lucide-react';
import SearchableSelect from './SearchableSelect';
import PriceInput from './PriceInput';
import Toast from '@/components/admin/Toast';
import ImageUploader from '@/components/admin/ImageUploader';
import QuickFillTextarea from '@/components/admin/QuickFillTextarea';
import { COMMON_CPUS, COMMON_GPUS, COMMON_RAM_SIZES, COMMON_SSD_SIZES, COMMON_SCREENS, COMMON_BATTERIES } from './commonSpecs';
import { div } from 'framer-motion/client';

interface Category {
    _id: string;
    name: string;
}

interface Brand {
    _id: string;
    name: string;
}

interface Laptop {
    _id: string;
    name: string;
    slug?: string;
    model: string;
    categoryId: Category;
    brandId: Brand;
    price: number;
    image: string;
    images: string[];
    gift?: string;
    warrantyMonths?: number;
    specs: {
        cpu: string;
        gpu: string;
        ram: string;
        ssd: string;
        screen: string;
        battery: string;
    };
    warranty?: {
        duration: string;
        items: string[];
    };
    status: string;
}

export default function LaptopsPage() {
    const [laptops, setLaptops] = useState<Laptop[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingLaptop, setEditingLaptop] = useState<Laptop | null>(null);

    // Filter states
    const [showFilters, setShowFilters] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000000 });
    const [selectedCPUs, setSelectedCPUs] = useState<string[]>([]);
    const [selectedRAMs, setSelectedRAMs] = useState<string[]>([]);
    const [selectedSSDs, setSelectedSSDs] = useState<string[]>([]);
    const [selectedGPUs, setSelectedGPUs] = useState<string[]>([]);
    const [selectedScreens, setSelectedScreens] = useState<string[]>([]);
    const [expandedSections, setExpandedSections] = useState({
        brands: false,
        price: false,
        cpu: false,
        ram: false,
        ssd: false,
        gpu: false,
        screen: false,
    });

    // Bulk Selection State
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // AI Search states
    const [aiSearchMode, setAiSearchMode] = useState(false);
    const [aiSearchLoading, setAiSearchLoading] = useState(false);
    const [aiSearchCriteria, setAiSearchCriteria] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        model: '',
        categoryId: '',
        brandId: '',
        price: 0,
        image: '',
        images: [''],
        gift: 'Balo, túi chống sốc, lót chuột, sạc zin',
        warrantyMonths: 3,
        specs: {
            cpu: '',
            gpu: '',
            ram: '',
            ssd: '',
            screen: '',
            battery: '',
        },
        warranty: {
            duration: '',
            items: [''],
        },
        status: 'active',
    });

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
        message: '',
        type: 'info',
        isVisible: false
    });

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        setToast({ message, type, isVisible: true });
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            // Check if click is outside all filter dropdowns
            // We need to check if the click is NOT inside any dropdown container or its children
            const clickedInsideDropdown = target.closest('.filter-dropdown');

            if (!clickedInsideDropdown) {
                setExpandedSections({
                    brands: false,
                    price: false,
                    cpu: false,
                    ram: false,
                    ssd: false,
                    gpu: false,
                    screen: false,
                });
            }
        };

        // Only add listener when at least one dropdown is open
        const hasOpenDropdown = Object.values(expandedSections).some(v => v);
        if (hasOpenDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [expandedSections]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch data independently so one failure doesn't block others
            const fetchLaptops = fetch('/api/admin/laptops')
                .then(res => res.json())
                .catch(err => {
                    console.error('Failed to fetch laptops:', err);
                    return { success: false, error: err.message };
                });

            const fetchCategories = fetch('/api/admin/categories')
                .then(res => res.json())
                .catch(err => {
                    console.error('Failed to fetch categories:', err);
                    return { success: false, error: err.message };
                });

            const fetchBrands = fetch('/api/admin/brands')
                .then(res => res.json())
                .catch(err => {
                    console.error('Failed to fetch brands:', err);
                    return { success: false, error: err.message };
                });

            const [laptopsData, categoriesData, brandsData] = await Promise.all([
                fetchLaptops,
                fetchCategories,
                fetchBrands
            ]);

            if (laptopsData?.success) {
                setLaptops(laptopsData.data);
            } else {
                console.error('Laptops API Error:', laptopsData?.error);
            }

            if (categoriesData?.success) {
                console.log('Categories loaded:', categoriesData.data.length);
                setCategories(categoriesData.data);
            } else {
                console.error('Categories API Error:', categoriesData?.error);
            }

            if (brandsData?.success) {
                console.log('Brands loaded:', brandsData.data.length);
                setBrands(brandsData.data);
            } else {
                console.error('Brands API Error:', brandsData?.error);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Extract unique filter options from laptops
    const filterOptions = useMemo(() => {
        const cpus = [...new Set(laptops.map(l => l.specs.cpu).filter(Boolean))];
        const rams = [...new Set(laptops.map(l => l.specs.ram).filter(Boolean))];
        const ssds = [...new Set(laptops.map(l => l.specs.ssd).filter(Boolean))];
        const gpus = [...new Set(laptops.map(l => l.specs.gpu).filter(Boolean))];
        const screens = [...new Set(laptops.map(l => l.specs.screen).filter(Boolean))];

        // Get min and max prices
        const prices = laptops.map(l => l.price).filter(p => p > 0);
        const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
        const maxPrice = prices.length > 0 ? Math.max(...prices) : 100000000;

        return { cpus, rams, ssds, gpus, screens, minPrice, maxPrice };
    }, [laptops]);

    // Filter laptops based on all active filters
    const filteredLaptops = useMemo(() => {
        return laptops.filter(laptop => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesSearch =
                    laptop.name.toLowerCase().includes(query) ||
                    laptop.model.toLowerCase().includes(query) ||
                    laptop.specs.cpu.toLowerCase().includes(query) ||
                    laptop.specs.gpu.toLowerCase().includes(query) ||
                    laptop.specs.ram.toLowerCase().includes(query) ||
                    laptop.specs.ssd.toLowerCase().includes(query);

                if (!matchesSearch) return false;
            }

            // Brand filter
            if (selectedBrands.length > 0 && !selectedBrands.includes(laptop.brandId._id)) {
                return false;
            }

            // Price filter
            if (laptop.price < priceRange.min || laptop.price > priceRange.max) {
                return false;
            }

            // CPU filter
            if (selectedCPUs.length > 0 && !selectedCPUs.includes(laptop.specs.cpu)) {
                return false;
            }

            // RAM filter
            if (selectedRAMs.length > 0 && !selectedRAMs.includes(laptop.specs.ram)) {
                return false;
            }

            // SSD filter
            if (selectedSSDs.length > 0 && !selectedSSDs.includes(laptop.specs.ssd)) {
                return false;
            }

            // GPU filter
            if (selectedGPUs.length > 0 && !selectedGPUs.includes(laptop.specs.gpu)) {
                return false;
            }

            // Screen filter
            if (selectedScreens.length > 0 && !selectedScreens.includes(laptop.specs.screen)) {
                return false;
            }

            return true;
        });
    }, [laptops, searchQuery, selectedBrands, priceRange, selectedCPUs, selectedRAMs, selectedSSDs, selectedGPUs, selectedScreens]);

    // Clear all filters
    const clearAllFilters = () => {
        setSearchQuery('');
        setSelectedBrands([]);
        setPriceRange({ min: filterOptions.minPrice, max: filterOptions.maxPrice });
        setSelectedCPUs([]);
        setSelectedRAMs([]);
        setSelectedSSDs([]);
        setSelectedGPUs([]);
        setSelectedScreens([]);
    };

    // Toggle section expansion
    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Filter out empty strings from arrays
        const cleanedData = {
            ...formData,
            images: formData.images.filter(img => img.trim() !== ''),
            warranty: {
                ...formData.warranty,
                items: formData.warranty.items.filter(item => item.trim() !== ''),
            },
        };

        try {
            const url = editingLaptop
                ? `/api/admin/laptops/${editingLaptop._id}`
                : '/api/admin/laptops';

            const method = editingLaptop ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cleanedData),
            });

            const data = await res.json();

            if (data.success) {
                fetchData();
                handleCloseModal();
                showToast(editingLaptop ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'success');
            } else {
                showToast('Lỗi: ' + data.error, 'error');
            }
        } catch (error) {
            console.error('Error saving laptop:', error);
            showToast('Lỗi khi lưu sản phẩm', 'error');
        }
    };

    // Bulk Delete Handlers
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(filteredLaptops.map(l => l._id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(itemId => itemId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!confirm(`Bạn có chắc muốn xoá ${selectedIds.length} sản phẩm đã chọn?`)) return;

        try {
            const res = await fetch('/api/admin/laptops', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedIds }),
            });

            const data = await res.json();

            if (data.success) {
                showToast(`Đã xoá thành công ${data.deletedCount} sản phẩm`, 'success');
                setSelectedIds([]);
                fetchData();
            } else {
                showToast('Lỗi: ' + data.error, 'error');
            }
        } catch (error) {
            console.error('Error deleting laptops:', error);
            showToast('Lỗi khi xoá sản phẩm', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this laptop?')) return;

        try {
            const res = await fetch(`/api/admin/laptops/${id}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (data.success) {
                fetchData();
                showToast('Đã xóa thành công!', 'success');
            } else {
                showToast('Lỗi: ' + data.error, 'error');
            }
        } catch (error) {
            console.error('Error deleting laptop:', error);
            showToast('Lỗi khi xóa sản phẩm', 'error');
        }
    };

    const handleEdit = (laptop: Laptop) => {
        setEditingLaptop(laptop);
        setFormData({
            name: laptop.name,
            model: laptop.model,
            categoryId: laptop.categoryId._id,
            brandId: laptop.brandId._id,
            price: laptop.price,
            image: laptop.image || '',
            images: laptop.images.length > 0 ? laptop.images : [''],
            gift: laptop.gift || '',
            warrantyMonths: laptop.warrantyMonths || 12,
            specs: laptop.specs,
            warranty: laptop.warranty || { duration: '', items: [''] },
            status: laptop.status,
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingLaptop(null);
        // Pre-filled template data for faster entry
        setFormData({
            name: '',
            model: '',
            categoryId: '',
            brandId: '',
            price: 9900000,
            image: '',
            images: [''],
            gift: 'Túi chống sốc, Chuột không dây',
            warrantyMonths: 12,
            specs: {
                cpu: 'I5-12450H',
                gpu: 'RTX 4050 6G',
                ram: '16G',
                ssd: '512G',
                screen: '15.6 FDD',
                battery: '2-3h',
            },
            warranty: {
                duration: '12 tháng',
                items: [
                    'Bảo hành 12 tháng chính hãng',
                    'Hỗ trợ kỹ thuật trọn đời',
                    'Đổi mới trong 7 ngày đầu',
                ],
            },
            status: 'active',
        });
    };

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData({ ...formData, images: newImages });
    };

    const addImageField = () => {
        setFormData({ ...formData, images: [...formData.images, ''] });
    };

    const removeImageField = (index: number) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const handleAIParse = (parsedData: any) => {
        // Update form data with parsed information
        setFormData(prev => ({
            ...prev,
            name: parsedData.name || prev.name,
            model: parsedData.model || prev.model,
            brandId: parsedData.brandId || (parsedData.brand ? brands.find(b => b.name.toLowerCase() === parsedData.brand.toLowerCase())?._id || prev.brandId : prev.brandId),
            categoryId: parsedData.categoryId || prev.categoryId,
            price: parsedData.price || prev.price,
            warrantyMonths: parsedData.warrantyMonths || prev.warrantyMonths,
            gift: parsedData.gift || prev.gift,
            specs: {
                cpu: parsedData.cpu || prev.specs.cpu,
                gpu: parsedData.gpu || prev.specs.gpu,
                ram: parsedData.ram || prev.specs.ram,
                ssd: parsedData.ssd || prev.specs.ssd,
                screen: parsedData.screen || prev.specs.screen,
                battery: parsedData.battery || prev.specs.battery,
            }
        }));
    };

    const handleAISearch = async () => {
        if (!searchQuery.trim()) return;

        setAiSearchLoading(true);
        setAiSearchCriteria(null);

        try {
            const response = await fetch('/api/search-laptops-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: searchQuery }),
            });

            const result = await response.json();

            if (result.success) {
                setAiSearchCriteria(result.data.criteria);
                setLaptops(result.data.laptops);
            } else {
                showToast(result.message || 'Không thể tìm kiếm', 'error');
            }
        } catch (error) {
            console.error('AI Search Error:', error);
            showToast('Có lỗi xảy ra khi tìm kiếm', 'error');
        } finally {
            setAiSearchLoading(false);
        }
    };

    const handleSearchKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (aiSearchMode) {
                handleAISearch();
            }
        }
    };

    return (
        <div>
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />
            {/* Header with Search and Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Laptops</h1>
                    <p className="text-sm text-gray-600 mt-1 md:mt-2">Quản lý {filteredLaptops.length} / {laptops.length} sản phẩm</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {selectedIds.length > 0 && (
                        <button
                            onClick={handleBulkDelete}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-600 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg hover:bg-red-700 transition-all duration-200 shadow-md text-sm md:text-base font-medium"
                        >
                            <Trash2 className="w-4 h-4 md:w-5 h-5" />
                            Xoá gợi ý ({selectedIds.length})
                        </button>
                    )}
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md text-sm md:text-base font-medium"
                    >
                        <Plus className="w-4 h-4 md:w-5 h-5" />
                        Thêm Laptop
                    </button>
                </div>
            </div>

            {/* Search Bar with AI Toggle */}
            <div className="flex flex-col lg:flex-row gap-3 md:gap-4 mb-4">
                <div className="flex-1 relative">
                    <div className={`relative flex items-center ${aiSearchMode ? 'ring-2 ring-purple-500 rounded-lg' : ''}`}>
                        {aiSearchMode ? (
                            <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-600" />
                        ) : (
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        )}
                        <input
                            type="text"
                            placeholder={aiSearchMode
                                ? "Ví dụ: máy gaming 15tr asus rtx..."
                                : "Tìm kiếm nhanh..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleSearchKeyPress}
                            className={`w-full pl-10 pr-24 md:pr-32 py-2.5 md:py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-sm md:text-base ${aiSearchMode
                                ? 'border-purple-300 bg-purple-50 focus:ring-purple-500 placeholder-purple-400'
                                : 'border-gray-300 focus:ring-blue-500'
                                }`}
                        />
                        {aiSearchMode && aiSearchLoading && (
                            <Loader2 className="absolute right-20 md:right-24 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-600 animate-spin" />
                        )}
                        <button
                            onClick={() => {
                                setAiSearchMode(!aiSearchMode);
                                setAiSearchCriteria(null);
                                if (aiSearchMode) fetchData();
                            }}
                            className={`absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${aiSearchMode
                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-sm'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span className="text-xs font-bold uppercase tracking-wider">AI</span>
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {aiSearchMode ? (
                        <button
                            onClick={handleAISearch}
                            disabled={aiSearchLoading || !searchQuery.trim()}
                            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-bold text-sm shadow-md disabled:opacity-50"
                        >
                            {aiSearchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            Tìm AI
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border transition-all text-sm font-bold ${showFilters ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                            >
                                <Filter className="w-4 h-4" />
                                {showFilters ? 'Ẩn bộ lọc' : 'Lọc thêm'}
                            </button>
                            {(selectedBrands.length > 0 || selectedCPUs.length > 0) && (
                                <button onClick={clearAllFilters} className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Horizontal Filters */}
            {showFilters && !aiSearchMode && (
                <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100 p-3 mb-6 overflow-x-auto no-scrollbar">
                    <div className="flex flex-nowrap md:flex-wrap items-center gap-2 min-w-max md:min-w-0">
                        <div className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2 ml-1">Bộ lọc:</div>

                        {/* Brand Filter */}
                        <FilterButton
                            label="Hãng"
                            active={selectedBrands.length > 0}
                            onClick={() => toggleSection('brands')}
                            isExpanded={expandedSections.brands}
                        />

                        {/* CPU Filter */}
                        <FilterButton
                            label="CPU"
                            active={selectedCPUs.length > 0}
                            onClick={() => toggleSection('cpu')}
                            isExpanded={expandedSections.cpu}
                        />

                        {/* SSD Filter */}
                        <FilterButton
                            label="SSD"
                            active={selectedSSDs.length > 0}
                            onClick={() => toggleSection('ssd')}
                            isExpanded={expandedSections.ssd}
                        />

                        {/* VGA Filter */}
                        <FilterButton
                            label="VGA"
                            active={selectedGPUs.length > 0}
                            onClick={() => toggleSection('gpu')}
                            isExpanded={expandedSections.gpu}
                        />

                        {/* RAM Filter */}
                        <FilterButton
                            label="RAM"
                            active={selectedRAMs.length > 0}
                            onClick={() => toggleSection('ram')}
                            isExpanded={expandedSections.ram}
                        />

                        {/* Price Filter */}
                        <FilterButton
                            label="Giá"
                            active={priceRange.min > 0 || priceRange.max < 100000000}
                            onClick={() => toggleSection('price')}
                            isExpanded={expandedSections.price}
                        />

                        {/* Custom Dropdowns Rendering */}
                        <div className="relative">
                            {expandedSections.brands && (
                                <FilterDropdown items={brands} selected={selectedBrands} onSelect={setSelectedBrands} onClose={() => toggleSection('brands')} />
                            )}
                            {expandedSections.cpu && (
                                <FilterDropdown items={filterOptions.cpus} selected={selectedCPUs} onSelect={setSelectedCPUs} onClose={() => toggleSection('cpu')} />
                            )}
                            {expandedSections.ssd && (
                                <FilterDropdown items={filterOptions.ssds} selected={selectedSSDs} onSelect={setSelectedSSDs} onClose={() => toggleSection('ssd')} />
                            )}
                            {expandedSections.gpu && (
                                <FilterDropdown items={filterOptions.gpus} selected={selectedGPUs} onSelect={setSelectedGPUs} onClose={() => toggleSection('gpu')} />
                            )}
                            {expandedSections.ram && (
                                <FilterDropdown items={filterOptions.rams} selected={selectedRAMs} onSelect={setSelectedRAMs} onClose={() => toggleSection('ram')} />
                            )}
                            {expandedSections.price && (
                                <div className="absolute top-full left-0 mt-2 bg-white border rounded-xl shadow-xl p-4 z-40 min-w-[280px] animate-in fade-in zoom-in-95 duration-200">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-gray-500 uppercase">Khoảng giá</span>
                                            <button onClick={() => toggleSection('price')} className="p-1 hover:bg-gray-100 rounded-full"><X size={14} /></button>
                                        </div>
                                        <div className="flex gap-2">
                                            <input type="number" placeholder="Min" value={priceRange.min} onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg text-sm font-bold" />
                                            <span className="self-center text-gray-300">-</span>
                                            <input type="number" placeholder="Max" value={priceRange.max} onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg text-sm font-bold" />
                                        </div>
                                        <div className="flex justify-between text-[10px] font-black text-blue-600 bg-blue-50 p-2 rounded-lg">
                                            <span>{formatPrice(priceRange.min)}</span>
                                            <span>{formatPrice(priceRange.max)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Products Table / Cards */}
            <div>
                {loading ? (
                    <div className="bg-white/50 rounded-2xl border border-gray-100 p-12 text-center">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Đang tải dữ liệu...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Table Header (Hidden on Mobile) */}
                        <div className="hidden lg:grid grid-cols-[40px_80px_1.5fr_1fr_1fr_100px_120px_100px] gap-4 px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-xs font-black text-gray-400 uppercase tracking-widest mb-2 items-center">
                            <div className="flex justify-center">
                                <input type="checkbox" checked={filteredLaptops.length > 0 && selectedIds.length === filteredLaptops.length} onChange={handleSelectAll} className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                            </div>
                            <div className="pl-2">Ảnh</div>
                            <div>Tên sản phẩm</div>
                            <div>Model</div>
                            <div>Cấu hình</div>
                            <div>Giá</div>
                            <div className="text-center">Trạng thái</div>
                            <div className="text-right">Thao tác</div>
                        </div>

                        {/* Product List */}
                        <div className="space-y-3">
                            {filteredLaptops.map((laptop) => (
                                <div key={laptop._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden">
                                    <div className="grid grid-cols-1 lg:grid-cols-[40px_80px_1.5fr_1fr_1fr_100px_120px_100px] gap-3 lg:gap-4 p-4 lg:px-6 lg:py-4 items-center relative">
                                        <div className="flex lg:contents items-center justify-between mb-2 lg:mb-0 pb-3 lg:pb-0 border-b lg:border-none border-gray-50">
                                            <div className="flex items-center gap-3">
                                                <input type="checkbox" checked={selectedIds.includes(laptop._id)} onChange={() => handleSelectOne(laptop._id)} className="w-4 h-4 lg:w-4 lg:h-4 rounded border-gray-300 text-blue-600" />
                                                <span className="lg:hidden text-[10px] font-black text-gray-400 uppercase tracking-widest">#ID: {laptop._id.slice(-6).toUpperCase()}</span>
                                            </div>
                                            <div className="lg:hidden flex items-center gap-1">
                                                <button onClick={() => handleEdit(laptop)} className="p-2 text-blue-600 bg-blue-50 rounded-xl"><Edit2 size={16} /></button>
                                                <button onClick={() => handleDelete(laptop._id)} className="p-2 text-red-600 bg-red-50 rounded-xl ml-1"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                        <div className="flex lg:contents items-center gap-4 lg:gap-0">
                                            <div className="w-20 lg:w-16 h-16 lg:h-12 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center">
                                                {(laptop.image || (laptop.images && laptop.images.length > 0)) ? (
                                                    <img src={laptop.image || laptop.images[0]} alt="" className="w-full h-full object-contain" />
                                                ) : <ImageIcon className="text-gray-200" size={24} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm md:text-base font-black text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{laptop.name}</div>
                                                <div className="lg:hidden text-xs font-bold text-gray-400 mt-0.5">{laptop.brandId?.name} • {laptop.categoryId?.name}</div>
                                            </div>
                                        </div>
                                        <div className="hidden lg:block text-sm font-bold text-gray-500 font-mono truncate">{laptop.model}</div>
                                        <div className="lg:contents">
                                            <div className="bg-gray-50 lg:bg-transparent p-2 lg:p-0 rounded-xl flex lg:flex-col flex-wrap gap-x-3 gap-y-1 lg:gap-0">
                                                <span className="text-[10px] lg:text-xs font-bold text-gray-600 flex items-center gap-1.5 whitespace-nowrap"><Cpu size={12} />{laptop.specs.cpu || 'N/A'}</span>
                                                <span className="text-[10px] lg:text-xs font-bold text-gray-400 flex items-center gap-1.5 whitespace-nowrap"><ImageIcon size={12} />{laptop.specs.ram || '-'} / {laptop.specs.ssd || '-'}</span>
                                            </div>
                                        </div>
                                        <div className="flex lg:contents items-baseline justify-between py-2 border-y lg:border-none border-gray-50 mt-1 lg:mt-0">
                                            <span className="lg:hidden text-[10px] font-bold text-gray-400 uppercase">Giá bán:</span>
                                            <div className="text-base lg:text-sm font-black text-blue-600">{formatPrice(laptop.price)}</div>
                                        </div>
                                        <div className="flex lg:contents justify-center">
                                            <span className={`px-3 py-1 lg:w-full lg:text-center rounded-full text-[10px] font-black uppercase tracking-widest ${laptop.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                {laptop.status}
                                            </span>
                                        </div>
                                        <div className="hidden lg:flex items-center justify-end gap-2">
                                            <button onClick={() => handleEdit(laptop)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit2 size={16} /></button>
                                            <button onClick={() => handleDelete(laptop._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 shrink-0">
                            <h2 className="text-xl font-bold text-gray-800">
                                {editingLaptop ? 'Edit Laptop' : 'Add Laptop'}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form id="laptop-form" onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
                            {/* AI Quick Fill */}
                            {!editingLaptop && (
                                <QuickFillTextarea onParsed={handleAIParse} />
                            )}

                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.model}
                                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                                    <select
                                        required
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option value="">Select category</option>
                                        {categories.map((cat) => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
                                    <select
                                        required
                                        value={formData.brandId}
                                        onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option value="">Select brand</option>
                                        {brands.map((brand) => (
                                            <option key={brand._id} value={brand._id}>{brand.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <PriceInput
                                    value={formData.price}
                                    onChange={(value) => setFormData({ ...formData, price: value })}
                                    label="Giá (nghìn đồng) *"
                                    placeholder="Ví dụ: 9900 = 9.900.000đ"
                                />
                            </div>

                            {/* Images Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh sản phẩm</label>
                                <ImageUploader
                                    value={formData.images.filter(img => img.trim() !== '')}
                                    onChange={(urls) => setFormData({ ...formData, images: urls.length > 0 ? urls : [''] })}
                                    maxImages={5}
                                />
                                <p className="text-xs text-gray-500 mt-2">Kéo thả hoặc click để upload ảnh. Ảnh đầu tiên sẽ là ảnh chính.</p>
                            </div>

                            {/* Specs */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">Specifications</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <SearchableSelect
                                            label="CPU"
                                            value={formData.specs.cpu}
                                            onChange={(value) => setFormData({ ...formData, specs: { ...formData.specs, cpu: value } })}
                                            options={COMMON_CPUS}
                                            placeholder="Chọn hoặc nhập CPU..."
                                        />
                                    </div>
                                    <div>
                                        <SearchableSelect
                                            label="GPU"
                                            value={formData.specs.gpu}
                                            onChange={(value) => setFormData({ ...formData, specs: { ...formData.specs, gpu: value } })}
                                            options={COMMON_GPUS}
                                            placeholder="Chọn hoặc nhập GPU..."
                                        />
                                    </div>
                                    <div>
                                        <SearchableSelect
                                            label="RAM"
                                            value={formData.specs.ram}
                                            onChange={(value) => setFormData({ ...formData, specs: { ...formData.specs, ram: value } })}
                                            options={COMMON_RAM_SIZES}
                                            placeholder="Chọn hoặc nhập RAM..."
                                        />
                                    </div>
                                    <div>
                                        <SearchableSelect
                                            label="SSD"
                                            value={formData.specs.ssd}
                                            onChange={(value) => setFormData({ ...formData, specs: { ...formData.specs, ssd: value } })}
                                            options={COMMON_SSD_SIZES}
                                            placeholder="Chọn hoặc nhập SSD..."
                                        />
                                    </div>
                                    <div>
                                        <SearchableSelect
                                            label="Screen"
                                            value={formData.specs.screen}
                                            onChange={(value) => setFormData({ ...formData, specs: { ...formData.specs, screen: value } })}
                                            options={COMMON_SCREENS}
                                            placeholder="Chọn hoặc nhập Screen..."
                                        />
                                    </div>
                                    <div>
                                        <SearchableSelect
                                            label="Battery"
                                            value={formData.specs.battery}
                                            onChange={(value) => setFormData({ ...formData, specs: { ...formData.specs, battery: value } })}
                                            options={COMMON_BATTERIES}
                                            placeholder="Chọn hoặc nhập Battery..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Gift Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Gift Info / Promotion</label>
                                <textarea
                                    value={formData.gift}
                                    onChange={(e) => setFormData({ ...formData, gift: e.target.value })}
                                    rows={4}
                                    placeholder="Enter gift details or promotion text..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                                />
                            </div>

                            {/* Warranty Duration */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Thời hạn bảo hành</label>
                                <select
                                    value={formData.warrantyMonths}
                                    onChange={(e) => setFormData({ ...formData, warrantyMonths: Number(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value={3}>3 tháng</option>
                                    <option value={1}>1 tháng</option>
                                    <option value={2}>2 tháng</option>
                                    <option value={6}>6 tháng</option>
                                    <option value={12}>12 tháng</option>
                                    <option value={18}>18 tháng</option>
                                    <option value={24}>24 tháng</option>
                                    <option value={36}>36 tháng</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-2">Chọn thời hạn bảo hành (tháng)</p>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                        </form>

                        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl shrink-0">
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    form="laptop-form"
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-medium shadow-md hover:shadow-lg"
                                >
                                    {editingLaptop ? 'Update Laptop' : 'Create Laptop'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper Components for Cleaner Main Component
function FilterButton({ label, active, onClick, isExpanded }: { label: string, active: boolean, onClick: () => void, isExpanded: boolean }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-xs font-bold whitespace-nowrap ${active
                ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
        >
            {label}
            <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
    );
}

function FilterDropdown({ items, selected, onSelect, onClose }: { items: any[], selected: string[], onSelect: (val: string[]) => void, onClose: () => void }) {
    return (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-3 z-40 min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-50">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tùy chọn</span>
                <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full"><X size={12} /></button>
            </div>
            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1 thin-scrollbar">
                {items.map(item => {
                    const id = typeof item === 'string' ? item : item._id;
                    const name = typeof item === 'string' ? item : item.name;
                    return (
                        <label key={id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                            <input
                                type="checkbox"
                                checked={selected.includes(id)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        onSelect([...selected, id]);
                                    } else {
                                        onSelect(selected.filter(i => i !== id));
                                    }
                                }}
                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-sm font-bold text-gray-700">{name}</span>
                        </label>
                    );
                })}
            </div>
            {selected.length > 0 && (
                <button
                    onClick={() => onSelect([])}
                    className="w-full mt-2 py-1.5 text-[10px] font-black text-red-500 uppercase tracking-tighter hover:bg-red-50 rounded-lg transition-colors border border-red-100"
                >
                    Xóa lựa chọn
                </button>
            )}
        </div>
    );
}
