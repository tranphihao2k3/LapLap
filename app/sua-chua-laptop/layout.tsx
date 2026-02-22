import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { buildServiceJsonLd, buildBreadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
    title: 'Sửa Chữa Laptop Cần Thơ Uy Tín - Lấy Liền | LapLap',
    description: 'Dịch vụ sửa chữa laptop uy tín tại Cần Thơ. Chuyên sửa main, thay màn hình, thay phím, nâng cấp SSD/RAM. Kỹ thuật viên tay nghề cao, bảo hành dài hạn.',
    keywords: ['sửa laptop cần thơ', 'sữa laptop cần thơ', 'sửa chữa laptop uy tín', 'thay màn hình laptop', 'thay pin laptop', 'sửa main laptop', 'laplap restore'],
    alternates: {
        canonical: 'https://laplapcantho.store/sua-chua-laptop',
    },
    openGraph: {
        title: 'Sửa Chữa Laptop Cần Thơ Uy Tín - Lấy Liền, Giá Rẻ | LapLap',
        description: 'Dịch vụ sửa chữa laptop uy tín tại Cần Thơ. Chuyên sửa main, thay màn hình, thay phím, nâng cấp SSD/RAM.',
        type: 'website',
        url: 'https://laplapcantho.store/sua-chua-laptop',
    }
};

export default function RepairLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const serviceJsonLd = buildServiceJsonLd({
        name: 'Sửa Chữa Laptop Cần Thơ',
        description: 'Dịch vụ sửa chữa laptop uy tín tại Cần Thơ. Chuyên sửa main, thay màn hình, thay phím, nâng cấp SSD/RAM. Kỹ thuật viên tay nghề cao.',
        url: '/sua-chua-laptop',
        priceRange: '₫₫',
    });

    const breadcrumbJsonLd = buildBreadcrumbJsonLd([
        { name: 'Trang chủ', url: '/' },
        { name: 'Sửa Chữa Laptop', url: '/sua-chua-laptop' },
    ]);

    return (
        <>
            <JsonLd id="service-repair-jsonld" data={serviceJsonLd} />
            <JsonLd id="breadcrumb-repair-jsonld" data={breadcrumbJsonLd} />
            {children}
        </>
    );
}
