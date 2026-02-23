import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RecruitmentClient from './RecruitmentClient';
import JsonLd from '@/components/JsonLd';
import { buildBreadcrumbJsonLd, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
    title: "Tuyển Dụng Nhân Sự | Cơ Hội Việc Làm Tại LapLap Cần Thơ",
    description: "Gia nhập đội ngũ LapLap Cần Thơ. Cơ hội phát triển sự nghiệp trong ngành laptop. Tuyển dụng kỹ thuật viên sửa chữa, nhân viên bán hàng laptop.",
    alternates: {
        canonical: `${SITE_URL}/tuyen-dung`,
    },
};

export default function RecruitmentPage() {
    const breadcrumbs = buildBreadcrumbJsonLd([
        { name: 'Trang chủ', url: '/' },
        { name: 'Tuyển dụng', url: '/tuyen-dung' },
    ]);

    return (
        <>
            <JsonLd id="recruitment-breadcrumb" data={breadcrumbs} />
            <Header />
            <RecruitmentClient />
            <Footer />
        </>
    );
}
