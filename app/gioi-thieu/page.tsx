import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AboutClient from './AboutClient';
import JsonLd from '@/components/JsonLd';
import { buildBreadcrumbJsonLd, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
    title: "Giới Thiệu LapLap | Hệ Thống Mua Bán Laptop Uy Tín Tại Cần Thơ",
    description: "Khám phá hành trình hơn 5 năm của LapLap Cần Thơ. Chuyên laptop Dell, HP, ThinkPad, MacBook chính hãng. Tận tâm phục vụ, uy tín hàng đầu.",
    alternates: {
        canonical: `${SITE_URL}/gioi-thieu`,
    },
    openGraph: {
        title: "Giới Thiệu LapLap | Hệ Thống Mua Bán Laptop Uy Tín Tại Cần Thơ",
        description: "Hơn 5 năm đồng hành cùng người dùng Cần Thơ, LapLap mang đến giải pháp công nghệ toàn diện và niềm tin tuyệt đối.",
        url: `${SITE_URL}/gioi-thieu`,
    }
};

export default function AboutPage() {
    const breadcrumbs = buildBreadcrumbJsonLd([
        { name: 'Trang chủ', url: '/' },
        { name: 'Giới thiệu', url: '/gioi-thieu' },
    ]);

    return (
        <>
            <JsonLd id="about-breadcrumb" data={breadcrumbs} />
            <Header />
            <AboutClient />
            <Footer />
        </>
    );
}
