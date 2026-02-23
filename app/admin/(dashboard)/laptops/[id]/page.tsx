'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { X, Loader2 } from 'lucide-react';
import SearchableSelect from '../SearchableSelect';
import PriceInput from '../PriceInput';
import Toast from '@/components/admin/Toast';
import ImageUploader from '@/components/admin/ImageUploader';
import QuickFillTextarea from '@/components/admin/QuickFillTextarea';
import { COMMON_CPUS, COMMON_GPUS, COMMON_RAM_SIZES, COMMON_SSD_SIZES, COMMON_SCREENS, COMMON_BATTERIES, COMMON_HZ, COMMON_RESOLUTIONS } from '../commonSpecs';

interface Category {
    _id: string;
    name: string;
}

interface Brand {
    _id: string;
    name: string;
}

export default function LaptopFormPage() {
    const router = useRouter();
    const params = useParams();
    const isNew = params.id === 'new';

    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(!isNew); // If not new, we need to load laptop data
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        model: '',
        categoryId: '',
        brandId: '',
        price: 9900000,
        image: '',
        images: [''],
        gift: 'Túi chống sốc, Chuột không dây',
        description: '',
        warrantyMonths: 12,
        specs: {
            cpu: '',
            gpu: '',
            ram: '',
            ssd: '',
            screen: '',
            hz: '',
            resolution: '',
            battery: '',
        },
        warranty: {
            duration: '12 tháng',
            items: ['Bảo hành 12 tháng chính hãng', 'Hỗ trợ kỹ thuật trọn đời', 'Đổi mới trong 7 ngày đầu'],
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
        const fetchInitialData = async () => {
            try {
                const [categoriesRes, brandsRes] = await Promise.all([
                    fetch('/api/admin/categories'),
                    fetch('/api/admin/brands')
                ]);
                const categoriesData = await categoriesRes.json();
                const brandsData = await brandsRes.json();

                if (categoriesData.success) setCategories(categoriesData.data);
                if (brandsData.success) setBrands(brandsData.data);

                if (!isNew) {
                    const laptopRes = await fetch(`/api/admin/laptops/${params.id}`);
                    const laptopData = await laptopRes.json();

                    if (laptopData.success) {
                        const laptop = laptopData.data;
                        setFormData({
                            name: laptop.name,
                            model: laptop.model,
                            categoryId: laptop.categoryId?._id || laptop.categoryId,
                            brandId: laptop.brandId?._id || laptop.brandId,
                            price: laptop.price,
                            image: laptop.image || '',
                            images: laptop.images?.length > 0 ? laptop.images : [''],
                            gift: laptop.gift || '',
                            description: laptop.description || '',
                            warrantyMonths: laptop.warrantyMonths || 12,
                            specs: {
                                cpu: laptop.specs?.cpu || '',
                                gpu: laptop.specs?.gpu || '',
                                ram: laptop.specs?.ram || '',
                                ssd: laptop.specs?.ssd || '',
                                screen: laptop.specs?.screen || '',
                                hz: laptop.specs?.hz || '',
                                resolution: laptop.specs?.resolution || '',
                                battery: laptop.specs?.battery || '',
                            },
                            warranty: laptop.warranty || { duration: '12 tháng', items: [''] },
                            status: laptop.status || 'active',
                        });
                    } else {
                        showToast('Không tìm thấy laptop', 'error');
                        setTimeout(() => router.push('/admin/laptops'), 2000);
                    }
                }
            } catch (error) {
                console.error('Error loading data:', error);
                showToast('Lỗi tải dữ liệu', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [isNew, params.id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const cleanedData = {
            ...formData,
            images: formData.images.filter(img => img.trim() !== ''),
            warranty: {
                ...formData.warranty,
                items: formData.warranty.items.filter(item => item.trim() !== '').map(item => {
                    if (item.includes('Bảo hành') && item.includes('tháng') && item.includes('chính hãng')) {
                        return item.replace(/Bảo hành \d+ tháng/, `Bảo hành ${formData.warrantyMonths} tháng`);
                    }
                    return item;
                }),
            },
        };

        try {
            const url = isNew
                ? '/api/admin/laptops'
                : `/api/admin/laptops/${params.id}`;

            const method = isNew ? 'POST' : 'PUT';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cleanedData),
            });

            const data = await res.json();

            if (data.success) {
                showToast(isNew ? 'Thêm mới thành công!' : 'Cập nhật thành công!', 'success');
                setTimeout(() => {
                    router.push('/admin/laptops');
                }, 1000);
            } else {
                showToast('Lỗi: ' + data.error, 'error');
                setSubmitting(false);
            }
        } catch (error) {
            console.error('Error saving laptop:', error);
            showToast('Lỗi khi lưu sản phẩm', 'error');
            setSubmitting(false);
        }
    };

    const handleAIParse = (parsedData: any) => {
        setFormData(prev => ({
            ...prev,
            name: parsedData.name || prev.name,
            model: parsedData.model || prev.model,
            brandId: parsedData.brandId || (parsedData.brand ? brands.find(b => b.name.toLowerCase() === parsedData.brand.toLowerCase())?._id || prev.brandId : prev.brandId),
            categoryId: parsedData.categoryId || prev.categoryId,
            price: parsedData.price || prev.price,
            warrantyMonths: parsedData.warrantyMonths || prev.warrantyMonths,
            gift: parsedData.gift || prev.gift,
            description: parsedData.description || prev.description,
            specs: {
                cpu: parsedData.cpu || prev.specs.cpu,
                gpu: parsedData.gpu || prev.specs.gpu,
                ram: parsedData.ram || prev.specs.ram,
                ssd: parsedData.ssd || prev.specs.ssd,
                screen: parsedData.screen || prev.specs.screen,
                hz: parsedData.hz || prev.specs.hz,
                resolution: parsedData.resolution || prev.specs.resolution,
                battery: parsedData.battery || prev.specs.battery,
            }
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12 h-[calc(100vh-100px)]">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pb-10">
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />

            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800">
                    {isNew ? 'Thêm Laptop Mới' : 'Chỉnh Sửa Laptop'}
                </h1>
                <button
                    type="button"
                    onClick={() => router.push('/admin/laptops')}
                    className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                >
                    <X size={20} />
                </button>
            </div>

            <form id="laptop-form" onSubmit={handleSubmit} className="space-y-6">
                {/* AI Quick Fill */}
                {isNew && (
                    <QuickFillTextarea onParsed={handleAIParse} />
                )}

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Thông tin cơ bản</h2>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tên sản phẩm *</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Model Mạch (Mã) *</label>
                            <input
                                type="text"
                                required
                                value={formData.model}
                                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Loại (Category) *</label>
                            <select
                                required
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Chọn nhu cầu</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Hãng (Brand) *</label>
                            <select
                                required
                                value={formData.brandId}
                                onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Chọn hãng</option>
                                {brands.map((brand) => (
                                    <option key={brand._id} value={brand._id}>{brand.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Giá & Hình ảnh</h2>
                    <div className="grid grid-cols-1 mb-6">
                        <PriceInput
                            value={formData.price}
                            onChange={(value) => setFormData({ ...formData, price: value })}
                            label="Giá bán (VNĐ) *"
                            placeholder="Ví dụ: 9900 = 9.900.000đ"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh sản phẩm</label>
                        <ImageUploader
                            value={formData.images.filter(img => img.trim() !== '')}
                            onChange={(urls) => setFormData({ ...formData, images: urls.length > 0 ? urls : [''] })}
                            maxImages={5}
                        />
                        <p className="text-xs text-gray-500 mt-2">Kéo thả hoặc click để chọn ảnh. Ảnh đầu tiên sẽ là avatar gốc.</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Cấu hình máy tính (Specs)</h2>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
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
                                label="GPU (Card đồ họa)"
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
                                label="Ổ cứng (SSD/HDD)"
                                value={formData.specs.ssd}
                                onChange={(value) => setFormData({ ...formData, specs: { ...formData.specs, ssd: value } })}
                                options={COMMON_SSD_SIZES}
                                placeholder="Chọn kiểu SSD..."
                            />
                        </div>
                        <div>
                            <SearchableSelect
                                label="Kích thước màn hình"
                                value={formData.specs.screen}
                                onChange={(value) => setFormData({ ...formData, specs: { ...formData.specs, screen: value } })}
                                options={COMMON_SCREENS}
                                placeholder="Chọn Screen..."
                            />
                        </div>
                        <div>
                            <SearchableSelect
                                label="Độ phân giải"
                                value={formData.specs.resolution}
                                onChange={(value) => setFormData({ ...formData, specs: { ...formData.specs, resolution: value } })}
                                options={COMMON_RESOLUTIONS}
                                placeholder="Ví dụ: FHD, 2K..."
                            />
                        </div>
                        <div>
                            <SearchableSelect
                                label="Tần số quét (Hz)"
                                value={formData.specs.hz}
                                onChange={(value) => setFormData({ ...formData, specs: { ...formData.specs, hz: value } })}
                                options={COMMON_HZ}
                                placeholder="Ví dụ: 60Hz..."
                            />
                        </div>
                        <div>
                            <SearchableSelect
                                label="Pin (Battery)"
                                value={formData.specs.battery}
                                onChange={(value) => setFormData({ ...formData, specs: { ...formData.specs, battery: value } })}
                                options={COMMON_BATTERIES}
                                placeholder="Ví dụ: 3-Cell, 42Whr"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Ưu đãi & Chính sách</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả thông tin sản phẩm (Nhỏ gọn hiển thị ở danh sách)</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={2}
                                placeholder="Nhập thêm vài mô tả hấp dẫn..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Quà tặng ưu đãi lúc mua</label>
                            <textarea
                                value={formData.gift}
                                onChange={(e) => setFormData({ ...formData, gift: e.target.value })}
                                rows={3}
                                placeholder="Túi đựng, Balo, hay các dịch vụ đính kèm..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian Bảo hành (Theo Tháng)</label>
                                <select
                                    value={formData.warrantyMonths}
                                    onChange={(e) => setFormData({ ...formData, warrantyMonths: Number(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value={1}>1 tháng</option>
                                    <option value={3}>3 tháng</option>
                                    <option value={6}>6 tháng</option>
                                    <option value={12}>12 tháng</option>
                                    <option value={24}>24 tháng</option>
                                    <option value={36}>36 tháng</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái công khai web</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="active">Đang bán (Active)</option>
                                    <option value="inactive">Tạm ẩn (Inactive)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 sticky bottom-0 bg-white/50 backdrop-blur-md p-4 rounded-xl border border-blue-100 mt-6 shadow-xl z-10 w-full mb-10">
                    <button
                        type="button"
                        onClick={() => router.push('/admin/laptops')}
                        className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        Hủy thoát
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 px-4 py-3 bg-[#004e9a] text-white font-bold rounded-lg hover:bg-[#003b78] transition-colors flex items-center justify-center disabled:opacity-70"
                    >
                        {submitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                        {isNew ? 'THÊM SẢN PHẨM LAPTOP' : 'LƯU CHỈNH SỬA LAPTOP'}
                    </button>
                </div>
            </form>
        </div>
    );
}
