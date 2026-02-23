import "./globals.css";
import Script from "next/script";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import FacebookMessenger from "@/components/FacebookMessenger";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { buildOrganizationJsonLd, buildWebSiteJsonLd, buildSiteNavigationJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL("https://laplapcantho.store"),
  title: {
    default: "LapLap - Laptop Cần Thơ | Mua Bán Laptop Chính Hãng Giá Tốt",
    template: "%s",  // Child pages tự đặt title đầy đủ, không ghép thêm
  },
  description: "LapLap - Chuyên laptop tại Cần Thơ. Laptop mới, laptop cũ chính hãng, giá tốt nhất. Giao hàng tận nơi, bảo hành uy tín. Test laptop miễn phí online.",
  keywords: [
    "laptop cần thơ",
    "laptop cũ cần thơ",
    "mua laptop cần thơ",
    "sữa laptop cần thơ",
    "sửa laptop cần thơ",
    "laplap cần thơ",
    "laplap",
    "laptop giá rẻ cần thơ",
    "thu mua laptop cũ cần thơ",
    "cài win cần thơ",
    "vệ sinh laptop cần thơ",
    "test laptop online",
    "kiểm tra laptop cũ",
    "test camera laptop"
  ],
  authors: [{ name: "LapLap Cần Thơ" }],
  alternates: {
    canonical: 'https://laplapcantho.store',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192.png",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "LapLap - Laptop Cần Thơ",
    title: "LapLap - Laptop Cần Thơ | Mua Bán Laptop Chính Hãng Giá Tốt",
    description: "LapLap - Chuyên laptop tại Cần Thơ. Laptop mới, laptop cũ chính hãng, giá tốt nhất. Giao hàng tận nơi, bảo hành uy tín. Test laptop miễn phí online.",
    images: [
      {
        url: "https://laplapcantho.store/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LapLap - Laptop Cần Thơ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LapLap - Laptop Cần Thơ | Mua Bán Laptop Chính Hãng Giá Tốt",
    description: "LapLap - Chuyên laptop tại Cần Thơ. Laptop mới, laptop cũ chính hãng, giá tốt nhất.",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "LapLap",
    statusBarStyle: "default",
  },
};

import { Be_Vietnam_Pro } from "next/font/google";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-be-vietnam-pro",
});



import { ComparisonProvider } from "@/context/ComparisonContext";
import ComparisonBar from "@/components/ComparisonBar";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

import MobileBottomMenu from "@/components/MobileBottomMenu";
import WelcomeBanner from "@/components/WelcomeBanner";

// ... (omitted imports)

import FloatingContact from "@/components/FloatingContact";

// ... (omitted imports)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${beVietnamPro.variable} ${beVietnamPro.className} min-h-screen flex flex-col`}>
        {/* JSON-LD: Structured Data cho toàn site */}
        <JsonLd id="organization-jsonld" data={buildOrganizationJsonLd()} />
        <JsonLd id="website-jsonld" data={buildWebSiteJsonLd()} />
        <JsonLd id="navigation-jsonld" data={buildSiteNavigationJsonLd()} />

        <SessionProviderWrapper>
          <CartProvider>
            <ComparisonProvider>
              {children}
              <div className="md:hidden h-20"></div> {/* Spacer for Mobile Bottom Menu */}
              <ComparisonBar />
            </ComparisonProvider>
            <CartDrawer />
            <MobileBottomMenu />
            <WelcomeBanner />
          </CartProvider>
          <FloatingContact />
        </SessionProviderWrapper>
        <FacebookMessenger />
        <SpeedInsights />
        <Analytics />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-L4692QM7NF"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-L4692QM7NF');
          `}
        </Script>
      </body>
    </html>
  );
}
