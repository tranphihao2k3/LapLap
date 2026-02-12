'use client';

import Link from "next/link";
import { Itim } from "next/font/google";
import { MapPin, Menu, X, Facebook, Search } from "lucide-react";
import { useState, useEffect } from "react";

const itim = Itim({
    subsets: ["latin", "vietnamese"],
    weight: "400",
    display: "swap",
});

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Debounce search
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.trim()) {
                setIsLoading(true);
                try {
                    const res = await fetch(`/api/products?search=${encodeURIComponent(searchTerm)}&limit=5`);
                    const data = await res.json();
                    if (data.success) {
                        setSearchResults(data.data);
                    }
                } catch (error) {
                    console.error("Search error:", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const menuItems = [
        { href: "/laptops", label: "Laptop" },
        { href: "/blog", label: "Blog" },
        { href: "/ve-sinh-laptop", label: "Vệ sinh máy" },
        { href: "/sua-chua-laptop", label: "Sửa chữa thay thế" },
        { href: "/test", label: "Kiểm tra máy" },
    ];

    return (
        <header className="w-full sticky top-0 z-50 shadow-md bg-white">
            {/* Logo */}
            <div className="bg-white py-6">
                <div className="container mx-auto flex justify-between items-center px-4">
                    <Link href="/" className={itim.className + " text-2xl font-bold"}>
                        Lap Lap Store
                    </Link>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-xl mx-4 relative hidden md:block">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm laptop..."
                                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                            />
                            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        </div>

                        {/* Search Results Dropdown */}
                        {isSearchFocused && (searchTerm.length > 0 || searchResults.length > 0) && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 max-h-96 overflow-y-auto z-50">
                                {isLoading ? (
                                    <div className="p-4 text-center text-gray-500">Đang tìm kiếm...</div>
                                ) : searchResults.length > 0 ? (
                                    <ul>
                                        {searchResults.map((product) => (
                                            <li key={product._id}>
                                                <Link
                                                    href={`/laptops/${product._id}`}
                                                    className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                                                    onClick={() => setIsSearchFocused(false)}
                                                >
                                                    <div className="w-12 h-12 relative flex-shrink-0">
                                                        <img
                                                            src={product.images?.[0] || 'https://placehold.co/100x100?text=No+Image'}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover rounded-md"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-800 line-clamp-1">{product.name}</h4>
                                                        <p className="text-xs text-blue-600 font-bold">
                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                ) : searchTerm.length > 0 ? (
                                    <div className="p-4 text-center text-gray-500">Không tìm thấy sản phẩm nào</div>
                                ) : null}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span className="font-medium">Cần Thơ</span>
                        </div>

                        {/* Fanpage Button - Highlights */}
                        <a
                            href="https://facebook.com/profile.php?id=61582947329036"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full hover:shadow-lg transition-all transform hover:-translate-y-0.5 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            <Facebook className="w-4 h-4 animate-bounce" />
                            <span className="font-bold text-sm">Ghé thăm Fanpage</span>
                        </a>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6 text-gray-700" />
                            ) : (
                                <Menu className="w-6 h-6 text-gray-700" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:block bg-[var(--color-accent)] border-t border-b border-gray-300">
                <ul className="container mx-auto flex justify-center gap-8 py-3 font-medium">
                    {menuItems.map((item) => (
                        <li key={item.href} className={itim.className + " text-xl"}>
                            <Link href={item.href} className="hover:text-white transition-colors">
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Mobile Sidebar */}
            <div
                className={`fixed inset-0 bg-black/50 z-50 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsMobileMenuOpen(false)}
            >
                <div
                    className={`fixed top-0 right-0 h-full w-[280px] bg-white shadow-2xl transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Sidebar Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className={itim.className + " text-xl font-bold text-gray-800"}>
                            Menu
                        </h2>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-700" />
                        </button>
                    </div>

                    {/* Location */}
                    <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span className="font-medium">Cần Thơ</span>
                        </div>
                    </div>

                    {/* Mobile Fanpage Button */}
                    <div className="px-6 pb-2 pt-4">
                        <a
                            href="https://facebook.com/profile.php?id=61582947329036"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#1877F2] text-white rounded-xl shadow-md font-bold active:scale-95 transition-transform"
                        >
                            <Facebook className="w-5 h-5 animate-pulse" />
                            <span>Ghé thăm Fanpage</span>
                        </a>
                    </div>

                    {/* Menu Items */}
                    <nav className="p-4">
                        <ul className="space-y-2">
                            {menuItems.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`${itim.className} block px-4 py-3 text-lg font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors`}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
}
