'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Download, Search, Box, Grid, Laptop, Shield, Zap, Sparkles, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import TechLoader from '@/components/ui/TechLoader';

interface Software {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    featuredImage: string;
    category: string;
    version: string;
    type: string;
    views: number;
}

const CATEGORIES = [
    { id: 'Drivers', name: 'Drivers Laptop', icon: Laptop, color: 'text-blue-500', bg: 'bg-blue-100' },
    { id: 'Văn phòng', name: 'Văn phòng', icon: Box, color: 'text-purple-500', bg: 'bg-purple-100' },
    { id: 'Hệ thống', name: 'Hệ thống', icon: Monitor, color: 'text-green-500', bg: 'bg-green-100' },
    { id: 'Diệt Virus', name: 'Diệt Virus', icon: Shield, color: 'text-red-500', bg: 'bg-red-100' },
    { id: 'Tiện ích', name: 'Tiện ích', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-100' },
    { id: 'Multimedia', name: 'Multimedia', icon: Grid, color: 'text-pink-500', bg: 'bg-pink-100' },
];

export default function SoftwarePage() {
    const [softwareList, setSoftwareList] = useState<Software[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSoftware();
    }, [selectedCategory]);

    const fetchSoftware = async () => {
        setLoading(true);
        try {
            const url = selectedCategory
                ? `/api/software?category=${selectedCategory}`
                : '/api/software';
            const res = await fetch(url);
            const data = await res.json();

            if (data.success) {
                if (data.data.length === 0 && !selectedCategory) {
                    // Auto-seed if empty
                    console.log('Database empty, attempting to seed...');
                    await fetch('/api/seed-software');
                    // Retry fetch
                    const retryRes = await fetch(url);
                    const retryData = await retryRes.json();
                    if (retryData.success) {
                        setSoftwareList(retryData.data);
                    }
                } else {
                    setSoftwareList(data.data);
                }
            }
        } catch (error) {
            console.error('Error fetching software:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredList = softwareList.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header />

            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 text-white overflow-hidden py-12 md:pb-20 md:pt-10">
                {/* Animated Background & Icons */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-blob"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>

                    {/* Floating Icons - Desktop Only */}
                    <div className="hidden lg:block">
                        <motion.div
                            className="absolute left-[10%] top-20 opacity-20"
                            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                            transition={{ duration: 5, repeat: Infinity }}
                        >
                            <Laptop size={120} className="text-blue-300" />
                        </motion.div>
                        <motion.div
                            className="absolute right-[10%] top-40 opacity-15"
                            animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
                            transition={{ duration: 7, repeat: Infinity }}
                        >
                            <Download size={100} className="text-indigo-300" />
                        </motion.div>
                        <motion.div
                            className="absolute left-[20%] bottom-10 opacity-15"
                            animate={{ y: [0, -25, 0] }}
                            transition={{ duration: 6, repeat: Infinity }}
                        >
                            <Shield size={60} className="text-purple-300" />
                        </motion.div>
                        <motion.div
                            className="absolute right-[20%] bottom-20 opacity-15"
                            animate={{ scale: [1, 1.2, 1], rotate: [0, 15, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                        >
                            <Zap size={80} className="text-yellow-300" />
                        </motion.div>
                    </div>
                </div>

                <div className="container mx-auto max-w-5xl px-4 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6"
                        >
                            <Sparkles className="w-4 h-4 text-yellow-300" />
                            <span className="text-sm font-medium text-blue-100">Kho phần mềm miễn phí & chất lượng</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                            className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight"
                        >
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-white to-purple-200">
                                Kho Driver & Tools
                            </span>
                            <br />
                            <span className="text-3xl md:text-5xl font-bold text-indigo-200">
                                Nhanh Chóng & An Toàn
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-blue-100/80 mb-8"
                        >
                            Tổng hợp các phần mềm cần thiết cho Laptop, PC. <br className="hidden md:block" />
                            Được kiểm duyệt an toàn, link tải tốc độ cao.
                        </motion.p>

                        {/* Search Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="relative max-w-xl mx-auto"
                        >
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Search className="w-6 h-6 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Tìm kiếm phần mềm (VD: Office, Chrome, Photoshop...)"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white text-gray-900 placeholder-gray-500 shadow-2xl focus:ring-4 focus:ring-blue-500/30 outline-none transition-all text-lg"
                            />
                        </motion.div>
                    </div>

                    {/* Category Pills */}
                    <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8">
                        <Button
                            onClick={() => setSelectedCategory('')}
                            variant={!selectedCategory ? 'white' : 'glass'}
                            rounded="full"
                            size="sm"
                            className={!selectedCategory ? 'text-blue-900 shadow-xl' : 'border-white/20 text-white hover:bg-white/20'}
                        >
                            Tất cả
                        </Button>
                        {CATEGORIES.map((cat) => (
                            <Button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                variant={selectedCategory === cat.id ? 'white' : 'glass'}
                                rounded="full"
                                size="sm"
                                leftIcon={<cat.icon className="w-4 h-4" />}
                                className={selectedCategory === cat.id ? 'text-blue-900 shadow-xl' : 'border-white/20 text-white hover:bg-white/20'}
                            >
                                {cat.name}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* List Section */}
            <main className="container mx-auto max-w-5xl px-4 py-12">
                {loading ? (
                    <TechLoader />
                ) : filteredList.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
                        {filteredList.map((sw, index) => (
                            <motion.div
                                key={sw._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link href={`/cai-dat-phan-mem/${sw.slug}`} className="group block h-full">
                                    <div className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 p-5 h-full border border-gray-100 relative overflow-hidden group-hover:-translate-y-1">

                                        {/* Type Badge */}
                                        <div className={`absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded ${sw.type === 'Free' ? 'bg-green-100 text-green-700' :
                                            sw.type === 'Crack' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {sw.type}
                                        </div>

                                        <div className="flex flex-col h-full">
                                            {/* Icon/Image */}
                                            <div className="mb-4 relative">
                                                <div className="w-16 h-16 rounded-2xl bg-gray-50 p-2 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                                    {sw.featuredImage ? (
                                                        <Image
                                                            src={sw.featuredImage}
                                                            alt={sw.title}
                                                            width={64}
                                                            height={64}
                                                            className="w-full h-full object-contain rounded-xl"
                                                        />
                                                    ) : (
                                                        <Box className="w-full h-full text-blue-300 p-2" />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                {sw.title}
                                            </h3>

                                            <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                                                {sw.excerpt}
                                            </p>

                                            {/* Footer */}
                                            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-gray-500">
                                                <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded">
                                                    <span>ver</span>
                                                    <span className="text-gray-900">{sw.version}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-blue-600 group-hover:translate-x-1 transition-transform">
                                                    Tải ngay <Download className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center max-w-md mx-auto">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy kết quả</h3>
                        <p className="text-gray-500">
                            Thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác nhé.
                        </p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
