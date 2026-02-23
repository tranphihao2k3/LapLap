import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WarrantyClient from './WarrantyClient';
import JsonLd from '@/components/JsonLd';
import { buildBreadcrumbJsonLd, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
    title: "Tra Cứu Bảo Hành Laptop | Chính Sách Bảo Hành LapLap Cần Thơ",
    description: "Kiểm tra thời hạn bảo hành laptop Dell, HP, ASUS, MacBook... Tra cứu đơn hàng tại LapLap Cần Thơ nhanh chóng bằng số điện thoại hoặc mã đơn hàng.",
    keywords: ["tra cứu bảo hành", "bảo hành laptop dell", "bảo hành laptop hp", "chính sách bảo hành laplap"],
    alternates: {
        canonical: `${SITE_URL}/tra-cuu-bao-hanh`,
    },
};

export default function WarrantyPage() {
    const breadcrumbs = buildBreadcrumbJsonLd([
        { name: 'Trang chủ', url: '/' },
        { name: 'Tra cứu bảo hành', url: '/tra-cuu-bao-hanh' },
    ]);

    return (
        <>
            <JsonLd id="warranty-breadcrumb" data={breadcrumbs} />
            <Header />
            <WarrantyClient />
            <Footer />
        </>
    );
}
