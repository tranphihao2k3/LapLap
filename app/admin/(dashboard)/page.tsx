'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    FolderTree,
    Building2,
    Laptop,
    TrendingUp,
    Package,
    Activity,
    ArrowUpRight,
    Clock,
    ShoppingCart,
    Users,
    Star,
    ChevronRight,
    Cpu,
    Eye,
    MessageSquare,
    FileText,
    Shield,
    Megaphone,
} from 'lucide-react';

interface Stats {
    categories: number;
    brands: number;
    laptops: number;
    activeLaptops: number;
    software: number;
    visitors: number;
    orders: number;
    customers: number;
    reviews: number;
    pendingOrders: number;
}

interface RecentLaptop {
    _id: string;
    name: string;
    brandId?: { name: string };
    categoryId?: { name: string };
    price: number;
    status: string;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        categories: 0,
        brands: 0,
        laptops: 0,
        activeLaptops: 0,
        software: 0,
        visitors: 0,
        orders: 0,
        customers: 0,
        reviews: 0,
        pendingOrders: 0,
    });
    const [recentLaptops, setRecentLaptops] = useState<RecentLaptop[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [
                categoriesRes,
                brandsRes,
                laptopsRes,
                softwareRes,
                visitorsRes,
                ordersRes,
                customersRes,
                reviewsRes,
            ] = await Promise.all([
                fetch('/api/admin/categories'),
                fetch('/api/admin/brands'),
                fetch('/api/admin/laptops'),
                fetch('/api/admin/software'),
                fetch('/api/stats/visitors'),
                fetch('/api/admin/orders'),
                fetch('/api/admin/customers?limit=1'),
                fetch('/api/admin/reviews?limit=1'),
            ]);

            const categoriesData = await categoriesRes.json();
            const brandsData = await brandsRes.json();
            const laptopsData = await laptopsRes.json();
            const softwareData = await softwareRes.json();
            const visitorsData = await visitorsRes.json();
            const ordersData = await ordersRes.json();
            const customersData = await customersRes.json();
            const reviewsData = await reviewsRes.json();

            const orders = ordersData.data || [];
            const pendingOrders = orders.filter((o: any) => o.status === 'pending' || o.status === 'processing').length;

            setStats({
                categories: categoriesData.data?.length || 0,
                brands: brandsData.data?.length || 0,
                laptops: laptopsData.data?.length || 0,
                activeLaptops: laptopsData.data?.filter((l: any) => l.status === 'active').length || 0,
                software: softwareData.data?.length || 0,
                visitors: visitorsData.count || 0,
                orders: orders.length || 0,
                customers: customersData.pagination?.total || 0,
                reviews: reviewsData.pagination?.total || 0,
                pendingOrders,
            });

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

    const statCards = [
        {
            icon: Eye,
            label: 'Lượt truy cập',
            value: stats.visitors.toLocaleString('vi-VN'),
            change: '+18%',
            accent: '#06d6a0',
            accentBg: 'rgba(6,214,160,0.1)',
            borderColor: 'rgba(6,214,160,0.25)',
            topBar: 'linear-gradient(90deg, #06d6a0, transparent)',
            href: '/admin',
        },
        {
            icon: ShoppingCart,
            label: 'Tổng đơn hàng',
            value: stats.orders,
            change: stats.pendingOrders > 0 ? `${stats.pendingOrders} chờ` : '0 chờ',
            accent: '#f97316',
            accentBg: 'rgba(249,115,22,0.1)',
            borderColor: 'rgba(249,115,22,0.25)',
            topBar: 'linear-gradient(90deg, #f97316, transparent)',
            href: '/admin/orders',
        },
        {
            icon: Users,
            label: 'Khách hàng',
            value: stats.customers,
            change: '+12%',
            accent: '#8b5cf6',
            accentBg: 'rgba(139,92,246,0.1)',
            borderColor: 'rgba(139,92,246,0.25)',
            topBar: 'linear-gradient(90deg, #8b5cf6, transparent)',
            href: '/admin/customers',
        },
        {
            icon: Laptop,
            label: 'Tổng sản phẩm',
            value: stats.laptops,
            change: `${stats.activeLaptops} hoạt động`,
            accent: '#4f8ef7',
            accentBg: 'rgba(79,142,247,0.1)',
            borderColor: 'rgba(79,142,247,0.25)',
            topBar: 'linear-gradient(90deg, #4f8ef7, transparent)',
            href: '/admin/laptops',
        },
        {
            icon: Star,
            label: 'Đánh giá',
            value: stats.reviews,
            change: '+5 mới',
            accent: '#fbbf24',
            accentBg: 'rgba(251,191,36,0.1)',
            borderColor: 'rgba(251,191,36,0.25)',
            topBar: 'linear-gradient(90deg, #fbbf24, transparent)',
            href: '/admin/reviews',
        },
        {
            icon: Building2,
            label: 'Thương hiệu',
            value: stats.brands,
            change: '+3',
            accent: '#ec4899',
            accentBg: 'rgba(236,72,153,0.1)',
            borderColor: 'rgba(236,72,153,0.25)',
            topBar: 'linear-gradient(90deg, #ec4899, transparent)',
            href: '/admin/brands',
        },
        {
            icon: FolderTree,
            label: 'Danh mục',
            value: stats.categories,
            change: '+2',
            accent: '#14b8a6',
            accentBg: 'rgba(20,184,166,0.1)',
            borderColor: 'rgba(20,184,166,0.25)',
            topBar: 'linear-gradient(90deg, #14b8a6, transparent)',
            href: '/admin/categories',
        },
        {
            icon: Package,
            label: 'Driver & Tools',
            value: stats.software,
            change: '+5',
            accent: '#f43f5e',
            accentBg: 'rgba(244,63,94,0.1)',
            borderColor: 'rgba(244,63,94,0.25)',
            topBar: 'linear-gradient(90deg, #f43f5e, transparent)',
            href: '/admin/software',
        },
    ];

    const quickActions = [
        {
            icon: Laptop,
            label: 'Quản lý Sản phẩm',
            sub: 'Thêm, sửa, xóa laptop',
            href: '/admin/laptops',
            accent: '#4f8ef7',
            accentBg: 'rgba(79,142,247,0.1)',
        },
        {
            icon: Cpu,
            label: 'Quản lý Linh kiện',
            sub: 'Thêm, sửa linh kiện',
            href: '/admin/linh-kien',
            accent: '#06d6a0',
            accentBg: 'rgba(6,214,160,0.1)',
        },
        {
            icon: Package,
            label: 'Driver & Software',
            sub: 'Quản lý driver và phần mềm',
            href: '/admin/software',
            accent: '#8b5cf6',
            accentBg: 'rgba(139,92,246,0.1)',
        },
        {
            icon: ShoppingCart,
            label: 'Đơn hàng',
            sub: `${stats.pendingOrders > 0 ? `${stats.pendingOrders} đơn chờ xử lý` : 'Xem tất cả đơn hàng'}`,
            href: '/admin/orders',
            accent: '#f97316',
            accentBg: 'rgba(249,115,22,0.1)',
        },
        {
            icon: Users,
            label: 'Khách hàng',
            sub: 'Quản lý thông tin khách hàng',
            href: '/admin/customers',
            accent: '#ec4899',
            accentBg: 'rgba(236,72,153,0.1)',
        },
        {
            icon: MessageSquare,
            label: 'Đánh giá',
            sub: 'Quản lý đánh giá sản phẩm',
            href: '/admin/reviews',
            accent: '#fbbf24',
            accentBg: 'rgba(251,191,36,0.1)',
        },
        {
            icon: Building2,
            label: 'Thương hiệu',
            sub: 'Thêm, sửa thương hiệu',
            href: '/admin/brands',
            accent: '#14b8a6',
            accentBg: 'rgba(20,184,166,0.1)',
        },
        {
            icon: FolderTree,
            label: 'Danh mục',
            sub: 'Quản lý danh mục sản phẩm',
            href: '/admin/categories',
            accent: '#f43f5e',
            accentBg: 'rgba(244,63,94,0.1)',
        },
        {
            icon: FileText,
            label: 'Blog',
            sub: 'Quản lý bài viết blog',
            href: '/admin/blog',
            accent: '#6366f1',
            accentBg: 'rgba(99,102,241,0.1)',
        },
        {
            icon: Megaphone,
            label: 'Marketing',
            sub: 'Chiến dịch marketing',
            href: '/admin/marketing',
            accent: '#a855f7',
            accentBg: 'rgba(168,85,247,0.1)',
        },
        {
            icon: Shield,
            label: 'Quản trị viên',
            sub: 'Quản lý tài khoản admin',
            href: '/admin/users',
            accent: '#ef4444',
            accentBg: 'rgba(239,68,68,0.1)',
        },
    ];

    // Tính toán đúng ngày trong tuần
    const getWeekData = () => {
        const now = new Date();
        const currentDay = now.getDay(); // 0 = Chủ nhật, 1 = Thứ 2, ..., 6 = Thứ 7

        // Chuyển đổi: Chủ nhật (0) -> 6, Thứ 2 (1) -> 0, ..., Thứ 7 (6) -> 5
        // Để tuần bắt đầu từ Thứ 2 (index 0)
        const dayIndex = currentDay === 0 ? 6 : currentDay - 1;

        const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

        // Dữ liệu giả (có thể thay bằng dữ liệu thực từ API)
        const weekBars = [30, 55, 40, 80, 65, 45, 70];

        return { weekDays, weekBars, currentDayIndex: dayIndex };
    };

    const { weekDays, weekBars, currentDayIndex } = getWeekData();

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", color: '#1f2937', background: '#f8fafc', minHeight: '100vh', padding: '24px' }}>
            {/* Topbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                <div>
                    <h1 style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: 28,
                        fontWeight: 800,
                        letterSpacing: -0.5,
                        margin: 0,
                        color: '#111827',
                    }}>
                        Dashboard
                    </h1>
                    <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
                        Xin chào! Đây là tổng quan hôm nay.
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '8px 14px',
                        background: '#ffffff',
                        border: '1px solid rgba(0,0,0,0.08)',
                        borderRadius: 10,
                        fontSize: 13,
                        color: '#4b5563',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    }}>
                        <Clock size={14} />
                        {new Date().toLocaleDateString('vi-VN')}
                    </div>
                </div>
            </div>

            {/* Hero Banner */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
                border: '1px solid rgba(0,0,0,0.05)',
                borderRadius: 20,
                padding: '32px 36px',
                marginBottom: 24,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 10px 25px rgba(102, 126, 234, 0.15)',
            }}>
                {/* decorative blobs */}
                <div style={{
                    position: 'absolute', top: -60, right: -60,
                    width: 280, height: 280,
                    background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', bottom: -80, left: '35%',
                    width: 240, height: 240,
                    background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />

                <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                    <div>
                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#ffffff', marginBottom: 8 }}>
                            ✦ Chào mừng trở lại
                        </div>
                        <div style={{
                            fontFamily: "'Syne', sans-serif",
                            fontSize: 34,
                            fontWeight: 800,
                            letterSpacing: -1,
                            color: '#ffffff',
                            lineHeight: 1.1,
                            marginBottom: 8,
                        }}>
                            LapLap Admin Panel
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, margin: 0 }}>
                            Quản lý toàn bộ hệ thống laptop, thương hiệu và đơn hàng.
                        </p>
                    </div>

                    <div className="flex gap-4 sm:gap-7 flex-shrink-0 flex-wrap">
                        {[
                            { val: stats.visitors.toLocaleString('vi-VN'), label: 'Lượt truy cập' },
                            { val: stats.orders.toString(), label: 'Tổng đơn hàng' },
                            { val: stats.customers.toString(), label: 'Khách hàng' },
                        ].map((s, i) => (
                            <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
                                {i > 0 && (
                                    <div style={{
                                        position: 'absolute',
                                        left: -14,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        width: 1,
                                        height: 30,
                                        background: 'rgba(255,255,255,0.3)',
                                    }} />
                                )}
                                <div style={{
                                    fontFamily: "'Syne', sans-serif",
                                    fontSize: 30,
                                    fontWeight: 800,
                                    color: '#ffffff',
                                    lineHeight: 1,
                                    marginBottom: 4,
                                }}>
                                    {s.val}
                                </div>
                                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stat Cards */}
            {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} style={{
                            background: '#ffffff',
                            border: '1px solid rgba(0,0,0,0.08)',
                            borderRadius: 16,
                            padding: 20,
                            height: 120,
                            animation: 'pulse 1.5s infinite',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        }} />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {statCards.map((card, i) => (
                        <Link
                            href={card.href}
                            key={i}
                            style={{
                                display: 'block',
                                background: '#ffffff',
                                border: `1px solid ${card.borderColor}`,
                                borderRadius: 16,
                                padding: 20,
                                position: 'relative',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                textDecoration: 'none',
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
                                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
                                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                            }}
                        >
                            {/* top accent bar */}
                            <div style={{
                                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                                background: card.topBar,
                                borderRadius: '16px 16px 0 0',
                            }} />

                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                                <div style={{
                                    width: 38, height: 38,
                                    borderRadius: 10,
                                    background: card.accentBg,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <card.icon size={18} color={card.accent} />
                                </div>
                                <div style={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    padding: '3px 8px',
                                    borderRadius: 6,
                                    color: card.label === 'Tổng đơn hàng' && stats.pendingOrders > 0 ? '#f97316' : '#06d6a0',
                                    background: card.label === 'Tổng đơn hàng' && stats.pendingOrders > 0 ? 'rgba(249,115,22,0.1)' : 'rgba(6,214,160,0.1)',
                                    display: 'flex', alignItems: 'center', gap: 2,
                                }}>
                                    {card.label !== 'Tổng đơn hàng' && <ArrowUpRight size={11} />}
                                    {card.change}
                                </div>
                            </div>

                            <div style={{
                                fontFamily: "'Syne', sans-serif",
                                fontSize: 36,
                                fontWeight: 800,
                                color: card.accent,
                                lineHeight: 1,
                                marginBottom: 4,
                            }}>
                                {card.value}
                            </div>
                            <div style={{ fontSize: 12, color: '#4b5563', fontWeight: 500 }}>
                                {card.label}
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5">

                {/* Recent Laptops */}
                <div style={{
                    background: '#ffffff',
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: 20,
                    padding: 24,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                        <div style={{
                            fontFamily: "'Syne', sans-serif",
                            fontSize: 17, fontWeight: 700,
                            display: 'flex', alignItems: 'center', gap: 8,
                            color: '#111827',
                        }}>
                            <div style={{
                                width: 8, height: 8, borderRadius: '50%',
                                background: '#4f8ef7',
                                boxShadow: '0 0 8px rgba(79,142,247,0.5)',
                            }} />
                            Sản phẩm mới nhất
                        </div>
                        <a href="/admin/laptops" style={{
                            fontSize: 12, color: '#4f8ef7', fontWeight: 600,
                            textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2,
                        }}>
                            Xem tất cả <ChevronRight size={14} />
                        </a>
                    </div>

                    {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {[1, 2, 3].map(i => (
                                <div key={i} style={{
                                    height: 60, borderRadius: 12,
                                    background: '#f3f4f6',
                                    animation: 'pulse 1.5s infinite',
                                }} />
                            ))}
                        </div>
                    ) : recentLaptops.length > 0 ? (
                        <div>
                            {recentLaptops.map((laptop, i) => (
                                <div
                                    key={laptop._id}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 14,
                                        padding: '14px 0',
                                        borderBottom: i < recentLaptops.length - 1
                                            ? '1px solid rgba(0,0,0,0.06)'
                                            : 'none',
                                        transition: 'padding-left 0.2s',
                                        cursor: 'default',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.paddingLeft = '6px')}
                                    onMouseLeave={e => (e.currentTarget.style.paddingLeft = '0px')}
                                >
                                    <div style={{
                                        width: 46, height: 46,
                                        borderRadius: 12,
                                        background: 'rgba(79,142,247,0.1)',
                                        border: '1px solid rgba(79,142,247,0.2)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0,
                                    }}>
                                        <Laptop size={20} color="#4f8ef7" />
                                    </div>

                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontSize: 14, fontWeight: 600, color: '#111827',
                                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                        }}>
                                            {laptop.name}
                                        </div>
                                        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                                            {laptop.brandId?.name}
                                            {laptop.categoryId?.name && ` · ${laptop.categoryId.name}`}
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <div style={{
                                            fontFamily: "'Syne', sans-serif",
                                            fontSize: 14, fontWeight: 700, color: '#4f8ef7',
                                        }}>
                                            {formatPrice(laptop.price)}
                                        </div>
                                        <span style={{
                                            display: 'inline-block',
                                            fontSize: 10, fontWeight: 700,
                                            padding: '2px 8px', borderRadius: 20, marginTop: 4,
                                            background: laptop.status === 'active'
                                                ? 'rgba(6,214,160,0.1)'
                                                : 'rgba(107,114,128,0.1)',
                                            color: laptop.status === 'active' ? '#06d6a0' : '#6b7280',
                                        }}>
                                            {laptop.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
                            <Laptop size={40} style={{ margin: '0 auto 12px', opacity: 0.3, display: 'block' }} />
                            <p style={{ margin: 0 }}>Chưa có sản phẩm nào</p>
                        </div>
                    )}
                </div>

                {/* Right column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                    {/* Quick Actions */}
                    <div style={{
                        background: '#ffffff',
                        border: '1px solid rgba(0,0,0,0.08)',
                        borderRadius: 20,
                        padding: 24,
                        maxHeight: '600px',
                        overflowY: 'auto',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    }}>
                        <div style={{
                            fontFamily: "'Syne', sans-serif",
                            fontSize: 17, fontWeight: 700,
                            display: 'flex', alignItems: 'center', gap: 8,
                            marginBottom: 16,
                            position: 'sticky',
                            top: 0,
                            background: '#ffffff',
                            paddingBottom: 8,
                            zIndex: 1,
                            color: '#111827',
                        }}>
                            <div style={{
                                width: 8, height: 8, borderRadius: '50%',
                                background: '#8b5cf6',
                                boxShadow: '0 0 8px rgba(139,92,246,0.5)',
                            }} />
                            Thao tác nhanh
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
                            {quickActions.map((action, i) => (
                                <a
                                    key={i}
                                    href={action.href}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 12,
                                        padding: 12,
                                        borderRadius: 12,
                                        background: '#f9fafb',
                                        border: '1px solid rgba(0,0,0,0.06)',
                                        textDecoration: 'none',
                                        transition: 'all 0.2s',
                                        cursor: 'pointer',
                                    }}
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(0,0,0,0.12)';
                                        (e.currentTarget as HTMLAnchorElement).style.transform = 'translateX(4px)';
                                        (e.currentTarget as HTMLAnchorElement).style.background = '#f3f4f6';
                                        (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(0,0,0,0.06)';
                                        (e.currentTarget as HTMLAnchorElement).style.transform = 'translateX(0)';
                                        (e.currentTarget as HTMLAnchorElement).style.background = '#f9fafb';
                                        (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
                                    }}
                                >
                                    <div style={{
                                        width: 38, height: 38, borderRadius: 10,
                                        background: action.accentBg,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0,
                                    }}>
                                        <action.icon size={18} color={action.accent} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{action.label}</div>
                                        <div style={{ fontSize: 11, color: '#6b7280', marginTop: 1 }}>{action.sub}</div>
                                    </div>
                                    <ChevronRight size={14} color="#9ca3af" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Weekly Activity */}
                    <div style={{
                        background: '#ffffff',
                        border: '1px solid rgba(0,0,0,0.08)',
                        borderRadius: 20,
                        padding: 24,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    }}>
                        <div style={{
                            fontFamily: "'Syne', sans-serif",
                            fontSize: 17, fontWeight: 700,
                            display: 'flex', alignItems: 'center', gap: 8,
                            marginBottom: 16,
                            color: '#111827',
                        }}>
                            <div style={{
                                width: 8, height: 8, borderRadius: '50%',
                                background: '#06d6a0',
                                boxShadow: '0 0 8px rgba(6,214,160,0.5)',
                            }} />
                            Hoạt động tuần này
                        </div>

                        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 60, marginBottom: 8 }}>
                            {weekBars.map((h, i) => (
                                <div
                                    key={i}
                                    style={{
                                        flex: 1,
                                        height: `${h}%`,
                                        borderRadius: '4px 4px 0 0',
                                        background: i === currentDayIndex
                                            ? 'linear-gradient(180deg, #4f8ef7, #8b5cf6)'
                                            : 'rgba(79,142,247,0.15)',
                                        transition: 'background 0.2s',
                                        cursor: 'default',
                                    }}
                                    onMouseEnter={e => {
                                        if (i !== currentDayIndex)
                                            (e.currentTarget as HTMLDivElement).style.background = 'rgba(79,142,247,0.4)';
                                    }}
                                    onMouseLeave={e => {
                                        if (i !== currentDayIndex)
                                            (e.currentTarget as HTMLDivElement).style.background = 'rgba(79,142,247,0.15)';
                                    }}
                                />
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            {weekDays.map((d, i) => (
                                <span key={i} style={{
                                    fontSize: 10,
                                    color: i === currentDayIndex ? '#4f8ef7' : '#6b7280',
                                    fontWeight: i === currentDayIndex ? 700 : 400,
                                    flex: 1,
                                    textAlign: 'center',
                                }}>
                                    {d}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}