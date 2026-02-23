import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SoftwareClient from './SoftwareClient';
import JsonLd from '@/components/JsonLd';
import { buildBreadcrumbJsonLd, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
    title: "Kho Driver Laptop & Phần Mềm Miễn Phí | LapLap Cần Thơ",
    description: "Tổng hợp link tải driver laptop Dell, HP, Lenovo, MacBook và các phần mềm văn phòng, tiện ích cần thiết. Link Google Drive tốc độ cao, an toàn tuyệt đối.",
    keywords: ["driver laptop", "tải phần mềm laptop", "office laptop", "driver dell", "driver hp"],
    alternates: {
        canonical: `${SITE_URL}/cai-dat-phan-mem`,
    },
};

export default function SoftwarePage() {
    const breadcrumbs = buildBreadcrumbJsonLd([
        { name: 'Trang chủ', url: '/' },
        { name: 'Phần mềm laptop', url: '/cai-dat-phan-mem' },
    ]);

    return (
        <>
            <JsonLd id="software-breadcrumb" data={breadcrumbs} />
            <Header />
            <SoftwareClient />
            <Footer />
        </>
    );
}
