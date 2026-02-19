import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Kho Phần Mềm & Driver Laptop Cần Thơ Free',
    description: 'Tải phần mềm, driver laptop miễn phí tại Cần Thơ. Kho phần mềm văn phòng, đồ họa, hệ thống được kiểm duyệt an toàn, tốc độ cao. Hỗ trợ cài đặt từ xa.',
    keywords: ['cài win cần thơ', 'cài win laptop cần thơ', 'cài đặt phần mềm máy tính cần thơ', 'phần mềm laptop', 'driver laptop', 'sữa laptop cần thơ', 'download phần mềm', 'office miễn phí', 'laplap software'],
    openGraph: {
        title: 'Kho Phần Mềm Laptop & Driver Cần Thơ - Tải Miễn Phí | LapLap',
        description: 'Tải phần mềm, driver laptop miễn phí tại Cần Thơ. Kho phần mềm văn phòng, đồ họa, hệ thống được kiểm duyệt an toàn, tốc độ cao.',
        type: 'website',
    }
};

export default function SoftwareLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
