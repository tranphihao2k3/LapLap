"use client";

import { Home, Laptop, Cpu, Wrench, RefreshCw } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function MobileBottomMenu() {
    const pathname = usePathname();

    // Only show on mobile (hidden on md and up)
    // Also hidden on admin routes to not clutter
    if (pathname.startsWith('/admin')) return null;

    const navItems = [
        { href: "/", label: "Trang chủ", icon: Home },
        { href: "/laptops", label: "Laptop", icon: Laptop },
        { href: "/linh-kien-phu-kien", label: "Linh kiện", icon: Cpu },
        { href: "/sua-chua-laptop", label: "Sửa chữa", icon: Wrench },
        { href: "/thu-cu-doi-moi", label: "Thu cũ", icon: RefreshCw },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-gray-200 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] md:hidden pb-safe">
            <div className="flex justify-around items-center h-16 px-2">
                {navItems.map((item, index) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={index}
                            href={item.href}
                            className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 w-full ${isActive ? "text-blue-600" : "text-gray-400 hover:text-blue-500"
                                }`}
                        >
                            {/* Active Indicator Background */}
                            {isActive && (
                                <motion.div
                                    layoutId="bottomNavIndicator"
                                    className="absolute inset-0 bg-blue-50 rounded-xl -z-10"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}

                            <div className="relative">
                                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "scale-110" : ""} />

                            </div>
                            <span className="text-[10px] font-medium mt-1 truncate max-w-[60px]">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
            {/* Safe area spacing for iPhone X+ */}
            <div className="h-[env(safe-area-inset-bottom)] bg-white"></div>
        </div>
    );
}
