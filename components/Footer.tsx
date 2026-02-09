import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* Main Footer Content */}
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Brand Column */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">LapLap</h2>
                        <p className="text-sm leading-relaxed">
                            Chuyên cung cấp các dòng laptop chất lượng cao, phục vụ nhu cầu học tập, làm việc và giải trí. Uy tín tạo nên thương hiệu.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="#" className="hover:text-white transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="hover:text-white transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="hover:text-white transition-colors">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links Column */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Liên kết nhanh</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="hover:text-blue-400 transition-colors">Trang chủ</Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-blue-400 transition-colors">Giới thiệu</Link>
                            </li>
                            <li>
                                <Link href="/products" className="hover:text-blue-400 transition-colors">Sản phẩm</Link>
                            </li>
                            <li>
                                <Link href="/blog" className="hover:text-blue-400 transition-colors">Tin tức</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service Column */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Hỗ trợ khách hàng</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/faq" className="hover:text-blue-400 transition-colors">Câu hỏi thường gặp</Link>
                            </li>
                            <li>
                                <Link href="/policy/warranty" className="hover:text-blue-400 transition-colors">Chính sách bảo hành</Link>
                            </li>
                            <li>
                                <Link href="/policy/return" className="hover:text-blue-400 transition-colors">Chính sách đổi trả</Link>
                            </li>
                            <li>
                                <Link href="/policy/privacy" className="hover:text-blue-400 transition-colors">Chính sách bảo mật</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info Column */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Liên hệ</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3">
                                <MapPin size={20} className="mt-1 flex-shrink-0" />
                                <span>123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone size={20} className="flex-shrink-0" />
                                <span>0912 345 678</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail size={20} className="flex-shrink-0" />
                                <span>contact@laplap.vn</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-sm">
                    <p>&copy; {currentYear} LapLap. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link href="/terms" className="hover:text-white transition-colors">Điều khoản sử dụng</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">Bảo mật</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;