import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Đánh Giá & Nhận Xét Laptop Cần Thơ | Review Khách Hàng - LapLap',
    description: 'Xem đánh giá thực tế của khách hàng về chất lượng sản phẩm và dịch vụ tại LapLap Cần Thơ. Hàng trăm review chân thực từ người mua laptop cũ uy tín.',
    keywords: [
        'review laptop cần thơ',
        'đánh giá laplap',
        'nhận xét khách hàng',
        'mua laptop cũ uy tín cần thơ',
        'feedback laplap',
        'laptop cũ chất lượng',
    ],
    openGraph: {
        title: 'Đánh Giá Khách Hàng - LapLap Cần Thơ',
        description: 'Hàng trăm đánh giá chân thực từ khách hàng đã mua laptop tại LapLap Cần Thơ.',
        type: 'website',
        url: 'https://laplapcantho.store/reviews',
    },
    alternates: {
        canonical: 'https://laplapcantho.store/reviews',
    },
};

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
