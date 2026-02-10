'use client';

import Link from "next/link";
import { Itim } from "next/font/google";
import { MapPin, Menu, X, Facebook } from "lucide-react";
import { useState } from "react";

const itim = Itim({
    subsets: ["latin", "vietnamese"],
    weight: "400",
    display: "swap",
});

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { href: "/laptops", label: "Laptop" },
        { href: "/blog", label: "Blog" },
        { href: "/ve-sinh-laptop", label: "Vệ sinh máy" },
        { href: "/sua-chua-laptop", label: "Sửa chữa thay thế" },
        { href: "/test", label: "Kiểm tra máy" },
    ];

    return (
        <header className="w-full relative">
            {/* Logo */}
            <div className="bg-white py-6">
                <div className="container mx-auto flex justify-between items-center px-4">
                    <Link href="/" className={itim.className + " text-2xl font-bold"}>
                        Lap Lap Store
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span className="font-medium">Cần Thơ</span>
                        </div>

                        {/* Fanpage Button - Highlights */}
                        <a
                            href="https://facebook.com/laplapstore"
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
                            href="https://facebook.com/laplapstore"
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
