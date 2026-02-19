import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Laptop Cần Thơ - Mua Bán Laptop Cũ & Mới',
    description: 'Kho laptop cũ, mới lớn nhất Cần Thơ. Đa dạng mẫu mã Dell, HP, ThinkPad, Macbook. Bảo hành uy tín, trả góp 0%.',
    keywords: ['laptop cần thơ', 'laptop cũ cần thơ', 'mua laptop cũ', 'laptop giá rẻ', 'dell cần thơ', 'hp cần thơ', 'thinkpad cần thơ', 'macbook cần thơ'],
    openGraph: {
        title: 'Top Laptop Cần Thơ - Mới & Cũ Chính Hãng',
        description: 'Danh sách laptop chất lượng tại Cần Thơ. Giá tốt, hậu mãi chu đáo.',
    },
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
