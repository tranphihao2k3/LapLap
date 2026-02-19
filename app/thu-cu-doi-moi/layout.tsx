import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Thu Cũ Đổi Mới Laptop Cần Thơ - Trợ Giá Tốt',
    description: 'Chương trình thu cũ đổi mới laptop tại Cần Thơ. Thu mua laptop cũ giá cao, trợ giá lên đời máy mới. Thủ tục nhanh gọn, định giá công khai.',
    keywords: ['thu cũ đổi mới laptop', 'thu mua laptop cũ cần thơ', 'đổi laptop cũ lấy mới', 'nâng cấp laptop', 'laplap trade-in', 'laptop cũ cần thơ', 'laplap cần thơ', 'thu mua laptop cu gia cao can tho'],
    openGraph: {
        title: 'Thu Cũ Đổi Mới Laptop Cần Thơ - Trợ Giá Lên Đời Tốt Nhất | LapLap',
        description: 'Chương trình thu cũ đổi mới laptop tại Cần Thơ. Thu mua laptop cũ giá cao, trợ giá lên đời máy mới.',
        type: 'website',
    }
};

export default function TradeInLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
