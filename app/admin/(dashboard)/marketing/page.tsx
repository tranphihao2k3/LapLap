'use client';

import { useState, useEffect } from 'react';
import { Share2, Copy, ExternalLink, CheckCircle, Plus, Trash2, Search, Rocket, Link as LinkIcon, Facebook, Sparkles, RefreshCw } from 'lucide-react';

import Button from '@/components/ui/Button';
import Image from 'next/image';
import { toast } from 'react-hot-toast';


const PLACEHOLDER_IMAGE = 'https://res.cloudinary.com/defhezuhn/image/upload/v1705664165/placeholder-laptop.png';

interface Product {
    _id: string;
    name: string;
    price: number;
    image?: string;
    images?: string[];
    slug: string;
    specs: {
        cpu: string;
        gpu?: string;
        ram: string;
        ssd: string;
        screen: string;
        resolution?: string;
        hz?: string;
    };
}

interface Group {
    _id: string;
    name: string;
    url: string;
    order?: number;
    isActive?: boolean;
}

export default function MarketingPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [groups, setGroups] = useState<Group[]>([]);
    const [newGroupUrl, setNewGroupUrl] = useState('');
    const [postContent, setPostContent] = useState('');
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [genType, setGenType] = useState('standard'); // 'standard' or 'ai'

    const [isGeneratingAI, setIsGeneratingAI] = useState(false);

    const generateWithAI = async (style: string) => {
        if (!selectedProduct) {
            toast.error("Vui lòng chọn sản phẩm trước!");
            return;
        }

        setIsGeneratingAI(true);
        try {
            const res = await fetch('/api/marketing/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product: selectedProduct, style })
            });

            const data = await res.json();
            if (data.success) {
                setPostContent(data.data);
                toast.success("✨ AI đã tạo xong nội dung!");
            } else {
                toast.error(data.message || "Lỗi khi gọi AI");
            }
        } catch (error) {
            console.error(error);
            toast.error("Không thể kết nối tới AI");
        } finally {
            setIsGeneratingAI(false);
        }
    };

    // Posting Queue State
    const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
    const [autoCopy, setAutoCopy] = useState(true);

    useEffect(() => {
        fetchProducts();
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const res = await fetch('/api/admin/facebook-groups');
            const data = await res.json();
            if (data.success) {
                setGroups(data.data);
            }
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    };

    useEffect(() => {
        if (selectedProduct && genType === 'standard') {
            generateContent(selectedProduct);
        }
    }, [selectedProduct, genType]);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products'); // Use public API for now as it's simpler
            const data = await res.json();
            if (data.success) {
                setProducts(data.data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const generateContent = (product: Product, templateType = 'default') => {
        const link = `https://laplapcantho.store/laptops/${product.slug || product._id}`;
        const price = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price);
        const originalPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price * 1.15);
        const nameUpper = product.name.toUpperCase();

        // Helper block for specs
        const cpuSpec = product.specs.cpu || 'Cực mạnh, cân mọi tác vụ';
        const ramSpec = product.specs.ram || '8GB/16GB đa nhiệm mượt mà';
        const ssdSpec = product.specs.ssd || 'Tốc độ cao, khởi động 5s';

        const resolutionPart = product.specs.resolution ? ` - ${product.specs.resolution}` : '';
        const hzPart = product.specs.hz ? ` - ${product.specs.hz}` : '';
        const screenSpec = `${product.specs.screen || 'Full HD/IPS sắc nét'}${resolutionPart}${hzPart}`;

        let content = '';
        let finalTemplateType = templateType;

        if (finalTemplateType === 'default') {
            const nameLower = product.name.toLowerCase();
            const gpuLower = (product.specs.gpu || '').toLowerCase();
            const cpuLower = (product.specs.cpu || '').toLowerCase();

            const isGaming = ['gaming', 'legion', 'nitro', 'victus', 'tuf', 'rog', 'alienware', 'predator'].some(kw => nameLower.includes(kw)) ||
                ['rtx', 'gtx', 'radeon rx'].some(kw => gpuLower.includes(kw));

            const isGraphics = ['precision', 'zbook', 'thinkpad p', 'studio', 'creator'].some(kw => nameLower.includes(kw)) ||
                ['quadro', 'rtx a', 'pro'].some(kw => gpuLower.includes(kw));

            if (isGaming) {
                finalTemplateType = 'gaming';
            } else if (isGraphics) {
                finalTemplateType = 'graphics';
            } else {
                finalTemplateType = 'office';
            }
        }

        if (finalTemplateType === 'gaming') {
            content = `� SIÊU PHẨM GAMING ĐỔ BỘ - CHIẾN GAME XUYÊN MÀN ĐÊM 🔥
🎮 Mẫu máy: ${nameUpper}
💰 Rước ngay chỉ: ${price} (Tiết kiệm ngay hàng triệu đồng so với giá cũ ${originalPrice}!)

-------------------------------------------
💥 Cấu hình "QUÁI VẬT" thách thức mọi tựa game AAA:
✅ CPU: ${cpuSpec}
✅ RAM: ${ramSpec} (Thoải mái leo rank không giật lag)
✅ Ổ CỨNG: ${ssdSpec} (Load game chớp mắt)
✅ Màn hình: ${screenSpec} (Tần số quét cao, bắt chọn khoảnh khắc)

🎁 QUÀ TẶNG "TẬN RĂNG" KHI MUA TẠI LAPLAP CẦN THƠ:
🎒 Balo Gaming, Chuột xịn, Lót chuột bao la.
⚙️ Hỗ trợ cài trọn bộ Game HOT & phần mềm FREE 100%.
🚚 Giao máy hỏa tốc - Trả góp 0% duyệt 10 phút!

🎯 GẶP LÀ CHỐT - CLICK XEM ẢNH THỰC TẾ:
👉 Chi tiết tại: ${link}

-------------------------------------------
🏘️ Địa chỉ: Hưng Lợi, Ninh Kiều, Cần Thơ.
☎️ Hotline ép giá: 0978.648.720 (Hào)
#LaptopCanTho #LaptopGamingCanTho #LapLapCanTho`;
        } else if (finalTemplateType === 'office') {
            content = `✨ [XẢ KHO GIÁ SỐC] - LAPTOP VĂN PHÒNG / SINH VIÊN SIÊU LƯỚT ✨
💼 Thuận tiện mang đi học, đi làm - Thiết kế mỏng nhẹ sang trọng!
🏷️ Mã máy: ${nameUpper}
💥 Giá sinh viên: ${price} (Thị trường đang bán ${originalPrice})

-------------------------------------------
🚀 Máy chạy mượt mà, cấu hình vượt tầm giá:
✅ CPU: ${cpuSpec}
✅ RAM: ${ramSpec} (Mở 20 tab Chrome vô tư)
✅ SSD: ${ssdSpec} (Lưu trữ bét nhè tài liệu)
✅ Màn hình: ${screenSpec} (Bảo vệ mắt cực tốt)

🎁 ĐẶC QUYỀN SINH VIÊN CHI CÓ TẠI LAPLAP CẦN THƠ:
🎉 Tặng Full Combo: Balo, Chuột không dây, Lót chuột, Túi chống sốc
⚙️ Cài đặt Win, Word, Excel, PowerPoint Miễn Phí Trọn Đời.
🚚 Ship tận cửa hàng - Lên hồ sơ trả góp duyệt nhanh 10p.

⚡ CHỈ CÒN ĐÚNG VÀI MÁY - NHANH TAY NHÉ:
👉 Xem chi tiết & chốt ngay: ${link}

-------------------------------------------
🏘️ Địa chỉ: Hưng Lợi, Ninh Kiều, Cần Thơ.
☎️ Gọi ngay kẻo lỡ: 0978.648.720 (Hào)
#LaptopSinhVien #LaptopVanPhongGiaRe #LaptopCanTho #LapLapCanTho`;
        } else if (finalTemplateType === 'graphics') {
            content = `🎨 CỖ MÁY ĐỒ HỌA CHUYÊN NGHIỆP - RENDER ĐẮP VỠ MỌI DEADLINE 🎨
🔥 Tên máy: ${nameUpper} 
💸 Giá ưu đãi cực tốt: ${price} (Tiết kiệm đáng kể so với máy mới ${originalPrice})

-------------------------------------------
💪 Cấu hình làm Đồ họa / Kỹ thuật chân ái:
✅ CPU: ${cpuSpec} (Hiệu suất đa nhân cực khỏe)
✅ RAM: ${ramSpec} (Preview mượt mà không delay)
✅ SSD: ${ssdSpec} (Lưu xuất file nặng phút mốt)
✅ Màn hình: ${screenSpec} (Chuẩn màu, không sai lệch thiết kế)

🎁 ĐÃ MUA LÀ PHẢI CÓ QUÀ TẠI LAPLAP CẦN THƠ:
🎒 Balo xịn, Chuột phím, Lót chuột
⚙️ Cài đặt Photoshop, AI, Premiere, AutoCAD... FREE vĩnh viễn!
🚚 Giao hàng tận nơi - Quẹt thẻ / Trả góp tẹt ga.

⚡ THÊM NGAY CON QUÁI VẬT NÀY VÀO GÓC LÀM VIỆC:
👉 Link ngắm nghía: ${link}

-------------------------------------------
🏘️ Địa chỉ: Hưng Lợi, Ninh Kiều, Cần Thơ.
☎️ Alo tư vấn: 0978.648.720 (Hào)
#LaptopDoHoa #LaptopThietKeCanTho #LapLapCanTho`;
        } else {
            content = `🌟 [XẢ KHO GIÁ SỐC] - ${nameUpper} 🌟
💥 Giá hôm nay: ${price} (Tiết kiệm ngay hàng triệu đồng!)
📉 Giá thị trường: ${originalPrice}

-------------------------------------------
💪 Cấu hình "QUÁI VẬT" trong tầm giá:
✅ CPU: ${cpuSpec}
✅ RAM: ${ramSpec}
✅ SSD: ${ssdSpec}
✅ Màn hình: ${screenSpec}

🎁 ƯU ĐÃI ĐỘC QUYỀN CHỈ CÓ TẠI LAPLAP CẦN THƠ:
🎉 Combo quà: Balo, Chuột, Lót chuột, Túi chống sốc...
⚙️ Hỗ trợ cài đặt phần mềm & vệ sinh máy TRỌN ĐỜI.
🚚 Ship COD toàn quốc - Kiểm tra hàng mới thanh toán.
💳 Trả góp 0% - Duyệt hồ sơ chỉ trong 10 phút.

🚨 SỐ LƯỢNG CÓ HẠN - CHỐT ĐƠN NGAY TẠI:
👉 Click xem ảnh & đặt hàng: ${link}
👉 Xem thêm quà tặng tại: ${link}

-------------------------------------------
🏘️ Địa chỉ: Hưng Lợi, Ninh Kiều, Cần Thơ.
☎️ Hotline/Zalo: 0978.648.720 (Hào)
#LaptopCanTho #LaptopGiaRe #LapLapCanTho #${product.name.replace(/\s+/g, '')}`;
        }

        setPostContent(content);
    };

    const copyLinkOnly = () => {
        if (!selectedProduct) return;
        const link = `https://laplapcantho.store/laptops/${selectedProduct.slug || selectedProduct._id}`;
        navigator.clipboard.writeText(link);
        toast.success("🔗 Đã copy link sản phẩm!");
    };

    const handleAddGroup = async () => {
        if (!newGroupUrl) {
            toast.error("Vui lòng nhập link nhóm Facebook!");
            return;
        }

        // Simple extraction of group name from URL
        let name = 'Facebook Group';

        try {
            const urlObj = new URL(newGroupUrl);
            const pathParts = urlObj.pathname.split('/').filter(p => p);
            if (pathParts.length > 0) {
                const groupIndex = pathParts.indexOf('groups');
                if (groupIndex !== -1 && pathParts[groupIndex + 1]) {
                    const groupPart = pathParts[groupIndex + 1];
                    name = groupPart.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                }
            }
        } catch (e) {
            // Invalid URL
        }

        try {
            const res = await fetch('/api/admin/facebook-groups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, url: newGroupUrl }),
            });

            const data = await res.json();
            if (data.success) {
                setNewGroupUrl('');
                fetchGroups();
                toast.success("Đã thêm nhóm mới!");
            } else {
                toast.error(data.error || "Không thể thêm nhóm!");
            }
        } catch (error) {
            console.error('Error adding group:', error);
            toast.error("Lỗi khi thêm nhóm!");
        }
    };

    const handleRemoveGroup = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa nhóm này?')) return;

        try {
            const res = await fetch(`/api/admin/facebook-groups/${id}`, {
                method: 'DELETE',
            });

            const data = await res.json();
            if (data.success) {
                fetchGroups();
                // Adjust index if needed
                if (currentGroupIndex >= groups.length - 1) {
                    setCurrentGroupIndex(Math.max(0, groups.length - 2));
                }
                toast.success("Đã xóa nhóm!");
            } else {
                toast.error(data.error || "Không thể xóa nhóm!");
            }
        } catch (error) {
            console.error('Error removing group:', error);
            toast.error("Lỗi khi xóa nhóm!");
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(postContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("✅ Đã sao chép nội dung!");
    };

    const openNextGroup = () => {
        if (groups.length === 0) {
            toast.error("Chưa có nhóm nào trong danh sách!");
            return;
        }

        // Auto copy content if enabled
        if (autoCopy && postContent) {
            copyToClipboard();
        }

        const group = groups[currentGroupIndex];
        window.open(group.url, '_blank');

        // Cycle to next group
        const nextIndex = (currentGroupIndex + 1) % groups.length;
        setCurrentGroupIndex(nextIndex);

        if (nextIndex === 0) {
            toast.success("🎉 Đã đi hết danh sách! Quay lại nhóm đầu tiên.");
        } else {
            toast(`Đã mở ${group.name}. Nhóm tiếp theo: ${groups[nextIndex].name}`, { icon: '👉' });
        }
    };

    const resetProgress = () => {
        setCurrentGroupIndex(0);
        toast.success("Đã đặt lại tiến trình về nhóm đầu tiên.");
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 lg:px-8 bg-[#F8FAFC] min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Rocket className="text-blue-600 w-8 h-8 md:w-10 md:h-10 animate-bounce" />
                        Trợ lý Marketing
                    </h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">Tự động hóa đăng bài và share tin lên các hội nhóm Facebook</p>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                    <Facebook className="text-blue-600 w-5 h-5" />
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Post Assistant v2.0</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                {/* Product Selection Column */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                        <h2 className="font-black text-slate-800 text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
                            Chọn sản phẩm
                        </h2>

                        <div className="relative mb-6">
                            <input
                                type="text"
                                placeholder="Tên sản phẩm..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-sm"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        </div>

                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 no-scrollbar lg:custom-scrollbar">
                            {filteredProducts.map(product => (
                                <div
                                    key={product._id}
                                    onClick={() => setSelectedProduct(product)}
                                    className={`p-4 rounded-2xl border transition-all cursor-pointer group flex items-center gap-4 active:scale-95 ${selectedProduct?._id === product._id
                                        ? 'border-blue-600 bg-blue-50/50 shadow-md shadow-blue-100'
                                        : 'border-slate-50 hover:bg-slate-50'
                                        }`}
                                >
                                    <div className="w-14 h-14 relative flex-shrink-0 bg-white rounded-xl border border-slate-100 p-1 shadow-sm overflow-hidden transition-transform group-hover:scale-105">
                                        <Image
                                            src={
                                                (product.image && product.image.trim() !== '')
                                                    ? product.image
                                                    : (product.images && product.images.length > 0 && product.images[0] && product.images[0].trim() !== '')
                                                        ? product.images[0]
                                                        : PLACEHOLDER_IMAGE
                                            }
                                            alt={product.name}
                                            fill
                                            className="object-contain"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                if (target.src !== PLACEHOLDER_IMAGE) {
                                                    target.src = PLACEHOLDER_IMAGE;
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className={`font-black text-sm uppercase tracking-tight truncate ${selectedProduct?._id === product._id ? 'text-blue-700' : 'text-slate-800'}`}>
                                            {product.name}
                                        </div>
                                        <div className="text-xs font-black text-rose-600 mt-0.5">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content & Queue Column */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Content Editor */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6">
                            <h2 className="font-black text-slate-800 text-sm uppercase tracking-widest flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">2</span>
                                Nội dung bài đăng
                            </h2>
                            <div className="flex bg-slate-50 p-1.5 rounded-2xl w-full sm:w-auto">
                                <button
                                    onClick={() => setGenType('standard')}
                                    className={`flex-1 sm:flex-none px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${genType === 'standard' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Mặc định
                                </button>
                                <button
                                    onClick={() => setGenType('ai')}
                                    className={`flex-1 sm:flex-none px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${genType === 'ai' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <Sparkles size={14} className={genType === 'ai' ? 'text-purple-500 animate-pulse' : ''} />
                                    Sáng tạo AI
                                </button>
                            </div>
                        </div>

                        {genType === 'ai' && (
                            <div className="mb-6 flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-4 duration-500">
                                <button
                                    disabled={isGeneratingAI || !selectedProduct}
                                    onClick={() => generateWithAI('persuasive')}
                                    className="px-4 py-2.5 bg-purple-50 text-purple-700 border border-purple-100 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-purple-100 disabled:opacity-50 transition-all active:scale-95"
                                >
                                    Thuyết phục ✨
                                </button>
                                <button
                                    disabled={isGeneratingAI || !selectedProduct}
                                    onClick={() => generateWithAI('urgency')}
                                    className="px-4 py-2.5 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-rose-100 disabled:opacity-50 transition-all active:scale-95"
                                >
                                    Hối thúc 🔥
                                </button>
                                <button
                                    disabled={isGeneratingAI || !selectedProduct}
                                    onClick={() => generateWithAI('technical')}
                                    className="px-4 py-2.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-100 disabled:opacity-50 transition-all active:scale-95"
                                >
                                    Kỹ thuật 💻
                                </button>
                                {isGeneratingAI && (
                                    <div className="flex items-center gap-2 text-[10px] font-black text-purple-600 uppercase tracking-widest ml-auto animate-pulse">
                                        <RefreshCw size={14} className="animate-spin" />
                                        AI đang suy nghĩ...
                                    </div>
                                )}
                            </div>
                        )}

                        {genType === 'standard' && (
                            <div className="mb-6 flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-4 duration-500">
                                <button
                                    disabled={!selectedProduct}
                                    onClick={() => generateContent(selectedProduct!, 'office')}
                                    className="px-4 py-2.5 bg-sky-50 text-sky-700 border border-sky-100 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-sky-100 disabled:opacity-50 transition-all active:scale-95"
                                >
                                    Văn phòng / Sinh viên 💼
                                </button>
                                <button
                                    disabled={!selectedProduct}
                                    onClick={() => generateContent(selectedProduct!, 'gaming')}
                                    className="px-4 py-2.5 bg-red-50 text-red-700 border border-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-red-100 disabled:opacity-50 transition-all active:scale-95"
                                >
                                    Gaming 🔥
                                </button>
                                <button
                                    disabled={!selectedProduct}
                                    onClick={() => generateContent(selectedProduct!, 'graphics')}
                                    className="px-4 py-2.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-100 disabled:opacity-50 transition-all active:scale-95"
                                >
                                    Đồ họa 🎨
                                </button>
                            </div>
                        )}

                        <div className="relative group/textarea">
                            <textarea
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                                className="w-full h-80 p-6 bg-slate-50 border border-slate-100 rounded-3xl font-medium text-sm text-slate-700 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none shadow-inner"
                                placeholder="Chọn sản phẩm để bắt đầu tạo nội dung..."
                            />
                            <div className="flex gap-2 absolute top-4 right-4">
                                <button
                                    onClick={copyLinkOnly}
                                    className="p-2.5 bg-white/90 backdrop-blur rounded-xl border border-slate-200 shadow-lg hover:shadow-xl transition-all active:scale-90 text-slate-600 flex items-center gap-2 px-4"
                                    title="Copy Link"
                                >
                                    <LinkIcon size={16} />
                                    <span className="text-[10px] font-black uppercase">Link</span>
                                </button>
                                <button
                                    onClick={copyToClipboard}
                                    className="p-2.5 bg-white/90 backdrop-blur rounded-xl border border-slate-200 shadow-lg hover:shadow-xl transition-all active:scale-90 text-blue-600 flex items-center gap-2 px-4"
                                    title="Copy Nội dung"
                                >
                                    {copied ? <CheckCircle size={16} className="text-emerald-500" /> : <Copy size={16} />}
                                    <span className="text-[10px] font-black uppercase">{copied ? 'Xong' : 'Copy'}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Group Management */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
                        <h2 className="font-black text-slate-800 text-sm uppercase tracking-widest mb-8 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">3</span>
                            Quản lý hội nhóm
                        </h2>

                        <div className="flex gap-3 mb-8">
                            <input
                                type="text"
                                value={newGroupUrl}
                                onChange={(e) => setNewGroupUrl(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddGroup()}
                                placeholder="Dán link nhóm Facebook..."
                                className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-sm"
                            />
                            <button
                                onClick={handleAddGroup}
                                className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200 hover:shadow-blue-300"
                            >
                                Thêm
                            </button>
                        </div>

                        <div className="bg-slate-50 rounded-3xl p-4 lg:p-6 mb-10 max-h-80 overflow-y-auto no-scrollbar lg:custom-scrollbar border border-slate-100 shadow-inner">
                            {groups.length === 0 ? (
                                <div className="text-center text-slate-400 font-bold py-10 uppercase text-[10px] tracking-widest italic">Chưa có nhóm nào trong danh sách.</div>
                            ) : (
                                <div className="space-y-3">
                                    {groups.map((group, index) => {
                                        const isNext = index === currentGroupIndex;
                                        return (
                                            <div key={group._id} className={`flex items-center justify-between p-4 rounded-2xl transition-all ${isNext ? 'bg-white border-2 border-blue-600 shadow-xl shadow-blue-100 -translate-y-1' : 'bg-white border border-slate-200 hover:border-slate-300'}`}>
                                                <div className="flex items-center gap-4 min-w-0 flex-1">
                                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-black text-xs transition-colors ${isNext ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-blue-100 text-blue-600'}`}>
                                                        {index + 1}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className={`font-black text-xs uppercase tracking-tight truncate ${isNext ? 'text-slate-900' : 'text-slate-700'}`}>{group.name}</div>
                                                        <div className="text-[10px] text-slate-500 truncate mt-0.5">{group.url}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {isNext && (
                                                        <button
                                                            onClick={openNextGroup}
                                                            disabled={!postContent}
                                                            className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all active:scale-95 shadow-md shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            Tiếp theo
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleRemoveGroup(group._id)}
                                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Control Panel */}
                        <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl shadow-blue-200 relative overflow-hidden group/control">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl transition-all group-hover/control:bg-white/20"></div>

                            <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6 relative z-10">
                                <div className="text-center md:text-left">
                                    <h3 className="font-black text-xl md:text-2xl tracking-tight flex items-center justify-center md:justify-start gap-3">
                                        Hệ thống Queue Posting
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></div>
                                            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-100">Online</span>
                                        </div>
                                    </h3>
                                    <p className="text-white/90 text-sm mt-2 font-medium">Bấm mở nhóm &rarr; Ctrl+V &rarr; Đăng bài &rarr; Quay lại đây</p>
                                </div>
                                <button
                                    onClick={() => setAutoCopy(!autoCopy)}
                                    className={`flex items-center gap-3 px-5 py-3 rounded-2xl backdrop-blur-md border transition-all ${autoCopy
                                        ? 'bg-white/30 border-white/40 text-white shadow-lg shadow-white/20'
                                        : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/15'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${autoCopy
                                        ? 'bg-white border-white'
                                        : 'bg-transparent border-white/50'
                                        }`}>
                                        {autoCopy && (
                                            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                        )}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Tự động Copy</span>
                                </button>
                            </div>

                            <div className="flex flex-col gap-6 relative z-10">
                                <button
                                    onClick={openNextGroup}
                                    disabled={groups.length === 0 || !postContent}
                                    className="w-full py-6 md:py-8 rounded-3xl bg-white text-blue-600 font-black text-sm uppercase tracking-[0.2em] transition-all active:scale-[0.98] shadow-2xl shadow-white/20 hover:shadow-white/30 disabled:opacity-50 disabled:cursor-not-allowed group/btn overflow-hidden relative hover:bg-blue-50"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-all duration-1000"></div>
                                    <div className="flex items-center justify-center gap-4 relative z-10">
                                        <Rocket size={24} className="group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1 transition-transform" />
                                        MỞ NHÓM TIẾP THEO ({currentGroupIndex + 1} / {groups.length})
                                    </div>
                                </button>

                                <div className="flex justify-center">
                                    <button
                                        onClick={resetProgress}
                                        className="text-[10px] font-black uppercase tracking-widest text-white/80 hover:text-white transition-colors flex items-center gap-2"
                                    >
                                        <RefreshCw size={14} />
                                        Đặt lại từ đầu danh sách
                                    </button>
                                </div>
                            </div>

                            <div className="mt-10 bg-white/20 backdrop-blur-md border border-white/30 p-5 rounded-3xl relative z-10">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-white/30 flex items-center justify-center shrink-0">
                                        <Sparkles className="text-white w-5 h-5" />
                                    </div>
                                    <div className="text-xs uppercase font-black tracking-widest leading-loose text-white/90">
                                        <strong className="text-white">Mẹo Tip:</strong> Sau khi hệ thống mở Tab Facebook mới, bạn chỉ cần nhấn tổ hợp phím <kbd className="bg-white/30 px-1.5 py-0.5 rounded text-white font-mono">Ctrl + V</kbd> và bấm <strong className="text-white">Post</strong>.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
