import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Linh Kiện & Phụ Kiện Laptop Cần Thơ - Chính Hãng, Giá Rẻ | LapLap',
    description: 'Cung cấp linh kiện (RAM, SSD, Pin, Sạc, Phím, Màn hình) và phụ kiện laptop chính hãng tại Cần Thơ. Bảo hành dài hạn, thay thế lấy ngay.',
    keywords: ['ram laptop', 'ssd laptop', 'pin laptop', 'sạc laptop', 'bàn phím laptop', 'màn hình laptop', 'phụ kiện laptop cần thơ'],
    openGraph: {
        title: 'Linh Kiện & Phụ Kiện Laptop Cần Thơ - Chính Hãng, Giá Rẻ | LapLap',
        description: 'Cung cấp linh kiện laptop chính hãng tại Cần Thơ. Bảo hành uy tín, kỹ thuật viên chuyên nghiệp.',
        type: 'website',
    }
};

export default function AccessoriesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
