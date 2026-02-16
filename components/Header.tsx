'use client';

import Link from "next/link";
import { Itim } from "next/font/google";
import { MapPin, Menu, X, Facebook, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Button from "./ui/Button";

const itim = Itim({
    subsets: ["latin", "vietnamese"],
    weight: "400",
    display: "swap",
});

const SEARCH_PLACEHOLDERS = [
    "Tìm kiếm laptop...",
    "Dell XPS 13...",
    "Macbook Air M1...",
    "Asus TUF Gaming...",
    "Lenovo ThinkPad...",
    "Acer Nitro 5..."
];

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const pathname = usePathname();

    // Typing animation state
    const [placeholderText, setPlaceholderText] = useState("");
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    // Typing effect logic
    useEffect(() => {
        const currentText = SEARCH_PLACEHOLDERS[placeholderIndex];

        const timeout = setTimeout(() => {
            if (!isDeleting && charIndex < currentText.length) {
                // Typing
                setPlaceholderText(currentText.substring(0, charIndex + 1));
                setCharIndex(prev => prev + 1);
            } else if (isDeleting && charIndex > 0) {
                // Deleting
                setPlaceholderText(currentText.substring(0, charIndex - 1));
                setCharIndex(prev => prev - 1);
            } else if (!isDeleting && charIndex === currentText.length) {
                // Finished typing, wait before deleting
                setTimeout(() => setIsDeleting(true), 2000);
            } else if (isDeleting && charIndex === 0) {
                // Finished deleting, move to next word
                setIsDeleting(false);
                setPlaceholderIndex((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length);
            }
        }, isDeleting ? 50 : 100);

        return () => clearTimeout(timeout);
    }, [charIndex, isDeleting, placeholderIndex]);

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
        { href: "/thu-cu-doi-moi", label: "Thu cũ đổi mới" },
        { href: "/nang-cap", label: "Nâng cấp" },
        { href: "/linh-kien-phu-kien", label: "Linh kiện & Phụ kiện" },
        { href: "/cai-dat-phan-mem", label: "Driver & Soft" },
        { href: "/blog", label: "Blog" },
        { href: "/ve-sinh-laptop", label: "Vệ sinh máy" },
        { href: "/sua-chua-laptop", label: "Sửa chữa" },
        { href: "/test", label: "Kiểm tra máy" },
    ];

    return (
        <header className="w-full sticky top-0 z-50 shadow-md bg-white">
            {/* Logo */}
            <div className="bg-white py-6">
                <div className="container mx-auto flex justify-between items-center px-4">
                    <Link href="/" className="group relative z-10">
                        <motion.div
                            className="flex items-center"
                            animate={{ scale: [0, 1.2, 1, 1, 1.2, 0] }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                times: [0, 0.1, 0.2, 0.8, 0.9, 1],
                                ease: "easeInOut"
                            }}
                        >
                            {"Lap Lap Store".split("").map((char, index) => (
                                <motion.span
                                    key={index}
                                    className={itim.className + " text-3xl font-black text-gray-800 cursor-pointer"}
                                    animate={{
                                        color: ["#1f2937", "#1f2937", "#2563eb", "#1f2937", "#1f2937"],
                                    }}
                                    transition={{
                                        duration: 4, // Match parent duration
                                        repeat: Infinity,
                                        times: [0, 0.3, 0.4 + (index * 0.03), 0.5 + (index * 0.03), 1], // Wave happens during the "Stay" phase (0.2-0.8)
                                        ease: "easeInOut",
                                    }}
                                >
                                    {char === " " ? "\u00A0" : char}
                                </motion.span>
                            ))}
                        </motion.div>
                    </Link>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-xl mx-4 relative hidden md:block">
                        <motion.div
                            className="relative"
                            initial={{ scale: 1 }}
                            animate={{ scale: isSearchFocused ? 1.05 : 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <input
                                type="text"
                                placeholder={placeholderText}
                                className={`w-full pl-10 pr-4 py-2 rounded-full border transition-all duration-300 ${isSearchFocused
                                    ? "border-blue-500 ring-2 ring-blue-200 shadow-lg"
                                    : "border-gray-300 hover:border-blue-400"
                                    } focus:outline-none`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                            />
                            <motion.div
                                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                                animate={{
                                    rotate: isSearchFocused ? [0, -10, 10, -10, 10, 0] : 0,
                                    scale: isSearchFocused ? 1.1 : 1
                                }}
                                transition={{ duration: 0.5 }}
                            >
                                <Search className={`w-5 h-5 ${isSearchFocused ? "text-blue-500" : "text-gray-400"}`} />
                            </motion.div>
                        </motion.div>

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
                                                    href={`/laptops/${product.slug || product._id}`}
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
                        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
                            <motion.div
                                animate={{ y: [0, -4, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <MapPin className="w-4 h-4 text-red-500" />
                            </motion.div>
                            <span className="font-bold text-gray-700">Cần Thơ</span>
                        </div>

                        {/* Fanpage Button - Unified Component */}
                        <div className="hidden sm:block">
                            <Button
                                href="https://facebook.com/profile.php?id=61582947329036"
                                variant="facebook"
                                size="sm"
                                rounded="full"
                                leftIcon={<Facebook className="w-5 h-5 fill-current" />}
                            >
                                Ghé thăm Fanpage
                            </Button>
                        </div>

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
            <nav className="hidden lg:block bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm transition-all duration-300">
                <div className="container mx-auto px-4">
                    <ul
                        className="flex justify-center items-center gap-1 py-1"
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        {menuItems.map((item, index) => {
                            const isActive = pathname === item.href;

                            return (
                                <li
                                    key={item.href}
                                    className="relative"
                                    onMouseEnter={() => setHoveredIndex(index)}
                                >
                                    <Link
                                        href={item.href}
                                        className={`${itim.className} relative z-10 block px-4 py-2.5 text-[15px] font-bold transition-colors duration-300 ${isActive ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900 focus:text-blue-600'
                                            }`}
                                    >
                                        {item.label}

                                        {/* Active State Dot */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeDot"
                                                className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"
                                            />
                                        )}
                                    </Link>

                                    {/* Hover Pill Effect */}
                                    {hoveredIndex === index && (
                                        <motion.div
                                            layoutId="hoverPill"
                                            className="absolute inset-0 bg-blue-50/80 rounded-xl z-0"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{
                                                type: "spring",
                                                bounce: 0.25,
                                                duration: 0.5
                                            }}
                                        />
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
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
