'use client';

import { useState } from "react";
import Button from "@/components/ui/Button";
import { Search, ShieldCheck, ExternalLink, AlertCircle, CheckCircle, Clock, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface WarrantyItem {
    name: string;
    image: string;
    quantity: number;
    warrantyMonths: number;
    warrantyStatus: 'active' | 'expired' | 'pending_delivery' | 'unknown';
    expirationDate: string | null;
    remainingDays: number;
}

interface WarrantyOrder {
    orderId: string;
    customer: {
        name: string;
        phone: string;
    };
    status: string;
    purchaseDate: string;
    deliveryDate: string | null;
    items: WarrantyItem[];
}

export default function WarrantyClient() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<WarrantyOrder[] | null>(null);
    const [searched, setSearched] = useState(false);
    const [activeTab, setActiveTab] = useState<'store' | 'brand' | 'retailer'>('store');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        setSearched(true);
        try {
            const res = await fetch(`/api/warranty?query=${encodeURIComponent(query)}`);
            const data = await res.json();
            if (data.success) setResults(data.data);
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setLoading(false);
        }
    };

    const brands = [
        { name: "Dell", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Dell_Logo.svg/960px-Dell_Logo.svg.png", url: "https://www.dell.com/support/home/vi-vn", color: "bg-blue-50" },
        { name: "HP", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/HP_logo_2012.svg/960px-HP_logo_2012.svg.png", url: "https://support.hp.com/vn-en/checkwarranty", color: "bg-cyan-50" },
        { name: "Asus", logo: "https://upload.wikimedia.org/wikipedia/commons/d/de/AsusTek-black-logo.png", url: "https://www.asus.com/vn/support/warranty-status-inquiry/", color: "bg-gray-50" },
        { name: "Lenovo", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lenovo_logo_2015.svg/960px-Lenovo_logo_2015.svg.png", url: "https://pcsupport.lenovo.com/vn/en/warranty-lookup", color: "bg-red-50" },
        { name: "Acer", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRY5EFO5KGbtrcYvWogQTC1x6ZZFshTk5gk7w&s", url: "https://www.acer.com/ac/vi/VN/content/support", color: "bg-green-50" },
        { name: "MSI", logo: "https://inkythuatso.com/uploads/images/2021/11/logo-msi-inkythuatso-4-01-27-14-36-47.jpg", url: "https://vn.msi.com/support", color: "bg-white" },
        { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg", url: "https://checkcoverage.apple.com/vn/en/", color: "bg-gray-50" },
        { name: "LG", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/LG_symbol.svg/3840px-LG_symbol.svg.png", url: "https://www.lg.com/vn/ho-tro", color: "bg-pink-50" },
    ];

    const retailers = [
        { name: "CellphoneS", logo: "https://cdn.cellphones.com.vn/media/logo/cellphones-logo.png", url: "https://cellphones.com.vn/bao-hanh.html", color: "bg-orange-50" },
        { name: "Thế Giới Di Động", logo: "https://cdn.tgdd.vn/2021/06/GameApp/tgdd-icon-200x200.png", url: "https://www.thegioididong.com/tin-tuc/tra-cuu-bao-hanh", color: "bg-yellow-50" },
        { name: "FPT Shop", logo: "https://fptshop.com.vn/favicon.ico", url: "https://fptshop.com.vn/bao-hanh", color: "bg-orange-50" },
        { name: "Nguyễn Kim", logo: "https://www.nguyenkim.com/images/companies/1/logo%20NK.png", url: "https://www.nguyenkim.com/tra-cuu-bao-hanh/", color: "bg-red-50" },
    ];

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            <section className="relative w-full h-auto bg-gradient-to-r from-[#124A84] via-[#0d3560] to-[#0a2d54] text-white overflow-hidden shadow-lg border-b border-white/10 py-12 md:py-16">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <ShieldCheck className="w-16 h-16 mx-auto mb-6 text-blue-300" />
                    <h1 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tight">Tra Cứu <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">Bảo Hành</span></h1>
                    <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto font-medium">Kiểm tra thông tin bảo hành đơn hàng tại LapLap Cần Thơ hoặc tra cứu trực từ hãng.</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {['store', 'brand', 'retailer'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-5 py-2 rounded-full font-bold transition-all border text-sm ${activeTab === tab ? 'bg-white text-blue-800 shadow-lg border-white' : 'bg-white/10 text-blue-100 hover:bg-white/20 border-white/20'}`}
                            >
                                {tab === 'store' ? '🏪 Cửa hàng' : tab === 'brand' ? '🏭 Chính hãng' : '🛒 Bán lẻ'}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <div className="container mx-auto max-w-4xl px-4 -mt-8">
                {activeTab === 'store' ? (
                    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
                        <form onSubmit={handleSearch} className="mb-10 flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="SĐT hoặc Mã đơn hàng..." className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 outline-none transition-all" />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                            <Button type="submit" className="py-4 px-8" disabled={loading}>{loading ? "Đang tra cứu..." : "Kiểm tra"}</Button>
                        </form>
                        {searched && results && results.length > 0 && results.map(order => (
                            <div key={order.orderId} className="border border-gray-200 rounded-xl p-6 mb-4">
                                <h3 className="font-bold">Đơn hàng #{order.orderId.slice(-6).toUpperCase()}</h3>
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="mt-4 p-4 bg-gray-50 rounded-lg">{item.name} - <b>{item.warrantyMonths} tháng</b></div>
                                ))}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl p-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {(activeTab === 'brand' ? brands : retailers).map(b => (
                            <Link href={b.url} key={b.name} target="_blank" className="p-6 border rounded-xl hover:shadow-lg transition-all flex flex-col items-center">
                                <div className={`w-12 h-12 relative mb-4 ${b.color} rounded-full`}>
                                    <img src={b.logo} alt={b.name} className="object-contain p-2" />
                                </div>
                                <span className="font-bold text-sm">{b.name}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
