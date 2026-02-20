'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Mail, Phone, MapPin, User, ArrowRight, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61582947329036", label: "Fanpage", color: "hover:text-blue-500" },
        { icon: User, href: "https://www.facebook.com/tranphihao2k3/", label: "Admin", color: "hover:text-blue-400" },
        { icon: Phone, href: "tel:0978648720", label: "Zalo", color: "hover:text-green-500" },
        { icon: Mail, href: "mailto:laplapcantho@gmail.com", label: "Email", color: "hover:text-red-500" },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const [visitorCount, setVisitorCount] = useState<number | null>(null);

    useEffect(() => {
        const updateVisitors = async () => {
            try {
                // Determine if we should increment (once per session)
                const hasVisited = sessionStorage.getItem('hasVisited');

                if (!hasVisited) {
                    const res = await fetch('/api/stats/visitors', { method: 'POST' });
                    const data = await res.json();
                    if (data.success) {
                        setVisitorCount(data.count);
                        sessionStorage.setItem('hasVisited', 'true');
                    }
                } else {
                    const res = await fetch('/api/stats/visitors');
                    const data = await res.json();
                    if (data.success) {
                        setVisitorCount(data.count);
                    }
                }
            } catch (error) {
                console.error('Error with visitor counter:', error);
            }
        };

        updateVisitors();
    }, []);

    return (
        <footer className="relative bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-gray-300 overflow-hidden">
            {/* Animated Top Border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 animate-pulse"></div>

            {/* Main Footer Content */}
            <motion.div
                className="container mx-auto px-6 py-10 md:py-16"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">

                    {/* Brand Column */}
                    <motion.div variants={itemVariants} className="space-y-4 md:space-y-6 col-span-2 lg:col-span-1">
                        <Link href="/" className="inline-block">
                            <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                                LapLap
                            </h2>
                            <p className="text-xs md:text-sm font-medium text-gray-400 tracking-wider">LAPTOP CẦN THƠ</p>
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-400 hidden md:block">
                            Chuyên mua bán laptop cũ, laptop mới tại Cần Thơ. Sửa chữa (sữa laptop) uy tín, giá rẻ, lấy liền.
                        </p>

                        {/* Visitor Counter */}
                        <div className="pt-2">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/10 shadow-inner group">
                                <div className="p-1.5 bg-blue-500/20 rounded-lg text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                                    <Users size={14} className="animate-pulse" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 leading-none mb-1">Lượt truy cập</span>
                                    <span className="text-sm font-black text-white tabular-nums">
                                        {visitorCount !== null ? (
                                            visitorCount.toLocaleString('vi-VN')
                                        ) : (
                                            <span className="inline-block w-8 h-4 bg-white/10 animate-pulse rounded"></span>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-4 pt-4">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`p-2 bg-white/5 rounded-lg transition-all duration-300 hover:bg-white/10 ${social.color} hover:-translate-y-1`}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    aria-label={social.label}
                                >
                                    <social.icon size={20} />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Links Column */}
                    <motion.div variants={itemVariants}>
                        <h3 className="text-base md:text-lg font-bold text-white mb-4 md:mb-6 relative inline-block">
                            Liên kết nhanh
                            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-blue-500 rounded-full"></span>
                        </h3>
                        <ul className="space-y-2 md:space-y-3 text-sm md:text-base">
                            {[
                                { label: "Trang chủ", href: "/" },
                                { label: "Giới thiệu", href: "/gioi-thieu" },
                                { label: "Tuyển dụng", href: "/tuyen-dung" },
                                { label: "Sản phẩm Laptop", href: "/laptops" },
                                { label: "Kiểm tra máy", href: "/test" },
                                { label: "Sửa chữa", href: "/sua-chua-laptop" },
                            ].map((link, idx) => (
                                <li key={idx}>
                                    <Link href={link.href} className="group flex items-center gap-2 hover:text-blue-400 transition-colors">
                                        <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                        <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Services Column */}
                    <motion.div variants={itemVariants}>
                        <h3 className="text-base md:text-lg font-bold text-white mb-4 md:mb-6 relative inline-block">
                            Dịch vụ
                            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-purple-500 rounded-full"></span>
                        </h3>
                        <ul className="space-y-2 md:space-y-3 text-sm md:text-base">
                            {[
                                { label: "Vệ sinh laptop", href: "/ve-sinh-laptop" },
                                { label: "Cài đặt phần mềm", href: "/cai-dat-phan-mem" },
                                { label: "Nâng cấp linh kiện", href: "/nang-cap" },
                                { label: "Thu cũ đổi mới", href: "/thu-cu-doi-moi" },
                                { label: "Tra cứu bảo hành", href: "/tra-cuu-bao-hanh" },
                            ].map((link, idx) => (
                                <li key={idx}>
                                    <Link href={link.href} className="group flex items-center gap-2 hover:text-purple-400 transition-colors">
                                        <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                        <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact Column */}
                    <motion.div variants={itemVariants} className="space-y-4 md:space-y-6 col-span-2 lg:col-span-1">
                        <h3 className="text-base md:text-lg font-bold text-white mb-4 md:mb-6 relative inline-block">
                            Liên hệ
                            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-green-500 rounded-full"></span>
                        </h3>

                        <div className="space-y-4">
                            <motion.div
                                className="flex items-start gap-4"
                                whileHover={{ x: 5 }}
                            >
                                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 mt-1">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold text-white text-sm md:text-base">Địa chỉ</p>
                                    <p className="text-gray-400 text-sm md:text-base">....</p>
                                </div>
                            </motion.div>

                            <motion.div
                                className="flex items-start gap-4"
                                whileHover={{ x: 5 }}
                            >
                                <div className="p-2 bg-green-500/10 rounded-lg text-green-400 mt-1">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold text-white text-sm md:text-base">Hotline / Zalo</p>
                                    <a href="tel:0978648720" className="text-base md:text-lg font-bold text-green-400 hover:underline">0978.648.720</a>
                                </div>
                            </motion.div>

                            <motion.div
                                className="flex items-start gap-4"
                                whileHover={{ x: 5 }}
                            >
                                <div className="p-2 bg-red-500/10 rounded-lg text-red-400 mt-1">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold text-white text-sm md:text-base">Email</p>
                                    <a href="mailto:laplapcantho@gmail.com" className="text-sm text-gray-400 hover:text-white transition-colors">laplapcantho@gmail.com</a>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* SEO Keyword Block */}
            <div className="container mx-auto px-6 py-8 border-t border-white/5 opacity-40 hover:opacity-100 transition-opacity">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-[11px] leading-relaxed">
                    <div>
                        <h4 className="font-bold text-white mb-2 uppercase tracking-widest text-[10px]">Laptop Cũ Cần Thơ - LapLap</h4>
                        <p>LapLap là địa chỉ uy tín chuyên mua bán <strong>laptop cũ Cần Thơ</strong>. Chúng tôi cung cấp đa dạng các mẫu laptop Dell, HP, Lenovo, Macbook với chất lượng đảm bảo, bảo hành dài hạn. Nếu bạn đang tìm kiếm <strong>laptop giá rẻ Cần Thơ</strong>, hãy đến ngay LapLap để được tư vấn tận tâm và nhận nhiều ưu đãi hấp dẫn.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-2 uppercase tracking-widest text-[10px]">Công Cụ Test Laptop Online</h4>
                        <p>Website cung cấp hệ thống <strong>test laptop</strong> miễn phí, giúp khách hàng tự kiểm tra các tính năng như: test camera, test microphone, test loa, test màn hình và test bàn phím online nhanh chóng. Đây là <strong>công cụ test laptop</strong> hữu ích cho người dùng muốn kiểm tra máy nhanh mà không cần cài đặt phần mềm.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-2 uppercase tracking-widest text-[10px]">Dịch Vụ Máy Tính Cần Thơ</h4>
                        <p>Ngoài bán máy, chúng tôi còn có các dịch vụ như: <strong>vệ sinh laptop Cần Thơ</strong>, cài đặt phần mềm, nâng cấp SSD/RAM và <strong>sửa chữa laptop Cần Thơ</strong> lấy liền. Với phương châm uy tín là trên hết, LapLap cam kết mang lại sự hài lòng cho mọi khách hàng tại khu vực Cần Thơ và miền Tây.</p>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="relative border-t border-white/5 bg-black/20 backdrop-blur-sm">
                <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; {currentYear} LapLap - Laptop Cũ Cần Thơ. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link href="/terms" className="hover:text-white transition-colors">Điều khoản</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">Bảo mật</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;