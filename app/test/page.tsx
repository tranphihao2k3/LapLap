import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TestClient from './TestClient';
import JsonLd from '@/components/JsonLd';
import { buildBreadcrumbJsonLd, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
    title: "Test Laptop Online Miễn Phí | Kiểm Tra Camera, Loa, Mic, Màn Hình",
    description: "Bộ công cụ test laptop online miễn phí: test camera, test microphone, test loa, test màn hình điểm chết và test bàn phím. Kiểm tra laptop cũ Cần Thơ nhanh chóng.",
    keywords: ["test laptop online", "kiểm tra camera laptop", "test mic laptop", "test screen laptop", "test bàn phím"],
    alternates: {
        canonical: `${SITE_URL}/test`,
    },
};

export default function UnifiedTestPage() {
    const testSchema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Công cụ Test Laptop Online - LapLap",
        "url": `${SITE_URL}/test`,
        "description": "Kiểm tra camera, micro, loa, màn hình, bàn phím laptop online miễn phí.",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "VND"
        }
    };

    const breadcrumbs = buildBreadcrumbJsonLd([
        { name: 'Trang chủ', url: '/' },
        { name: 'Test laptop online', url: '/test' },
    ]);

    return (
        <>
            <JsonLd id="test-tool" data={testSchema} />
            <JsonLd id="test-breadcrumb" data={breadcrumbs} />
            <Header />
            <TestClient />
            <Footer />
        </>
    );
}
