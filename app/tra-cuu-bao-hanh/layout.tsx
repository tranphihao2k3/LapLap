import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Tra Cứu Bảo Hành Laptop | Kiểm Tra Bảo Hành Chính Hãng - LapLap Cần Thơ',
    description: 'Tra cứu thông tin bảo hành đơn hàng tại LapLap Cần Thơ hoặc kiểm tra bảo hành chính hãng từ Dell, HP, Asus, Lenovo, Apple. Nhanh chóng, chính xác.',
    keywords: [
        'tra cứu bảo hành laptop',
        'kiểm tra bảo hành laptop',
        'bảo hành laptop cần thơ',
        'tra cứu bảo hành dell',
        'tra cứu bảo hành hp',
        'tra cứu bảo hành asus',
        'bảo hành apple macbook',
        'laplap bảo hành',
        'warranty lookup laptop',
    ],
    openGraph: {
        title: 'Tra Cứu Bảo Hành Laptop Nhanh Chóng | LapLap Cần Thơ',
        description: 'Kiểm tra trạng thái bảo hành đơn hàng tại LapLap hoặc tra cứu bảo hành chính hãng các hãng laptop lớn.',
        type: 'website',
        url: 'https://laplapcantho.store/tra-cuu-bao-hanh',
    },
    alternates: {
        canonical: 'https://laplapcantho.store/tra-cuu-bao-hanh',
    },
};

export default function WarrantyLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
