'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    { id: 'Drivers', name: 'Drivers Laptop', icon: Laptop },
    { id: 'Văn phòng', name: 'Văn phòng', icon: Box },
    { id: 'Hệ thống', name: 'Hệ thống', icon: Monitor },
    { id: 'Diệt Virus', name: 'Diệt Virus', icon: Shield },
    { id: 'Tiện ích', name: 'Tiện ích', icon: Zap },
    { id: 'Multimedia', name: 'Multimedia', icon: Grid },
];

export default function SoftwareClient() {
    const [softwareList, setSoftwareList] = useState<Software[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchSoftware = async () => {
            setLoading(true);
            try {
                const res = await fetch(selectedCategory ? `/api/software?category=${selectedCategory}` : '/api/software');
                const data = await res.json();
                if (data.success) setSoftwareList(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSoftware();
    }, [selectedCategory]);

    const filteredList = softwareList.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            <section className="relative w-full h-auto bg-gradient-to-r from-[#124A84] via-[#0d3560] to-[#0a2d54] text-white overflow-hidden shadow-lg border-b border-white/10 py-12 md:py-16">
                <div className="container mx-auto max-w-5xl px-4 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">Kho Driver & Phần Mềm</motion.h1>
                        <p className="text-lg text-blue-100/80 mb-8">Tổng hợp các phần mềm cần thiết cho Laptop, PC. An toàn, link tốc độ cao.</p>
                        <div className="relative max-w-xl mx-auto">
                            <input type="text" placeholder="Tìm kiếm phần mềm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-6 pr-6 py-4 rounded-2xl bg-white text-gray-900 shadow-2xl focus:ring-4 focus:ring-blue-500/30 outline-none transition-all text-lg" />
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto max-w-5xl px-4 py-12">
                {loading ? <TechLoader /> : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {filteredList.map(sw => (
                            <Link href={`/cai-dat-phan-mem/${sw.slug}`} key={sw._id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all p-6 border border-gray-100 block h-full flex flex-col">
                                <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 line-clamp-2">{sw.title}</h3>
                                <p className="text-sm text-gray-500 line-clamp-3 flex-1 mb-4">{sw.excerpt}</p>
                                <div className="text-xs text-blue-600 font-bold flex items-center gap-2">Tải ngay <Download size={14} /></div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
