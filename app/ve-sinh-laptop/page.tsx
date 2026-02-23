import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CleaningClient from './CleaningClient';
import JsonLd from '@/components/JsonLd';
import { buildBreadcrumbJsonLd, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
    title: "Vệ Sinh Laptop Cần Thơ | Lấy Liền 30 Phút | Keo MX4 Chính Hãng",
    description: "Dịch vụ vệ sinh laptop chuyên nghiệp tại Cần Thơ. Vệ sinh máy, tra keo tản nhiệt MX-4/MX-6, lấy liền chỉ sau 30-45 phút. Giúp máy mát, chạy mượt, tăng tuổi thọ.",
    keywords: ["vệ sinh laptop cần thơ", "tra keo tản nhiệt laptop", "vệ sinh máy tính cần thơ", "bảo dưỡng laptop"],
    alternates: {
        canonical: `${SITE_URL}/ve-sinh-laptop`,
    },
};

export default function CleaningServicePage() {
    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Vệ sinh laptop",
        "provider": {
            "@type": "LocalBusiness",
            "name": "LapLap Cần Thơ",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Cần Thơ",
                "addressCountry": "VN"
            },
            "url": SITE_URL
        },
        "areaServed": "Cần Thơ",
        "description": "Dịch vụ vệ sinh laptop chuyên nghiệp tại Cần Thơ. Sử dụng keo tản nhiệt cao cấp MX4/MX6, lấy liền sau 30 phút."
    };

    const breadcrumbs = buildBreadcrumbJsonLd([
        { name: 'Trang chủ', url: '/' },
        { name: 'Vệ sinh laptop', url: '/ve-sinh-laptop' },
    ]);

    return (
        <>
            <JsonLd id="service-schema" data={serviceSchema} />
            <JsonLd id="breadcrumb-schema" data={breadcrumbs} />
            <Header />
            <CleaningClient />
            <Footer />
        </>
    );
}
