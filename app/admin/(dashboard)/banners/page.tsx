'use client';

import { useState, useEffect } from 'react';
import {
    Plus, Search, Edit2, Trash2, ArrowUp, ArrowDown,
    Image, Link, Calendar, Eye, EyeOff, LayoutGrid
} from 'lucide-react';
import Toast from '@/components/admin/Toast';
import ImageUploader from '@/components/admin/ImageUploader';

interface Banner {
    _id: string;
    title: string;
    image: string;
    link: string;
    position: 'home' | 'promotion' | 'banner' | 'popup';
    order: number;
    startDate: string | null;
    endDate: string | null;
    status: 'active' | 'inactive' | 'scheduled';
    description: string;
    createdAt: string;
}

const POSITION_LABELS: Record<string, string> = {
    home: 'Trang chủ',
    promotion: 'Khuyến mãi',
    banner: 'Banner chung',
    popup: 'Popup',
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    active: { label: 'Hoạt động', color: 'bg-emerald-100 text-emerald-600' },
    inactive: { label: 'Tắt', color: 'bg-slate-100 text-slate-500' },
    scheduled: { label: 'Lên lịch', color: 'bg-amber-100 text-amber-600' },
};

export default function BannersPage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPosition, setFilterPosition] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        image: '',
        link: '',
        position: 'home',
        order: 0,
        startDate: '',
        endDate: '',
        status: 'active',
        description: '',
    });


    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
        message: '',
        type: 'info',
        isVisible: false
    });

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        setToast({ message, type, isVisible: true });
    };

    const fetchBanners = async () => {
        try {
            const res = await fetch('/api/admin/banners');
            const data = await res.json();
            if (data.success) {
                setBanners(data.data);
            }
        } catch (error) {
            showToast('Lỗi tải dữ liệu', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleOpenModal = (banner?: Banner) => {
        if (banner) {
            setEditingBanner(banner);
            setFormData({
                title: banner.title,
                image: banner.image,
                link: banner.link,
                position: banner.position,
                order: banner.order,
                startDate: banner.startDate ? banner.startDate.split('T')[0] : '',
                endDate: banner.endDate ? banner.endDate.split('T')[0] : '',
                status: banner.status,
                description: banner.description,
            });
        } else {
            setEditingBanner(null);
            setFormData({
                title: '',
                image: '',
                link: '',
                position: 'home',
                order: 0,
                startDate: '',
                endDate: '',
                status: 'active',
                description: '',
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBanner(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const url = editingBanner 
                ? `/api/admin/banners/${editingBanner._id}`
                : '/api/admin/banners';
            const method = editingBanner ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                showToast(editingBanner ? 'Cập nhật thành công!' : 'Tạo banner thành công!');
                handleCloseModal();
                fetchBanners();
            } else {
                showToast(data.error || 'Có lỗi xảy ra', 'error');
            }
        } catch (error) {
            showToast('Lỗi kết nối', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa banner này?')) return;

        try {
            const res = await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
            const data = await res.json();

            if (data.success) {
                showToast('Đã xóa thành công!');
                fetchBanners();
            } else {
                showToast(data.error || 'Lỗi khi xóa', 'error');
            }
        } catch (error) {
            showToast('Lỗi kết nối', 'error');
        }
    };

    const handleReorder = async (id: string, direction: 'up' | 'down') => {
        const index = banners.findIndex(b => b._id === id);
        if (index === -1) return;
        
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === banners.length - 1) return;

        const newBanners = [...banners];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        [newBanners[index], newBanners[swapIndex]] = [newBanners[swapIndex], newBanners[index]];

        // Update order values
        newBanners.forEach((banner, i) => {
            banner.order = i;
        });

        setBanners(newBanners);

        // Save to backend
        try {
            await Promise.all(newBanners.map(banner => 
                fetch(`/api/admin/banners/${banner._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ order: banner.order }),
                })
            ));
        } catch (error) {
            showToast('Lỗi cập nhật thứ tự', 'error');
        }
    };

    const filteredBanners = banners.filter(b => {
        const matchesSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPosition = filterPosition === 'all' ? true : b.position === filterPosition;
        return matchesSearch && matchesPosition;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 lg:px-8 bg-[#F8FAFC] min-h-screen">
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <LayoutGrid className="w-7 h-7 md:w-8 md:h-8 text-blue-600" />
                        Banner & Quảng cáo
                    </h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">Quản lý banner và hình ảnh quảng cáo</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-200 font-bold text-sm md:text-base active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Thêm banner
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
                <div className="relative w-full lg:w-96">
                    <input
                        type="text"
                        placeholder="Tìm theo tiêu đề..."
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0 w-full lg:w-auto scrollbar-hide">
                    {[
                        { key: 'all', label: 'Tất cả' },
                        { key: 'home', label: 'Trang chủ' },
                        { key: 'promotion', label: 'Khuyến mãi' },
                        { key: 'banner', label: 'Banner' },
                        { key: 'popup', label: 'Popup' },
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setFilterPosition(key)}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 ${
                                filterPosition === key
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Banners Grid */}
            {loading ? (
                <div className="bg-white rounded-3xl border border-slate-100 p-20 text-center shadow-sm">
                    <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Đang tải...</p>
                </div>
            ) : filteredBanners.length === 0 ? (
                <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-16 text-center shadow-sm">
                    <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6 text-slate-200">
                        <Image size={40} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Không tìm thấy banner</h3>
                    <p className="text-slate-500 text-sm font-medium">Thử thay đổi bộ lọc hoặc tạo banner mới.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredBanners.map((banner, index) => (
                        <div key={banner._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group">
                            {/* Image */}
                            <div className="relative aspect-video bg-slate-100 overflow-hidden">
                                {banner.image ? (
                                    <img 
                                        src={banner.image} 
                                        alt={banner.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <Image size={48} />
                                    </div>
                                )}
                                <div className="absolute top-3 left-3">
                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${STATUS_LABELS[banner.status].color}`}>
                                        {STATUS_LABELS[banner.status].label}
                                    </span>
                                </div>
                                <div className="absolute top-3 right-3 flex gap-1">
                                    <button
                                        onClick={() => handleReorder(banner._id, 'up')}
                                        disabled={index === 0}
                                        className="p-1.5 bg-white/90 hover:bg-white rounded-lg shadow-sm disabled:opacity-30 transition-all"
                                    >
                                        <ArrowUp size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleReorder(banner._id, 'down')}
                                        disabled={index === filteredBanners.length - 1}
                                        className="p-1.5 bg-white/90 hover:bg-white rounded-lg shadow-sm disabled:opacity-30 transition-all"
                                    >
                                        <ArrowDown size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="font-bold text-slate-800 line-clamp-1">{banner.title}</h3>
                                        <p className="text-xs text-slate-400 mt-0.5">{POSITION_LABELS[banner.position]}</p>
                                    </div>
                                    <span className="text-xs font-bold text-slate-300">#{banner.order + 1}</span>
                                </div>

                                {banner.link && (
                                    <div className="flex items-center gap-1.5 text-xs text-blue-600 mb-3">
                                        <Link size={12} />
                                        <span className="truncate">{banner.link}</span>
                                    </div>
                                )}

                                {(banner.startDate || banner.endDate) && (
                                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                                        <Calendar size={12} />
                                        <span>
                                            {banner.startDate ? new Date(banner.startDate).toLocaleDateString('vi-VN') : '...'} - 
                                            {banner.endDate ? new Date(banner.endDate).toLocaleDateString('vi-VN') : '...'}
                                        </span>
                                    </div>
                                )}

                                <div className="flex gap-2 pt-3 border-t border-slate-100">
                                    <button
                                        onClick={() => handleOpenModal(banner)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all text-xs font-bold uppercase tracking-wider"
                                    >
                                        <Edit2 size={14} />
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDelete(banner._id)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-all text-xs font-bold uppercase tracking-wider"
                                    >
                                        <Trash2 size={14} />
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-20">
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">
                                {editingBanner ? 'Cập nhật banner' : 'Thêm banner mới'}
                            </h2>
                            <button onClick={handleCloseModal} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <EyeOff className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tiêu đề *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
                                    placeholder="Tiêu đề banner"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Hình ảnh *</label>
                                <ImageUploader
                                    value={formData.image ? [formData.image] : []}
                                    onChange={(urls) => setFormData({ ...formData, image: urls[0] || '' })}
                                    maxImages={1}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Link (URL)</label>
                                <input
                                    type="text"
                                    value={formData.link}
                                    onChange={e => setFormData({ ...formData, link: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-slate-700"
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Vị trí</label>
                                    <select
                                        value={formData.position}
                                        onChange={e => setFormData({ ...formData, position: e.target.value as any })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-700"
                                    >
                                        <option value="home">Trang chủ</option>
                                        <option value="promotion">Khuyến mãi</option>
                                        <option value="banner">Banner chung</option>
                                        <option value="popup">Popup</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Thứ tự</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.order}
                                        onChange={e => setFormData({ ...formData, order: Number(e.target.value) })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Hiển thị từ</label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Hiển thị đến</label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-700"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Trạng thái</label>
                                <select
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-700"
                                >
                                    <option value="active">Hoạt động</option>
                                    <option value="inactive">Tắt</option>
                                    <option value="scheduled">Lên lịch</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Mô tả</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-slate-700 resize-none"
                                    placeholder="Mô tả ngắn..."
                                />
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-50">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-6 py-3.5 rounded-xl text-slate-500 font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors text-sm"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3.5 rounded-xl bg-blue-600 text-white font-bold uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 text-sm"
                                >
                                    {editingBanner ? 'Cập nhật' : 'Tạo banner'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
