'use client';

import { useState, useEffect } from 'react';
import { Share2, Copy, ExternalLink, CheckCircle, Plus, Trash2, Search, Facebook, Rocket } from 'lucide-react';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

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
        if (selectedProduct) {
            generateContent(selectedProduct);
        }
    }, [selectedProduct]);

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
        const content = `🔥 SALE SỐC: ${product.name.toUpperCase()} 🔥
💰 Giá chỉ: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}

✅ Cấu hình chi tiết:
- CPU: ${product.specs.cpu || 'Đang cập nhật'}
- RAM: ${product.specs.ram || 'Đang cập nhật'}
- SSD: ${product.specs.ssd || 'Đang cập nhật'}
- Màn hình: ${product.specs.screen || 'Đang cập nhật'}

🎁 Quà tặng hấp dẫn: Balo, Chuột không dây, Lót chuột...
🛡️ Bảo hành uy tín, hỗ trợ trọn đời.
💳 Hỗ trợ trả góp 0% lãi suất.

👉 Mua ngay tại: ${link}
☎️ Hotline/Zalo: 0978.648.720
#LaptopCanTho #LaptopGiaRe #${product.name.replace(/\s+/g, '')}`;
        setPostContent(content);
    };

    const handleAddGroup = () => {
        if (!newGroupUrl) return;

        // Simple extraction of group name from URL (could be improved)
        let name = 'Facebook Group';
        try {
            const urlObj = new URL(newGroupUrl);
            const pathParts = urlObj.pathname.split('/').filter(p => p);
            if (pathParts.length > 0) {
                // Usually /groups/group-name or /groups/12345
                const groupPart = pathParts[pathParts.indexOf('groups') + 1] || pathParts[pathParts.length - 1];
                name = groupPart.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            }
        } catch (e) {
            // Invalid URL
        }

        const newGroup = {
            id: Date.now().toString(),
            name: name,
            url: newGroupUrl
        };

        const updatedGroups = [...groups, newGroup];
        setGroups(updatedGroups);
        localStorage.setItem('marketing_groups', JSON.stringify(updatedGroups));
        setNewGroupUrl('');
    };

    const handleRemoveGroup = (id: string) => {
        const updatedGroups = groups.filter(g => g.id !== id);
        setGroups(updatedGroups);
        localStorage.setItem('marketing_groups', JSON.stringify(updatedGroups));
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(postContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("Đã sao chép nội dung!");
    };

    const openAllGroups = () => {
        // Copy content first
        copyToClipboard();

        // Open each group in a new tab
        groups.forEach((group) => {
            window.open(group.url, '_blank');
        });

        toast.success(`Đã mở ${groups.length} nhóm. Hãy dán (Ctrl+V) nội dung đã sao chép!`);
    };

    const openSingleGroup = (url: string) => {
        copyToClipboard();
        window.open(url, '_blank');
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 group flex items-center gap-2">
                        <Rocket className="text-blue-600 animate-pulse" />
                        Trợ Lý Đăng Bài Tự Động
                    </h1>
                    <p className="text-gray-500 mt-1">Công cụ hỗ trợ share bài viết nhanh chóng lên nhiều nhóm Facebook.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Product Selection */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Search size={20} className="text-blue-600" />
                            1. Chọn Sản Phẩm
                        </h2>

                        <div className="relative mb-4">
                            <input
                                type="text"
                                placeholder="Tìm kiếm laptop..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        </div>

                        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {filteredProducts.map(product => (
                                <div
                                    key={product._id}
                                    onClick={() => setSelectedProduct(product)}
                                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-blue-50 flex items-center gap-3 ${selectedProduct?._id === product._id
                                            ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                                            : 'border-gray-200'
                                        }`}
                                >
                                    <div className="w-12 h-12 relative flex-shrink-0 bg-white rounded border border-gray-100 p-1">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm truncate">{product.name}</div>
                                        <div className="text-xs text-blue-600 font-bold">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content & Actions */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Content Editor */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Share2 size={20} className="text-blue-600" />
                            2. Nội Dung Đăng Bài
                        </h2>

                        <div className="relative">
                            <textarea
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                                className="w-full h-64 p-4 border rounded-xl font-mono text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                placeholder="Chọn sản phẩm để tạo nội dung tự động..."
                            />
                            <button
                                onClick={copyToClipboard}
                                className="absolute top-2 right-2 p-2 bg-white rounded-lg border shadow-sm hover:bg-gray-100 transition-colors flex items-center gap-1.5 text-sm font-medium text-gray-700"
                            >
                                {copied ? <CheckCircle size={16} className="text-green-600" /> : <Copy size={16} />}
                                {copied ? 'Đã sao chép' : 'Sao chép'}
                            </button>
                        </div>
                    </div>

                    {/* Target Groups */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Facebook size={20} className="text-blue-600" />
                            3. Danh Sách Nhóm Mục Tiêu
                        </h2>

                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newGroupUrl}
                                onChange={(e) => setNewGroupUrl(e.target.value)}
                                placeholder="Dán link nhóm Facebook vào đây (Ví dụ: https://facebook.com/groups/...)"
                                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            <Button
                                onClick={handleAddGroup}
                                variant="primary"
                                size="md"
                                leftIcon={<Plus size={18} />}
                            >
                                Thêm
                            </Button>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 mb-6 max-h-60 overflow-y-auto">
                            {groups.length === 0 ? (
                                <div className="text-center text-gray-400 py-4">Chưa có nhóm nào. Hãy thêm nhóm để bắt đầu.</div>
                            ) : (
                                <div className="space-y-2">
                                    {groups.map(group => (
                                        <div key={group.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 shadow-sm group">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold">
                                                    G
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-medium truncate">{group.name}</div>
                                                    <div className="text-xs text-gray-400 truncate">{group.url}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openSingleGroup(group.url)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Mở nhóm này"
                                                >
                                                    <ExternalLink size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveGroup(group.id)}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Xóa nhóm"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="text-sm text-gray-500">
                                Đã chọn <span className="font-bold text-gray-900">{groups.length}</span> nhóm để đăng bài.
                            </div>
                            <Button
                                onClick={openAllGroups}
                                variant="primary"
                                size="lg"
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200 animate-pulse-slow"
                                leftIcon={<Rocket size={20} />}
                                disabled={groups.length === 0 || !postContent}
                            >
                                Bắt đầu đăng bài hàng loạt
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
