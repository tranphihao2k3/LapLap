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
    PanelLeftOpen
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
        { icon: Laptop, label: 'Sản phẩm', href: '/admin/laptops' },
        { icon: FileText, label: 'Blog', href: '/admin/blog' },
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
            <aside className={`
                fixed top-0 left-0 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white z-50
                transform transition-all duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'}
                w-72
                shadow-2xl
            `}>
                {/* Logo */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:hidden' : ''}`}>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                LapLap Admin
                            </h1>
                            <p className="text-sm text-gray-400 mt-1">Management System</p>
                        </div>

                        {/* Collapsed Logo */}
                        <div className={`hidden lg:block transition-all duration-300 ${sidebarCollapsed ? '' : 'lg:hidden'}`}>
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 flex items-center justify-center font-bold text-slate-900">
                                L
                            </div>
                        </div>

                        {/* Mobile Close Button */}
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
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
                        absolute top-20 -right-3 w-6 h-6 
                        bg-slate-700 hover:bg-slate-600 
                        rounded-full shadow-lg
                        transition-all duration-300
                        border-2 border-slate-900
                        z-10
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
                <nav className="mt-6 px-3 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                    {menuItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                                    ${active
                                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50'
                                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                    }
                                    ${sidebarCollapsed ? 'lg:justify-center lg:px-2' : ''}
                                `}
                                title={sidebarCollapsed ? item.label : ''}
                            >
                                <div className={`
                                    w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 flex-shrink-0
                                    ${active
                                        ? 'bg-white/20'
                                        : 'bg-white/5 group-hover:bg-white/10'
                                    }
                                `}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <span className={`font-medium flex-1 transition-all duration-300 ${sidebarCollapsed ? 'lg:hidden' : ''}`}>
                                    {item.label}
                                </span>
                                {active && !sidebarCollapsed && <ChevronRight className="w-4 h-4 lg:block hidden" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-gradient-to-t from-black/20">
                    <div
                        onClick={() => signOut({ callbackUrl: '/admin/login' })}
                        className={`
                            flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group
                            ${sidebarCollapsed ? 'lg:justify-center lg:px-2' : ''}
                        `}
                        title={sidebarCollapsed ? 'Đăng xuất' : ''}
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center font-bold shadow-lg text-sm flex-shrink-0">
                            {session?.user?.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div className={`flex-1 min-w-0 transition-all duration-300 ${sidebarCollapsed ? 'lg:hidden' : ''}`}>
                            <div className="font-medium text-sm truncate">{session?.user?.name || 'Admin User'}</div>
                            <div className="text-xs text-gray-400 truncate">{session?.user?.email || 'admin@laplap.com'}</div>
                        </div>
                        <LogOut className={`w-4 h-4 text-gray-400 group-hover:text-white transition-colors ${sidebarCollapsed ? 'lg:hidden' : ''}`} />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
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
