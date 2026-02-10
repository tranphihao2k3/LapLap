'use client';

import { useEffect, useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, MinusCircle, PlusCircle, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import SearchableSelect from './SearchableSelect';
import PriceInput from './PriceInput';
import { COMMON_CPUS, COMMON_GPUS, COMMON_RAM_SIZES, COMMON_SSD_SIZES, COMMON_SCREENS, COMMON_BATTERIES } from './commonSpecs';

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
            const [laptopsRes, categoriesRes, brandsRes] = await Promise.all([
                fetch('/api/admin/laptops'),
                fetch('/api/admin/categories'),
                fetch('/api/admin/brands'),
            ]);

            const laptopsData = await laptopsRes.json();
            const categoriesData = await categoriesRes.json();
            const brandsData = await brandsRes.json();

            if (laptopsData.success) setLaptops(laptopsData.data);
            if (categoriesData.success) setCategories(categoriesData.data);
            if (brandsData.success) setBrands(brandsData.data);
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
            } else {
                alert('Error: ' + data.error);
            }
        } catch (error) {
            console.error('Error saving laptop:', error);
            alert('Error saving laptop');
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
            } else {
                alert('Error: ' + data.error);
            }
        } catch (error) {
            console.error('Error deleting laptop:', error);
            alert('Error deleting laptop');
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

    return (
        <div>
            {/* Header with Search and Add Button */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-800">Laptops</h1>
                    <p className="text-gray-600 mt-2">Manage laptop products - {filteredLaptops.length} of {laptops.length} products</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                    <Plus className="w-5 h-5" />
                    Add Laptop
                </button>
            </div>

            {/* Search Bar */}
            <div className="flex gap-4 mb-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, model, CPU, GPU, RAM, SSD..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${showFilters
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    <Filter className="w-5 h-5" />
                    Filters
                </button>
                {(selectedBrands.length > 0 || selectedCPUs.length > 0 || selectedRAMs.length > 0 || selectedSSDs.length > 0 || selectedGPUs.length > 0 || selectedScreens.length > 0) && (
                    <button
                        onClick={clearAllFilters}
                        className="px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                    >
                        Xóa bộ lọc
                    </button>
                )}
            </div>

            {/* Horizontal Filters */}
            {showFilters && (
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Danh mục phân loại</h3>
                    <div className="flex flex-wrap gap-3">
                        {/* Brand Filter */}
                        <div className="relative filter-dropdown">
                            <button
                                onClick={() => toggleSection('brands')}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                Theo hãng
                                <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.brands ? 'rotate-180' : ''}`} />
                            </button>
                            {expandedSections.brands && (
                                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10 min-w-[200px]">
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {brands.map(brand => (
                                            <label key={brand._id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedBrands.includes(brand._id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedBrands([...selectedBrands, brand._id]);
                                                        } else {
                                                            setSelectedBrands(selectedBrands.filter(id => id !== brand._id));
                                                        }
                                                    }}
                                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-700">{brand.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* CPU Filter */}
                        <div className="relative filter-dropdown">
                            <button
                                onClick={() => toggleSection('cpu')}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                CPU
                                <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.cpu ? 'rotate-180' : ''}`} />
                            </button>
                            {expandedSections.cpu && (
                                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10 min-w-[200px]">
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {filterOptions.cpus.map(cpu => (
                                            <label key={cpu} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCPUs.includes(cpu)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedCPUs([...selectedCPUs, cpu]);
                                                        } else {
                                                            setSelectedCPUs(selectedCPUs.filter(c => c !== cpu));
                                                        }
                                                    }}
                                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-700">{cpu}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* SSD Filter */}
                        <div className="relative filter-dropdown">
                            <button
                                onClick={() => toggleSection('ssd')}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                SSD HDD
                                <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.ssd ? 'rotate-180' : ''}`} />
                            </button>
                            {expandedSections.ssd && (
                                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10 min-w-[200px]">
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {filterOptions.ssds.map(ssd => (
                                            <label key={ssd} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSSDs.includes(ssd)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedSSDs([...selectedSSDs, ssd]);
                                                        } else {
                                                            setSelectedSSDs(selectedSSDs.filter(s => s !== ssd));
                                                        }
                                                    }}
                                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-700">{ssd}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* GPU Filter */}
                        <div className="relative filter-dropdown">
                            <button
                                onClick={() => toggleSection('gpu')}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                VGA
                                <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.gpu ? 'rotate-180' : ''}`} />
                            </button>
                            {expandedSections.gpu && (
                                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10 min-w-[200px]">
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {filterOptions.gpus.map(gpu => (
                                            <label key={gpu} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedGPUs.includes(gpu)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedGPUs([...selectedGPUs, gpu]);
                                                        } else {
                                                            setSelectedGPUs(selectedGPUs.filter(g => g !== gpu));
                                                        }
                                                    }}
                                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-700">{gpu}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RAM Filter */}
                        <div className="relative filter-dropdown">
                            <button
                                onClick={() => toggleSection('ram')}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                Theo giá
                                <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.ram ? 'rotate-180' : ''}`} />
                            </button>
                            {expandedSections.ram && (
                                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10 min-w-[200px]">
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {filterOptions.rams.map(ram => (
                                            <label key={ram} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRAMs.includes(ram)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedRAMs([...selectedRAMs, ram]);
                                                        } else {
                                                            setSelectedRAMs(selectedRAMs.filter(r => r !== ram));
                                                        }
                                                    }}
                                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-700">{ram}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Screen Filter */}
                        <div className="relative filter-dropdown">
                            <button
                                onClick={() => toggleSection('screen')}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                Kích thước màn hình
                                <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.screen ? 'rotate-180' : ''}`} />
                            </button>
                            {expandedSections.screen && (
                                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10 min-w-[200px]">
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {filterOptions.screens.map(screen => (
                                            <label key={screen} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedScreens.includes(screen)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedScreens([...selectedScreens, screen]);
                                                        } else {
                                                            setSelectedScreens(selectedScreens.filter(s => s !== screen));
                                                        }
                                                    }}
                                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-700">{screen}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Price Range Filter */}
                        <div className="relative filter-dropdown">
                            <button
                                onClick={() => toggleSection('price')}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                Tình trạng
                                <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.price ? 'rotate-180' : ''}`} />
                            </button>
                            {expandedSections.price && (
                                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 min-w-[280px]">
                                    <div className="space-y-3">
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                placeholder="Min"
                                                value={priceRange.min}
                                                onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                            />
                                            <span className="text-gray-500 self-center">-</span>
                                            <input
                                                type="number"
                                                placeholder="Max"
                                                value={priceRange.max}
                                                onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Products Table */}
            <div>
                {loading ? (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Loading...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Image</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Model</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Brand</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredLaptops.map((laptop) => (
                                        <tr key={laptop._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                {laptop.image || (laptop.images && laptop.images.length > 0 && laptop.images[0]) ? (
                                                    <img
                                                        src={laptop.image || laptop.images[0]}
                                                        alt={laptop.name}
                                                        className="w-16 h-12 object-cover rounded"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                                                        <ImageIcon className="w-6 h-6 text-gray-400" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-800">{laptop.name}</td>
                                            <td className="px-6 py-4 text-gray-600 font-mono text-sm">{laptop.model}</td>
                                            <td className="px-6 py-4 text-gray-600">{laptop.categoryId?.name || '-'}</td>
                                            <td className="px-6 py-4 text-gray-600">{laptop.brandId?.name || '-'}</td>
                                            <td className="px-6 py-4 text-gray-800 font-semibold">{formatPrice(laptop.price)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${laptop.status === 'active'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {laptop.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(laptop)}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(laptop._id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {laptops.length === 0 && (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                                No laptops found. Click "Add Laptop" to create one.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full my-8">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
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

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
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

                            <div className="grid grid-cols-3 gap-4">
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

                            {/* Images Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Images (URLs)</label>
                                <div className="space-y-3">
                                    {formData.images.map((img, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={img}
                                                onChange={(e) => handleImageChange(index, e.target.value)}
                                                placeholder="https://example.com/image.jpg"
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                            {index > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeImageField(index)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <MinusCircle className="w-5 h-5" />
                                                </button>
                                            )}
                                            {index === formData.images.length - 1 && (
                                                <button
                                                    type="button"
                                                    onClick={addImageField}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                >
                                                    <PlusCircle className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Add multiple image URLs. The first image will be the main thumbnail.</p>
                            </div>

                            {/* Specs */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">Specifications</h3>
                                <div className="grid grid-cols-2 gap-4">
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

                            <div className="flex gap-3 pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all"
                                >
                                    {editingLaptop ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
