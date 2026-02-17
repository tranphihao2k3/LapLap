
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
        <div className="space-y-6">
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý Linh kiện & Phụ kiện</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Plus size={20} /> Thêm mới
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg w-full md:w-auto">
                    <Search size={18} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="bg-transparent outline-none text-sm w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                    {['ALL', 'RAM', 'SSD', 'MOUSE', 'KEYBOARD', 'OTHER'].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filterType === type
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {type === 'ALL' ? 'Tất cả' : type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Sản phẩm</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Loại</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Thông số</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Giá bán</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Tồn kho</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Trạng thái</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">Đang tải dữ liệu...</td>
                                </tr>
                            ) : filteredComponents.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">Không có dữ liệu</td>
                                </tr>
                            ) : (
                                filteredComponents.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <>
                                                            {item.type === 'RAM' && <Cpu className="w-6 h-6 text-gray-400" />}
                                                            {item.type === 'SSD' && <HardDrive className="w-6 h-6 text-gray-400" />}
                                                            {item.type === 'MOUSE' && <Mouse className="w-6 h-6 text-gray-400" />}
                                                            {item.type === 'KEYBOARD' && <Keyboard className="w-6 h-6 text-gray-400" />}
                                                            {(item.type === 'OTHER' || !['RAM', 'SSD', 'MOUSE', 'KEYBOARD'].includes(item.type)) && <Package className="w-6 h-6 text-gray-400" />}
                                                        </>
                                                    )}
                                                </div>
                                                <span className="font-medium text-gray-900 line-clamp-2">{item.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${item.type === 'RAM' ? 'bg-blue-100 text-blue-700' :
                                                item.type === 'SSD' ? 'bg-purple-100 text-purple-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {item.type === 'RAM' && (
                                                <div className="flex flex-col">
                                                    <span>{item.specs.capacity}</span>
                                                    <span className="text-xs text-gray-500">{item.specs.ramType} - {item.specs.bus}</span>
                                                </div>
                                            )}
                                            {item.type === 'SSD' && (
                                                <div className="flex flex-col">
                                                    <span>{item.specs.capacity}</span>
                                                    <span className="text-xs text-gray-500">{item.specs.ssdType}</span>
                                                </div>
                                            )}
                                            {!['RAM', 'SSD'].includes(item.type) && (
                                                <span className="text-gray-400 italic">--</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {item.price.toLocaleString()}đ
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {item.stock}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.active ? (
                                                <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                                                    <CheckCircle size={14} /> Hoạt động
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-red-600 text-xs font-medium">
                                                    <XCircle size={14} /> Ẩn
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(item)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-gray-800">
                                {editingComponent ? 'Cập nhật linh kiện' : 'Thêm linh kiện mới'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                                <span className="text-2xl">&times;</span>
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên sản phẩm *</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-blue-500 transition-colors"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Ví dụ: RAM Laptop Kingston 8GB DDR4 3200MHz"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Loại linh kiện *</label>
                                    <select
                                        className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-blue-500 bg-white"
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
                                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
                                        <div className="md:col-span-3 pb-2 border-b border-blue-100 mb-2">
                                            <h4 className="font-bold text-blue-800 text-sm">Thông số kỹ thuật RAM</h4>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Dung lượng</label>
                                            <select
                                                className="w-full p-2 rounded border border-gray-200 text-sm"
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
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Loại RAM</label>
                                            <select
                                                className="w-full p-2 rounded border border-gray-200 text-sm"
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
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Bus RAM</label>
                                            <select
                                                className="w-full p-2 rounded border border-gray-200 text-sm"
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
                                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 bg-purple-50 p-4 rounded-xl border border-purple-100">
                                        <div className="md:col-span-2 pb-2 border-b border-purple-100 mb-2">
                                            <h4 className="font-bold text-purple-800 text-sm">Thông số kỹ thuật SSD</h4>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Dung lượng</label>
                                            <select
                                                className="w-full p-2 rounded border border-gray-200 text-sm"
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
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Chuẩn kết nối</label>
                                            <select
                                                className="w-full p-2 rounded border border-gray-200 text-sm"
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng tồn kho</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-blue-500 transition-colors"
                                        value={formData.stock}
                                        onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Link Ảnh (URL)</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-blue-500 transition-colors"
                                        value={formData.image}
                                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả thêm</label>
                                    <textarea
                                        rows={3}
                                        className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-blue-500 transition-colors"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>

                                <div className="md:col-span-2 flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="active"
                                        checked={formData.active}
                                        onChange={e => setFormData({ ...formData, active: e.target.checked })}
                                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="active" className="text-gray-700">Đang kinh doanh (Hiển thị lên web)</label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-6 py-2 rounded-lg text-gray-600 font-medium hover:bg-gray-100 transition-colors"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
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
