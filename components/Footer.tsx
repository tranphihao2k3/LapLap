'use client';

import Link from 'next/link';
import { Facebook, Instagram, Mail, Phone, MapPin, User, ArrowRight } from 'lucide-react';
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

    return (
        <footer className="relative bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-gray-300 overflow-hidden">
            {/* Animated Top Border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 animate-pulse"></div>

            {/* Main Footer Content */}
            <motion.div
                className="container mx-auto px-6 py-16"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Brand Column */}
                    <motion.div variants={itemVariants} className="space-y-6">
                        <Link href="/" className="inline-block">
                            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                                LapLap
                            </h2>
                            <p className="text-sm font-medium text-gray-400 tracking-wider">LAPTOP CẦN THƠ</p>
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-400">
                            Chuyên laptop chính hãng, giá tốt nhất Cần Thơ. Uy tín - Chất lượng - Tận tâm.
                        </p>
                        <div className="flex space-x-4 pt-2">
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
                        <h3 className="text-lg font-bold text-white mb-6 relative inline-block">
                            Liên kết nhanh
                            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-blue-500 rounded-full"></span>
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { label: "Trang chủ", href: "/" },
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
                        <h3 className="text-lg font-bold text-white mb-6 relative inline-block">
                            Dịch vụ
                            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-purple-500 rounded-full"></span>
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { label: "Vệ sinh laptop", href: "/ve-sinh-laptop" },
                                { label: "Cài đặt phần mềm", href: "/cai-dat-phan-mem" },
                                { label: "Nâng cấp linh kiện", href: "/nang-cap" },
                                { label: "Thu cũ đổi mới", href: "/thu-cu-doi-moi" },
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
                    <motion.div variants={itemVariants} className="space-y-6">
                        <h3 className="text-lg font-bold text-white mb-6 relative inline-block">
                            Liên hệ
                            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-green-500 rounded-full"></span>
                        </h3>

                        <div className="space-y-4">


                            <motion.div
                                className="flex items-start gap-4"
                                whileHover={{ x: 5 }}
                            >
                                <div className="p-2 bg-green-500/10 rounded-lg text-green-400 mt-1">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Hotline / Zalo</p>
                                    <a href="tel:0978648720" className="text-lg font-bold text-green-400 hover:underline">0978.648.720</a>
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
                                    <p className="font-semibold text-white">Email</p>
                                    <a href="mailto:laplapcantho@gmail.com" className="text-sm text-gray-400 hover:text-white transition-colors">laplapcantho@gmail.com</a>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Bottom Bar */}
            <div className="relative border-t border-white/5 bg-black/20 backdrop-blur-sm">
                <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; {currentYear} LapLap. Designed with ❤️ in Can Tho.</p>
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