'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    Plus, Edit2, Trash2, X,
    Image as ImageIcon, Search,
    ChevronDown, Loader2, Cpu, Copy, ExternalLink, Check
} from 'lucide-react';
import Toast from '@/components/admin/Toast';

interface Category { _id: string; name: string; }
interface Brand { _id: string; name: string; }

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
    description?: string;
    warrantyMonths?: number;
    specs: { cpu: string; gpu: string; ram: string; ssd: string; screen: string; hz: string; resolution: string; battery: string; };
    warranty?: { duration: string; items: string[]; };
    status: string;
}

export default function LaptopsPage() {
    const router = useRouter();
    const [laptops, setLaptops] = useState<Laptop[]>([]);
    const [loading, setLoading] = useState(true);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedCPUs, setSelectedCPUs] = useState<string[]>([]);
    const [selectedRAMs, setSelectedRAMs] = useState<string[]>([]);
    const [selectedSSDs, setSelectedSSDs] = useState<string[]>([]);
    const [selectedGPUs, setSelectedGPUs] = useState<string[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({ message: '', type: 'info', isVisible: false });
    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => setToast({ message, type, isVisible: true });

    useEffect(() => {
        fetchData();
        fetch('/api/admin/brands').then(r => r.json()).then(d => { if (d.success) setBrands(d.data); });
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!(e.target as HTMLElement).closest('.filter-dd')) setOpenDropdown(null);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/laptops');
            const data = await res.json();
            if (data.success) setLaptops(data.data);
        } catch (err) {
            showToast('Lỗi tải dữ liệu', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Extract unique filter values from current data
    const filterOpts = useMemo(() => ({
        cpus: [...new Set(laptops.map(l => l.specs?.cpu).filter(Boolean))].sort(),
        rams: [...new Set(laptops.map(l => l.specs?.ram).filter(Boolean))].sort(),
        ssds: [...new Set(laptops.map(l => l.specs?.ssd).filter(Boolean))].sort(),
        gpus: [...new Set(laptops.map(l => l.specs?.gpu).filter(Boolean))].sort(),
    }), [laptops]);

    const filteredLaptops = useMemo(() => {
        return laptops.filter(l => {
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const match =
                    l.name?.toLowerCase().includes(q) ||
                    l.model?.toLowerCase().includes(q) ||
                    l.specs?.cpu?.toLowerCase().includes(q) ||
                    l.brandId?.name?.toLowerCase().includes(q);
                if (!match) return false;
            }
            if (selectedBrands.length > 0 && !selectedBrands.includes(l.brandId?._id)) return false;
            if (selectedCPUs.length > 0 && !selectedCPUs.includes(l.specs?.cpu)) return false;
            if (selectedRAMs.length > 0 && !selectedRAMs.includes(l.specs?.ram)) return false;
            if (selectedSSDs.length > 0 && !selectedSSDs.includes(l.specs?.ssd)) return false;
            if (selectedGPUs.length > 0 && !selectedGPUs.includes(l.specs?.gpu)) return false;

            if (selectedPriceRange) {
                if (selectedPriceRange === '< 10tr' && l.price >= 10000000) return false;
                if (selectedPriceRange === '10tr - 15tr' && (l.price < 10000000 || l.price >= 15000000)) return false;
                if (selectedPriceRange === '15tr - 20tr' && (l.price < 15000000 || l.price >= 20000000)) return false;
                if (selectedPriceRange === '20tr - 30tr' && (l.price < 20000000 || l.price >= 30000000)) return false;
                if (selectedPriceRange === '> 30tr' && l.price < 30000000) return false;
            }

            if (selectedStatus && l.status !== selectedStatus) return false;
            return true;
        });
    }, [laptops, searchQuery, selectedBrands, selectedCPUs, selectedRAMs, selectedSSDs, selectedGPUs, selectedStatus, selectedPriceRange]);

    const hasActiveFilters = selectedBrands.length > 0 || selectedCPUs.length > 0 || selectedRAMs.length > 0 || selectedSSDs.length > 0 || selectedGPUs.length > 0 || selectedStatus || selectedPriceRange;

    const clearAllFilters = () => {
        setSearchQuery('');
        setSelectedBrands([]);
        setSelectedCPUs([]);
        setSelectedRAMs([]);
        setSelectedSSDs([]);
        setSelectedGPUs([]);
        setSelectedStatus('');
        setSelectedPriceRange('');
    };

    const toggleFilter = (list: string[], setList: (v: string[]) => void, val: string) => {
        setList(list.includes(val) ? list.filter(x => x !== val) : [...list, val]);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Xóa laptop này?')) return;
        try {
            const res = await fetch(`/api/admin/laptops/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) { fetchData(); showToast('Đã xóa!', 'success'); }
            else showToast('Lỗi: ' + data.error, 'error');
        } catch { showToast('Lỗi khi xóa', 'error'); }
    };

    const handleBulkDelete = async () => {
        if (!selectedIds.length || !confirm(`Xóa ${selectedIds.length} sản phẩm?`)) return;
        try {
            const res = await fetch('/api/admin/laptops', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: selectedIds }) });
            const data = await res.json();
            if (data.success) { fetchData(); setSelectedIds([]); showToast(`Đã xóa ${data.deletedCount} sản phẩm`, 'success'); }
            else showToast('Lỗi: ' + data.error, 'error');
        } catch { showToast('Lỗi khi xóa', 'error'); }
    };

    const handleCopyUrl = (id: string, slug?: string) => {
        navigator.clipboard.writeText(`${window.location.origin}/laptops/${slug || id}`);
        setCopiedId(id);
        showToast('Đã sao chép!', 'success');
        setTimeout(() => setCopiedId(null), 2000);
    };

    const formatPrice = (p: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

    // Dropdown Component (inline)
    const FilterDropdown = ({
        id, label, options, selected, onSelect
    }: { id: string; label: string; options: string[]; selected: string[]; onSelect: (v: string[]) => void }) => (
        <div className="relative filter-dd">
            <button
                onClick={() => setOpenDropdown(openDropdown === id ? null : id)}
                className={`flex items-center gap-1.5 pl-3 pr-2 py-2 rounded-lg border text-xs font-bold transition-colors whitespace-nowrap
                    ${selected.length > 0
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600'
                    }`}
            >
                {label}
                {selected.length > 0 && <span className="bg-white/30 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-black">{selected.length}</span>}
                <ChevronDown size={13} className={`transition-transform ${openDropdown === id ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === id && (
                <div className="absolute top-full left-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl z-50 min-w-[180px] max-h-64 overflow-y-auto p-1.5">
                    {options.length === 0 && <p className="text-xs text-gray-400 text-center py-3">Không có dữ liệu</p>}
                    {options.map(opt => (
                        <label key={opt} className="flex items-center gap-2.5 px-3 py-2 hover:bg-blue-50 cursor-pointer rounded-lg group">
                            <input
                                type="checkbox"
                                checked={selected.includes(opt)}
                                onChange={() => toggleFilter(selected, onSelect, opt)}
                                className="w-3.5 h-3.5 accent-blue-600 rounded"
                            />
                            <span className="text-xs font-semibold text-gray-700 group-hover:text-blue-600 truncate">{opt}</span>
                        </label>
                    ))}
                    {selected.length > 0 && (
                        <button onClick={() => onSelect([])} className="w-full mt-1 py-1.5 text-[10px] font-bold text-red-500 hover:bg-red-50 rounded-lg border border-red-100">
                            Bỏ chọn tất cả
                        </button>
                    )}
                </div>
            )}
        </div>
    );

    const BrandDropdown = () => (
        <div className="relative filter-dd">
            <button
                onClick={() => setOpenDropdown(openDropdown === 'brand' ? null : 'brand')}
                className={`flex items-center gap-1.5 pl-3 pr-2 py-2 rounded-lg border text-xs font-bold transition-colors whitespace-nowrap
                    ${selectedBrands.length > 0
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600'
                    }`}
            >
                Hãng
                {selectedBrands.length > 0 && <span className="bg-white/30 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-black">{selectedBrands.length}</span>}
                <ChevronDown size={13} className={`transition-transform ${openDropdown === 'brand' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'brand' && (
                <div className="absolute top-full left-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl z-50 min-w-[180px] max-h-64 overflow-y-auto p-1.5">
                    {brands.map(b => (
                        <label key={b._id} className="flex items-center gap-2.5 px-3 py-2 hover:bg-blue-50 cursor-pointer rounded-lg group">
                            <input
                                type="checkbox"
                                checked={selectedBrands.includes(b._id)}
                                onChange={() => toggleFilter(selectedBrands, setSelectedBrands, b._id)}
                                className="w-3.5 h-3.5 accent-blue-600 rounded"
                            />
                            <span className="text-xs font-semibold text-gray-700 group-hover:text-blue-600">{b.name}</span>
                        </label>
                    ))}
                    {selectedBrands.length > 0 && (
                        <button onClick={() => setSelectedBrands([])} className="w-full mt-1 py-1.5 text-[10px] font-bold text-red-500 hover:bg-red-50 rounded-lg border border-red-100">
                            Bỏ chọn tất cả
                        </button>
                    )}
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-5">
            <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={() => setToast(p => ({ ...p, isVisible: false }))} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý Laptop</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Hiển thị <span className="font-bold text-blue-600">{filteredLaptops.length}</span> / {laptops.length} sản phẩm
                    </p>
                </div>
                <div className="flex gap-2">
                    {selectedIds.length > 0 && (
                        <button onClick={handleBulkDelete} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition text-sm font-medium shadow-sm">
                            <Trash2 size={16} /> Xóa ({selectedIds.length})
                        </button>
                    )}
                    <button
                        onClick={() => router.push('/admin/laptops/new')}
                        className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2.5 rounded-lg hover:from-green-700 hover:to-emerald-700 transition shadow-sm text-sm font-bold"
                    >
                        <Plus size={18} /> Thêm Laptop
                    </button>
                </div>
            </div>

            {/* Search + Filters Bar */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm tên, model, CPU, hãng..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Divider */}
                <div className="h-7 w-px bg-gray-200 hidden sm:block" />

                {/* Filter Dropdowns */}
                <div className="flex flex-wrap items-center gap-2">
                    <BrandDropdown />
                    <FilterDropdown id="cpu" label="CPU" options={filterOpts.cpus} selected={selectedCPUs} onSelect={setSelectedCPUs} />
                    <FilterDropdown id="ram" label="RAM" options={filterOpts.rams} selected={selectedRAMs} onSelect={setSelectedRAMs} />
                    <FilterDropdown id="ssd" label="SSD" options={filterOpts.ssds} selected={selectedSSDs} onSelect={setSelectedSSDs} />
                    <FilterDropdown id="gpu" label="VGA" options={filterOpts.gpus} selected={selectedGPUs} onSelect={setSelectedGPUs} />

                    {/* Price Filter */}
                    <div className="relative filter-dd">
                        <button
                            onClick={() => setOpenDropdown(openDropdown === 'price' ? null : 'price')}
                            className={`flex items-center gap-1.5 pl-3 pr-2 py-2 rounded-lg border text-xs font-bold transition-colors
                                ${selectedPriceRange ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600'}`}
                        >
                            {selectedPriceRange || 'Giá'}
                            <ChevronDown size={13} className={`transition-transform ${openDropdown === 'price' ? 'rotate-180' : ''}`} />
                        </button>
                        {openDropdown === 'price' && (
                            <div className="absolute top-full left-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl z-50 w-40 p-1.5">
                                {['< 10tr', '10tr - 15tr', '15tr - 20tr', '20tr - 30tr', '> 30tr'].map(s => (
                                    <button key={s} onClick={() => { setSelectedPriceRange(selectedPriceRange === s ? '' : s); setOpenDropdown(null); }}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${selectedPriceRange === s ? 'bg-blue-600 text-white' : 'hover:bg-blue-50 text-gray-700'}`}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Status Filter */}
                    <div className="relative filter-dd">
                        <button
                            onClick={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
                            className={`flex items-center gap-1.5 pl-3 pr-2 py-2 rounded-lg border text-xs font-bold transition-colors
                                ${selectedStatus ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600'}`}
                        >
                            {selectedStatus === 'active' ? '🟢 Active' : selectedStatus === 'inactive' ? '⚫ Inactive' : 'Trạng thái'}
                            <ChevronDown size={13} className={`transition-transform ${openDropdown === 'status' ? 'rotate-180' : ''}`} />
                        </button>
                        {openDropdown === 'status' && (
                            <div className="absolute top-full left-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl z-50 w-40 p-1.5">
                                {['active', 'inactive'].map(s => (
                                    <button key={s} onClick={() => { setSelectedStatus(selectedStatus === s ? '' : s); setOpenDropdown(null); }}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${selectedStatus === s ? 'bg-blue-600 text-white' : 'hover:bg-blue-50 text-gray-700'}`}>
                                        {s === 'active' ? '🟢 Active' : '⚫ Inactive'}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Clear all */}
                    {hasActiveFilters && (
                        <button onClick={clearAllFilters} className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg border border-red-200 transition-colors">
                            <X size={13} /> Xóa lọc
                        </button>
                    )}
                </div>
            </div>

            {/* Products Table */}
            {loading ? (
                <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-3" />
                    <p className="text-sm text-gray-400 font-medium">Đang tải dữ liệu...</p>
                </div>
            ) : filteredLaptops.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
                    <p className="text-gray-400 font-medium">Không tìm thấy sản phẩm nào</p>
                    {hasActiveFilters && <button onClick={clearAllFilters} className="mt-3 text-sm text-blue-600 hover:underline">Xóa bộ lọc</button>}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Table Header */}
                    <div className="hidden lg:grid grid-cols-[36px_72px_1.6fr_0.9fr_1fr_90px_110px_130px] gap-3 px-5 py-3 bg-gray-50 border-b border-gray-200 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <div className="flex justify-center">
                            <input type="checkbox"
                                checked={filteredLaptops.length > 0 && selectedIds.length === filteredLaptops.length}
                                onChange={e => setSelectedIds(e.target.checked ? filteredLaptops.map(l => l._id) : [])}
                                className="w-4 h-4 accent-blue-600 rounded" />
                        </div>
                        <div>Ảnh</div>
                        <div>Tên sản phẩm</div>
                        <div>Model</div>
                        <div>Cấu hình</div>
                        <div>Giá</div>
                        <div className="text-center">Status</div>
                        <div className="text-right">Thao tác</div>
                    </div>

                    {/* Rows */}
                    <div className="divide-y divide-gray-100">
                        {filteredLaptops.map(laptop => (
                            <div key={laptop._id} className="grid grid-cols-[auto_1fr] lg:grid-cols-[36px_72px_1.6fr_0.9fr_1fr_90px_110px_130px] gap-x-3 gap-y-1 lg:gap-3 px-3 py-3 lg:px-5 lg:py-3.5 items-start lg:items-center hover:bg-blue-50/30 transition-colors group relative">
                                {/* Checkbox */}
                                <div className="hidden lg:flex justify-center">
                                    <input type="checkbox"
                                        checked={selectedIds.includes(laptop._id)}
                                        onChange={() => setSelectedIds(selectedIds.includes(laptop._id) ? selectedIds.filter(x => x !== laptop._id) : [...selectedIds, laptop._id])}
                                        className="w-4 h-4 accent-blue-600 rounded" />
                                </div>

                                {/* Image + mobile actions */}
                                <div className="flex flex-col items-center gap-2 lg:gap-0 lg:flex-row row-span-4 lg:row-span-1 mt-1 lg:mt-0">
                                    {/* Mobile checkbox */}
                                    <input type="checkbox" checked={selectedIds.includes(laptop._id)} onChange={() => setSelectedIds(selectedIds.includes(laptop._id) ? selectedIds.filter(x => x !== laptop._id) : [...selectedIds, laptop._id])} className="lg:hidden w-4 h-4 accent-blue-600 rounded flex-shrink-0" />
                                    <div className="w-16 h-16 lg:w-14 lg:h-12 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center">
                                        {(laptop.image || laptop.images?.[0]) ? (
                                            <img src={laptop.image || laptop.images[0]} alt="" className="w-full h-full object-contain" />
                                        ) : <ImageIcon size={20} className="text-gray-300" />}
                                    </div>
                                </div>

                                {/* Name */}
                                <div className="col-start-2 lg:col-start-auto">
                                    <div className="text-sm font-bold text-gray-800 line-clamp-2 md:line-clamp-1 group-hover:text-blue-600 transition-colors leading-snug lg:leading-normal pr-8 lg:pr-0">{laptop.name}</div>
                                    <div className="text-[11px] text-gray-400 mt-0.5">{laptop.brandId?.name} • {laptop.categoryId?.name}</div>
                                </div>

                                {/* Model */}
                                <div className="hidden lg:block text-xs font-mono font-semibold text-gray-500 truncate">{laptop.model}</div>

                                {/* Specs */}
                                <div className="hidden lg:flex flex-col gap-0.5">
                                    <span className="text-[11px] font-semibold text-gray-700 flex items-center gap-1"><Cpu size={11} className="text-gray-400" />{laptop.specs?.cpu || '-'}</span>
                                    <span className="text-[11px] text-gray-400">{laptop.specs?.ram || '-'} / {laptop.specs?.ssd || '-'}</span>
                                    {laptop.specs?.gpu && (
                                        <span className="text-[10px] text-purple-500 font-semibold truncate" title={laptop.specs.gpu}>
                                            {laptop.specs.gpu}
                                        </span>
                                    )}
                                </div>

                                {/* Price */}
                                <div className="col-start-2 lg:col-start-auto text-[13px] lg:text-sm font-black text-blue-600">{formatPrice(laptop.price)}</div>

                                {/* Status */}
                                <div className="hidden lg:flex justify-center">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${laptop.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {laptop.status}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="col-start-2 lg:col-start-auto flex items-center gap-1 mt-1 lg:mt-0 lg:justify-end border-t border-gray-100 lg:border-t-0 pt-2 lg:pt-0 w-full lg:w-auto">
                                    <button onClick={() => handleCopyUrl(laptop._id, laptop.slug)} className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition" title="Copy link">
                                        {copiedId === laptop._id ? <Check size={15} className="text-green-500" /> : <Copy size={15} />}
                                    </button>
                                    <a href={`/laptops/${laptop.slug || laptop._id}`} target="_blank" rel="noreferrer" className="p-1.5 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition" title="Xem">
                                        <ExternalLink size={15} />
                                    </a>
                                    <button onClick={() => router.push(`/admin/laptops/${laptop._id}`)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Sửa">
                                        <Edit2 size={15} />
                                    </button>
                                    <button onClick={() => handleDelete(laptop._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition" title="Xóa">
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
