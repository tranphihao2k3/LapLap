"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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

export default function WarrantyPage() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<WarrantyOrder[] | null>(null);
    const [searched, setSearched] = useState(false);
    const [activeTab, setActiveTab] = useState<'store' | 'brand'>('store');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setSearched(true);
        setResults(null);

        try {
            const res = await fetch(`/api/warranty?query=${encodeURIComponent(query)}`);
            const data = await res.json();

            if (data.success) {
                setResults(data.data);
            }
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

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50 pb-20">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-16 px-4">
                    <div className="container mx-auto max-w-4xl text-center">
                        <ShieldCheck className="w-16 h-16 mx-auto mb-6 text-blue-300" />
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">Tra Cứu Bảo Hành</h1>
                        <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                            Kiểm tra thông tin bảo hành đơn hàng tại LapLap Cần Thơ hoặc tra cứu trực triếp từ trang chủ của hãng.
                        </p>

                        {/* Tabs */}
                        <div className="flex justify-center gap-4 mb-8">
                            <button
                                onClick={() => setActiveTab('store')}
                                className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'store'
                                    ? 'bg-white text-blue-800 shadow-lg'
                                    : 'bg-blue-800/50 text-blue-100 hover:bg-blue-800'
                                    }`}
                            >
                                Bảo hành tại Cửa hàng
                            </button>
                            <button
                                onClick={() => setActiveTab('brand')}
                                className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'brand'
                                    ? 'bg-white text-blue-800 shadow-lg'
                                    : 'bg-blue-800/50 text-blue-100 hover:bg-blue-800'
                                    }`}
                            >
                                Bảo hành Chính hãng
                            </button>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto max-w-4xl px-4 -mt-8">
                    {activeTab === 'store' ? (
                        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
                            <form onSubmit={handleSearch} className="mb-10">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            placeholder="Nhập số điện thoại hoặc Mã đơn hàng..."
                                            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-lg transition-all"
                                        />
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="py-4 px-8 text-lg shadow-blue-200 shadow-lg"
                                        disabled={loading}
                                    >
                                        {loading ? "Đang tra cứu..." : "Kiểm tra ngay"}
                                    </Button>
                                </div>
                                <p className="text-sm text-gray-500 mt-3 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    Nhập chính xác số điện thoại đặt hàng hoặc mã đơn hàng (VD: 6 ký tự cuối)
                                </p>
                            </form>

                            {/* Results */}
                            {searched && (
                                <div className="space-y-6">
                                    {results && results.length > 0 ? (
                                        results.map((order) => (
                                            <div key={order.orderId} className="border border-gray-200 rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
                                                    <div>
                                                        <div className="text-sm text-gray-500">Đơn hàng</div>
                                                        <div className="font-bold text-gray-800">#{order.orderId.slice(-6).toUpperCase()}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-500">Ngày mua</div>
                                                        <div className="font-medium text-gray-800">{new Date(order.purchaseDate).toLocaleDateString('vi-VN')}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-500">Khách hàng</div>
                                                        <div className="font-medium text-gray-800">{order.customer.name}</div>
                                                    </div>
                                                </div>

                                                <div className="p-6 space-y-6">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex flex-col md:flex-row gap-6">
                                                            <div className="w-24 h-24 bg-gray-50 rounded-lg flex-shrink-0 relative border border-gray-100">
                                                                <Image
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    fill
                                                                    className="object-contain p-2"
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <h3 className="font-bold text-lg text-gray-800 mb-2">{item.name}</h3>

                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                                                        <span className="text-sm text-blue-600 font-semibold block mb-1">Thời gian bảo hành</span>
                                                                        <span className="text-xl font-bold text-blue-800">{item.warrantyMonths} Tháng</span>
                                                                    </div>

                                                                    {item.warrantyStatus === 'active' && (
                                                                        <div className="bg-green-50 p-3 rounded-lg border border-green-100 flex items-center justify-between">
                                                                            <div>
                                                                                <span className="text-sm text-green-600 font-semibold block mb-1">Trạng thái</span>
                                                                                <span className="text-green-700 font-bold flex items-center gap-1">
                                                                                    <CheckCircle className="w-4 h-4" /> Còn bảo hành
                                                                                </span>
                                                                            </div>
                                                                            <div className="text-right">
                                                                                <span className="text-xs text-green-600 block">Còn lại</span>
                                                                                <span className="font-bold text-green-700">{item.remainingDays} ngày</span>
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {item.warrantyStatus === 'expired' && (
                                                                        <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                                                                            <span className="text-sm text-red-600 font-semibold block mb-1">Trạng thái</span>
                                                                            <span className="text-red-700 font-bold flex items-center gap-1">
                                                                                <AlertCircle className="w-4 h-4" /> Hết bảo hành
                                                                            </span>
                                                                            <span className="text-xs text-red-500 mt-1 block">
                                                                                Ngày hết hạn: {item.expirationDate ? new Date(item.expirationDate).toLocaleDateString('vi-VN') : 'N/A'}
                                                                            </span>
                                                                        </div>
                                                                    )}

                                                                    {item.warrantyStatus === 'pending_delivery' && (
                                                                        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                                                                            <span className="text-sm text-yellow-700 font-semibold block mb-1">Trạng thái</span>
                                                                            <span className="text-yellow-800 font-bold flex items-center gap-1">
                                                                                <Clock className="w-4 h-4" /> Chưa kích hoạt
                                                                            </span>
                                                                            <span className="text-xs text-yellow-600 mt-1 block">
                                                                                Bảo hành tính từ ngày nhận hàng
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-10">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Package className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-800">Không tìm thấy đơn hàng</h3>
                                            <p className="text-gray-500 max-w-md mx-auto">
                                                Vui lòng kiểm tra lại thông tin. <br />
                                                Lưu ý: Chỉ đơn hàng <strong>đã hoàn thành (đã giao)</strong> mới có thông tin bảo hành.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Chọn thương hiệu máy tính của bạn</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                                {brands.map((brand) => (
                                    <Link
                                        href={brand.url}
                                        key={brand.name}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group p-6 border border-gray-100 rounded-xl hover:shadow-lg hover:border-blue-200 transition-all flex flex-col items-center gap-4 bg-gray-50 hover:bg-white"
                                    >
                                        <div className="w-16 h-16 relative flex items-center justify-center">
                                            {/* In a real app, use actual logos. Using text fallback for now if images missing */}
                                            <div className={`w-full h-full rounded-full flex items-center justify-center p-4 ${brand.color}`}>
                                                <Image
                                                    src={brand.logo}
                                                    alt={`${brand.name} logo`}
                                                    fill
                                                    className="object-contain p-2"
                                                />
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{brand.name}</h3>
                                            <div className="text-xs text-gray-500 flex items-center gap-1 justify-center mt-1 group-hover:text-blue-500">
                                                Kiểm tra <ExternalLink size={10} />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <div className="mt-8 p-4 bg-blue-50 rounded-xl text-sm text-blue-800 border border-blue-100">
                                <h4 className="font-bold mb-2 flex items-center gap-2">
                                    <AlertCircle size={16} /> Lưu ý:
                                </h4>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Bạn sẽ được chuyển đến trang hỗ trợ chính thức của hãng sản xuất.</li>
                                    <li>Bạn cần chuẩn bị <strong>Serial Number (S/N)</strong> hoặc <strong>Service Tag</strong> (thường nằm ở mặt dưới laptop) để tra cứu.</li>
                                    <li>Kết quả tra cứu trên web hãng là bảo hành của nhà sản xuất, độc lập với bảo hành tại cửa hàng.</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
