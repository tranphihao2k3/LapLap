import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogClient from './BlogClient';
import JsonLd from '@/components/JsonLd';
import { buildBreadcrumbJsonLd, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
    title: "Blog Công Nghệ & Thủ Thuật Laptop | LapLap Cần Thơ",
    description: "Kênh tin tức công nghệ, đánh giá laptop, hướng dẫn sửa chữa và thủ thuật hay. Cập nhật mới nhất từ LapLap Cần Thơ.",
    alternates: {
        canonical: `${SITE_URL}/blog`,
    },
};

export default function BlogPage() {
    const breadcrumbs = buildBreadcrumbJsonLd([
        { name: 'Trang chủ', url: '/' },
        { name: 'Blog công nghệ', url: '/blog' },
    ]);

    const blogSchema = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "Blog LapLap - Laptop Cần Thơ",
        "description": "Tin tức, hướng dẫn và đánh giá laptop tại Cần Thơ",
        "url": `${SITE_URL}/blog`,
        "publisher": {
            "@type": "Organization",
            "name": "LapLap - Laptop Cần Thơ",
            "logo": {
                "@type": "ImageObject",
                "url": `${SITE_URL}/logo.png`
            }
        }
    };

    return (
        <>
            <JsonLd id="blog-schema" data={blogSchema} />
            <JsonLd id="blog-breadcrumb" data={breadcrumbs} />
            <Header />
            <BlogClient />
            <Footer />
        </>
    );
}
