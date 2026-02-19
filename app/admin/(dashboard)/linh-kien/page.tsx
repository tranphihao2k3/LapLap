
'use client';

import { useState, useEffect } from 'react';
import {
    Plus, Edit, Trash2, Search, Filter,
    MoreVertical, CheckCircle, XCircle,
    Cpu, HardDrive, Mouse, Keyboard, Package
} from 'lucide-react';
import PriceInput from '@/components/admin/PriceInput';
import Toast from '@/components/admin/Toast';

interface ComponentSpec {
    // RAM Specs
    ramType?: string;
    bus?: string;
    capacity?: string;

    // SSD Specs
    ssdType?: string;
    // capacity is reused

    // Mouse/Key/Other
    connection?: string; // Wired/Wireless
}

interface Component {
    _id: string;
    name: string;
    type: 'RAM' | 'SSD' | 'MOUSE' | 'KEYBOARD' | 'OTHER';
    price: number;
    specs: ComponentSpec;
    image: string;
    stock: number;
    active: boolean;
    description?: string;
}

export default function ComponentsPage() {
    const [components, setComponents] = useState<Component[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingComponent, setEditingComponent] = useState<Component | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<Component>>({
        name: '',
        type: 'RAM',
        price: 0,
        stock: 0,
        image: '',
        active: true,
        specs: {},
        description: ''
    });

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
        message: '',
        type: 'info',
        isVisible: false
    });

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        setToast({ message, type, isVisible: true });
    };

    const fetchComponents = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/components?all=true');
            const data = await res.json();
            if (data.success) {
                setComponents(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch components', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComponents();
    }, []);

    const handleOpenModal = (component?: Component) => {
        if (component) {
            setEditingComponent(component);
            setFormData(component);
        } else {
            setEditingComponent(null);
            setFormData({
                name: '',
                type: 'RAM',
                price: 0,
                stock: 0,
                image: '',
                active: true,
                specs: {}, // Initialize empty specs
                description: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingComponent(null);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingComponent
                ? `/api/components/${editingComponent._id}`
                : '/api/components';

            const method = editingComponent ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                handleCloseModal();
                fetchComponents();
                showToast(editingComponent ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'success');
            } else {
                showToast('Có lỗi xảy ra!', 'error');
            }
        } catch (error) {
            console.error('Error saving component', error);
            showToast('Lỗi kết nối!', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa linh kiện này?')) return;

        try {
            const res = await fetch(`/api/components/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchComponents();
                showToast('Đã xóa thành công!', 'success');
            } else {
                showToast('Lỗi khi xóa!', 'error');
            }
        } catch (error) {
            console.error('Error deleting component', error);
            showToast('Lỗi kết nối!', 'error');
        }
    };

    const handleSpecChange = (key: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            specs: {
                ...prev.specs,
                [key]: value
            }
        }));
    };

    const filteredComponents = components.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'ALL' || c.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 lg:px-8 bg-[#F8FAFC] min-h-screen">
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Package className="w-7 h-7 md:w-8 md:h-8 text-blue-600" />
                        Linh kiện & Phụ kiện
                    </h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">Quản lý kho hàng RAM, SSD và các thiết bị ngoại vi</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-200 font-bold text-sm md:text-base active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Thêm linh kiện
                </button>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
                <div className="relative w-full lg:w-96">
                    <input
                        type="text"
                        placeholder="Tìm theo tên linh kiện..."
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0 w-full lg:w-auto scrollbar-hide no-scrollbar">
                    {['ALL', 'RAM', 'SSD', 'MOUSE', 'KEYBOARD', 'OTHER'].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 ${filterType === type
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                                }`}
                        >
                            {type === 'ALL' ? 'Tất cả' : type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Components Content Area */}
            {loading ? (
                <div className="bg-white rounded-3xl border border-slate-100 p-20 text-center shadow-sm">
                    <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Đang tải dữ liệu...</p>
                </div>
            ) : filteredComponents.length === 0 ? (
                <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-16 text-center shadow-sm">
                    <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6 text-slate-200">
                        <Package size={40} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Không tìm thấy linh kiện</h3>
                    <p className="text-slate-500 text-sm font-medium">Thử thay đổi từ khóa hoặc bộ lọc của bạn.</p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        {/* Desktop Header */}
                        <div className="hidden xl:grid grid-cols-[1fr_120px_180px_120px_100px_120px_140px] gap-4 px-8 py-4 bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest items-center">
                            <div>Sản phẩm</div>
                            <div>Loại</div>
                            <div>Thông số kỹ thuật</div>
                            <div>Giá bán</div>
                            <div className="text-center">Tồn kho</div>
                            <div className="text-center">Trạng thái</div>
                            <div className="text-right">Thao tác</div>
                        </div>

                        {/* List Items */}
                        <div className="divide-y divide-slate-50">
                            {filteredComponents.map((item) => (
                                <div key={item._id} className="group hover:bg-slate-50/50 transition-all">
                                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_120px_180px_120px_100px_120px_140px] gap-4 p-5 lg:px-8 lg:py-5 items-center relative">
                                        {/* Name & Avatar */}
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 border border-slate-100 shadow-sm group-hover:scale-105 transition-transform">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="text-slate-300">
                                                        {item.type === 'RAM' && <Cpu size={24} />}
                                                        {item.type === 'SSD' && <HardDrive size={24} />}
                                                        {item.type === 'MOUSE' && <Mouse size={24} />}
                                                        {item.type === 'KEYBOARD' && <Keyboard size={24} />}
                                                        {item.type === 'OTHER' && <Package size={24} />}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-slate-800 text-sm md:text-base group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight uppercase tracking-tight">
                                                    {item.name}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Type Badge */}
                                        <div className="flex xl:items-center items-center justify-between xl:mt-0 pt-2 xl:pt-0 border-t xl:border-none border-slate-50">
                                            <span className="xl:hidden text-[10px] font-bold text-slate-400 uppercase">Loại:</span>
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${item.type === 'RAM' ? 'bg-blue-100 text-blue-700' :
                                                item.type === 'SSD' ? 'bg-purple-100 text-purple-700' :
                                                    'bg-slate-100 text-slate-700'
                                                }`}>
                                                {item.type}
                                            </span>
                                        </div>

                                        {/* Specs Display */}
                                        <div className="flex xl:flex-col items-center xl:items-start justify-between xl:justify-center mt-1 xl:mt-0">
                                            <span className="xl:hidden text-[10px] font-bold text-slate-400 uppercase">Thông số:</span>
                                            {item.type === 'RAM' ? (
                                                <div className="text-right xl:text-left">
                                                    <div className="text-xs font-black text-slate-700">{item.specs.capacity}</div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase leading-none">{item.specs.ramType} • {item.specs.bus}</div>
                                                </div>
                                            ) : item.type === 'SSD' ? (
                                                <div className="text-right xl:text-left">
                                                    <div className="text-xs font-black text-slate-700">{item.specs.capacity}</div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase leading-none">{item.specs.ssdType}</div>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] font-bold text-slate-300 italic">N/A</span>
                                            )}
                                        </div>

                                        {/* Price */}
                                        <div className="flex xl:flex-col items-center xl:items-start justify-between xl:justify-center mt-1 xl:mt-0">
                                            <span className="xl:hidden text-[10px] font-bold text-slate-400 uppercase">Giá:</span>
                                            <div className="text-sm xl:text-base font-black text-rose-600">
                                                {item.price.toLocaleString()}đ
                                            </div>
                                        </div>

                                        {/* Stock */}
                                        <div className="flex xl:justify-center items-center justify-between mt-1 xl:mt-0">
                                            <span className="xl:hidden text-[10px] font-bold text-slate-400 uppercase">Kho:</span>
                                            <span className={`text-[11px] font-black px-2 py-0.5 rounded-md ${item.stock > 10 ? 'bg-slate-50 text-slate-600' : 'bg-orange-50 text-orange-600'}`}>
                                                {item.stock} cái
                                            </span>
                                        </div>

                                        {/* Visibility Status */}
                                        <div className="flex xl:justify-center items-center justify-between mt-1 xl:mt-0">
                                            <span className="xl:hidden text-[10px] font-bold text-slate-400 uppercase">Trạng thái:</span>
                                            {item.active ? (
                                                <span className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                                                    <CheckCircle size={12} /> Hiện
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                                                    <XCircle size={12} /> Ẩn
                                                </span>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-end gap-2 mt-4 xl:mt-0 pt-3 xl:pt-0 border-t xl:border-none border-slate-50 relative z-10">
                                            <button
                                                onClick={() => handleOpenModal(item)}
                                                className="p-2.5 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all active:scale-95"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="p-2.5 text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 transition-all active:scale-95"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Optimized Components Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
                        <div className="p-6 md:p-8 border-b border-slate-50 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-20">
                            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                                {editingComponent ? 'Cập nhật linh kiện' : 'Thêm linh kiện mới'}
                            </h2>
                            <button onClick={handleCloseModal} className="p-2 hover:bg-slate-100 rounded-full transition-colors active:scale-90">
                                <XCircle className="w-7 h-7 text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 md:p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Tên sản phẩm *</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-400"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Ví dụ: RAM Laptop Kingston 8GB DDR4 3200MHz"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Phân loại *</label>
                                    <select
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-black text-xs uppercase tracking-widest text-slate-700 appearance-none bg-white cursor-pointer"
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                    >
                                        <option value="RAM">RAM Laptop</option>
                                        <option value="SSD">Ổ cứng SSD</option>
                                        <option value="MOUSE">Chuột máy tính</option>
                                        <option value="KEYBOARD">Bàn phím</option>
                                        <option value="OTHER">Phụ kiện khác</option>
                                    </select>
                                </div>

                                <div>
                                    <PriceInput
                                        value={formData.price || 0}
                                        onChange={(val) => setFormData({ ...formData, price: val })}
                                        required
                                    />
                                </div>

                                {/* SPECIFIC FIELDS BASED ON TYPE */}
                                {formData.type === 'RAM' && (
                                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 bg-blue-50/50 p-6 rounded-3xl border border-blue-100 animate-in zoom-in-95">
                                        <div className="md:col-span-3 flex items-center gap-2 mb-2">
                                            <Cpu className="text-blue-600 w-5 h-5" />
                                            <h4 className="font-black text-blue-900 text-xs uppercase tracking-widest">Thông số RAM</h4>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Dung lượng</label>
                                            <select
                                                className="w-full p-3 rounded-xl border border-blue-100 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-400 transition-all bg-white"
                                                value={formData.specs?.capacity || ''}
                                                onChange={e => handleSpecChange('capacity', e.target.value)}
                                            >
                                                <option value="">Chọn</option>
                                                <option value="4GB">4GB</option>
                                                <option value="8GB">8GB</option>
                                                <option value="16GB">16GB</option>
                                                <option value="32GB">32GB</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Loại RAM</label>
                                            <select
                                                className="w-full p-3 rounded-xl border border-blue-100 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-400 transition-all bg-white"
                                                value={formData.specs?.ramType || ''}
                                                onChange={e => handleSpecChange('ramType', e.target.value)}
                                            >
                                                <option value="">Chọn</option>
                                                <option value="DDR3">DDR3</option>
                                                <option value="DDR3L">DDR3L</option>
                                                <option value="DDR4">DDR4</option>
                                                <option value="DDR5">DDR5</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Bus RAM</label>
                                            <select
                                                className="w-full p-3 rounded-xl border border-blue-100 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-400 transition-all bg-white"
                                                value={formData.specs?.bus || ''}
                                                onChange={e => handleSpecChange('bus', e.target.value)}
                                            >
                                                <option value="">Chọn</option>
                                                <option value="1600MHz">1600MHz</option>
                                                <option value="2133MHz">2133MHz</option>
                                                <option value="2400MHz">2400MHz</option>
                                                <option value="2666MHz">2666MHz</option>
                                                <option value="3200MHz">3200MHz</option>
                                                <option value="4800MHz">4800MHz</option>
                                                <option value="5600MHz">5600MHz</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {formData.type === 'SSD' && (
                                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 bg-purple-50/50 p-6 rounded-3xl border border-purple-100 animate-in zoom-in-95">
                                        <div className="md:col-span-2 flex items-center gap-2 mb-2">
                                            <HardDrive className="text-purple-600 w-5 h-5" />
                                            <h4 className="font-black text-purple-900 text-xs uppercase tracking-widest">Thông số SSD</h4>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2">Dung lượng</label>
                                            <select
                                                className="w-full p-3 rounded-xl border border-purple-100 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-purple-400 transition-all bg-white"
                                                value={formData.specs?.capacity || ''}
                                                onChange={e => handleSpecChange('capacity', e.target.value)}
                                            >
                                                <option value="">Chọn</option>
                                                <option value="128GB">128GB</option>
                                                <option value="256GB">256GB</option>
                                                <option value="512GB">512GB</option>
                                                <option value="1TB">1TB</option>
                                                <option value="2TB">2TB</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2">Chuẩn kết nối</label>
                                            <select
                                                className="w-full p-3 rounded-xl border border-purple-100 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-purple-400 transition-all bg-white"
                                                value={formData.specs?.ssdType || ''}
                                                onChange={e => handleSpecChange('ssdType', e.target.value)}
                                            >
                                                <option value="">Chọn</option>
                                                <option value="2.5 SATA">2.5" SATA</option>
                                                <option value="M.2 SATA">M.2 SATA</option>
                                                <option value="NVMe">M.2 NVMe</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Tồn kho hiện tại</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
                                        value={formData.stock}
                                        onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Hình ảnh đại diện (URL)</label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-xs"
                                        value={formData.image}
                                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Mô tả chi tiết</label>
                                    <textarea
                                        rows={3}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-700 resize-none"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Nhập thông tin mô tả cho sản phẩm..."
                                    ></textarea>
                                </div>

                                <div className="md:col-span-2 flex items-center gap-3 py-2">
                                    <div className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            id="active"
                                            checked={formData.active}
                                            onChange={e => setFormData({ ...formData, active: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        <label htmlFor="active" className="ml-3 text-xs font-black text-slate-500 uppercase tracking-wider cursor-pointer">Kích hoạt sản phẩm</label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-8 border-t border-slate-50">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-8 py-4 rounded-2xl text-slate-400 font-black uppercase tracking-widest hover:bg-slate-50 transition-colors text-xs"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    className="px-10 py-4 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95 text-xs"
                                >
                                    {editingComponent ? 'Cập nhật' : 'Thêm mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
