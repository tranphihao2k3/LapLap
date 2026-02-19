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
    image: string;
    slug: string;
    specs: {
        cpu: string;
        ram: string;
        ssd: string;
        screen: string;
    };
}

interface Group {
    id: string;
    name: string;
    url: string;
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
        // Load groups from localStorage
        const savedGroups = localStorage.getItem('marketing_groups');
        if (savedGroups) {
            setGroups(JSON.parse(savedGroups));
        } else {
            // Add some default groups if none
            setGroups([
                { id: '1', name: 'Chợ Laptop Cũ Cần Thơ', url: 'https://www.facebook.com/groups/cholaptopcantho' },
                { id: '2', name: 'Mua Bán Laptop Cũ Giá Rẻ', url: 'https://www.facebook.com/groups/muabanlaptopcugiare' }
            ]);
        }
    }, []);

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

    const generateContent = (product: Product) => {
        const link = `https://laplapcantho.store/laptops/${product.slug || product._id}`;
        const price = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price);
        const originalPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price * 1.15);

        const content = `🌟 [XẢ KHO GIÁ SỐC] - ${product.name.toUpperCase()} 🌟
💥 Giá hôm nay: ${price} (Tiết kiệm ngay hàng triệu đồng!)
📉 Giá thị trường: ${originalPrice}

-------------------------------------------
� Cấu hình "QUÁI VẬT" trong tầm giá:
✅ CPU: ${product.specs.cpu || 'Cực mạnh, cân mọi tác vụ'}
✅ RAM: ${product.specs.ram || '8GB/16GB đa nhiệm mượt mà'}
✅ SSD: ${product.specs.ssd || 'Tốc độ cao, khởi động 5s'}
✅ Màn hình: ${product.specs.screen || 'Full HD/IPS sắc nét'}

🎁 ƯU ĐÃI ĐỘC QUYỀN CHỈ CÓ TẠI LAPLAP CẦN THƠ:
� Combo quà: Balo, Chuột, Lót chuột, Túi chống sốc...
⚙️ Hỗ trợ cài đặt phần mềm & vệ sinh máy TRỌN ĐỜI.
🚚 Ship COD toàn quốc - Kiểm tra hàng mới thanh toán.
💳 Trả góp 0% - Duyệt hồ sơ chỉ trong 10 phút.

� SỐ LƯỢNG CÓ HẠN - CHỐT ĐƠN NGAY TẠI:
👉 Click xem ảnh & đặt hàng: ${link}
👉 Xem thêm quà tặng tại: ${link}

-------------------------------------------
🏘️ Địa chỉ: Hưng Lợi, Ninh Kiều, Cần Thơ.
☎️ Hotline/Zalo: 0978.648.720 (Hào)
#LaptopCanTho #LaptopGiaRe #LapLapCanTho #${product.name.replace(/\s+/g, '')}`;
        setPostContent(content);
    };

    const copyLinkOnly = () => {
        if (!selectedProduct) return;
        const link = `https://laplapcantho.store/laptops/${selectedProduct.slug || selectedProduct._id}`;
        navigator.clipboard.writeText(link);
        toast.success("🔗 Đã copy link sản phẩm!");
    };

    const handleAddGroup = () => {
        if (!newGroupUrl) return;

        // Check if group already exists
        if (groups.some(g => g.url === newGroupUrl)) {
            toast.error("Nhóm này đã có trong danh sách!");
            return;
        }

        // Simple extraction of group name from URL (could be improved)
        let name = 'Facebook Group';

        try {
            const urlObj = new URL(newGroupUrl);
            const pathParts = urlObj.pathname.split('/').filter(p => p);
            if (pathParts.length > 0) {
                // Usually /groups/group-name or /groups/12345
                const groupIndex = pathParts.indexOf('groups');
                if (groupIndex !== -1 && pathParts[groupIndex + 1]) {
                    const groupPart = pathParts[groupIndex + 1];
                    name = groupPart.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                }
            }
        } catch (e) {
            // Invalid URL
        }

        const newGroup = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: name,
            url: newGroupUrl,
        };

        const updatedGroups = [...groups, newGroup];
        setGroups(updatedGroups);
        localStorage.setItem('marketing_groups', JSON.stringify(updatedGroups));
        setNewGroupUrl('');
        toast.success("Đã thêm nhóm mới!");
    };

    const handleRemoveGroup = (id: string) => {
        const updatedGroups = groups.filter(g => g.id !== id);
        setGroups(updatedGroups);
        localStorage.setItem('marketing_groups', JSON.stringify(updatedGroups));
        // Adjust index if needed
        if (currentGroupIndex >= updatedGroups.length) {
            setCurrentGroupIndex(Math.max(0, updatedGroups.length - 1));
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(postContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("✅ Đã sao chép nội dung!");
    };

    const openNextGroup = () => {
        if (groups.length === 0) return;

        // Auto copy content if enabled
        if (autoCopy) {
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
                                            src={product.image && product.image.trim() !== '' ? product.image : PLACEHOLDER_IMAGE}
                                            alt={product.name}
                                            fill
                                            className="object-contain"
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
                                placeholder="Dán link nhóm Facebook..."
                                className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-sm"
                            />
                            <button
                                onClick={handleAddGroup}
                                className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg shadow-slate-200"
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
                                            <div key={group.id} className={`flex items-center justify-between p-4 rounded-2xl transition-all ${isNext ? 'bg-white border-2 border-blue-600 shadow-xl shadow-blue-100 -translate-y-1' : 'bg-white/60 border border-slate-100 opacity-60'}`}>
                                                <div className="flex items-center gap-4 min-w-0">
                                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-black text-xs transition-colors ${isNext ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                                        {index + 1}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className={`font-black text-xs uppercase tracking-tight truncate ${isNext ? 'text-slate-900' : 'text-slate-500'}`}>{group.name}</div>
                                                        <div className="text-[10px] text-slate-400 truncate mt-0.5">{group.url}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {isNext && <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 animate-pulse uppercase tracking-widest">Tiếp theo</span>}
                                                    <button
                                                        onClick={() => handleRemoveGroup(group.id)}
                                                        className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
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
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl shadow-slate-300 relative overflow-hidden group/control">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl transition-all group-hover/control:bg-blue-500/20"></div>

                            <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6 relative z-10">
                                <div className="text-center md:text-left">
                                    <h3 className="font-black text-xl md:text-2xl tracking-tight flex items-center justify-center md:justify-start gap-3">
                                        Hệ thống Queue Posting
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-400">Online</span>
                                        </div>
                                    </h3>
                                    <p className="text-slate-400 text-sm mt-2 font-medium">Bấm mở nhóm &rarr; Ctrl+V &rarr; Đăng bài &rarr; Quay lại đây</p>
                                </div>
                                <div className="flex items-center gap-4 bg-white/5 p-3 px-5 rounded-2xl backdrop-blur-md border border-white/10">
                                    <label className="flex items-center cursor-pointer">
                                        <input type="checkbox" checked={autoCopy} onChange={(e) => setAutoCopy(e.target.checked)} className="sr-only peer" />
                                        <div className="w-10 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-slate-400 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500 peer-checked:after:bg-white"></div>
                                        <span className="ml-3 text-[10px] font-black uppercase tracking-widest text-slate-300">Tự động Copy</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex flex-col gap-6 relative z-10">
                                <button
                                    onClick={openNextGroup}
                                    disabled={groups.length === 0 || !postContent}
                                    className="w-full py-6 md:py-8 rounded-3xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm uppercase tracking-[0.2em] transition-all active:scale-[0.98] shadow-2xl shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed group/btn overflow-hidden relative"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-all duration-1000"></div>
                                    <div className="flex items-center justify-center gap-4 relative z-10">
                                        <Rocket size={24} className="group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1 transition-transform" />
                                        MỞ NHÓM TIẾP THEO ({currentGroupIndex + 1} / {groups.length})
                                    </div>
                                </button>

                                <div className="flex justify-center">
                                    <button
                                        onClick={resetProgress}
                                        className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-400 transition-colors flex items-center gap-2"
                                    >
                                        <RefreshCw size={14} />
                                        Đặt lại từ đầu danh sách
                                    </button>
                                </div>
                            </div>

                            <div className="mt-10 bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl relative z-10">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center shrink-0">
                                        <Sparkles className="text-blue-400 w-5 h-5" />
                                    </div>
                                    <div className="text-xs uppercase font-black tracking-widest leading-loose text-slate-400">
                                        <strong className="text-blue-400">Mẹo Tip:</strong> Sau khi hệ thống mở Tab Facebook mới, bạn chỉ cần nhấn tổ hợp phím <kbd className="bg-slate-700 px-1.5 py-0.5 rounded text-white font-mono">Ctrl + V</kbd> và bấm <strong className="text-white">Post</strong>.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
