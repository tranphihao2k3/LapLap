'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function WelcomeBanner() {
    const [banner, setBanner] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const res = await fetch('/api/banner');
                const data = await res.json();
                if (data.success && data.data && data.data.isActive) {
                    checkAndShow(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch banner:', error);
            }
        };

        const checkAndShow = (bannerData: any) => {
            const lastShown = localStorage.getItem('laplap_banner_last_shown');
            const now = Date.now();
            const ONE_HOUR = 60 * 60 * 1000;

            if (!lastShown || now - parseInt(lastShown) > ONE_HOUR) {
                setTimeout(() => {
                    setBanner(bannerData);
                    setIsVisible(true);
                }, bannerData.displayDelay || 2000);
            }
        };

        fetchBanner();
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem('laplap_banner_last_shown', Date.now().toString());
    };

    if (!banner || !isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    />

                    {/* Banner Content */}
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0, y: 100 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.5, opacity: 0, y: 100 }}
                        transition={{ type: "spring", damping: 20, stiffness: 200 }}
                        className="relative w-full max-w-[500px] aspect-[4/5] sm:aspect-square flex items-center justify-center z-10"
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute -top-12 sm:top-2 right-0 sm:-right-12 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md border border-white/20 transition-all active:scale-95 shadow-2xl z-20"
                        >
                            <X size={24} />
                        </button>

                        <div className="relative w-full h-full group">
                            <Link href={banner.link || '#'} onClick={handleClose} className="block w-full h-full relative">
                                <Image
                                    src={banner.imageUrl}
                                    alt={banner.title}
                                    fill
                                    className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-[1.02]"
                                    priority
                                />
                            </Link>

                            {/* Festive Decorations (Optional/Dynamic) */}
                            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2rem]">
                                {/* Add subtle particle effects or sparkles here later if needed */}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
