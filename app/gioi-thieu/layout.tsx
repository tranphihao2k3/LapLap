import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Về LapLap Cần Thơ | Hệ Thống Bán Lẻ Laptop Uy Tín Hàng Đầu',
    description: 'Tìm hiểu về LapLap Cần Thơ - Địa chỉ mua bán laptop cũ, laptop mới uy tín. Cam kết chất lượng, bảo hành chu đáo, hậu mãi tận tâm.',
    keywords: ['laplap cần thơ', 'giới thiệu laplap', 'cửa hàng laptop uy tín cần thơ', 'mua laptop ở đâu uy tín cần thơ', 'trần phi hào'],
    openGraph: {
        title: 'Về Chúng Tôi - LapLap Cần Thơ',
        description: 'Câu chuyện thương hiệu và cam kết chất lượng của LapLap.',
    },
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
