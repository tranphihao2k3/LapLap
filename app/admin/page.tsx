'use client';

import { useEffect, useState } from 'react';
import {
    FolderTree,
    Building2,
    Laptop,
    TrendingUp,
    Package,
    ShoppingCart,
    DollarSign,
    Activity,
    ArrowUp,
    ArrowDown,
    Clock
} from 'lucide-react';

interface Stats {
    categories: number;
    brands: number;
    laptops: number;
    activeLaptops: number;
    software: number;
}

interface RecentLaptop {
    _id: string;
    name: string;
    brandId?: { name: string };
    categoryId?: { name: string };
    price: number;
    status: string;
}
// ...
export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        categories: 0,
        brands: 0,
        laptops: 0,
        activeLaptops: 0,
        software: 0,
    });
    const [recentLaptops, setRecentLaptops] = useState<RecentLaptop[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [categoriesRes, brandsRes, laptopsRes, softwareRes] = await Promise.all([
                fetch('/api/admin/categories'),
                fetch('/api/admin/brands'),
                fetch('/api/admin/laptops'),
                fetch('/api/admin/software'),
            ]);

            const categoriesData = await categoriesRes.json();
            const brandsData = await brandsRes.json();
            const laptopsData = await laptopsRes.json();
            const softwareData = await softwareRes.json();

            setStats({
                categories: categoriesData.data?.length || 0,
                brands: brandsData.data?.length || 0,
                laptops: laptopsData.data?.length || 0,
                activeLaptops: laptopsData.data?.filter((l: any) => l.status === 'active').length || 0,
                software: softwareData.data?.length || 0,
            });

            // Get 5 most recent laptops
            setRecentLaptops(laptopsData.data?.slice(0, 5) || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const statCards = [
        {
            icon: Laptop,
            label: 'Tổng sản phẩm',
            value: stats.laptops,
            change: '+12%',
            isPositive: true,
            color: 'from-blue-500 via-blue-600 to-blue-700',
            bgGradient: 'from-blue-50 to-blue-100',
            iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
        },
        {
            icon: TrendingUp,
            label: 'Đang hoạt động',
            value: stats.activeLaptops,
            change: '+8%',
            isPositive: true,
            color: 'from-green-500 via-green-600 to-green-700',
            bgGradient: 'from-green-50 to-green-100',
            iconBg: 'bg-gradient-to-br from-green-500 to-green-600',
        },
        {
            icon: Building2,
            label: 'Thương hiệu',
            value: stats.brands,
            change: '+3',
            isPositive: true,
            color: 'from-purple-500 via-purple-600 to-purple-700',
            bgGradient: 'from-purple-50 to-purple-100',
            iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
        },
        {
            icon: FolderTree,
            label: 'Danh mục',
            value: stats.categories,
            change: '+2',
            isPositive: true,
            color: 'from-orange-500 via-orange-600 to-orange-700',
            bgGradient: 'from-orange-50 to-orange-100',
            iconBg: 'bg-gradient-to-br from-orange-500 to-orange-600',
        },
        {
            icon: Package,
            label: 'Driver & Tools',
            value: stats.software,
            change: '+5',
            isPositive: true,
            color: 'from-teal-500 via-teal-600 to-teal-700',
            bgGradient: 'from-teal-50 to-teal-100',
            iconBg: 'bg-gradient-to-br from-teal-500 to-teal-600',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 rounded-2xl p-8 text-white shadow-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
                        <p className="text-blue-100 text-lg">Chào mừng đến với LapLap Admin Panel 👋</p>
                    </div>
                    <div className="hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <Clock className="w-5 h-5" />
                        <span className="font-medium">{new Date().toLocaleDateString('vi-VN')}</span>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
                            <div className="h-12 w-12 bg-gray-200 rounded-xl mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                            <div className="h-8 bg-gray-200 rounded w-16"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {statCards.map((card, index) => (
                        <div
                            key={index}
                            className={`relative bg-gradient-to-br ${card.bgGradient} rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden group`}
                        >
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>

                            <div className="relative z-10">
                                <div className={`w-14 h-14 ${card.iconBg} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:rotate-12 transition-transform duration-300`}>
                                    <card.icon className="w-7 h-7 text-white" />
                                </div>
                                <div className="text-sm text-gray-600 font-semibold mb-2">{card.label}</div>
                                <div className="flex items-end justify-between">
                                    <div className={`text-4xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                                        {card.value}
                                    </div>
                                    <div className={`flex items-center gap-1 text-sm font-semibold ${card.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                        {card.isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                                        {card.change}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Laptops */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <Activity className="w-6 h-6 text-blue-600" />
                            Sản phẩm mới nhất
                        </h2>
                        <a href="/admin/laptops" className="text-blue-600 hover:text-blue-700 font-semibold text-sm hover:underline">
                            Xem tất cả →
                        </a>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl animate-pulse">
                                    <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : recentLaptops.length > 0 ? (
                        <div className="space-y-3">
                            {recentLaptops.map((laptop) => (
                                <div
                                    key={laptop._id}
                                    className="flex items-center gap-4 p-4 border-2 border-gray-100 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 group"
                                >
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                        <Laptop className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-800 truncate">{laptop.name}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-sm text-gray-600">{laptop.brandId?.name}</span>
                                            <span className="text-gray-300">•</span>
                                            <span className="text-sm text-gray-600">{laptop.categoryId?.name}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-blue-600">{formatPrice(laptop.price)}</div>
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mt-1 ${laptop.status === 'active'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {laptop.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <Laptop className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p>Chưa có sản phẩm nào</p>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Package className="w-6 h-6 text-purple-600" />
                        Thao tác nhanh
                    </h2>
                    <div className="space-y-3">
                        <a
                            href="/admin/laptops"
                            className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl hover:from-blue-100 hover:to-blue-200 hover:border-blue-300 transition-all duration-200 group"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                <Laptop className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold text-gray-800">Quản lý Laptop</div>
                                <div className="text-sm text-gray-600">Thêm, sửa, xóa sản phẩm</div>
                            </div>
                        </a>

                        <a
                            href="/admin/software"
                            className="flex items-center gap-3 p-4 bg-gradient-to-r from-teal-50 to-teal-100 border-2 border-teal-200 rounded-xl hover:from-teal-100 hover:to-teal-200 hover:border-teal-300 transition-all duration-200 group"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                <Package className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold text-gray-800">Quản lý Driver</div>
                                <div className="text-sm text-gray-600">Driver & Tools</div>
                            </div>
                        </a>

                        <a
                            href="/admin/brands"
                            className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl hover:from-purple-100 hover:to-purple-200 hover:border-purple-300 transition-all duration-200 group"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold text-gray-800">Quản lý Thương hiệu</div>
                                <div className="text-sm text-gray-600">Thêm, sửa thương hiệu</div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
