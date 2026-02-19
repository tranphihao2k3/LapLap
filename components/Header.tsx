'use client';

import Link from "next/link";
import Image from "next/image";
import { Itim } from "next/font/google";
import { MapPin, Menu, X, Facebook, Search, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Button from "./ui/Button";
import { useCart } from "@/context/CartContext";

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

    const { isCartOpen, setIsCartOpen, totalItems } = useCart();

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
        { href: "/linh-kien-phu-kien", label: "Linh kiện & Phụ kiện" },
        {
            label: "Dịch vụ",
            href: "#",
            children: [
                { href: "/thu-cu-doi-moi", label: "Thu cũ đổi mới" },
                { href: "/nang-cap", label: "Nâng cấp" },
                { href: "/ve-sinh-laptop", label: "Vệ sinh máy" },
                { href: "/sua-chua-laptop", label: "Sửa chữa" },
                { href: "/test", label: "Kiểm tra máy" },
                { href: "/cai-dat-phan-mem", label: "Driver & Soft" },
            ]
        },
        {
            label: "Về Shop",
            href: "#",
            children: [
                { href: "/gioi-thieu", label: "Giới thiệu" },
                { href: "/reviews", label: "Đánh giá" },
                { href: "/blog", label: "Blog" },
            ]
        },
    ];

    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);

    // Header visibility on scroll
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show header if scrolling up OR at the very top (buffer zone)
            if (currentScrollY < lastScrollY.current || currentScrollY < 10) {
                setIsVisible(true);
            }
            // Hide header if scrolling down AND past the top threshold
            else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                setIsVisible(false);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    return (
        <header className={`w-full sticky top-0 z-50 shadow-md bg-white transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
            {/* Logo */}
            <div className="bg-white">
                <div className="container mx-auto max-w-7xl px-4 py-3 flex flex-wrap md:flex-row justify-between items-center gap-y-4 md:gap-6">
                    <div className="flex-shrink-0 min-w-[200px]">
                        <Link href="/" className="group relative z-10 block">
                            <motion.div
                                className="flex items-center origin-left"
                                animate={{ scale: [0, 1.05, 1, 1, 1.05, 0] }}
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
                                        className={itim.className + " text-3xl font-black text-gray-800 cursor-pointer inline-block"}
                                        animate={{
                                            color: ["#1f2937", "#1f2937", "#2563eb", "#1f2937", "#1f2937"],
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            times: [0, 0.3, 0.4 + (index * 0.03), 0.5 + (index * 0.03), 1],
                                            ease: "easeInOut",
                                        }}
                                    >
                                        {char === " " ? "\u00A0" : char}
                                    </motion.span>
                                ))}
                            </motion.div>
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="w-full md:flex-1 max-w-md md:mx-4 relative order-3 md:order-none">
                        <motion.div
                            className="relative"
                            initial={{ scale: 1 }}
                            animate={{ scale: isSearchFocused ? 1.05 : 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <input
                                type="text"
                                placeholder={placeholderText}
                                className={`w-full pl-10 pr-12 py-2.5 rounded-full border transition-all duration-300 ${isSearchFocused
                                    ? "border-blue-500 ring-4 ring-blue-100 shadow-xl bg-white"
                                    : "border-gray-200 hover:border-blue-300 bg-gray-50/50"
                                    } focus:outline-none font-medium text-slate-700`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                            />

                            {/* Clear Button */}
                            <AnimatePresence>
                                {searchTerm && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        onClick={() => setSearchTerm("")}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                                    >
                                        <X size={14} />
                                    </motion.button>
                                )}
                            </AnimatePresence>
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

                        {/* Premium Search Results Dropdown */}
                        <AnimatePresence>
                            {isSearchFocused && (searchTerm.length > 0 || searchResults.length > 0) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-full left-0 right-0 mt-3 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/40 overflow-hidden z-[100] ring-1 ring-black/5"
                                >
                                    <div className="p-4 border-b border-gray-100/50 bg-gray-50/50 flex justify-between items-center">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Kết quả tìm kiếm</h3>
                                        {searchResults.length > 0 && !isLoading && (
                                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                                {searchResults.length} sản phẩm
                                            </span>
                                        )}
                                    </div>

                                    <div className="max-h-[min(480px,70vh)] overflow-y-auto no-scrollbar custom-scrollbar">
                                        {isLoading ? (
                                            <div className="p-10 text-center">
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    className="w-8 h-8 border-2 border-blue-100 border-t-blue-600 rounded-full mx-auto mb-3"
                                                />
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Đang tìm dữ liệu...</p>
                                            </div>
                                        ) : searchResults.length > 0 ? (
                                            <div className="p-2 space-y-1">
                                                {searchResults.map((product, idx) => (
                                                    <motion.div
                                                        key={product._id}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.05 }}
                                                    >
                                                        <Link
                                                            href={`/laptops/${product.slug || product._id}`}
                                                            className="flex items-center gap-4 p-3 hover:bg-white hover:shadow-lg hover:shadow-blue-500/5 rounded-2xl transition-all duration-300 group relative border border-transparent hover:border-blue-100 active:scale-[0.98]"
                                                            onClick={() => setIsSearchFocused(false)}
                                                        >
                                                            <div className="w-16 h-16 relative flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 group-hover:scale-105 transition-transform duration-500">
                                                                <Image
                                                                    src={product.image || product.images?.[0] || 'https://placehold.co/100x100?text=No+Image'}
                                                                    alt={product.name}
                                                                    fill
                                                                    className="object-contain p-1"
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className={`${itim.className} text-sm font-bold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors uppercase tracking-tight`}>
                                                                    {product.name}
                                                                </h4>
                                                                <div className="flex flex-wrap gap-1 mt-1">
                                                                    {product.specs?.cpu && (
                                                                        <span className="text-[9px] font-black text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 uppercase">
                                                                            {product.specs.cpu.split(' ')[0]}
                                                                        </span>
                                                                    )}
                                                                    {product.specs?.ram && (
                                                                        <span className="text-[9px] font-black text-blue-400 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 uppercase">
                                                                            {product.specs.ram}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="mt-1 flex items-baseline gap-2">
                                                                    <span className="text-sm font-black text-rose-600">
                                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                                                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                                                                    <Search size={14} />
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        ) : searchTerm.length > 0 ? (
                                            <div className="p-12 text-center">
                                                <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-4 text-gray-300 border border-dashed border-gray-200">
                                                    <X size={24} />
                                                </div>
                                                <p className="text-sm font-bold text-gray-500">Không tìm thấy sản phẩm nào</p>
                                                <p className="text-[10px] text-gray-400 mt-1">Hãy thử từ khóa khác như "Dell XPS" hoặc "Nitro 5"</p>
                                            </div>
                                        ) : null}
                                    </div>

                                    {searchResults.length > 0 && !isLoading && (
                                        <Link
                                            href={`/laptops?search=${encodeURIComponent(searchTerm)}`}
                                            className="block p-4 bg-gray-50/80 text-center text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 border-t border-gray-100/50"
                                            onClick={() => setIsSearchFocused(false)}
                                        >
                                            Xem tất cả kết quả cho "{searchTerm}"
                                        </Link>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 order-2 md:order-none ml-auto md:ml-0">
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

                        {/* Wishlist/Compare (Future) */}

                        {/* Cart Button */}
                        <div className="relative">
                            <button
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
                                onClick={() => setIsCartOpen(true)}
                            >
                                <ShoppingBag className="w-6 h-6 text-gray-700" />
                                {totalItems > 0 && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white"
                                    >
                                        {totalItems}
                                    </motion.div>
                                )}
                            </button>
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
                <div className="container mx-auto max-w-7xl px-4">
                    <ul
                        className="flex justify-center items-center gap-1 py-1"
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        {menuItems.map((item, index) => {
                            const isActive = pathname === item.href || (item.children && item.children.some(child => pathname === child.href));

                            return (
                                <li
                                    key={index}
                                    className="relative group/menu"
                                    onMouseEnter={() => setHoveredIndex(index)}
                                >
                                    <Link
                                        href={item.href}
                                        className={`${itim.className} relative z-10 block px-4 py-2 text-[15px] font-bold transition-colors duration-300 ${isActive ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900 group-hover/menu:text-blue-600'
                                            } flex items-center gap-1`}
                                    >
                                        {item.label}
                                        {item.children && (
                                            <svg xmlns="http://www.w3.org/2000/svg" className={`w-3 h-3 transition-transform duration-200 ${hoveredIndex === index ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        )}

                                        {/* Active State Dot */}
                                        {isActive && !item.children && (
                                            <motion.div
                                                layoutId="activeDot"
                                                className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"
                                            />
                                        )}
                                    </Link>

                                    {/* Hover Pill Effect */}
                                    {hoveredIndex === index && !item.children && (
                                        <motion.div
                                            layoutId="hoverPill"
                                            className="absolute inset-0 bg-blue-50/80 rounded-xl z-0"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                                        />
                                    )}

                                    {/* Dropdown Menu */}
                                    {item.children && (
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-300 transform group-hover/menu:translate-y-0 translate-y-2 z-50 min-w-[200px]">
                                            <div className="bg-white rounded-xl shadow-xl shadow-blue-500/10 border border-slate-100 overflow-hidden p-1.5 ring-1 ring-black/5">
                                                {item.children.map((child, childIdx) => (
                                                    <Link
                                                        key={childIdx}
                                                        href={child.href}
                                                        className={`${itim.className} block px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors whitespace-nowrap`}
                                                    >
                                                        {child.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>

            {/* Mobile Sidebar */}
            <div
                className={`fixed inset-0 bg-black/50 z-[100] lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsMobileMenuOpen(false)}
            >
                <div
                    className={`fixed top-0 right-0 h-full h-screen w-[280px] bg-white z-[101] shadow-2xl transform transition-transform duration-300 overflow-y-auto ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                    onClick={(e) => e.stopPropagation()}
                    style={{ backgroundColor: '#ffffff' }}
                >
                    {/* Sidebar Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
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
                    <div className="px-4 py-2 bg-blue-50 border-b border-gray-200">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span className="font-medium">Cần Thơ</span>
                        </div>
                    </div>

                    {/* Mobile Fanpage Button */}
                    <div className="px-4 py-2">
                        <a
                            href="https://facebook.com/profile.php?id=61582947329036"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[#1877F2] text-white rounded-xl shadow-md font-bold active:scale-95 transition-transform text-sm"
                        >
                            <Facebook className="w-4 h-4 animate-pulse" />
                            <span>Ghé thăm Fanpage</span>
                        </a>
                    </div>

                    {/* Menu Items */}
                    <nav className="px-4 py-2">
                        <ul className="space-y-1">
                            {menuItems.map((item: any, index) => (
                                <li key={index}>
                                    {item.children ? (
                                        <div className="space-y-1">
                                            <div className={`${itim.className} block px-4 py-2 text-sm font-bold text-gray-400 uppercase tracking-wider`}>
                                                {item.label}
                                            </div>
                                            {item.children.map((child: any, childIdx: number) => (
                                                <Link
                                                    key={childIdx}
                                                    href={child.href}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className={`${itim.className} block px-4 py-2.5 pl-8 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors`}
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`${itim.className} block px-4 py-2.5 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors`}
                                        >
                                            {item.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
}
