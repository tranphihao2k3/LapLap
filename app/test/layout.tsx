import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Test Laptop Online - Mic, Cam, Phím, Màn Hình',
    description: 'Công cụ test laptop miễn phí tại Cần Thơ. Kiểm tra camera, microphone, loa, màn hình, bàn phím online. Kết quả chính xác 100%, không cần cài đặt.',
    keywords: ['test laptop', 'test laptop cũ cần thơ', 'kiểm tra laptop cũ', 'test camera', 'test mic', 'test màn hình', 'test bàn phím', 'test loa', 'laplap test'],
    openGraph: {
        title: 'Test Laptop Online Miễn Phí - Camera, Mic, Màn Hình, Bàn Phím | LapLap',
        description: 'Công cụ test laptop miễn phí tại Cần Thơ. Kiểm tra camera, microphone, loa, màn hình, bàn phím online.',
        type: 'website',
    }
};

export default function TestLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
