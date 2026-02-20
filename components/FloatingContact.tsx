"use client";

import { MessageCircle, Phone, Facebook } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function FloatingContact() {
    const [isOpen, setIsOpen] = useState(false);

    const contactOptions = [
        {
            label: "Zalo",
            icon: <MessageCircle className="w-6 h-6" />,
            color: "bg-blue-600",
            href: "https://zalo.me/0978648720",
        },
        {
            label: "Messenger",
            icon: <Facebook className="w-6 h-6" />,
            color: "bg-blue-500",
            href: "https://m.me/laptopcantho",
        },
        {
            label: "Gọi ngay",
            icon: <Phone className="w-6 h-6" />,
            color: "bg-green-500",
            href: "tel:0978648720",
        },
    ];

    return (
        <motion.div
            drag
            dragMomentum={false}
            dragConstraints={{ left: -1000, right: 0, top: -800, bottom: 0 }}
            className="fixed hidden md:flex bottom-6 right-6 z-[120] flex-col items-end gap-3 cursor-move"
        >
            <AnimatePresence>
                {isOpen && (
                    <div className="flex flex-col gap-3 mb-2">
                        {contactOptions.map((item, index) => (
                            <motion.a
                                key={index}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                                transition={{ delay: index * 0.1 }}
                                className={`flex items-center gap-3 pr-1 group pointer-events-auto`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <span className="bg-white text-gray-700 px-3 py-1 rounded-lg shadow-md text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    {item.label}
                                </span>
                                <div className={`${item.color} w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-900/20 hover:scale-110 transition-transform`}>
                                    {item.icon}
                                </div>
                            </motion.a>
                        ))}
                    </div>
                )}
            </AnimatePresence>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-500/30 transition-all duration-300 pointer-events-auto ${isOpen ? "bg-red-500 rotate-45" : "bg-blue-600 hover:bg-blue-700 animate-bounce-slow"}`}
            >
                {isOpen ? (
                    <span className="text-3xl font-light">+</span>
                ) : (
                    <MessageCircle className="w-7 h-7" />
                )}
            </button>

            {/* Ping animation effect when closed */}
            {!isOpen && (
                <span className="absolute bottom-0 right-0 w-14 h-14 rounded-full bg-blue-500 opacity-75 animate-ping -z-10"></span>
            )}
        </motion.div>
    );
}
