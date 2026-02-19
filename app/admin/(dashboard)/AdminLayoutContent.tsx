'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
    LayoutDashboard,
    FolderTree,
    Building2,
    Laptop,
    Users,
    Menu,
    X,
    ChevronRight,
    LogOut,
    Bell,
    Search,
    FileText,
    ChevronLeft,
    PanelLeftClose,
    PanelLeftOpen,
    Cpu,
    ShoppingCart,
    Megaphone
} from 'lucide-react';

export default function AdminLayoutContent({ children }: { children: ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const pathname = usePathname();
    const { data: session } = useSession();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
        { icon: FolderTree, label: 'Danh mục', href: '/admin/categories' },
        { icon: Building2, label: 'Thương hiệu', href: '/admin/brands' },
        { icon: ShoppingCart, label: 'Đơn hàng', href: '/admin/orders' },
        { icon: Laptop, label: 'Sản phẩm', href: '/admin/laptops' },
        { icon: Cpu, label: 'Linh kiện', href: '/admin/linh-kien' },
        { icon: FileText, label: 'Blog', href: '/admin/blog' },
        { icon: Laptop, label: 'Driver & Soft', href: '/admin/software' }, // Reusing Laptop icon or finding a better one but Laptop is fine for now
        { icon: Users, label: 'Users', href: '/admin/users' },
    ];

    const isActive = (href: string) => {
        if (href === '/admin') {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    const getBreadcrumb = () => {
        const segments = pathname.split('/').filter(Boolean);
        const breadcrumbs = [{ label: 'Admin', href: '/admin' }];

        if (segments.length > 1) {
            const item = menuItems.find(m => m.href === pathname || pathname.startsWith(m.href));
            if (item) {
                breadcrumbs.push({ label: item.label, href: item.href });
            }
        }

        return breadcrumbs;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 h-full bg-[#111827] text-gray-300 z-50
                transform transition-all duration-300 ease-in-out border-r border-[#1f2937]
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                ${sidebarCollapsed ? 'lg:w-[80px]' : 'lg:w-[280px]'}
                w-[280px]
                flex flex-col
            `}>
                {/* Logo */}
                <div className="h-16 flex items-center justify-center border-b border-[#1f2937]">
                    <div className="w-full px-6 flex items-center justify-between">
                        <div className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${sidebarCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                                LapLap Admin
                            </h1>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Management</p>
                        </div>

                        {/* Collapsed Logo */}
                        <div className={`absolute left-0 right-0 flex justify-center transition-all duration-300 ${sidebarCollapsed ? 'opacity-100 scale-100' : 'opacity-0 scale-0 pointer-events-none'}`}>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
                                L
                            </div>
                        </div>

                        {/* Mobile Close Button */}
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-1.5 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Desktop Collapse Toggle */}
                <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className={`
                        hidden lg:flex items-center justify-center
                        absolute -right-3 top-20 w-6 h-6 
                        bg-[#374151] hover:bg-blue-600 border border-[#1f2937]
                        rounded-full text-gray-400 hover:text-white
                        transition-all duration-200 shadow-sm
                        z-50
                    `}
                    title={sidebarCollapsed ? 'Mở rộng' : 'Thu gọn'}
                >
                    {sidebarCollapsed ? (
                        <PanelLeftOpen className="w-3 h-3" />
                    ) : (
                        <PanelLeftClose className="w-3 h-3" />
                    )}
                </button>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 dark-scrollbar">
                    {menuItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                                    relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                                    ${active
                                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-900/20'
                                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-100'
                                    }
                                    ${sidebarCollapsed ? 'justify-center px-2' : ''}
                                `}
                                title={sidebarCollapsed ? item.label : ''}
                            >
                                <div className={`
                                    flex items-center justify-center transition-colors duration-200
                                    ${active ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}
                                `}>
                                    <item.icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
                                </div>
                                <span className={`
                                    font-medium text-sm whitespace-nowrap transition-all duration-300 origin-left
                                    ${sidebarCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100 block'}
                                `}>
                                    {item.label}
                                </span>

                                {active && !sidebarCollapsed && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50 shadow-sm" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-[#1f2937] bg-[#0f1523]">
                    <div
                        onClick={() => signOut({ callbackUrl: '/admin/login' })}
                        className={`
                            flex items-center gap-3 p-2 rounded-xl hover:bg-gray-800 transition-colors cursor-pointer group
                            ${sidebarCollapsed ? 'justify-center' : ''}
                        `}
                        title={sidebarCollapsed ? 'Đăng xuất' : ''}
                    >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-inner ring-2 ring-gray-800 flex-shrink-0">
                            {session?.user?.name?.charAt(0).toUpperCase() || 'A'}
                        </div>

                        <div className={`flex-1 min-w-0 transition-opacity duration-300 ${sidebarCollapsed ? 'hidden' : 'block'}`}>
                            <div className="font-semibold text-sm text-gray-200 truncate group-hover:text-white">
                                {session?.user?.name || 'Admin User'}
                            </div>
                            <div className="text-xs text-gray-500 truncate group-hover:text-gray-400">
                                {session?.user?.email || 'admin@laplap.com'}
                            </div>
                        </div>

                        {!sidebarCollapsed && (
                            <LogOut className="w-4 h-4 text-gray-500 group-hover:text-red-400 transition-colors" />
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-[80px]' : 'lg:ml-[280px]'}`}>
                {/* Top Header */}
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
                    <div className="px-4 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            {/* Left: Mobile Menu + Breadcrumb */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <Menu className="w-6 h-6 text-gray-600" />
                                </button>

                                {/* Breadcrumb */}
                                <div className="hidden md:flex items-center gap-2 text-sm">
                                    {getBreadcrumb().map((crumb, index) => (
                                        <div key={`breadcrumb-${index}`} className="flex items-center gap-2">
                                            {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
                                            <Link
                                                href={crumb.href}
                                                className={`
                                                    ${index === getBreadcrumb().length - 1
                                                        ? 'text-blue-600 font-semibold'
                                                        : 'text-gray-600 hover:text-gray-900'
                                                    }
                                                `}
                                            >
                                                {crumb.label}
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right: Search + Notifications + User */}
                            <div className="flex items-center gap-3">
                                {/* Search */}
                                <div className="hidden md:flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                                    <Search className="w-4 h-4 text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm..."
                                        className="bg-transparent border-none outline-none text-sm w-48"
                                    />
                                </div>

                                {/* Notifications */}
                                <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <Bell className="w-5 h-5 text-gray-600" />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                </button>

                                {/* User Avatar */}
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-lg cursor-pointer hover:scale-110 transition-transform">
                                    {session?.user?.name?.charAt(0).toUpperCase() || 'A'}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}