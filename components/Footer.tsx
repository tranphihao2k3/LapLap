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
                        <h2 className="text-2xl font-bold text-white">LapLap - Laptop Cần Thơ</h2>
                        <p className="text-sm leading-relaxed">
                            Chuyên cung cấp laptop chính hãng tại Cần Thơ. Laptop mới, laptop cũ giá tốt. Giao hàng tận nơi, bảo hành uy tín. Test laptop miễn phí.
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
                                <Link href="/laptops" className="hover:text-blue-400 transition-colors">Laptop</Link>
                            </li>
                            <li>
                                <Link href="/test" className="hover:text-blue-400 transition-colors">Test Laptop</Link>
                            </li>
                            <li>
                                <Link href="/sua-chua-laptop" className="hover:text-blue-400 transition-colors">Sửa chữa laptop</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service Column */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Dịch vụ</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/ve-sinh-laptop" className="hover:text-blue-400 transition-colors">Vệ sinh laptop</Link>
                            </li>
                            <li>
                                <Link href="/test" className="hover:text-blue-400 transition-colors">Kiểm tra laptop miễn phí</Link>
                            </li>
                            <li>
                                <span className="text-gray-400">Giao hàng tận nơi Cần Thơ</span>
                            </li>
                            <li>
                                <span className="text-gray-400">Bảo hành chính hãng</span>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info Column */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Liên hệ</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3">
                                <MapPin size={20} className="mt-1 flex-shrink-0 text-blue-400" />
                                <span>Cần Thơ, Việt Nam</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone size={20} className="flex-shrink-0 text-blue-400" />
                                <span>Liên hệ qua website</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail size={20} className="flex-shrink-0 text-blue-400" />
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