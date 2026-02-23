import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomeClient from './HomeClient';
import JsonLd from '@/components/JsonLd';
import { buildOrganizationJsonLd, buildWebSiteJsonLd, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: "LapLap - Laptop Cần Thơ | Mua Bán Laptop Cũ & Mới Chính Hãng Giá Tốt",
  description: "Hệ thống bán lẻ laptop uy tín tại Cần Thơ. Chuyên laptop Dell, HP, ThinkPad, MacBook cũ và mới. Sửa chữa lấy liền, vệ sinh máy, test laptop online miễn phí.",
  keywords: ["laptop cần thơ", "laptop cũ cần thơ", "mua laptop cần thơ", "sửa laptop cần thơ", "test laptop online"],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "LapLap - Laptop Cần Thơ | Mua Bán Laptop Cũ & Mới Chính Hãng Giá Tốt",
    description: "Hệ thống bán lẻ laptop uy tín tại Cần Thơ. Chuyên laptop Dell, HP, ThinkPad, MacBook cũ và mới.",
    url: SITE_URL,
  }
};

export default function HomePage() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "LapLap - Laptop Cần Thơ",
    "description": "Chuyên mua bán laptop cũ, mới chính hãng tại Cần Thơ. Dịch vụ sửa chữa, vệ sinh laptop lấy liền uy tín.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Cần Thơ",
      "addressRegion": "Cần Thơ",
      "addressCountry": "VN",
      "streetAddress": "Ninh Kiều, Cần Thơ"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "10.0452",
      "longitude": "105.7469"
    },
    "url": SITE_URL,
    "telephone": "0978648720",
    "priceRange": "$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "08:00",
        "closes": "21:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "08:00",
        "closes": "18:00"
      }
    ]
  };

  return (
    <>
      <JsonLd id="org-jsonld" data={buildOrganizationJsonLd()} />
      <JsonLd id="web-jsonld" data={buildWebSiteJsonLd()} />
      <JsonLd id="business-jsonld" data={localBusinessSchema} />
      <Header />
      <HomeClient />
      <Footer />
    </>
  );
}