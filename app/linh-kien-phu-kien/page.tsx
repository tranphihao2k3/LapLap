'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Filter, ShoppingCart,
    Cpu, HardDrive, Keyboard, Mouse,
    Headphones, Battery, CreditCard,
    Zap, Tag, Box
} from 'lucide-react';
import Link from 'next/link';

interface ComponentSpec {
    ramType?: string;
    bus?: string;
    capacity?: string;
    ssdType?: string;
    connection?: string;
}

interface Component {
    _id: string;
    name: string;
    type: string;
    price: number;
    specs: ComponentSpec;
    image: string;
    stock: number;
    active: boolean;
    description?: string;
}

const CATEGORIES = [
    { id: 'ALL', name: 'Tất cả', icon: Box },
    { id: 'RAM', name: 'RAM Laptop', icon: Cpu },
    { id: 'SSD', name: 'Ổ cứng SSD', icon: HardDrive },
    { id: 'KEYBOARD', name: 'Bàn phím', icon: Keyboard },
    { id: 'MOUSE', name: 'Chuột', icon: Mouse },
    { id: 'BATTERY', name: 'Pin', icon: Battery },
    { id: 'CHARGER', name: 'Sạc', icon: Zap },
    { id: 'OTHER', name: 'Khác', icon: Headphones },
];

export default function ComponentsAndAccessoriesPage() {
    const [components, setComponents] = useState<Component[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]); // 0 - 10tr default

    useEffect(() => {
        const fetchComponents = async () => {
            try {
                // Fetch active components
                const res = await fetch('/api/components?all=false');
                const data = await res.json();
                if (data.success) {
                    setComponents(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch components", error);
            } finally {
                setLoading(false);
            }
        };

        fetchComponents();
    }, []);

    const filteredComponents = components.filter(item => {
        // Filter by Category
        if (selectedCategory !== 'ALL' && item.type !== selectedCategory) return false;

        // Filter by Search
        if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;

        // Filter by Price (Simple range check if needed, currently just placeholder)
        // if (item.price < priceRange[0] || item.price > priceRange[1]) return false;

        return true;
    });

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const handleBuyNow = (item: Component) => {
        const message = `Chào shop, mình quan tâm đến sản phẩm: ${item.name} - Giá: ${formatPrice(item.price)}`;
        window.open(`https://zalo.me/0978648720?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white py-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse delay-700"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-black mb-4 tracking-tight"
                    >
                        Linh Kiện & Phụ Kiện Chính Hãng
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-blue-100 max-w-2xl mx-auto mb-8"
                    >
                        Nâng cấp sức mạnh - Trang bị tiện nghi cho Laptop của bạn.<br />
                        Cam kết chính hãng, bảo hành 1 đổi 1.
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="max-w-xl mx-auto relative"
                    >
                        <input
                            type="text"
                            placeholder="Tìm kiếm linh kiện (RAM, SSD, Chuột...)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-full bg-white text-gray-900 placeholder-gray-500 shadow-xl focus:ring-4 focus:ring-blue-500/30 outline-none transition-all"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </motion.div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-10">
                {/* Categories Filter */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all ${selectedCategory === cat.id
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            <cat.icon className="w-4 h-4" />
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                    </div>
                ) : filteredComponents.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        <AnimatePresence>
                            {filteredComponents.map((item, index) => (
                                <motion.div
                                    key={item._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col h-full"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-square bg-gray-50 p-6 flex items-center justify-center overflow-hidden">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="text-gray-300">
                                                {item.type === 'RAM' ? <Cpu className="w-16 h-16" /> :
                                                    item.type === 'SSD' ? <HardDrive className="w-16 h-16" /> :
                                                        item.type === 'MOUSE' ? <Mouse className="w-16 h-16" /> :
                                                            item.type === 'KEYBOARD' ? <Keyboard className="w-16 h-16" /> :
                                                                <Box className="w-16 h-16" />
                                                }
                                            </div>
                                        )}

                                        {/* Stock Badge */}
                                        <div className="absolute top-3 right-3">
                                            {item.stock > 0 ? (
                                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md">
                                                    Còn hàng
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-md">
                                                    Hết hàng
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="mb-2">
                                            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded uppercase">
                                                {CATEGORIES.find(c => c.id === item.type)?.name || item.type}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {item.name}
                                        </h3>

                                        {/* Specs Summary if applicable */}
                                        {item.type === 'RAM' && (
                                            <p className="text-xs text-gray-500 mb-4">
                                                {item.specs.capacity} • {item.specs.ramType} • {item.specs.bus}
                                            </p>
                                        )}
                                        {item.type === 'SSD' && (
                                            <p className="text-xs text-gray-500 mb-4">
                                                {item.specs.capacity} • {item.specs.ssdType}
                                            </p>
                                        )}
                                        {item.type !== 'RAM' && item.type !== 'SSD' && (
                                            <p className="text-xs text-gray-500 mb-4 h-4"></p>
                                        )}

                                        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                            <div>
                                                <span className="text-xs text-gray-500 block">Giá bán</span>
                                                <span className="text-xl font-bold text-blue-600">
                                                    {formatPrice(item.price)}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => handleBuyNow(item)}
                                                className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors shadow-sm"
                                                title="Liên hệ đặt mua"
                                            >
                                                <ShoppingCart className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy sản phẩm</h3>
                        <p className="text-gray-500">
                            Thử thay đổi từ khóa hoặc danh mục tìm kiếm nhé.
                        </p>
                        <button
                            onClick={() => { setSelectedCategory('ALL'); setSearchTerm(''); }}
                            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                        >
                            Xem tất cả
                        </button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
