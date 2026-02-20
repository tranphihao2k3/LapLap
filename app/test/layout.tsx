import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Công Cụ Test Laptop Online - Kiểm Tra Camera, Mic, Phím, Màn Hình',
    description: 'Công cụ test laptop miễn phí tại Cần Thơ. Kiểm tra camera, microphone, loa, màn hình, bàn phím online nhanh chóng, chính xác. Không cần cài đặt phần mềm.',
    keywords: [
        'test laptop',
        'công cụ test laptop',
        'kiểm tra laptop online',
        'test laptop cũ cần thơ',
        'test camera laptop',
        'test mic laptop',
        'test màn hình laptop',
        'test bàn phím online',
        'kiểm tra loa laptop'
    ],
    openGraph: {
        title: 'Công Cụ Test Laptop Online Miễn Phí - Tiện Ích LapLap Cần Thơ',
        description: 'Kiểm tra phần cứng laptop nhanh chóng: Camera, Mic, Bàn phím, Màn hình ngay trên trình duyệt.',
        type: 'website',
        url: 'https://laplapcantho.store/test',
    },
    alternates: {
        canonical: 'https://laplapcantho.store/test',
    }
};

export default function TestLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
