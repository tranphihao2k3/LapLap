import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'So Sánh Laptop - Tìm Laptop Phù Hợp Nhất | LapLap Cần Thơ',
    description: 'Công cụ so sánh laptop trực quan. So sánh thông số kỹ thuật, giá cả, hiệu năng giữa các dòng laptop để đưa ra lựa chọn tốt nhất cho nhu cầu của bạn.',
    keywords: [
        'so sánh laptop',
        'so sánh cấu hình laptop',
        'laptop nào tốt hơn',
        'so sánh thông số laptop',
        'chọn laptop phù hợp',
        'laptop cần thơ so sánh',
    ],
    openGraph: {
        title: 'So Sánh Laptop - Chọn Máy Phù Hợp Nhất | LapLap Cần Thơ',
        description: 'So sánh thông số kỹ thuật và giá cả giữa các laptop để đưa ra quyết định mua hàng thông minh.',
        type: 'website',
        url: 'https://laplapcantho.store/so-sanh',
    },
    alternates: {
        canonical: 'https://laplapcantho.store/so-sanh',
    },
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
