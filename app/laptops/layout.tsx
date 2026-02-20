import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Laptop Cần Thơ - Danh Sách Laptop Cũ & Mới Giá Tốt',
    description: 'Kho laptop cũ Cần Thơ lớn nhất. Cung cấp laptop Dell, HP, ThinkPad, Macbook chính hãng uy tín. Bảo hành dài hạn, hỗ trợ trả góp 0%, giao hàng tận nơi.',
    keywords: [
        'laptop cần thơ',
        'laptop cũ cần thơ',
        'mua laptop cần thơ',
        'laptop cũ giá rẻ cần thơ',
        'dell cần thơ',
        'hp cần thơ',
        'thinkpad cần thơ',
        'macbook cần thơ',
        'laplap store'
    ],
    openGraph: {
        title: 'Laptop Cần Thơ - Mua Bán Laptop Cũ & Mới Uy Tín | LapLap',
        description: 'Đa dạng các dòng máy văn phòng, gaming, đồ họa tại Cần Thơ. Giá tốt nhất thị trường.',
        url: 'https://laplapcantho.store/laptops',
    },
    alternates: {
        canonical: 'https://laplapcantho.store/laptops',
    }
};

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LaptopsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
}
