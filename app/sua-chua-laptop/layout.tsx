import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sửa Chữa Laptop Cần Thơ Uy Tín - Lấy Liền',
    description: 'Dịch vụ sửa chữa laptop uy tín tại Cần Thơ. Chuyên sửa main, thay màn hình, thay phím, nâng cấp SSD/RAM. Kỹ thuật viên tay nghề cao, bảo hành dài hạn.',
    keywords: ['sửa laptop cần thơ', 'sữa laptop cần thơ', 'sửa chữa laptop uy tín', 'thay màn hình laptop', 'thay pin laptop', 'sửa main laptop', 'laplap restore'],
    openGraph: {
        title: 'Sửa Chữa Laptop Cần Thơ Uy Tín - Lấy Liền, Giá Rẻ | LapLap',
        description: 'Dịch vụ sửa chữa laptop uy tín tại Cần Thơ. Chuyên sửa main, thay màn hình, thay phím, nâng cấp SSD/RAM.',
        type: 'website',
    }
};

export default function RepairLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
