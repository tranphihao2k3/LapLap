import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RepairClient from './RepairClient';
import JsonLd from '@/components/JsonLd';
import { buildBreadcrumbJsonLd, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
    title: "Sửa Chữa Laptop Cần Thơ Uy Tín | Thay Màn Hình, Cáp, Phím Lấy Liền",
    description: "Dịch vụ sửa chữa laptop chuyên nghiệp tại Cần Thơ. Sửa Dell, HP, MacBook, Asus, Acer... Chẩn đoán miễn phí, báo giá rõ ràng, xem trực tiếp, bảo hành lâu dài.",
    keywords: ["sửa laptop cần thơ", "thay màn hình laptop cần thơ", "sửa máy tính cần thơ", "vệ sinh laptop cần thơ", "thay phím laptop"],
    alternates: {
        canonical: `${SITE_URL}/sua-chua-laptop`,
    },
};

export default function RepairServicePage() {
    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Sửa chữa laptop",
        "provider": {
            "@type": "LocalBusiness",
            "name": "LapLap Cần Thơ",
            "image": `${SITE_URL}/logo.png`,
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Cần Thơ",
                "addressCountry": "VN"
            },
            "telephone": "+84-978648720"
        },
        "areaServed": {
            "@type": "City",
            "name": "Cần Thơ"
        },
        "description": "Dịch vụ sửa chữa laptop uy tín, chuyên nghiệp tại Cần Thơ. Chẩn đoán miễn phí, sửa lấy liền."
    };

    const breadcrumbs = buildBreadcrumbJsonLd([
        { name: 'Trang chủ', url: '/' },
        { name: 'Sửa chữa laptop', url: '/sua-chua-laptop' },
    ]);

    return (
        <>
            <JsonLd id="repair-service" data={serviceSchema} />
            <JsonLd id="repair-breadcrumb" data={breadcrumbs} />
            <Header />
            <RepairClient />
            <Footer />
        </>
    );
}
